import { Logger } from '@bean-lsp/shared';
import { CustomMessagesSchema } from '@bean-lsp/shared';
import { TextDocument } from 'vscode-languageserver-textdocument';
import type { z } from 'zod';
import { TreeQuery } from '../language';
import { Trees } from '../trees';

type TransactionContext = z.infer<typeof CustomMessagesSchema.GetHistoryContext.response>[number];

export class HistoryContext {
	private logger = new Logger('HistoryContext');
	private contexts: Map<string, TransactionContext> = new Map();

	constructor(private readonly trees: Trees) {}

	/**
	 * Creates a unique key for a transaction context for deduplication
	 */
	private createContextKey(context: TransactionContext): string {
		return `${context.payee}|${context.narration}`;
		// Sort accounts to ensure consistent key generation
		// const sortedAccounts = [...context.accounts].sort();
		// return `${context.payee}|${context.narration}|${sortedAccounts.join(',')}`;
	}

	/**
	 * Extracts transaction context from a document
	 */
	public async extractFromDocument(document: TextDocument): Promise<TransactionContext[]> {
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			this.logger.warn(`Failed to get parse tree for document: ${document.uri}`);
			return [];
		}

		const contexts: TransactionContext[] = [];
		const transactionNodes = await TreeQuery.getQueryByTokenName('transaction').matches(tree.rootNode);

		for (const match of transactionNodes) {
			const node = match.captures?.[0]?.node;
			if (!node) {
				continue;
			}

			// Extract payee
			const payeeNode = node.children.find(child => child.type === 'payee');
			const payee = payeeNode ? payeeNode.text.replace(/^"|"$/g, '') : '';

			// Extract narration
			const narrationNode = node.children.find(child => child.type === 'narration');
			const narration = narrationNode ? narrationNode.text.replace(/^"|"$/g, '') : '';

			// Extract accounts from postings
			const accounts: string[] = [];
			const postings = node.children.filter(child => child.type === 'posting');
			for (const posting of postings) {
				const accountNode = posting.childForFieldName('account');
				if (accountNode) {
					accounts.push(accountNode.text);
				}
			}

			if (payee || narration || accounts.length > 0) {
				const context: TransactionContext = {
					payee,
					narration,
					accounts,
				};
				contexts.push(context);

				// Store in the map for deduplication
				const key = this.createContextKey(context);
				this.contexts.set(key, context);
			}
		}

		return contexts;
	}

	/**
	 * Gets all unique transaction contexts
	 */
	public getAllContexts(): TransactionContext[] {
		return Array.from(this.contexts.values());
	}

	/**
	 * Gets similar transaction contexts based on payee or narration
	 */
	public getSimilarContexts(query: { payee?: string; narration?: string }): TransactionContext[] {
		const results: TransactionContext[] = [];

		for (const context of this.contexts.values()) {
			if (query.payee && context.payee.toLowerCase().includes(query.payee.toLowerCase())) {
				results.push(context);
				continue;
			}
			if (query.narration && context.narration.toLowerCase().includes(query.narration.toLowerCase())) {
				results.push(context);
			}
		}

		return results;
	}

	/**
	 * Gets transaction contexts that use specific accounts
	 */
	public getContextsByAccounts(accounts: string[]): TransactionContext[] {
		const results: TransactionContext[] = [];
		const searchAccounts = new Set(accounts);

		for (const context of this.contexts.values()) {
			const contextAccounts = new Set(context.accounts);
			// Check if any of the search accounts are used in this context
			if (Array.from(searchAccounts).some(account => contextAccounts.has(account))) {
				results.push(context);
			}
		}

		return results;
	}

	/**
	 * Clears all stored contexts
	 */
	public clear(): void {
		this.contexts.clear();
	}

	/**
	 * Gets the total number of unique contexts
	 */
	public size(): number {
		return this.contexts.size;
	}
}
