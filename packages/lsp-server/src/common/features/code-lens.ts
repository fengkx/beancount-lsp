import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Tree } from 'web-tree-sitter';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { TreeQuery } from '../language';
import { Trees } from '../trees';
import { Feature, RealBeancountManager } from './types';

const logger = new Logger('CodeLens');

export class CodeLensFeature implements Feature {
    private codeLensEnabled: boolean | null = null;

    constructor(
        private readonly documents: DocumentStore,
        private readonly trees: Trees,
        private readonly beanMgr?: RealBeancountManager,
    ) { }

    register(connection: lsp.Connection): void {
        if (!this.beanMgr) {
            logger.info('CodeLens feature disabled: no beancount manager available');
            return;
        }

        connection.onCodeLens(async (params) => {
            try {
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

        logger.info('CodeLens feature registered');
    }

    private async provideCodeLenses(
        params: lsp.CodeLensParams,
    ): Promise<lsp.CodeLens[]> {
        const document = await this.documents.retrieve(params.textDocument.uri);
        if (!document) {
            return [];
        }

        // Check if code lens is enabled
        if (this.codeLensEnabled === null) {
            // We'll assume enabled by default, but this could be configurable
            this.codeLensEnabled = true;
        }

        if (!this.codeLensEnabled) {
            return [];
        }

        const tree = await this.trees.getParseTree(document);
        if (!tree) {
            return [];
        }

        return this.getAccountDefinitionCodeLenses(tree, document);
    }

    private async getAccountDefinitionCodeLenses(
        tree: Tree,
        document: TextDocument,
    ): Promise<lsp.CodeLens[]> {
        const codeLenses: lsp.CodeLens[] = [];

        // Find account definitions (open directives)
        const accountDefinitionQuery = TreeQuery.getQueryByTokenName('account_definition');
        const accountDefinitionCaptures = await accountDefinitionQuery.captures(tree.rootNode);

        for (const capture of accountDefinitionCaptures) {
            const accountNode = capture.node;
            const openDirective = accountNode.parent;

            if (!openDirective || openDirective.type !== 'open') {
                continue;
            }

            const accountName = accountNode.text;

            // Create code lens at the end of the line
            const range = asLspRange(openDirective);
            const codeLensRange: lsp.Range = {
                start: range.end,
                end: range.end,
            };

            // Create unresolved code lens with account name as data
            const codeLens: lsp.CodeLens = {
                range: codeLensRange,
                data: {
                    accountName,
                    uri: document.uri,
                },
            };

            codeLenses.push(codeLens);
        }

        return codeLenses;
    }

    private async resolveCodeLens(codeLens: lsp.CodeLens): Promise<lsp.CodeLens> {
        if (!this.beanMgr || !codeLens.data) {
            return codeLens;
        }

        const { accountName } = codeLens.data;

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
            let balanceText = '';

            if (balances.length === 1) {
                const balance = balances[0]!;
                const formattedNumber = this.formatNumber(balance.number);
                balanceText = `💰 ${shortAccountName}: ${formattedNumber} ${balance.currency}`;
            } else {
                // Multiple currencies
                const formattedBalances = balances
                    .map(b => `${this.formatNumber(b.number)} ${b.currency}`)
                    .join(', ');
                balanceText = `💰 ${shortAccountName}: ${formattedBalances}`;
            }

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