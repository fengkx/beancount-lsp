import { DocumentUri } from "vscode-languageserver";
import { TrieMap } from "mnemonist";
import { Nominal } from "nominal-types";
import { isInteresting } from "../common";
import mm from "micromatch";
import escapeRegExp from 'lodash.escaperegexp';
import { SymbolInfo, getAccountsDefinition, getAccountsUsage } from "./references";
import { Trees } from "../trees";
import { DocumentStore } from "../document-store";
import { SymbolInfoStorage } from "../startServer";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Feature } from "./types";

import { TreeQuery } from "../language";
import { URI, Utils as UriUtils } from "vscode-uri";


type SNText = Nominal<'SyntaxNodeText', string>;
// type DocUri = Nominal<'DocUri', DocumentUri>


class Queue {

    private readonly _queue = new Set<string>();

    enqueue(uri: string): void {
        if (isInteresting(uri) && !this._queue.has(uri)) {
            this._queue.add(uri);
            console.info(`addFile: ${uri} size:${this._queue.size}`)
        }
    }

    dequeue(uri: string): void {
        this._queue.delete(uri);
    }

    consume(n: number | undefined, filter: (uri: string) => boolean): string[] {
        if (n === undefined) {
            n = this._queue.size;
        }
        const result: string[] = [];
        console.info(`queue: size=${this._queue.size}`)
        for (const uri of this._queue) {
            if (!filter(uri)) {
                continue;
            }
            this._queue.delete(uri);
            if (result.push(uri) >= n) {
                break;
            }
        }
        return result;
    }
}


export class SymbolIndex {
    constructor(
        private readonly _documents: DocumentStore,
        private readonly _trees: Trees,
        private readonly _symbolInfoStorage: SymbolInfoStorage
    ) { }

    private readonly _syncQueue = new Queue();
    private readonly _asyncQueue = new Queue();
    // private readonly _suffixFilter = new SuffixFilter();


    addFile(uri: string): void {
        this._syncQueue.enqueue(uri);
        this._asyncQueue.dequeue(uri);
    }

    removeFile(uri: string): void {
        this._syncQueue.dequeue(uri);
        this._asyncQueue.dequeue(uri);
        // this.index.delete(uri);
    }

    async consume() {

        const uris = this._syncQueue.consume(50, () => {
            return true
        })

        console.info(`uris: ${JSON.stringify(uris)}`)

        await Promise.all(uris.map((uri) => this._createIndexTask(uri)()))
    }

    async startIndex() {
        await this.consume()
        console.log(JSON.stringify({ _q1: this._syncQueue, q2: this._asyncQueue }))
        console.log(`symbols: ${JSON.stringify(await this._symbolInfoStorage.findAsync({}))}`)
    }

    private _currentUpdate: Promise<void> | undefined;


    private _createIndexTask(uri: string): () => Promise<{ durationRetrieve: number, durationIndex: number }> {
        return async () => {
            console.log(`Running ${uri}`)
            // fetch document
            const _t1Retrieve = performance.now();
            const document = await this._documents.retrieve(uri);
            const durationRetrieve = performance.now() - _t1Retrieve;

            // remove current data
            await this._symbolInfoStorage.removeAsync({ _uri: uri }, { multi: true });

            // update index
            const _t1Index = performance.now();
            try {
                await this._doIndex(document);
            } catch (e: unknown) {
                console.log(`FAILED to index ${uri}, ${e}`);
            }
            const durationIndex = performance.now() - _t1Index;

            return { durationRetrieve, durationIndex };
        }
    }

    private async _doIndex(document: TextDocument) {
        const [accountUsages, accountDefinitions] = await Promise.all(
            [
                getAccountsUsage(document, this._trees),
                getAccountsDefinition(document, this._trees)
            ]
        );

        await this._symbolInfoStorage.removeAsync({ _uri: document.uri }, { multi: true });
        await Promise.all([this._symbolInfoStorage.insertAsync(accountUsages), this._symbolInfoStorage.insertAsync(accountDefinitions)])


        const tree = await this._trees.getParseTree(document);
        if (tree) {
            const captures = await TreeQuery.captures('(include (string) @path)', tree.rootNode);
            const includePatterns = captures.map(c => {
                const text = c.node.text;
                const stripedQuotationMark = text.replace(/^"/, '').replace(/"$/, '');
                const u = UriUtils.joinPath(UriUtils.dirname(URI.parse(document.uri)), stripedQuotationMark);
                return u.path
            });
            const beanFiles = this._documents.beanFiles;
            includePatterns.forEach((pattern) => {
                // pattern = escapeRegExp(pattern)
                const list = beanFiles.map(s => URI.parse(s).path);
                const matched = mm.match(list, pattern);
                matched.map(p => URI.file(p).toString()).forEach(uri => {
                    this.addFile(uri);
                })
            })

        }


    }


}