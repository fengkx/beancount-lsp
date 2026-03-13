import type { BeancountRuntimeStatusParams } from '@bean-lsp/shared';
import { Connection } from 'vscode-languageserver';
import { DocumentStore } from '../document-store';

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

export interface PreciseIncompletePostingHintParams {
	targetUri: string;
	transactionStartLine: number;
	postingStartLine: number;
	account: string;
}

/**
 * Get information from the REAL beancount executable. Only available in the node extension.
 */
export interface RealBeancountManager {
	isEnabled(): boolean;
	canResolvePreciseIncompletePostingHint(): boolean;
	getRuntimeStatus(): BeancountRuntimeStatusParams;
	getBalance(account: string, includeSubaccountBalance: boolean): Amount[];
	getSubaccountBalances(account: string): Map<string, Amount[]>;
	getPadAmounts(filePath: string, line: number): Amount[] | null;
	getErrors(): BeancountError[];
	getFlagged(): BeancountFlag[];
	setMainFile(mainFile: string): Promise<void>;
	getPreciseIncompletePostingHint(params: PreciseIncompletePostingHintParams): Promise<Amount | null>;
	runQuery(query: string): Promise<string>;
	dispose?: () => void;
}

export type BeancountManagerFactory = (connection: Connection, documents: DocumentStore) => RealBeancountManager;

export interface PlatformMethods {
	findBeanFiles: () => Promise<string[]>;
	readFile: (uri: string) => Promise<string>;
}
