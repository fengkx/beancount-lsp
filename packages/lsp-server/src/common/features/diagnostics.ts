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
import { globalEventBus, GlobalEvents } from '../utils/event-bus';
import { Feature, RealBeancountManager } from './types';

// Configuration interface for diagnostics
interface DiagnosticsConfig {
	tolerance: number;
	warnOnIncompleteTransaction: boolean;
}

export class DiagnosticsFeature implements Feature {
	private logger = new Logger('DiagnosticsFeature');
	private config: DiagnosticsConfig = {
		tolerance: 0.005, // Default tolerance
		warnOnIncompleteTransaction: true, // Default to show warnings for incomplete transactions
	};
	private diagnosticsFromBeancount: { [uri: string]: Diagnostic[] } = {};

	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly optionsManager: BeancountOptionsManager,
		private readonly beanMgr: RealBeancountManager | undefined,
	) {}

	async register(connection: Connection): Promise<void> {
		this.logger.info('Registering diagnostics feature');

		// Register callback on global bus to update diagnosticsFromBeancount on save
		globalEventBus.on(GlobalEvents.BeancountUpdate, async () => {
			this.updateDiagnosticsFromBeancount();
			await this.validateAllDocuments(connection);
		});

		// Listen for configuration changes
		globalEventBus.on(GlobalEvents.ConfigurationChanged, async () => {
			const configuration = await connection.workspace.getConfiguration();
			if (configuration.settings?.beancount?.diagnostics) {
				const diagnosticsSettings = configuration.settings.beancount.diagnostics;
				if (typeof diagnosticsSettings.tolerance === 'number') {
					this.config.tolerance = diagnosticsSettings.tolerance;
					this.logger.info(`Updated tolerance to ${this.config.tolerance}`);
				}
				if (typeof diagnosticsSettings.warnOnIncompleteTransaction === 'boolean') {
					this.config.warnOnIncompleteTransaction = diagnosticsSettings.warnOnIncompleteTransaction;
					this.logger.info(
						`Updated warnOnIncompleteTransaction to ${this.config.warnOnIncompleteTransaction}`,
					);
				}
			}

			// Re-validate all open documents with new configuration
			await this.validateAllDocuments(connection);
		});

		this.optionsManager.onOptionChange(async e => {
			if (['infer_tolerance_from_cost', 'inferred_tolerance_multiplier'].includes(e.name)) {
				await this.validateAllDocuments(connection);
			}
		});

		// Fetch the configuration initially
		try {
			const configuration = await connection.workspace.getConfiguration();
			const diagnosticsSettings = configuration?.beancount?.diagnostics;

			if (diagnosticsSettings?.tolerance !== undefined) {
				this.config.tolerance = diagnosticsSettings.tolerance;
				this.logger.info(`Initial tolerance set to ${this.config.tolerance}`);
			}

			if (diagnosticsSettings?.warnOnIncompleteTransaction !== undefined) {
				this.config.warnOnIncompleteTransaction = diagnosticsSettings.warnOnIncompleteTransaction;
				this.logger.info(
					`Initial warnOnIncompleteTransaction set to ${this.config.warnOnIncompleteTransaction}`,
				);
			}

			// Validate all open documents initially
			await this.validateAllDocuments(connection);

			// Listen for document changes and validate them
			this.documents.onDidChangeContent(async change => {
				await this.validateDocument(change.document, connection);
			});
		} catch (error) {
			this.logger.error(`Error fetching configuration: ${error}`);
		}
	}

	private async validateAllDocuments(connection: Connection): Promise<void> {
		await Promise.all(
			this.documents.all().map(async doc => {
				await this.validateDocument(doc, connection);
			}),
		);

		const documentsInStore = new Set(this.documents.keys());
		await Promise.all(
			Object.entries(this.diagnosticsFromBeancount).map(async ([uri, diagnostics]) => {
				if (documentsInStore.has(uri)) {
					return;
				}

				await connection.sendDiagnostics({ uri, diagnostics });
			}),
		);
	}

	private updateDiagnosticsFromBeancount() {
		if (!this.beanMgr) {
			return;
		}

		let diagnosticsFromBeancount: { [uri: string]: Diagnostic[] } = {};

		const errors = this.beanMgr.getErrors();
		const flags = this.beanMgr.getFlagged();

		const addDiagnostic = (severity: DiagnosticSeverity, line: number, file: string, message: string) => {
			const range = {
				start: { line: Math.max(line - 1, 0), character: 0 },
				end: { line: Math.max(line, 1), character: 0 },
			};

			const diag = {
				severity,
				range,
				message,
				source: 'beancount-lsp',
			} as Diagnostic;

			let uri = `file://${file}`;

			if (diagnosticsFromBeancount[uri] === undefined) {
				diagnosticsFromBeancount[uri] = [];
			}
			diagnosticsFromBeancount[uri]!.push(diag);
		};

		errors.forEach((e) => {
			addDiagnostic(DiagnosticSeverity.Error, e.line, e.file, e.message);
		});

		flags.forEach((f) => {
			if (f.flag !== '!') {
				return;
			}

			addDiagnostic(DiagnosticSeverity.Warning, f.line, f.file, f.message);
		});
		this.diagnosticsFromBeancount = diagnosticsFromBeancount;
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
				// Check for pending transactions (marked with '!')
				if (transaction.flag === '!' && this.config.warnOnIncompleteTransaction) {
					diagnostics.push({
						severity: DiagnosticSeverity.Warning,
						range: transaction.headerRange,
						message: `transaction flagged with "!": ${document.getText(transaction.headerRange)}`,
						source: 'beancount-lsp',
					});
				}

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
				const tolerance = this.getTolerance(transaction.postings);
				const result = checkTransactionBalance(transaction.postings, tolerance);
				if (!result.isBalanced) {
					const imbalanceMessages: string[] = [];

					for (const imbalance of result.imbalances) {
						const precision = imbalance.tolerance.toString().split('.')?.[1]?.length ?? 2;
						const amount = imbalance.difference.toFixed(precision) || '0';
						const currency = imbalance.currency || '';
						imbalanceMessages.push(`${amount} ${currency}`);
					}

					diagnostics.push({
						severity: DiagnosticSeverity.Error,
						range: transaction.headerRange,
						message: `Transaction does not balance: ${imbalanceMessages.join(', ')}`,
						source: 'beancount-lsp',
					});
				}
			}

			// If there are more chunks to process, yield to the event loop
			if (i + CHUNK_SIZE < transactions.length) {
				await new Promise(resolve => setTimeout(resolve, 0));
			}
		}

		const beancountDiagnostics = this.diagnosticsFromBeancount[document.uri];
		if (!beancountDiagnostics) {
			return diagnostics;
		}
		this.logger.info(beancountDiagnostics);

		const mergedDiagnostics = this.mergeAndDedupDiagnostics(beancountDiagnostics, diagnostics);
		this.logger.info(mergedDiagnostics);

		return mergedDiagnostics;
	}

	private mergeAndDedupDiagnostics(preferred: Diagnostic[], if_missing: Diagnostic[]): Diagnostic[] {
		const seen = new Map<string, Diagnostic>();

		// generate a key based on line no and severity, as we only need one diagnostic of each kind
		const getKey = (d: Diagnostic) => `${d.range.start.line}:${d.severity}`;

		[...preferred, ...if_missing].forEach(d => {
			const key = getKey(d);
			if (!seen.has(key)) {
				seen.set(key, d);
			}
		});

		return Array.from(seen.values());
	}

	private getTolerance(postings: Posting[]) {
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
				const smallestDigit = (new Big(10)).pow(-(posting.amount!.number!.split('.')[1]?.length ?? 0));
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
