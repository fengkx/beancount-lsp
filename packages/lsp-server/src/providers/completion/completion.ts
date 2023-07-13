import { BeanDocuments } from "src/bean-documents";
import { DepToken } from "src/ioc/tokens";
import { TreeParser } from "src/parser";
import { autoInjectable, inject } from "tsyringe";
import { CompletionItem, CompletionItemKind, CompletionParams, Connection, TextDocumentPositionParams } from "vscode-languageserver/node";

@autoInjectable()
export class CompletionProvider {
    constructor(@inject(DepToken.connection) private connection?: Connection,
        private beanDocuments?: BeanDocuments
    ) { }
    onCompletion = async (params: CompletionParams): Promise<CompletionItem[]> => {
        this.connection?.console.log(JSON.stringify(params))
        const { textDocument, position, context } = params
        const { uri } = textDocument
        const document = await this.beanDocuments!.getDocumentByUri(uri);
        if (!document) {
            return [];
        }
        this.connection?.console.log(`onCompletion ${document?.uri} // ${uri}`)
        const rootNode = (await document.getTree()).rootNode;
        const node = rootNode.namedDescendantForPosition({ row: position.line, column: position.character });
        this.connection?.console.log(`Named: ${node.type}`)
        const unNamed = rootNode.descendantForPosition({ row: position.line, column: position.character })
        this.connection?.console.log(`UnNamed: ${unNamed.type} // unNamed.previousNamedSibling?.type: ${unNamed.previousNamedSibling?.type} // unNamed.previousSibling?.type: ${unNamed.previousSibling?.type}`)
        if (node.type === 'currency') {
            const set = new Set<string>();
            await Promise.all(Array.from(this.beanDocuments!.values()).map(async doc => {
                const nodes = await doc.getCurrency();
                nodes.forEach(node => {
                    set.add(node.text);
                })
            }))
            return Array.from(set).map(text => {
                const currency = text.replace(/^"/, '').replace(/"$/, '');
                return {
                    label: currency,
                    kind: CompletionItemKind.Text,
                }

            })
        }

        if (node.type === 'account') {
            const set = new Set<string>();
            await Promise.all(Array.from(this.beanDocuments!.values()).map(async doc => {
                const nodes = await doc.getAccounts();
                nodes.forEach(node => {
                    set.add(node.text);
                })
            }))
            return Array.from(set).map(text => {
                const account = text.replace(/^"/, '').replace(/"$/, '');
                return {
                    label: account,
                    kind: CompletionItemKind.Text,
                }

            })
        }

        // The pass parameter contains the position of the text document in
        // which code complete got requested. For the example we ignore this
        // info and always provide the same completion items.
        return [];
    }
}