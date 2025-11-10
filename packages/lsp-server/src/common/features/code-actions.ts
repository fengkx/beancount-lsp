import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { Feature, RealBeancountManager } from './types';

const logger = new Logger('CodeAction');

export class CodeActionFeature implements Feature {
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly beanMgr: RealBeancountManager,
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

		// Fallback: handle incomplete balance lines like "DATE balance ACCOUNT ..."
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
}
