import { Logger } from '@bean-lsp/shared';
import {
	Connection,
	LinkedEditingRangeParams,
	LinkedEditingRangeRegistrationOptions,
	LinkedEditingRangeRequest,
	LinkedEditingRanges,
} from 'vscode-languageserver';
import type Parser from 'web-tree-sitter';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { Feature } from './types';

const logger = new Logger('LinkedEditingRangeFeature');

const TAG_WORD_PATTERN = '#[A-Za-z0-9\\-_/.]+';
const LOG_PREFIX = '[linked-editing]';

export class LinkedEditingRangeFeature implements Feature {
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
	) {}

	register(connection: Connection): void {
		const registerOptions: LinkedEditingRangeRegistrationOptions = {
			documentSelector: [{ language: 'beancount' }],
		};
		connection.client.register(LinkedEditingRangeRequest.type, registerOptions);
		connection.onRequest(LinkedEditingRangeRequest.type, this.provideLinkedEditingRanges.bind(this));
	}

	private async provideLinkedEditingRanges(
		params: LinkedEditingRangeParams,
	): Promise<LinkedEditingRanges | null> {
		const { textDocument, position } = params;
		logger.debug(
			`${LOG_PREFIX} request: uri=${textDocument.uri} position=${position.line}:${position.character}`,
		);

		const document = await this.documents.retrieve(textDocument.uri);
		if (!document) {
			logger.warn(`${LOG_PREFIX} document not found: ${textDocument.uri}`);
			return null;
		}

		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			logger.warn(`${LOG_PREFIX} parse tree unavailable: ${textDocument.uri}`);
			return null;
		}

		const offset = document.offsetAt(position);
		const node = tree.rootNode.descendantForIndex(offset);

		if (!node) {
			logger.debug(`${LOG_PREFIX} no syntax node at position`);
			return null;
		}

		// Find pushtag or poptag node at position
		const pushtagNode = this.findPushtagNode(node);
		const poptagNode = this.findPoptagNode(node);

		if (pushtagNode) {
			const tagName = this.extractTagName(pushtagNode);
			if (tagName) {
				const matchingPoptag = this.findMatchingPoptag(tree.rootNode, pushtagNode, tagName);
				if (matchingPoptag) {
					const tagNode1 = pushtagNode.child(1); // pushtag's tag node
					const tagNode2 = matchingPoptag.child(1); // poptag's tag node
					if (tagNode1 && tagNode2) {
						logger.debug(
							`${LOG_PREFIX} matched pushtag '${tagName}' L${tagNode1.startPosition.row} with poptag L${tagNode2.startPosition.row}`,
						);
						return {
							ranges: [asLspRange(tagNode1), asLspRange(tagNode2)],
							wordPattern: TAG_WORD_PATTERN,
						};
					}
				}
			}
		}

		if (poptagNode) {
			const tagName = this.extractTagName(poptagNode);
			if (tagName) {
				const matchingPushtag = this.findMatchingPushtag(tree.rootNode, poptagNode, tagName);
				if (matchingPushtag) {
					const tagNode1 = matchingPushtag.child(1); // pushtag's tag node
					const tagNode2 = poptagNode.child(1); // poptag's tag node
					if (tagNode1 && tagNode2) {
						logger.debug(
							`${LOG_PREFIX} matched poptag '${tagName}' L${tagNode2.startPosition.row} with pushtag L${tagNode1.startPosition.row}`,
						);
						return {
							ranges: [asLspRange(tagNode1), asLspRange(tagNode2)],
							wordPattern: TAG_WORD_PATTERN,
						};
					}
				} else {
					logger.debug(
						`${LOG_PREFIX} no matching pushtag found for poptag '${tagName}' at L${poptagNode.startPosition.row}`,
					);
				}
			}
		}

		logger.debug(`${LOG_PREFIX} no linked ranges produced`);
		return null;
	}

	private findPushtagNode(node: Parser.SyntaxNode): Parser.SyntaxNode | null {
		let current: Parser.SyntaxNode | null = node;
		while (current) {
			if (current.type === 'pushtag') {
				return current;
			}
			current = current.parent;
		}
		return null;
	}

	private findPoptagNode(node: Parser.SyntaxNode): Parser.SyntaxNode | null {
		let current: Parser.SyntaxNode | null = node;
		while (current) {
			if (current.type === 'poptag') {
				return current;
			}
			current = current.parent;
		}
		return null;
	}

	private extractTagName(node: Parser.SyntaxNode): string | null {
		const tagNode = node.child(1); // pushtag/poptag has format: 'pushtag' tag '\n'
		if (tagNode && tagNode.type === 'tag') {
			// Remove the '#' prefix
			return tagNode.text.startsWith('#') ? tagNode.text.substring(1) : tagNode.text;
		}
		return null;
	}

	/**
	 * Find the matching poptag for a pushtag using stack-based matching.
	 * For pushtag, we need to find the corresponding poptag that closes it.
	 * Since tags work as a stack, we need to find the first poptag with the same tag name
	 * after this pushtag, accounting for nested pushtag/poptag pairs.
	 */
	private findMatchingPoptag(
		rootNode: Parser.SyntaxNode,
		pushtagNode: Parser.SyntaxNode,
		tagName: string,
	): Parser.SyntaxNode | null {
		const pushtagOffset = pushtagNode.startIndex;
		const allNodes: Parser.SyntaxNode[] = [];
		this.collectAllNodes(rootNode, allNodes);

		// Filter to only pushtag and poptag nodes after this pushtag, sorted by position
		const relevantNodes = allNodes
			.filter(n => {
				if (n.type !== 'pushtag' && n.type !== 'poptag') return false;
				return n.startIndex > pushtagOffset;
			})
			.sort((a, b) => a.startIndex - b.startIndex);

		// Use stack-based matching: track pushtag/poptag pairs
		// Stack tracks all open pushtags (regardless of tag name)
		const stack: Parser.SyntaxNode[] = [];
		stack.push(pushtagNode);

		for (const node of relevantNodes) {
			if (node.type === 'pushtag') {
				stack.push(node);
			} else if (node.type === 'poptag') {
				const nodeTagName = this.extractTagName(node);
				if (!nodeTagName) continue;

				// Find the most recent matching pushtag in the stack
				for (let i = stack.length - 1; i >= 0; i--) {
					const stackTagName = this.extractTagName(stack[i]!);
					if (stackTagName === nodeTagName) {
						// Found matching pair
						if (stack[i] === pushtagNode && nodeTagName === tagName) {
							// This is the matching poptag for our pushtag
							return node;
						}
						// Remove the matched pushtag from stack
						stack.splice(i, 1);
						break;
					}
				}
			}
		}

		return null;
	}

	/**
	 * Find the matching pushtag for a poptag using stack-based matching.
	 * For poptag, we need to find the corresponding pushtag that opened it.
	 * Since tags work as a stack, we need to find the most recent pushtag with the same tag name
	 * before this poptag, accounting for nested pushtag/poptag pairs.
	 */
	private findMatchingPushtag(
		rootNode: Parser.SyntaxNode,
		poptagNode: Parser.SyntaxNode,
		tagName: string,
	): Parser.SyntaxNode | null {
		const poptagOffset = poptagNode.startIndex;
		const allNodes: Parser.SyntaxNode[] = [];
		this.collectAllNodes(rootNode, allNodes);

		// Filter to only pushtag and poptag nodes before this poptag, sorted by position (descending)
		const relevantNodes = allNodes
			.filter(n => {
				if (n.type !== 'pushtag' && n.type !== 'poptag') return false;
				return n.startIndex < poptagOffset;
			})
			.sort((a, b) => b.startIndex - a.startIndex); // Process from end to start

		// Use stack-based matching: track poptag/pushtag pairs from the end
		// Stack tracks all open poptags (regardless of tag name)
		const stack: Parser.SyntaxNode[] = [];
		stack.push(poptagNode);

		for (const node of relevantNodes) {
			if (node.type === 'poptag') {
				stack.push(node);
			} else if (node.type === 'pushtag') {
				const nodeTagName = this.extractTagName(node);
				if (!nodeTagName) continue;

				// Find the most recent matching poptag in the stack
				for (let i = stack.length - 1; i >= 0; i--) {
					const stackTagName = this.extractTagName(stack[i]!);
					if (stackTagName === nodeTagName) {
						// Found matching pair
						if (stack[i] === poptagNode && nodeTagName === tagName) {
							// This is the matching pushtag for our poptag
							return node;
						}
						// Remove the matched poptag from stack
						stack.splice(i, 1);
						break;
					}
				}
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
}
