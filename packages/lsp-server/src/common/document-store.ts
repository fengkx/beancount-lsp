import { CustomMessages, LANGUAGE_ID, Logger } from '@bean-lsp/shared';
import { LRUMapWithDelete as LRUMap } from 'mnemonist';
import {
	Connection,
	Emitter,
	Event,
	InitializeParams,
	Range,
	TextDocumentChangeEvent,
	TextDocumentContentChangeEvent,
	TextDocuments,
	WorkspaceFolder,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI, Utils as UriUtils } from 'vscode-uri';

export interface TextDocumentChange2 {
	document: TextDocument;
	/** True when the client replaced the complete document instead of sending ranges. */
	fullContent: boolean;
	changes: {
		range: Range;
		rangeOffset: number;
		rangeLength: number;
		text: string;
	}[];
}

export interface AdaptiveDebounceOptions {
	/** Minimum delay in milliseconds. Default: 150 */
	minDelayMs?: number;
	/** Maximum delay in milliseconds. Default: 15 * 1000 */
	maxDelayMs?: number;
	/** Multiplier applied to last handler duration to compute next delay. Default: 2 */
	multiplier?: number;
}

// @ts-expect-error intentionally override the get method to private
export class DocumentStore extends TextDocuments<TextDocument> {
	private readonly _decoder = new TextDecoder();

	private readonly _onDidChangeContent2 = new Emitter<TextDocumentChange2>();
	readonly onDidChangeContent2: Event<TextDocumentChange2> = this._onDidChangeContent2.event;

	private _beanFiles: string[] = [];
	private _initializeParams: InitializeParams | undefined;

	private logger = new Logger('DocumentStore');

	constructor(
		private readonly _connection: Connection,
	) {
		super({
			create: TextDocument.create,
			update: (doc, changes, version) => {
				const event: TextDocumentChange2 = { document: doc, fullContent: false, changes: [] };
				const result = TextDocument.update(doc, changes, version);
				event.document = result;
				for (const change of changes) {
					if (!TextDocumentContentChangeEvent.isIncremental(change)) {
						event.fullContent = true;
						break;
					}
					const rangeOffset = doc.offsetAt(change.range.start);
					event.changes.push({
						text: change.text,
						range: change.range,
						rangeOffset,
						rangeLength: change.rangeLength ?? doc.offsetAt(change.range.end) - rangeOffset,
					});
				}
				this._onDidChangeContent2.fire(event);

				return result;
			},
		});
		this.listen(_connection);
	}

	/**
	 * Create an adaptive debounced listener from a source Event.
	 * The debounce delay dynamically adapts to the last handler execution time.
	 */
	private _createAdaptiveDebouncedListener<T>(
		source: Event<T>,
		listener: (e: T) => void | Promise<void>,
		getKey: (e: T) => string,
		options?: AdaptiveDebounceOptions,
	) {
		const minDelay = options?.minDelayMs ?? 150;
		const maxDelay = options?.maxDelayMs ?? 15 * 1000;
		const multiplier = options?.multiplier ?? 2;

		type DebounceState = {
			lastDurationMs: number;
			timer?: ReturnType<typeof setTimeout>;
			latestEvent?: T;
			running: boolean;
		};

		const states = new Map<string, DebounceState>();
		let disposed = false;

		const schedule = (state: DebounceState) => {
			if (state.running) return;
			if (state.timer) clearTimeout(state.timer);
			const delay = Math.max(minDelay, Math.min(maxDelay, state.lastDurationMs));
			state.timer = setTimeout(async () => {
				state.timer = undefined;
				if (disposed || state.latestEvent === undefined) return;

				const event = state.latestEvent;
				state.latestEvent = undefined;
				state.running = true;
				const started = Date.now();
				try {
					await Promise.resolve(listener(event));
				} catch (err) {
					this.logger.debug(`adaptive debounced listener error: ${String(err)}`);
				} finally {
					const duration = Date.now() - started;
					state.lastDurationMs = Math.max(
						minDelay,
						Math.min(maxDelay, Math.floor(duration * multiplier)),
					);
					state.running = false;
					if (!disposed && state.latestEvent !== undefined) {
						schedule(state);
					}
				}
			}, delay);
		};

		const subscription = source(e => {
			const key = getKey(e);
			let state = states.get(key);
			if (!state) {
				state = {
					lastDurationMs: minDelay,
					running: false,
				};
				states.set(key, state);
			}
			state.latestEvent = e;
			schedule(state);
		});

		return {
			dispose: () => {
				disposed = true;
				for (const state of states.values()) {
					if (state.timer) clearTimeout(state.timer);
				}
				states.clear();
				// subscription is a Disposable-like with dispose()
				(subscription as unknown as { dispose: () => void }).dispose();
			},
		};
	}

	/**
	 * Debounced content change listener using the base TextDocuments onDidChangeContent.
	 * The debounce delay is adapted from the handler execution time.
	 */
	onDidChangeContentDebounced(
		listener: (e: TextDocumentChangeEvent<TextDocument>) => void | Promise<void>,
		options?: AdaptiveDebounceOptions,
	) {
		return this._createAdaptiveDebouncedListener(
			this.onDidChangeContent as unknown as Event<TextDocumentChangeEvent<TextDocument>>,
			listener,
			e => e.document.uri,
			options,
		);
	}

	public setInitializeParams(initializeParams: InitializeParams) {
		this._initializeParams = initializeParams;
	}

	private readonly _documentsCache = new LRUMap<string, TextDocument>(200);

	async refetchBeanFiles(workspaceFolder?: WorkspaceFolder): Promise<void> {
		// Check if client supports ListBeanFile capability
		// @ts-expect-error customMessage is not part of the protocol
		if (!this._initializeParams?.capabilities?.customMessage?.[CustomMessages.ListBeanFile]) {
			const folders = workspaceFolder
				? [workspaceFolder]
				: (this._initializeParams?.workspaceFolders ?? []);
			if (folders.length === 0) {
				this._beanFiles = [];
				return;
			}
			const files = await Promise.all(folders.map(folder => this.fallbackListBeanFiles(folder)));
			this._beanFiles = [...new Set(files.flat())];
			return;
		}

		const files = await this._connection.sendRequest<string[]>(
			CustomMessages.ListBeanFile,
			workspaceFolder ? { workspaceUri: workspaceFolder.uri } : undefined,
		);
		this._beanFiles = workspaceFolder
			? files.filter(uri => this.isUriWithin(uri, workspaceFolder.uri))
			: files;
	}

	protected async fallbackListBeanFiles(_workspaceFolder: WorkspaceFolder): Promise<string[]> {
		this.logger.warn('Client does not support ListBeanFile capability');
		return this.all().map(doc => doc.uri);
	}

	get beanFiles(): string[] {
		return this._beanFiles;
	}

	getBeanFilesFor(workspaceUri: string): string[] {
		return this._beanFiles.filter(uri => this.isUriWithin(uri, workspaceUri));
	}

	private override get(uri: string): TextDocument | undefined {
		return super.get(uri);
	}

	public isOpen(uri: string): boolean {
		return this.get(uri) !== undefined;
	}

	async retrieve(uri: string): Promise<TextDocument> {
		const result = this.get(uri);
		if (result) {
			return result;
		}

		let cached = this._documentsCache.get(uri);

		if (!cached) {
			cached = await this._requestDocument(uri);
			this._documentsCache.set(uri, cached);
		}
		return cached;
	}

	private async _requestDocument(uri: string): Promise<TextDocument> {
		const reply = await this.fileRead(uri);
		const bytes = new Uint8Array(reply);
		return TextDocument.create(uri, LANGUAGE_ID, 1, this._decoder.decode(bytes));
	}

	private async fileRead(uri: string): Promise<ArrayBuffer> {
		// Check if client supports FileRead capability
		// @ts-expect-error customMessage is not part of the protocol
		if (!this._initializeParams?.capabilities?.customMessage?.[CustomMessages.FileRead]) {
			return this.fallbackFileRead(uri);
		}
		return this._connection.sendRequest<ArrayBuffer>(CustomMessages.FileRead, uri);
	}

	protected async fallbackFileRead(_uri: string): Promise<ArrayBuffer> {
		this.logger.warn('Client does not support FileRead capability');
		return new ArrayBuffer(0);
	}

	removeFile(uri: string): boolean {
		return this._documentsCache.delete(uri);
	}

	private async getConfiguration(scopeUri?: string) {
		const config = await this._connection.workspace.getConfiguration({
			scopeUri,
			section: 'beanLsp',
		});
		this.logger.info(config);
		return config;
	}

	public async getWorkspaceFolderFor(scopeUri?: string): Promise<WorkspaceFolder | null> {
		const workspace = await this._connection.workspace.getWorkspaceFolders();
		if (!workspace || workspace.length === 0) {
			return null;
		}
		if (!scopeUri) {
			return workspace.length === 1 ? workspace[0]! : null;
		}
		return workspace
			.filter(folder => this.isUriWithin(scopeUri, folder.uri))
			.sort((left, right) => right.uri.length - left.uri.length)[0] ?? null;
	}

	public async getMainBeanFileUriFor(scopeUri?: string): Promise<string | null> {
		const workspaceFolder = await this.getWorkspaceFolderFor(scopeUri);
		if (!workspaceFolder) return null;
		const rootUri = workspaceFolder.uri;

		// Use workspace folder URI as scopeUri for configuration
		const config = await this.getConfiguration(rootUri);

		if (!config.mainBeanFile) {
			this._connection!.window.showWarningMessage(
				`Using default 'main.bean' as mainBeanFile, You should configure 'beanLsp.mainBeanFile'`,
			);
		}

		const mainAbsPath = UriUtils.joinPath(URI.parse(rootUri), config.mainBeanFile ?? 'main.bean');

		return mainAbsPath.toString() as string;
	}

	public async getMainBeanFileUri(): Promise<string | null> {
		return this.getMainBeanFileUriFor();
	}

	private isUriWithin(candidate: string, parent: string): boolean {
		const normalizedParent = parent.endsWith('/') ? parent : `${parent}/`;
		return candidate === parent || candidate.startsWith(normalizedParent);
	}
}
