import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import type Parser from 'web-tree-sitter';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import * as positionUtils from './position-utils';
import { getRange, SymbolInfo, SymbolKey, SymbolType } from './symbol-extractors';
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

	/**
	 * Public method to get definitions - can be used by other features
	 */
	public async getDefinition(params: lsp.DefinitionParams, rename: boolean = false): Promise<lsp.Definition | null> {
		return this.onDefinition(params, rename);
	}

	private async onDefinition(
		params: lsp.DefinitionParams,
		rename: boolean = false,
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
			return this.findPushTagDefinitions(document, params.position);
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

		// When cursor on payee and narration, we return a range include current position, which make vscode use the alternative command (usually go to references)
		// https://github.com/microsoft/vscode/blob/b227e84a88ed27b9774ceb9aad3511c9c58b3dde/src/vs/editor/contrib/gotoSymbol/browser/goToCommands.ts#L146
		if (__VSCODE__ && !rename) {
			const payeeAtPosition = await positionUtils.getPayeeAtPosition(this.trees, document, params.position);
			if (payeeAtPosition) {
				logger.debug(`Found payee at cursor: ${payeeAtPosition}`);
				return [{
					uri: document.uri,
					range: {
						start: params.position,
						end: params.position,
					},
				}];
			}

			const narrationAtPosition = await positionUtils.getNarrationAtPosition(
				this.trees,
				document,
				params.position,
			);
			if (narrationAtPosition) {
				logger.debug(`Found narration at cursor: ${narrationAtPosition}`);
				return [{
					uri: document.uri,
					range: {
						start: params.position,
						end: params.position,
					},
				}];
			}
		}

		return null;
	}

	/**
	 * Find the matching pushtag for the poptag at the given position.
	 * Matching must follow Beancount's push/pop stack behavior within the same file.
	 */
	private async findPushTagDefinitions(
		document: TextDocument,
		position: lsp.Position,
	): Promise<lsp.Location[] | null> {
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return null;
		}

		const node = tree.rootNode.descendantForIndex(document.offsetAt(position));
		const poptagNode = this.findNodeOrParentOfType(node, 'poptag');
		if (!poptagNode) {
			return null;
		}

		const tagName = this.extractTagName(poptagNode);
		if (!tagName) {
			return null;
		}

		const matchedPushtagNode = this.findMatchingPushtag(tree.rootNode, poptagNode, tagName);
		if (!matchedPushtagNode) {
			logger.debug(`No matching pushtag found for poptag: ${tagName}`);
			return null;
		}

		const tagNode = matchedPushtagNode.child(1);
		if (!tagNode) {
			return null;
		}

		return [{
			uri: document.uri,
			range: asLspRange(tagNode),
		}];
	}

	private findNodeOrParentOfType(node: Parser.SyntaxNode, type: 'pushtag' | 'poptag'): Parser.SyntaxNode | null {
		let current: Parser.SyntaxNode | null = node;
		while (current) {
			if (current.type === type) {
				return current;
			}
			current = current.parent;
		}
		return null;
	}

	private extractTagName(node: Parser.SyntaxNode): string | null {
		const tagNode = node.child(1);
		if (tagNode && tagNode.type === 'tag') {
			return tagNode.text.startsWith('#') ? tagNode.text.substring(1) : tagNode.text;
		}
		return null;
	}

	private findMatchingPushtag(
		rootNode: Parser.SyntaxNode,
		poptagNode: Parser.SyntaxNode,
		tagName: string,
	): Parser.SyntaxNode | null {
		const poptagOffset = poptagNode.startIndex;
		const allNodes: Parser.SyntaxNode[] = [];
		this.collectAllNodes(rootNode, allNodes);

		// Process from current poptag backwards to preserve proper stack matching.
		const relevantNodes = allNodes
			.filter(node => {
				if (node.type !== 'pushtag' && node.type !== 'poptag') return false;
				return node.startIndex < poptagOffset;
			})
			.sort((a, b) => b.startIndex - a.startIndex);

		const stack: Parser.SyntaxNode[] = [poptagNode];
		for (const node of relevantNodes) {
			if (node.type === 'poptag') {
				stack.push(node);
				continue;
			}

			const nodeTagName = this.extractTagName(node);
			if (!nodeTagName) {
				continue;
			}

			for (let i = stack.length - 1; i >= 0; i--) {
				const stackTagName = this.extractTagName(stack[i]!);
				if (stackTagName !== nodeTagName) {
					continue;
				}

				if (stack[i] === poptagNode && nodeTagName === tagName) {
					return node;
				}

				stack.splice(i, 1);
				break;
			}
		}

		return null;
	}

	private collectAllNodes(node: Parser.SyntaxNode, result: Parser.SyntaxNode[]): void {
		result.push(node);
		for (const child of node.children) {
			this.collectAllNodes(child, result);
		}
	}

	private async findTagUsages(tagName: string): Promise<lsp.Location[] | null> {
		// Find all tag usages
		const tagUsages = await this.symbolIndex.findAsync({
			[SymbolKey.TYPE]: SymbolType.TAG,
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
		const definitions = definitionsResult;

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
		const definitions = await this.symbolIndex.getCommodityDefinitions();

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
