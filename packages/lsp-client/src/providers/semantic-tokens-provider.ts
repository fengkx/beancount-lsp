import * as vscode from "vscode";
import { TreeQuery } from "../queries";
import type * as WebTreeSitter from "web-tree-sitter";
import { TokenTypes, getParser } from '@bean-lsp/shared'
// import Beancount = require("tree-sitter-beancount");



export class SemanticTokenProvider implements vscode.DocumentSemanticTokensProvider {


    constructor(public legend: vscode.SemanticTokensLegend) {
    }
    async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens | null | undefined> {
        const code = document.getText();
        const tree = (await getParser()).parse(code);
        // const query = this.parser.getLanguage().query('((date) @date)');
        const dateMatches = await TreeQuery.getQueryByTokenName('date').matches(tree.rootNode);

        const tokenBuilder = new vscode.SemanticTokensBuilder(this.legend);
        this.buildTokens(tokenBuilder, dateMatches, 'string');

        const flagMatches = await TreeQuery.getQueryByTokenName('flag').matches(tree.rootNode);
        this.buildTokens(tokenBuilder, flagMatches, 'operator');

        const narrationMatches = await TreeQuery.getQueryByTokenName('narration').matches(tree.rootNode);
        this.buildTokens(tokenBuilder, narrationMatches, 'string')

        const payeeMatches = await TreeQuery.getQueryByTokenName('payee').matches(tree.rootNode);
        this.buildTokens(tokenBuilder, payeeMatches, 'string')


        const accountMatches = await TreeQuery.getQueryByTokenName('account').matches(tree.rootNode);
        this.buildTokens(tokenBuilder, accountMatches, 'account')

        const numberMatches = await TreeQuery.getQueryByTokenName('number').matches(tree.rootNode)
        this.buildTokens(tokenBuilder, numberMatches, 'number')

        const currencyMatches = await TreeQuery.getQueryByTokenName('currency').matches(tree.rootNode)

        this.buildTokens(tokenBuilder, currencyMatches, 'currency')



        const tokens = tokenBuilder.build();
        return tokens;
    }

    private buildTokens = (tokenBuilder: vscode.SemanticTokensBuilder, matches: WebTreeSitter.QueryMatch[], tokenType: TokenTypes) => {
        for (const m of matches) {
            tokenBuilder.push(new vscode.Range(
                new vscode.Position(m.captures[0].node.startPosition.row,
                    m.captures[0].node.startPosition.column),
                new vscode.Position(m.captures[0].node.endPosition.row,
                    m.captures[0].node.endPosition.column)
            ), tokenType)
        }
    }
    onDidChangeSemanticTokens?: vscode.Event<void> | undefined;
}

