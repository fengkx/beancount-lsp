import { Logger } from '@bean-lsp/shared';
import { $ } from 'execa';
import { trace } from 'node:console';
import { Amount, BeancountManagerFactory, RealBeancountManager } from 'src/common/features/types';
import { Connection, DidSaveTextDocumentParams } from 'vscode-languageserver';
import { URI } from 'vscode-uri';

interface AccountDetails {
	open: string;
	currencies: string[];
	close: string;
	balance: string[];
	balance_incl_subaccounts: string[];
}

class BeancountManager implements RealBeancountManager {
	private mainFile: string | null = null;
	private result_json: any | null = null;
	private readonly logger = new Logger('BeancountManager');

	constructor(private readonly connection: Connection, private readonly extensionUri: string) {
		connection.onDidSaveTextDocument(async (_params: DidSaveTextDocumentParams): Promise<void> => {
			await this.revalidateBeanCheck();
		});
	}

	async setMainFile(mainFileUri: string): Promise<void> {
		this.mainFile = URI.parse(mainFileUri).fsPath;
		await this.revalidateBeanCheck();
	}

	private async runBeanCheck(): Promise<string | null> {
		if (!this.mainFile) {
			return null;
		}

		const config = await this.connection.workspace.getConfiguration('beancount');

		let python3Path = config.python3Path || 'python3';
		if (python3Path !== 'python3' && !python3Path.startsWith('/')) {
			const workspaceFolders = await this.connection.workspace.getWorkspaceFolders();
			if (workspaceFolders && workspaceFolders.length > 0) {
				// @ts-expect-error already check length
				const workspacePath = URI.parse(workspaceFolders[0].uri).fsPath;
				python3Path = `${workspacePath}/${python3Path}`;
			}
		}

		try {
			const extensionUri = URI.parse(this.extensionUri);
			const checkScript = `${extensionUri.fsPath}/pythonFiles/beancheck.py`;
			const { stdout } = await $`${python3Path} ${checkScript} ${this.mainFile}`;
			return stdout;
		} catch (error) {
			this.logger.error('Error running bean-check:', error);
			return null;
		}
	}

	private async revalidateBeanCheck(): Promise<void> {
		this.logger.info('running beancheck');
		const r = await this.runBeanCheck();
		this.logger.info('received response for beancheck');

		if (!r) {
			return;
		}

		this.logger.debug(r);
		this.result_json = JSON.parse(r);
	}

	getBalance(account: string, includeSubaccountBalance: boolean): Amount[] {
		let accountDetails = this.result_json?.['general']?.['accounts']?.[account] as AccountDetails | null;
		if (!accountDetails) {
			return [];
		}

		const balances = includeSubaccountBalance ? accountDetails.balance_incl_subaccounts : accountDetails.balance;

		return balances.map((balance_str) => {
			const [number, currency] = balance_str.trim().split(/\s+/) as [string, string];
			return { number, currency };
		});
	}

	getSubaccountBalances(account: string): Map<string, Amount[]> {
		const accounts = this.result_json?.['general']?.['accounts'];

		const subaccounts = new Map();

		if (!accounts) {
			return subaccounts;
		}

		const prefix = account + ':';

		for (const [candidateAccount, value] of Object.entries(accounts)) {
			if (!candidateAccount.startsWith(prefix) && !(candidateAccount === account)) {
				continue;
			}

			const details = value as AccountDetails;
			const balances = details.balance.map((balance_str) => {
				const [number, currency] = balance_str.trim().split(/\s+/) as [string, string];
				return { number, currency };
			});
			subaccounts.set(candidateAccount, balances);
		}

		return subaccounts;
	}

	async getErrors(): Promise<{ message: string; file: string; line: number }[]> {
		return this.result_json?.['errors'] ?? [];
	}
}

export const beananagerFactory: BeancountManagerFactory = (connection: Connection, extensionPath: string) =>
	new BeancountManager(connection, extensionPath);
