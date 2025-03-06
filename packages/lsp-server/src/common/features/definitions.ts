import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import * as positionUtils from './position-utils';
import { getRange, SymbolInfo } from './symbol-extractors';
import { SymbolIndex } from './symbol-index';

// Create a logger for the definitions module
const logger = new Logger('definitions');

export class DefinitionFeature {
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly symbolIndex: SymbolIndex,
	) {}

	register(connection: lsp.Connection): void {
		connection.onDefinition((params) => this.onDefinition(params));
	}

	private async onDefinition(
		params: lsp.DefinitionParams,
	): Promise<lsp.Definition | null> {
		logger.debug(`Definition requested at position: ${JSON.stringify(params.position)}`);

		const document = this.documents.get(params.textDocument.uri);
		if (!document) {
			logger.warn(`Document not found: ${params.textDocument.uri}`);
			return null;
		}

		// Try to find an account at the position
		const accountAtPosition = await positionUtils.getAccountAtPosition(this.trees, document, params.position);
		if (accountAtPosition) {
			logger.debug(`Found account at position: ${accountAtPosition}`);
			// Get the definition for this account
			const definitions = await this.symbolIndex.getAccountDefinitions();
			// Filter definitions to find the one for this account
			const matchingDefinitions = definitions.filter(def => def.name === accountAtPosition);
			if (matchingDefinitions.length > 0) {
				return matchingDefinitions.map(def => ({
					uri: def._uri,
					range: getRange(def),
				}));
			}
		}

		// Try to find a commodity at the position
		const commodityAtPosition = await positionUtils.getCommodityAtPosition(this.trees, document, params.position);
		if (commodityAtPosition) {
			logger.debug(`Found commodity at position: ${commodityAtPosition}`);
			// Get the definition for this commodity
			const definitions = await this.symbolIndex.getCommodityDefinitions();
			// Filter definitions to find the one for this commodity
			const matchingDefinitions = definitions.filter(def => def.name === commodityAtPosition);
			if (matchingDefinitions.length > 0) {
				return matchingDefinitions.map(def => ({
					uri: def._uri,
					range: getRange(def),
				}));
			}
		}

		logger.debug('No definition found at the current position');
		return null;
	}
}
