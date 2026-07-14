import DataStore from '@bean-lsp/storage';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from 'web-tree-sitter';

const mocks = vi.hoisted(() => ({ matches: vi.fn() }));

vi.mock('../../common/language', () => ({
	TreeQuery: {
		getQueryByTokenName: () => ({ matches: mocks.matches }),
	},
}));

import { getSymbolsFromTree, type SymbolInfo, SymbolKey, SymbolType } from '../../common/features/symbol-extractors';

let parser: Parser;
let symbolsQuery: Parser.Query;

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
	const querySource = readFileSync(
		fileURLToPath(new URL('../../common/language/queries/symbols.scm', import.meta.url)),
		'utf8',
	);
	symbolsQuery = language.query(querySource);
	mocks.matches.mockImplementation(async tree => symbolsQuery.matches(tree.rootNode));
});

function createStore(): DataStore<SymbolInfo> {
	const store = new DataStore<SymbolInfo>();
	store.ensureIndexAsync('_uri');
	store.ensureIndexAsync(SymbolKey.TYPE);
	store.ensureIndexAsync('name');
	return store;
}

function normalize(documents: Array<SymbolInfo & { _id?: string }>): string[] {
	return documents
		.map(({ _id: _, ...document }) => JSON.stringify(document))
		.sort();
}

const baseText = Array.from({ length: 50 }, (_, index) =>
	[
		`2000-01-01 open Assets:Account${index} USD`,
		`2000-01-02 * "Payee ${index}" "Narration ${index}" #tag${index} ^link${index}`,
		`  Assets:Account${index}  -1 USD`,
		`  Expenses:Food  1 USD`,
	].join('\n')).join('\n');

describe('incremental symbol storage replacement', () => {
	it('matches full removal and insertion across middle editing states', async () => {
		const states = [
			baseText,
			baseText.replace('"Payee 25"', '"中间编辑 🥟"'),
			baseText.replace('Assets:Account25  -1 USD', 'Assets:Acc'),
			baseText.replace('#tag25', '#tag'),
			baseText.replace('"Narration 25"', '"Narration'),
			`${baseText.slice(0, Math.floor(baseText.length / 2))}\n${baseText.slice(Math.floor(baseText.length / 2))}`,
			baseText.replaceAll('\n', '\r\n'),
		];
		const baseline = createStore();
		const optimized = createStore();

		for (const [version, text] of states.entries()) {
			const uri = 'file:///large-editing.bean';
			const document = TextDocument.create(uri, 'beancount', version + 1, text);
			const tree = parser.parse(text);
			const symbols = await getSymbolsFromTree(document, tree);

			baseline.removeSync({ _uri: uri });
			await baseline.insertAsync(symbols);
			await optimized.replaceAsync({ _uri: uri }, symbols, symbol => symbol.name);

			expect(normalize(await optimized.getAllAsync()), `all documents at state ${version}`)
				.toEqual(normalize(await baseline.getAllAsync()));
			for (const type of Object.values(SymbolType)) {
				if (typeof type !== 'number') continue;
				expect(
					normalize(await optimized.findAsync({ _uri: uri, [SymbolKey.TYPE]: type })),
					`type ${type} at state ${version}`,
				).toEqual(normalize(await baseline.findAsync({ _uri: uri, [SymbolKey.TYPE]: type })));
			}
			for (const name of ['USD', 'Assets:Account25', 'tag25']) {
				expect(normalize(await optimized.findAsync({ _uri: uri, name })), `${name} at state ${version}`)
					.toEqual(normalize(await baseline.findAsync({ _uri: uri, name })));
			}
			tree.delete();
		}
	});

	it('reuses almost all IDs after a Unicode edit in the middle of a large file', async () => {
		const text = Array.from({ length: 500 }, (_, index) =>
			[
				`2000-01-01 open Assets:Account${index} USD`,
				`2000-01-02 * "Payee ${index}" "Narration ${index}" #tag${index}`,
				`  Assets:Account${index}  -1 USD`,
				`  Expenses:Food  1 USD`,
			].join('\n')).join('\n');
		const oldFragment = 'Narration 250';
		const newFragment = '中间编辑 🥟';
		const startIndex = text.indexOf(oldFragment);
		const updatedText = `${text.slice(0, startIndex)}${newFragment}${text.slice(startIndex + oldFragment.length)}`;
		const originalDocument = TextDocument.create('file:///incremental-large.bean', 'beancount', 1, text);
		const updatedDocument = TextDocument.create('file:///incremental-large.bean', 'beancount', 2, updatedText);
		const oldTree = parser.parse(text);
		const originalSymbols = await getSymbolsFromTree(originalDocument, oldTree);
		const store = createStore();
		const initialDocuments = await store.insertAsync(originalSymbols);

		const asPoint = (document: TextDocument, offset: number) => {
			const position = document.positionAt(offset);
			return { row: position.line, column: position.character };
		};
		oldTree.edit({
			startIndex,
			oldEndIndex: startIndex + oldFragment.length,
			newEndIndex: startIndex + newFragment.length,
			startPosition: asPoint(originalDocument, startIndex),
			oldEndPosition: asPoint(originalDocument, startIndex + oldFragment.length),
			newEndPosition: asPoint(updatedDocument, startIndex + newFragment.length),
		});
		const incrementalTree = parser.parse(updatedText, oldTree);
		const fullTree = parser.parse(updatedText);
		const incrementalSymbols = await getSymbolsFromTree(updatedDocument, incrementalTree);
		const fullSymbols = await getSymbolsFromTree(updatedDocument, fullTree);

		expect(normalize(incrementalSymbols)).toEqual(normalize(fullSymbols));
		const replacements = await store.replaceAsync(
			{ _uri: updatedDocument.uri },
			incrementalSymbols,
			symbol => symbol.name,
		);
		const initialIds = new Set(initialDocuments.map(document => document._id));
		const reusedCount = replacements.filter(document => initialIds.has(document._id)).length;
		expect(reusedCount / replacements.length).toBeGreaterThan(0.99);

		oldTree.delete();
		incrementalTree.delete();
		fullTree.delete();
	});
});
