// Import necessary modules
import { Logger } from '@bean-lsp/shared';
import { Connection, DocumentFormattingParams, Range, TextEdit } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from 'web-tree-sitter';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { globalEventBus, GlobalEvents } from '../utils/event-bus';
import { Feature } from './types';

// Constants for formatting
const AMOUNT_MIN_COLUMN = 52; // Minimum column for amount alignment
const CURRENCY_MIN_COLUMN = 64; // Minimum column for currency alignment
const COMMENT_MIN_COLUMN = 76; // Minimum column for comment alignment
const CURRENCY_MIN_SPACING = 3; // Minimum spacing between account and currency for directives

export class FormatterFeature implements Feature {
	// Formatter configuration
	private formatterEnabled = true;
	private alignCurrency = false;
	private readonly logger = new Logger('Formatter');

	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
	) {}

	register(connection: Connection): void {
		// Register for document formatting if enabled
		connection.onDocumentFormatting(async (params: DocumentFormattingParams) => {
			// Check if formatter is enabled
			if (!this.formatterEnabled) {
				return [];
			}

			try {
				const document = await this.documents.retrieve(params.textDocument.uri);
				const edits = await this.formatBeancountDocument(document);
				// Workaround, reusing trees after formatting will get a wrong tree
				this.trees.invalidateCache(params.textDocument.uri);
				setTimeout(() => {
					this.trees.invalidateCache(params.textDocument.uri);
				}, 1000);
				return edits;
			} catch (error) {
				this.logger.error('Error retrieving document for formatting:', error);
				return [];
			}
		});

		globalEventBus.on(GlobalEvents.ConfigurationChanged, () => {
			this.updateFormatterConfig(connection);
		});
		this.updateFormatterConfig(connection);
	}

	/**
	 * Update formatter configuration from server settings
	 */
	private async updateFormatterConfig(connection: Connection): Promise<void> {
		try {
			const config = await connection.workspace.getConfiguration({ section: 'beanLsp' });
			if (config.formatter !== undefined) {
				const formatterEnabled = config.formatter?.enabled !== false; // Default to true if not specified
				this.setFormatterEnabled(formatterEnabled);
				this.alignCurrency = config.formatter?.alignCurrency === true;
				this.logger.info(`Formatter ${formatterEnabled ? 'enabled' : 'disabled'}`);
				this.logger.info(`Formatter alignCurrency ${this.alignCurrency ? 'enabled' : 'disabled'}`);
			}
		} catch (error) {
			this.logger.error('Error updating formatter configuration:', error);
		}
	}

	/**
	 * Enable or disable the formatter
	 * @param enabled Whether the formatter should be enabled
	 */
	private setFormatterEnabled(enabled: boolean): void {
		this.formatterEnabled = enabled;
	}

	/**
	 * Format a Beancount document
	 */
	async formatBeancountDocument(document: TextDocument): Promise<TextEdit[]> {
		const edits: TextEdit[] = [];

		// Retrieve the parse tree using Trees
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			this.logger.error('Failed to parse document');
			return edits;
		}

		// Format the document by processing each transaction separately
		this.formatTransactions(document, tree, edits);

		// Align balance directives
		this.formatBalances(document, tree, edits);

		// Format other directives (open, close, etc.)
		this.formatDirectives(document, tree, edits);

		return edits;
	}

	/**
	 * Format transactions in the document
	 */
	private formatTransactions(document: TextDocument, tree: Parser.Tree, edits: TextEdit[]): void {
		// Global alignment across all postings in document
		const postings = tree.rootNode.descendantsOfType('posting');
		if (postings.length === 0) return;

		const positions = this.calculateAlignmentPositions(document, postings);

		for (const posting of postings) {
			this.formatPosting(document, posting, positions, edits);
		}
	}

	/**
	 * Format other directives like open, close, balance, etc.
	 */
	private formatDirectives(document: TextDocument, tree: Parser.Tree, edits: TextEdit[]): void {
		// Format open/close directives
		const openCloseQuery = tree.rootNode.descendantsOfType(['open', 'close']);

		for (const directive of openCloseQuery) {
			const account = directive.childForFieldName('account');
			const currencies = directive.childForFieldName('currencies');

			if (account && currencies) {
				// Align currencies after account
				const accountText = document.getText(this.rangeFromNode(document, account));
				const currenciesStart = document.positionAt(currencies.startIndex);

				// Calculate ideal position for currencies (after account)
				const accountStartPos = document.positionAt(account.startIndex);
				const accountVisualEndPos = accountStartPos.character + this.calculateStringWidth(accountText);
				const ideal = Math.max(
					accountVisualEndPos + CURRENCY_MIN_SPACING,
					CURRENCY_MIN_COLUMN,
				);

				// Create whitespace between account and currencies
				const whitespace = ' '.repeat(ideal - accountVisualEndPos);

				// Replace existing whitespace
				if (currenciesStart.character !== ideal) {
					edits.push(TextEdit.replace({
						start: document.positionAt(account.endIndex),
						end: currenciesStart,
					}, whitespace));
				}
			}
		}
	}

	/**
	 * Format balance directives: align amount decimal points, currency and comments
	 */
	private formatBalances(document: TextDocument, tree: Parser.Tree, edits: TextEdit[]): void {
		const balances = tree.rootNode.descendantsOfType('balance');
		if (balances.length === 0) return;

		const basePositions = this.calculateBalanceAlignmentPositions(document, balances);
		const transactions = tree.rootNode.descendantsOfType('transaction');
		const allPostings = tree.rootNode.descendantsOfType('posting');
		const globalPostingPositions = allPostings.length > 0
			? this.calculateAlignmentPositions(document, allPostings)
			: undefined;

		for (const bal of balances) {
			let positions = basePositions;
			// Prefer nearest transaction's alignment
			if (transactions.length > 0) {
				let nearestTxn: Parser.SyntaxNode | null = null;
				let minDistance = Number.POSITIVE_INFINITY;
				for (const txn of transactions) {
					const dist = bal.startIndex >= txn.endIndex
						? bal.startIndex - txn.endIndex
						: txn.startIndex - bal.endIndex;
					if (dist < minDistance) {
						minDistance = dist;
						nearestTxn = txn;
					}
				}
				if (nearestTxn) {
					const postings = nearestTxn.descendantsOfType('posting');
					if (postings.length > 0) {
						const txnPos = this.calculateAlignmentPositions(document, postings);
						positions = {
							decimalPointColumn: txnPos.decimalPointColumn,
							commentColumn: txnPos.commentColumn,
							currencyColumn: txnPos.currencyColumn,
						};
					}
				}
			} else if (globalPostingPositions) {
				positions = {
					decimalPointColumn: globalPostingPositions.decimalPointColumn,
					commentColumn: globalPostingPositions.commentColumn,
					currencyColumn: globalPostingPositions.currencyColumn,
				};
			}
			const account = bal.childForFieldName('account');
			const amount = bal.childForFieldName('amount');
			const comment = bal.childForFieldName('comment');
			if (!account || !amount) continue;

			const accountStartPos = document.positionAt(account.startIndex);
			const accountEndPos = document.positionAt(account.endIndex);
			const accountText = account.text;
			const accountVisualEndCol = accountStartPos.character + this.calculateStringWidth(accountText);

			const amountStartPos = document.positionAt(amount.startIndex);
			const amountEndPos = document.positionAt(amount.endIndex);
			const amountText = document.getText({ start: amountStartPos, end: amountEndPos });

			// Determine integer width for the first numeric part in amount
			const parts = amountText.split('.');
			let integerPart = parts[0]?.trim() || '';
			if (parts.length === 1) {
				const match = integerPart.match(/^-?[\d()+\-*/]+/);
				if (match) {
					integerPart = match[0];
				} else {
					const numberMatch = integerPart.match(/\d+/);
					integerPart = numberMatch ? numberMatch[0] : '';
				}
			}
			const integerWidth = this.calculateStringWidth(integerPart);

			// Space between account and amount to align decimal point
			const spaceRange = { start: accountEndPos, end: amountStartPos };
			const spaceNeeded = positions.decimalPointColumn - accountVisualEndCol - integerWidth;
			const whitespace = ' '.repeat(Math.max(1, spaceNeeded));
			edits.push(TextEdit.replace(spaceRange, whitespace));

			// Ensure exactly one space between amount and currency when not aligning currency
			let currencyNode: Parser.SyntaxNode | null = null;
			for (const child of amount.namedChildren) {
				if (child.type === 'currency') {
					currencyNode = child;
					break;
				}
			}
			if (currencyNode && !this.alignCurrency) {
				const currencyStartPos = document.positionAt(currencyNode.startIndex);
				const currencyPrev = amount.namedChildren[amount.namedChildren.indexOf(currencyNode) - 1];
				const prevEndPos = currencyPrev ? document.positionAt(currencyPrev.endIndex) : amountStartPos;
				if (currencyStartPos.character - prevEndPos.character !== 1) {
					edits.push(TextEdit.replace({ start: prevEndPos, end: currencyStartPos }, ' '));
				}
			}

			// Align comment (if exists)
			if (comment) {
				const commentStartPos = document.positionAt(comment.startIndex);
				const lastEndPos = amountEndPos;
				if (
					commentStartPos.character < positions.commentColumn
					&& commentStartPos.character - lastEndPos.character !== 1
				) {
					edits.push(
						TextEdit.replace(
							{ start: lastEndPos, end: commentStartPos },
							' '.repeat(Math.max(1, positions.commentColumn - lastEndPos.character)),
						),
					);
				}
			}
		}
	}

	/**
	 * Compute alignment positions across all balance directives
	 */
	private calculateBalanceAlignmentPositions(document: TextDocument, balances: Parser.SyntaxNode[]): {
		decimalPointColumn: number;
		commentColumn: number;
		currencyColumn: number;
	} {
		let maxIntegerWidth = 0;
		let maxDecimalWidth = 0;
		let maxCurrencyWidth = 0;
		let maxAccountEndCol = 0;

		for (const bal of balances) {
			const amount = bal.childForFieldName('amount');
			if (!amount) continue;

			const account = bal.childForFieldName('account');
			if (account) {
				const accountStartPos = document.positionAt(account.startIndex);
				const accountEndCol = accountStartPos.character + this.calculateStringWidth(account.text);
				maxAccountEndCol = Math.max(maxAccountEndCol, accountEndCol);
			}

			const amountText = document.getText({
				start: document.positionAt(amount.startIndex),
				end: document.positionAt(amount.endIndex),
			});

			const parts = amountText.split('.');
			let integerPart = parts[0]?.trim() || '';
			if (parts.length === 1) {
				const match = integerPart.match(/^-?[\d()+\-*/]+/);
				if (match) integerPart = match[0];
			}
			const integerWidth = this.calculateStringWidth(integerPart);
			maxIntegerWidth = Math.max(maxIntegerWidth, integerWidth);

			if (parts.length > 1) {
				const decimalPart = parts[1]?.trim() || '';
				const decimalWidth = this.calculateStringWidth(decimalPart);
				maxDecimalWidth = Math.max(maxDecimalWidth, decimalWidth);
			}

			// Try to get currency width inside amount node
			let currencyWidth = 0;
			for (const child of amount.namedChildren) {
				if (child.type === 'currency') {
					currencyWidth = this.calculateStringWidth(child.text);
					break;
				}
			}
			if (currencyWidth === 0) {
				const currencyMatch = amountText.match(/[A-Z][A-Z0-9_'.-]{0,22}[A-Z0-9]/);
				if (currencyMatch) currencyWidth = this.calculateStringWidth(currencyMatch[0]);
			}
			maxCurrencyWidth = Math.max(maxCurrencyWidth, currencyWidth);
		}

		const amountColumn = Math.max(maxAccountEndCol + 3, AMOUNT_MIN_COLUMN);
		const decimalPointColumn = amountColumn + maxIntegerWidth;
		const currencyColumn = decimalPointColumn + Math.max(0, maxDecimalWidth) + 1; // currency starts one after decimal part
		const oneSpaceBetweenNumberAndCurrency = 1;
		const commentColumn = Math.max(
			currencyColumn + oneSpaceBetweenNumberAndCurrency + maxCurrencyWidth + 2,
			COMMENT_MIN_COLUMN,
		);

		return { decimalPointColumn, commentColumn, currencyColumn };
	}

	/**
	 * Calculate alignment positions for a set of postings
	 */
	private calculateAlignmentPositions(document: TextDocument, postings: Parser.SyntaxNode[]): {
		accountColumn: number;
		amountColumn: number;
		currencyColumn: number;
		commentColumn: number;
		maxIntegerWidth: number;
		decimalPointColumn: number;
	} {
		let maxAccountWidth = 0;
		let maxAmountWidth = 0;
		let maxIntegerWidth = 0;
		let maxDecimalWidth = 0;
		let maxAccountStartColumn = 0;
		let maxCurrencyWidth = 0;

		// First pass: find maximum widths
		for (const posting of postings) {
			const account = posting.childForFieldName('account');
			const amount = posting.childForFieldName('amount');
			const currency = posting.childForFieldName('currency');
			const indentText = document.getText({
				start: document.positionAt(posting.startIndex),
				end: document.positionAt(account ? account.startIndex : posting.endIndex),
			});

			// Calculate starting column of account
			const accountStartCol = this.calculateStringWidth(indentText);
			maxAccountStartColumn = Math.max(maxAccountStartColumn, accountStartCol);

			if (account) {
				const accountText = document.getText(this.rangeFromNode(document, account));
				maxAccountWidth = Math.max(maxAccountWidth, this.calculateStringWidth(accountText));
			}

			if (amount) {
				const amountText = document.getText(this.rangeFromNode(document, amount));
				maxAmountWidth = Math.max(maxAmountWidth, this.calculateStringWidth(amountText));

				// Analyze integer and decimal parts of the amount
				const parts = amountText.split('.');
				let integerPart = parts[0]?.trim() || '';

				// Clean integer part and calculate width - matching formatPosting logic
				if (parts.length === 1) {
					const match = integerPart.match(/^-?\d+/);
					if (match) {
						integerPart = match[0];
					}
				}
				const integerWidth = this.calculateStringWidth(integerPart);
				maxIntegerWidth = Math.max(maxIntegerWidth, integerWidth);

				// If there's a decimal part, calculate its width
				if (parts.length > 1) {
					const decimalPart = parts[1]?.trim() || '';
					const decimalWidth = this.calculateStringWidth(decimalPart);
					maxDecimalWidth = Math.max(maxDecimalWidth, decimalWidth);
				}
			}

			// Calculate currency width
			if (currency) {
				const currencyText = document.getText(this.rangeFromNode(document, currency));
				maxCurrencyWidth = Math.max(maxCurrencyWidth, this.calculateStringWidth(currencyText));
			} else {
				// Try to find currency code from the text
				const text = document.getText(this.rangeFromNode(document, posting));
				const currencyMatch = text.match(/[A-Z][A-Z0-9_'.-]{0,22}[A-Z0-9]/);
				if (currencyMatch) {
					maxCurrencyWidth = Math.max(maxCurrencyWidth, this.calculateStringWidth(currencyMatch[0]));
				}
			}
		}

		// Calculate columns for alignment
		const accountColumn = Math.max(maxAccountStartColumn, 2); // Minimum 2 spaces indent
		const amountColumn = Math.max(accountColumn + maxAccountWidth + 3, AMOUNT_MIN_COLUMN);
		const decimalPointColumn = amountColumn + maxIntegerWidth; // Decimal point position
		const currencyColumn = decimalPointColumn + maxDecimalWidth + 1;
		const commentColumn = Math.max(currencyColumn + maxCurrencyWidth + 2, COMMENT_MIN_COLUMN);

		return {
			accountColumn,
			amountColumn,
			currencyColumn,
			commentColumn,
			maxIntegerWidth,
			decimalPointColumn,
		};
	}

	/**
	 * Format a single posting within a transaction
	 */
	private formatPosting(
		document: TextDocument,
		posting: Parser.SyntaxNode,
		positions: {
			accountColumn: number;
			amountColumn: number;
			currencyColumn: number;
			commentColumn: number;
			maxIntegerWidth: number;
			decimalPointColumn: number;
		},
		edits: TextEdit[],
	): void {
		// Get child nodes that need alignment
		const account = posting.childForFieldName('account');
		const amount = posting.childForFieldName('amount');
		const optflag = posting.childForFieldName('optflag');
		const comment = posting.childForFieldName('comment');
		const costSpec = posting.childForFieldName('cost_spec');
		const priceAnnotation = posting.childForFieldName('price_annotation');

		if (!account) return; // Skip if no account (shouldn't happen in valid syntax)

		// Line starting position (for indent)
		const lineStartPos = document.positionAt(posting.startIndex);

		// Format the indentation + optflag + account portion
		const accountStartPos = document.positionAt(account.startIndex);
		const accountEndPos = document.positionAt(account.endIndex);
		const accountText = account.text;
		const accountVisualWidth = this.calculateStringWidth(accountText);
		const accountVisualEndCol = accountStartPos.character + accountVisualWidth;

		// Fix indentation if needed (should be positions.accountColumn spaces)
		const currentIndent = accountStartPos.character;
		if (currentIndent !== positions.accountColumn) {
			// For the first part, we want to ensure proper indentation
			const idealIndent = ' '.repeat(positions.accountColumn);

			// Handle flag if present
			let indentRange;
			if (optflag) {
				indentRange = {
					start: lineStartPos,
					end: document.positionAt(optflag.startIndex),
				};
			} else {
				indentRange = {
					start: lineStartPos,
					end: accountStartPos,
				};
			}

			edits.push(TextEdit.replace(indentRange, idealIndent));
		}

		// Format the amount portion
		if (amount) {
			const amountStartPos = document.positionAt(amount.startIndex);
			const amountEndPos = document.positionAt(amount.endIndex);
			const amountText = document.getText({ start: amountStartPos, end: amountEndPos });

			// The space between account and amount
			const spaceRange = {
				start: accountEndPos,
				end: amountStartPos,
			};

			if (!this.alignCurrency) {
				// Implement decimal point alignment
				const parts = amountText.split('.');
				let integerPart = parts[0]?.trim() || '';

				// Clean integer part and calculate width
				if (parts.length === 1) {
					const match = integerPart.match(/^-?[\d()+\-*/]+/);
					if (match) {
						integerPart = match[0];
					} else {
						// Fallback: extract any number sequence for width calculation
						const numberMatch = integerPart.match(/\d+/);
						integerPart = numberMatch ? numberMatch[0] : '';
					}
				}
				const integerWidth = this.calculateStringWidth(integerPart);

				// Calculate required spaces for decimal point alignment
				const spaceNeeded = positions.decimalPointColumn - accountVisualEndCol - integerWidth;
				const whitespaceLength = Math.max(1, spaceNeeded);

				const whitespace = ' '.repeat(whitespaceLength);
				edits.push(TextEdit.replace(spaceRange, whitespace));
			} else {
				// Align currency column with exactly one space between number and currency.
				const amountWithoutCurrency = amount.namedChild(0);
				const numberEndPos = amountWithoutCurrency
					? document.positionAt(amountWithoutCurrency.endIndex)
					: amountEndPos;
				const numberText = document.getText({ start: amountStartPos, end: numberEndPos });
				const numberWidth = this.calculateStringWidth(numberText.trim());
				const desiredCurrencyCol = positions.currencyColumn;
				let spacing = desiredCurrencyCol - (accountVisualEndCol + numberWidth + 1);
				if (spacing < 1) spacing = 1;
				edits.push(TextEdit.replace(spaceRange, ' '.repeat(spacing)));
			}

			// If we have cost_spec and/or price_annotation, align them too
			let lastEndPos = amountEndPos;

			if (costSpec) {
				const costStartPos = document.positionAt(costSpec.startIndex);
				// Need at least one space between amount and cost
				if (costStartPos.character - lastEndPos.character !== 1) {
					edits.push(TextEdit.replace({
						start: lastEndPos,
						end: costStartPos,
					}, ' '));
				}
				lastEndPos = document.positionAt(costSpec.endIndex);
			}

			if (priceAnnotation) {
				const priceStartPos = document.positionAt(priceAnnotation.startIndex);

				// Find price operator (@ or @@) which should be before priceAnnotation
				// The operator might appear as a separate node or be part of previous text
				let priceOperatorPos = {
					start: lastEndPos,
					end: priceStartPos,
				};

				// Get text between last element and price annotation
				const betweenText = document.getText(priceOperatorPos);

				// Check for @ or @@ in the text
				const atMatch = betweenText.match(/@{1,2}/);
				if (atMatch) {
					// Ensure proper spacing around @ or @@
					const isDoubleAt = atMatch[0] === '@@';
					const operator = isDoubleAt ? '@@' : '@';

					// We want one space before and one space after the operator
					// Replace the entire range with properly spaced operator
					const properlySpaced = ' ' + operator + ' ';
					edits.push(TextEdit.replace(priceOperatorPos, properlySpaced));
				} else {
					// No @ found, this is unusual but handle it by adding a default @ with spacing
					this.logger.warn('Price annotation found but no @ or @@ operator detected in text:', betweenText);
					edits.push(TextEdit.replace(priceOperatorPos, ' @ '));
				}
			}

			// Align or space currency depending on settings
			const amountWithoutCurrency = amount.namedChild(0);
			const amountWithoutCurrencyEndPos = amountWithoutCurrency
				? document.positionAt(amountWithoutCurrency.endIndex)
				: amountEndPos;
			const restOfLine = document.getText({
				start: amountWithoutCurrencyEndPos,
				end: document.positionAt(posting.endIndex),
			});
			const currencyMatch = restOfLine.match(/\s+([A-Z][A-Z0-9_'.-]{0,22}[A-Z0-9])/);
			if (currencyMatch && currencyMatch[1] && !priceAnnotation && !costSpec) {
				const currencyText = currencyMatch[1];
				const matchIndex = restOfLine.indexOf(currencyText);
				if (matchIndex >= 0) {
					const currencyStart = amountWithoutCurrencyEndPos.character + matchIndex;
					const currencyStartPos = {
						line: amountWithoutCurrencyEndPos.line,
						character: currencyStart,
					};
					// Ensure exactly one space between number and currency
					edits.push(TextEdit.replace({ start: amountWithoutCurrencyEndPos, end: currencyStartPos }, ' '));
				}
			}
		} else {
			// No amount, but need to align trailing elements if any
			let lastEndPos = accountEndPos;
			if (costSpec) {
				const costStartPos = document.positionAt(costSpec.startIndex);
				edits.push(TextEdit.replace({
					start: lastEndPos,
					end: costStartPos,
				}, ' '.repeat(positions.amountColumn - accountVisualEndCol)));
				lastEndPos = document.positionAt(costSpec.endIndex);
			}
		}

		// Finally, format comments if present and if there's no existing alignment
		if (comment) {
			const commentStartPos = document.positionAt(comment.startIndex);

			// Find the position of the last element before the comment
			let lastEndPos;
			if (priceAnnotation) lastEndPos = document.positionAt(priceAnnotation.endIndex);
			else if (costSpec) lastEndPos = document.positionAt(costSpec.endIndex);
			else if (amount) lastEndPos = document.positionAt(amount.endIndex);
			else lastEndPos = accountEndPos;

			// Align comment (if it's not already aligned properly)
			if (
				commentStartPos.character < positions.commentColumn
				&& commentStartPos.character - lastEndPos.character !== 1
			) {
				edits.push(TextEdit.replace({
					start: lastEndPos,
					end: commentStartPos,
				}, ' '.repeat(Math.max(1, positions.commentColumn - lastEndPos.character))));
			}
		}
	}

	/**
	 * Helper to convert a tree-sitter node to a VS Code Range
	 */
	private rangeFromNode(document: TextDocument, node: Parser.SyntaxNode): Range {
		return {
			start: document.positionAt(node.startIndex),
			end: document.positionAt(node.endIndex),
		};
	}

	/**
	 * Calculate the visual width of a string, considering double-width characters
	 * like CJK characters.
	 */
	private calculateStringWidth(text: string): number {
		let width = 0;
		for (const char of text) {
			// Use a more comprehensive check for wide characters
			// This includes CJK Unified Ideographs, Hiragana, Katakana, Hangul, etc.

			if (
				/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(char)
			) {
				width += 2;
			} else {
				width += 1;
			}
		}
		return width;
	}
}
