import { Connection } from 'vscode-languageserver';

export interface Feature {
	register(connection: Connection): unknown;
}

export interface Amount {
	number: string;
	currency: string;
}

export interface BeancountError {
	file: string;
	line: number;
	message: string;
}

export interface BeancountFlag {
	file: string;
	line: number;
	message: string;
	flag: string;
}

/**
 * Get information from the REAL beancount executable. Only available in the node extension.
 */
export interface RealBeancountManager {
	getBalance(account: string, includeSubaccountBalance: boolean): Amount[];
	getSubaccountBalances(account: string): Map<string, Amount[]>;
	getErrors(): BeancountError[];
	getFlagged(): BeancountFlag[];
	setMainFile(mainFile: string): Promise<void>;
}

export type BeancountManagerFactory = (connection: Connection, extensionUri: string) => RealBeancountManager;
