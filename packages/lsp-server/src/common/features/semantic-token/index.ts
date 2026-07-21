import { TOKEN_MODIFIERS, TOKEN_TYPES } from '@bean-lsp/shared';
import {
	Connection,
	SemanticTokens,
	SemanticTokensParams,
	SemanticTokensRegistrationOptions,
	SemanticTokensRegistrationType,
} from 'vscode-languageserver';
import type { Tree } from 'web-tree-sitter';
import { DocumentStore } from '../../document-store';
import { TreeQuery } from '../../language';
import { Trees } from '../../trees';
import { Feature } from '../types';
import { TokenBuilder } from './token-builder';

const DEFINITION_MODIFIER = 1 << TOKEN_MODIFIERS.indexOf('definition');

export class SemanticTokenFeature implements Feature {
	private readonly tokensByTree = new WeakMap<Tree, SemanticTokens>();

	constructor(private readonly documents: DocumentStore, private readonly trees: Trees) {}
	register(connection: Connection): void {
		const semanticTokensRegistrationOptions: SemanticTokensRegistrationOptions = {
			documentSelector: [{ language: 'beancount' }],
			legend: { tokenModifiers: TOKEN_MODIFIERS, tokenTypes: TOKEN_TYPES },
			full: true,
			range: false,
		};
		connection.client.register(SemanticTokensRegistrationType.type, semanticTokensRegistrationOptions);
		connection.languages.semanticTokens.on(this.provideSemanticToken.bind(this));
	}

	protected async provideSemanticToken(params: SemanticTokensParams): Promise<SemanticTokens> {
		const { uri } = params.textDocument;
		const doc = await this.documents.retrieve(uri);
		const tree = await this.trees.getParseTree(doc);
		if (!tree) {
			return { data: [] };
		}
		const cached = this.tokensByTree.get(tree);
		if (cached) return cached;

		const tokenBuilder = new TokenBuilder();

		// Single aggregated query for all semantic tokens
		const matches = await TreeQuery.getQueryByTokenName('semantic_tokens').matches(tree);

		for (const match of matches) {
			for (const capture of match.captures) {
				const node = capture.node;
				if (!node) continue;
				let tokenType: Parameters<typeof tokenBuilder.push>[3] | undefined;
				let tokenModifiers = 0;
				switch (capture.name) {
					case 'string':
						tokenType = 'string';
						break;
					case 'date':
						tokenType = 'date';
						break;
					case 'txn':
						tokenType = 'operator';
						break;
					case 'narration':
					case 'payee':
						tokenType = 'string';
						break;
					case 'account':
						tokenType = 'account';
						break;
					case 'account_definition':
						tokenType = 'account';
						tokenModifiers = DEFINITION_MODIFIER;
						break;
					case 'number':
						tokenType = 'number';
						break;
					case 'currency':
						tokenType = 'currency';
						break;
					case 'keyword':
						tokenType = 'keyword';
						break;
					case 'tag':
						tokenType = 'tag';
						break;
					case 'link':
						tokenType = 'link';
						break;
					case 'kv_key':
						tokenType = 'kv_key';
						break;
					case 'bool':
						tokenType = 'bool';
						break;
					case 'comment':
						tokenType = 'comment';
						break;
					default:
						continue;
				}

				const startPosition = node.startPosition;
				const line = startPosition.row;
				const startChar = startPosition.column;
				const length = node.text.length;
				tokenBuilder.push(line, startChar, length, tokenType, tokenModifiers);
			}
		}

		const data = tokenBuilder.build();
		this.tokensByTree.set(tree, data);
		return data;
	}
}
