import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
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

		// Find the account at the current position
		const accountAtPosition = await this.getAccountAtPosition(document, params.position);
		if (!accountAtPosition) {
			logger.debug('No account found at the current position');
			return null;
		}

		logger.debug(`Found account at position: ${accountAtPosition}`);

		// Get the definition for this account
		const definitions = await this.symbolIndex.getAccountDefinitions();

		// Filter definitions to find the one for this account
		const matchingDefinitions = definitions.filter(def => def.name === accountAtPosition);

		if (matchingDefinitions.length === 0) {
			logger.debug(`No definition found for account: ${accountAtPosition}`);
			return null;
		}

		// Return all matching definitions (usually just one)
		return matchingDefinitions.map(def => ({
			uri: def._uri,
			range: def.range,
		}));
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
}
