import { TOKEN_MODIFIERS, TOKEN_TYPES } from '@bean-lsp/shared';
import { DocumentStore } from 'src/common/document-store';
import { TreeQuery } from 'src/common/language';
import { Trees } from 'src/common/trees';
import {
	Connection,
	SemanticTokens,
	SemanticTokensParams,
	SemanticTokensRegistrationOptions,
	SemanticTokensRegistrationType,
} from 'vscode-languageserver';
import { Feature } from '../types';
import { TokenBuilder } from './token-builder';

export class SemanticTokenFeature implements Feature {
	constructor(private readonly documents: DocumentStore, private readonly trees: Trees) {}
	register(connection: Connection) {
		// connection.languages.semanticTokens.on()
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

		const tokenBuilder = new TokenBuilder();

		const stringMatches = await TreeQuery.getQueryByTokenName('string').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(stringMatches, 'string');

		const dateMatches = await TreeQuery.getQueryByTokenName('date').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(dateMatches, 'date');

		const txnMatches = await TreeQuery.getQueryByTokenName('txn').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(txnMatches, 'operator');

		const narrationMatches = await TreeQuery.getQueryByTokenName('narration').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(narrationMatches, 'string');

		const payeeMatches = await TreeQuery.getQueryByTokenName('payee').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(payeeMatches, 'string');

		const accountMatches = await TreeQuery.getQueryByTokenName('account').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(accountMatches, 'account');

		const numberMatches = await TreeQuery.getQueryByTokenName('number').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(numberMatches, 'number');

		const currencyMatches = await TreeQuery.getQueryByTokenName('currency').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(currencyMatches, 'currency');

		const keywordMatches = await TreeQuery.getQueryByTokenName('keyword').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(keywordMatches, 'keyword');

		const tagMatches = await TreeQuery.getQueryByTokenName('tag').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(tagMatches, 'tag');

		const linkMatches = await TreeQuery.getQueryByTokenName('link').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(linkMatches, 'link');

		const kvKeyMatches = await TreeQuery.getQueryByTokenName('kv_key').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(kvKeyMatches, 'kv_key');

		const boolMatches = await TreeQuery.getQueryByTokenName('bool').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(boolMatches, 'bool');

		const commentMatches = await TreeQuery.getQueryByTokenName('comment').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(commentMatches, 'comment');

		const data = tokenBuilder.build();

		return data;
	}
}
