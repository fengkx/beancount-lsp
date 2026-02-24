import { Logger } from '@bean-lsp/shared';
import type { BeancountRuntimeStatusParams } from '@bean-lsp/shared';
import type {
	Connection,
	DidChangeWatchedFilesParams,
	DidSaveTextDocumentParams,
} from 'vscode-languageserver';
import {
	CancellationToken,
	CancellationTokenSource,
	FileChangeType,
} from 'vscode-languageserver';
import { URI, Utils as UriUtils } from 'vscode-uri';
import { DocumentStore } from '../common/document-store';
import {
	Amount,
	BeancountError,
	BeancountFlag,
	BeancountManagerFactory,
	RealBeancountManager,
} from '../common/features/types';
import { globalEventBus, GlobalEvents } from '../common/utils/event-bus';
import type { BeancheckMode } from './beancount-worker-client';
import { BeancountWorkerClient } from './beancount-worker-client';

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

type BrowserBeancountMode = 'off' | 'v2' | 'v3';

interface FileUpdate {
	name: string;
	content: string;
}

type BeancheckDiagnosticsResult = Pick<BeancheckOutput, 'errors' | 'flags'>;
type BeancheckDerivedResult = Pick<BeancheckOutput, 'pads' | 'general'>;

class BeancountBrowserManager implements RealBeancountManager {
	private mainFile: string | null = null;
	private diagnosticsResult: BeancheckDiagnosticsResult | null = null;
	private derivedResult: BeancheckDerivedResult | null = null;
	/** Stale derived data kept for SWR while revalidating full beancheck. */
	private staleDerivedResult: BeancheckDerivedResult | null = null;
	private padFileCache = new Map<string, Record<string, Amount[]> | null>();
	private logger = new Logger('BeancountBrowserManager');
	private workerClient: BeancountWorkerClient | null = null;
	private enabledMode: BrowserBeancountMode = 'off';
	private extraPythonPackages: string[] = [];
	private lastFileSnapshot = new Map<string, string>();
	private configDebounceTimer: ReturnType<typeof setTimeout> | undefined;
	private static readonly CONFIG_DEBOUNCE_MS = 500;
	private static readonly SYNC_FLUSH_DEBOUNCE_MS = 50;
	private static readonly DIAGNOSTICS_DEBOUNCE_MS = 250;
	private static readonly FULL_IDLE_DEBOUNCE_MS = 1200;
	private static readonly WATCHED_FILES_FULL_DEBOUNCE_MS = 300;
	private inputGeneration = 0;
	private queuedDiagnosticsGeneration = 0;
	private appliedDiagnosticsGeneration = 0;
	private hasPendingDiagnosticsRun = false;
	private diagnosticsQueuePromise: Promise<void> | null = null;
	private activeDiagnosticsTokenSource: CancellationTokenSource | null = null;
	private activeDiagnosticsRunGeneration = 0;
	private diagnosticsDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	private queuedFullGeneration = 0;
	private appliedFullGeneration = 0;
	private hasPendingFullRun = false;
	private fullQueuePromise: Promise<void> | null = null;
	private activeFullTokenSource: CancellationTokenSource | null = null;
	private activeFullRunGeneration = 0;
	private fullDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	private pendingSyncUpdates = new Map<string, string>();
	private pendingSyncRemovals = new Set<string>();
	private syncFlushTimer: ReturnType<typeof setTimeout> | null = null;
	private syncFlushPromise: Promise<void> | null = null;

	constructor(
		private readonly connection: Connection,
		private readonly documents: DocumentStore,
		private readonly workerUrl: string,
	) {
		connection.onDidSaveTextDocument(this.onDocumentSaved.bind(this));
		globalEventBus.on(GlobalEvents.ConfigurationChanged, () => {
			if (this.configDebounceTimer) {
				
				clearTimeout(this.configDebounceTimer);
			}
			this.configDebounceTimer = setTimeout(() => {
				this.configDebounceTimer = undefined;
				void this.refreshConfiguration();
			}, BeancountBrowserManager.CONFIG_DEBOUNCE_MS);
		});
		connection.onDidChangeWatchedFiles(event => {
			void this.handleWatchedFiles(event);
		});
		documents.onDidChangeContent2(event => {
			void this.handleDocumentChange(event.document.uri, event.document.getText());
		});
	}

	isEnabled(): boolean {
		return this.enabledMode !== 'off';
	}

	getRuntimeStatus(): BeancountRuntimeStatusParams {
		if (this.enabledMode === 'off') {
			return { mode: 'off' };
		}
		return { mode: 'wasm', version: this.enabledMode };
	}

	async setMainFile(mainFileUri: string): Promise<void> {
		this.mainFile = mainFileUri;
		this.markBeancheckInputChanged('main-file-updated');
		await this.refreshConfiguration();
		await this.refreshFileTree();
		await this.scheduleDiagnosticsRevalidate(this.inputGeneration, { immediate: true });
		await this.scheduleFullRevalidate(this.inputGeneration, { immediate: true });
	}

	private async refreshConfiguration(): Promise<void> {
		// Use mainFile as scopeUri if available, otherwise undefined
		const scopeUri = this.mainFile ?? undefined;
		const config = await this.connection.workspace.getConfiguration({ 
			scopeUri, 
			section: 'beanLsp' 
		});
		const browserWasm = config?.browserWasmBeancount ?? {};
		const requested = (browserWasm.enabled ?? 'off') as BrowserBeancountMode;
		const extraPackages = this.normalizeExtraPackages(browserWasm.extraPythonPackages);
		const packagesChanged = requested !== 'off' && !this.sameStringArray(this.extraPythonPackages, extraPackages);
		if (requested === this.enabledMode && !packagesChanged) {
			return;
		}
		const previousMode = this.enabledMode;
		this.enabledMode = requested;
		this.extraPythonPackages = extraPackages;

		// Notify listeners about mode change
		if (previousMode !== this.enabledMode) {
			globalEventBus.emit<BeancountRuntimeStatusParams>(
				GlobalEvents.BeancountModeChanged,
				this.getRuntimeStatus(),
			);
		}

		if (this.enabledMode === 'off') {
			this.logger.info('Browser Beancount WASM diagnostics disabled.');
			this.clearPendingSyncBuffers();
			this.workerClient?.dispose();
			this.workerClient = null;
			this.diagnosticsResult = null;
			this.derivedResult = null;
			this.staleDerivedResult = null;
			this.padFileCache.clear();
			this.clearRevalidateTimers();
			this.activeDiagnosticsTokenSource?.cancel();
			this.activeDiagnosticsTokenSource?.dispose();
			this.activeDiagnosticsTokenSource = null;
			this.activeDiagnosticsRunGeneration = 0;
			this.activeFullTokenSource?.cancel();
			this.activeFullTokenSource?.dispose();
			this.activeFullTokenSource = null;
			this.activeFullRunGeneration = 0;
			this.inputGeneration = 0;
			this.queuedDiagnosticsGeneration = 0;
			this.appliedDiagnosticsGeneration = 0;
			this.hasPendingDiagnosticsRun = false;
			this.queuedFullGeneration = 0;
			this.appliedFullGeneration = 0;
			this.hasPendingFullRun = false;
			globalEventBus.emit(GlobalEvents.BeancountDiagnosticsUpdated);
			globalEventBus.emit(GlobalEvents.BeancountDerivedDataUpdated);
			return;
		}
		await this.ensureWorker();
		await this.workerClient?.init(this.enabledMode, {
			extraPythonPackages: this.extraPythonPackages,
		});
		await this.refreshFileTree();
		this.markBeancheckInputChanged('runtime-reconfigured');
		await this.scheduleDiagnosticsRevalidate(this.inputGeneration, { immediate: true });
		await this.scheduleFullRevalidate(this.inputGeneration, { immediate: true });
	}

	private isBeanFileUri(uri: string): boolean {
		return uri.endsWith('.bean') || uri.endsWith('.beancount');
	}

	private normalizeExtraPackages(value: unknown): string[] {
		if (!Array.isArray(value)) {
			return [];
		}
		const normalized = value
			.map(pkg => (typeof pkg === 'string' ? pkg.trim() : ''))
			.filter(Boolean);
		return Array.from(new Set(normalized));
	}

	private sameStringArray(left: string[], right: string[]): boolean {
		if (left.length !== right.length) {
			return false;
		}
		for (let i = 0; i < left.length; i++) {
			if (left[i] !== right[i]) {
				return false;
			}
		}
		return true;
	}

	private markBeancheckInputChanged(reason: string): void {
		this.inputGeneration += 1;

		if (this.diagnosticsResult && this.appliedDiagnosticsGeneration < this.inputGeneration) {
			this.diagnosticsResult = null;
			globalEventBus.emit(GlobalEvents.BeancountDiagnosticsUpdated);
		}

		// Keep stale derived data for SWR while revalidating the heavier full beancheck.
		if (this.derivedResult && this.appliedFullGeneration < this.inputGeneration) {
			this.staleDerivedResult = this.derivedResult;
			this.derivedResult = null;
			this.padFileCache.clear();
		}

		if (
			this.activeDiagnosticsTokenSource
			&& this.activeDiagnosticsRunGeneration < this.inputGeneration
		) {
			this.logger.debug(
				`cancelling diagnostics generation ${this.activeDiagnosticsRunGeneration} due to ${reason} (generation=${this.inputGeneration})`,
			);
			this.activeDiagnosticsTokenSource.cancel();
		}
		if (
			this.activeFullTokenSource
			&& this.activeFullRunGeneration < this.inputGeneration
		) {
			this.logger.debug(
				`cancelling full beancheck generation ${this.activeFullRunGeneration} due to ${reason} (generation=${this.inputGeneration})`,
			);
			this.activeFullTokenSource.cancel();
		}
	}

	private async ensureWorker(): Promise<void> {
		if (!this.workerClient) {
			this.workerClient = new BeancountWorkerClient(this.workerUrl, message => {
				this.logger.info(message);
			});
		}
	}

	private async handleDocumentChange(uri: string, content: string): Promise<void> {
		if (this.enabledMode === 'off') {
			return;
		}
		if (!this.isBeanFileUri(uri)) {
			return;
		}
		const changed = this.queueFileUpdate(uri, content);
		if (changed) {
			this.markBeancheckInputChanged('document-sync');
			void this.scheduleDiagnosticsRevalidate();
			void this.scheduleFullRevalidate();
		}
	}

	private async refreshFileTree(): Promise<void> {
		if (this.enabledMode === 'off' || !this.workerClient) {
			return;
		}
		await this.flushPendingSync();
		const files = await this.collectBeanFiles();
		await this.workerClient.reset(files);
	}

	private async handleWatchedFiles(event: DidChangeWatchedFilesParams): Promise<void> {
		if (this.enabledMode === 'off' || !this.workerClient) {
			return;
		}
		await this.flushPendingSync();
		const updates: FileUpdate[] = [];
		const removed: string[] = [];

		for (const change of event.changes) {
			if (!this.isBeanFileUri(change.uri)) {
				continue;
			}
			const name = this.normalizeFileName(change.uri);
			if (change.type === FileChangeType.Deleted) {
				removed.push(name);
				this.lastFileSnapshot.delete(name);
				continue;
			}
			const doc = await this.documents.retrieve(change.uri);
			const content = doc.getText();
			updates.push({ name, content });
			this.lastFileSnapshot.set(name, content);
		}

		if (updates.length || removed.length) {
			await this.workerClient.sync(updates, removed);
			this.markBeancheckInputChanged('watched-files');
			void this.scheduleDiagnosticsRevalidate();
			void this.scheduleFullRevalidate(this.inputGeneration, {
				debounceMs: BeancountBrowserManager.WATCHED_FILES_FULL_DEBOUNCE_MS,
			});
		} else {
			await this.refreshFileTree();
		}
	}

	private async collectBeanFiles(): Promise<FileUpdate[]> {
		const files = this.documents.beanFiles;
		const updates: FileUpdate[] = [];
		for (const uri of files) {
			const doc = await this.documents.retrieve(uri);
			updates.push({ name: this.normalizeFileName(uri), content: doc.getText() });
		}
		this.lastFileSnapshot = new Map(updates.map(entry => [entry.name, entry.content]));
		return updates;
	}

	private queueFileUpdate(uri: string, content: string): boolean {
		const name = this.normalizeFileName(uri);
		const previous = this.lastFileSnapshot.get(name);
		if (previous === content) {
			return false;
		}
		this.lastFileSnapshot.set(name, content);
		this.pendingSyncRemovals.delete(name);
		this.pendingSyncUpdates.set(name, content);
		this.scheduleSyncFlush();
		return true;
	}

	private scheduleSyncFlush(): void {
		if (this.syncFlushTimer) {
			return;
		}
		this.syncFlushTimer = setTimeout(() => {
			this.syncFlushTimer = null;
			void this.flushPendingSync();
		}, BeancountBrowserManager.SYNC_FLUSH_DEBOUNCE_MS);
	}

	private async flushPendingSync(): Promise<void> {
		if (this.enabledMode === 'off' || !this.workerClient) {
			return;
		}
		if (this.syncFlushPromise) {
			await this.syncFlushPromise;
			return;
		}
		this.syncFlushPromise = (async () => {
			while (this.pendingSyncUpdates.size > 0 || this.pendingSyncRemovals.size > 0) {
				const updates = Array.from(this.pendingSyncUpdates.entries()).map(([name, content]) => ({
					name,
					content,
				}));
				const removed = Array.from(this.pendingSyncRemovals);
				this.pendingSyncUpdates.clear();
				this.pendingSyncRemovals.clear();
				try {
					await this.workerClient!.sync(updates, removed);
				} catch (error) {
					for (const name of removed) {
						this.pendingSyncUpdates.delete(name);
						this.pendingSyncRemovals.add(name);
					}
					for (const update of updates) {
						this.pendingSyncRemovals.delete(update.name);
						this.pendingSyncUpdates.set(update.name, update.content);
					}
					throw error;
				}
			}
		})();
		try {
			await this.syncFlushPromise;
		} finally {
			this.syncFlushPromise = null;
		}
	}

	private clearPendingSyncBuffers(): void {
		if (this.syncFlushTimer) {
			clearTimeout(this.syncFlushTimer);
			this.syncFlushTimer = null;
		}
		this.pendingSyncUpdates.clear();
		this.pendingSyncRemovals.clear();
	}

	private clearRevalidateTimers(): void {
		if (this.diagnosticsDebounceTimer) {
			clearTimeout(this.diagnosticsDebounceTimer);
			this.diagnosticsDebounceTimer = null;
		}
		if (this.fullDebounceTimer) {
			clearTimeout(this.fullDebounceTimer);
			this.fullDebounceTimer = null;
		}
	}

	private normalizeFileName(uri: string): string {
		const parsed = URI.parse(uri);
		const relativeBase = this.mainFile ? URI.parse(this.mainFile) : null;
		if (relativeBase) {
			const rootUri = UriUtils.dirname(relativeBase);
			const relative = this.relativePath(rootUri, parsed);
			if (relative) {
				return relative;
			}
		}
		return parsed.path.replace(/^\//, '');
	}

	private relativePath(from: URI, to: URI): string | null {
		if (from.scheme !== to.scheme || from.authority !== to.authority) {
			return null;
		}
		const fromPath = from.path.endsWith('/') ? from.path : `${from.path}/`;
		if (!to.path.startsWith(fromPath)) {
			return null;
		}
		return to.path.slice(fromPath.length);
	}

	private async runBeanCheckByMode(
		mode: BeancheckMode,
		token: CancellationToken,
	): Promise<string | null> {
		if (!this.mainFile || this.enabledMode === 'off' || !this.workerClient) {
			return null;
		}
		if (token.isCancellationRequested) {
			return null;
		}
		const entryFile = this.normalizeFileName(this.mainFile);
		if (token.isCancellationRequested) {
			return null;
		}
		await this.flushPendingSync();
		if (token.isCancellationRequested) {
			return null;
		}
		const result = await this.workerClient.beancheck(entryFile, { mode });
		if (token.isCancellationRequested) {
			return null;
		}
		return result;
	}

	private async runBeanCheckDiagnostics(token: CancellationToken): Promise<string | null> {
		return this.runBeanCheckByMode('diagnostics', token);
	}

	private async runBeanCheckFull(token: CancellationToken): Promise<string | null> {
		return this.runBeanCheckByMode('full', token);
	}

	private async scheduleDiagnosticsRevalidate(
		targetGeneration = this.inputGeneration,
		options?: { immediate?: boolean },
	): Promise<void> {
		if (this.enabledMode === 'off' || !this.mainFile) {
			return;
		}
		if (options?.immediate) {
			this.enqueueDiagnosticsRevalidate(targetGeneration);
			await this.diagnosticsQueuePromise;
			return;
		}
		if (this.diagnosticsDebounceTimer) {
			clearTimeout(this.diagnosticsDebounceTimer);
		}
		this.diagnosticsDebounceTimer = setTimeout(() => {
			this.diagnosticsDebounceTimer = null;
			this.enqueueDiagnosticsRevalidate(targetGeneration);
		}, BeancountBrowserManager.DIAGNOSTICS_DEBOUNCE_MS);
	}

	private enqueueDiagnosticsRevalidate(targetGeneration: number): void {
		this.queuedDiagnosticsGeneration = Math.max(this.queuedDiagnosticsGeneration, targetGeneration);
		this.hasPendingDiagnosticsRun = true;
		if (
			this.activeDiagnosticsTokenSource
			&& this.activeDiagnosticsRunGeneration < this.queuedDiagnosticsGeneration
		) {
			this.activeDiagnosticsTokenSource.cancel();
		}

		if (!this.diagnosticsQueuePromise) {
			this.diagnosticsQueuePromise = this.processDiagnosticsQueue()
				.finally(() => {
					this.diagnosticsQueuePromise = null;
				});
		}
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
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			return;
		}
		this.logger.info(`running browser beancheck diagnostics generation=${targetGeneration}`);
		const r = await this.runBeanCheckDiagnostics(token);
		if (!r) {
			return;
		}

		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			this.logger.info(
				`discarding stale browser beancheck result generation=${targetGeneration}; latest generation=${this.inputGeneration}`,
			);
			return;
		}

		let parsed: BeancheckOutput;
		try {
			parsed = JSON.parse(r) as BeancheckOutput;
		} catch (error) {
			this.logger.error(`failed to parse browser beancheck result: ${String(error)}`);
			return;
		}
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			return;
		}

		const rewritten = this.rewriteDiagnosticsUris(parsed);
		this.diagnosticsResult = {
			errors: rewritten.errors,
			flags: rewritten.flags,
		};
		this.appliedDiagnosticsGeneration = targetGeneration;
		globalEventBus.emit(GlobalEvents.BeancountDiagnosticsUpdated);
	}

	private async scheduleFullRevalidate(
		targetGeneration = this.inputGeneration,
		options?: { immediate?: boolean; debounceMs?: number },
	): Promise<void> {
		if (this.enabledMode === 'off' || !this.mainFile) {
			return;
		}
		if (options?.immediate) {
			this.enqueueFullRevalidate(targetGeneration);
			await this.fullQueuePromise;
			return;
		}
		if (this.fullDebounceTimer) {
			clearTimeout(this.fullDebounceTimer);
		}
		this.fullDebounceTimer = setTimeout(() => {
			this.fullDebounceTimer = null;
			this.enqueueFullRevalidate(targetGeneration);
		}, options?.debounceMs ?? BeancountBrowserManager.FULL_IDLE_DEBOUNCE_MS);
	}

	private enqueueFullRevalidate(targetGeneration: number): void {
		this.queuedFullGeneration = Math.max(this.queuedFullGeneration, targetGeneration);
		this.hasPendingFullRun = true;
		if (
			this.activeFullTokenSource
			&& this.activeFullRunGeneration < this.queuedFullGeneration
		) {
			this.activeFullTokenSource.cancel();
		}
		if (!this.fullQueuePromise) {
			this.fullQueuePromise = this.processFullQueue().finally(() => {
				this.fullQueuePromise = null;
			});
		}
	}

	private async processFullQueue(): Promise<void> {
		while (this.hasPendingFullRun) {
			this.hasPendingFullRun = false;
			const targetGeneration = this.queuedFullGeneration;
			const tokenSource = new CancellationTokenSource();
			this.activeFullTokenSource = tokenSource;
			this.activeFullRunGeneration = targetGeneration;
			try {
				await this.revalidateFull(targetGeneration, tokenSource.token);
			} finally {
				if (this.activeFullTokenSource === tokenSource) {
					this.activeFullTokenSource = null;
					this.activeFullRunGeneration = 0;
				}
				tokenSource.dispose();
			}
		}
	}

	private async revalidateFull(targetGeneration: number, token: CancellationToken): Promise<void> {
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			return;
		}
		this.logger.info(`running browser beancheck full generation=${targetGeneration}`);
		const r = await this.runBeanCheckFull(token);
		if (!r) {
			return;
		}
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			this.logger.info(
				`discarding stale browser full beancheck result generation=${targetGeneration}; latest generation=${this.inputGeneration}`,
			);
			return;
		}
		let parsed: BeancheckOutput;
		try {
			parsed = JSON.parse(r) as BeancheckOutput;
		} catch (error) {
			this.logger.error(`failed to parse browser beancheck result: ${String(error)}`);
			return;
		}
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			return;
		}

		const rewritten = this.rewriteFileUris(parsed);
		this.derivedResult = {
			general: rewritten.general,
			pads: rewritten.pads,
		};
		this.staleDerivedResult = null;
		this.padFileCache.clear();
		this.appliedFullGeneration = targetGeneration;
		globalEventBus.emit(GlobalEvents.BeancountDerivedDataUpdated);
	}

	private onDocumentSaved(params: DidSaveTextDocumentParams): void {
		if (!this.mainFile) {
			return;
		}
		if (!this.isBeanFileUri(params.textDocument.uri)) {
			return;
		}
		void this.scheduleFullRevalidate(this.inputGeneration, { immediate: true });
	}

	/** Effective derived data: current result or stale fallback (SWR) */
	private get effectiveDerivedResult(): BeancheckDerivedResult | null {
		return this.derivedResult ?? this.staleDerivedResult;
	}

	getBalance(account: string, includeSubaccountBalance: boolean): Amount[] {
		let accountDetails = this.effectiveDerivedResult?.general?.accounts?.[account] as AccountDetails | null;
		if (!accountDetails) {
			return [];
		}
		const balances = includeSubaccountBalance ? accountDetails.balance_incl_subaccounts : accountDetails.balance;
		return balances.map(balanceStr => this.parseAmountString(balanceStr));
	}

	getSubaccountBalances(account: string): Map<string, Amount[]> {
		const accounts = this.effectiveDerivedResult?.general?.accounts;
		const subaccounts = new Map<string, Amount[]>();
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
		const pads = this.effectiveDerivedResult?.pads;
		if (!pads) {
			return null;
		}
		const normalizedPath = this.normalizeDiagnosticPath(filePath);
		let filePads: Record<string, Amount[]> | null;
		if (this.padFileCache.has(normalizedPath)) {
			filePads = this.padFileCache.get(normalizedPath) ?? null;
		} else {
			filePads = pads[normalizedPath] ?? pads[filePath] ?? null;
			this.padFileCache.set(normalizedPath, filePads);
		}
		if (!filePads) {
			return [];
		}
		const lineKey = String(line + 1);
		return filePads[lineKey] ?? [];
	}

	private parseAmountString(balanceStr: string): Amount {
		const [number, currency] = balanceStr.trim().split(/\s+/) as [string, string];
		return { number, currency };
	}

	private normalizeDiagnosticPath(filePath: string): string {
		if (filePath.includes('://')) {
			const parsed = URI.parse(filePath);
			return parsed.fsPath || parsed.path;
		}
		return filePath;
	}

	private rewriteFileUris(result: BeancheckOutput): BeancheckOutput {
		if (!this.mainFile) {
			return result;
		}
		const rootUri = UriUtils.dirname(URI.parse(this.mainFile));
		const rewrite = (filePath: string): string => {
			if (filePath.startsWith('/work/')) {
				const relative = filePath.replace(/^\/work\//, '');
				return UriUtils.joinPath(rootUri, relative).toString();
			}
			return filePath;
		};

		return {
			...result,
			errors: result.errors.map(error => ({ ...error, file: rewrite(error.file) })),
			flags: result.flags.map(flag => ({ ...flag, file: rewrite(flag.file) })),
			pads: result.pads
				? Object.fromEntries(
						Object.entries(result.pads).flatMap(([key, value]) => {
							const rewrittenUri = rewrite(key);
							const rewrittenPath = this.normalizeDiagnosticPath(rewrittenUri);
							return [
								[key, value],
								[rewrittenUri, value],
								[rewrittenPath, value],
							];
						}),
					)
				: result.pads,
		};
	}

	private rewriteDiagnosticsUris(result: BeancheckOutput): BeancheckDiagnosticsResult {
		const rewritten = this.rewriteFileUris(result);
		return {
			errors: rewritten.errors,
			flags: rewritten.flags,
		};
	}

	getErrors(): BeancountError[] {
		return this.diagnosticsResult?.errors ?? [];
	}

	getFlagged(): BeancountFlag[] {
		return this.diagnosticsResult?.flags ?? [];
	}

	async runQuery(_query: string): Promise<string> {
		throw new Error('Bean-query is not available in the browser runtime.');
	}

	dispose(): void {
		if (this.configDebounceTimer) {
			clearTimeout(this.configDebounceTimer);
			this.configDebounceTimer = undefined;
		}
		this.clearRevalidateTimers();
		this.clearPendingSyncBuffers();
		this.activeDiagnosticsTokenSource?.cancel();
		this.activeDiagnosticsTokenSource?.dispose();
		this.activeDiagnosticsTokenSource = null;
		this.activeDiagnosticsRunGeneration = 0;
		this.activeFullTokenSource?.cancel();
		this.activeFullTokenSource?.dispose();
		this.activeFullTokenSource = null;
		this.activeFullRunGeneration = 0;
		this.workerClient?.dispose();
		this.workerClient = null;
	}
}

export const createBrowserBeancountManager = (
	connection: Connection,
	documents: DocumentStore,
	workerUrl: string | (() => string),
): BeancountManagerFactory => {
	return () =>
		new BeancountBrowserManager(
			connection,
			documents,
			typeof workerUrl === 'function' ? workerUrl() : workerUrl,
		);
};
