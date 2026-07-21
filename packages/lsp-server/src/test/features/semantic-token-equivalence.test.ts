import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser, { type QueryMatch, type Tree } from 'web-tree-sitter';

const queryState = vi.hoisted(() => ({ calls: 0, matches: [] as QueryMatch[] }));

vi.mock('@bean-lsp/shared', () => {
	const tokenTypes = [
		'keyword',
		'comment',
		'string',
		'number',
		'operator',
		'enum',
		'account',
		'date',
		'currency',
		'tag',
		'link',
		'kv_key',
		'bool',
	];
	return {
		Logger: class {},
		TOKEN_MODIFIERS: ['default', 'definition', 'deprecated', 'documentation', 'declaration'],
		TOKEN_TYPES: tokenTypes,
		tokenTypeToIndex: (tokenType: string) => tokenTypes.indexOf(tokenType),
	};
});

vi.mock('../../common/language', () => ({
	TreeQuery: {
		getQueryByTokenName: () => ({
			matches: async () => {
				queryState.calls++;
				return queryState.matches;
			},
		}),
	},
}));

import { SemanticTokenFeature } from '../../common/features/semantic-token';
import { TokenBuilder } from '../../common/features/semantic-token/token-builder';

type SemanticTokenFeatureInternals = {
	provideSemanticToken(params: { textDocument: { uri: string } }): Promise<{ data: number[] }>;
};

let parser: Parser;
let semanticTokenQuery: Parser.Query;

beforeAll(async () => {
	await Parser.init({
		wasmBinary: readFileSync(
			fileURLToPath(new URL('../../../node_modules/web-tree-sitter/tree-sitter.wasm', import.meta.url)),
		),
	});
	const language = await Parser.Language.load(
		fileURLToPath(new URL('../../../../tree-sitter-beancount/tree-sitter-beancount.wasm', import.meta.url)),
	);
	parser = new Parser();
	parser.setLanguage(language);
	semanticTokenQuery = language.query(
		readFileSync(
			fileURLToPath(new URL('../../common/language/queries/semantic_tokens.scm', import.meta.url)),
			'utf8',
		),
	);
});

function baselineSemanticTokens(matches: QueryMatch[]): { data: number[] } {
	const builder = new TokenBuilder();
	for (const match of matches) {
		for (const capture of match.captures) {
			const node = capture.node;
			let tokenType: Parameters<typeof builder.push>[3] | undefined;
			let tokenModifiers = 0;
			switch (capture.name) {
				case 'string':
				case 'narration':
				case 'payee':
					tokenType = 'string';
					break;
				case 'date':
					tokenType = 'date';
					break;
				case 'txn':
					tokenType = 'operator';
					break;
				case 'account':
					tokenType = 'account';
					break;
				case 'account_definition':
					tokenType = 'account';
					tokenModifiers = 1 << 1;
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
			builder.push(
				node.startPosition.row,
				node.startPosition.column,
				node.text.length,
				tokenType,
				tokenModifiers,
			);
		}
	}
	return builder.build();
}

function createFeature(document: TextDocument, getTree: () => Tree): SemanticTokenFeatureInternals {
	return new SemanticTokenFeature(
		{ retrieve: async () => document } as never,
		{ getParseTree: async () => getTree() } as never,
	) as unknown as SemanticTokenFeatureInternals;
}

describe('semantic token optimization equivalence', () => {
	for (
		const testCase of [
			{
				name: 'CRLF document',
				text: '2025-01-01 open Assets:Cash CNY\r\n2025-01-02 balance Assets:Cash 10.00 CNY\r\n',
			},
			{
				name: 'Unicode emoji and combining marks',
				text:
					'2025-01-01 * "咖啡😀" "Cafe\u0301" #早餐 ^订单\n  Assets:现金😀  -10.00 CNY\n  Expenses:Cafe\u0301  10.00 CNY\n',
			},
			{
				name: 'incomplete transaction header',
				text: '2025-01-01 * "unfinished\n  Assets:Cash  10.00 CNY\n',
			},
			{
				name: 'partial account and amount in the middle',
				text: '2025-01-01 * "Payee" "Narration"\n  Assets:Ba\n  Expenses:Food  1.\n',
			},
		]
	) {
		it(`matches the baseline for a ${testCase.name}`, async () => {
			const tree = parser.parse(testCase.text);
			queryState.matches = semanticTokenQuery.matches(tree.rootNode);
			const document = TextDocument.create('file:///edge.bean', 'beancount', 1, testCase.text);
			const feature = createFeature(document, () => tree);

			const actual = await feature.provideSemanticToken({ textDocument: { uri: document.uri } });

			expect(actual.data).toEqual(baselineSemanticTokens(queryState.matches).data);
		});
	}

	it('reuses tokens only while the parse tree identity is unchanged', async () => {
		const firstTree = parser.parse('2025-01-01 open Assets:Cash CNY\n');
		const secondTree = parser.parse('2025-01-01 open Assets:Bank CNY\n');
		let currentTree = firstTree;
		const document = TextDocument.create('file:///cache.bean', 'beancount', 1, '');
		const feature = createFeature(document, () => currentTree);
		queryState.calls = 0;
		queryState.matches = semanticTokenQuery.matches(firstTree.rootNode);

		const first = await feature.provideSemanticToken({ textDocument: { uri: document.uri } });
		const cached = await feature.provideSemanticToken({ textDocument: { uri: document.uri } });

		expect(cached).toBe(first);
		expect(queryState.calls).toBe(1);

		currentTree = secondTree;
		queryState.matches = semanticTokenQuery.matches(secondTree.rootNode);
		const changed = await feature.provideSemanticToken({ textDocument: { uri: document.uri } });

		expect(changed).not.toBe(first);
		expect(queryState.calls).toBe(2);
		expect(changed.data).toEqual(baselineSemanticTokens(queryState.matches).data);
	});
});
