import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { asLspRange } from '../common';
import { Trees } from '../trees';

// Create a logger for position utilities
const logger = new Logger('position-utils');

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

	// 使用asLspRange函数创建Range
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
	const tree = await trees.getParseTree(document);
	if (!tree) {
		logger.warn(`Failed to get parse tree for document: ${document.uri}`);
		return null;
	}

	// Get the node at the current position
	const offset = document.offsetAt(position);
	const node = tree.rootNode.descendantForIndex(offset);

	if (!node) {
		return null;
	}

	// Check if we're in an account node
	if (
		node.type === 'account'
		|| node.text.match(/^(Assets|Liabilities|Equity|Income|Expenses)(:[A-Z0-9][A-Za-z0-9-]*)*$/)
	) {
		return node.text;
	}

	// For parent nodes that might contain an account
	if (node.parent && node.parent.type === 'account') {
		return node.parent.text;
	}

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
	const tree = await trees.getParseTree(document);
	if (!tree) {
		logger.warn(`Failed to get parse tree for document: ${document.uri}`);
		return null;
	}

	// Get the node at the current position
	const offset = document.offsetAt(position);
	const node = tree.rootNode.descendantForIndex(offset);

	if (!node) {
		return null;
	}

	// Check if we're in a currency node
	if (node.type === 'currency') {
		return node.text;
	}

	// For parent nodes that might contain a currency
	if (node.parent && node.parent.type === 'currency') {
		return node.parent.text;
	}

	// Check for text that looks like a currency (typically uppercase 2-5 letter codes)
	if (node.text.match(/^[A-Z]{2,5}$/)) {
		return node.text;
	}

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
	const tree = await trees.getParseTree(document);
	if (!tree) {
		logger.warn(`Failed to get parse tree for document: ${document.uri}`);
		return null;
	}

	// Get the node at the current position
	const offset = document.offsetAt(position);
	const node = tree.rootNode.descendantForIndex(offset);

	if (!node) {
		return null;
	}

	// Check if we're in a tag node
	if (node.type === 'tag') {
		return node.text.substring(1); // Remove the # prefix
	}

	// For parent nodes that might contain a tag
	if (node.parent && node.parent.type === 'tag') {
		return node.parent.text.substring(1); // Remove the # prefix
	}

	// Check for text that looks like a tag (starts with #)
	if (node.text.startsWith('#')) {
		return node.text.substring(1);
	}

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
	const tree = await trees.getParseTree(document);
	if (!tree) {
		logger.warn(`Failed to get parse tree for document: ${document.uri}`);
		return null;
	}

	// Get the node at the current position
	const offset = document.offsetAt(position);
	const node = tree.rootNode.descendantForIndex(offset);

	if (!node) {
		return null;
	}

	// Check if we're in a payee node
	if (node.type === 'payee') {
		return node.text.replace(/^"|"$/g, ''); // Remove quotes
	}

	// For parent nodes that might contain a payee
	if (node.parent && node.parent.type === 'payee') {
		return node.parent.text.replace(/^"|"$/g, ''); // Remove quotes
	}

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
	const tree = await trees.getParseTree(document);
	if (!tree) {
		logger.warn(`Failed to get parse tree for document: ${document.uri}`);
		return null;
	}

	// Get the node at the current position
	const offset = document.offsetAt(position);
	const node = tree.rootNode.descendantForIndex(offset);

	if (!node) {
		return null;
	}

	// Check if we're in a narration node
	if (node.type === 'narration') {
		return node.text.replace(/^"|"$/g, ''); // Remove quotes
	}

	// For parent nodes that might contain a narration
	if (node.parent && node.parent.type === 'narration') {
		return node.parent.text.replace(/^"|"$/g, ''); // Remove quotes
	}

	return null;
}
