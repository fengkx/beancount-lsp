import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import { Tree } from 'web-tree-sitter';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { TreeQuery } from '../language';
import { Trees } from '../trees';
import { globalEventBus, GlobalEvents } from '../utils/event-bus';
import { Feature, RealBeancountManager } from './types';

const logger = new Logger('CodeLens');

export class CodeLensFeature implements Feature {
	private codeLensConfig: { enable: boolean; accountBalance: boolean; pad: boolean } | null = null;
	private connection: lsp.Connection | null = null;
	private refreshTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly beanMgr?: RealBeancountManager,
		private readonly refreshSupport = false,
	) {}

	register(connection: lsp.Connection): void {
		this.connection = connection;
		connection.onCodeLens(async (params) => {
			try {
				if (!this.beanMgr?.isEnabled()) {
					logger.info('CodeLens feature disabled: beancount manager is disabled');
					return [];
				}
				return await this.provideCodeLenses(params);
			} catch (error) {
				logger.error(`Error providing code lenses: ${error}`);
				return [];
			}
		});

		connection.onCodeLensResolve(async (codeLens) => {
			try {
				return await this.resolveCodeLens(codeLens);
			} catch (error) {
				logger.error(`Error resolving code lens: ${error}`);
				return codeLens;
			}
		});

		connection.onDidChangeConfiguration(() => {
			this.codeLensConfig = null; // Reset cache to force re-read on next request
		});

		const unsubscribe = globalEventBus.on(GlobalEvents.BeancountUpdate, () => {
			this.scheduleRefresh();
		});
		connection.onExit(() => {
			unsubscribe();
			this.clearRefreshTimer();
		});

		logger.info('CodeLens feature registered');
	}

	private scheduleRefresh(): void {
		if (!this.connection || !this.beanMgr?.isEnabled()) {
			return;
		}
		if (!this.refreshSupport) {
			return;
		}
		if (this.codeLensConfig && !this.codeLensConfig.enable) {
			return;
		}
		if (this.refreshTimer) {
			return;
		}
		this.refreshTimer = setTimeout(() => {
			this.refreshTimer = null;
			if (!this.connection || !this.beanMgr?.isEnabled()) {
				return;
			}
			void this.connection
				.sendRequest(lsp.CodeLensRefreshRequest.type)
				.catch(err => {
					logger.debug(`CodeLens refresh failed: ${String(err)}`);
				});
		}, 150);
	}

	private clearRefreshTimer(): void {
		if (this.refreshTimer) {
			clearTimeout(this.refreshTimer);
			this.refreshTimer = null;
		}
	}

	private async provideCodeLenses(
		params: lsp.CodeLensParams,
	): Promise<lsp.CodeLens[]> {
		const document = await this.documents.retrieve(params.textDocument.uri);
		if (!document) {
			return [];
		}

		// Check if code lens is enabled
		if (this.codeLensConfig === null) {
			if (this.connection) {
				const config = await this.connection.workspace.getConfiguration({ section: 'beanLsp.codeLens' });
				this.codeLensConfig = {
					enable: config?.enable ?? true,
					accountBalance: config?.accountBalance?.enable ?? true,
					pad: config?.pad?.enable ?? true,
				};
			} else {
				this.codeLensConfig = {
					enable: true,
					accountBalance: true,
					pad: true,
				};
			}
		}

		if (!this.codeLensConfig.enable) {
			return [];
		}

		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return [];
		}

		const codeLenses: lsp.CodeLens[] = [];
		if (this.codeLensConfig.accountBalance) {
			codeLenses.push(...await this.getAccountDefinitionCodeLenses(tree, document));
		}
		if (this.codeLensConfig.pad) {
			codeLenses.push(...await this.getPadDirectiveCodeLenses(tree, document));
		}
		return codeLenses;
	}

	private async getAccountDefinitionCodeLenses(
		tree: Tree,
		document: TextDocument,
	): Promise<lsp.CodeLens[]> {
		const codeLenses: lsp.CodeLens[] = [];

		// Find account definitions (open directives)
		const accountDefinitionQuery = TreeQuery.getQueryByTokenName('account_definition');
		const accountDefinitionCaptures = await accountDefinitionQuery.captures(tree);

		for (const capture of accountDefinitionCaptures) {
			const accountNode = capture.node;
			const openDirective = accountNode.parent;

			if (!openDirective || openDirective.type !== 'open') {
				continue;
			}

			const accountName = accountNode.text;

			// Create unresolved code lens with account name as data
			const range = asLspRange(openDirective);
			const codeLens = this.createCodeLensAtEnd(range, {
				kind: 'accountBalance',
				accountName,
				uri: document.uri,
			});

			codeLenses.push(codeLens);
		}

		return codeLenses;
	}

	private async getPadDirectiveCodeLenses(
		tree: Tree,
		document: TextDocument,
	): Promise<lsp.CodeLens[]> {
		const codeLenses: lsp.CodeLens[] = [];
		const padQuery = TreeQuery.getQueryByTokenName('pad');
		const padCaptures = await padQuery.captures(tree);
		const filePath = URI.parse(document.uri).fsPath;

		for (const capture of padCaptures) {
			const pad = capture.node;
			if (!pad || pad.type !== 'pad') {
				continue;
			}

			const fromAccount = pad.childForFieldName('from_account');
			const range = asLspRange(fromAccount ?? pad);
			const codeLens = this.createCodeLensAtEnd(range, {
				kind: 'pad',
				uri: document.uri,
				filePath,
				line: range.start.line,
			});

			codeLenses.push(codeLens);
		}

		return codeLenses;
	}

	private async resolveCodeLens(codeLens: lsp.CodeLens): Promise<lsp.CodeLens> {
		if (!this.beanMgr?.isEnabled() || !codeLens.data) {
			return codeLens;
		}

		const data = codeLens.data as {
			kind?: 'accountBalance' | 'pad';
			accountName?: string;
			uri?: string;
			filePath?: string;
			line?: number;
		};

		if (data.kind === 'pad' && data.uri && typeof data.line === 'number') {
			const filePath = data.filePath ?? URI.parse(data.uri).fsPath;
			const amounts = this.beanMgr.getPadAmounts(filePath, data.line);

			if (amounts.length === 0) {
				codeLens.command = {
					title: '🧮 No padding',
					command: '',
				};
				return codeLens;
			}

			const formatted = this.formatAmounts(amounts);
			codeLens.command = {
				title: `🧮 Pad: ${formatted}`,
				command: '',
			};
			return codeLens;
		}

		const accountName = data.accountName;
		if (!accountName) {
			return codeLens;
		}

		try {
			// Get balance including subaccounts for a more complete view
			const balances = this.beanMgr.getBalance(accountName, true);

			if (balances.length === 0) {
				codeLens.command = {
					title: '💰 No balance',
					command: '',
				};
				return codeLens;
			}

			// Format balance display with account name for clarity
			const shortAccountName = this.getShortAccountName(accountName);
			let balanceText = `💰 ${shortAccountName}: ${this.formatAmounts(balances)}`;

			// Get subaccount count for additional info
			const subaccountBalances = this.beanMgr.getSubaccountBalances(accountName);
			const subaccountCount = subaccountBalances.size - 1; // Exclude the account itself

			if (subaccountCount > 0) {
				balanceText += ` (${subaccountCount} sub)`;
			}

			codeLens.command = {
				title: balanceText,
				command: '',
			};
		} catch (error) {
			logger.error(`Error getting balance for account ${accountName}: ${error}`);
			codeLens.command = {
				title: '💰 Error loading balance',
				command: '',
			};
		}

		return codeLens;
	}

	private formatAmounts(amounts: { number: string; currency: string }[]): string {
		return amounts
			.map(amount => `${this.formatNumber(amount.number)} ${amount.currency}`)
			.join(', ');
	}

	private createCodeLensAtEnd(range: lsp.Range, data: lsp.CodeLens['data']): lsp.CodeLens {
		return {
			range: {
				start: range.end,
				end: range.end,
			},
			data,
		};
	}

	/**
	 * Generate a short, readable account name for display in CodeLens
	 * Truncates long account names while keeping them identifiable
	 */
	private getShortAccountName(accountName: string): string {
		// For very long account names, show the last two parts
		const parts = accountName.split(':');

		if (parts.length > 2 && accountName.length > 30) {
			return `...${parts[parts.length - 2]}:${parts[parts.length - 1]}`;
		}

		// For shorter names or simple structure, return as is
		return accountName;
	}

	/**
	 * Format number by removing excessive trailing zeros
	 * Keep at most one trailing zero after decimal point
	 */
	private formatNumber(numberStr: string): string {
		// Handle edge cases
		if (!numberStr || numberStr === '0') {
			return '0';
		}

		// If it's already a clean number without excessive zeros, return as is
		if (!numberStr.includes('.') || !numberStr.match(/0{2,}$/)) {
			return numberStr;
		}

		// Remove excessive trailing zeros (2 or more consecutive zeros at the end)
		let formatted = numberStr.replace(/0{2,}$/, '0');

		// If the string ends with .0, keep it as is (exactly one trailing zero)
		// If it ends with just ., add one zero
		if (formatted.endsWith('.')) {
			formatted += '0';
		}

		return formatted;
	}
}
