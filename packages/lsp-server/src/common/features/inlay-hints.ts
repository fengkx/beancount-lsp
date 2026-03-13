import { Logger } from '@bean-lsp/shared';
import { Big } from 'big.js';
import { Connection, InlayHint, InlayHintKind, Position, Range, TextEdit } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { findTransactionsIntersectingRange } from '../utils/ast-utils';
import { checkTransactionBalance, hasBothCostAndPrice, hasEmptyCost, hasOnlyOneIncompleteAmount, Posting } from '../utils/balance-checker';
import { Amount, Feature, RealBeancountManager } from './types';

// Create a logger for this feature
const logger = new Logger('InlayHint');

/**
 * Provides inlay hints for calculated transaction amounts
 *
 * When a transaction has one posting without an amount, we can calculate
 * what it should be to balance the transaction. This feature shows that
 * calculated amount as an inlay hint.
 */
export class InlayHintFeature implements Feature {
	private inlayHintsEnabled: boolean | null = null;
	private readonly preciseHintCache = new Map<string, Promise<Amount | null>>();
	private static readonly MAX_PRECISE_HINT_CACHE_SIZE = 100;
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly beanMgr?: RealBeancountManager,
	) {}

	register(connection: Connection): void {
		// Register the inlay hint provider
		connection.onRequest(
			'textDocument/inlayHint',
			async (params) => {
				try {
					const document = await this.documents.retrieve(params.textDocument.uri);
					const tree = await this.trees.getParseTree(document);

					if (!tree) {
						return [];
					}

					if (this.inlayHintsEnabled === null) {
						const beanLspSettings = await connection.workspace.getConfiguration({
							scopeUri: params.textDocument.uri,
							section: 'beanLsp',
						});
						this.inlayHintsEnabled = beanLspSettings?.inlayHints?.enable;
					}

					if (!this.inlayHintsEnabled) {
						return [];
					}

					return this.provideInlayHints(document, params.range, tree);
				} catch (error) {
					// Tree-sitter wasm can occasionally throw on stale node access during concurrent edits.
					this.trees.invalidateCache(params.textDocument.uri);
					logger.error(`InlayHint request failed for ${params.textDocument.uri}: ${String(error)}`);
					return [];
				}
			},
		);
	}

	/**
	 * Provides inlay hints for a document within a specific range
	 *
	 * @param document The text document
	 * @param range The range to provide hints for
	 * @returns Array of inlay hints
	 */
	private async provideInlayHints(document: TextDocument, range: Range, treeArg?: import('web-tree-sitter').Tree): Promise<InlayHint[]> {
		const hints: InlayHint[] = [];
		const tree = treeArg ?? await this.trees.getParseTree(document);

		if (!tree) {
			return hints;
		}

		const transactions = await findTransactionsIntersectingRange(tree, document, range);

		// Process each transaction
		for (const transaction of transactions) {
			// Check if this transaction has exactly one posting without an amount
			if (hasOnlyOneIncompleteAmount(transaction.postings)) {
				const requiresPreciseHint = this.requiresPreciseHint(transaction.postings);
				const usePreciseHint = this.canUsePreciseHint(transaction.postings);
				// JS balance checker does not model cost+price or empty-cost semantics correctly.
				if (requiresPreciseHint && !usePreciseHint) {
					continue;
				}
				// Find the incomplete posting
				const incompletePosting = transaction.postings.find(posting => !posting.amount);

				if (incompletePosting) {
					const formattedImbalances = await this.calculateHintAmounts(document, transaction, incompletePosting, usePreciseHint);
					if (formattedImbalances.length === 0) {
						continue;
					}
					const firstNumberLength = formattedImbalances[0]?.split(/\s+/, 1)[0]?.length ?? 0;

					// Get the currency column position for alignment
					const currencyColumnPosition = this.findCurrencyColumnPosition(transaction.postings);

					// Join all imbalance strings with comma and space
					const combinedImbalanceText = formattedImbalances.join(', ');

					// Create an inlay hint for the calculated amount
					const accountNode = incompletePosting.node.childForFieldName('account');
					if (accountNode) {
						// Create position for inlay hint
						const line = document.getText(
							Range.create(
								Position.create(accountNode.endPosition.row, 0),
								Position.create(accountNode.endPosition.row + 1, 0),
							),
						).replace(/[\r|\n]$/g, '');
						const lineEndPos = Position.create(accountNode.endPosition.row, line.length);
						const hintPosition = Position.create(
							lineEndPos.line,
							lineEndPos.character,
						);

						// Calculate spacing needed to align currency
						const numberEndPosition = hintPosition.character + firstNumberLength;
						const prefixSpacesNeeded =
							currencyColumnPosition > 0 && currencyColumnPosition > numberEndPosition
								? currencyColumnPosition - numberEndPosition - 1
								: 0;

						// Create a single hint with proper spacing
						const hintLabel = ' '.repeat(prefixSpacesNeeded) + combinedImbalanceText;
						const textEdits: TextEdit[] = [];
						if (formattedImbalances.length === 1) {
							textEdits.push(
								{
									range: Range.create(hintPosition, hintPosition),
									newText: hintLabel,
								},
							);
						}

						hints.push({
							position: hintPosition,
							label: hintLabel,
							kind: InlayHintKind.Parameter,
							textEdits,
							paddingLeft: false,
							paddingRight: false,
							tooltip: 'Calculated amount to balance transaction',
						});
					}
				}
			}
		}

		return hints;
	}

	private requiresPreciseHint(postings: Posting[]): boolean {
		return hasBothCostAndPrice(postings) || hasEmptyCost(postings);
	}

	private async calculateHintAmounts(
		document: TextDocument,
		transaction: {
			headerRange: Range;
			postings: Posting[];
		},
		incompletePosting: Posting,
		usePreciseHint: boolean,
	): Promise<string[]> {
		if (usePreciseHint) {
			const preciseAmount = await this.getPreciseIncompletePostingHint(document, transaction.headerRange, incompletePosting);
			if (!preciseAmount) {
				return [];
			}
			return [this.formatAmount(preciseAmount.number, preciseAmount.currency)];
		}

		const balanceResult = checkTransactionBalance(transaction.postings, 0.001);
		if (balanceResult.isBalanced || balanceResult.imbalances.length === 0) {
			return [];
		}

		return balanceResult.imbalances.map((imbalance) => {
			const calculatedAmount = imbalance.difference.neg() || new Big(0);
			return this.formatAmount(calculatedAmount.toString(), imbalance.currency);
		});
	}

	private canUsePreciseHint(postings: Posting[]): boolean {
		return this.requiresPreciseHint(postings) && this.beanMgr?.canResolvePreciseIncompletePostingHint() === true;
	}

	private async getPreciseIncompletePostingHint(
		document: TextDocument,
		transactionRange: Range,
		incompletePosting: Posting,
	): Promise<Amount | null> {
		if (!this.beanMgr) {
			return null;
		}

		const key = [
			document.uri,
			document.version,
			transactionRange.start.line,
			incompletePosting.node.startPosition.row,
			incompletePosting.account,
		].join(':');
		const cached = this.preciseHintCache.get(key);
		if (cached) {
			try {
				return await cached;
			} catch {
				return null;
			}
		}

		// Null results are treated as transient because runtime/file sync may catch up after a refresh.
		const pending = this.resolvePreciseHint(document, transactionRange, incompletePosting)
			.then((amount) => {
				if (amount === null) {
					this.preciseHintCache.delete(key);
				}
				return amount;
			})
			.catch((error) => {
				this.preciseHintCache.delete(key);
				throw error;
			});
		this.preciseHintCache.set(key, pending);
		if (this.preciseHintCache.size > InlayHintFeature.MAX_PRECISE_HINT_CACHE_SIZE) {
			const oldestKey = this.preciseHintCache.keys().next().value;
			if (oldestKey) {
				this.preciseHintCache.delete(oldestKey);
			}
		}
		try {
			return await pending;
		} catch {
			return null;
		}
	}

	private async resolvePreciseHint(
		document: TextDocument,
		transactionRange: Range,
		incompletePosting: Posting,
	): Promise<Amount | null> {
		return this.beanMgr!.getPreciseIncompletePostingHint({
			targetUri: document.uri,
			transactionStartLine: transactionRange.start.line,
			postingStartLine: incompletePosting.node.startPosition.row,
			account: incompletePosting.account,
		});
	}

	private formatAmount(numberText: string, currency: string): string {
		const amount = new Big(numberText);
		let formattedNumber = amount.toFixed(2);
		const decimals = amount.toString().split('.')[1]?.length || 0;
		if (decimals > 2) {
			formattedNumber = amount.toFixed(decimals);
		}
		return `${formattedNumber} ${currency}`;
	}

	/**
	 * Finds the column position where currency symbols should be aligned
	 * based on other postings in the transaction
	 */
	private findCurrencyColumnPosition(postings: Posting[]): number {
		let maxCurrencyPosition = 0;

		// Find the rightmost currency position among postings with amounts
		for (const posting of postings) {
			if (posting.amount && posting.node) {
				const amountNode = posting.node.childForFieldName('amount');
				if (amountNode) {
					const currencyNode = amountNode.children.find(c => c.type === 'currency');
					if (currencyNode) {
						// Get the position of the currency
						const currencyPosition = currencyNode.startPosition.column;
						if (currencyPosition > maxCurrencyPosition) {
							maxCurrencyPosition = currencyPosition;
						}
					}
				}
			}
		}

		return maxCurrencyPosition;
	}
}
