import { Logger } from '@bean-lsp/shared';
import Big from 'big.js';
import {
	CancellationToken,
	CancellationTokenSource,
	Connection,
	Diagnostic,
	DiagnosticSeverity,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { TreeQuery } from '../language';
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
import { validateExpression } from '../utils/expression-parser';
import { Feature, RealBeancountManager } from './types';

// Configuration interface for diagnostics
interface DiagnosticsConfig {
	tolerance: number;
	warnOnIncompleteTransaction: boolean;
}

const DIAGNOSTIC_SOURCE_LOCAL = 'beancount-lsp (lsp)';
const DIAGNOSTIC_SOURCE_BEANCHECK = 'beancount-lsp (beancheck)';

const ROOT_OPTION_NAMES = [
	'name_assets',
	'name_liabilities',
	'name_equity',
	'name_income',
	'name_expenses',
] as const;

const DEFAULT_ROOT_NAMES = new Set(['Assets', 'Liabilities', 'Equity', 'Income', 'Expenses']);
const INVALID_ACCOUNT_NAME_RE = /^Invalid account name:\s*(.+)$/;
const INVALID_UNKNOWN_ACCOUNT_RE = /^Invalid reference to unknown account ['"](.+?)['"]$/;

function hasNonAscii(text: string): boolean {
	for (let i = 0; i < text.length; i++) {
		if (text.charCodeAt(i) > 0x7F) {
			return true;
		}
	}
	return false;
}

function isNotGitUri(uri: string): boolean {
	return URI.parse(uri).scheme !== 'git';
}

function extractAccountFromBeancheckMessage(message: string): string | null {
	return message.match(INVALID_ACCOUNT_NAME_RE)?.[1]
		?? message.match(INVALID_UNKNOWN_ACCOUNT_RE)?.[1]
		?? null;
}

function shouldSuppressCustomRootParityDiagnostic(
	diag: Diagnostic,
	suppressibleRoots: Set<string>,
): boolean {
	const account = extractAccountFromBeancheckMessage(diag.message);
	if (!account) {
		return false;
	}
	const root = account.split(':')[0];
	return root != null && suppressibleRoots.has(root);
}

interface BrowserCustomRootCompatFilterInput {
	runtimeMode: 'off' | 'local' | 'wasm';
	validRootAccounts: Set<string>;
	customNonAsciiRoots: Set<string>;
}

interface BrowserCustomRootCompatFilterResult {
	diagnosticsByUri: Record<string, Diagnostic[]>;
	suppressedCount: number;
}

function filterBeancheckDiagnosticsForBrowserCustomRootCompat(
	diagnosticsByUri: Record<string, Diagnostic[]>,
	input: BrowserCustomRootCompatFilterInput,
): BrowserCustomRootCompatFilterResult {
	if (input.runtimeMode !== 'wasm' || input.customNonAsciiRoots.size === 0) {
		return { diagnosticsByUri, suppressedCount: 0 };
	}

	const suppressibleRoots = new Set(
		[...input.customNonAsciiRoots].filter(root => input.validRootAccounts.has(root)),
	);
	if (suppressibleRoots.size === 0) {
		return { diagnosticsByUri, suppressedCount: 0 };
	}

	let suppressedCount = 0;
	const next: Record<string, Diagnostic[]> = {};
	for (const [uri, diagnostics] of Object.entries(diagnosticsByUri)) {
		const kept = diagnostics.filter(diag => {
			if (!shouldSuppressCustomRootParityDiagnostic(diag, suppressibleRoots)) {
				return true;
			}
			suppressedCount += 1;
			return false;
		});
		if (kept.length > 0) {
			next[uri] = kept;
		}
	}

	return { diagnosticsByUri: next, suppressedCount };
}

export class DiagnosticsFeature implements Feature {
	private logger = new Logger('DiagnosticsFeature');
	private static readonly REVALIDATE_ON_OPTION_CHANGE = new Set([
		'infer_tolerance_from_cost',
		'inferred_tolerance_multiplier',
		'name_assets',
		'name_liabilities',
		'name_equity',
		'name_income',
		'name_expenses',
	]);
	private config: DiagnosticsConfig = {
		tolerance: 0.005, // Default tolerance
		warnOnIncompleteTransaction: true, // Default to show warnings for incomplete transactions
	};
	private diagnosticsFromBeancount: { [uri: string]: Diagnostic[] } = {};
	private standaloneBeancountDiagnosticUris = new Set<string>();
	private readonly validationTokenByUri = new Map<string, CancellationTokenSource>();
	private connection: Connection | undefined;
	private hasShownBrowserCustomRootParityWarning = false;

	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly optionsManager: BeancountOptionsManager,
		private readonly beanMgr: RealBeancountManager | undefined,
	) {}

	async register(connection: Connection): Promise<void> {
		this.logger.info('Registering diagnostics feature');
		this.connection = connection;

		// Register callback on global bus to update diagnosticsFromBeancount on save
		const onBeancountDiagnosticsUpdated = async () => {
			this.updateDiagnosticsFromBeancount();
			await this.validateAllDocuments(connection);
		};
		globalEventBus.on(GlobalEvents.BeancountUpdate, onBeancountDiagnosticsUpdated);
		globalEventBus.on(GlobalEvents.BeancountDiagnosticsUpdated, onBeancountDiagnosticsUpdated);

		// Listen for configuration changes
		globalEventBus.on(GlobalEvents.ConfigurationChanged, async () => {
			// Use first workspace folder as scopeUri for global configuration
			const scopeUri = (await connection.workspace.getWorkspaceFolders())?.[0]?.uri;
			const loaded = await this.loadDiagnosticsConfig(connection, scopeUri);
			this.applyDiagnosticsConfig(loaded, 'Updated');

			// Re-validate all open documents with new configuration
			await this.validateAllDocuments(connection);
		});

		this.optionsManager.onOptionChange(async e => {
			if (DiagnosticsFeature.REVALIDATE_ON_OPTION_CHANGE.has(e.name)) {
				await this.validateAllDocuments(connection);
			}
		});

		// Fetch the configuration initially
		try {
			// Use first workspace folder as scopeUri for global configuration
			const scopeUri = (await connection.workspace.getWorkspaceFolders())?.[0]?.uri;
			const loaded = await this.loadDiagnosticsConfig(connection, scopeUri);
			this.applyDiagnosticsConfig(loaded, 'Initial');

			// Validate all open documents initially
			await this.validateAllDocuments(connection);

			// Listen for document changes and validate them (debounced, adaptive)
			this.documents.onDidChangeContentDebounced(async change => {
				await this.validateDocument(change.document, connection);
			});
		} catch (error) {
			this.logger.error(`Error fetching configuration: ${error}`);
		}

		connection.onExit(() => {
			for (const source of this.validationTokenByUri.values()) {
				source.cancel();
				source.dispose();
			}
			this.validationTokenByUri.clear();
		});
	}

	private async validateAllDocuments(connection: Connection): Promise<void> {
		await Promise.all(
			this.documents.all().map(async doc => {
				await this.validateDocument(doc, connection);
			}),
		);

		const documentsInStore = new Set(this.documents.keys().filter(isNotGitUri));
		const currentStandaloneUris = new Set<string>();
		await Promise.all(
			Object.entries(this.diagnosticsFromBeancount).map(async ([uri, diagnostics]) => {
				if (documentsInStore.has(uri)) {
					return;
				}
				uri = await this.resolveBeancountDiagnosticsUri(uri);
				currentStandaloneUris.add(uri);

				await connection.sendDiagnostics({ uri, diagnostics });
			}),
		);

		const staleStandaloneUris = [...this.standaloneBeancountDiagnosticUris]
			.filter(uri => !currentStandaloneUris.has(uri));
		await Promise.all(staleStandaloneUris.map(async uri => {
			await connection.sendDiagnostics({ uri, diagnostics: [] });
		}));
		this.standaloneBeancountDiagnosticUris = currentStandaloneUris;
	}

	private async resolveBeancountDiagnosticsUri(uri: string): Promise<string> {
		if (uri.startsWith('file://') && uri.endsWith('<load>')) {
			return await this.documents.getMainBeanFileUri() ?? uri;
		}
		return uri;
	}

	private updateDiagnosticsFromBeancount() {
		if (!this.beanMgr || !this.beanMgr.isEnabled()) {
			this.diagnosticsFromBeancount = {};
			return;
		}

		let diagnosticsFromBeancount: Record<string, Diagnostic[]> = {};

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
				source: DIAGNOSTIC_SOURCE_BEANCHECK,
			} as Diagnostic;

			const uri = file.includes('://') ? file : `file://${file}`;

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
		const { diagnosticsByUri, suppressedCount } = filterBeancheckDiagnosticsForBrowserCustomRootCompat(
			diagnosticsFromBeancount,
			this.getBrowserCustomRootCompatFilterInput(),
		);
		this.diagnosticsFromBeancount = diagnosticsByUri;

		if (suppressedCount > 0 && !this.hasShownBrowserCustomRootParityWarning) {
			this.hasShownBrowserCustomRootParityWarning = true;
			const message = 'Browser Beancount WASM runtime may not fully support custom non-ASCII root account names. Diagnostics were partially suppressed; switch to Local (Python) runtime for authoritative checks.';
			this.logger.warn(`${message} suppressed=${suppressedCount}`);
			void this.connection?.window.showWarningMessage(message);
		}
	}

	private getBrowserCustomRootCompatFilterInput(): BrowserCustomRootCompatFilterInput {
		const runtimeMode = this.beanMgr?.getRuntimeStatus().mode ?? 'off';
		const validRootAccounts = this.optionsManager.getValidRootAccounts();
		const customNonAsciiRoots = new Set<string>();
		for (const name of ROOT_OPTION_NAMES) {
			const option = this.optionsManager.getOption(name);
			const value = option.asString();
			if (option.isDefault || !hasNonAscii(value) || DEFAULT_ROOT_NAMES.has(value)) {
				continue;
			}
			customNonAsciiRoots.add(value);
		}
		return {
			runtimeMode,
			validRootAccounts,
			customNonAsciiRoots,
		};
	}

	private async validateDocument(document: TextDocument, connection: Connection): Promise<void> {
		if (isNotGitUri(document.uri)) {
			const tokenSource = this.createValidationToken(document.uri);
			try {
				const diagnostics = await this.provideDiagnostics(document, tokenSource.token);
				if (tokenSource.token.isCancellationRequested) {
					return;
				}
				connection.sendDiagnostics({
					uri: document.uri,
					diagnostics,
				});
			} catch (err) {
				if (this.isCancellationError(err)) {
					return;
				}
				this.logger.error(`Error validating document: ${err}`);
			} finally {
				if (this.validationTokenByUri.get(document.uri) === tokenSource) {
					this.validationTokenByUri.delete(document.uri);
				}
				tokenSource.dispose();
			}
		}
	}

	private createValidationToken(uri: string): CancellationTokenSource {
		const previous = this.validationTokenByUri.get(uri);
		if (previous) {
			previous.cancel();
			previous.dispose();
		}
		const next = new CancellationTokenSource();
		this.validationTokenByUri.set(uri, next);
		return next;
	}

	private throwIfCancelled(token: CancellationToken): void {
		if (token.isCancellationRequested) {
			const error = new Error('diagnostics cancelled');
			error.name = 'CancellationError';
			throw error;
		}
	}

	private isCancellationError(err: unknown): boolean {
		return err instanceof Error && err.name === 'CancellationError';
	}

	private async provideDiagnostics(document: TextDocument, token: CancellationToken): Promise<Diagnostic[]> {
		this.throwIfCancelled(token);
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return [];
		}
		this.throwIfCancelled(token);

		const diagnostics: Diagnostic[] = [];

		const scheme = URI.parse(document.uri).scheme;

		// We ignore git schemes because they lead to confusing diagnostics
		if (scheme === 'git') {
			return [];
		}

		// Find all transactions in the document
		const transactions = await findAllTransactions(tree, document);
		this.throwIfCancelled(token);

		// Check each transaction for balance - with chunking for performance
		const CHUNK_SIZE = 50; // Process transactions in chunks to avoid blocking UI
		for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
			this.throwIfCancelled(token);
			const chunk = transactions.slice(i, i + CHUNK_SIZE);

			for (const transaction of chunk) {
				this.throwIfCancelled(token);
				// Check for pending transactions (marked with '!')
				if (transaction.flag === '!' && this.config.warnOnIncompleteTransaction) {
					diagnostics.push({
						severity: DiagnosticSeverity.Warning,
						range: transaction.headerRange,
						message: `transaction flagged with "!": ${document.getText(transaction.headerRange)}`,
						source: DIAGNOSTIC_SOURCE_LOCAL,
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
						const precision = imbalance.tolerance.toString().split('.')?.[1]?.length
							?? Math.max(2, imbalance.difference.abs().toFixed().replace(/^0+\.?/, '').length);
						const amount = imbalance.difference.toFixed(precision) || '0';
						const currency = imbalance.currency || '';
						imbalanceMessages.push(`${amount} ${currency}`);
					}

					diagnostics.push({
						severity: DiagnosticSeverity.Error,
						range: transaction.headerRange,
						message: `Transaction does not balance: ${imbalanceMessages.join(', ')}`,
						source: DIAGNOSTIC_SOURCE_LOCAL,
					});
				}
			}

			// If there are more chunks to process, yield to the event loop
			if (i + CHUNK_SIZE < transactions.length) {
				await new Promise(resolve => setTimeout(resolve, 0));
			}
		}
		this.throwIfCancelled(token);
		if (document.lineCount <= 10000 && tree.rootNode.hasError()) {
			// Skip the diagnostics tip if the document is too large to avoid performance issues
			// But there is still code action to fix the incomplete balance lines

			// Detect incomplete balance directives to offer quick fixes with a visible squiggle
			// Heuristic: a line starts with DATE, contains 'balance' and an account,
			// but lacks a "<number> <CURRENCY>" pair after the account.
			const text = document.getText();
			const lines = text.split(/\r?\n/);
			const balanceHeadRe = /^\s*\d{4}-\d{2}-\d{2}\s+balance\b/;

			for (let line = 0; line < lines.length; line++) {
				const lineText = lines[line]!;
				if (!balanceHeadRe.test(lineText)) continue;
				if (this.balanceLineHasAmountAndCurrency(lineText)) continue;

				diagnostics.push({
					severity: DiagnosticSeverity.Information,
					range: {
						start: { line, character: 0 },
						end: { line, character: Math.max(0, lineText.length) },
					},
					message: 'Balance line incomplete: quick fix can complete current account balance',
					source: DIAGNOSTIC_SOURCE_LOCAL,
					code: 'balance-missing-amount',
				});
			}
		}

		// Validate account root names
		await this.validateAccountRoots(tree, diagnostics, token);
		this.throwIfCancelled(token);

		const beancountDiagnostics = this.diagnosticsFromBeancount[document.uri];
		if (!beancountDiagnostics) {
			return diagnostics;
		}
		this.logger.info(beancountDiagnostics);

		const mergedDiagnostics = this.mergeAndDedupDiagnostics(beancountDiagnostics, diagnostics);
		this.logger.info(mergedDiagnostics);

		return mergedDiagnostics;
	}

	private balanceLineHasAmountAndCurrency(lineText: string): boolean {
		// Strip inline comment
		const commentIndex = lineText.indexOf(';');
		const content = commentIndex >= 0 ? lineText.slice(0, commentIndex) : lineText;

		// Match "<date> balance <account>" prefix (accounts cannot contain whitespace)
		const prefixMatch = content.match(/^\s*\d{4}-\d{2}-\d{2}\s+balance\s+[^\s]+\s*/);
		if (!prefixMatch) return false;

		const remainder = content.slice(prefixMatch[0].length);
		if (!remainder.trim()) return false;

		const currencyMatch = remainder.match(/\s+[A-Z][A-Z0-9_'./-]*\b/);
		if (!currencyMatch || currencyMatch.index === undefined) return false;

		const expressionText = remainder.slice(0, currencyMatch.index).trim();
		if (!expressionText) return false;

		return this.isValidBalanceAmountExpression(expressionText, lineText);
	}

	private isValidBalanceAmountExpression(expression: string, originalLine: string): boolean {
		if (!validateExpression(expression)) {
			this.logger.debug(
				`Failed to parse balance amount expression '${expression}' on line: ${originalLine.trim()}`,
			);
			return false;
		}

		return true;
	}

	private mergeAndDedupDiagnostics(preferred: Diagnostic[], if_missing: Diagnostic[]): Diagnostic[] {
		const seen = new Map<string, Diagnostic>();

		const serializeCode = (code: Diagnostic['code']): string => {
			if (code === undefined || code === null) {
				return '';
			}
			if (typeof code === 'object') {
				try {
					return JSON.stringify(code);
				} catch {
					return String(code);
				}
			}
			return String(code);
		};
		const getKey = (d: Diagnostic) => [
			d.range.start.line,
			d.range.start.character,
			d.range.end.line,
			d.range.end.character,
			d.severity ?? '',
			serializeCode(d.code),
			d.message,
			d.source ?? '',
		].join(':');

		[...preferred, ...if_missing].forEach(d => {
			const key = getKey(d);
			if (!seen.has(key)) {
				seen.set(key, d);
			}
		});

		return Array.from(seen.values());
	}

	private async loadDiagnosticsConfig(connection: Connection, scopeUri?: string): Promise<Partial<DiagnosticsConfig>> {
		const result: Partial<DiagnosticsConfig> = {};
		const direct = await connection.workspace.getConfiguration({
			scopeUri,
			section: 'beancount.diagnostics',
		});
		const legacy = await connection.workspace.getConfiguration({ scopeUri });
		const diagnosticsSettings = {
			...(legacy?.settings?.beancount?.diagnostics ?? {}),
			...(legacy?.beancount?.diagnostics ?? {}),
			...(typeof direct === 'object' && direct !== null ? direct : {}),
		} as Partial<DiagnosticsConfig>;

		if (typeof diagnosticsSettings.tolerance === 'number') {
			result.tolerance = diagnosticsSettings.tolerance;
		}
		if (typeof diagnosticsSettings.warnOnIncompleteTransaction === 'boolean') {
			result.warnOnIncompleteTransaction = diagnosticsSettings.warnOnIncompleteTransaction;
		}
		return result;
	}

	private applyDiagnosticsConfig(config: Partial<DiagnosticsConfig>, logPrefix: 'Initial' | 'Updated'): void {
		if (config.tolerance !== undefined) {
			this.config.tolerance = config.tolerance;
			this.logger.info(`${logPrefix} tolerance set to ${this.config.tolerance}`);
		}
		if (config.warnOnIncompleteTransaction !== undefined) {
			this.config.warnOnIncompleteTransaction = config.warnOnIncompleteTransaction;
			this.logger.info(`${logPrefix} warnOnIncompleteTransaction set to ${this.config.warnOnIncompleteTransaction}`);
		}
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
				const n = posting.cost?.number || posting.price?.number;
				return {
					currency: posting.cost?.currency || posting.price?.currency as string,
					number: smallestDigit.mul(n!).mul(
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
			// Implement Beancount's default tolerance algorithm
			// Reference: https://beancount.github.io/docs/precision_tolerances.html#how-default-tolerances-are-determined
			// Tolerance is a fraction (typically half) of the last digit of precision
			return this.inferDefaultTolerances(postings);
		}
	}

	/**
	 * Infer default tolerances from postings
	 * Implements Beancount's default tolerance algorithm: calculate tolerance for each currency separately
	 * Tolerance = 0.5 * (10^(-precision))
	 *
	 * Note: For the purpose of inferring tolerance, price and cost amounts are ignored.
	 * Only the base amounts of postings are considered.
	 * All amounts (including integers) participate in precision comparison to find the coarsest precision.
	 * If the coarsest precision is 0 (integer), no tolerance is inferred for that currency.
	 *
	 * @param postings All postings in the transaction
	 * @returns Tolerance mapping for each currency
	 */
	private inferDefaultTolerances(postings: Posting[]): Record<string, Big> {
		const tolerances: Record<string, Big> = {};

		// Collect precision information for each currency
		// Only consider the base amounts, ignore costs and prices
		const currencyPrecisions: Record<string, number> = {};

		for (const posting of postings) {
			// Only process the main amount field
			// Prices and costs are ignored for tolerance inference per Beancount documentation
			if (posting.amount) {
				const currency = posting.amount.currency;
				const precision = this.getNumberPrecision(posting.amount.number);
				if (!currencyPrecisions[currency]) {
					currencyPrecisions[currency] = precision;
				} else if (precision > 0) {
					// https://beancount.github.io/docs/precision_tolerances.html#resolving-ambiguities
					currencyPrecisions[currency] = Math.min(currencyPrecisions[currency], precision);
				}
			}
		}

		// Calculate tolerance for each currency
		for (const [currency, precision] of Object.entries(currencyPrecisions)) {
			// Skip if the coarsest precision is 0 (integer) - no tolerance is inferred
			if (precision === 0) {
				tolerances[currency] = new Big(0);
				continue;
			}

			// Tolerance = 0.5 * (10^(-precision))
			// Example: precision 2 currency (like USD 12.34), tolerance = 0.5 * 0.01 = 0.005
			const tolerance = new Big(0.5).mul(new Big(10).pow(-precision));
			tolerances[currency] = tolerance;
		}

		return tolerances;
	}

	/**
	 * Get the precision of a number string (number of digits after decimal point)
	 *
	 * @param numberStr Number string
	 * @returns Precision (number of digits after decimal point)
	 */
	private getNumberPrecision(numberStr: string): number {
		if (!numberStr || numberStr.trim() === '') {
			return 0;
		}

		// Remove spaces and handle scientific notation
		const cleanStr = numberStr.trim();

		// If contains decimal point, calculate digits after decimal point
		const dotIndex = cleanStr.indexOf('.');
		if (dotIndex === -1) {
			return 0; // No decimal point, precision is 0
		}

		// Calculate digits after decimal point
		return cleanStr.length - dotIndex - 1;
	}

	/**
	 * Validate that all account root names match the configured root account names
	 * @param tree The parse tree
	 * @param diagnostics Array to add diagnostics to
	 */
	private async validateAccountRoots(
		tree: import('web-tree-sitter').Tree,
		diagnostics: Diagnostic[],
		token: CancellationToken,
	): Promise<void> {
		this.throwIfCancelled(token);
		const validRoots = this.optionsManager.getValidRootAccounts();
		
		// Query all account nodes
		const accountQuery = TreeQuery.getQueryByTokenName('account');
		const accountCaptures = await accountQuery.captures(tree);
		this.throwIfCancelled(token);
		
		// Track seen accounts to avoid duplicate diagnostics
		const seenAccounts = new Set<string>();
		
		for (const capture of accountCaptures) {
			this.throwIfCancelled(token);
			const accountNode = capture.node;
			const accountName = accountNode.text;
			
			// Skip if we've already validated this account
			if (seenAccounts.has(accountName)) {
				continue;
			}
			seenAccounts.add(accountName);
			
			// Extract root account name (part before first colon)
			const root = accountName.split(':')[0];
			
			// Check if root is valid (root should always exist, but check for safety)
			if (root && !validRoots.has(root)) {
				const validRootsList = Array.from(validRoots).sort().join(', ');
				diagnostics.push({
					severity: DiagnosticSeverity.Error,
					range: asLspRange(accountNode),
					message: `Invalid root account name "${root}". Valid root account names: ${validRootsList}`,
					source: DIAGNOSTIC_SOURCE_LOCAL,
					code: 'invalid-root-account',
				});
			}
		}
	}
}
