import { Logger } from '@bean-lsp/shared';
import Big from 'big.js';
import { Connection, Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { findAllTransactions } from '../utils/ast-utils';
import {
	checkTransactionBalance,
	hasBothCostAndPrice,
	hasEmptyCost,
	hasOnlyOneIncompleteAmount,
	Posting,
} from '../utils/balance-checker';
import { BeancountOptionsManager } from '../utils/beancount-options';
import { Feature } from './types';

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
		private readonly optionsManager: BeancountOptionsManager,
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

		this.optionsManager.onOptionChange(e => {
			if (['infer_tolerance_from_cost', 'inferred_tolerance_multiplier'].includes(e.name)) {
				this.documents.all().forEach(doc => {
					this.validateDocument(doc, connection);
				});
			}
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

		// Listen for document changes and validate them
		this.documents.onDidChangeContent(change => {
			this.validateDocument(change.document, connection);
		});
	}

	private async validateDocument(document: TextDocument, connection: Connection): Promise<void> {
		try {
			const diagnostics = await this.provideDiagnostics(document);
			connection.sendDiagnostics({
				uri: document.uri,
				diagnostics,
			});
		} catch (err) {
			this.logger.error(`Error validating document: ${err}`);
		}
	}

	private async provideDiagnostics(document: TextDocument): Promise<Diagnostic[]> {
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return [];
		}

		const diagnostics: Diagnostic[] = [];

		// Find all transactions in the document
		const transactions = findAllTransactions(tree.rootNode, document);

		// Check each transaction for balance - with chunking for performance
		const CHUNK_SIZE = 50; // Process transactions in chunks to avoid blocking UI
		for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
			const chunk = transactions.slice(i, i + CHUNK_SIZE);

			for (const transaction of chunk) {
				// Skip transactions with only one posting having no amount
				// (Beancount will auto-compute this)
				if (hasOnlyOneIncompleteAmount(transaction.postings)) {
					continue;
				}

				// Check for both cost and price on the same posting (which is not allowed)
				if (hasBothCostAndPrice(transaction.postings)) {
					// TODO: We are currently not supporting this
					continue;
				}

				// Check for empty cost
				if (hasEmptyCost(transaction.postings)) {
					// TODO: We are currently not supporting this
					continue;
				}

				// Check transaction balance
				const tolerance = this.getTolerance(transaction.postings, this.optionsManager);
				const result = checkTransactionBalance(transaction.postings, tolerance);
				if (!result.isBalanced) {
					const percision = result.tolerance!.toString().split('.')?.[1]?.length ?? 2;
					const amount = result.difference?.toFixed(percision) || '0';
					const currency = result.currency || '';
					diagnostics.push({
						severity: DiagnosticSeverity.Error,
						range: transaction.headerRange,
						message: `Transaction does not balance: ${amount} ${currency}`,
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
	private getTolerance(postings: Posting[], optionsManager: BeancountOptionsManager) {
		if (this.optionsManager.getOption('infer_tolerance_from_cost').asBoolean()) {
			/**
			 * Inferring Tolerances from Cost
	  There is also a feature that expands the maximum tolerance inferred on transactions to include values on cost currencies inferred by postings held at-cost or converted at price. Those postings can imply a tolerance value by multiplying the smallest digit of the unit by the cost or price value and taking half of that value.
	  For example, if a posting has an amount of "2.345 RGAGX {45.00 USD}" attached to it, it implies a tolerance of 0.001 x 45.00 / 2 = 0.045 USD and the sum of all such possible rounding errors is calculate for all postings held at cost or converted from a price, and the resulting tolerance is added to the list of candidates used to figure out the tolerance we should use for the given commodity (we use the maximum value of all the inferred tolerances).
			 */
			const inferredToleranceMultiplier = this.optionsManager.getOption('inferred_tolerance_multiplier')
				.asDecimal();
			const allInferredTolerances = postings.filter(p => {
				return p.amount && (p.cost || p.price);
			}).map(posting => {
				const smallestDigit = (new Big(10)).pow(-posting.amount!.number!.split('.')[1]!.length);
				return {
					currency: posting.cost?.currency || posting.price?.currency as string,
					number: smallestDigit.mul(posting.cost!.number || posting.price!.number).mul(
						inferredToleranceMultiplier,
					),
				};
			}).reduce((acc, cur) => {
				if (!acc[cur.currency]) {
					acc[cur.currency] = cur.number;
				} else if (acc[cur.currency]!.lt(cur.number)) {
					acc[cur.currency] = cur.number;
				}
				return acc;
			}, {} as Record<string, Big>);

			return allInferredTolerances;
		} else {
			return this.config.tolerance;
		}
	}
}
