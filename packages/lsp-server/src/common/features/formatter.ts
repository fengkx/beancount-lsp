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
				this.logger.info(`Formatter ${formatterEnabled ? 'enabled' : 'disabled'}`);
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

		// Format other directives (open, close, etc.)
		this.formatDirectives(document, tree, edits);

		return edits;
	}

	/**
	 * Format transactions in the document
	 */
	private formatTransactions(document: TextDocument, tree: Parser.Tree, edits: TextEdit[]): void {
		// Query to find all transactions
		const transactionQuery = tree.rootNode.descendantsOfType('transaction');

		for (const txnNode of transactionQuery) {
			// Find all postings within this transaction
			const postings = txnNode.descendantsOfType('posting');

			// Skip if there are no postings to format
			if (postings.length === 0) continue;

			// Determine the positions for alignment
			const positions = this.calculateAlignmentPositions(document, postings);

			// Apply formatting to each posting
			for (const posting of postings) {
				this.formatPosting(document, posting, positions, edits);
			}
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
					const match = integerPart.match(/^\d+/);
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

			// The space between account and amount
			const spaceRange = {
				start: accountEndPos,
				end: amountStartPos,
			};

			// Implement decimal point alignment
			const number = amount.namedChild(0)!;
			const numberText = document.getText({
				start: document.positionAt(number.startIndex),
				end: document.positionAt(number.endIndex),
			});
			const parts = numberText.split('.');
			let integerPart = parts[0]?.trim() || '';

			// Clean integer part and calculate width
			if (parts.length === 1) {
				integerPart = integerPart.match(/^-?\d+/)![0];
			}
			const integerWidth = this.calculateStringWidth(integerPart);

			// Calculate required spaces for decimal point alignment
			const spaceNeeded = positions.decimalPointColumn - accountEndPos.character - integerWidth;
			const whitespaceLength = Math.max(1, spaceNeeded);

			const whitespace = ' '.repeat(whitespaceLength);
			edits.push(TextEdit.replace(spaceRange, whitespace));

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

			// Check if there's a currency symbol directly after the amount
			const amountWithoutCurrency = amount.namedChild(0);
			const amountWithoutCurrencyEndPos = amountWithoutCurrency
				? document.positionAt(amountWithoutCurrency.endIndex)
				: amountEndPos;
			const restOfLine = document.getText({
				start: amountWithoutCurrencyEndPos,
				end: document.positionAt(posting.endIndex),
			});

			// Check for currency symbols that follow the amount
			const currencyMatch = restOfLine.match(/\s+([A-Z][A-Z0-9_'.-]{0,22}[A-Z0-9])/);
			if (currencyMatch && currencyMatch[1] && !priceAnnotation && !costSpec) {
				// Found a currency symbol, ensure there's exactly one space
				const currencyText = currencyMatch[1];
				const matchIndex = restOfLine.indexOf(currencyText);
				if (matchIndex >= 0) {
					const currencyStart = amountWithoutCurrencyEndPos.character + matchIndex;
					const currencyStartPos = {
						line: amountWithoutCurrencyEndPos.line,
						character: currencyStart,
					};

					// Replace whitespace between amount and currency
					edits.push(TextEdit.replace({
						start: amountWithoutCurrencyEndPos,
						end: currencyStartPos,
					}, ' '));
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
				}, ' '.repeat(positions.amountColumn - accountEndPos.character)));
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
				(char >= '\u4e00' && char <= '\u9fff') // CJK Unified Ideographs
				|| (char >= '\u3040' && char <= '\u309f') // Hiragana
				|| (char >= '\u30a0' && char <= '\u30ff') // Katakana
				|| (char >= '\u3400' && char <= '\u4dbf') // CJK Extension A
				|| (char >= '\uf900' && char <= '\ufaff') // CJK Compatibility Ideographs
				|| (char >= '\uac00' && char <= '\ud7af') // Hangul Syllables
				|| (char >= '\u3000' && char <= '\u303f') // CJK Symbols and Punctuation
			) {
				width += 2;
			} else {
				width += 1;
			}
		}
		return width;
	}
}
