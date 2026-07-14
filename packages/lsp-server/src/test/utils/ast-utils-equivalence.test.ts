import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Position, Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser, { type SyntaxNode, type Tree } from 'web-tree-sitter';

const mocks = vi.hoisted(() => ({
	captures: vi.fn(),
	matches: vi.fn(),
	getQueryByTokenName: vi.fn(),
}));

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
		getQueryByTokenName: mocks.getQueryByTokenName,
	},
}));

import {
	findAllTransactions,
	findChildByType,
	findTransactionsIntersectingRange,
	queryNodes,
} from '../../common/utils/ast-utils';

let parser: Parser;

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
});

beforeEach(() => {
	mocks.captures.mockReset();
	mocks.matches.mockReset();
	mocks.getQueryByTokenName.mockReset();
	mocks.getQueryByTokenName.mockReturnValue({
		captures: mocks.captures,
		matches: mocks.matches,
	});
});

function legacyQueryNodes(node: SyntaxNode, type: string): SyntaxNode[] {
	const nodes: SyntaxNode[] = [];
	function visit(current: SyntaxNode) {
		if (current.type === type) nodes.push(current);
		for (let index = 0; index < current.childCount; index++) {
			const child = current.child(index);
			if (child) visit(child);
		}
	}
	visit(node);
	return nodes;
}

function legacyFindChildByType(node: SyntaxNode, type: string): SyntaxNode | null {
	for (let index = 0; index < node.childCount; index++) {
		const child = node.child(index);
		if (child?.type === type) return child;
	}
	return null;
}

function legacyParseAmount(amountNode: SyntaxNode): { number: string; currency: string } | undefined {
	const numberNode = amountNode.namedChild(0);
	const currencyNode = amountNode.namedChild(1);
	return numberNode && currencyNode
		? { number: numberNode.text, currency: currencyNode.text }
		: undefined;
}

function legacyParseCost(costSpecNode: SyntaxNode) {
	const isTotalCost = costSpecNode.text.startsWith('{{') && costSpecNode.text.endsWith('}}');
	const costComponentRoot = costSpecNode.childForFieldName('cost_comp_list');
	if (!costComponentRoot) return { number: '', currency: '', isTotalCost };

	for (const component of legacyQueryNodes(costComponentRoot, 'cost_comp')) {
		const compoundAmountNode = legacyFindChildByType(component, 'compound_amount');
		const dateNode = legacyFindChildByType(component, 'date');
		if (!compoundAmountNode && !dateNode) continue;

		const perNode = compoundAmountNode?.childForFieldName('per');
		const currencyNode = compoundAmountNode?.childForFieldName('currency');
		if ((perNode && currencyNode) || dateNode) {
			return {
				number: perNode?.text,
				currency: currencyNode?.text,
				isTotalCost,
				date: dateNode?.text,
			};
		}
	}

	return { number: '', currency: '', isTotalCost };
}

function legacyParsePrice(priceNode: SyntaxNode, postingNode: SyntaxNode) {
	const amountNode = priceNode.namedChild(0);
	const amount = amountNode ? legacyParseAmount(amountNode) : undefined;
	if (!amount) return undefined;
	const atNode = legacyFindChildByType(postingNode, 'atat') || legacyFindChildByType(postingNode, 'at');
	return {
		type: atNode?.type === 'atat' ? '@@' as const : '@' as const,
		...amount,
	};
}

function legacyPosting(postingNode: SyntaxNode) {
	const accountNode = postingNode.childForFieldName('account');
	const amountNode = postingNode.childForFieldName('amount');
	const costNode = postingNode.childForFieldName('cost_spec');
	const priceNode = postingNode.childForFieldName('price_annotation');
	return {
		account: accountNode?.text ?? '',
		postingStartLine: postingNode.startPosition.row,
		accountEndPosition: accountNode
			? Position.create(accountNode.endPosition.row, accountNode.endPosition.column)
			: undefined,
		amountCurrencyColumn: amountNode?.children.find(child => child.type === 'currency')?.startPosition.column,
		amount: amountNode ? legacyParseAmount(amountNode) : undefined,
		cost: costNode ? legacyParseCost(costNode) : undefined,
		price: priceNode ? legacyParsePrice(priceNode, postingNode) : undefined,
	};
}

function legacyTransactions(tree: Tree) {
	return tree.rootNode.descendantsOfType('transaction').map((transactionNode) => {
		const postings = [];
		for (let index = 0; index < transactionNode.namedChildCount; index++) {
			const child = transactionNode.namedChild(index);
			if (child?.type === 'posting') postings.push(legacyPosting(child));
		}
		return {
			date: transactionNode.childForFieldName('date')?.text ?? '',
			flag: transactionNode.childForFieldName('txn')?.text,
			postings,
		};
	});
}

function queryMatches(tree: Tree) {
	return tree.rootNode.descendantsOfType('transaction').flatMap((transaction) => {
		const date = transaction.childForFieldName('date');
		const flag = transaction.childForFieldName('txn');
		return transaction.namedChildren
			.filter(child => child.type === 'posting')
			.map((posting) => {
				const captures = [
					{ name: 'transaction', node: transaction },
					...(date ? [{ name: 'date', node: date }] : []),
					...(flag ? [{ name: 'txn', node: flag }] : []),
					{ name: 'posting', node: posting },
				];
				for (
					const [name, field] of [
						['account', 'account'],
						['amount', 'amount'],
						['cost_spec', 'cost_spec'],
						['price', 'price_annotation'],
					] as const
				) {
					const node = posting.childForFieldName(field);
					if (node) captures.push({ name, node });
				}
				return { captures };
			});
	});
}

const baseText = [
	'2024-01-01 * "午餐 🥟"',
	'  Assets:Cash  -12.34 USD {45.23 EUR, 2014-01-15, "lot"} @@ 15.43 USD',
	'  Expenses:Food  12.34 USD',
	'',
	'2024-01-02 * "Total cost"',
	'  Assets:Investments  10 AAPL {{500.00 USD}} @ 51.00 USD',
	'  Assets:Cash',
	'',
	'2024-01-03 * "Empty and date costs"',
	'  Assets:Investments  1 HOOL {}',
	'  Assets:Investments  2 HOOL {2024-01-03}',
].join('\n');

function editingStates(): string[] {
	return [
		baseText,
		baseText.replaceAll('\n', '\r\n'),
		baseText.replace('Assets:Cash  -12.34', 'Assets:Ca  -12.34'),
		baseText.replace('-12.34 USD', '-12.'),
		baseText.replace('12.34 USD', '12.34 US'),
		baseText.replace('{45.23 EUR, 2014-01-15, "lot"}', '{45.'),
		baseText.replace('@@ 15.43 USD', '@@ 15.'),
		baseText.replace('500.00 USD', '500.00'),
		baseText.replace('"午餐 🥟"', '"午餐 🥟 mid-edit"'),
		`${baseText.slice(0, 90)}x${baseText.slice(90)}`,
	];
}

describe('AST utility traversal equivalence', () => {
	it('preserves public traversal helper ordering and direct-child semantics', () => {
		for (const text of editingStates()) {
			const tree = parser.parse(text);
			for (const type of ['transaction', 'posting', 'cost_comp', 'currency', 'ERROR']) {
				expect(queryNodes(tree.rootNode, type).map(node => node.id))
					.toEqual(legacyQueryNodes(tree.rootNode, type).map(node => node.id));
			}
			for (const node of legacyQueryNodes(tree.rootNode, 'posting')) {
				for (const type of ['account', 'at', 'atat', 'price_annotation', 'currency']) {
					expect(findChildByType(node, type)?.id).toBe(legacyFindChildByType(node, type)?.id);
				}
			}
			tree.delete();
		}
	});

	it('preserves materialized postings across realistic incomplete editing states', async () => {
		for (const [version, text] of editingStates().entries()) {
			const tree = parser.parse(text);
			const transactions = tree.rootNode.descendantsOfType('transaction');
			mocks.captures.mockResolvedValue(transactions.map(node => ({ node })));
			const document = TextDocument.create(`file:///editing-${version}.bean`, 'beancount', version + 1, text);
			const actual = await findTransactionsIntersectingRange(
				tree,
				document,
				Range.create(0, 0, document.lineCount, 0),
			);

			expect(actual.map(({ date, flag, postings }) => ({ date, flag, postings })), `editing state ${version}`)
				.toEqual(legacyTransactions(tree));
			tree.delete();
		}
	});

	it('preserves query-based full-document extraction while indexing captures once', async () => {
		const tree = parser.parse(baseText);
		mocks.matches.mockResolvedValue(queryMatches(tree));
		const document = TextDocument.create('file:///query.bean', 'beancount', 1, baseText);

		const actual = await findAllTransactions(tree, document);

		expect(actual.map(({ date, flag, postings }) => ({ date, flag, postings })))
			.toEqual(legacyTransactions(tree));
		tree.delete();
	});
});
