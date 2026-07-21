import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { CodeLens, CodeLensParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import Parser from 'web-tree-sitter';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		error() {}
	},
}));

import { asLspRange } from '../../common/common';
import { CodeLensFeature } from '../../common/features/code-lens';

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

type CodeLensInternals = {
	provideCodeLenses(params: CodeLensParams): Promise<CodeLens[]>;
};

function lensAtEnd(range: ReturnType<typeof asLspRange>, data: CodeLens['data']): CodeLens {
	return { range: { start: range.end, end: range.end }, data };
}

function legacyCodeLenses(text: string, document: TextDocument): CodeLens[] {
	const tree = parser.parse(text);
	const openQuery = language.query('(open (account) @account_definition)');
	const padQuery = language.query('(pad) @pad');
	try {
		const accountLenses = openQuery.captures(tree.rootNode).flatMap(({ node: accountNode }) => {
			const open = accountNode.parent;
			return open?.type === 'open'
				? [lensAtEnd(asLspRange(open), {
					kind: 'accountBalance',
					accountName: accountNode.text,
					uri: document.uri,
				})]
				: [];
		});
		const filePath = URI.parse(document.uri).fsPath;
		const padLenses = padQuery.captures(tree.rootNode).map(({ node: pad }) => {
			const fromAccount = pad.childForFieldName('from_account');
			const range = asLspRange(fromAccount ?? pad);
			return lensAtEnd(range, {
				kind: 'pad',
				uri: document.uri,
				filePath,
				line: range.start.line,
			});
		});
		return [...accountLenses, ...padLenses];
	} finally {
		openQuery.delete();
		padQuery.delete();
		tree.delete();
	}
}

const baseText = [
	'2000-01-01 open Assets:Cash USD',
	'2000-01-02 open Assets:Bank EUR',
	'2000-01-03 pad Assets:Cash Equity:Opening-Balances',
	'2000-01-04 * "午餐 🥟"',
	'  Assets:Cash  -1 USD',
	'  Expenses:Food  1 USD',
].join('\n');

describe('CodeLens node collection equivalence', () => {
	it('matches the previous query output across incomplete edits', async () => {
		const states = [
			baseText,
			baseText.replaceAll('\n', '\r\n'),
			baseText.replace('Assets:Cash USD', 'Assets:Cash US'),
			baseText.replace('Assets:Bank EUR', 'Assets:Ba'),
			baseText.replace('Equity:Opening-Balances', 'Equity:'),
			`${baseText.slice(0, 105)}x${baseText.slice(105)}`,
		];

		for (const [version, text] of states.entries()) {
			const document = TextDocument.create(`file:///code-lens-${version}.bean`, 'beancount', version + 1, text);
			const tree = parser.parse(text);
			const feature = new CodeLensFeature(
				{ retrieve: vi.fn().mockResolvedValue(document) } as never,
				{
					withParseTree: vi.fn((_document, callback) => callback(tree)),
				} as never,
			) as unknown as CodeLensInternals;

			const actual = await feature.provideCodeLenses({ textDocument: { uri: document.uri } });

			expect(actual, `editing state ${version}`).toEqual(legacyCodeLenses(text, document));
			tree.delete();
		}
	});
});
