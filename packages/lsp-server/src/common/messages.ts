import { CustomMessages, Logger } from '@bean-lsp/shared';
import { Connection } from 'vscode-languageserver';
import { DocumentStore } from './document-store';
import { SymbolIndex } from './features/symbol-index';

const logger = new Logger('CustomMessages');

export function registerCustomMessageHandlers(
	connection: Connection,
	_documentStore: DocumentStore,
	symbolIndex: SymbolIndex,
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
