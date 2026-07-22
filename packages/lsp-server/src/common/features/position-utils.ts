import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import type { SyntaxNode } from 'web-tree-sitter';
import { asLspRange } from '../common';
import { Trees } from '../trees';
import { BeancountOptionsManager } from '../utils/beancount-options';

// Create a logger for position utilities
const logger = new Logger('position-utils');

async function readNodeAtPosition<T>(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
	reader: (node: SyntaxNode) => T,
): Promise<T | undefined> {
	const result = await trees.withParseTree(document, tree => {
		const offset = document.offsetAt(position);
		return reader(tree.rootNode.descendantForIndex(offset));
	});
	if (result === undefined) {
		logger.warn(`Failed to get parse tree for document: ${document.uri}`);
	}
	return result;
}

function getNodeOrParentOfType(
	node: SyntaxNode | null,
	type: string,
): SyntaxNode | null {
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

function isAccountLike(text: string, scopeUri: string): boolean {
	// Get valid root accounts from options manager
	const optionsManager = BeancountOptionsManager.getInstance();
	const validRoots = optionsManager.getValidRootAccounts(scopeUri);

	// Split account name by colon
	const parts = text.split(':');
	if (parts.length < 2) {
		return false;
	}

	const root = parts[0];
	if (!root) {
		return false;
	}

	// Check if root is in valid root accounts
	if (!validRoots.has(root)) {
		return false;
	}

	// Validate sub-account format (must start with uppercase letter or number)
	// Allow CJK characters and other Unicode characters as well
	for (let i = 1; i < parts.length; i++) {
		const part = parts[i];
		if (!part || part.length === 0) {
			return false;
		}
		// First character must be uppercase letter, number, or CJK character
		const firstChar = part[0];
		if (
			!firstChar || !(
				(firstChar >= 'A' && firstChar <= 'Z')
				|| (firstChar >= '0' && firstChar <= '9')
				|| (firstChar >= '\u4E00' && firstChar <= '\u9FFF') // CJK Unified Ideographs
			)
		) {
			return false;
		}
		// Rest can be letters, numbers, dash, or CJK characters
		if (!/^[\p{L}\p{N}\u{4E00}-\u{9FFF}-]*$/u.test(part)) {
			return false;
		}
	}

	return true;
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
	const range = await readNodeAtPosition(trees, document, position, node => {
		if (!node) {
			return {
				start: position,
				end: {
					line: position.line,
					character: position.character + 1,
				},
			};
		}
		return asLspRange(node);
	});
	if (!range) {
		throw new Error(`Failed to get parse tree for document: ${document.uri}`);
	}
	return range;
}

/**
 * Extracts the account name at the given position
 */
export async function getAccountAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	return await readNodeAtPosition(trees, document, position, node => {
		if (node.type === 'account' || isAccountLike(node.text, document.uri)) return node.text;
		return getNodeOrParentOfType(node, 'account')?.text ?? null;
	}) ?? null;
}

/**
 * Extracts the commodity name at the given position
 */
export async function getCommodityAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	return await readNodeAtPosition(trees, document, position, node => {
		if (node.type === 'currency') return node.text;
		if (node.parent?.type === 'currency') return node.parent.text;
		if (isCurrencyLike(node.text)) return node.text;
		return null;
	}) ?? null;
}

/**
 * Extracts the tag name at the given position
 */
export async function getTagAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	return await readNodeAtPosition(trees, document, position, node => {
		const tagNode = getNodeOrParentOfType(node, 'tag');
		if (tagNode) return stripPrefix(tagNode.text, '#');
		if (node.text.startsWith('#')) return stripPrefix(node.text, '#');
		return null;
	}) ?? null;
}

/**
 * Extracts the payee name at the given position
 */
export async function getPayeeAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	return await readNodeAtPosition(trees, document, position, node => {
		const payeeNode = getNodeOrParentOfType(node, 'payee');
		return payeeNode ? stripSurroundingQuotes(payeeNode.text) : null;
	}) ?? null;
}

/**
 * Extracts the narration text at the given position
 */
export async function getNarrationAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	return await readNodeAtPosition(trees, document, position, node => {
		const narrationNode = getNodeOrParentOfType(node, 'narration');
		return narrationNode ? stripSurroundingQuotes(narrationNode.text) : null;
	}) ?? null;
}

/**
 * Extracts the tag name from a pushtag directive at the given position
 */
export async function getPushTagAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	return await readNodeAtPosition(trees, document, position, node => {
		let current: SyntaxNode | null = node;
		while (current) {
			if (current.type === 'pushtag') {
				const tagNode = current.child(1);
				if (tagNode?.type === 'tag') return stripPrefix(tagNode.text, '#');
			}
			current = current.parent;
		}
		return null;
	}) ?? null;
}

/**
 * Extracts the tag name from a poptag directive at the given position
 */
export async function getPopTagAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	return await readNodeAtPosition(trees, document, position, node => {
		let current: SyntaxNode | null = node;
		while (current) {
			if (current.type === 'poptag') {
				const tagNode = current.child(1);
				if (tagNode?.type === 'tag') return stripPrefix(tagNode.text, '#');
			}
			current = current.parent;
		}
		return null;
	}) ?? null;
}

/**
 * Extracts the link name at the given position
 */
export async function getLinkAtPosition(
	trees: Trees,
	document: TextDocument,
	position: lsp.Position,
): Promise<string | null> {
	return await readNodeAtPosition(trees, document, position, node => {
		const linkNode = getNodeOrParentOfType(node, 'link');
		if (linkNode) return stripPrefix(linkNode.text, '^');
		if (node.text.startsWith('^')) return stripPrefix(node.text, '^');
		return null;
	}) ?? null;
}
