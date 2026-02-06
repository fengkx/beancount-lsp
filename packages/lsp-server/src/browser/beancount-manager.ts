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

class BeancountBrowserManager implements RealBeancountManager {
	private mainFile: string | null = null;
	private result: BeancheckOutput | null = null;
	/** Stale result kept for SWR: non-diagnostic data (balances, pads) served from here while revalidating */
	private staleResult: BeancheckOutput | null = null;
	private padFileCache = new Map<string, Record<string, Amount[]> | null>();
	private logger = new Logger('BeancountBrowserManager');
	private workerClient: BeancountWorkerClient | null = null;
	private enabledMode: BrowserBeancountMode = 'off';
	private extraPythonPackages: string[] = [];
	private lastFileSnapshot = new Map<string, string>();
	private configDebounceTimer: ReturnType<typeof setTimeout> | undefined;
	private static readonly CONFIG_DEBOUNCE_MS = 500;
	private inputGeneration = 0;
	private queuedBeancheckGeneration = 0;
	private appliedBeancheckGeneration = 0;
	private hasPendingBeancheckRun = false;
	private beancheckQueuePromise: Promise<void> | null = null;
	private activeBeancheckTokenSource: CancellationTokenSource | null = null;
	private activeBeancheckRunGeneration = 0;

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
		await this.scheduleBeancheckRevalidate();
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
			this.workerClient?.dispose();
			this.workerClient = null;
			this.result = null;
			this.staleResult = null;
			this.padFileCache.clear();
			this.activeBeancheckTokenSource?.cancel();
			this.activeBeancheckTokenSource?.dispose();
			this.activeBeancheckTokenSource = null;
			this.activeBeancheckRunGeneration = 0;
			this.inputGeneration = 0;
			this.queuedBeancheckGeneration = 0;
			this.appliedBeancheckGeneration = 0;
			this.hasPendingBeancheckRun = false;
			globalEventBus.emit(GlobalEvents.BeancountUpdate);
			return;
		}
		await this.ensureWorker();
		await this.workerClient?.init(this.enabledMode, {
			extraPythonPackages: this.extraPythonPackages,
		});
		await this.refreshFileTree();
		this.markBeancheckInputChanged('runtime-reconfigured');
		await this.scheduleBeancheckRevalidate();
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

		// Previous beancheck diagnostics no longer match the latest synced input snapshot.
		// Keep stale result for SWR: non-diagnostic data (balances, pads) served from stale
		// while diagnostics are cleared immediately.
		if (this.result && this.appliedBeancheckGeneration < this.inputGeneration) {
			this.staleResult = this.result;
			this.result = null;
			this.padFileCache.clear();
			globalEventBus.emit(GlobalEvents.BeancountUpdate);
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
		const changed = await this.syncFileUpdate(uri, content);
		if (changed) {
			this.markBeancheckInputChanged('document-sync');
		}
	}

	private async refreshFileTree(): Promise<void> {
		if (this.enabledMode === 'off' || !this.workerClient) {
			return;
		}
		const files = await this.collectBeanFiles();
		await this.workerClient.reset(files);
	}

	private async handleWatchedFiles(event: DidChangeWatchedFilesParams): Promise<void> {
		if (this.enabledMode === 'off' || !this.workerClient) {
			return;
		}
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
			void this.scheduleBeancheckRevalidate();
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

	private async syncFileUpdate(uri: string, content: string): Promise<boolean> {
		if (!this.workerClient) {
			return false;
		}
		const name = this.normalizeFileName(uri);
		const previous = this.lastFileSnapshot.get(name);
		if (previous === content) {
			return false;
		}
		this.lastFileSnapshot.set(name, content);
		await this.workerClient.sync([{ name, content }], []);
		return true;
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

	private async runBeanCheck(token: CancellationToken): Promise<string | null> {
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
		const result = await this.workerClient.beancheck(entryFile);
		if (token.isCancellationRequested) {
			return null;
		}
		return result;
	}

	private async scheduleBeancheckRevalidate(targetGeneration = this.inputGeneration): Promise<void> {
		if (this.enabledMode === 'off' || !this.mainFile) {
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
		this.logger.info(`running browser beancheck generation=${targetGeneration}`);
		const r = await this.runBeanCheck(token);
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

		this.result = this.rewriteFileUris(parsed);
		this.staleResult = null;
		this.padFileCache.clear();
		this.appliedBeancheckGeneration = targetGeneration;
		globalEventBus.emit(GlobalEvents.BeancountUpdate);
	}

	private onDocumentSaved(params: DidSaveTextDocumentParams): void {
		if (!this.mainFile) {
			return;
		}
		if (!this.isBeanFileUri(params.textDocument.uri)) {
			return;
		}
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

	getSubaccountBalances(account: string): Map<string, Amount[]> {
		const accounts = this.effectiveResult?.general?.accounts;
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
		const pads = this.effectiveResult?.pads;
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

	getErrors(): BeancountError[] {
		return this.result?.errors ?? [];
	}

	getFlagged(): BeancountFlag[] {
		return this.result?.flags ?? [];
	}

	async runQuery(_query: string): Promise<string> {
		throw new Error('Bean-query is not available in the browser runtime.');
	}

	dispose(): void {
		if (this.configDebounceTimer) {
			clearTimeout(this.configDebounceTimer);
			this.configDebounceTimer = undefined;
		}
		this.activeBeancheckTokenSource?.cancel();
		this.activeBeancheckTokenSource?.dispose();
		this.activeBeancheckTokenSource = null;
		this.activeBeancheckRunGeneration = 0;
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
