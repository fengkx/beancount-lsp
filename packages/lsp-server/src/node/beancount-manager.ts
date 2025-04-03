import { $ } from 'execa';
import { BeancountManagerFactory, RealBeancountManager } from 'src/common/features/types';
import { Connection } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
class BeancountManager implements RealBeancountManager {
	private mainFile: string | null = null;

	constructor(private readonly connection: Connection, private readonly extensionUri: string) {}

	setMainFile(mainFileUri: string) {
		this.mainFile = URI.parse(mainFileUri).fsPath;
	}

	private async runBeanCheck(output: 'default' | 'errors' | 'flags'): Promise<string | null> {
		if (!this.mainFile) {
			return null;
		}

		const config = await this.connection.workspace.getConfiguration('beancount');
		const python3Path = config.python3Path || 'python3';

		try {
			const extensionUri = URI.parse(this.extensionUri);
			const checkScript = `${extensionUri.fsPath}/pythonFiles/beancheck.py --output ${output}`;
			const { stdout } = await $`${python3Path} ${checkScript} ${this.mainFile}`;
			return stdout;
		} catch (error) {
			console.error('Error running bean-check:', error);
			return null;
		}
	}

	async getBalance(account: string): Promise<string[]> {
		const r = await this.runBeanCheck();
		if (!r) {
			return [];
		}
		const data = JSON.parse(r);
		return data?.['accounts']?.[account]?.['balance'] ?? [];
	}

	async getErrors(): Promise<{ message: string; file: string; line: number }[]> {
		const r = await this.runBeanCheck('errors');
		if (!r) {
			return [];
		}
		const data = JSON.parse(r);
		return data?.['errors'] ?? [];
	}
}

export const beananagerFactory: BeancountManagerFactory = (connection: Connection, extensionPath: string) =>
	new BeancountManager(connection, extensionPath);
