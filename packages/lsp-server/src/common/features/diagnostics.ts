import { Logger } from '@bean-lsp/shared';
import Big from 'big.js';
import { Connection, Diagnostic, DiagnosticSeverity, Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from 'web-tree-sitter';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import {
	checkTransactionBalance,
	hasBothCostAndPrice,
	hasOnlyOneIncompleteAmount,
	Posting,
} from '../utils/balance-checker';
import { Feature } from './types';

// Interface to represent a transaction
interface Transaction {
	node: Parser.SyntaxNode;
	date: string;
	headerRange: Range; // Added to store the header range for optimized highlighting
	postings: Posting[];
}

// Configuration interface for diagnostics
interface DiagnosticsConfig {
	tolerance: number;
}

export class DiagnosticsFeature implements Feature {
	private logger = new Logger('DiagnosticsFeature');
	private config: DiagnosticsConfig = {
		tolerance: 0.005, // Default tolerance
	};

	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
	) {}

	register(connection: Connection): void {
		this.logger.info('Registering diagnostics feature');

		// Listen for configuration changes
		connection.onDidChangeConfiguration(async (change) => {
			if (change.settings?.beancount?.diagnostics) {
				const diagnosticsSettings = change.settings.beancount.diagnostics;
				if (typeof diagnosticsSettings.tolerance === 'number') {
					this.config.tolerance = diagnosticsSettings.tolerance;
					this.logger.info(`Updated tolerance to ${this.config.tolerance}`);
				}
			}

			// Re-validate all open documents with new configuration
			this.documents.all().forEach(document => {
				this.validateDocument(document, connection);
			});
		});

		// Fetch the configuration initially
		connection.workspace.getConfiguration().then(configuration => {
			const diagnosticsSettings = configuration?.beancount?.diagnostics;
			if (diagnosticsSettings?.tolerance !== undefined) {
				this.config.tolerance = diagnosticsSettings.tolerance;
				this.logger.info(`Initial tolerance set to ${this.config.tolerance}`);
			}
		}).catch(error => {
			this.logger.error(`Error fetching configuration: ${error}`);
		});

		// Validate all open documents initially
		this.documents.all().forEach(document => {
			this.validateDocument(document, connection);
		});

		// Validate when document changes
		this.documents.onDidChangeContent(event => {
			this.validateDocument(event.document, connection);
		});

		// Validate when document is opened
		this.documents.onDidOpen(event => {
			this.validateDocument(event.document, connection);
		});
	}

	private async validateDocument(document: TextDocument, connection: Connection): Promise<void> {
		try {
			const diagnostics = await this.provideDiagnostics(document);
			connection.sendDiagnostics({ uri: document.uri, diagnostics });
		} catch (error) {
			this.logger.error(`Error validating document: ${error}`);
		}
	}

	private async provideDiagnostics(document: TextDocument): Promise<Diagnostic[]> {
		const diagnostics: Diagnostic[] = [];

		// Get the parse tree for the document
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return diagnostics;
		}

		// Find all transactions in the document
		const transactions = this.findAllTransactions(tree, document);

		// Check each transaction for balance - with chunking for performance
		const CHUNK_SIZE = 100; // Process transactions in chunks to avoid blocking

		for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
			const chunk = transactions.slice(i, i + CHUNK_SIZE);

			for (const transaction of chunk) {
				// Skip transactions with only one posting with incomplete amount (auto-balanced)
				if (hasOnlyOneIncompleteAmount(transaction.postings)) {
					continue;
				}

				// Skip transactions with both cost and price annotations (not supported by Beancount)
				if (hasBothCostAndPrice(transaction.postings)) {
					continue;
				}

				// Check if transaction is balanced
				const balanceResult = checkTransactionBalance(transaction.postings, this.config.tolerance);
				if (!balanceResult.isBalanced) {
					// Add diagnostic for unbalanced transaction
					// Use the optimized header range instead of the full transaction range
					const range = transaction.headerRange;

					// Create a more informative message
					let message = `Transaction doesn't balance: `;

					if (balanceResult.difference && balanceResult.currency) {
						const diffStr = balanceResult.difference.toString();

						message += `${diffStr} ${balanceResult.currency}`;
					}

					if (balanceResult.tolerance) {
						message += `. Tolerance: ${balanceResult.tolerance.toString()}`;
					}

					diagnostics.push({
						severity: DiagnosticSeverity.Error,
						range,
						message,
						source: 'beancount-lsp',
					});
				}
			}

			// If there are more chunks to process, yield to the event loop
			if (i + CHUNK_SIZE < transactions.length) {
				await new Promise(resolve => setTimeout(resolve, 0));
			}
		}

		return diagnostics;
	}

	/**
	 * Finds all transactions in the parse tree and extracts their postings
	 *
	 * @param tree The parse tree from tree-sitter
	 * @param document The text document
	 * @returns Array of transaction objects with their postings
	 */
	private findAllTransactions(tree: Parser.Tree, document: TextDocument): Transaction[] {
		const transactions: Transaction[] = [];

		// Find all transaction nodes in the tree
		const transactionNodes = this.queryNodes(tree.rootNode, 'transaction');

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
			const postings: Posting[] = [];

			// Query all posting nodes under this transaction
			const postingNodes = this.queryNodes(node, 'posting');

			for (const postingNode of postingNodes) {
				// Extract account
				const accountNode = postingNode.childForFieldName('account');
				const account = accountNode ? accountNode.text : '';

				// Parse amount if present
				let amount: { number: string; currency: string } | undefined;
				const amountNode = postingNode.childForFieldName('amount');
				if (amountNode) {
					amount = this.parseAmount(amountNode);
				}

				// Parse cost if present
				let cost: { number: string; currency: string } | undefined;
				const costSpecNode = postingNode.childForFieldName('cost_spec');
				if (costSpecNode) {
					cost = this.parseCostSpec(costSpecNode);
				}

				// Parse price annotation if present
				let price: { type: '@' | '@@'; number: string; currency: string } | undefined;
				const priceNode = postingNode.childForFieldName('price_annotation');
				if (priceNode) {
					// Determine if @ or @@ price
					const atNode = this.findChildByType(postingNode, 'at') || this.findChildByType(postingNode, 'atat');
					const priceType = atNode && atNode.type === 'atat' ? '@@' : '@';
					price = this.parsePriceAnnotation(priceNode, priceType);
				}

				postings.push({
					node: postingNode,
					account,
					amount,
					cost,
					price,
				});
			}

			transactions.push({
				node,
				date,
				headerRange,
				postings,
			});
		}

		return transactions;
	}

	private findChildByType(node: Parser.SyntaxNode, type: string): Parser.SyntaxNode | null {
		for (let i = 0; i < node.childCount; i++) {
			const child = node.child(i);
			if (child && child.type === type) {
				return child;
			}
		}
		return null;
	}

	private parseAmount(node: Parser.SyntaxNode): { number: string; currency: string } | undefined {
		if (!node) return undefined;

		// Find number and currency nodes
		let numberValue = '';
		let currencyValue = '';

		// First child should be a number expression
		const numberNode = node.child(0);
		if (numberNode) {
			numberValue = numberNode.text;
		}

		// Second child should be currency
		const currencyNode = node.child(1);
		if (currencyNode) {
			currencyValue = currencyNode.text;
		}

		if (!numberValue || !currencyValue) {
			return undefined;
		}

		return {
			number: numberValue,
			currency: currencyValue,
		};
	}

	private parseCostSpec(node: Parser.SyntaxNode): { number: string; currency: string } | undefined {
		if (!node) return undefined;

		// Extract cost components
		const costCompListNode = node.childForFieldName('cost_comp_list');
		if (!costCompListNode) return undefined;

		// Find a compound_amount node
		const costCompNodes = this.queryNodes(costCompListNode, 'cost_comp');

		for (const compNode of costCompNodes) {
			const compoundAmountNode = this.findChildByType(compNode, 'compound_amount');
			if (compoundAmountNode) {
				const perNode = compoundAmountNode.childForFieldName('per');
				const currencyNode = compoundAmountNode.childForFieldName('currency');

				if (perNode && currencyNode) {
					try {
						const number = perNode.text;
						const currency = currencyNode.text;
						return { number, currency };
					} catch (e) {
						this.logger.error(`Error parsing cost: ${e}`);
					}
				}
			}
		}

		return undefined;
	}

	private parsePriceAnnotation(
		node: Parser.SyntaxNode,
		priceType: '@' | '@@',
	): { type: '@' | '@@'; number: string; currency: string } | undefined {
		if (!node) return undefined;

		try {
			// The price_annotation node contains an incomplete_amount node
			const incompleteAmountNode = node.child(0);

			if (incompleteAmountNode && incompleteAmountNode.type === 'incomplete_amount') {
				// Get number and currency from the incomplete_amount node
				const numberNode = incompleteAmountNode.child(0);
				const currencyNode = incompleteAmountNode.child(1);

				if (numberNode && currencyNode) {
					const number = numberNode.text;
					const currency = currencyNode.text;

					if (number && currency) {
						return { type: priceType, number, currency };
					}
				}
			} else {
				// Fallback: try to parse directly from the text
				// Format is typically "NUMBER CURRENCY"
				const text = node.text.trim();
				const match = text.match(/^([\d.-]+)\s+([A-Z0-9]+)$/);

				if (match && match[1] && match[2]) {
					const number = match[1];
					const currency = match[2];
					return { type: priceType, number, currency };
				}
			}
		} catch (e) {
			this.logger.error(`Error parsing price annotation: ${e}`);
		}

		return undefined;
	}

	private queryNodes(node: Parser.SyntaxNode, type: string): Parser.SyntaxNode[] {
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
}
