import { getParser } from '@bean-lsp/shared';
import { LRUMapWithDelete as LRUMap } from 'mnemonist';
import { Disposable, Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from 'web-tree-sitter';
import { DocumentStore, TextDocumentChange2 } from './document-store';

class Entry {
	constructor(
		public version: number,
		public tree: Parser.Tree,
		public edits: Parser.Edit[][],
	) {}
}

export class Trees {
	private readonly _cache = new LRUMap<string, Entry>(100);

	private readonly _listener: Disposable[] = [];

	private readonly _webTreeSitterWasmPath?: string;

	constructor(private readonly _documents: DocumentStore, webTreeSitterWasmPath: string) {
		// build edits when document changes
		this._listener.push(_documents.onDidChangeContent2(e => {
			const info = this._cache.get(e.document.uri);
			if (info) {
				info.edits.push(Trees.asEdits(e));
			}
		}));
		this._webTreeSitterWasmPath = webTreeSitterWasmPath;
	}
	private static async getParserInstance(webTreeSitterWasmPath?: string) {
		const parser = await getParser(webTreeSitterWasmPath);
		return parser;
	}

	async getParseTree(documentOrUri: TextDocument | string): Promise<Parser.Tree | undefined> {
		if (typeof documentOrUri === 'string') {
			documentOrUri = await this._documents.retrieve(documentOrUri);
		}
		const parser = await Trees.getParserInstance(this._webTreeSitterWasmPath);
		let info = this._cache.get(documentOrUri.uri);
		try {
			const version = documentOrUri.version;
			const text = documentOrUri.getText();

			if (info?.version === documentOrUri.version) {
				return info.tree;
			}

			if (!info) {
				// never seen before, parse fresh
				const tree = parser.parse(text);
				info = new Entry(version, tree, []);
				this._cache.set(documentOrUri.uri, info);
			} else {
				// existing entry, apply deltas and parse incremental
				const oldTree = info.tree;

				const deltas = info.edits.flat();
				deltas.forEach(delta => oldTree.edit(delta));
				info.edits.length = 0;

				info.tree = parser.parse(text, oldTree);
				info.version = version;
				oldTree.delete();
			}

			return info.tree;
		} catch (e) {
			const errorObj = e as Error;
			console.error(`[trees] Error parsing document: ${documentOrUri.uri} ${errorObj} ${errorObj.stack || ''}`);
			console.error(`[trees] Error parsing text: ${documentOrUri.getText()}`);
			this._cache.delete(documentOrUri.uri);
			return undefined;
		}
	}

	private static asEdits(event: TextDocumentChange2): Parser.Edit[] {
		return event.changes.map(change => ({
			startPosition: this.asTsPoint(change.range.start),
			oldEndPosition: this.asTsPoint(change.range.end),
			newEndPosition: this.asTsPoint(event.document.positionAt(change.rangeOffset + change.text.length)),
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
