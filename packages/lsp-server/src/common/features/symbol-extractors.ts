import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import type { SyntaxNode } from 'web-tree-sitter';
import { asLspRange, compactToRange, rangeToCompact } from '../common';
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

	date?: string;
}

/**
 * Gets the full lsp.Range representation from a SymbolInfo
 */
export function getRange(symbol: SymbolInfo): lsp.Range {
	return compactToRange(symbol.range);
}

/**
 * Helper function to extract date from a node or its parent directives
 *
 * @param node The starting node to search from
 * @param directiveTypes Array of directive types to look for (defaults to common ones)
 * @returns Date string if found, undefined otherwise
 */
function findDateFromNode(
	node: SyntaxNode,
	directiveTypes: string[] = ['transaction', 'balance', 'open', 'close', 'pad', 'price', 'commodity'],
): string | undefined {
	let currentNode = node;

	// First, check if the node itself has a date field
	const dateNode = currentNode.childForFieldName && currentNode.childForFieldName('date');
	if (dateNode) {
		return dateNode.text;
	}

	// Otherwise, traverse up the parent chain
	while (currentNode.parent) {
		currentNode = currentNode.parent;

		// Handle special case for tags_links
		if (currentNode.type === 'tags_links') {
			continue;
		}

		// Check if current node is one of the directive types we're looking for
		if (directiveTypes.includes(currentNode.type)) {
			const parentDateNode = currentNode.childForFieldName && currentNode.childForFieldName('date');
			if (parentDateNode) {
				return parentDateNode.text;
			}
		}
	}

	return undefined;
}

export async function getAccountsUsage(textDocument: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const query = TreeQuery.getQueryByTokenName('account_usage');
	const tree = await trees.getParseTree(textDocument);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${textDocument.uri}`);
	}
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		const name = capture.node.text;
		const range = asLspRange(capture.node);

		// Find date using the helper function
		const dateValue = findDateFromNode(capture.node);

		const symbolInfo: SymbolInfo = {
			[SymbolKey.TYPE]: SymbolType.ACCOUNT_USAGE,
			_uri: textDocument.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Struct,
		};

		if (dateValue) {
			symbolInfo.date = dateValue;
		}

		result.push(symbolInfo);
	}
	return result;
}

export async function getAccountsDefinition(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}
	const query = TreeQuery.getQueryByTokenName('account_definition');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		// console.info(`JSON: ${JSON.stringify({ text: capture.node.text, scm: capture.node.toString() })}`)
		const name = capture.node.text;
		const range = asLspRange(capture.node);

		// Find date using the helper function, limiting to 'open' directive
		const dateValue = findDateFromNode(capture.node, ['open']);

		const symbolInfo: SymbolInfo = {
			[SymbolKey.TYPE]: SymbolType.ACCOUNT_DEFINITION,
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Struct,
		};

		if (dateValue) {
			symbolInfo.date = dateValue;
		}

		result.push(symbolInfo);
	}
	return result;
}

/**
 * Extracts account closure information from a document
 *
 * @param doc The text document to extract from
 * @param trees The Trees instance for accessing parse trees
 * @returns Array of SymbolInfo objects representing closed accounts
 */
export async function getAccountsClose(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}
	// Use the 'close' query to find close directives
	const query = TreeQuery.getQueryByTokenName('close');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];

	for (const capture of captures) {
		// Only process the close node itself
		if (capture.name !== 'close' || capture.node.type !== 'close') {
			continue;
		}

		// Get the account information from the close directive
		const closeNode = capture.node;
		const accountNode = closeNode.childForFieldName('account');

		// Find date using the helper function
		const dateValue = findDateFromNode(closeNode);

		if (accountNode) {
			const name = accountNode.text;
			const range = asLspRange(closeNode);

			const symbolInfo: SymbolInfo = {
				[SymbolKey.TYPE]: SymbolType.ACCOUNT_CLOSE,
				_uri: doc.uri,
				name,
				range: rangeToCompact(range),
				kind: lsp.SymbolKind.Struct,
			};

			if (dateValue) {
				symbolInfo.date = dateValue;
			}

			result.push(symbolInfo);
		}
	}

	return result;
}

export async function getPayees(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}
	const query = TreeQuery.getQueryByTokenName('payee');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		const name = capture.node.text.replace(/^"|"$/g, ''); // Remove quotes
		const range = asLspRange(capture.node);

		// Find date using the helper function, limiting to 'transaction' directive
		const dateValue = findDateFromNode(capture.node, ['transaction']);

		const symbolInfo: SymbolInfo = {
			s: SymbolType.PAYEE,
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.String,
		};

		if (dateValue) {
			symbolInfo.date = dateValue;
		}

		result.push(symbolInfo);
	}
	return result;
}

export async function getNarrations(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}
	const query = TreeQuery.getQueryByTokenName('narration');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		const name = capture.node.text.replace(/^"|"$/g, ''); // Remove quotes
		const range = asLspRange(capture.node);

		// Find date using the helper function, limiting to 'transaction' directive
		const dateValue = findDateFromNode(capture.node, ['transaction']);

		const symbolInfo: SymbolInfo = {
			s: SymbolType.NARRATION,
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.String,
		};

		if (dateValue) {
			symbolInfo.date = dateValue;
		}

		result.push(symbolInfo);
	}
	return result;
}

export async function getCommodities(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}
	const query = TreeQuery.getQueryByTokenName('currency');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		const name = capture.node.text;
		const range = asLspRange(capture.node);

		// Find date using the helper function
		const dateValue = findDateFromNode(capture.node, ['transaction', 'price', 'commodity']);

		const symbolInfo: SymbolInfo = {
			s: SymbolType.COMMODITY,
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Constant,
		};

		if (dateValue) {
			symbolInfo.date = dateValue;
		}

		result.push(symbolInfo);
	}
	return result;
}

export async function getCurrencyDefinitions(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}
	const query = TreeQuery.getQueryByTokenName('currency_definition');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		const name = capture.node.text;
		const range = asLspRange(capture.node);

		// Find date using the helper function, limiting to 'commodity' directive
		const dateValue = findDateFromNode(capture.node, ['commodity']);

		const symbolInfo: SymbolInfo = {
			s: SymbolType.CURRENCY_DEFINITION,
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Constant,
		};

		if (dateValue) {
			symbolInfo.date = dateValue;
		}

		result.push(symbolInfo);
	}
	return result;
}

export async function getTags(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}

	const query = TreeQuery.getQueryByTokenName('tag');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		const name = capture.node.text.substring(1); // Remove the leading #
		const range = asLspRange(capture.node);

		// Find date using the helper function
		const dateValue = findDateFromNode(capture.node);

		const symbolInfo: SymbolInfo = {
			s: SymbolType.TAG,
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Key,
		};

		if (dateValue) {
			symbolInfo.date = dateValue;
		}

		result.push(symbolInfo);
	}
	return result;
}

/**
 * Extracts all links from a document
 */
export async function getLinks(document: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(document);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${document.uri}`);
	}

	const query = TreeQuery.getQueryByTokenName('link');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		const name = capture.node.text.substring(1); // Remove the ^ prefix
		const range = asLspRange(capture.node);

		// Find date using the helper function
		const dateValue = findDateFromNode(capture.node);

		const symbolInfo: SymbolInfo = {
			s: SymbolType.LINK,
			_uri: document.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Key,
		};

		if (dateValue) {
			symbolInfo.date = dateValue;
		}

		result.push(symbolInfo);
	}
	return result;
}

export async function getPricesDeclarations(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}
	const query = TreeQuery.getQueryByTokenName('price');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		const name = capture.node.childForFieldName('currency')!.text;
		const range = asLspRange(capture.node);

		// Find date using the helper function
		const dateValue = findDateFromNode(capture.node);

		const symbolInfo: SymbolInfo = {
			s: SymbolType.PRICE,
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Constant,
		};

		if (dateValue) {
			symbolInfo.date = dateValue;
		}

		result.push(symbolInfo);
	}
	return result;
}

export async function getPushTags(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}
	const query = TreeQuery.getQueryByTokenName('pushtag');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		// Get the tag node within the pushtag
		const tagNode = capture.node.child(1);
		if (tagNode && tagNode.type === 'tag') {
			const name = tagNode.text.substring(1); // Remove the leading #
			const range = asLspRange(capture.node);
			result.push({
				s: SymbolType.PUSHTAG,
				_uri: doc.uri,
				name,
				range: rangeToCompact(range),
				kind: lsp.SymbolKind.Event,
			});
		}
	}
	return result;
}

export async function getPopTags(doc: TextDocument, trees: Trees): Promise<SymbolInfo[]> {
	const tree = await trees.getParseTree(doc);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${doc.uri}`);
	}
	const query = TreeQuery.getQueryByTokenName('poptag');
	const captures = await query.captures(tree.rootNode);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		// Get the tag node within the poptag
		const tagNode = capture.node.child(1);
		if (tagNode && tagNode.type === 'tag') {
			const name = tagNode.text.substring(1); // Remove the leading #
			const range = asLspRange(capture.node);
			result.push({
				s: SymbolType.POPTAG,
				_uri: doc.uri,
				name,
				range: rangeToCompact(range),
				kind: lsp.SymbolKind.Event,
			});
		}
	}
	return result;
}
