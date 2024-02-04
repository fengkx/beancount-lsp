import { LANGUAGE_ID } from "@bean-lsp/shared";
import { LRUMapWithDelete as LRUMap } from "mnemonist";
import { Connection, TextDocuments, Range, Emitter, TextDocumentContentChangeEvent } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Utils as UriUtils, URI } from 'vscode-uri'

export interface TextDocumentChange2 {
    document: TextDocument,
    changes: {
        range: Range;
        rangeOffset: number;
        rangeLength: number;
        text: string;
    }[]
}

export class DocumentStore extends TextDocuments<TextDocument> {

    private readonly _onDidChangeContent2 = new Emitter<TextDocumentChange2>();
    readonly onDidChangeContent2 = this._onDidChangeContent2.event;

    constructor(private readonly _connection: Connection) {
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
    }
    private readonly _documentsCache = new LRUMap<string, TextDocument>(200)





    async retrieve(uri: string): Promise<TextDocument> {
        const result = this.get(uri);
        return result!;

        // let cached = this._documentsCache.get(uri);
        // if (!cached) {
        //     cached = this._requestDocument(uri)
        //     result = undefined
        // }
    }

    removeFile(uri: string) {
        return this._documentsCache.delete(uri);
    }

    private async getConfiguration() {
        const config = await this._connection.workspace.getConfiguration({ section: LANGUAGE_ID });
        console.info(config);
        return config
    }

    public async getMainBeanFileUri(): Promise<string | null> {
        const config = await this.getConfiguration();
        const workspace = await this._connection.workspace.getWorkspaceFolders();

        if (!workspace) {
            // just open a file
            return null
        }

        if (workspace && !config.mainBeanFile) {
            this._connection!.window.showWarningMessage(`Using default 'main.bean' as mainBeanFile, You should configure 'beancount.mainBeanFile'`)
        }
        const rootUri = workspace[0].uri;

        const mainAbsPath = UriUtils.joinPath(URI.parse(rootUri), config.mainBeanFile ?? 'main.bean');


        return mainAbsPath.toString();

    }

}