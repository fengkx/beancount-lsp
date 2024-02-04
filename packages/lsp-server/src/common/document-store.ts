import { LANGUAGE_ID } from "@bean-lsp/shared";
import { LRUMapWithDelete as LRUMap } from "mnemonist";
import { Connection, TextDocuments } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Utils as UriUtils, URI } from 'vscode-uri'



export class DocumentStore extends TextDocuments<TextDocument> {
    constructor(private readonly _connection: Connection) {
        super({
            create: TextDocument.create,
            update: TextDocument.update,
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
        const workspace = await this._connection!.workspace.getWorkspaceFolders();

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