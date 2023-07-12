import { TokenTypes, tokenTypeToIndex } from "@bean-lsp/shared";
import type * as Parser from 'web-tree-sitter';
import { Connection, SemanticTokensBuilder } from "vscode-languageserver";

export class TokenBuilder {
    builder: SemanticTokensBuilder
    lastToken: { row: number, column: number } = { row: 0, column: 0 }
    absTokens: Array<{
        row: number;
        column: number;
        length: number;
        tokenType: TokenTypes;
        tokenModifiers: number
    }> = [];
    constructor(private connection: Connection) {
        this.builder = new SemanticTokensBuilder();
    }

    private push(row: number, column: number, length: number, tokenType: TokenTypes, tokenModifiers = 0) {
        this.absTokens.push({ row, column, length, tokenType, tokenModifiers })
    }

    buildTokens(matches: Parser.QueryMatch[], tokenType: TokenTypes) {
        for (const m of matches) {
            const line = m.captures[0].node.startPosition.row;
            const startChar = m.captures[0].node.startPosition.column;
            const length = m.captures[0].node.text.length;

            this.push(line, startChar, length, tokenType)
        }

    }




    build() {
        this.absTokens.sort((a, b) => {
            if (a.row !== b.row) {
                return a.row - b.row;
            }
            if (a.column !== b.column) {
                return a.column - b.column;
            }
            return a.length - b.length
        })

        this.connection.console.info(JSON.stringify({ 'name': 'absTokens', absToken: this.absTokens }))
        this.absTokens.forEach(token => {
            const { row, column, length, tokenType, tokenModifiers } = token;
            const relativeRow = row - this.lastToken.row;
            const relativeColumn = column - this.lastToken.column;
            this.connection.console.info(JSON.stringify({ 'name': 'lastToken', lastToken: this.lastToken, row, column, relativeRow, relativeColumn }))
            this.builder.push(row, column, length, tokenTypeToIndex(tokenType), tokenModifiers);
            this.lastToken = { row, column }
        })
        return this.builder.build();
    }
}