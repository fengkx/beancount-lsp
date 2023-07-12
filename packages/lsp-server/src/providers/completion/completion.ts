import { DepToken } from "src/ioc/tokens";
import { autoInjectable, inject } from "tsyringe";
import { CompletionItem, CompletionItemKind, Connection, TextDocumentPositionParams } from "vscode-languageserver/node";

@autoInjectable()
export class CompletionProvider {
    constructor(@inject(DepToken.connection) private connection?: Connection) { }
    onCompletion = async (textDocumentPosition: TextDocumentPositionParams): Promise<CompletionItem[]> => {
        this.connection?.console.log(JSON.stringify(textDocumentPosition))
        const { textDocument } = textDocumentPosition
        const { uri } = textDocument
        // The pass parameter contains the position of the text document in
        // which code complete got requested. For the example we ignore this
        // info and always provide the same completion items.
        return [
            {
                label: 'TypeScript',
                kind: CompletionItemKind.Text,
                data: 1
            },
            {
                label: 'JavaScript',
                kind: CompletionItemKind.Text,
                data: 2
            }
        ];
    }
}