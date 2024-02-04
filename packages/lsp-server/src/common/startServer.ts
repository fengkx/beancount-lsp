import { Connection, InitializeParams, InitializeResult, TextDocumentSyncKind } from "vscode-languageserver";
import { getParser } from "@bean-lsp/shared";
import { Feature } from "./features/types";
import { DocumentStore } from "./document-store";
import { Trees } from "./trees";
import { SemanticTokenFeature } from "./features/semantic-token";
import { FoldingRangeFeature } from "./features/folding-ranges";
import { CompletionFeature } from "./features/completions";
import { SelectionRangesFeature } from "./selection-ranges";

export function startServer(connection: Connection) {
    console.log = connection.console.log.bind(connection.console);
    console.warn = connection.console.warn.bind(connection.console);
    console.error = connection.console.error.bind(connection.console);

    const features: Feature[] = [];



    connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {

        try {
            await getParser();
        } catch (err) {
            connection.console.error(String(err))
        }

        const documents = new DocumentStore(connection);
        const trees = new Trees(documents);
        features.push(new SemanticTokenFeature(documents, trees));
        features.push(new FoldingRangeFeature(documents, trees));
        features.push(new CompletionFeature(documents, trees));
        features.push(new SelectionRangesFeature(documents, trees))


        return {
            capabilities: { textDocumentSync: TextDocumentSyncKind.Incremental }
        }
    })

    connection.onInitialized(async () => {
        for (const feature of features) {
            feature.register(connection);
        }
    })

}