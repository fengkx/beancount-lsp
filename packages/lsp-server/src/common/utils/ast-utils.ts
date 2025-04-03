import { Logger } from '@bean-lsp/shared';
import { LRUCache } from 'mnemonist';
import { Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import type * as Parser from 'web-tree-sitter';
import { Posting } from './balance-checker';

// Create a logger for this module
const logger = new Logger('AstUtils');

/**
 * Represents a transaction in the AST
 */
export interface Transaction {
	node: Parser.SyntaxNode;
	date: string;
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
): { number: string; currency: string; isTotalCost?: boolean } | undefined {
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
		if (compoundAmountNode) {
			const perNode = compoundAmountNode.childForFieldName('per');
			const currencyNode = compoundAmountNode.childForFieldName('currency');

			if (perNode && currencyNode) {
				try {
					const number = perNode.text;
					const currency = currencyNode.text;
					return { number, currency, isTotalCost };
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
	const ammountNode = priceNode.namedChild(0);
	if (ammountNode) {
		const amount = parseAmount(ammountNode);
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
export function extractPostings(txnNode: Parser.SyntaxNode): Posting[] {
	const postings: Posting[] = [];

	// Use queryNodes to find all posting nodes
	const postingNodes = queryNodes(txnNode, 'posting');

	for (const postingNode of postingNodes) {
		// Extract account
		const accountNode = postingNode.childForFieldName('account');
		const account = accountNode ? accountNode.text : '';

		// Parse amount if present
		let amount: { number: string; currency: string } | undefined;
		const amountNode = postingNode.childForFieldName('amount');
		if (amountNode) {
			amount = parseAmount(amountNode);
		}

		// Parse cost if present
		let cost: { number: string; currency: string } | undefined;
		const costSpecNode = postingNode.childForFieldName('cost_spec');
		if (costSpecNode) {
			cost = parseCostSpec(costSpecNode);
		}

		// Parse price annotation if present
		let price: { type: '@' | '@@'; number: string; currency: string } | undefined;
		const priceNode = postingNode.childForFieldName('price_annotation');
		if (priceNode) {
			// Determine if @ or @@ price
			const atNode = findChildByType(postingNode, 'at') || findChildByType(postingNode, 'atat');
			const priceType = atNode && atNode.type === 'atat' ? '@@' : '@';
			price = parsePriceAnnotation(priceNode, priceType);
		}

		postings.push({
			node: postingNode,
			account,
			amount,
			cost,
			price,
		});
	}

	return postings;
}

const lruCache = new LRUCache<string, Transaction[]>(100);

/**
 * Finds all transactions in the parse tree and extracts their postings
 *
 * @param tree The parse tree from tree-sitter
 * @param document The text document
 * @returns Array of transaction objects with their postings
 */
export function findAllTransactions(rootNode: Parser.SyntaxNode, document: TextDocument): Transaction[] {
	const key = 'txns:' + document.uri + ':' + document.version;
	const cached = lruCache.get(key);
	if (cached) {
		return cached;
	}

	const transactions: Transaction[] = [];

	// Find all transaction nodes in the tree
	const transactionNodes = queryNodes(rootNode, 'transaction');

	for (const node of transactionNodes) {
		// Extract date
		const dateNode = node.childForFieldName('date');
		const date = dateNode ? dateNode.text : '';

		// Determine the header range for optimized highlighting
		// The header includes date, txn, payee, narration up to the first posting
		const headerEndRow = node.startPosition.row;
		const headerRange = Range.create(
			Position.create(node.startPosition.row, node.startPosition.column),
			Position.create(
				headerEndRow,
				document.positionAt(document.offsetAt(Position.create(headerEndRow + 1, 0)) - 1).character,
			),
		);

		// Extract postings
		const postings = extractPostings(node);

		transactions.push({
			node,
			date,
			headerRange,
			postings,
		});
	}

	lruCache.set(key, transactions);
	return transactions;
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

/**
 * Get the position at the end of a node
 */
export function getEndPosition(node: Parser.SyntaxNode): Position {
	return {
		line: node.endPosition.row,
		character: node.endPosition.column,
	};
}
