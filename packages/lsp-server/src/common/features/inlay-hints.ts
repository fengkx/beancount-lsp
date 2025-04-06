import { Logger } from '@bean-lsp/shared';
import { Big } from 'big.js';
import { Connection, InlayHint, InlayHintKind, Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { findAllTransactions, getEndPosition, isNodeInRange } from '../utils/ast-utils';
import { checkTransactionBalance, hasEmptyCost, hasOnlyOneIncompleteAmount, Posting } from '../utils/balance-checker';
import { Feature } from './types';

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
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
	) {}

	register(connection: Connection): void {
		// Register the inlay hint provider
		connection.onRequest(
			'textDocument/inlayHint',
			async (params) => {
				logger.info(`InlayHint request received for ${params.textDocument.uri}`);

				const document = await this.documents.retrieve(params.textDocument.uri);
				const tree = await this.trees.getParseTree(document);

				if (!tree) {
					return [];
				}

				if (this.inlayHintsEnabled === null) {
					const beanLspSettings = await connection.workspace.getConfiguration({ section: 'beanLsp' });
					this.inlayHintsEnabled = beanLspSettings.inlayHints.enable;
				}

				if (!this.inlayHintsEnabled) {
					return [];
				}

				return this.provideInlayHints(document, params.range);
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
	private async provideInlayHints(document: TextDocument, range: Range): Promise<InlayHint[]> {
		const hints: InlayHint[] = [];
		const tree = await this.trees.getParseTree(document);

		if (!tree) {
			return hints;
		}

		// Find all transactions in the document
		const transactions = findAllTransactions(tree.rootNode, document);

		// Process each transaction
		for (const transaction of transactions) {
			// Check if the node is within the requested range
			if (!isNodeInRange(transaction.node, range)) {
				continue;
			}

			// Check if this transaction has exactly one posting without an amount
			if (hasOnlyOneIncompleteAmount(transaction.postings)) {
				if (hasEmptyCost(transaction.postings)) {
					// Currently not supported
					continue;
				}
				// Find the incomplete posting
				const incompletePosting = transaction.postings.find(posting => !posting.amount);

				if (incompletePosting) {
					// Calculate the balance
					const balanceResult = checkTransactionBalance(transaction.postings, 0.001); // Using a tolerance of 0.001

					// If the transaction is already balanced (which shouldn't happen with one incomplete posting)
					// or if we don't have a currency, skip
					if (balanceResult.isBalanced || !balanceResult.currency) {
						continue;
					}

					// Format the amount with the correct sign (negated since it balances the others)
					const calculatedAmount = balanceResult.difference?.neg() || new Big(0);

					// Format the number to have at least 2 decimal places
					let formattedNumber = calculatedAmount.toFixed(2);
					// If the original number had more decimal places, preserve them
					const originalDecimals = calculatedAmount.toString().split('.')[1]?.length || 0;
					if (originalDecimals > 2) {
						formattedNumber = calculatedAmount.toFixed(originalDecimals);
					}

					// Get the currency column position for alignment
					const currencyColumnPosition = this.findCurrencyColumnPosition(transaction.postings);

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
							lineEndPos.character + 2, // Add 2 spaces after account
						);

						// Calculate spacing needed to align currency
						const numberEndPosition = hintPosition.character + formattedNumber.length;
						const prefixSpacesNeeded =
							currencyColumnPosition > 0 && currencyColumnPosition > numberEndPosition
								? currencyColumnPosition - numberEndPosition - 1
								: 0;

						// Create a single hint with proper spacing
						const hintLabel = ' '.repeat(prefixSpacesNeeded) + formattedNumber + ' '
							+ balanceResult.currency;

						hints.push({
							position: hintPosition,
							label: `  ${hintLabel}`,
							kind: InlayHintKind.Parameter,
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
