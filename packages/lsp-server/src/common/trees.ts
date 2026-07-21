import { getParser, Logger } from '@bean-lsp/shared';
import { LRUMapWithDelete as LRUMap } from 'mnemonist';
import { Disposable, Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from 'web-tree-sitter';
import { DocumentStore, TextDocumentChange2 } from './document-store';

// Create a logger for the trees module
const logger = new Logger('trees');

class Entry {
	private readers = 0;
	private retired = false;
	private deleted = false;

	constructor(
		public version: number,
		public tree: Parser.Tree,
		public edits: Parser.Edit[][],
	) {}

	acquire(): () => void {
		if (this.retired) {
			throw new Error('Cannot acquire a retired parse tree');
		}
		this.readers++;
		let released = false;
		return () => {
			if (released) return;
			released = true;
			this.readers--;
			this.deleteIfUnused();
		};
	}

	retire(): void {
		this.retired = true;
		this.deleteIfUnused();
	}

	private deleteIfUnused(): void {
		if (!this.retired || this.readers > 0 || this.deleted) return;
		this.deleted = true;
		this.tree.delete();
	}
}

export interface ParseTreeLease extends Disposable {
	readonly tree: Parser.Tree;
}

export class Trees {
	private readonly _cache = new LRUMap<string, Entry>(100);
	private readonly _parseQueue = new Map<string, Promise<Entry | undefined>>();
	private readonly _epochs = new Map<string, number>();

	private readonly _listener: Disposable[] = [];

	constructor(
		private readonly _documents: DocumentStore,
	) {
		// build edits when document changes
		this._listener.push(
			_documents.onDidChangeContent2((e) => {
				if (e.fullContent) {
					this.invalidateCache(e.document.uri);
					return;
				}
				const info = this._cache.get(e.document.uri);
				if (info) {
					info.edits.push(Trees.asEdits(e));
				}
			}),
		);
	}

	public invalidateCache(uri: string) {
		this._epochs.set(uri, (this._epochs.get(uri) ?? 0) + 1);
		const entry = this._cache.remove<Entry | undefined>(uri);
		entry?.retire();
	}

	private static async getParserInstance() {
		const parser = await getParser();
		return parser;
	}

	async acquireParseTree(
		documentOrUri: TextDocument | string,
	): Promise<ParseTreeLease | undefined> {
		if (typeof documentOrUri === 'string') {
			documentOrUri = await this._documents.retrieve(documentOrUri);
		}
		const entry = await this.getOrCreateEntry(documentOrUri);
		if (!entry) return undefined;

		const release = entry.acquire();
		return {
			tree: entry.tree,
			dispose: release,
		};
	}

	async withParseTree<T>(
		documentOrUri: TextDocument | string,
		callback: (tree: Parser.Tree) => T | Promise<T>,
	): Promise<T | undefined> {
		const lease = await this.acquireParseTree(documentOrUri);
		if (!lease) return undefined;
		try {
			return await callback(lease.tree);
		} finally {
			lease.dispose();
		}
	}

	dispose(): void {
		for (const listener of this._listener.splice(0)) listener.dispose();
		for (const entry of this._cache.values()) entry.retire();
		this._cache.clear();
		this._parseQueue.clear();
	}

	private async getOrCreateEntry(document: TextDocument): Promise<Entry | undefined> {
		const cached = this._cache.get(document.uri);
		if (cached?.version === document.version) return cached;
		if (cached && cached.version > document.version) return undefined;

		const queued = this._parseQueue.get(document.uri);
		if (queued) {
			await queued;
			return this.getOrCreateEntry(document);
		}

		const epoch = this._epochs.get(document.uri) ?? 0;
		const pending = this.parseAndCache(document, epoch);
		this._parseQueue.set(document.uri, pending);
		try {
			return await pending;
		} finally {
			if (this._parseQueue.get(document.uri) === pending) {
				this._parseQueue.delete(document.uri);
			}
		}
	}

	private async parseAndCache(document: TextDocument, epoch: number): Promise<Entry | undefined> {
		let incrementalBase: Parser.Tree | undefined;
		try {
			const parser = await Trees.getParserInstance();
			if ((this._epochs.get(document.uri) ?? 0) !== epoch) return undefined;

			const current = this._cache.get(document.uri);
			if (current?.version === document.version) return current;
			if (current && current.version > document.version) return undefined;

			const text = document.getText();
			const canParseIncrementally = current
				&& current.edits.length > 0
				&& current.edits.every(edits => edits.length === 1);
			let tree: Parser.Tree;
			if (canParseIncrementally) {
				incrementalBase = current.tree.copy();
				for (const [delta] of current.edits) incrementalBase.edit(delta!);
				tree = parser.parse(text, incrementalBase);
			} else {
				tree = parser.parse(text);
			}

			const next = new Entry(document.version, tree, []);
			const replaced = this._cache.setpop(document.uri, next);
			replaced?.value.retire();
			return next;
		} catch (e) {
			const errorObj = e as Error;
			logger.error(
				`Error parsing document: ${document.uri} ${errorObj} ${errorObj.stack || ''}`,
			);
			logger.debug(`Error parsing text: ${document.getText()}`);
			this.invalidateCache(document.uri);
			return undefined;
		} finally {
			incrementalBase?.delete();
		}
	}

	private static asEdits(event: TextDocumentChange2): Parser.Edit[] {
		return event.changes.map((change) => ({
			startPosition: this.asTsPoint(change.range.start),
			oldEndPosition: this.asTsPoint(change.range.end),
			newEndPosition: this.asTsPoint(
				event.document.positionAt(change.rangeOffset + change.text.length),
			),
			startIndex: change.rangeOffset,
			oldEndIndex: change.rangeOffset + change.rangeLength,
			newEndIndex: change.rangeOffset + change.text.length,
		}));
	}

	private static asTsPoint(position: Position): Parser.Point {
		const { line: row, character: column } = position;
		return { row, column };
	}
}
