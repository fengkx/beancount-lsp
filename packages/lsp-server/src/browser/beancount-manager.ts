import { Logger } from '@bean-lsp/shared';
import type { Connection, DidChangeWatchedFilesParams } from 'vscode-languageserver';
import { FileChangeType } from 'vscode-languageserver';
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
	private padFileCache = new Map<string, Record<string, Amount[]> | null>();
	private logger = new Logger('BeancountBrowserManager');
	private workerClient: BeancountWorkerClient | null = null;
	private enabledMode: BrowserBeancountMode = 'off';
	private lastFileSnapshot = new Map<string, string>();

	constructor(
		private readonly connection: Connection,
		private readonly documents: DocumentStore,
		private readonly workerUrl: string,
	) {
		connection.onDidSaveTextDocument(this.onDocumentSaved.bind(this));
		connection.onDidChangeConfiguration(() => {
			void this.refreshConfiguration();
		});
		connection.onDidChangeWatchedFiles(event => {
			void this.handleWatchedFiles(event);
		});
		documents.onDidChangeContent2(event => {
			void this.handleDocumentChange(event.document.uri, event.document.getText());
		});
	}

	async setMainFile(mainFileUri: string): Promise<void> {
		this.mainFile = mainFileUri;
		await this.refreshConfiguration();
		await this.refreshFileTree();
		await this.revalidateBeanCheck();
	}

	private async refreshConfiguration(): Promise<void> {
		const config = await this.connection.workspace.getConfiguration({ section: 'beanLsp' });
		const requested = (config?.enableBrowserWasmBeancount ?? 'off') as BrowserBeancountMode;
		if (requested === this.enabledMode) {
			return;
		}
		this.enabledMode = requested;
		if (this.enabledMode === 'off') {
			this.logger.info('Browser Beancount WASM diagnostics disabled.');
			this.workerClient?.dispose();
			this.workerClient = null;
			this.result = null;
			this.padFileCache.clear();
			globalEventBus.emit(GlobalEvents.BeancountUpdate);
			return;
		}
		await this.ensureWorker();
		await this.workerClient?.init(this.enabledMode);
		await this.refreshFileTree();
		await this.revalidateBeanCheck();
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
		if (!uri.endsWith('.bean') && !uri.endsWith('.beancount')) {
			return;
		}
		await this.syncFileUpdate(uri, content);
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
			if (!change.uri.endsWith('.bean') && !change.uri.endsWith('.beancount')) {
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

	private async syncFileUpdate(uri: string, content: string): Promise<void> {
		if (!this.workerClient) {
			return;
		}
		const name = this.normalizeFileName(uri);
		const previous = this.lastFileSnapshot.get(name);
		if (previous === content) {
			return;
		}
		this.lastFileSnapshot.set(name, content);
		await this.workerClient.sync([{ name, content }], []);
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

	private async runBeanCheck(): Promise<string | null> {
		if (!this.mainFile || this.enabledMode === 'off' || !this.workerClient) {
			return null;
		}
		const entryFile = this.normalizeFileName(this.mainFile);
		const result = await this.workerClient.beancheck(entryFile);
		return result;
	}

	private async revalidateBeanCheck(): Promise<void> {
		this.logger.info('running browser beancheck');
		const r = await this.runBeanCheck();
		if (!r) {
			return;
		}
		const parsed = JSON.parse(r) as BeancheckOutput;
		this.result = this.rewriteFileUris(parsed);
		this.padFileCache.clear();
		globalEventBus.emit(GlobalEvents.BeancountUpdate);
	}

	private onDocumentSaved(): void {
		if (!this.mainFile) {
			return;
		}
		this.revalidateBeanCheck();
	}

	getBalance(account: string, includeSubaccountBalance: boolean): Amount[] {
		let accountDetails = this.result?.general?.accounts?.[account] as AccountDetails | null;
		if (!accountDetails) {
			return [];
		}
		const balances = includeSubaccountBalance ? accountDetails.balance_incl_subaccounts : accountDetails.balance;
		return balances.map(balanceStr => this.parseAmountString(balanceStr));
	}

	getSubaccountBalances(account: string): Map<string, Amount[]> {
		const accounts = this.result?.general?.accounts;
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

	getPadAmounts(filePath: string, line: number): Amount[] {
		const pads = this.result?.pads;
		if (!pads) {
			return [];
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
