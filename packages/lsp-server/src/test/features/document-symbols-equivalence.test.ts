import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { DocumentSymbol } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser, { type SyntaxNode, type Tree } from 'web-tree-sitter';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		warn() {}
		error() {}
	},
}));

import { DocumentSymbolsFeature } from '../../common/features/document-symbols';

let parser: Parser;
let language: Parser.Language;

beforeAll(async () => {
	await Parser.init({
		wasmBinary: readFileSync(
			fileURLToPath(new URL('../../../node_modules/web-tree-sitter/tree-sitter.wasm', import.meta.url)),
		),
	});
	language = await Parser.Language.load(
		fileURLToPath(new URL('../../../../tree-sitter-beancount/tree-sitter-beancount.wasm', import.meta.url)),
	);
	parser = new Parser();
	parser.setLanguage(language);
});

type SymbolBuilderName =
	| 'getTransactionSymbol'
	| 'getCommodityDefinitionSymbol'
	| 'getAccountDefinitionSymbol'
	| 'getPriceDirectiveSymbol'
	| 'getBalanceDirectiveSymbol'
	| 'getCloseDirectiveSymbol'
	| 'getPadDirectiveSymbol'
	| 'getDocumentDirectiveSymbol'
	| 'getNoteDirectiveSymbol'
	| 'getEventDirectiveSymbol'
	| 'getQueryDirectiveSymbol'
	| 'getCustomDirectiveSymbol'
	| 'getIncludeDirectiveSymbol';

type FeatureInternals = {
	getDocumentSymbols(document: TextDocument): Promise<DocumentSymbol[]>;
} & Record<SymbolBuilderName, (nodes: SyntaxNode[]) => DocumentSymbol[]>;

const legacyQueries: Array<{
	builder: SymbolBuilderName;
	source: string;
	useParent?: boolean;
}> = [
	{ builder: 'getTransactionSymbol', source: '(transaction) @node' },
	{ builder: 'getCommodityDefinitionSymbol', source: '(commodity (currency) @node)', useParent: true },
	{ builder: 'getAccountDefinitionSymbol', source: '(open (account) @node)', useParent: true },
	{ builder: 'getPriceDirectiveSymbol', source: '(price) @node' },
	{ builder: 'getBalanceDirectiveSymbol', source: '(balance) @node' },
	{ builder: 'getCloseDirectiveSymbol', source: '(close) @node' },
	{ builder: 'getPadDirectiveSymbol', source: '(pad) @node' },
	{ builder: 'getDocumentDirectiveSymbol', source: '(document) @node' },
	{ builder: 'getNoteDirectiveSymbol', source: '(note) @node' },
	{ builder: 'getEventDirectiveSymbol', source: '(event) @node' },
	{ builder: 'getQueryDirectiveSymbol', source: '(query) @node' },
	{ builder: 'getCustomDirectiveSymbol', source: '(custom) @node' },
	{ builder: 'getIncludeDirectiveSymbol', source: '(include) @node' },
];

function filterEmptySymbols(symbols: DocumentSymbol[]): DocumentSymbol[] {
	return symbols.flatMap((symbol) => {
		if (!symbol.name.trim()) return [];
		return symbol.children
			? [{ ...symbol, children: filterEmptySymbols(symbol.children) }]
			: [symbol];
	});
}

function legacySymbols(feature: FeatureInternals, tree: Tree): DocumentSymbol[] {
	const symbols = legacyQueries.flatMap(({ builder, source, useParent }) => {
		const query = language.query(source);
		try {
			const nodes = query.captures(tree.rootNode).flatMap((capture) => {
				const node = useParent ? capture.node.parent : capture.node;
				return node ? [node] : [];
			});
			return feature[builder](nodes);
		} finally {
			query.delete();
		}
	});
	return filterEmptySymbols(symbols);
}

const baseText = [
	'include "账本/2024.bean"',
	'2000-01-01 open Assets:Cash USD, EUR',
	'2000-01-02 commodity HOOL',
	'2000-01-03 price HOOL 500.123 USD',
	'2000-01-04 balance Assets:Cash 0 USD',
	'2000-01-05 close Assets:Cash',
	'2000-01-06 pad Assets:Cash Equity:Opening-Balances',
	'2000-01-07 document Assets:Cash "/账单/一月.pdf"',
	'2000-01-08 note Assets:Cash "午餐 🥟"',
	'2000-01-09 event "位置" "上海"',
	'2000-01-10 query "cash" "SELECT *"',
	'2000-01-11 custom "budget" "weekly" 42 USD',
	'2000-01-12 * "Payee" "Narration"',
	'  Assets:Cash  -1 USD',
	'  Expenses:Food  1 USD',
].join('\n');

function editingStates(): string[] {
	return [
		baseText,
		baseText.replaceAll('\n', '\r\n'),
		baseText.replace('Assets:Cash USD, EUR', 'Assets:Cash USD,'),
		baseText.replace('500.123 USD', '500.'),
		baseText.replace('"/账单/一月.pdf"', '"/账单/一'),
		baseText.replace('"午餐 🥟"', '"午餐 🥟'),
		baseText.replace('"位置" "上海"', '"位置" "上'),
		baseText.replace('"SELECT *"', '"SELECT'),
		baseText.replace('"Payee" "Narration"', '"Payee" "Nar'),
		`${baseText.slice(0, 155)}x${baseText.slice(155)}`,
	];
}

describe('document symbol node collection equivalence', () => {
	it('matches the previous query selection in complete and incomplete documents', async () => {
		for (const [version, text] of editingStates().entries()) {
			const tree = parser.parse(text);
			const document = TextDocument.create(`file:///symbols-${version}.bean`, 'beancount', version + 1, text);
			const feature = new DocumentSymbolsFeature(
				{} as never,
				{ getParseTree: vi.fn().mockResolvedValue(tree) } as never,
			) as unknown as FeatureInternals;

			const expected = legacySymbols(feature, tree);
			const actual = await feature.getDocumentSymbols(document);

			expect(actual, `editing state ${version}`).toEqual(expected);
			tree.delete();
		}
	});
});
