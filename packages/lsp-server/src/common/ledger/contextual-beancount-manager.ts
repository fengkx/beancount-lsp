import type { BeancountRuntimeStatusParams } from '@bean-lsp/shared';
import type { Connection } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import type { DocumentStore } from '../document-store';
import type {
	Amount,
	BeancountError,
	BeancountFlag,
	BeancountManagerFactory,
	PreciseIncompletePostingHintParams,
	RealBeancountManager,
	RuntimeEvaluationState,
} from '../features/types';
import { LedgerContextRegistry } from './context-registry';
import type { SnapshotResult } from './snapshots';

const EMPTY_STATE: RuntimeEvaluationState = {
	sourceRevision: 0,
	diagnosticsRevision: null,
	diagnosticsStatus: 'failed',
	derivedRevision: null,
	inputMode: 'saved-files',
};

export class ContextualBeancountManager implements RealBeancountManager {
	private readonly managers = new Map<string, RealBeancountManager>();

	constructor(
		private readonly connection: Connection,
		private readonly documents: DocumentStore,
		private readonly contexts: LedgerContextRegistry,
		private readonly factory: BeancountManagerFactory,
	) {}

	isEnabled(scopeUri?: string): boolean {
		if (!scopeUri) return [...this.managers.values()].some(manager => manager.isEnabled());
		return this.resolve(scopeUri)?.isEnabled(scopeUri) ?? false;
	}

	canResolvePreciseIncompletePostingHint(scopeUri?: string): boolean {
		return this.resolve(scopeUri)?.canResolvePreciseIncompletePostingHint(scopeUri) ?? false;
	}

	getRuntimeStatus(scopeUri?: string): BeancountRuntimeStatusParams {
		return this.resolve(scopeUri)?.getRuntimeStatus(scopeUri) ?? { mode: 'off' };
	}

	getEvaluationState(scopeUri?: string): RuntimeEvaluationState {
		return this.resolve(scopeUri)?.getEvaluationState(scopeUri) ?? EMPTY_STATE;
	}

	requestEvaluation(scopeUri?: string): void {
		this.resolve(scopeUri)?.requestEvaluation(scopeUri);
	}

	getBalance(account: string, includeSubaccountBalance: boolean, scopeUri?: string): Amount[] {
		return this.resolve(scopeUri)?.getBalance(account, includeSubaccountBalance, scopeUri) ?? [];
	}

	getBalanceSnapshot(
		account: string,
		includeSubaccountBalance: boolean,
		scopeUri?: string,
	): SnapshotResult<Amount[]> {
		return this.resolve(scopeUri)?.getBalanceSnapshot(account, includeSubaccountBalance, scopeUri) ?? {
			value: [],
			sourceRevision: 0,
			freshness: 'stale',
			inputMode: 'saved-files',
		};
	}

	getSubaccountBalances(account: string, scopeUri?: string): Map<string, Amount[]> {
		return this.resolve(scopeUri)?.getSubaccountBalances(account, scopeUri) ?? new Map();
	}

	getPadAmounts(filePath: string, line: number, scopeUri?: string): Amount[] | null {
		return this.resolve(scopeUri ?? URI.file(filePath).toString())?.getPadAmounts(filePath, line, scopeUri) ?? null;
	}

	getPadAmountsSnapshot(filePath: string, line: number, scopeUri?: string): SnapshotResult<Amount[] | null> {
		return this.resolve(scopeUri ?? URI.file(filePath).toString())?.getPadAmountsSnapshot(filePath, line, scopeUri)
			?? {
				value: null,
				sourceRevision: 0,
				freshness: 'stale',
				inputMode: 'saved-files',
			};
	}

	getErrors(scopeUri?: string): BeancountError[] {
		if (scopeUri) return this.resolve(scopeUri)?.getErrors(scopeUri) ?? [];
		return [...this.managers.values()].flatMap(manager => manager.getErrors());
	}

	getFlagged(scopeUri?: string): BeancountFlag[] {
		if (scopeUri) return this.resolve(scopeUri)?.getFlagged(scopeUri) ?? [];
		return [...this.managers.values()].flatMap(manager => manager.getFlagged());
	}

	async setMainFile(mainFile: string): Promise<void> {
		this.reconcileContexts();
		const context = this.contexts.forDocument(mainFile);
		if (!context) return;
		let manager = this.managers.get(context.id);
		if (!manager) {
			manager = this.factory(this.connection, this.documents);
			this.managers.set(context.id, manager);
		}
		await manager.setMainFile(mainFile);
	}

	reconcileContexts(): void {
		const activeIds = new Set(this.contexts.all.map(context => context.id));
		for (const [contextId, manager] of this.managers) {
			if (activeIds.has(contextId)) continue;
			manager.dispose?.();
			this.managers.delete(contextId);
		}
	}

	getPreciseIncompletePostingHint(params: PreciseIncompletePostingHintParams): Promise<Amount | null> {
		return this.resolve(params.targetUri)?.getPreciseIncompletePostingHint(params) ?? Promise.resolve(null);
	}

	runQuery(query: string, scopeUri?: string): Promise<string> {
		const manager = this.resolve(scopeUri);
		if (!manager) {
			return Promise.reject(
				new Error(scopeUri ? 'No ledger context for query scope.' : 'Query scope is ambiguous.'),
			);
		}
		return manager.runQuery(query, scopeUri);
	}

	private resolve(scopeUri?: string): RealBeancountManager | undefined {
		if (scopeUri) {
			const context = this.contexts.forDocument(scopeUri);
			if (context) return this.managers.get(context.id);

			// A ledger may include files outside its workspace (or expose them through a
			// symlink URI). With only one ledger there is no ambiguity, so preserve the
			// single-ledger behavior instead of silently dropping runtime-backed data.
			if (this.managers.size === 1) return this.managers.values().next().value;
			return undefined;
		}
		return this.managers.size === 1 ? this.managers.values().next().value : undefined;
	}

	dispose(): void {
		for (const manager of this.managers.values()) manager.dispose?.();
		this.managers.clear();
	}
}
