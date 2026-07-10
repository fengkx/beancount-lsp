import { Logger } from '@bean-lsp/shared';
import { CancellationTokenSource, Emitter, Event } from 'vscode-languageserver';
import { EvaluationData, EvaluationMode, EvaluationSnapshot, LedgerRuntimeAdapter, SourceRevision } from './snapshots';
import { SourceSnapshotService } from './source-snapshot-service';

export interface EvaluationCoordinatorOptions {
	diagnosticsDebounceMs?: number;
	fullDebounceMs?: number;
}

export class LedgerEvaluationCoordinator {
	private readonly logger = new Logger('LedgerEvaluationCoordinator');
	private diagnostics?: EvaluationSnapshot;
	private derived?: EvaluationSnapshot;
	private staleDerived?: EvaluationSnapshot;
	private diagnosticsTimer?: ReturnType<typeof setTimeout>;
	private fullTimer?: ReturnType<typeof setTimeout>;
	private diagnosticsToken?: CancellationTokenSource;
	private fullToken?: CancellationTokenSource;
	private diagnosticsRunning?: Promise<void>;
	private fullRunning?: Promise<void>;
	private queuedDiagnosticsRevision?: SourceRevision;
	private queuedFullRevision?: SourceRevision;
	private disposed = false;
	private readonly sourceSubscription: { dispose(): void };
	private recoveryPromise?: Promise<void>;
	private readonly failedAttempts = new Set<string>();
	private readonly onDidUpdateEmitter = new Emitter<EvaluationSnapshot>();
	readonly onDidUpdate: Event<EvaluationSnapshot> = this.onDidUpdateEmitter.event;

	constructor(
		private readonly sources: SourceSnapshotService,
		private readonly adapter: LedgerRuntimeAdapter,
		private readonly options: EvaluationCoordinatorOptions = {},
	) {
		this.sourceSubscription = sources.onDidChange(change => {
			void this.handleSourceChange(change.revision, change);
		});
	}

	get currentRevision(): SourceRevision {
		return this.sources.snapshot.revision;
	}

	get diagnosticsSnapshot(): EvaluationSnapshot | undefined {
		return this.diagnostics;
	}

	get derivedSnapshot(): EvaluationSnapshot | undefined {
		return this.derived ?? this.staleDerived;
	}

	isFresh(mode: EvaluationMode = 'full'): boolean {
		const snapshot = mode === 'diagnostics' ? this.diagnostics : this.derived;
		return snapshot?.state === 'fresh' && snapshot.sourceRevision === this.currentRevision;
	}

	async initialize(): Promise<void> {
		await this.adapter.reset(this.sources.snapshot);
		await Promise.all([
			this.request('diagnostics', true),
			this.request('full', true),
		]);
	}

	async request(mode: EvaluationMode, immediate = false): Promise<void> {
		if (this.disposed) return;
		const revision = this.currentRevision;
		if (mode === 'diagnostics') {
			this.queuedDiagnosticsRevision = Math.max(this.queuedDiagnosticsRevision ?? 0, revision);
			if (this.diagnosticsTimer) clearTimeout(this.diagnosticsTimer);
			if (immediate) return this.startDiagnosticsQueue();
			this.diagnosticsTimer = setTimeout(() => {
				this.diagnosticsTimer = undefined;
				void this.startDiagnosticsQueue();
			}, this.options.diagnosticsDebounceMs ?? 250);
			return;
		}
		this.queuedFullRevision = Math.max(this.queuedFullRevision ?? 0, revision);
		if (this.fullTimer) clearTimeout(this.fullTimer);
		if (immediate) return this.startFullQueue();
		this.fullTimer = setTimeout(() => {
			this.fullTimer = undefined;
			void this.startFullQueue();
		}, this.options.fullDebounceMs ?? 1200);
	}

	private async handleSourceChange(
		revision: SourceRevision,
		change: Parameters<LedgerRuntimeAdapter['sync']>[0],
	): Promise<void> {
		this.diagnostics = undefined;
		if (this.derived) {
			this.staleDerived = { ...this.derived, state: 'stale' };
			this.derived = undefined;
		}
		this.diagnosticsToken?.cancel();
		this.fullToken?.cancel();
		try {
			await this.adapter.sync(change);
		} catch (error) {
			this.logger.error(`runtime sync failed context=${change.contextId} revision=${revision}: ${String(error)}`);
			try {
				await this.recoverRuntime();
			} catch (recoveryError) {
				this.logger.error(
					`runtime recovery failed context=${change.contextId} revision=${revision}: ${String(recoveryError)}`,
				);
				return;
			}
		}
		await Promise.all([this.request('diagnostics'), this.request('full')]);
	}

	private async startDiagnosticsQueue(): Promise<void> {
		if (this.diagnosticsRunning) return this.diagnosticsRunning;
		this.diagnosticsRunning = (async () => {
			do await this.processQueue('diagnostics');
			while (this.queuedDiagnosticsRevision !== undefined);
		})().finally(() => {
			this.diagnosticsRunning = undefined;
		});
		return this.diagnosticsRunning;
	}

	private async startFullQueue(): Promise<void> {
		if (this.fullRunning) return this.fullRunning;
		this.fullRunning = (async () => {
			do await this.processQueue('full');
			while (this.queuedFullRevision !== undefined);
		})().finally(() => {
			this.fullRunning = undefined;
		});
		return this.fullRunning;
	}

	private async processQueue(mode: EvaluationMode): Promise<void> {
		const revision = mode === 'diagnostics'
			? this.queuedDiagnosticsRevision
			: this.queuedFullRevision;
		if (revision === undefined) return;
		if (mode === 'diagnostics') this.queuedDiagnosticsRevision = undefined;
		else this.queuedFullRevision = undefined;

		const source = new CancellationTokenSource();
		if (mode === 'diagnostics') {
			this.diagnosticsToken?.cancel();
			this.diagnosticsToken?.dispose();
			this.diagnosticsToken = source;
		} else {
			this.fullToken?.cancel();
			this.fullToken?.dispose();
			this.fullToken = source;
		}
		const snapshot = this.sources.snapshot;
		if (snapshot.revision !== revision) {
			if (mode === 'diagnostics') this.queuedDiagnosticsRevision = snapshot.revision;
			else this.queuedFullRevision = snapshot.revision;
			return;
		}
		const startedAt = Date.now();
		try {
			const data = await this.adapter.evaluate(snapshot, mode, source.token);
			if (source.token.isCancellationRequested || this.currentRevision !== revision) return;
			this.applyResult(mode, revision, data);
			this.logger.info(
				`evaluated context=${snapshot.contextId} revision=${revision} mode=${mode} input=${this.adapter.runtime.inputMode} durationMs=${
					Date.now() - startedAt
				}`,
			);
		} catch (error) {
			if (!source.token.isCancellationRequested) {
				this.logger.error(
					`evaluation failed context=${snapshot.contextId} revision=${revision} mode=${mode}: ${
						String(error)
					}`,
				);
				const attemptKey = `${revision}:${mode}`;
				if (!this.failedAttempts.has(attemptKey) && this.currentRevision === revision) {
					this.failedAttempts.add(attemptKey);
					try {
						await this.recoverRuntime();
						if (mode === 'diagnostics') this.queuedDiagnosticsRevision = revision;
						else this.queuedFullRevision = revision;
					} catch (recoveryError) {
						this.logger.error(
							`runtime recovery failed context=${snapshot.contextId} revision=${revision}: ${String(recoveryError)}`,
						);
					}
				}
			}
		} finally {
			source.dispose();
			if (mode === 'diagnostics' && this.diagnosticsToken === source) this.diagnosticsToken = undefined;
			if (mode === 'full' && this.fullToken === source) this.fullToken = undefined;
		}
	}

	private applyResult(mode: EvaluationMode, revision: SourceRevision, data: EvaluationData): void {
		this.failedAttempts.delete(`${revision}:${mode}`);
		const snapshot: EvaluationSnapshot = {
			...data,
			contextId: this.sources.snapshot.contextId,
			sourceRevision: revision,
			runtime: this.adapter.runtime,
			state: 'fresh',
		};
		if (mode === 'diagnostics') {
			this.diagnostics = snapshot;
		} else {
			this.derived = snapshot;
			this.staleDerived = undefined;
		}
		this.onDidUpdateEmitter.fire(snapshot);
	}

	private async recoverRuntime(): Promise<void> {
		if (!this.recoveryPromise) {
			this.recoveryPromise = this.adapter.reset(this.sources.snapshot).finally(() => {
				this.recoveryPromise = undefined;
			});
		}
		await this.recoveryPromise;
	}

	async dispose(): Promise<void> {
		this.disposed = true;
		this.sourceSubscription.dispose();
		if (this.diagnosticsTimer) clearTimeout(this.diagnosticsTimer);
		if (this.fullTimer) clearTimeout(this.fullTimer);
		this.diagnosticsToken?.cancel();
		this.fullToken?.cancel();
		await this.adapter.disposeContext(this.sources.snapshot.contextId);
		this.onDidUpdateEmitter.dispose();
	}
}
