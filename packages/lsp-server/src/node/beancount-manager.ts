import { Logger } from '@bean-lsp/shared';
import { $, execa } from 'execa';
import { Connection, DidSaveTextDocumentParams } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import {
	Amount,
	BeancountError,
	BeancountFlag,
	BeancountManagerFactory,
	RealBeancountManager,
} from '../common/features/types';
import { globalEventBus, GlobalEvents } from '../common/utils/event-bus';
import beanCheckPythonCode from './beancheck.py';

interface AccountDetails {
	open: string;
	currencies: string[];
	close: string;
	balance: string[];
	balance_incl_subaccounts: string[];
}

interface BeancheckOutput {
	errors: BeancountError[];
	flags: BeancountFlag[];
	general?: {
		accounts: Record<string, AccountDetails>;
		commodities: string[];
		payees: string[];
		narrations: string[];
		tags: string[];
		links: string[];
	};
}

class BeancountManager implements RealBeancountManager {
	private mainFile: string | null = null;
	private result: BeancheckOutput | null = null;
	private logger = new Logger('BeancountManager');

	constructor(private connection: Connection) {
		connection.onDidSaveTextDocument(this.onDocumentSaved.bind(this));
	}

	async setMainFile(mainFileUri: string): Promise<void> {
		this.mainFile = URI.parse(mainFileUri).fsPath;
		await this.revalidateBeanCheck();
	}

	async getPython3Path(): Promise<string> {
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

		return python3Path;
	}

	private async runBeanCheck(): Promise<string | null> {
		if (!this.mainFile) {
			return null;
		}

		const python3Path = await this.getPython3Path();

		try {
			const { stdout } = await $`${python3Path} -c ${beanCheckPythonCode} ${this.mainFile}`;
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
		this.result = JSON.parse(r) as BeancheckOutput;
		globalEventBus.emit(GlobalEvents.BeancountUpdate);
	}

	private onDocumentSaved(params: DidSaveTextDocumentParams): void {
		if (!this.mainFile) {
			return;
		}
		// Only check bean files
		if (!params.textDocument.uri.endsWith('.bean') && !params.textDocument.uri.endsWith('.beancount')) {
			return;
		}

		this.revalidateBeanCheck();
	}

	getBalance(account: string, includeSubaccountBalance: boolean): Amount[] {
		let accountDetails = this.result?.general?.accounts?.[account] as AccountDetails | null;
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
		const accounts = this.result?.general?.accounts;

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

	getErrors(): BeancountError[] {
		return this.result?.errors ?? [];
	}

	getFlagged(): BeancountFlag[] {
		return this.result?.flags ?? [];
	}

	async runQuery(query: string): Promise<string> {
		if (!this.mainFile) {
			throw new Error('No main file set. Please set a main Beancount file first.');
		}

		const python3Path = await this.getPython3Path();
		const { stdout: prefix } = await $`${python3Path} -c ${'import sys; print(sys.prefix)'}`;

		this.logger.info(`Running bean-query: ${query}`);

		const { stdout } = await execa({
			extendEnv: true,
			env: {
				PATH: `${prefix}/bin` + ':' + process.env['PATH'],
			},
		})`bean-query ${this.mainFile} ${query}`;
		return stdout;
	}
}

export const beananagerFactory: BeancountManagerFactory = (connection: Connection) => new BeancountManager(connection);
