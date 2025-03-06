import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { getRange } from './symbol-extractors';
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
		const accountAtPosition = await this.getAccountAtPosition(document, params.position);
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
		const commodityAtPosition = await this.getCommodityAtPosition(document, params.position);
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

	private async getAccountAtPosition(
		document: TextDocument,
		position: lsp.Position,
	): Promise<string | null> {
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			logger.warn(`Failed to get parse tree for document: ${document.uri}`);
			return null;
		}

		// Get the node at the current position
		const offset = document.offsetAt(position);
		const node = tree.rootNode.descendantForIndex(offset);

		if (!node) {
			return null;
		}

		// Check if we're in an account node
		if (node.type === 'account' || node.text.match(/^[A-Z][A-Za-z0-9:]+(:[A-Z][A-Za-z0-9:]+)*$/)) {
			return node.text;
		}

		// For parent nodes that might contain an account
		if (node.parent && node.parent.type === 'account') {
			return node.parent.text;
		}

		return null;
	}

	private async getCommodityAtPosition(
		document: TextDocument,
		position: lsp.Position,
	): Promise<string | null> {
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			logger.warn(`Failed to get parse tree for document: ${document.uri}`);
			return null;
		}

		// Get the node at the current position
		const offset = document.offsetAt(position);
		const node = tree.rootNode.descendantForIndex(offset);

		if (!node) {
			return null;
		}

		// Check if we're in a currency node
		if (node.type === 'currency') {
			return node.text;
		}

		// For parent nodes that might contain a currency
		if (node.parent && node.parent.type === 'currency') {
			return node.parent.text;
		}

		// Check for text that looks like a currency (typically uppercase 2-5 letter codes)
		if (node.text.match(/^[A-Z]{2,5}$/)) {
			return node.text;
		}

		return null;
	}
}
