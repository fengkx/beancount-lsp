import { LANGUAGE_ID } from "@bean-lsp/shared";
import { DepToken } from "src/ioc/tokens";
import { autoInjectable, inject, singleton } from "tsyringe";
import { Connection, LRUCache, TextDocuments } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

@autoInjectable()
@singleton()
export class DocumentSettings {
    settingsCache: LRUCache<string, Thenable<Record<string, any>>>
    constructor(
        @inject(DepToken.connection) private connection?: Connection,
        @inject(DepToken.documents) private documents?: TextDocuments<TextDocument>
    ) {
        this.settingsCache = new LRUCache(50);
        documents?.onDidOpen((open) => {
            const uri = open.document.uri;
            const r = connection!.workspace.getConfiguration({
                scopeUri: uri,
                section: LANGUAGE_ID
            });
            this.settingsCache.set(uri, r)
        })

        documents?.onDidClose((close) => {
            const uri = close.document.uri;
            this.settingsCache.delete(uri)
        })
        connection!.onDidChangeConfiguration(change => {
            this.settingsCache.clear()
        })
    }


}