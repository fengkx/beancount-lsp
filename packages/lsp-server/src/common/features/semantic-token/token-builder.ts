import { TokenTypes, tokenTypeToIndex } from '@bean-lsp/shared';
import { SemanticTokensBuilder } from 'vscode-languageserver';
import type * as Parser from 'web-tree-sitter';

export class TokenBuilder {
	builder: SemanticTokensBuilder;
	lastToken: { row: number; column: number } = { row: 0, column: 0 };
	absTokens: Array<{
		row: number;
		column: number;
		length: number;
		tokenType: TokenTypes;
		tokenModifiers: number;
		dropped?: boolean;
	}> = [];
	constructor() {
		this.builder = new SemanticTokensBuilder();
	}

	push(row: number, column: number, length: number, tokenType: TokenTypes, tokenModifiers = 0) {
		this.absTokens.push({ row, column, length, tokenType, tokenModifiers });
	}

	buildSingleCaptureTokens(matches: Parser.QueryMatch[], tokenType: TokenTypes) {
		for (const m of matches) {
			const line = m.captures[0].node.startPosition.row;
			const startChar = m.captures[0].node.startPosition.column;
			const length = m.captures[0].node.text.length;

			this.push(line, startChar, length, tokenType);
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
			if (a.length === b.length) {
				if (a.tokenType === 'string') {
					a.dropped = true;
				}
				if (b.tokenType === 'string') {
					a.dropped = true;
				}
			}
			return a.length - b.length;
		});

		this.absTokens.filter(t => !t.dropped).forEach(token => {
			const { row, column, length, tokenType, tokenModifiers } = token;
			// const relativeRow = row - this.lastToken.row;
			// const relativeColumn = column - this.lastToken.column;
			this.builder.push(row, column, length, tokenTypeToIndex(tokenType), tokenModifiers);
			this.lastToken = { row, column };
		});
		return this.builder.build();
	}
}
