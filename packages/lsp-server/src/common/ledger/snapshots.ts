import type { CancellationToken } from 'vscode-languageserver';
import type { Amount, BeancountError, BeancountFlag } from '../features/types';

export type LedgerContextId = string;
export type SourceRevision = number;
export type EvaluationMode = 'diagnostics' | 'full';
export type EvaluationConsistency = 'allow-stale' | 'fresh-only';
export type EvaluationFreshness = 'fresh' | 'stale';
export type RuntimeInputMode = 'live-buffers' | 'saved-files';

export interface SourceFileSnapshot {
	uri: string;
	text: string;
	documentVersion?: number;
	origin: 'open-buffer' | 'disk';
}

export interface IncludeGraph {
	edges: ReadonlyMap<string, ReadonlySet<string>>;
	unresolved: ReadonlyMap<string, readonly string[]>;
}

export interface SourceSnapshot {
	contextId: LedgerContextId;
	workspaceUri: string;
	mainFileUri: string;
	revision: SourceRevision;
	files: ReadonlyMap<string, SourceFileSnapshot>;
	reachableUris: ReadonlySet<string>;
	includeGraph: IncludeGraph;
}

export interface SourceSnapshotChange {
	contextId: LedgerContextId;
	revision: SourceRevision;
	updates: readonly SourceFileSnapshot[];
	removed: readonly string[];
}

export interface SnapshotResult<T> {
	value: T;
	sourceRevision: SourceRevision;
	freshness: EvaluationFreshness;
	inputMode: RuntimeInputMode;
}

export interface RuntimeDescriptor {
	mode: 'local' | 'wasm';
	version?: 'v2' | 'v3';
	inputMode: RuntimeInputMode;
}

export interface AccountEvaluationState {
	open: string;
	currencies: string[];
	close: string;
	balance: string[];
	balance_incl_subaccounts: string[];
}

export interface EvaluationData {
	errors: BeancountError[];
	flags: BeancountFlag[];
	pads?: Record<string, Record<string, Amount[]>>;
	general?: {
		accounts: Record<string, AccountEvaluationState>;
		commodities: string[];
		payees: string[];
		narrations: string[];
		tags: string[];
		links: string[];
	};
}

export interface EvaluationSnapshot extends EvaluationData {
	contextId: LedgerContextId;
	sourceRevision: SourceRevision;
	runtime: RuntimeDescriptor;
	state: 'fresh' | 'stale' | 'building' | 'failed';
}

export interface LedgerRuntimeAdapter {
	readonly capabilities: {
		supportsLiveBuffers: boolean;
		supportsDiagnosticsMode: boolean;
		supportsFullMode: boolean;
	};
	readonly runtime: RuntimeDescriptor;
	reset(snapshot: SourceSnapshot): Promise<void>;
	sync(change: SourceSnapshotChange): Promise<void>;
	evaluate(
		snapshot: SourceSnapshot,
		mode: EvaluationMode,
		token: CancellationToken,
	): Promise<EvaluationData>;
	disposeContext(contextId: LedgerContextId): Promise<void>;
}

export function createLedgerContextId(workspaceUri: string, mainFileUri: string): LedgerContextId {
	return `${workspaceUri}::${mainFileUri}`;
}
