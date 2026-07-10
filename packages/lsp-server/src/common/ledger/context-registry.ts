import { Logger } from '@bean-lsp/shared';
import { Connection, FileChangeType, WorkspaceFolder } from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import { DocumentStore } from '../document-store';
import { SourceSnapshotService } from './source-snapshot-service';

export interface LedgerSourceContext {
	id: string;
	workspace: WorkspaceFolder;
	mainFileUri: string;
	sources: SourceSnapshotService;
}

export class LedgerContextRegistry {
	private readonly logger = new Logger('LedgerContextRegistry');
	private readonly contexts = new Map<string, LedgerSourceContext>();
	private initialized = false;
	private readonly subscriptions: Array<{ dispose(): void }> = [];

	constructor(
		private readonly connection: Connection,
		private readonly documents: DocumentStore,
	) {}

	get all(): readonly LedgerSourceContext[] {
		return [...this.contexts.values()];
	}

	async initialize(): Promise<void> {
		const folders = await this.connection.workspace.getWorkspaceFolders() ?? [];
		await this.documents.refetchBeanFiles();
		for (const folder of folders) await this.createOrReplaceContext(folder);
		if (!this.initialized) {
			this.registerListeners();
			this.initialized = true;
		}
	}

	async refreshConfiguration(): Promise<void> {
		const folders = await this.connection.workspace.getWorkspaceFolders() ?? [];
		const active = new Set(folders.map(folder => folder.uri));
		for (const [workspaceUri, context] of this.contexts) {
			if (!active.has(workspaceUri)) {
				context.sources.dispose();
				this.contexts.delete(workspaceUri);
			}
		}
		await this.documents.refetchBeanFiles();
		for (const folder of folders) await this.createOrReplaceContext(folder);
	}

	forDocument(uri: string): LedgerSourceContext | null {
		return [...this.contexts.values()]
			.filter(context => this.isUriWithin(uri, context.workspace.uri))
			.sort((left, right) => right.workspace.uri.length - left.workspace.uri.length)[0] ?? null;
	}

	forWorkspace(workspaceUri: string): LedgerSourceContext | null {
		return this.contexts.get(workspaceUri) ?? null;
	}

	private async createOrReplaceContext(folder: WorkspaceFolder): Promise<void> {
		const mainFileUri = await this.documents.getMainBeanFileUriFor(folder.uri);
		if (!mainFileUri) return;
		const existing = this.contexts.get(folder.uri);
		if (existing?.mainFileUri === mainFileUri) {
			await existing.sources.reset(this.documents.getBeanFilesFor(folder.uri));
			return;
		}
		existing?.sources.dispose();
		const sources = new SourceSnapshotService(this.documents, folder.uri, mainFileUri);
		await sources.reset(this.documents.getBeanFilesFor(folder.uri));
		this.contexts.set(folder.uri, {
			id: sources.snapshot.contextId,
			workspace: folder,
			mainFileUri,
			sources,
		});
		this.logger.info(`created context=${sources.snapshot.contextId}`);
	}

	private registerListeners(): void {
		this.subscriptions.push(this.documents.onDidOpen(event => {
			this.updateFromDocument(event.document.uri, event.document.getText(), event.document.version);
		}));
		this.subscriptions.push(this.documents.onDidChangeContent(event => {
			this.updateFromDocument(event.document.uri, event.document.getText(), event.document.version);
		}));
		this.subscriptions.push(this.documents.onDidClose(event => {
			const context = this.forDocument(event.document.uri);
			if (!context) return;
			this.documents.removeFile(event.document.uri);
			void this.documents.retrieve(event.document.uri)
				.then(document => context.sources.update(event.document.uri, document.getText(), undefined, 'disk'))
				.catch(error => this.logger.debug(`failed to refresh closed document: ${String(error)}`));
		}));
		this.subscriptions.push(this.connection.onDidChangeWatchedFiles(event => {
			for (const change of event.changes) {
				const context = this.forDocument(change.uri);
				if (!context) continue;
				if (change.type === FileChangeType.Deleted) {
					context.sources.remove(change.uri);
					continue;
				}
				this.documents.removeFile(change.uri);
				void this.documents.retrieve(change.uri)
					.then(document => context.sources.update(change.uri, document.getText(), undefined, 'disk'))
					.catch(error => this.logger.debug(`failed to refresh watched document: ${String(error)}`));
			}
		}));
	}

	private updateFromDocument(uri: string, text: string, version: number): void {
		this.forDocument(uri)?.sources.update(uri, text, version, 'open-buffer');
	}

	private isUriWithin(candidate: string, parent: string): boolean {
		try {
			const candidateUri = URI.parse(candidate).toString();
			const parentUri = URI.parse(parent).toString();
			const normalizedParent = parentUri.endsWith('/') ? parentUri : `${parentUri}/`;
			return candidateUri === parentUri || candidateUri.startsWith(normalizedParent);
		} catch {
			return false;
		}
	}

	dispose(): void {
		for (const subscription of this.subscriptions.splice(0)) subscription.dispose();
		for (const context of this.contexts.values()) context.sources.dispose();
		this.contexts.clear();
	}
}
