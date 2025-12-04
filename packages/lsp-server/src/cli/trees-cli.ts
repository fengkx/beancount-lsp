import { getParser } from '@bean-lsp/shared';
import { LRUMapWithDelete as LRUMap } from 'mnemonist';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from 'web-tree-sitter';
import type { DocumentStoreCLI } from './document-store-cli';

class Entry {
	constructor(
		public version: number,
		public tree: Parser.Tree,
	) {}
}

/**
 * CLI version of Trees that works with DocumentStoreCLI
 * Simplified version without incremental parsing (not needed for CLI)
 */
export class TreesCLI {
	private readonly _cache = new LRUMap<string, Entry>(100);

	constructor(
		private readonly _documents: DocumentStoreCLI,
	) {}

	public invalidateCache(uri: string) {
		this._cache.delete(uri);
	}

	private static async getParserInstance() {
		const parser = await getParser();
		return parser;
	}

	async getParseTree(
		documentOrUri: TextDocument | string,
	): Promise<Parser.Tree | undefined> {
		if (typeof documentOrUri === 'string') {
			documentOrUri = await this._documents.retrieve(documentOrUri);
		}

		const parser = await TreesCLI.getParserInstance();
		let info = this._cache.get(documentOrUri.uri);

		try {
			const version = documentOrUri.version;
			const text = documentOrUri.getText();

			if (info?.version === documentOrUri.version) {
				return info.tree;
			}

			// Parse the document
			const tree = parser.parse(text);
			info = new Entry(version, tree);
			this._cache.set(documentOrUri.uri, info);

			return info.tree;
		} catch (e) {
			const errorObj = e as Error;
			console.error(
				`[trees-cli] Error parsing document: ${documentOrUri.uri} ${errorObj} ${errorObj.stack || ''}`,
			);
			this._cache.delete(documentOrUri.uri);
			return undefined;
		}
	}
}

