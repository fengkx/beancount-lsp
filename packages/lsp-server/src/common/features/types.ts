import { Connection } from 'vscode-languageserver';

export interface Feature {
	register(connection: Connection): unknown;
}

export interface Amount {
	number: string;
	currency: string;
}

/**
 * Get information from the REAL beancount executable. Only available in the node extension.
 */
export interface RealBeancountManager {
	getBalance(account: string, includeSubaccountBalance: boolean): Amount[];
	getSubaccountBalances(account: string): Map<string, Amount[]>;
	setMainFile(mainFile: string): Promise<void>;
}

export type BeancountManagerFactory = (connection: Connection, extensionUri: string) => RealBeancountManager;
