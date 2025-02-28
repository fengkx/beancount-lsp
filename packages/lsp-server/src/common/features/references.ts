import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { asLspRange } from '../common';
import { TreeQuery } from '../language';
import { Trees } from '../trees';
export interface SymbolInfo {
	_symType: string;

	_uri: string;
	name: string;
	range: lsp.Range;
	kind: lsp.SymbolKind;
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
			range,
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
			range,
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
	console.log(`[references] Payees parse tree: ${tree.rootNode.toString()}`);
	console.log(`[references] Payees captures: ${captures.length} matches`);
	const result: SymbolInfo[] = [];
	for (const capture of captures) {
		const name = capture.node.text.replace(/^"|"$/g, ''); // Remove quotes
		const range = asLspRange(capture.node);
		result.push({
			_symType: 'payee',
			_uri: doc.uri,
			name,
			range,
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
			range,
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
			range,
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
			range,
			kind: lsp.SymbolKind.Key,
		});
	}
	return result;
}
