import type { BeancountRuntimeStatusParams } from '@bean-lsp/shared';
import { Connection } from 'vscode-languageserver';
import { DocumentStore } from '../document-store';
import type { RuntimeInputMode, SnapshotResult, SourceRevision } from '../ledger/snapshots';

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

export interface RuntimeEvaluationState {
	sourceRevision: SourceRevision;
	diagnosticsRevision: SourceRevision | null;
	diagnosticsStatus: 'fresh' | 'pending' | 'failed';
	derivedRevision: SourceRevision | null;
	inputMode: RuntimeInputMode;
}

/**
 * Get information from the REAL beancount executable. Only available in the node extension.
 */
export interface RealBeancountManager {
	isEnabled(scopeUri?: string): boolean;
	canResolvePreciseIncompletePostingHint(scopeUri?: string): boolean;
	getRuntimeStatus(scopeUri?: string): BeancountRuntimeStatusParams;
	getEvaluationState(scopeUri?: string): RuntimeEvaluationState;
	requestEvaluation(scopeUri?: string): void;
	getBalance(account: string, includeSubaccountBalance: boolean, scopeUri?: string): Amount[];
	getBalanceSnapshot(account: string, includeSubaccountBalance: boolean, scopeUri?: string): SnapshotResult<Amount[]>;
	getSubaccountBalances(account: string, scopeUri?: string): Map<string, Amount[]>;
	getPadAmounts(filePath: string, line: number, scopeUri?: string): Amount[] | null;
	getPadAmountsSnapshot(filePath: string, line: number, scopeUri?: string): SnapshotResult<Amount[] | null>;
	getErrors(scopeUri?: string): BeancountError[];
	getFlagged(scopeUri?: string): BeancountFlag[];
	setMainFile(mainFile: string): Promise<void>;
	getPreciseIncompletePostingHint(params: PreciseIncompletePostingHintParams): Promise<Amount | null>;
	runQuery(query: string, scopeUri?: string): Promise<string>;
	dispose?: () => void;
}

export type BeancountManagerFactory = (connection: Connection, documents: DocumentStore) => RealBeancountManager;

export interface PlatformMethods {
	findBeanFiles: () => Promise<string[]>;
	readFile: (uri: string) => Promise<string>;
}
