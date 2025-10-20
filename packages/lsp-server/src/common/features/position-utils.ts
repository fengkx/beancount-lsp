import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { asLspRange } from '../common';
import { Trees } from '../trees';

// Create a logger for position utilities
const logger = new Logger('position-utils');

async function getNodeAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<import('web-tree-sitter').SyntaxNode | null> {
	const tree = await trees.getParseTree(document);
	if (!tree) {
		logger.warn(`Failed to get parse tree for document: ${document.uri}`);
		return null;
	}
	const offset = document.offsetAt(position);
	return tree.rootNode.descendantForIndex(offset);
}

function getNodeOrParentOfType(
	node: import('web-tree-sitter').SyntaxNode | null,
	type: string,
): import('web-tree-sitter').SyntaxNode | null {
	if (!node) return null;
	if (node.type === type) return node;
	if (node.parent && node.parent.type === type) return node.parent;
	return null;
}

function stripPrefix(text: string, prefix: string): string {
	return text.startsWith(prefix) ? text.substring(prefix.length) : text;
}

function stripSurroundingQuotes(text: string): string {
	return text.replace(/^"|"$/g, '');
}

function isAccountLike(text: string): boolean {
	return /^(Assets|Liabilities|Equity|Income|Expenses)(:[A-Z0-9][A-Za-z0-9-]*)*$/.test(text);
}

function isCurrencyLike(text: string): boolean {
	return /^[A-Z]{2,5}$/.test(text);
}

/**
 * Gets the range of a node at a specific position
 */
export async function getRangeAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<lsp.Range> {
	const tree = await trees.getParseTree(document);
	if (!tree) {
		throw new Error(`Failed to get parse tree for document: ${document.uri}`);
	}

	// Get the node at the current position
	const offset = document.offsetAt(position);
	const node = tree.rootNode.descendantForIndex(offset);

	if (!node) {
		// 如果找不到节点，返回一个基于当前位置的默认范围
		return {
			start: position,
			end: {
				line: position.line,
				character: position.character + 1,
			},
		};
	}

	// Create range using asLspRange
	return asLspRange(node);
}

/**
 * Extracts the account name at the given position
 */
export async function getAccountAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	const node = await getNodeAtPosition(trees, document, position);
	if (!node) return null;

	if (node.type === 'account' || isAccountLike(node.text)) {
		return node.text;
	}

	const parentAccount = getNodeOrParentOfType(node, 'account');
	if (parentAccount) return parentAccount.text;

	return null;
}

/**
 * Extracts the commodity name at the given position
 */
export async function getCommodityAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	const node = await getNodeAtPosition(trees, document, position);
	if (!node) return null;

	if (node.type === 'currency') return node.text;
	if (node.parent && node.parent.type === 'currency') return node.parent.text;
	if (isCurrencyLike(node.text)) return node.text;
	return null;
}

/**
 * Extracts the tag name at the given position
 */
export async function getTagAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	const node = await getNodeAtPosition(trees, document, position);
	if (!node) return null;

	const tagNode = getNodeOrParentOfType(node, 'tag');
	if (tagNode) return stripPrefix(tagNode.text, '#');
	if (node.text.startsWith('#')) return stripPrefix(node.text, '#');
	return null;
}

/**
 * Extracts the payee name at the given position
 */
export async function getPayeeAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	const node = await getNodeAtPosition(trees, document, position);
	if (!node) return null;

	const payeeNode = getNodeOrParentOfType(node, 'payee');
	if (payeeNode) return stripSurroundingQuotes(payeeNode.text);
	return null;
}

/**
 * Extracts the narration text at the given position
 */
export async function getNarrationAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	const node = await getNodeAtPosition(trees, document, position);
	if (!node) return null;

	const narrationNode = getNodeOrParentOfType(node, 'narration');
	if (narrationNode) return stripSurroundingQuotes(narrationNode.text);
	return null;
}

/**
 * Extracts the tag name from a pushtag directive at the given position
 */
export async function getPushTagAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	const node = await getNodeAtPosition(trees, document, position);
	if (!node) return null;

	// Look on self or ancestors for a pushtag and extract its tag child
	let current: import('web-tree-sitter').SyntaxNode | null = node;
	while (current) {
		if (current.type === 'pushtag') {
			const tagNode = current.child(1);
			if (tagNode && tagNode.type === 'tag') return stripPrefix(tagNode.text, '#');
		}
		current = current.parent;
	}

	return null;
}

/**
 * Extracts the tag name from a poptag directive at the given position
 */
export async function getPopTagAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	const node = await getNodeAtPosition(trees, document, position);
	if (!node) return null;

	// Look on self or ancestors for a poptag and extract its tag child
	let current: import('web-tree-sitter').SyntaxNode | null = node;
	while (current) {
		if (current.type === 'poptag') {
			const tagNode = current.child(1);
			if (tagNode && tagNode.type === 'tag') return stripPrefix(tagNode.text, '#');
		}
		current = current.parent;
	}

	return null;
}

/**
 * Extracts the link name at the given position
 */
export async function getLinkAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	const node = await getNodeAtPosition(trees, document, position);
	if (!node) return null;

	const linkNode = getNodeOrParentOfType(node, 'link');
	if (linkNode) return stripPrefix(linkNode.text, '^');
	if (node.text.startsWith('^')) return stripPrefix(node.text, '^');
	return null;
}
