import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { getRange, SymbolInfo } from './symbol-extractors';
import { SymbolIndex } from './symbol-index';

// Create a logger for the references module
const logger = new Logger('references');

/**
 * Provides references functionality for the Beancount Language Server.
 * This feature handles finding all references to a symbol in the codebase.
 */
export class ReferencesFeature {
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly symbolIndex: SymbolIndex,
	) {}

	/**
	 * Registers the references handler with the language server connection
	 */
	register(connection: lsp.Connection): void {
		connection.onReferences((params) => this.onReferences(params));
	}

	/**
	 * Handles references requests from the client
	 */
	private async onReferences(
		params: lsp.ReferenceParams,
	): Promise<lsp.Location[] | null> {
		logger.debug(`References requested at position: ${JSON.stringify(params.position)}`);

		const document = this.documents.get(params.textDocument.uri);
		if (!document) {
			logger.warn(`Document not found: ${params.textDocument.uri}`);
			return null;
		}

		// Try to find an account at the position
		const accountAtPosition = await this.getAccountAtPosition(document, params.position);
		if (accountAtPosition) {
			logger.debug(`Found account at position: ${accountAtPosition}`);
			// Find all references to this account (both usage and definition)
			const references = await this.findAccountReferences(accountAtPosition);
			if (references.length > 0) {
				return references;
			}
		}

		// Try to find a commodity at the position
		const commodityAtPosition = await this.getCommodityAtPosition(document, params.position);
		if (commodityAtPosition) {
			logger.debug(`Found commodity at position: ${commodityAtPosition}`);
			// Find all references to this commodity
			const references = await this.findCommodityReferences(commodityAtPosition);
			if (references.length > 0) {
				return references;
			}
		}

		// Try to find a tag at the position
		const tagAtPosition = await this.getTagAtPosition(document, params.position);
		if (tagAtPosition) {
			logger.debug(`Found tag at position: ${tagAtPosition}`);
			// Find all references to this tag
			const references = await this.findTagReferences(tagAtPosition);
			if (references.length > 0) {
				return references;
			}
		}

		// Try to find a payee at the position
		const payeeAtPosition = await this.getPayeeAtPosition(document, params.position);
		if (payeeAtPosition) {
			logger.debug(`Found payee at position: ${payeeAtPosition}`);
			// Find all references to this payee
			const references = await this.findPayeeReferences(payeeAtPosition);
			if (references.length > 0) {
				return references;
			}
		}

		logger.debug('No references found at the current position');
		return [];
	}

	/**
	 * Find all references to a specific account
	 */
	private async findAccountReferences(accountName: string): Promise<lsp.Location[]> {
		const db = this.symbolIndex['_symbolInfoStorage'];
		const references: lsp.Location[] = [];

		// Find all account usages
		const accountUsages = await db.findAsync({
			_symType: 'account_usage',
			name: accountName,
		}) as SymbolInfo[];

		// Add account definitions
		const accountDefinitions = await db.findAsync({
			_symType: 'account_definition',
			name: accountName,
		}) as SymbolInfo[];

		// Combine both types of references
		const allReferences = [...accountUsages, ...accountDefinitions];

		// Convert to LSP Locations
		for (const ref of allReferences) {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		}

		logger.debug(`Found ${references.length} references to account: ${accountName}`);
		return references;
	}

	/**
	 * Find all references to a specific commodity
	 */
	private async findCommodityReferences(commodityName: string): Promise<lsp.Location[]> {
		const db = this.symbolIndex['_symbolInfoStorage'];
		const references: lsp.Location[] = [];

		// Find all commodity usages
		const commodityUsages = await db.findAsync({
			_symType: 'commodity',
			name: commodityName,
		}) as SymbolInfo[];

		// Add commodity definitions
		const commodityDefinitions = await db.findAsync({
			_symType: 'currency_definition',
			name: commodityName,
		}) as SymbolInfo[];

		// Combine both types of references
		const allReferences = [...commodityUsages, ...commodityDefinitions];

		// Convert to LSP Locations
		for (const ref of allReferences) {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		}

		logger.debug(`Found ${references.length} references to commodity: ${commodityName}`);
		return references;
	}

	/**
	 * Find all references to a specific tag
	 */
	private async findTagReferences(tagName: string): Promise<lsp.Location[]> {
		const db = this.symbolIndex['_symbolInfoStorage'];
		const references: lsp.Location[] = [];

		// Find all tag usages
		const tagReferences = await db.findAsync({
			_symType: 'tag',
			name: tagName,
		}) as SymbolInfo[];

		// Convert to LSP Locations
		for (const ref of tagReferences) {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		}

		logger.debug(`Found ${references.length} references to tag: ${tagName}`);
		return references;
	}

	/**
	 * Find all references to a specific payee
	 */
	private async findPayeeReferences(payeeName: string): Promise<lsp.Location[]> {
		const db = this.symbolIndex['_symbolInfoStorage'];
		const references: lsp.Location[] = [];

		// Find all payee usages
		const payeeReferences = await db.findAsync({
			_symType: 'payee',
			name: payeeName,
		}) as SymbolInfo[];

		// Convert to LSP Locations
		for (const ref of payeeReferences) {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		}

		logger.debug(`Found ${references.length} references to payee: ${payeeName}`);
		return references;
	}

	/**
	 * Extracts the account name at the given position
	 */
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

	/**
	 * Extracts the commodity name at the given position
	 */
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

	/**
	 * Extracts the tag name at the given position
	 */
	private async getTagAtPosition(
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

		// Check if we're in a tag node
		if (node.type === 'tag') {
			return node.text.substring(1); // Remove the # prefix
		}

		// For parent nodes that might contain a tag
		if (node.parent && node.parent.type === 'tag') {
			return node.parent.text.substring(1); // Remove the # prefix
		}

		// Check for text that looks like a tag (starts with #)
		if (node.text.startsWith('#')) {
			return node.text.substring(1);
		}

		return null;
	}

	/**
	 * Extracts the payee name at the given position
	 */
	private async getPayeeAtPosition(
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

		// Check if we're in a payee node
		if (node.type === 'payee') {
			return node.text.replace(/^"|"$/g, ''); // Remove quotes
		}

		// For parent nodes that might contain a payee
		if (node.parent && node.parent.type === 'payee') {
			return node.parent.text.replace(/^"|"$/g, ''); // Remove quotes
		}

		return null;
	}
}
