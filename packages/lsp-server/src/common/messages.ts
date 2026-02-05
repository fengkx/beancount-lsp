import { CustomMessages, Logger } from '@bean-lsp/shared';
import type { CustomMessagesSchema } from '@bean-lsp/shared';
import { Connection } from 'vscode-languageserver';
import { z } from 'zod';
import { DocumentStore } from './document-store';
import { SymbolIndex } from './features/symbol-index';
import type { RealBeancountManager } from './features/types';

const logger = new Logger('CustomMessages');

export function registerCustomMessageHandlers(
	connection: Connection,
	_documentStore: DocumentStore,
	symbolIndex: SymbolIndex,
	beanMgr: RealBeancountManager | undefined,
): void {
	// Get accounts
	connection.onRequest(CustomMessages.GetAccounts, async () => {
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
	connection.onRequest(
		CustomMessages.GetPayees,
		async (params: z.infer<typeof CustomMessagesSchema.GetPayees.request>) => {
			logger.info('Received request for payees');
			try {
				const payees = await symbolIndex.getPayees(true, { waitTime: 100 });
				const query = params?.query?.toLowerCase();

				if (query) {
					const filteredPayees = payees.filter(payee => payee.toLowerCase().includes(query));
					logger.info(`Returning ${filteredPayees.length} payees matching query: ${query}`);
					return filteredPayees;
				}

				logger.info(`Returning ${payees.length} payees`);
				return payees;
			} catch (error) {
				logger.error(`Error getting payees: ${error}`);
				return [];
			}
		},
	);

	// Get narrations
	connection.onRequest(
		CustomMessages.GetNarrations,
		async (params: z.infer<typeof CustomMessagesSchema.GetNarrations.request>) => {
			logger.info('Received request for narrations');
			try {
				const narrations = await symbolIndex.getNarrations(true, { waitTime: 100 });
				const query = params?.query?.toLowerCase();

				if (query) {
					const filteredNarrations = narrations.filter(narration => narration.toLowerCase().includes(query));
					logger.info(`Returning ${filteredNarrations.length} narrations matching query: ${query}`);
					return filteredNarrations;
				}

				logger.info(`Returning ${narrations.length} narrations`);
				return narrations;
			} catch (error) {
				logger.error(`Error getting narrations: ${error}`);
				return [];
			}
		},
	);

	// Run bean-query
	connection.onRequest(
		CustomMessages.RunBeanQuery,
		async (params: z.infer<typeof CustomMessagesSchema.RunBeanQuery.request>) => {
			logger.info(`Received request to run bean-query: ${params.query}`);

			if (!beanMgr?.isEnabled()) {
				logger.error('Beancount manager is not enabled');
				return {
					success: false,
					error: 'Beancount manager is not enabled',
				};
			}

			try {
				const output = await beanMgr.runQuery(params.query);
				logger.info(`Query executed successfully`);
				return {
					success: true,
					output,
				};
			} catch (error) {
				logger.error(`Error executing bean-query: ${error}`);
				return {
					success: false,
					error: error instanceof Error ? error.message : String(error),
				};
			}
		},
	);
}
