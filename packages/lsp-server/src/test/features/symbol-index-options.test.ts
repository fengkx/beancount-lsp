import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from 'web-tree-sitter';

const mocks = vi.hoisted(() => ({ matches: vi.fn() }));

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));

vi.mock('../../common/language', () => ({
	TreeQuery: {
		getQueryByTokenName: () => ({ matches: mocks.matches }),
	},
}));

import { SymbolIndex } from '../../common/features/symbol-index';
import { BeancountOptionsManager } from '../../common/utils/beancount-options';

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

type SymbolIndexInternals = {
	_processOptionsDirectives(document: TextDocument): Promise<void>;
	_doIndex(document: TextDocument): Promise<void>;
};

function legacyOptions(text: string): Map<string, string> {
	const tree = parser.parse(text);
	const query = language.query('(option) @option');
	const options = new Map<string, string>();
	try {
		for (const { node } of query.captures(tree.rootNode)) {
			const keyNode = node.childForFieldName('key');
			const valueNode = node.childForFieldName('value');
			if (!keyNode || !valueNode) continue;
			options.set(
				keyNode.text.replace(/^"(.*)"$/, '$1'),
				valueNode.text.replace(/^"(.*)"$/, '$1'),
			);
		}
		return options;
	} finally {
		query.delete();
		tree.delete();
	}
}

const baseText = [
	'option "name_assets" "Actifs"',
	'option "name_income" "Revenus"',
	'2000-01-01 open Actifs:Cash USD',
].join('\n');

describe('SymbolIndex option extraction', () => {
	it('shares one parse tree per run and skips repeated extraction for the same tree', async () => {
		mocks.matches.mockResolvedValue([]);
		const document = TextDocument.create('file:///single-tree.bean', 'beancount', 1, '');
		const tree = parser.parse('');
		const nextTree = parser.parse('');
		const withParseTree = vi.fn()
			.mockImplementationOnce((_document, callback) => callback(tree))
			.mockImplementationOnce((_document, callback) => callback(tree))
			.mockImplementationOnce((_document, callback) => callback(nextTree));
		const replaceAsync = vi.fn().mockResolvedValue([]);
		const index = new SymbolIndex(
			{} as never,
			{ withParseTree } as never,
			{ replaceAsync } as never,
			new BeancountOptionsManager(),
		) as unknown as SymbolIndexInternals;

		await index._doIndex(document);
		await index._doIndex(document);
		await index._doIndex(document);

		expect(withParseTree).toHaveBeenCalledTimes(3);
		expect(mocks.matches).toHaveBeenCalledTimes(2);
		expect(replaceAsync).toHaveBeenCalledTimes(2);
		tree.delete();
		nextTree.delete();
	});

	it('matches query behavior across incomplete edits', async () => {
		const states = [
			baseText,
			baseText.replaceAll('\n', '\r\n'),
			baseText.replace('"Revenus"', '"Rev'),
			baseText.replace('"Actifs"', '"Actifs-中"'),
			`${baseText.slice(0, 48)}x${baseText.slice(48)}`,
		];

		for (const [version, text] of states.entries()) {
			const uri = `file:///options-${version}.bean`;
			const document = TextDocument.create(uri, 'beancount', version + 1, text);
			const tree = parser.parse(text);
			const actualManager = new BeancountOptionsManager();
			const expectedManager = new BeancountOptionsManager();
			expectedManager.replaceOptionsForSource(uri, legacyOptions(text));
			const index = new SymbolIndex(
				{} as never,
				{
					withParseTree: vi.fn((_document, callback) => callback(tree)),
				} as never,
				{} as never,
				actualManager,
			) as unknown as SymbolIndexInternals;

			await index._processOptionsDirectives(document);

			expect(actualManager.getValidRootAccounts(uri), `editing state ${version}`)
				.toEqual(expectedManager.getValidRootAccounts(uri));
			tree.delete();
		}
	});
});
