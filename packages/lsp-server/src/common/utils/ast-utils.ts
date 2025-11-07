import { Logger } from '@bean-lsp/shared';
import { LRUCache } from 'mnemonist';
import { Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import type * as Parser from 'web-tree-sitter';
import { TreeQuery } from '../language';
import { Posting } from './balance-checker';

// Create a logger for this module
const logger = new Logger('AstUtils');

/**
 * Represents a transaction in the AST
 */
export interface Transaction {
	node: Parser.SyntaxNode;
	date: string;
	flag: string | undefined; // Explicit with undefined to fix TypeScript error
	headerRange: Range; // Added to store the header range for optimized highlighting
	postings: Posting[];
}

/**
 * Query nodes of a specific type under a parent node
 */
export function queryNodes(node: Parser.SyntaxNode, type: string): Parser.SyntaxNode[] {
	const nodes: Parser.SyntaxNode[] = [];

	// Use a recursive function to find all nodes of the given type
	const findNodes = (current: Parser.SyntaxNode) => {
		if (current.type === type) {
			nodes.push(current);
		}

		for (let i = 0; i < current.childCount; i++) {
			const child = current.child(i);
			if (child) {
				findNodes(child);
			}
		}
	};

	findNodes(node);
	return nodes;
}

/**
 * Find a child node by type
 */
export function findChildByType(node: Parser.SyntaxNode, type: string): Parser.SyntaxNode | null {
	for (let i = 0; i < node.childCount; i++) {
		const child = node.child(i);
		if (child && child.type === type) {
			return child;
		}
	}
	return null;
}

/**
 * Parse amount node into number and currency
 */
export function parseAmount(amountNode: Parser.SyntaxNode): { number: string; currency: string } | undefined {
	const numNode = amountNode.namedChild(0);
	const currNode = amountNode.namedChild(1);

	if (numNode && currNode) {
		return {
			number: numNode.text,
			currency: currNode.text,
		};
	}
	return undefined;
}

/**
 * Parse cost specification into number and currency
 */
export function parseCostSpec(
	costSpecNode: Parser.SyntaxNode,
): { number?: string; currency?: string; isTotalCost?: boolean; date?: string } | undefined {
	if (!costSpecNode) return undefined;

	// Check if this is a total cost (double brace) specification
	const isTotalCost = costSpecNode.text.startsWith('{{') && costSpecNode.text.endsWith('}}');

	// Extract cost components
	const costCompListNode = costSpecNode.childForFieldName('cost_comp_list');
	if (!costCompListNode) return { number: '', currency: '', isTotalCost };

	// Find a compound_amount node
	const costCompNodes = queryNodes(costCompListNode, 'cost_comp');

	for (const compNode of costCompNodes) {
		const compoundAmountNode = findChildByType(compNode, 'compound_amount');
		const dateNode = findChildByType(compNode, 'date');

		if (compoundAmountNode || dateNode) {
			const perNode = compoundAmountNode?.childForFieldName('per');
			const currencyNode = compoundAmountNode?.childForFieldName('currency');

			if ((perNode && currencyNode) || dateNode) {
				try {
					return {
						number: perNode?.text,
						currency: currencyNode?.text,
						isTotalCost,
						date: dateNode?.text,
					};
				} catch (e) {
					logger.error(`Error parsing cost: ${e}`);
				}
			}
		}
	}

	return undefined;
}

/**
 * Parse price annotation into type, number and currency
 */
export function parsePriceAnnotation(
	priceNode: Parser.SyntaxNode,
	priceType: '@' | '@@',
): { type: '@' | '@@'; number: string; currency: string } | undefined {
	const amountNode = priceNode.namedChild(0);
	if (amountNode) {
		const amount = parseAmount(amountNode);
		if (amount) {
			return {
				type: priceType,
				number: amount.number,
				currency: amount.currency,
			};
		}
	}
	return undefined;
}

/**
 * Extract postings from a transaction node
 */

const lruCache = new LRUCache<string, Transaction[]>(100);

/**
 * Finds all transactions in the parse tree and extracts their postings
 *
 * @param tree The parse tree from tree-sitter
 * @param document The text document
 * @returns Array of transaction objects with their postings
 */
export async function findAllTransactions(
	tree: import('web-tree-sitter').Tree,
	document: TextDocument,
): Promise<Transaction[]> {
	const rootNode: Parser.SyntaxNode = tree.rootNode;
	const key = 'txns:' + rootNode.id + ':' + document.version;
	const cached = lruCache.get(key);
	if (cached) {
		return cached;
	}

	// Aggregate using tree-sitter queries for performance
	const transactionsMap = new Map<number, Transaction>();

	// Helper to compute header range (keep existing behavior)
	function computeHeaderRange(node: Parser.SyntaxNode): Range {
		const headerEndRow = node.startPosition.row;
		return Range.create(
			Position.create(node.startPosition.row, node.startPosition.column),
			Position.create(
				headerEndRow,
				document.positionAt(document.offsetAt(Position.create(headerEndRow + 1, 0)) - 1).character,
			),
		);
	}

	function inferPriceTypeFromPosting(postingNode: Parser.SyntaxNode): '@' | '@@' {
		const atNode = findChildByType(postingNode, 'atat') || findChildByType(postingNode, 'at');
		return atNode && atNode.type === 'atat' ? '@@' : '@';
	}

	function getCaptureNode(match: Parser.QueryMatch, name: string): Parser.SyntaxNode | undefined {
		for (const cap of match.captures) {
			if (cap.name === name) return cap.node;
		}
		return undefined;
	}

	function getCaptureText(match: Parser.QueryMatch, name: string): string | undefined {
		const n = getCaptureNode(match, name);
		return n ? n.text : undefined;
	}

	// Run combined query that yields both header and posting matches
	try {
		const q = TreeQuery.getQueryByTokenName('transaction_detail');
		const matches = await q.matches(tree);

		for (const m of matches) {
			const txnNode = getCaptureNode(m, 'transaction');
			if (!txnNode) continue;
			let txn = transactionsMap.get(txnNode.id);
			if (!txn) {
				// initialize entry when first seen (may be via posting or header)
				txn = {
					node: txnNode,
					date: '',
					flag: undefined,
					headerRange: computeHeaderRange(txnNode),
					postings: [],
				};
				transactionsMap.set(txnNode.id, txn);
			}

			// If this match includes header captures, set date/flag
			const dateText = getCaptureText(m, 'date');
			const flagText = getCaptureText(m, 'txn');
			if (dateText !== undefined) txn.date = dateText;
			if (flagText !== undefined) txn.flag = flagText;

			// If this match includes a posting capture, build Posting
			const postingNode = getCaptureNode(m, 'posting');
			if (postingNode) {
				const accountText = getCaptureText(m, 'account');
				const amountNode = getCaptureNode(m, 'amount') || postingNode.childForFieldName('amount');
				const costSpecNode = getCaptureNode(m, 'cost_spec') || postingNode.childForFieldName('cost_spec');
				const priceAnnNode = getCaptureNode(m, 'price') || postingNode.childForFieldName('price_annotation');

				let price: { type: '@' | '@@'; number: string; currency: string } | undefined;
				if (priceAnnNode) {
					price = parsePriceAnnotation(priceAnnNode, inferPriceTypeFromPosting(postingNode));
				}

				txn.postings.push({
					node: postingNode,
					account: accountText ?? postingNode.childForFieldName('account')?.text ?? '',
					amount: amountNode ? parseAmount(amountNode) : undefined,
					cost: costSpecNode ? parseCostSpec(costSpecNode) : undefined,
					price,
				});
			}
		}
	} catch (e) {
		logger.error(`findAllTransactions query error: ${e}`);
	}

	// Supplement header-only transactions using transaction query (no recursive traversal)
	if (transactionsMap.size === 0) {
		// Try to at least get transactions list
		const txnQuery = TreeQuery.getQueryByTokenName('transaction');
		const captures = await txnQuery.captures(tree);
		for (const cap of captures) {
			const node = cap.node;
			if (node.type !== 'transaction') continue;
			const dateNode = node.childForFieldName('date');
			const date = dateNode ? dateNode.text : '';
			const flagNode = node.childForFieldName('txn');
			const flag = flagNode ? flagNode.text : undefined;
			const headerRange = computeHeaderRange(node);
			transactionsMap.set(node.id, { node, date, flag, headerRange, postings: [] });
		}
	}

	const result = Array.from(transactionsMap.values());
	lruCache.set(key, result);
	return result;
}

/**
 * Check if a node is within the specified range
 */
export function isNodeInRange(node: Parser.SyntaxNode, range: Range): boolean {
	const nodeStartLine = node.startPosition.row;
	const nodeEndLine = node.endPosition.row;

	return (
		(nodeStartLine >= range.start.line && nodeStartLine <= range.end.line)
		|| (nodeEndLine >= range.start.line && nodeEndLine <= range.end.line)
		|| (nodeStartLine <= range.start.line && nodeEndLine >= range.end.line)
	);
}
