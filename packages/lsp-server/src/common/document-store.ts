import { CustomMessages, LANGUAGE_ID, Logger } from '@bean-lsp/shared';
import { LRUMapWithDelete as LRUMap } from 'mnemonist';
import {
	Connection,
	Emitter,
	Event,
	InitializeParams,
	Range,
	TextDocumentContentChangeEvent,
	TextDocuments,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI, Utils as UriUtils } from 'vscode-uri';

export interface TextDocumentChange2 {
	document: TextDocument;
	changes: {
		range: Range;
		rangeOffset: number;
		rangeLength: number;
		text: string;
	}[];
}

// @ts-expect-error intentionally override the get method to private
export class DocumentStore extends TextDocuments<TextDocument> {
	private readonly _decoder = new TextDecoder();

	private readonly _onDidChangeContent2 = new Emitter<TextDocumentChange2>();
	readonly onDidChangeContent2: Event<TextDocumentChange2> = this._onDidChangeContent2.event;

	private _beanFiles: string[] = [];
	private readonly _initializeParams: InitializeParams;

	private logger = new Logger('DocumentStore');

	constructor(
		private readonly _connection: Connection,
		initializeParams: InitializeParams,
		private readonly _isBrowser: boolean,
	) {
		super({
			create: TextDocument.create,
			update: (doc, changes, version) => {
				let incremental = true;
				const event: TextDocumentChange2 = { document: doc, changes: [] };
				const result = TextDocument.update(doc, changes, version);
				for (const change of changes) {
					if (!TextDocumentContentChangeEvent.isIncremental(change)) {
						incremental = false;
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
				if (incremental) {
					this._onDidChangeContent2.fire(event);
				}

				return result;
			},
		});
		this.listen(_connection);
		this._initializeParams = initializeParams;
	}

	private readonly _documentsCache = new LRUMap<string, TextDocument>(200);

	async refetchBeanFiles(): Promise<void> {
		// Check if client supports ListBeanFile capability
		// @ts-expect-error customMessage is not part of the protocol
		if (!this._initializeParams?.capabilities?.customMessage?.[CustomMessages.ListBeanFile]) {
			if (!this._isBrowser) {
				// find beancount files throgh nodejs
			}
			this.logger.warn('Client does not support ListBeanFile capability');
			return;
		}

		const files = await this._connection.sendRequest<string[]>(CustomMessages.ListBeanFile);
		this._beanFiles = files;
	}

	get beanFiles(): string[] {
		return this._beanFiles;
	}

	private override get(uri: string): TextDocument | undefined {
		return super.get(uri);
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
		const reply = await this._connection.sendRequest<number[]>(CustomMessages.FileRead, uri);
		const bytes = new Uint8Array(reply);
		return TextDocument.create(uri, LANGUAGE_ID, 1, this._decoder.decode(bytes));
	}

	removeFile(uri: string): boolean {
		return this._documentsCache.delete(uri);
	}

	private async getConfiguration() {
		const config = await this._connection.workspace.getConfiguration({ section: 'beanLsp' });
		this.logger.info(config);
		return config;
	}

	public async getMainBeanFileUri(): Promise<string | null> {
		const config = await this.getConfiguration();
		const workspace = await this._connection.workspace.getWorkspaceFolders();

		if (!workspace) {
			// just open a file
			return null;
		}

		if (workspace && !config.manBeanFile) {
			this._connection!.window.showWarningMessage(
				`Using default 'main.bean' as manBeanFile, You should configure 'beanLsp.manBeanFile'`,
			);
		}
		const rootUri = workspace[0]?.uri;

		if (!rootUri) {
			return null;
		}

		const mainAbsPath = UriUtils.joinPath(URI.parse(rootUri), config.manBeanFile ?? 'main.bean');

		return mainAbsPath.toString() as string;
	}
}
