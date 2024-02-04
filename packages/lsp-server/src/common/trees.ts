import { LRUMapWithDelete as LRUMap } from "mnemonist";
import Parser from "web-tree-sitter";
import { Disposable, Position } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { DocumentStore, TextDocumentChange2 } from "./document-store";
import { getParser } from "@bean-lsp/shared";


class Entry {
    constructor(
        public version: number,
        public tree: Parser.Tree,

        public edits: Parser.Edit[][]
    ) { }
}


export class Trees {
    private readonly _cache = new LRUMap<string, Entry>(100);

    private readonly _listener: Disposable[] = [];

    private _parser: Parser | undefined;

    constructor(private readonly _documents: DocumentStore) {

        // build edits when document changes
        this._listener.push(_documents.onDidChangeContent2(e => {
            const info = this._cache.get(e.document.uri);
            if (info) {
                info.edits.push(Trees.asEdits(e));
            }
        }));
    }
    private static async getParserInstance() {
        const parser = await getParser();
        return parser
    }

    async getParseTree(documentOrUri: TextDocument | string): Promise<Parser.Tree | undefined> {
        if (typeof documentOrUri === 'string') {
            documentOrUri = await this._documents.retrieve(documentOrUri);
        }
        try {
            const version = documentOrUri.version;
            const text = documentOrUri.getText();

            let info = this._cache.get(documentOrUri.uri);
            if (info?.version === documentOrUri.version) {
                return info.tree;
            }

            const parser = await Trees.getParserInstance();
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
            newEndIndex: change.rangeOffset + change.text.length
        }));
    }

    private static asTsPoint(position: Position): Parser.Point {
        const { line: row, character: column } = position;
        return { row, column };
    }

}