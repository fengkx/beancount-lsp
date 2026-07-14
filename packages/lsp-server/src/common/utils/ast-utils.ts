import { Logger } from '@bean-lsp/shared';
import { Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import type * as Parser from 'web-tree-sitter';
import { TreeQuery } from '../language';
import { Posting } from './balance-checker';

// Create a logger for this module
const logger = new Logger('AstUtils');
const allTransactionsCache = new WeakMap<import('web-tree-sitter').Tree, Transaction[]>();
const rangedTransactionsCache = new WeakMap<import('web-tree-sitter').Tree, Map<string, Transaction[]>>();

/**
 * Represents a transaction in the AST
 */
export interface Transaction {
	date: string;
	flag: string | undefined; // Explicit with undefined to fix TypeScript error
	headerRange: Range; // Added to store the header range for optimized highlighting
	startIndex: number;
	endIndex: number;
	postings: Posting[];
}

/**
 * Query nodes of a specific type under a parent node
 */
export function queryNodes(node: Parser.SyntaxNode, type: string): Parser.SyntaxNode[] {
	const nodes: Parser.SyntaxNode[] = [];
	function visit(current: Parser.SyntaxNode) {
		if (current.type === type) nodes.push(current);
		for (const child of current.children) visit(child);
	}
	visit(node);
	return nodes;
}

/**
 * Find a child node by type
 */
export function findChildByType(node: Parser.SyntaxNode, type: string): Parser.SyntaxNode | null {
	return node.children.find(child => child.type === type) ?? null;
}

function parseAmountChildren(namedChildren: Parser.SyntaxNode[]): { number: string; currency: string } | undefined {
	const [numNode, currNode] = namedChildren;
	if (!numNode || !currNode) return undefined;

	return {
		number: numNode.text,
		currency: currNode.text,
	};
}

/**
 * Parse amount node into number and currency
 */
export function parseAmount(amountNode: Parser.SyntaxNode): { number: string; currency: string } | undefined {
	return parseAmountChildren(amountNode.namedChildren);
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

	// The grammar repeats this field for each component. childForFieldName preserves
	// the existing first-component semantics, while reading children in one batch
	// avoids a JS/WASM call for every child.
	const firstCostComponent = costSpecNode.childForFieldName('cost_comp_list');
	if (!firstCostComponent) return { number: '', currency: '', isTotalCost };

	let compoundAmountNode: Parser.SyntaxNode | undefined;
	let dateNode: Parser.SyntaxNode | undefined;
	for (const child of firstCostComponent.children) {
		if (child.type === 'compound_amount') compoundAmountNode = child;
		if (child.type === 'date') dateNode = child;
	}

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

	return { number: '', currency: '', isTotalCost };
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

function makeRangeCacheKey(documentVersion: number, range: Range): string {
	return `${documentVersion}:${range.start.line}:${range.start.character}:${range.end.line}:${range.end.character}`;
}

function makePosition(point: Parser.Point): Position {
	return Position.create(point.row, point.column);
}

function getTreeRangeCache(tree: import('web-tree-sitter').Tree): Map<string, Transaction[]> {
	let cache = rangedTransactionsCache.get(tree);
	if (!cache) {
		cache = new Map();
		rangedTransactionsCache.set(tree, cache);
	}
	return cache;
}

function makeTransactionId(node: Parser.SyntaxNode): string {
	return `${node.startIndex}:${node.endIndex}`;
}

function makeTransactionsCacheKey(documentVersion: number, range?: Range): string {
	if (!range) {
		return `txns:${documentVersion}:all`;
	}
	return `txns:${makeRangeCacheKey(documentVersion, range)}`;
}

function computeHeaderRange(document: TextDocument, node: Parser.SyntaxNode): Range {
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
	const atNode = postingNode.children.find(child => child.type === 'atat' || child.type === 'at');
	return atNode && atNode.type === 'atat' ? '@@' : '@';
}

function parseAmountDetails(amountNode: Parser.SyntaxNode | undefined): {
	amount: { number: string; currency: string } | undefined;
	currencyNode: Parser.SyntaxNode | undefined;
} {
	if (!amountNode) return { amount: undefined, currencyNode: undefined };

	const namedChildren = amountNode.namedChildren;
	const likelyCurrencyNode = namedChildren[1];
	return {
		amount: parseAmountChildren(namedChildren),
		currencyNode: likelyCurrencyNode?.type === 'currency'
			? likelyCurrencyNode
			: amountNode.children.find(child => child.type === 'currency'),
	};
}

function materializePosting(postingNode: Parser.SyntaxNode): Posting {
	const accountNode = postingNode.childForFieldName('account');
	const amountNode = postingNode.childForFieldName('amount');
	const { amount, currencyNode } = parseAmountDetails(amountNode ?? undefined);
	const costSpecNode = postingNode.childForFieldName('cost_spec');
	const priceNode = postingNode.childForFieldName('price_annotation');

	return {
		account: accountNode?.text ?? '',
		postingStartLine: postingNode.startPosition.row,
		accountEndPosition: accountNode ? makePosition(accountNode.endPosition) : undefined,
		amountCurrencyColumn: currencyNode?.startPosition.column,
		amount,
		cost: costSpecNode ? parseCostSpec(costSpecNode) : undefined,
		price: priceNode ? parsePriceAnnotation(priceNode, inferPriceTypeFromPosting(postingNode)) : undefined,
	};
}

function materializeTransaction(document: TextDocument, transactionNode: Parser.SyntaxNode): Transaction {
	const postings = transactionNode.namedChildren
		.filter(child => child.type === 'posting')
		.map(materializePosting);

	return {
		date: transactionNode.childForFieldName('date')?.text ?? '',
		flag: transactionNode.childForFieldName('txn')?.text,
		headerRange: computeHeaderRange(document, transactionNode),
		startIndex: transactionNode.startIndex,
		endIndex: transactionNode.endIndex,
		postings,
	};
}

function findAncestorOfType(node: Parser.SyntaxNode | null, type: string): Parser.SyntaxNode | null {
	let current = node;
	while (current) {
		if (current.type === type) {
			return current;
		}
		current = current.parent;
	}
	return null;
}

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
	const cached = allTransactionsCache.get(tree);
	if (cached) {
		return cached;
	}

	// Aggregate using tree-sitter queries for performance
	const transactionsMap = new Map<string, Transaction>();

	// Run combined query that yields both header and posting matches
	try {
		const q = TreeQuery.getQueryByTokenName('transaction_detail');
		const matches = await q.matches(tree);

		for (const m of matches) {
			let txnNode: Parser.SyntaxNode | undefined;
			let dateNode: Parser.SyntaxNode | undefined;
			let flagNode: Parser.SyntaxNode | undefined;
			let postingNode: Parser.SyntaxNode | undefined;
			let accountNode: Parser.SyntaxNode | undefined;
			let amountNode: Parser.SyntaxNode | undefined;
			let costSpecNode: Parser.SyntaxNode | undefined;
			let priceAnnNode: Parser.SyntaxNode | undefined;
			for (const capture of m.captures) {
				switch (capture.name) {
					case 'transaction':
						txnNode = capture.node;
						break;
					case 'date':
						dateNode = capture.node;
						break;
					case 'txn':
						flagNode = capture.node;
						break;
					case 'posting':
						postingNode = capture.node;
						break;
					case 'account':
						accountNode = capture.node;
						break;
					case 'amount':
						amountNode = capture.node;
						break;
					case 'cost_spec':
						costSpecNode = capture.node;
						break;
					case 'price':
						priceAnnNode = capture.node;
						break;
				}
			}
			if (!txnNode) continue;
			const txnId = makeTransactionId(txnNode);
			let txn = transactionsMap.get(txnId);
			if (!txn) {
				// initialize entry when first seen (may be via posting or header)
				txn = {
					date: '',
					flag: undefined,
					headerRange: computeHeaderRange(document, txnNode),
					startIndex: txnNode.startIndex,
					endIndex: txnNode.endIndex,
					postings: [],
				};
				transactionsMap.set(txnId, txn);
			}

			// If this match includes header captures, set date/flag
			const dateText = dateNode?.text;
			const flagText = flagNode?.text;
			if (dateText !== undefined) txn.date = dateText;
			if (flagText !== undefined) txn.flag = flagText;

			// If this match includes a posting capture, build Posting
			if (postingNode) {
				accountNode ??= postingNode.childForFieldName('account') ?? undefined;
				amountNode ??= postingNode.childForFieldName('amount') ?? undefined;
				costSpecNode ??= postingNode.childForFieldName('cost_spec') ?? undefined;
				priceAnnNode ??= postingNode.childForFieldName('price_annotation') ?? undefined;
				const { amount, currencyNode } = parseAmountDetails(amountNode);

				let price: { type: '@' | '@@'; number: string; currency: string } | undefined;
				if (priceAnnNode) {
					price = parsePriceAnnotation(priceAnnNode, inferPriceTypeFromPosting(postingNode));
				}

				txn.postings.push({
					account: accountNode?.text ?? '',
					postingStartLine: postingNode.startPosition.row,
					accountEndPosition: accountNode ? makePosition(accountNode.endPosition) : undefined,
					amountCurrencyColumn: currencyNode?.startPosition.column,
					amount,
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
			const headerRange = computeHeaderRange(document, node);
			transactionsMap.set(makeTransactionId(node), {
				date,
				flag,
				headerRange,
				startIndex: node.startIndex,
				endIndex: node.endIndex,
				postings: [],
			});
		}
	}

	const result = Array.from(transactionsMap.values());
	allTransactionsCache.set(tree, result);
	return result;
}

export async function findTransactionsIntersectingRange(
	tree: import('web-tree-sitter').Tree,
	document: TextDocument,
	range: Range,
): Promise<Transaction[]> {
	const rangeCache = getTreeRangeCache(tree);
	const key = makeTransactionsCacheKey(document.version, range);
	const cached = rangeCache.get(key);
	if (cached) {
		return cached;
	}

	const startPosition = { row: range.start.line, column: range.start.character };
	const endPosition = { row: range.end.line, column: range.end.character };
	const startOffset = document.offsetAt(range.start);
	const rawEndOffset = document.offsetAt(range.end);
	const endLookupOffset = Math.max(startOffset, rawEndOffset - 1);
	const candidateTransactions = new Map<string, Parser.SyntaxNode>();

	const transactionQuery = TreeQuery.getQueryByTokenName('transaction');
	const captures = await transactionQuery.captures(tree, startPosition, endPosition);
	for (const capture of captures) {
		if (capture.node.type === 'transaction') {
			candidateTransactions.set(makeTransactionId(capture.node), capture.node);
		}
	}

	const boundaryNodes = [
		tree.rootNode.descendantForIndex(startOffset),
		tree.rootNode.descendantForIndex(endLookupOffset),
	];
	for (const boundaryNode of boundaryNodes) {
		const transactionNode = findAncestorOfType(boundaryNode, 'transaction');
		if (transactionNode) {
			candidateTransactions.set(makeTransactionId(transactionNode), transactionNode);
		}
	}

	const result = Array.from(candidateTransactions.values())
		.filter(transactionNode => isNodeInRange(transactionNode, range))
		.sort((left, right) => left.startIndex - right.startIndex)
		.map(transactionNode => materializeTransaction(document, transactionNode));

	rangeCache.set(key, result);
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
