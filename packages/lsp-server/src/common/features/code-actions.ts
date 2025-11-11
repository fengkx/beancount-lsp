import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { parseExpression } from '../utils/expression-parser';
import { Feature, RealBeancountManager } from './types';

const logger = new Logger('CodeAction');

export class CodeActionFeature implements Feature {
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly beanMgr?: RealBeancountManager,
	) {}

	register(connection: lsp.Connection): void {
		connection.onCodeAction(async (params): Promise<(lsp.Command | lsp.CodeAction)[]> => {
			try {
				return await this.onCodeAction(params);
			} catch (err) {
				logger.error(`onCodeAction error: ${(err as Error).stack ?? String(err)}`);
				return [];
			}
		});
	}

	private async onCodeAction(params: lsp.CodeActionParams): Promise<lsp.CodeAction[]> {
		const document = await this.documents.retrieve(params.textDocument.uri);
		if (!document) {
			return [];
		}
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return [];
		}

		const actions: lsp.CodeAction[] = [];

		// Normalize localized numbers inside a transaction postings
		const normalizeAction = await this.tryBuildNormalizeTransactionAction(tree, document, params.range);
		if (normalizeAction) {
			actions.push(normalizeAction);
		}

		const exprCalculationAction = await this.tryBuildExprCalculationAction(tree, document, params.range);
		if (exprCalculationAction) {
			actions.push(exprCalculationAction);
		}

		if (this.beanMgr) {
			for (let line = params.range.start.line; line <= params.range.end.line; line++) {
				// if (processedLines.has(line)) continue;
				const text = this.getLineText(document, line);
				if (!this.looksLikeBalanceLine(text)) continue;

				const accountNode = this.findNodeOfTypeAtLine(tree, 'account', line);
				const dateNode = this.findNodeOfTypeAtLine(tree, 'date', line);
				if (!accountNode || !dateNode) continue;
				const accountText = accountNode.text;

				let amounts: { number: string; currency: string }[] = [];
				try {
					amounts = this.beanMgr.getBalance(accountText, false);
				} catch (e) {
					logger.debug(`fallback getBalance failed for ${accountText}: ${String(e)}`);
					continue;
				}
				if (!amounts || amounts.length === 0) continue;

				const diagsForLine = this.getDiagnosticsForLine(params, line);

				for (const amt of amounts) {
					actions.push(
						this.buildSingleCurrencyActionForLine(
							document,
							text,
							accountNode,
							`${amt.number} ${amt.currency}`,
							diagsForLine,
						),
					);
				}

				if (amounts.length > 1) {
					const indent = this.lineIndent(document, line);
					const dateText = dateNode.text;
					actions.push(
						this.buildMultiCurrencyAction(
							document,
							line,
							indent,
							dateText,
							accountText,
							amounts,
							diagsForLine,
						),
					);
				}
			}
		}

		return actions;
	}

	private fullLineRange(document: TextDocument, line: number): lsp.Range {
		const start: lsp.Position = { line, character: 0 };
		const text = document.getText();
		const startOffset = document.offsetAt(start);
		let endOffset = text.indexOf('\n', startOffset);
		if (endOffset === -1) {
			endOffset = text.length;
		}
		return {
			start,
			end: document.positionAt(endOffset),
		};
	}

	private lineIndent(document: TextDocument, line: number): string {
		const range: lsp.Range = {
			start: { line, character: 0 },
			end: { line, character: Number.MAX_SAFE_INTEGER },
		};
		const content = document.getText(range).split('\n')[0] ?? '';
		const m = content.match(/^\s*/);
		return m ? m[0] : '';
	}

	private getLineText(document: TextDocument, line: number): string {
		const range: lsp.Range = {
			start: { line, character: 0 },
			end: { line, character: Number.MAX_SAFE_INTEGER },
		};
		return document.getText(range).split('\n')[0] ?? '';
	}

	private looksLikeBalanceLine(text: string): boolean {
		return /\d{4}-\d{2}-\d{2}\s+balance\b/.test(text);
	}

	private getDiagnosticsForLine(params: lsp.CodeActionParams, line: number): lsp.Diagnostic[] | undefined {
		const diags = params.context?.diagnostics || [];
		const result = diags.filter(d => d.code === 'balance-missing-amount' && d.range.start.line === line);
		return result.length ? result : undefined;
	}

	private findNodeOfTypeAtLine(tree: import('web-tree-sitter').Tree, type: string, line: number) {
		const nodes = tree.rootNode.descendantsOfType(type);
		for (const n of nodes) {
			if (n.startPosition.row === line) return n;
		}
		return null;
	}

	/**
	 * Build a replace edit that ensures exactly one space between account and inserted amount,
	 * and keeps one space before any following token (e.g., currency) already on the line.
	 */
	private buildGapReplaceEdit(
		document: TextDocument,
		lineText: string,
		accountEndIndex: number,
		amountText: string,
	): lsp.TextEdit {
		const pos = document.positionAt(accountEndIndex);
		const line = pos.line;
		const lineStartOffset = document.offsetAt({ line, character: 0 });
		const rel = pos.character;

		// Find first non-whitespace column after account on this line
		let i = rel;
		while (i < lineText.length && (lineText[i] === ' ' || lineText[i] === '\t')) i++;

		const nextChar = i < lineText.length ? lineText[i] : undefined;
		const rangeStart = accountEndIndex;
		const rangeEnd = lineStartOffset + i; // stop before first non-space char (or EOL)

		// Ensure one space before amount; if next token exists and is not space, add a trailing space
		const replacement = ' ' + amountText + (nextChar && nextChar !== ' ' ? ' ' : '');
		return lsp.TextEdit.replace(
			{
				start: document.positionAt(rangeStart),
				end: document.positionAt(rangeEnd),
			},
			replacement,
		);
	}

	/**
	 * Build a single-currency Quick Fix for an incomplete line (fallback path),
	 * normalizing the spacing between account and amount.
	 */
	private buildSingleCurrencyActionForLine(
		document: TextDocument,
		lineText: string,
		accountNode: import('web-tree-sitter').SyntaxNode,
		amountText: string,
		diagnostics?: lsp.Diagnostic[],
	): lsp.CodeAction {
		const title = `Insert balance: ${amountText}`;
		const gapEdit = this.buildGapReplaceEdit(document, lineText, accountNode.endIndex, amountText);
		return {
			title,
			kind: lsp.CodeActionKind.QuickFix,
			edit: { changes: { [document.uri]: [gapEdit] } },
			diagnostics,
		};
	}

	/**
	 * Build a multi-currency Quick Fix that replaces the whole line with multiple
	 * balance directives for each currency.
	 */
	private buildMultiCurrencyAction(
		document: TextDocument,
		line: number,
		indent: string,
		dateText: string,
		accountText: string,
		amounts: { number: string; currency: string }[],
		diagnostics?: lsp.Diagnostic[],
	): lsp.CodeAction {
		const title = 'Insert balances (all currencies, multi-line)';
		const multi = this.buildMultiCurrencyText(indent, dateText, accountText, amounts);
		const edit: lsp.WorkspaceEdit = {
			changes: {
				[document.uri]: [lsp.TextEdit.replace(this.fullLineRange(document, line), multi)],
			},
		};
		return {
			title,
			kind: lsp.CodeActionKind.QuickFix,
			edit,
			diagnostics,
		};
	}

	private buildMultiCurrencyText(
		indent: string,
		dateText: string,
		accountText: string,
		amounts: { number: string; currency: string }[],
	): string {
		return amounts
			.map(a => `${indent}${dateText} balance ${accountText} ${a.number} ${a.currency}`)
			.join('\n');
	}

	/**
	 * Try to create a code action that normalizes postings' amount formatting within the transaction
	 * intersecting the given range.
	 */
	private async tryBuildNormalizeTransactionAction(
		tree: import('web-tree-sitter').Tree,
		document: TextDocument,
		range: lsp.Range,
	): Promise<lsp.CodeAction | null> {
		// Find the transaction that intersects the selection start
		const txns = tree.rootNode.descendantsOfType(
			'transaction',
			{ row: range.start.line, column: range.start.character },
			{ row: range.end.line, column: range.end.character },
		);
		const targetTxn = txns.find(t =>
			t.startPosition.row <= range.end.line && t.endPosition.row >= range.start.line
		);
		if (!targetTxn) return null;

		// Collect postings inside this transaction
		const postings: import('web-tree-sitter').SyntaxNode[] = [];
		for (let i = 0; i < targetTxn.namedChildCount; i++) {
			const ch = targetTxn.namedChild(i);
			if (ch && ch.type === 'posting') postings.push(ch);
		}
		if (postings.length === 0) return null;

		// Determine common currency in this transaction (if unique)
		const currencySet = new Set<string>();
		for (const p of postings) {
			const amountNode = p.childForFieldName('amount');
			if (!amountNode) continue;
			const curNode = amountNode.namedChildren.find(n => n.type === 'currency');
			if (curNode) currencySet.add(curNode.text);
		}
		const commonCurrency = currencySet.size === 1 ? Array.from(currencySet)[0] : undefined;

		// Determine target fraction digits: prefer explicit decimals; otherwise max among postings; fallback 2
		let targetFractionDigits = 0;
		const decCandidates: number[] = [];
		for (const p of postings) {
			const amountNode = p.childForFieldName('amount');
			if (!amountNode) continue;
			const numNode = amountNode.namedChildren.find(n =>
				n.type === 'number' || n.type === 'unary_number_expr' || n.type === 'binary_number_expr'
			);
			if (!numNode) continue;
			const frac = this.detectFractionDigits(numNode.text);
			if (frac !== null) decCandidates.push(frac);
		}
		if (decCandidates.length > 0) {
			targetFractionDigits = Math.max(...decCandidates);
		} else {
			targetFractionDigits = 2;
		}

		// Build edits
		const edits: lsp.TextEdit[] = [];
		let changed = false;
		for (const p of postings) {
			const amountNode = p.childForFieldName('amount');
			if (!amountNode) continue;

			// Extract numeric part and currency part (if any)
			const numNode = amountNode.namedChildren.find(n =>
				n.type === 'number' || n.type === 'unary_number_expr' || n.type === 'binary_number_expr'
			);
			const curNode = amountNode.namedChildren.find(n => n.type === 'currency');
			if (!numNode) continue;

			const rawNumberText = numNode.text;
			const normalizedNumber = this.normalizeLocalizedNumber(rawNumberText, targetFractionDigits);

			// Decide currency text for this posting
			const currencyText = curNode ? curNode.text : (commonCurrency ?? '');

			// Build replacement text for the amount node
			const desired = currencyText ? `${normalizedNumber} ${currencyText}` : normalizedNumber;
			const currentAmountText = amountNode.text.trim();
			if (currentAmountText !== desired) {
				edits.push(
					lsp.TextEdit.replace(
						{
							start: document.positionAt(amountNode.startIndex),
							end: document.positionAt(amountNode.endIndex),
						},
						desired,
					),
				);
				changed = true;
			}
		}

		if (!changed) return null;
		const title = 'Normalize amounts in transaction';
		return {
			title,
			kind: lsp.CodeActionKind.QuickFix,
			edit: { changes: { [document.uri]: edits } },
		};
	}

	/**
	 * Detect fraction digits from a localized number string (heuristic).
	 * Returns null if cannot determine.
	 */
	private detectFractionDigits(text: string): number | null {
		const cleaned = text.replace(/\s/g, '');
		const lastDot = cleaned.lastIndexOf('.');
		const lastComma = cleaned.lastIndexOf(',');
		const sepIndex = Math.max(lastDot, lastComma);
		if (sepIndex === -1) return 0;
		const frac = cleaned.slice(sepIndex + 1);
		// If looks like thousands grouping (length 3 and nothing after), treat as 0
		if (/^\d{3}$/.test(frac) && (cleaned.match(/[.,]/g)?.length ?? 0) > 1) return 0;
		if (/^\d+$/.test(frac)) return frac.length;
		return null;
	}

	/**
	 * Normalize localized number string to canonical form:
	 * - remove grouping separators (space, comma, dot used as thousands)
	 * - use '.' as decimal separator
	 * - keep sign
	 * - format to targetFractionDigits (pad with zeros if needed)
	 */
	private normalizeLocalizedNumber(raw: string, targetFractionDigits: number): string {
		// If the number text represents an expression (e.g. (295+42), 295-42, 1+2*3),
		// do NOT try to pad decimals or reformat it; just return as-is (trimmed).
		// We treat a leading sign as part of a simple number, but any operator/parentheses
		// or a minus not at the first position indicates an expression.
		const trimmed = raw.trim();
		// Detect operators or parentheses
		if (
			/[()+*/]/.test(trimmed)
			// A '-' that is not the very first non-space char indicates an expression
			|| (trimmed.indexOf('-') > 0)
		) {
			return trimmed;
		}

		let s = raw.trim();
		// Remove spaces within digits
		s = s.replace(/\s+/g, '');

		// Determine decimal separator
		const lastDot = s.lastIndexOf('.');
		const lastComma = s.lastIndexOf(',');
		let decimalSep = '';
		if (lastDot === -1 && lastComma === -1) {
			decimalSep = '';
		} else if (lastDot === -1) {
			decimalSep = ',';
		} else if (lastComma === -1) {
			decimalSep = '.';
		} else {
			decimalSep = lastDot > lastComma ? '.' : ',';
		}

		// Split sign
		let sign = '';
		if (s.startsWith('+') || s.startsWith('-')) {
			sign = s[0]!;
			s = s.slice(1);
		}

		let integerPart = s;
		let fractionPart = '';
		if (decimalSep) {
			const idx = s.lastIndexOf(decimalSep);
			integerPart = s.slice(0, idx);
			fractionPart = s.slice(idx + 1);
		}

		// Remove grouping separators from integer part (commas/dots/apostrophes often used)
		integerPart = integerPart.replace(/[.,' ]/g, '');

		// If there were multiple separators and we mis-classified decimal as thousands, try to fix:
		// If fraction has exactly 3 digits and there are still separators in integer part originally,
		// but targetFractionDigits > 0, keep as fraction. Otherwise treat as no fraction.
		if (decimalSep && !/^\d+$/.test(fractionPart)) {
			// Non-digit garbage, drop fraction
			fractionPart = '';
		}

		// Format fraction to targetFractionDigits
		if (targetFractionDigits > 0) {
			fractionPart = (fractionPart || '').replace(/[^0-9]/g, '');
			if (fractionPart.length > targetFractionDigits) {
				fractionPart = fractionPart.slice(0, targetFractionDigits);
			} else {
				while (fractionPart.length < targetFractionDigits) fractionPart += '0';
			}
		} else {
			fractionPart = '';
		}

		return sign + integerPart + (targetFractionDigits > 0 ? '.' + fractionPart : '');
	}

	private async tryBuildExprCalculationAction(
		tree: import('web-tree-sitter').Tree,
		document: TextDocument,
		range: lsp.Range,
	): Promise<lsp.CodeAction | null> {
		let exprNodes = tree.rootNode.descendantsOfType(
			'amount_tolerance',
			{ row: range.start.line, column: range.start.character },
			{ row: range.end.line, column: range.end.character },
		);
		if (exprNodes.length === 0) {
			exprNodes = tree.rootNode.descendantsOfType(
				'amount',
				{ row: range.start.line, column: range.start.character },
				{ row: range.end.line, column: range.end.character },
			);
		}
		if (exprNodes.length === 0) {
			exprNodes = tree.rootNode.descendantsOfType(
				'incomplete_amount',
				{ row: range.start.line, column: range.start.character },
				{ row: range.end.line, column: range.end.character },
			);
		}
		if (exprNodes.length === 0) return null;

		const exprNode = exprNodes[0];
		if (!exprNode) return null;
		if (!['amount', 'amount_tolerance', 'incomplete_amount'].includes(exprNode.type)) {
			return null;
		}

		const numberNode = exprNode.firstChild;
		if (!numberNode) return null;
		const exprText = numberNode?.text ?? '';
		if (/^([0-9]+|[0-9][0-9,]+[0-9])(\.[0-9]*)?$/.test(exprText)) return null;
		const result = parseExpression(exprText);
		const replacement = result.toString();
		if (replacement === exprText) return null;
		const title = `Calculate expression: ${exprText} -> ${replacement}`;
		return {
			title,
			kind: lsp.CodeActionKind.QuickFix,
			edit: { changes: { [document.uri]: [lsp.TextEdit.replace(asLspRange(numberNode), replacement)] } },
		};
	}
}
