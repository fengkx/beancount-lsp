import { Connection } from 'vscode-languageserver';

export interface Feature {
	register(connection: Connection): unknown;
}

/**
 * Get information from the REAL beancount executable. Only available in the node extension.
 */
export interface RealBeancountManager {
	getBalance(account: string): Promise<string[]>;
	setMainFile(mainFile: string): void;
}

export type BeancountManagerFactory = (connection: Connection, extensionUri: string) => RealBeancountManager;
