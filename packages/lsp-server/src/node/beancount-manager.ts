import { Logger } from '@bean-lsp/shared';
import { $ } from 'execa';
import { trace } from 'node:console';
import { BeancountManagerFactory, RealBeancountManager } from 'src/common/features/types';
import { Connection, DidSaveTextDocumentParams } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
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

	async getBalance(account: string): Promise<string[]> {
		return this.result_json?.['general']?.['accounts']?.[account]?.['balance'] ?? [];
	}

	async getErrors(): Promise<{ message: string; file: string; line: number }[]> {
		return this.result_json?.['errors'] ?? [];
	}
}

export const beananagerFactory: BeancountManagerFactory = (connection: Connection, extensionPath: string) =>
	new BeancountManager(connection, extensionPath);
