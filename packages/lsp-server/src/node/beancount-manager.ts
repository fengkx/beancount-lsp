import { Logger } from '@bean-lsp/shared';
import type { BeancountRuntimeStatusParams } from '@bean-lsp/shared';
import { $, execa } from 'execa';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { basename, isAbsolute, normalize, resolve } from 'path';
import {
	CancellationToken,
	CancellationTokenSource,
	Connection,
	DidSaveTextDocumentParams,
	FileChangeType,
} from 'vscode-languageserver';
import {
	createMessageConnection,
	MessageConnection,
	StreamMessageReader,
	StreamMessageWriter,
} from 'vscode-languageserver/node';
import { URI, Utils as UriUtils } from 'vscode-uri';
import { DocumentStore } from '../common/document-store';
import {
	Amount,
	BeancountError,
	BeancountFlag,
	BeancountManagerFactory,
	PreciseIncompletePostingHintParams,
	RealBeancountManager,
	RuntimeEvaluationState,
} from '../common/features/types';
import type { SourceSnapshot } from '../common/ledger/snapshots';
import { SourceSnapshotService } from '../common/ledger/source-snapshot-service';
import { globalEventBus, GlobalEvents, LedgerContextEvent } from '../common/utils/event-bus';
import { expandPythonPath } from './python-path';
import { ShadowWorkspace } from './shadow-workspace';

// eslint-disable-next-line import-x/no-relative-packages
import beanCheckPythonCode from './beancheck.py';

interface AccountDetails {
	open: string;
	currencies: string[];
	close: string;
	balance: string[];
	balance_incl_subaccounts: string[];
}

interface BeancheckOutput {
	errors: BeancountError[];
	flags: BeancountFlag[];
	pads?: Record<string, Record<string, Amount[]>>;
	general?: {
		accounts: Record<string, AccountDetails>;
		commodities: string[];
		payees: string[];
		narrations: string[];
		tags: string[];
		links: string[];
	};
}

interface PreciseIncompletePostingHintResult {
	number: string;
	currency: string;
}

function asError(error: unknown): Error {
	return error instanceof Error ? error : new Error(String(error));
}

function createCancellationError(): Error {
	const error = new Error('beancheck request cancelled');
	error.name = 'CancellationError';
	return error;
}

class BeancheckRpcClient {
	private process: ChildProcessWithoutNullStreams | null = null;
	private rpcConnection: MessageConnection | null = null;
	private startPromise: Promise<void> | null = null;
	private disposed = false;

	constructor(
		private readonly python3Path: string,
		private readonly workspaceRoot: string | undefined,
		private readonly logger: Logger,
	) {}

	async runBeancheck(
		filePath: string,
		mode: 'diagnostics' | 'full',
		token: CancellationToken,
	): Promise<BeancheckOutput> {
		await this.ensureProcess();
		if (token.isCancellationRequested) {
			throw createCancellationError();
		}
		return this.sendRequest<BeancheckOutput>('beancheck/run', {
			file: filePath,
			mode,
		}, token);
	}

	async interpolateIncompletePosting(
		filePath: string,
		params: {
			targetFile: string;
			transactionLine: number;
			postingLine: number;
			account: string;
		},
		token: CancellationToken,
	): Promise<PreciseIncompletePostingHintResult | null> {
		await this.ensureProcess();
		if (token.isCancellationRequested) {
			throw createCancellationError();
		}
		return this.sendRequest<PreciseIncompletePostingHintResult | null>(
			'beancheck/interpolateIncompletePosting',
			{
				file: filePath,
				targetFile: params.targetFile,
				transactionLine: params.transactionLine,
				postingLine: params.postingLine,
				account: params.account,
			},
			token,
		);
	}

	dispose(): void {
		if (this.disposed) {
			return;
		}
		this.disposed = true;
		this.rpcConnection?.dispose();
		this.rpcConnection = null;
		const process = this.process;
		this.process = null;
		if (process && process.exitCode === null && !process.killed) {
			process.kill();
		}
	}

	private async ensureProcess(): Promise<void> {
		if (this.disposed) {
			throw new Error('beancheck rpc client disposed');
		}
		if (
			this.process
			&& this.process.exitCode === null
			&& !this.process.killed
			&& this.rpcConnection
		) {
			return;
		}
		if (!this.startPromise) {
			this.startPromise = this.startProcess()
				.finally(() => {
					this.startPromise = null;
				});
		}
		await this.startPromise;
	}

	private async startProcess(): Promise<void> {
		const child = spawn(
			this.python3Path,
			['-u', '-c', beanCheckPythonCode, '--rpc-stdio'],
			{ stdio: ['pipe', 'pipe', 'pipe'], cwd: this.workspaceRoot },
		);
		this.process = child;
		const messageReader = new StreamMessageReader(child.stdout);
		const messageWriter = new StreamMessageWriter(child.stdin);
		const rpcConnection = createMessageConnection(messageReader, messageWriter);
		this.rpcConnection = rpcConnection;
		rpcConnection.listen();
		rpcConnection.onError(([error, message, count]) => {
			this.logger.error(
				`beancheck rpc protocol error: ${error.message}; message=${message}; count=${count}`,
			);
		});
		rpcConnection.onClose(() => {
			if (this.rpcConnection === rpcConnection) {
				this.rpcConnection = null;
			}
		});

		child.stderr.on('data', chunk => {
			const text = chunk.toString().trim();
			if (text.length > 0) {
				this.logger.warn(`[beancheck-rpc stderr] ${text}`);
			}
		});

		child.on('error', error => {
			const err = asError(error);
			this.logger.error(`beancheck rpc process error: ${err.message}`);
			if (this.process === child) {
				this.process = null;
			}
			if (this.rpcConnection === rpcConnection) {
				this.rpcConnection = null;
			}
		});

		child.on('exit', (code, signal) => {
			if (!this.disposed && (code !== 0 || signal !== null)) {
				this.logger.warn(
					`beancheck rpc process exited unexpectedly (code=${String(code)}, signal=${String(signal)})`,
				);
			}
			if (this.process === child) {
				this.process = null;
			}
			if (this.rpcConnection === rpcConnection) {
				this.rpcConnection = null;
			}
		});
	}

	private async sendRequest<T>(
		method: string,
		params: Record<string, unknown>,
		token: CancellationToken,
	): Promise<T> {
		const connection = this.rpcConnection;
		if (!connection) {
			throw new Error('beancheck rpc connection is not ready');
		}
		try {
			return await connection.sendRequest(method, params, token) as T;
		} catch (error) {
			const err = asError(error) as Error & { code?: number };
			if (err.code === -32800) {
				err.name = 'CancellationError';
			}
			throw err;
		}
	}
}

class BeancountManager implements RealBeancountManager {
	private mainFile: string | null = null;
	private result: BeancheckOutput | null = null;
	private diagnosticsResult: Pick<BeancheckOutput, 'errors' | 'flags'> | null = null;
	/** Stale result kept for SWR: non-diagnostic data (balances, pads) served from here while revalidating */
	private staleResult: BeancheckOutput | null = null;
	private padFileCache = new Map<string, Record<string, Amount[]> | null>();
	private logger = new Logger('BeancountManager');
	private inputGeneration = 0;
	private queuedBeancheckGeneration = 0;
	private appliedBeancheckGeneration = 0;
	private appliedDiagnosticsGeneration = 0;
	private diagnosticsStatus: RuntimeEvaluationState['diagnosticsStatus'] = 'pending';
	private hasPendingBeancheckRun = false;
	private beancheckQueuePromise: Promise<void> | null = null;
	private activeBeancheckTokenSource: CancellationTokenSource | null = null;
	private activeBeancheckRunGeneration = 0;
	private beancheckRpcClient: BeancheckRpcClient | null = null;
	private beancheckRpcPythonPath: string | null = null;
	private beancheckRpcWorkspaceRoot: string | null = null;
	private sourceService: SourceSnapshotService | null = null;
	private sourceSubscription: { dispose(): void } | null = null;
	private readonly shadowWorkspace = new ShadowWorkspace();
	private shadowSyncPromise: Promise<void> = Promise.resolve();
	private liveBuffersEnabled = true;
	private workspaceUri: string | null = null;
	private hasWarnedLiveBufferFallback = false;
	private hasUnsavedSavedFileInput = false;
	private beancheckDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	private diagnosticsDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	private queuedDiagnosticsGeneration = 0;
	private hasPendingDiagnosticsRun = false;
	private diagnosticsQueuePromise: Promise<void> | null = null;
	private activeDiagnosticsTokenSource: CancellationTokenSource | null = null;
	private activeDiagnosticsRunGeneration = 0;
	private recoveryTimer: ReturnType<typeof setTimeout> | null = null;
	private lastRecoveryGeneration = -1;
	private readonly subscriptions: Array<{ dispose(): void }> = [];

	constructor(private connection: Connection, private readonly documents: DocumentStore) {
		this.subscriptions.push(connection.onDidSaveTextDocument(this.onDocumentSaved.bind(this)));
		this.subscriptions.push(documents.onDidChangeContent2(event => {
			if (!this.workspaceUri || !event.document.uri.startsWith(this.workspaceUri)) {
				if (
					this.sourceService && this.isReferencedExternalUri(event.document.uri, this.sourceService.snapshot)
				) {
					this.hasUnsavedSavedFileInput = true;
					this.fallbackToSavedFiles(new Error('an included file outside the workspace has unsaved changes'));
				}
				return;
			}
			if (!this.sourceService) {
				this.hasUnsavedSavedFileInput = true;
				this.markBeancheckInputChanged('unsaved-saved-file-input');
				return;
			}
			this.sourceService.update(
				event.document.uri,
				event.document.getText(),
				event.document.version,
				'open-buffer',
			);
		}));
		this.subscriptions.push(documents.onDidClose(event => {
			if (!this.workspaceUri || !event.document.uri.startsWith(this.workspaceUri)) return;
			if (!this.sourceService) {
				this.hasUnsavedSavedFileInput = false;
				this.markBeancheckInputChanged('closed-saved-file-input');
				void this.scheduleDiagnosticsRevalidate();
				void this.scheduleBeancheckRevalidate();
				return;
			}
			this.documents.removeFile(event.document.uri);
			void this.documents.retrieve(event.document.uri).then(document => {
				this.sourceService?.update(event.document.uri, document.getText(), undefined, 'disk');
			});
		}));
		this.subscriptions.push(connection.onDidChangeWatchedFiles(event => {
			if (!this.sourceService || !this.workspaceUri) return;
			for (const change of event.changes) {
				if (!change.uri.startsWith(this.workspaceUri)) continue;
				if (change.type === FileChangeType.Deleted) {
					this.sourceService.remove(change.uri);
					continue;
				}
				this.documents.removeFile(change.uri);
				void this.documents.retrieve(change.uri).then(document => {
					this.sourceService?.update(change.uri, document.getText(), undefined, 'disk');
				});
			}
		}));
	}

	isEnabled(): boolean {
		return true;
	}

	canResolvePreciseIncompletePostingHint(): boolean {
		return this.liveBuffersEnabled
			&& this.appliedBeancheckGeneration === this.inputGeneration
			&& this.result !== null;
	}

	getRuntimeStatus(): BeancountRuntimeStatusParams {
		return { mode: 'local', scopeUri: this.workspaceUri ?? undefined };
	}

	getEvaluationState(): RuntimeEvaluationState {
		return {
			sourceRevision: this.inputGeneration,
			diagnosticsRevision: this.diagnosticsResult ? this.appliedDiagnosticsGeneration : null,
			diagnosticsStatus: this.diagnosticsStatus,
			derivedRevision: this.effectiveResult ? this.appliedBeancheckGeneration : null,
			inputMode: this.liveBuffersEnabled ? 'live-buffers' : 'saved-files',
		};
	}

	requestEvaluation(): void {
		if (this.hasUnsavedSavedFileInput) return;
		void this.scheduleDiagnosticsRevalidate(this.inputGeneration);
		void this.scheduleBeancheckRevalidate(this.inputGeneration);
	}

	async setMainFile(mainFileUri: string): Promise<void> {
		this.mainFile = URI.parse(mainFileUri).fsPath;
		const folder = await this.documents.getWorkspaceFolderFor(mainFileUri);
		this.workspaceUri = folder?.uri ?? null;
		const config = await this.connection.workspace.getConfiguration({
			scopeUri: folder?.uri ?? mainFileUri,
			section: 'beanLsp',
		});
		this.liveBuffersEnabled = config?.localRuntime?.liveBuffers ?? true;
		this.hasUnsavedSavedFileInput = false;
		if (folder && this.liveBuffersEnabled) {
			try {
				this.sourceSubscription?.dispose();
				this.sourceService?.dispose();
				this.sourceService = new SourceSnapshotService(this.documents, folder.uri, mainFileUri);
				const snapshot = await this.sourceService.reset(this.documents.getBeanFilesFor(folder.uri));
				if (this.hasDirtyExternalInclude(snapshot)) {
					throw new Error('an included file outside the workspace has unsaved changes');
				}
				await this.shadowWorkspace.reset(snapshot);
				this.markBeancheckInputChanged('shadow-reset');
				this.sourceSubscription = this.sourceService.onDidChange(change => {
					this.markBeancheckInputChanged('document-sync');
					const generation = this.inputGeneration;
					this.shadowSyncPromise = this.shadowSyncPromise
						.then(() => this.shadowWorkspace.sync(change))
						.catch(error => {
							this.fallbackToSavedFiles(error);
						});
					void this.shadowSyncPromise.then(() => {
						this.scheduleDiagnosticsDebounced(generation);
						this.scheduleBeancheckDebounced(generation, 1200);
					});
				});
			} catch (error) {
				this.fallbackToSavedFiles(error);
			}
		} else {
			this.markBeancheckInputChanged('main-file-updated');
		}
		await Promise.all([
			this.scheduleDiagnosticsRevalidate(),
			this.scheduleBeancheckRevalidate(),
		]);
	}

	async getPython3Path(): Promise<string> {
		const scopeUri = this.mainFile ? URI.file(this.mainFile).toString() : this.workspaceUri ?? undefined;
		const config = await this.connection.workspace.getConfiguration({ scopeUri });
		let python3Path = config?.beanLsp?.python3Path || config?.beancount?.python3Path || 'python3';
		python3Path = expandPythonPath(python3Path);

		if (python3Path !== 'python3' && !isAbsolute(python3Path)) {
			if (this.workspaceUri) {
				const workspacePath = URI.parse(this.workspaceUri).fsPath;
				python3Path = resolve(workspacePath, python3Path);
			}
		}

		return python3Path;
	}

	private async runBeanCheck(
		token: CancellationToken,
		mode: 'diagnostics' | 'full' = 'full',
	): Promise<BeancheckOutput | null> {
		if (!this.mainFile) {
			return null;
		}
		if (token.isCancellationRequested) {
			return null;
		}

		const python3Path = await this.getPython3Path();
		if (token.isCancellationRequested) {
			return null;
		}

		try {
			await this.shadowSyncPromise;
			if (this.liveBuffersEnabled && await this.ensureShadowWorkspaceMaterialized()) {
				this.logger.warn('Shadow workspace disappeared and was rebuilt before beancheck.');
			}
			const client = await this.ensureBeancheckRpcClient(python3Path);
			if (token.isCancellationRequested) {
				return null;
			}
			let usedShadowWorkspace = this.liveBuffersEnabled;
			let inputFile = usedShadowWorkspace ? this.shadowWorkspace.mainFilePath : this.mainFile;
			let result = await client.runBeancheck(inputFile, mode, token);
			if (token.isCancellationRequested) {
				return null;
			}

			// macOS may purge os.tmpdir() while VS Code remains open for days. The
			// loader reports that as a normal Beancount diagnostic, so recover here
			// and retry once instead of publishing a false "main.bean does not exist".
			if (usedShadowWorkspace && !await this.shadowWorkspace.isMaterialized()) {
				this.logger.warn('Shadow workspace disappeared during beancheck; rebuilding and retrying once.');
				await this.ensureShadowWorkspaceMaterialized();
				if (token.isCancellationRequested || !this.liveBuffersEnabled) return null;
				inputFile = this.shadowWorkspace.mainFilePath;
				result = await client.runBeancheck(inputFile, mode, token);
				if (token.isCancellationRequested) return null;
				usedShadowWorkspace = true;
			}

			return usedShadowWorkspace ? this.rewriteShadowResult(result) : result;
		} catch (error) {
			if (this.isCancellationError(error)) {
				return null;
			}
			this.logger.error('Error running bean-check via rpc:', error);
			this.disposeBeancheckRpcClient();
			return null;
		}
	}

	private async ensureShadowWorkspaceMaterialized(): Promise<boolean> {
		let rebuilt = false;
		const operation = this.shadowSyncPromise.then(async () => {
			const sourceService = this.sourceService;
			if (!this.liveBuffersEnabled || !sourceService) return;
			rebuilt = await this.shadowWorkspace.ensureMaterialized(sourceService.snapshot);
		});
		const guardedOperation = operation.catch(error => {
			this.fallbackToSavedFiles(error);
		});
		this.shadowSyncPromise = guardedOperation;
		await guardedOperation;
		return rebuilt;
	}

	private async ensureBeancheckRpcClient(python3Path: string): Promise<BeancheckRpcClient> {
		const workspaceRoot = this.workspaceUri ? URI.parse(this.workspaceUri).fsPath : undefined;
		if (
			this.beancheckRpcClient
			&& this.beancheckRpcPythonPath === python3Path
			&& this.beancheckRpcWorkspaceRoot === (workspaceRoot ?? null)
		) {
			return this.beancheckRpcClient;
		}
		this.disposeBeancheckRpcClient();
		this.beancheckRpcClient = new BeancheckRpcClient(python3Path, workspaceRoot, this.logger);
		this.beancheckRpcPythonPath = python3Path;
		this.beancheckRpcWorkspaceRoot = workspaceRoot ?? null;
		return this.beancheckRpcClient;
	}

	private disposeBeancheckRpcClient(): void {
		this.beancheckRpcClient?.dispose();
		this.beancheckRpcClient = null;
		this.beancheckRpcPythonPath = null;
		this.beancheckRpcWorkspaceRoot = null;
	}

	private isCancellationError(error: unknown): boolean {
		return error instanceof Error && error.name === 'CancellationError';
	}

	private fallbackToSavedFiles(error: unknown): void {
		if ([...this.sourceService?.snapshot.files.values() ?? []].some(file => file.origin === 'open-buffer')) {
			this.hasUnsavedSavedFileInput = true;
		}
		this.liveBuffersEnabled = false;
		this.sourceSubscription?.dispose();
		this.sourceSubscription = null;
		this.sourceService?.dispose();
		this.sourceService = null;
		this.shadowSyncPromise = Promise.resolve();
		this.markBeancheckInputChanged('live-buffer-fallback');
		if (this.hasWarnedLiveBufferFallback) return;
		this.hasWarnedLiveBufferFallback = true;
		const message = `Live-buffer evaluation is unavailable; using saved files. ${asError(error).message}`;
		this.logger.warn(message);
		void this.connection.window.showWarningMessage(message);
		if (!this.hasUnsavedSavedFileInput) {
			void this.scheduleDiagnosticsRevalidate(this.inputGeneration);
			void this.scheduleBeancheckRevalidate(this.inputGeneration);
		}
	}

	private hasDirtyExternalInclude(snapshot: SourceSnapshot): boolean {
		for (const [sourceUri, rawIncludes] of snapshot.includeGraph.unresolved) {
			for (const raw of rawIncludes) {
				const uri = this.externalIncludeUri(sourceUri, raw);
				if (uri && this.documents.isOpen(uri)) return true;
			}
		}
		return false;
	}

	private isReferencedExternalUri(uri: string, snapshot: SourceSnapshot): boolean {
		for (const [sourceUri, rawIncludes] of snapshot.includeGraph.unresolved) {
			for (const raw of rawIncludes) {
				if (this.externalIncludeUri(sourceUri, raw) === uri) return true;
			}
		}
		return false;
	}

	private externalIncludeUri(sourceUri: string, raw: string): string | null {
		try {
			if (raw.startsWith('file:')) return URI.parse(raw).toString();
			if (isAbsolute(raw)) return URI.file(raw).toString();
			return UriUtils.resolvePath(UriUtils.dirname(URI.parse(sourceUri)), raw).toString();
		} catch {
			return null;
		}
	}

	private markBeancheckInputChanged(reason: string): void {
		if (this.recoveryTimer) clearTimeout(this.recoveryTimer);
		this.recoveryTimer = null;
		this.inputGeneration += 1;
		this.diagnosticsStatus = 'pending';
		// Keep the previous diagnostics published while the replacement is pending.
		// VS Code tracks their decorations through edits; the generation mismatch
		// still marks them as stale for consumers that require a fresh result.

		// Keep stale result for SWR: non-diagnostic data (balances, pads) served from stale
		// while the fresh beancheck is running.
		if (this.result && this.appliedBeancheckGeneration < this.inputGeneration) {
			this.staleResult = this.result;
			this.result = null;
			this.padFileCache.clear();
			this.emitLedgerUpdate();
		}

		if (
			this.activeDiagnosticsTokenSource
			&& this.activeDiagnosticsRunGeneration < this.inputGeneration
		) {
			this.activeDiagnosticsTokenSource.cancel();
		}

		if (
			this.activeBeancheckTokenSource
			&& this.activeBeancheckRunGeneration < this.inputGeneration
		) {
			this.logger.debug(
				`cancelling beancheck generation ${this.activeBeancheckRunGeneration} due to ${reason} (generation=${this.inputGeneration})`,
			);
			this.activeBeancheckTokenSource.cancel();
		}
	}

	private async scheduleBeancheckRevalidate(targetGeneration = this.inputGeneration): Promise<void> {
		if (!this.mainFile) {
			return;
		}

		this.queuedBeancheckGeneration = Math.max(this.queuedBeancheckGeneration, targetGeneration);
		this.hasPendingBeancheckRun = true;

		if (
			this.activeBeancheckTokenSource
			&& this.activeBeancheckRunGeneration < this.queuedBeancheckGeneration
		) {
			this.activeBeancheckTokenSource.cancel();
		}

		if (!this.beancheckQueuePromise) {
			this.beancheckQueuePromise = this.processBeancheckQueue()
				.finally(() => {
					this.beancheckQueuePromise = null;
				});
		}

		await this.beancheckQueuePromise;
	}

	private async scheduleDiagnosticsRevalidate(targetGeneration = this.inputGeneration): Promise<void> {
		if (!this.mainFile) return;
		this.queuedDiagnosticsGeneration = Math.max(this.queuedDiagnosticsGeneration, targetGeneration);
		this.hasPendingDiagnosticsRun = true;
		if (
			this.activeDiagnosticsTokenSource
			&& this.activeDiagnosticsRunGeneration < this.queuedDiagnosticsGeneration
		) {
			this.activeDiagnosticsTokenSource.cancel();
		}
		if (!this.diagnosticsQueuePromise) {
			this.diagnosticsQueuePromise = this.processDiagnosticsQueue().finally(() => {
				this.diagnosticsQueuePromise = null;
			});
		}
		await this.diagnosticsQueuePromise;
	}

	private async processDiagnosticsQueue(): Promise<void> {
		while (this.hasPendingDiagnosticsRun) {
			this.hasPendingDiagnosticsRun = false;
			const targetGeneration = this.queuedDiagnosticsGeneration;
			const tokenSource = new CancellationTokenSource();
			this.activeDiagnosticsTokenSource = tokenSource;
			this.activeDiagnosticsRunGeneration = targetGeneration;
			try {
				await this.revalidateDiagnostics(targetGeneration, tokenSource.token);
			} finally {
				if (this.activeDiagnosticsTokenSource === tokenSource) {
					this.activeDiagnosticsTokenSource = null;
					this.activeDiagnosticsRunGeneration = 0;
				}
				tokenSource.dispose();
			}
		}
	}

	private async revalidateDiagnostics(targetGeneration: number, token: CancellationToken): Promise<void> {
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) return;
		const result = await this.runBeanCheck(token, 'diagnostics');
		if (!result) {
			if (!token.isCancellationRequested && targetGeneration === this.inputGeneration) {
				this.markDiagnosticsFailed();
			}
			return;
		}
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) return;
		this.diagnosticsResult = { errors: result.errors, flags: result.flags };
		this.appliedDiagnosticsGeneration = targetGeneration;
		this.diagnosticsStatus = 'fresh';
		this.emitLedgerUpdate();
	}

	private markDiagnosticsFailed(): void {
		this.diagnosticsResult = null;
		this.diagnosticsStatus = 'failed';
		this.emitLedgerUpdate();
	}

	private scheduleBeancheckDebounced(targetGeneration: number, delayMs = 250): void {
		if (this.beancheckDebounceTimer) clearTimeout(this.beancheckDebounceTimer);
		this.beancheckDebounceTimer = setTimeout(() => {
			this.beancheckDebounceTimer = null;
			void this.scheduleBeancheckRevalidate(targetGeneration);
		}, delayMs);
	}

	private scheduleDiagnosticsDebounced(targetGeneration: number): void {
		if (this.diagnosticsDebounceTimer) clearTimeout(this.diagnosticsDebounceTimer);
		this.diagnosticsDebounceTimer = setTimeout(() => {
			this.diagnosticsDebounceTimer = null;
			void this.scheduleDiagnosticsRevalidate(targetGeneration);
		}, 250);
	}

	private async processBeancheckQueue(): Promise<void> {
		while (this.hasPendingBeancheckRun) {
			this.hasPendingBeancheckRun = false;
			const targetGeneration = this.queuedBeancheckGeneration;
			const tokenSource = new CancellationTokenSource();
			this.activeBeancheckTokenSource = tokenSource;
			this.activeBeancheckRunGeneration = targetGeneration;
			try {
				await this.revalidateBeanCheck(targetGeneration, tokenSource.token);
			} finally {
				if (this.activeBeancheckTokenSource === tokenSource) {
					this.activeBeancheckTokenSource = null;
					this.activeBeancheckRunGeneration = 0;
				}
				tokenSource.dispose();
			}
		}
	}

	private async revalidateBeanCheck(targetGeneration: number, token: CancellationToken): Promise<void> {
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			return;
		}

		const startedAt = Date.now();
		const contextId = `${this.workspaceUri ?? 'standalone'}::${
			this.mainFile ? URI.file(this.mainFile).toString() : ''
		}`;
		this.logger.info(
			`running beancheck context=${contextId} revision=${targetGeneration} mode=full input=${
				this.liveBuffersEnabled ? 'live-buffers' : 'saved-files'
			}`,
		);
		const result = await this.runBeanCheck(token);
		this.logger.info(
			`received beancheck context=${contextId} revision=${targetGeneration} mode=full input=${
				this.liveBuffersEnabled ? 'live-buffers' : 'saved-files'
			} durationMs=${Date.now() - startedAt}`,
		);

		if (!result) {
			if (
				!token.isCancellationRequested
				&& targetGeneration === this.inputGeneration
				&& this.lastRecoveryGeneration !== targetGeneration
			) {
				this.lastRecoveryGeneration = targetGeneration;
				this.recoveryTimer = setTimeout(() => {
					this.recoveryTimer = null;
					void this.scheduleBeancheckRevalidate(targetGeneration);
				}, 1000);
			}
			return;
		}
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			this.logger.info(
				`discarding stale beancheck result generation=${targetGeneration}; latest generation=${this.inputGeneration}`,
			);
			return;
		}

		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			return;
		}

		this.result = result;
		this.diagnosticsResult = { errors: result.errors, flags: result.flags };
		this.appliedDiagnosticsGeneration = targetGeneration;
		this.diagnosticsStatus = 'fresh';
		this.lastRecoveryGeneration = -1;
		this.staleResult = null;
		this.padFileCache.clear();
		this.appliedBeancheckGeneration = targetGeneration;
		this.emitLedgerUpdate();
	}

	private emitLedgerUpdate(): void {
		globalEventBus.emit<LedgerContextEvent>(GlobalEvents.BeancountUpdate, {
			contextId: `${this.workspaceUri ?? 'standalone'}::${
				this.mainFile ? URI.file(this.mainFile).toString() : ''
			}`,
			sourceRevision: this.inputGeneration,
		});
	}

	private onDocumentSaved(params: DidSaveTextDocumentParams): void {
		if (!this.mainFile) {
			return;
		}
		// Only check bean files
		if (!params.textDocument.uri.endsWith('.bean') && !params.textDocument.uri.endsWith('.beancount')) {
			return;
		}
		if (this.beancheckDebounceTimer) clearTimeout(this.beancheckDebounceTimer);
		this.beancheckDebounceTimer = null;
		if (this.diagnosticsDebounceTimer) clearTimeout(this.diagnosticsDebounceTimer);
		this.diagnosticsDebounceTimer = null;

		if (!this.liveBuffersEnabled) {
			this.hasUnsavedSavedFileInput = false;
			this.markBeancheckInputChanged('document-saved');
		}
		void this.scheduleDiagnosticsRevalidate();
		void this.scheduleBeancheckRevalidate();
	}

	/** Effective result for non-diagnostic data: current result or stale fallback (SWR) */
	private get effectiveResult(): BeancheckOutput | null {
		return this.result ?? this.staleResult;
	}

	getBalance(account: string, includeSubaccountBalance: boolean): Amount[] {
		let accountDetails = this.effectiveResult?.general?.accounts?.[account] as AccountDetails | null;
		if (!accountDetails) {
			return [];
		}

		const balances = includeSubaccountBalance ? accountDetails.balance_incl_subaccounts : accountDetails.balance;

		return balances.map(balanceStr => this.parseAmountString(balanceStr));
	}

	getBalanceSnapshot(account: string, includeSubaccountBalance: boolean) {
		const isFresh = this.appliedBeancheckGeneration === this.inputGeneration
			&& !this.hasUnsavedSavedFileInput;
		return {
			value: this.getBalance(account, includeSubaccountBalance),
			sourceRevision: this.appliedBeancheckGeneration,
			freshness: isFresh ? 'fresh' as const : 'stale' as const,
			inputMode: this.liveBuffersEnabled ? 'live-buffers' as const : 'saved-files' as const,
		};
	}

	getSubaccountBalances(account: string): Map<string, Amount[]> {
		const accounts = this.effectiveResult?.general?.accounts;

		const subaccounts = new Map();

		if (!accounts) {
			return subaccounts;
		}

		const prefix = account + ':';

		for (const [candidateAccount, value] of Object.entries(accounts)) {
			if (!candidateAccount.startsWith(prefix) && !(candidateAccount === account)) {
				continue;
			}

			const details = value as AccountDetails;
			const balances = details.balance.map(balanceStr => this.parseAmountString(balanceStr));
			subaccounts.set(candidateAccount, balances);
		}

		return subaccounts;
	}

	getPadAmounts(filePath: string, line: number): Amount[] | null {
		const pads = this.effectiveResult?.pads;
		if (!pads) {
			return null;
		}

		const normalizedPath = normalize(filePath);
		let filePads: Record<string, Amount[]> | null;
		if (this.padFileCache.has(normalizedPath)) {
			filePads = this.padFileCache.get(normalizedPath) ?? null;
		} else {
			filePads = pads[normalizedPath] ?? pads[filePath] ?? pads[basename(normalizedPath)] ?? null;
			this.padFileCache.set(normalizedPath, filePads);
		}
		if (!filePads) {
			return [];
		}

		const lineKey = String(line + 1);
		return filePads[lineKey] ?? [];
	}

	getPadAmountsSnapshot(filePath: string, line: number) {
		const isFresh = this.appliedBeancheckGeneration === this.inputGeneration
			&& !this.hasUnsavedSavedFileInput;
		return {
			value: this.getPadAmounts(filePath, line),
			sourceRevision: this.appliedBeancheckGeneration,
			freshness: isFresh ? 'fresh' as const : 'stale' as const,
			inputMode: this.liveBuffersEnabled ? 'live-buffers' as const : 'saved-files' as const,
		};
	}

	private parseAmountString(balanceStr: string): Amount {
		const [number, currency] = balanceStr.trim().split(/\s+/) as [string, string];
		return { number, currency };
	}

	getErrors(): BeancountError[] {
		return this.diagnosticsResult?.errors ?? [];
	}

	getFlagged(): BeancountFlag[] {
		return this.diagnosticsResult?.flags ?? [];
	}

	async runQuery(query: string): Promise<string> {
		if (!this.mainFile) {
			throw new Error('No main file set. Please set a main Beancount file first.');
		}

		if (this.hasUnsavedSavedFileInput) {
			throw new Error(
				'Ledger evaluation only has saved-file input; save or close edited files before running a query.',
			);
		}
		if (this.appliedBeancheckGeneration !== this.inputGeneration) {
			await this.scheduleBeancheckRevalidate(this.inputGeneration);
		}
		if (this.appliedBeancheckGeneration !== this.inputGeneration) {
			throw new Error('Ledger evaluation is not current; retry after validation completes.');
		}
		await this.shadowSyncPromise;
		const python3Path = await this.getPython3Path();
		const { stdout: prefix } = await $`${python3Path} -c ${'import sys; print(sys.prefix)'}`;

		this.logger.info(`Running bean-query: ${query}`);
		const inputFile = this.liveBuffersEnabled ? this.shadowWorkspace.mainFilePath : this.mainFile;

		const { stdout } = await execa({
			extendEnv: true,
			cwd: this.workspaceUri ? URI.parse(this.workspaceUri).fsPath : undefined,
			env: {
				PATH: `${prefix}/bin` + ':' + process.env['PATH'],
			},
		})`bean-query ${inputFile} ${query}`;
		return stdout;
	}

	async getPreciseIncompletePostingHint(params: PreciseIncompletePostingHintParams): Promise<Amount | null> {
		if (!this.mainFile) {
			return null;
		}

		const python3Path = await this.getPython3Path();
		const client = await this.ensureBeancheckRpcClient(python3Path);
		const tokenSource = new CancellationTokenSource();
		try {
			await this.shadowSyncPromise;
			const inputFile = this.liveBuffersEnabled ? this.shadowWorkspace.mainFilePath : this.mainFile;
			const targetFile = this.liveBuffersEnabled
				? this.shadowWorkspace.mapSourcePath(params.targetUri)
				: URI.parse(params.targetUri).fsPath;
			return await client.interpolateIncompletePosting(
				inputFile,
				{
					targetFile,
					transactionLine: params.transactionStartLine + 1,
					postingLine: params.postingStartLine + 1,
					account: params.account,
				},
				tokenSource.token,
			);
		} catch (error) {
			if (!this.isCancellationError(error)) {
				this.logger.error(`Error interpolating incomplete posting: ${String(error)}`);
				this.disposeBeancheckRpcClient();
			}
			return null;
		} finally {
			tokenSource.dispose();
		}
	}

	dispose(): void {
		for (const subscription of this.subscriptions.splice(0)) subscription.dispose();
		this.mainFile = null;
		if (this.beancheckDebounceTimer) clearTimeout(this.beancheckDebounceTimer);
		this.beancheckDebounceTimer = null;
		if (this.diagnosticsDebounceTimer) clearTimeout(this.diagnosticsDebounceTimer);
		this.diagnosticsDebounceTimer = null;
		if (this.recoveryTimer) clearTimeout(this.recoveryTimer);
		this.recoveryTimer = null;
		this.activeDiagnosticsTokenSource?.cancel();
		this.activeDiagnosticsTokenSource?.dispose();
		this.activeDiagnosticsTokenSource = null;
		this.activeDiagnosticsRunGeneration = 0;
		this.activeBeancheckTokenSource?.cancel();
		this.activeBeancheckTokenSource?.dispose();
		this.activeBeancheckTokenSource = null;
		this.activeBeancheckRunGeneration = 0;
		this.disposeBeancheckRpcClient();
		this.sourceSubscription?.dispose();
		this.sourceSubscription = null;
		this.sourceService?.dispose();
		this.sourceService = null;
		void this.shadowWorkspace.dispose();
	}

	private rewriteShadowResult(result: BeancheckOutput): BeancheckOutput {
		const rewriteFile = (file: string) =>
			file.endsWith('<load>') && this.mainFile
				? this.mainFile
				: this.shadowWorkspace.mapRuntimePath(file);
		const pads: BeancheckOutput['pads'] = {};
		for (const [file, lineMap] of Object.entries(result.pads ?? {})) {
			pads[rewriteFile(file)] = lineMap;
		}
		return {
			...result,
			errors: result.errors.map(error => ({ ...error, file: rewriteFile(error.file) })),
			flags: result.flags.map(flag => ({ ...flag, file: rewriteFile(flag.file) })),
			pads,
		};
	}
}

export const beananagerFactory: BeancountManagerFactory = (connection: Connection, documents) =>
	new BeancountManager(connection, documents);
