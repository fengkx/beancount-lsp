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

const DEFINITION_MODIFIER = 1 << TOKEN_MODIFIERS.indexOf('definition');
const DECLARATION_MODIFIER = 1 << TOKEN_MODIFIERS.indexOf('declaration');

export class SemanticTokenFeature implements Feature {
	constructor(private readonly documents: DocumentStore, private readonly trees: Trees) { }
	register(connection: Connection) {
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

		// Strings (generic)
		const stringMatches = await TreeQuery.getQueryByTokenName('string').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(stringMatches, 'string');

		// Dates
		const dateMatches = await TreeQuery.getQueryByTokenName('date').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(dateMatches, 'date');

		// Transaction operators
		const txnMatches = await TreeQuery.getQueryByTokenName('txn').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(txnMatches, 'operator');

		// Narrations as strings
		const narrationMatches = await TreeQuery.getQueryByTokenName('narration').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(narrationMatches, 'string');

		// Payees as strings
		const payeeMatches = await TreeQuery.getQueryByTokenName('payee').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(payeeMatches, 'string');

		// Accounts (with definition modifier for account declarations)
		const accountMatches = await TreeQuery.getQueryByTokenName('account').matches(tree.rootNode);
		const accountDefMatches = await TreeQuery.getQueryByTokenName('account_definition').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(accountMatches, 'account');
		tokenBuilder.buildSingleCaptureTokens(accountDefMatches, 'account', DEFINITION_MODIFIER);

		// Numbers
		const numberMatches = await TreeQuery.getQueryByTokenName('number').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(numberMatches, 'number');

		// Currencies
		const currencyMatches = await TreeQuery.getQueryByTokenName('currency').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(currencyMatches, 'currency');

		// Keywords
		const keywordMatches = await TreeQuery.getQueryByTokenName('keyword').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(keywordMatches, 'keyword');

		// Tags
		const tagMatches = await TreeQuery.getQueryByTokenName('tag').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(tagMatches, 'tag');

		// Links
		const linkMatches = await TreeQuery.getQueryByTokenName('link').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(linkMatches, 'link');

		// Metadata keys
		const kvKeyMatches = await TreeQuery.getQueryByTokenName('kv_key').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(kvKeyMatches, 'kv_key');

		// Boolean values
		const boolMatches = await TreeQuery.getQueryByTokenName('bool').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(boolMatches, 'bool');

		// Comments
		const commentMatches = await TreeQuery.getQueryByTokenName('comment').matches(tree.rootNode);
		tokenBuilder.buildSingleCaptureTokens(commentMatches, 'comment');

		const data = tokenBuilder.build();

		return data;
	}
}
