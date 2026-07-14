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
import { getTagDirectiveIndex } from '../utils/tag-directives';
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

		const directiveNode = this.findDirectiveNode(node);
		if (directiveNode) {
			const directiveIndex = await getTagDirectiveIndex(tree);
			const directive = directiveIndex.get(directiveNode);
			const pair = directiveIndex.getPair(directiveNode);
			if (directive && pair) {
				const pushtag = directive.type === 'pushtag' ? directive : pair;
				const poptag = directive.type === 'poptag' ? directive : pair;
				logger.debug(
					`${LOG_PREFIX} matched pushtag '${pushtag.name}' L${pushtag.tagNode.startPosition.row} with poptag L${poptag.tagNode.startPosition.row}`,
				);
				return {
					ranges: [asLspRange(pushtag.tagNode), asLspRange(poptag.tagNode)],
					wordPattern: TAG_WORD_PATTERN,
				};
			}
		}

		logger.debug(`${LOG_PREFIX} no linked ranges produced`);
		return null;
	}

	private findDirectiveNode(node: Parser.SyntaxNode): Parser.SyntaxNode | null {
		let current: Parser.SyntaxNode | null = node;
		while (current) {
			if (current.type === 'pushtag' || current.type === 'poptag') {
				return current;
			}
			current = current.parent;
		}
		return null;
	}
}
