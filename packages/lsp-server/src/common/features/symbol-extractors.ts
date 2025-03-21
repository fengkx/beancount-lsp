import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { asLspRange, compactToRange, rangeToCompact } from '../common';
import { TreeQuery } from '../language';
import { Trees } from '../trees';

export interface SymbolInfo {
	_symType: string;

	_uri: string;
	name: string;
	// Use a compact array representation instead of full lsp.Range object
	// Format: [startLine, startChar, endLine, endChar]
	range: [number, number, number, number];
	kind: lsp.SymbolKind;
}

/**
 * Gets the full lsp.Range representation from a SymbolInfo
 */
export function getRange(symbol: SymbolInfo): lsp.Range {
	return compactToRange(symbol.range);
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
		result.push({
			_symType: 'account_usage',
			_uri: textDocument.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Struct,
		});
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
		result.push({
			_symType: 'account_definition',
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Struct,
		});
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
		result.push({
			_symType: 'payee',
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.String,
		});
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
		result.push({
			_symType: 'narration',
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.String,
		});
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
		result.push({
			_symType: 'commodity',
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Constant,
		});
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
		result.push({
			_symType: 'currency_definition',
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Constant,
		});
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
		result.push({
			_symType: 'tag',
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Key,
		});
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
		result.push({
			_symType: 'link',
			_uri: document.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Key,
		});
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
		result.push({
			_symType: 'price',
			_uri: doc.uri,
			name,
			range: rangeToCompact(range),
			kind: lsp.SymbolKind.Constant,
		});
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
				_symType: 'pushtag',
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
				_symType: 'poptag',
				_uri: doc.uri,
				name,
				range: rangeToCompact(range),
				kind: lsp.SymbolKind.Event,
			});
		}
	}
	return result;
}
