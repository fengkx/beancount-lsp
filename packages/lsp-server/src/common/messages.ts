import { CustomMessages, Logger } from '@bean-lsp/shared';
import { CustomMessagesSchema } from '@bean-lsp/shared';
import { Connection } from 'vscode-languageserver';
import { z } from 'zod';
import { DocumentStore } from './document-store';
import { SymbolIndex } from './features/symbol-index';
import { TreeQuery } from './language';
import { Trees } from './trees';

const logger = new Logger('CustomMessages');

type Response = z.infer<typeof CustomMessagesSchema.GetHistoryContext.response>;

export function registerCustomMessageHandlers(
	connection: Connection,
	documentStore: DocumentStore,
	symbolIndex: SymbolIndex,
	trees: Trees,
): void {
	// Get history context
	connection.onRequest(CustomMessages.GetHistoryContext, async () => {
		logger.info('Received request for history context');
		try {
			const contexts = symbolIndex.getAllContexts();
			logger.info(`Returning ${contexts.length} transaction contexts`);
			return contexts;
		} catch (error) {
			logger.error(`Error getting history context: ${error}`);
			return [];
		}
	});

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
}
