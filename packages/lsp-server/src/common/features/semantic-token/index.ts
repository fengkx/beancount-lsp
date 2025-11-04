import { TOKEN_MODIFIERS } from '@bean-lsp/shared';
import { DocumentStore } from 'src/common/document-store';
import { TreeQuery } from 'src/common/language';
import { Trees } from 'src/common/trees';
import { Connection, SemanticTokens, SemanticTokensParams } from 'vscode-languageserver';
import { Feature } from '../types';
import { TokenBuilder } from './token-builder';

const DEFINITION_MODIFIER = 1 << TOKEN_MODIFIERS.indexOf('definition');

export class SemanticTokenFeature implements Feature {
	constructor(private readonly documents: DocumentStore, private readonly trees: Trees) {}
	register(connection: Connection): void {
		connection.languages.semanticTokens.on(this.provideSemanticToken.bind(this));
	}

	protected async provideSemanticToken(params: SemanticTokensParams): Promise<SemanticTokens> {
		const { uri } = params.textDocument;
		const doc = await this.documents.retrieve(uri);
		const tree = await this.trees.getParseTree(doc);
		if (!tree) {
			return { data: [] };
		}

		const tokenBuilder = new TokenBuilder();

		// Single aggregated query for all semantic tokens
		const matches = await TreeQuery.getQueryByTokenName('semantic_tokens').matches(tree.rootNode);

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

				const line = node.startPosition.row;
				const startChar = node.startPosition.column;
				const length = node.text.length;
				tokenBuilder.push(line, startChar, length, tokenType, tokenModifiers);
			}
		}

		const data = tokenBuilder.build();
		return data;
	}
}
