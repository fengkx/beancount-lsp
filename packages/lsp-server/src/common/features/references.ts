import * as lsp from "vscode-languageserver";
import { TreeQuery } from "../language";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Trees } from "../trees";
import { asLspRange } from "../common";
export interface SymbolInfo {
    _symType: string;

    _uri: string;
    name: string;
    range: lsp.Range;
    kind: lsp.SymbolKind;
}
export async function getAccountsUsage(textDocument: TextDocument, trees: Trees) {
    const query = TreeQuery.getQueryByTokenName('account_usage');
    const tree = await trees.getParseTree(textDocument);
    if (!tree) {
        return [];
    }
    const captures = await query.captures(tree.rootNode);
    const result: SymbolInfo[] = [];
    for (const capture of captures) {
        const name = capture.node.text;
        const range = asLspRange(capture.node);
        result.push({
            _symType: 'account_usage',
            _uri: textDocument.uri,
            name,
            range,
            kind: lsp.SymbolKind.Struct
        });
    }
    return result;
}

export async function getAccountsDefinition(doc: TextDocument, trees: Trees) {
    const tree = await trees.getParseTree(doc);
    if (!tree) {
        return []

    }
    const query = TreeQuery.getQueryByTokenName('account_definition');
    const captures = await query.captures(tree.rootNode);
    const result: SymbolInfo[] = [];
    for (const capture of captures) {
        const name = capture.node.text;
        const range = asLspRange(capture.node);
        result.push({
            _symType: 'account_definition',
            _uri: doc.uri,
            name,
            range,
            kind: lsp.SymbolKind.Struct
        });
    }
    return result;
}
