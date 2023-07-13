import { LRUCache } from "lru-cache";
import { inject, injectable, registry, singleton } from "tsyringe";
import type * as WebTreeSitter from "web-tree-sitter";
import type { Asyncify } from "type-fest";
import { getParser } from "@bean-lsp/shared";
import { Connection, TextDocuments } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { DepToken } from "./ioc/tokens";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

const CacheToken = Symbol("Cache");

@registry([{
    token: CacheToken,
    useValue: new LRUCache<string, WebTreeSitter.Tree>({ max: 50 })
}])
@injectable()
export class TreeParser {
    constructor(
        @inject(DepToken.documents) private documents?: TextDocuments<TextDocument>,
        @inject(CacheToken) private lruCache?: LRUCache<string, WebTreeSitter.Tree>,
        @inject(DepToken.connection) private connection?: Connection
    ) {
        try {
            getParser()
        } catch (err) {
            this.connection?.console.error(String(err));
        }
    }

    async getTreeByUri(uri: string): Promise<WebTreeSitter.Tree> {
        let tree = this.lruCache!.get(uri);
        const doc = this.documents?.get(uri);
        let text: string;
        if (!doc) {
            const existed = existsSync(new URL(uri));
            if (!existed) {
                throw new Error("document not found in uri: " + uri);
            }
            text = await readFile(new URL(uri), { encoding: 'utf-8' })
        } else {
            text = doc.getText()
        }
        tree = await this.parse(text, tree);
        // this.lruCache?.set(uri, tree);
        return tree as WebTreeSitter.Tree;


    }
    async getInstance() {
        return await getParser();
    }

    parse: Asyncify<WebTreeSitter['parse']> = async (input, previousTree, options) => {
        const parser = await this.getInstance();
        return parser.parse(input, previousTree, options);
    }

}