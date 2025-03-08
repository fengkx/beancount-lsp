import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
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
		const document = await this.documents.retrieve(params.textDocument.uri);
		if (!document) {
			logger.warn(`Document not found: ${params.textDocument.uri}`);
			return null;
		}

		// First, try to find a tag at the position
		const tagAtPosition = await positionUtils.getTagAtPosition(this.trees, document, params.position);
		if (tagAtPosition) {
			// Return tag usage locations
			logger.debug(`Found tag at cursor: ${tagAtPosition}`);
			return this.findTagUsages(tagAtPosition);
		}

		// Check for poptag at position (should navigate to the corresponding pushtag)
		const poptagAtPosition = await positionUtils.getPopTagAtPosition(this.trees, document, params.position);
		if (poptagAtPosition) {
			logger.debug(`Found poptag at cursor: ${poptagAtPosition}`);
			return this.findPushTagDefinitions(poptagAtPosition, params.textDocument.uri);
		}

		// Check for account at position
		const accountAtPosition = await positionUtils.getAccountAtPosition(this.trees, document, params.position);
		if (accountAtPosition) {
			// Return account definition or usages
			logger.debug(`Found account at cursor: ${accountAtPosition}`);
			return this.findAccountDefinition(accountAtPosition);
		}

		// Check for commodity at position
		const commodityAtPosition = await positionUtils.getCommodityAtPosition(this.trees, document, params.position);
		if (commodityAtPosition) {
			// Return commodity definition
			logger.debug(`Found commodity at cursor: ${commodityAtPosition}`);
			return this.findCommodityDefinition(commodityAtPosition);
		}

		return null;
	}

	/**
	 * Find the pushtag definition for a given tag name (used for go-to-definition on poptag)
	 * According to Beancount syntax, pushtag and poptag work as a stack, so we need to find
	 * the chronologically closest pushtag before the current poptag
	 * We only handle pushtag/poptag within the same file, and ignore cross-file references
	 */
	private async findPushTagDefinitions(tagName: string, currentUri: string): Promise<lsp.Location[] | null> {
		// Find all pushtag declarations
		const pushtagDeclarations = await this.symbolIndex.findAsync({
			_symType: 'pushtag',
			name: tagName,
		}) as SymbolInfo[];

		// If we don't have any pushtag declarations, return null
		if (pushtagDeclarations.length === 0) {
			logger.debug(`No pushtag declaration found for tag: ${tagName}`);
			return null;
		}

		// Filter to only pushtag declarations in the same file
		const sameFileDeclarations = pushtagDeclarations.filter(decl => decl._uri === currentUri);

		// If there are no pushtag declarations in the same file, return null
		// We only care about same-file references
		if (sameFileDeclarations.length === 0) {
			logger.debug(`No pushtag declaration found for tag: ${tagName} in the current file`);
			return null;
		}

		// Sort declarations by line number to find the most recent one
		const sortedDeclarations = [...sameFileDeclarations].sort((a, b) => {
			return a.range[0] - b.range[0];
		});

		// Return the most recent pushtag declaration
		if (sortedDeclarations.length > 0 && sortedDeclarations[0]) {
			return [{
				uri: sortedDeclarations[0]._uri,
				range: getRange(sortedDeclarations[0]),
			}];
		}

		return null;
	}

	private async findTagUsages(tagName: string): Promise<lsp.Location[] | null> {
		// Find all tag usages
		const tagUsages = await this.symbolIndex.findAsync({
			_symType: 'tag',
			name: tagName,
		}) as SymbolInfo[];

		// If we don't have any tag usages, return null
		if (tagUsages.length === 0) {
			logger.debug(`No tag usages found for tag: ${tagName}`);
			return null;
		}

		// Otherwise, return all tag usages as locations
		return tagUsages.map((usage) => ({
			uri: usage._uri,
			range: getRange(usage),
		}));
	}

	private async findAccountDefinition(accountName: string): Promise<lsp.Location[] | null> {
		// Get account definitions from index
		const definitionsResult = await this.symbolIndex.getAccountDefinitions();
		const definitions = definitionsResult as unknown as SymbolInfo[];

		// Filter definitions to find the ones for this account
		const matchingDefinitions = definitions.filter(def => def.name === accountName);
		if (matchingDefinitions.length === 0) {
			logger.debug(`No account definition found for account: ${accountName}`);
			return null;
		}

		// Return matching definitions as locations
		return matchingDefinitions.map(def => ({
			uri: def._uri,
			range: getRange(def),
		}));
	}

	private async findCommodityDefinition(commodityName: string): Promise<lsp.Location[] | null> {
		// Get commodity definitions from index
		const definitionsResult = await this.symbolIndex.getCommodityDefinitions();
		const definitions = definitionsResult as unknown as SymbolInfo[];

		// Filter definitions to find the ones for this commodity
		const matchingDefinitions = definitions.filter(def => def.name === commodityName);
		if (matchingDefinitions.length === 0) {
			logger.debug(`No commodity definition found for commodity: ${commodityName}`);
			return null;
		}

		// Return matching definitions as locations
		return matchingDefinitions.map(def => ({
			uri: def._uri,
			range: getRange(def),
		}));
	}
}
