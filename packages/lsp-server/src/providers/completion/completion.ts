import { DepToken } from "src/ioc/tokens";
import { TreeParser } from "src/parser";
import { autoInjectable, inject } from "tsyringe";
import { CompletionItem, CompletionItemKind, CompletionParams, Connection, TextDocumentPositionParams } from "vscode-languageserver/node";

@autoInjectable()
export class CompletionProvider {
    constructor(@inject(DepToken.connection) private connection?: Connection,
        private parser?: TreeParser) { }
    onCompletion = async (params: CompletionParams): Promise<CompletionItem[]> => {
        this.connection?.console.log(JSON.stringify(params))
        const { textDocument, position, context } = params
        const { uri } = textDocument
        const tree = await this.parser!.getTreeByUri(uri);
        const node = tree.rootNode.namedDescendantForPosition({ row: position.line, column: position.character });
        this.connection?.console.log(node.type)

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