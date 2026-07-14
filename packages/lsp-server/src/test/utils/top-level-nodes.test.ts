import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import Parser from 'web-tree-sitter';
import { getRecoverableTopLevelNodes } from '../../common/utils/top-level-nodes';

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

function queryNodes(text: string, querySource: string, useParent = false) {
	const tree = parser.parse(text);
	const query = language.query(querySource);
	try {
		return query.captures(tree.rootNode).flatMap(({ node }) => {
			const result = useParent ? node.parent : node;
			return result
				? [{
					type: result.type,
					text: result.text,
					startIndex: result.startIndex,
					endIndex: result.endIndex,
				}]
				: [];
		});
	} finally {
		query.delete();
		tree.delete();
	}
}

const baseText = [
	'option "name_assets" "Actifs"',
	'2000-01-01 open Assets:Cash USD',
	'2000-01-02 pad Assets:Cash Equity:Opening-Balances',
	'2000-01-03 * "午餐 🥟"',
	'  Assets:Cash  -1 USD',
	'  Expenses:Food  1 USD',
].join('\n');

describe('getRecoverableTopLevelNodes', () => {
	it('matches query selection across complete and incomplete middle edits', () => {
		const states = [
			baseText,
			baseText.replaceAll('\n', '\r\n'),
			baseText.replace('"Actifs"', '"Act'),
			baseText.replace('Assets:Cash USD', 'Assets:Cash US'),
			baseText.replace('Equity:Opening-Balances', 'Equity:'),
			`${baseText.slice(0, 76)}x${baseText.slice(76)}`,
		];
		const cases = [
			{ type: 'option', query: '(option) @node', useParent: false },
			{ type: 'open', query: '(open (account) @node)', useParent: true },
			{ type: 'pad', query: '(pad) @node', useParent: false },
		];

		for (const [version, text] of states.entries()) {
			const tree = parser.parse(text);
			for (const { type, query, useParent } of cases) {
				const expected = queryNodes(text, query, useParent);
				const actual = getRecoverableTopLevelNodes(tree, type).map(node => ({
					type: node.type,
					text: node.text,
					startIndex: node.startIndex,
					endIndex: node.endIndex,
				}));
				expect(actual, `${type} editing state ${version}`).toEqual(expected);
			}
			tree.delete();
		}
	});

	it('reuses the tree-scoped result', () => {
		const tree = parser.parse(baseText);
		expect(getRecoverableTopLevelNodes(tree, 'open'))
			.toBe(getRecoverableTopLevelNodes(tree, 'open'));
		tree.delete();
	});
});
