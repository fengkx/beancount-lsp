import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { compactToRange, nodeToCompact } from '../common';
import { TreeQuery } from '../language';
import { Trees } from '../trees';

export const SymbolType = {
	ACCOUNT_USAGE: 0,
	ACCOUNT_DEFINITION: 1,
	ACCOUNT_CLOSE: 2,
	PAYEE: 3,
	NARRATION: 4,
	COMMODITY: 5,
	TAG: 6,
	PUSHTAG: 7,
	POPTAG: 8,
	PRICE: 9,
	LINK: 10,
	CURRENCY_DEFINITION: 11,
} as const;

export const SymbolKey = {
	TYPE: 's',
} as const;

export interface SymbolInfo {
	[SymbolKey.TYPE]: typeof SymbolType[keyof typeof SymbolType];
	_uri: string;
	name: string;
	// Use a compact array representation instead of full lsp.Range object
	// Format: [startLine, startChar, endLine, endChar]
	range: [number, number, number, number];
	kind: lsp.SymbolKind;

	/**
	 * finding date require recursive search through the parent nodes.
	 * It is a time consuming operation. only do it when necessary.
	 *
	 * Currently symbol type have date:
	 * - account usage and definition directives for opening and closing dates
	 * - price declarations for price date
	 *
	 * @link {findDateFromNode}
	 */
	date?: string;
}

/**
 * Gets the full lsp.Range representation from a SymbolInfo
 */
export function getRange(symbol: SymbolInfo): lsp.Range {
	return compactToRange(symbol.range);
}

function stripFirstChar(s: string): string {
	return s.substring(1);
}

export async function getSymbols(textDocument: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(textDocument);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${textDocument.uri}`);
	}
	const query = TreeQuery.getQueryByTokenName('symbols');
	const matches = await query.matches(tree);
	const result: SymbolInfo[] = [];
	for (const match of matches) {
		let nameFromCapture: string | undefined;
		let nameMod: ((name: string) => string) | undefined;
		let date: string | undefined;
		let symbolInfos: SymbolInfo[] = [];
		for (const capture of match.captures) {
			let type: typeof SymbolType[keyof typeof SymbolType];
			let name: string | undefined;
			let kind: lsp.SymbolKind;
			switch (capture.name) {
				case 'currency':
					type = SymbolType.COMMODITY;
					kind = lsp.SymbolKind.Constant;
					break;
				case 'account_usage':
					type = SymbolType.ACCOUNT_USAGE;
					kind = lsp.SymbolKind.Struct;
					break;
				case 'date':
					date = capture.node.text;
					continue;
				case 'narration':
					type = SymbolType.NARRATION;
					name = capture.node.text.slice(1, -1);
					kind = lsp.SymbolKind.String;
					break;
				case 'payee':
					type = SymbolType.PAYEE;
					name = capture.node.text.slice(1, -1);
					kind = lsp.SymbolKind.String;
					break;
				case 'tag':
					type = SymbolType.TAG;
					name = capture.node.text.substring(1);
					kind = lsp.SymbolKind.Key;
					break;
				case 'link':
					type = SymbolType.LINK;
					name = capture.node.text.substring(1);
					kind = lsp.SymbolKind.Key;
					break;
				case 'price':
					type = SymbolType.PRICE;
					kind = lsp.SymbolKind.Constant;
					break;
				case 'account_definition':
					type = SymbolType.ACCOUNT_DEFINITION;
					kind = lsp.SymbolKind.Struct;
					break;
				case 'close':
					type = SymbolType.ACCOUNT_CLOSE;
					kind = lsp.SymbolKind.Struct;
					break;
				case 'currency_definition':
					type = SymbolType.CURRENCY_DEFINITION;
					kind = lsp.SymbolKind.Constant;
					break;
				case 'pushtag':
					type = SymbolType.PUSHTAG;
					nameMod = stripFirstChar;
					kind = lsp.SymbolKind.Event;
					break;
				case 'poptag':
					type = SymbolType.POPTAG;
					nameMod = stripFirstChar;
					kind = lsp.SymbolKind.Event;
					break;
				case 'name':
					nameFromCapture = capture.node.text;
					continue;
				default:
					continue;
			}
			symbolInfos.push({
				[SymbolKey.TYPE]: type,
				_uri: textDocument.uri,
				name: name ?? capture.node.text,
				range: nodeToCompact(capture.node),
				kind: kind,
			});
		}
		for (const symbolInfo of symbolInfos) {
			symbolInfo.date = date;
			if (nameFromCapture) {
				symbolInfo.name = nameMod ? nameMod(nameFromCapture) : nameFromCapture;
			}
			result.push(symbolInfo);
		}
	}
	return result;
}
