import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

const mocks = vi.hoisted(() => {
	return {
		findTransactionsIntersectingRange: vi.fn(),
		findAllTransactions: vi.fn(),
	};
});

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));

vi.mock('../../common/utils/ast-utils', () => ({
	findTransactionsIntersectingRange: mocks.findTransactionsIntersectingRange,
	findAllTransactions: mocks.findAllTransactions,
}));

import { InlayHintFeature } from '../../common/features/inlay-hints';

type MockNode = {
	type: string;
	text: string;
	startPosition: { row: number; column: number };
	endPosition: { row: number; column: number };
	children: MockNode[];
	childForFieldName: (name: string) => MockNode | null;
};

function createLeaf(type: string, text: string, row: number, column: number): MockNode {
	return {
		type,
		text,
		startPosition: { row, column },
		endPosition: { row, column: column + text.length },
		children: [],
		childForFieldName: () => null,
	};
}

function createAmountNode(numberText: string, currencyText: string, row: number, numberColumn: number): MockNode {
	const numberNode = createLeaf('number', numberText, row, numberColumn);
	const currencyNode = createLeaf('currency', currencyText, row, numberColumn + numberText.length + 1);
	return {
		type: 'incomplete_amount',
		text: `${numberText} ${currencyText}`,
		startPosition: numberNode.startPosition,
		endPosition: currencyNode.endPosition,
		children: [numberNode, currencyNode],
		childForFieldName: () => null,
	};
}

function createPostingNode(row: number, accountText: string, amountText?: { number: string; currency: string; column: number }): MockNode {
	const accountColumn = 2;
	const accountNode = createLeaf('account', accountText, row, accountColumn);
	const amountNode = amountText
		? createAmountNode(amountText.number, amountText.currency, row, amountText.column)
		: null;
	return {
		type: 'posting',
		text: amountNode ? `${accountText} ${amountNode.text}` : accountText,
		startPosition: accountNode.startPosition,
		endPosition: amountNode?.endPosition ?? accountNode.endPosition,
		children: [],
		childForFieldName: (name: string) => {
			switch (name) {
				case 'account':
					return accountNode;
				case 'amount':
					return amountNode;
				default:
					return null;
			}
		},
	};
}

describe('InlayHintFeature', () => {
	beforeEach(() => {
		mocks.findTransactionsIntersectingRange.mockReset();
		mocks.findAllTransactions.mockReset();
	});

	it('uses range-scoped transaction helper instead of full-document helper', async () => {
		const document = TextDocument.create(
			'file:///inlay.bean',
			'beancount',
			1,
			[
				'2024-01-01 * "Lunch"',
				'  Assets:Cash  -10.00 USD',
				'  Expenses:Food',
			].join('\n'),
		);
		const range = Range.create(0, 0, 2, 16);
		const tree = { rootNode: {} };
		mocks.findTransactionsIntersectingRange.mockResolvedValue([]);

		const feature = new InlayHintFeature({} as never, {} as never);
		const provideInlayHints = (feature as any).provideInlayHints.bind(feature);
		await provideInlayHints(document, range, tree);

		expect(mocks.findTransactionsIntersectingRange).toHaveBeenCalledWith(tree, document, range);
		expect(mocks.findAllTransactions).not.toHaveBeenCalled();
	});

	it('produces hint for transaction with exactly one incomplete posting', async () => {
		const document = TextDocument.create(
			'file:///inlay.bean',
			'beancount',
			1,
			[
				'2024-01-01 * "Lunch"',
				'  Assets:Cash  -10.00 USD',
				'  Expenses:Food',
			].join('\n'),
		);
		const range = Range.create(0, 0, 2, 16);
		const transaction = {
			node: {} as never,
			date: '2024-01-01',
			flag: '*',
			headerRange: Range.create(0, 0, 0, 20),
			postings: [
				{
					node: createPostingNode(1, 'Assets:Cash', { number: '-10.00', currency: 'USD', column: 15 }),
					account: 'Assets:Cash',
					amount: { number: '-10.00', currency: 'USD' },
				},
				{
					node: createPostingNode(2, 'Expenses:Food'),
					account: 'Expenses:Food',
				},
			],
		};
		mocks.findTransactionsIntersectingRange.mockResolvedValue([transaction]);

		const feature = new InlayHintFeature({} as never, {} as never);
		const provideInlayHints = (feature as any).provideInlayHints.bind(feature);
		const hints = await provideInlayHints(document, range, { rootNode: {} });

		expect(hints).toHaveLength(1);
		expect(hints[0]?.label).toBe(' 10.00 USD');
		expect(hints[0]?.position).toEqual({ line: 2, character: 15 });
	});

	it('does not produce hint when no posting is incomplete', async () => {
		const document = TextDocument.create(
			'file:///inlay.bean',
			'beancount',
			1,
			[
				'2024-01-01 * "Lunch"',
				'  Assets:Cash  -10.00 USD',
				'  Expenses:Food  10.00 USD',
			].join('\n'),
		);
		const range = Range.create(0, 0, 2, 24);
		const transaction = {
			node: {} as never,
			date: '2024-01-01',
			flag: '*',
			headerRange: Range.create(0, 0, 0, 20),
			postings: [
				{
					node: createPostingNode(1, 'Assets:Cash', { number: '-10.00', currency: 'USD', column: 15 }),
					account: 'Assets:Cash',
					amount: { number: '-10.00', currency: 'USD' },
				},
				{
					node: createPostingNode(2, 'Expenses:Food', { number: '10.00', currency: 'USD', column: 17 }),
					account: 'Expenses:Food',
					amount: { number: '10.00', currency: 'USD' },
				},
			],
		};
		mocks.findTransactionsIntersectingRange.mockResolvedValue([transaction]);

		const feature = new InlayHintFeature({} as never, {} as never);
		const provideInlayHints = (feature as any).provideInlayHints.bind(feature);
		const hints = await provideInlayHints(document, range, { rootNode: {} });

		expect(hints).toEqual([]);
	});

	it('does not produce hint when empty cost is present', async () => {
		const document = TextDocument.create(
			'file:///inlay.bean',
			'beancount',
			1,
			[
				'2024-01-01 * "Lunch"',
				'  Assets:Cash  -10.00 USD',
				'  Expenses:Food',
			].join('\n'),
		);
		const range = Range.create(0, 0, 2, 16);
		const transaction = {
			node: {} as never,
			date: '2024-01-01',
			flag: '*',
			headerRange: Range.create(0, 0, 0, 20),
			postings: [
				{
					node: createPostingNode(1, 'Assets:Cash', { number: '-10.00', currency: 'USD', column: 15 }),
					account: 'Assets:Cash',
					amount: { number: '-10.00', currency: 'USD' },
					cost: { number: '', currency: '' },
				},
				{
					node: createPostingNode(2, 'Expenses:Food'),
					account: 'Expenses:Food',
				},
			],
		};
		mocks.findTransactionsIntersectingRange.mockResolvedValue([transaction]);

		const feature = new InlayHintFeature({} as never, {} as never);
		const provideInlayHints = (feature as any).provideInlayHints.bind(feature);
		const hints = await provideInlayHints(document, range, { rootNode: {} });

		expect(hints).toEqual([]);
	});

	it('preserves merged label formatting for multi-currency imbalance', async () => {
		const document = TextDocument.create(
			'file:///inlay.bean',
			'beancount',
			1,
			[
				'2024-01-01 * "Split"',
				'  Assets:Cash  -10.00 USD',
				'  Liabilities:Card  -5.00 EUR',
				'  Expenses:Mixed',
			].join('\n'),
		);
		const range = Range.create(0, 0, 3, 16);
		const transaction = {
			node: {} as never,
			date: '2024-01-01',
			flag: '*',
			headerRange: Range.create(0, 0, 0, 20),
			postings: [
				{
					node: createPostingNode(1, 'Assets:Cash', { number: '-10.00', currency: 'USD', column: 15 }),
					account: 'Assets:Cash',
					amount: { number: '-10.00', currency: 'USD' },
				},
				{
					node: createPostingNode(2, 'Liabilities:Card', { number: '-5.00', currency: 'EUR', column: 20 }),
					account: 'Liabilities:Card',
					amount: { number: '-5.00', currency: 'EUR' },
				},
				{
					node: createPostingNode(3, 'Expenses:Mixed'),
					account: 'Expenses:Mixed',
				},
			],
		};
		mocks.findTransactionsIntersectingRange.mockResolvedValue([transaction]);

		const feature = new InlayHintFeature({} as never, {} as never);
		const provideInlayHints = (feature as any).provideInlayHints.bind(feature);
		const hints = await provideInlayHints(document, range, { rootNode: {} });

		expect(hints).toHaveLength(1);
		expect(String(hints[0]?.label)).toContain('10.00 USD, 5.00 EUR');
		expect(hints[0]?.position).toEqual({ line: 3, character: 16 });
	});
});
