import { Connection, InitializeParams, InitializeResult, TextDocumentSyncKind } from "vscode-languageserver";
import { getParser } from "@bean-lsp/shared";
import { Feature } from "./features/types";
export function startServer(connection: Connection) {
    console.log = connection.console.log.bind(connection.console);
    console.warn = connection.console.warn.bind(connection.console);
    console.error = connection.console.error.bind(connection.console);

    const features: Feature[] = [];

    connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {

        return {
            capabilities: { textDocumentSync: TextDocumentSyncKind.Incremental }
        }
    })

    connection.onInitialized(async () => {
        try {
            await getParser();
        } catch (err) {
            connection.console.error(String(err))
        }
    })

}