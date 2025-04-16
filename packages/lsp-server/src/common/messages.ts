import { Logger } from '@bean-lsp/shared';
import { Connection } from 'vscode-languageserver';
import { DocumentStore } from './document-store';
import { SymbolIndex } from './features/symbol-index';

const logger = new Logger('CustomMessages');

export function registerCustomMessageHandlers(
	connection: Connection,
	documentStore: DocumentStore,
	symbolIndex: SymbolIndex,
): void {
	// Register handlers for AI assistant related requests

	// Get accounts
	connection.onRequest('beanLspCustom/getAccounts', async () => {
		logger.info('Received request for accounts');
		try {
			// Get account definitions from symbol index
			const accountDefs = await symbolIndex.getAccountDefinitions();
			const accounts = accountDefs.map(def => def.name);
			const uniqueAccounts = [...new Set(accounts)];
			logger.info(`Returning ${uniqueAccounts.length} unique accounts`);
			return uniqueAccounts;
		} catch (error) {
			logger.error(`Error getting accounts: ${error}`);
			return [];
		}
	});

	// Get payees
	connection.onRequest('beanLspCustom/getPayees', async () => {
		logger.info('Received request for payees');
		try {
			// Get payees with SWR caching enabled
			const payees = await symbolIndex.getPayees(true);
			logger.info(`Returning ${payees.length} payees`);
			return payees;
		} catch (error) {
			logger.error(`Error getting payees: ${error}`);
			return [];
		}
	});

	// Get narrations
	connection.onRequest('beanLspCustom/getNarrations', async () => {
		logger.info('Received request for narrations');
		try {
			// Get narrations with SWR caching enabled
			const narrations = await symbolIndex.getNarrations(true);
			logger.info(`Returning ${narrations.length} narrations`);
			return narrations;
		} catch (error) {
			logger.error(`Error getting narrations: ${error}`);
			return [];
		}
	});

	// Get commodities
	connection.onRequest('beanLspCustom/getCommodities', async () => {
		logger.info('Received request for commodities');
		try {
			const commodities = await symbolIndex.getCommodities();
			logger.info(`Returning ${commodities.length} commodities`);
			return commodities;
		} catch (error) {
			logger.error(`Error getting commodities: ${error}`);
			return [];
		}
	});

	// Get tags
	connection.onRequest('beanLspCustom/getTags', async () => {
		logger.info('Received request for tags');
		try {
			const tags = await symbolIndex.getTags();
			logger.info(`Returning ${tags.length} tags`);
			return tags;
		} catch (error) {
			logger.error(`Error getting tags: ${error}`);
			return [];
		}
	});

	// Get links
	connection.onRequest('beanLspCustom/getLinks', async () => {
		logger.info('Received request for links');
		try {
			const links = await symbolIndex.getLinks();
			logger.info(`Returning ${links.length} links`);
			return links;
		} catch (error) {
			logger.error(`Error getting links: ${error}`);
			return [];
		}
	});

	// Get account balance
	connection.onRequest('beanLspCustom/getAccountBalance', async (params: {
		account: string;
		date: string;
		includeSubaccounts: boolean;
	}) => {
		logger.info(`Received request for account balance: ${JSON.stringify(params)}`);
		try {
			// This is a placeholder - implementation would depend on how balances are calculated
			// You might need to implement a Bean-Query runner or call the beancount Python API

			// For now, return a stub response
			return {
				account: params.account,
				date: params.date,
				balance: [
					{ currency: 'USD', amount: 1000.00 },
				],
				includesSubaccounts: params.includeSubaccounts,
				message: 'Note: This is placeholder data. Implement actual balance calculation.',
			};
		} catch (error) {
			logger.error(`Error getting account balance: ${error}`);
			return { error: String(error) };
		}
	});

	// Find transactions
	connection.onRequest('beanLspCustom/findTransactions', async (params: {
		account?: string;
		payee?: string;
		tag?: string;
		link?: string;
		narration?: string;
		startDate?: string;
		endDate?: string;
		minAmount?: number;
		maxAmount?: number;
		currency?: string;
		limit?: number;
	}) => {
		logger.info(`Received request to find transactions: ${JSON.stringify(params)}`);
		try {
			// This is a placeholder - implementation would depend on how transactions are stored and queried
			// You might need to implement a Bean-Query runner or call the beancount Python API

			// For now, return a stub response
			return {
				query: params,
				transactions: [],
				count: 0,
				message: 'Note: This is placeholder data. Implement actual transaction search.',
			};
		} catch (error) {
			logger.error(`Error finding transactions: ${error}`);
			return { error: String(error) };
		}
	});

	// Summarize account
	connection.onRequest('beanLspCustom/summarizeAccount', async (params: {
		account: string;
		startDate?: string;
		endDate?: string;
	}) => {
		logger.info(`Received request to summarize account: ${JSON.stringify(params)}`);
		try {
			// This is a placeholder - implement actual account summarization
			// This could be a complex operation that analyses transactions, computes statistics, etc.

			// For now, return a stub response
			return {
				account: params.account,
				period: {
					start: params.startDate || '2023-01-01',
					end: params.endDate || '2023-12-31',
				},
				summary: 'This account summary is a placeholder. Implement actual summarization logic.',
				statistics: {
					transactionCount: 0,
					averageAmount: 0,
					largestTransaction: null,
				},
				message: 'Note: This is placeholder data. Implement actual summarization.',
			};
		} catch (error) {
			logger.error(`Error summarizing account: ${error}`);
			return { error: String(error) };
		}
	});
}
