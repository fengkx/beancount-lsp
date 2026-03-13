import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Range } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

const mocks = vi.hoisted(() => {
	return {
		captures: vi.fn(),
		getQueryByTokenName: vi.fn(),
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

vi.mock('../../common/language', () => ({
	TreeQuery: {
		getQueryByTokenName: mocks.getQueryByTokenName,
	},
}));

import { findTransactionsIntersectingRange, parseCostSpec } from '../../common/utils/ast-utils';

type MockNode = {
	id: number;
	type: string;
	text: string;
	startIndex: number;
	endIndex: number;
	startPosition: { row: number; column: number };
	endPosition: { row: number; column: number };
	parent: MockNode | null;
	childCount: number;
	child: (index: number) => MockNode | null;
	namedChildCount: number;
	namedChild: (index: number) => MockNode | null;
	childForFieldName: (name: string) => MockNode | null;
	descendantForIndex?: (index: number) => MockNode;
};

type Fixture = {
	document: TextDocument;
	tree: { rootNode: MockNode };
	root: MockNode;
	txn1: MockNode;
	txn2: MockNode;
	tx1Posting1: MockNode;
	tx1Posting2: MockNode;
	tx2Posting1: MockNode;
	tx2Posting2: MockNode;
};

let nextNodeId = 1;

function nthIndexOf(text: string, needle: string, occurrence = 0): number {
	let fromIndex = 0;
	let result = -1;
	for (let i = 0; i <= occurrence; i++) {
		result = text.indexOf(needle, fromIndex);
		if (result < 0) {
			throw new Error(`Needle not found: ${needle}#${occurrence}`);
		}
		fromIndex = result + needle.length;
	}
	return result;
}

function createFixture(): Fixture {
	const text = [
		'2024-01-01 * "Store"',
		'  Assets:Cash:Wallet',
		'  Expenses:Food  10 USD',
		'',
		'2024-01-02 * "Cafe"',
		'  Assets:Cash:Card',
		'  Expenses:Coffee  20 USD',
	].join('\n');
	const document = TextDocument.create('file:///fixture.bean', 'beancount', 1, text);

	function point(index: number) {
		const position = document.positionAt(index);
		return { row: position.line, column: position.character };
	}

	function createNode(config: {
		type: string;
		text: string;
		startIndex: number;
		endIndex?: number;
		fields?: Record<string, MockNode | null | undefined>;
		namedChildren?: MockNode[];
		children?: MockNode[];
	}): MockNode {
		const namedChildren = [...(config.namedChildren ?? [])];
		const children = [...(config.children ?? namedChildren)];
		const fields = config.fields ?? {};
		const node: MockNode = {
			id: nextNodeId++,
			type: config.type,
			text: config.text,
			startIndex: config.startIndex,
			endIndex: config.endIndex ?? (config.startIndex + config.text.length),
			startPosition: point(config.startIndex),
			endPosition: point(config.endIndex ?? (config.startIndex + config.text.length)),
			parent: null,
			childCount: children.length,
			child: (index: number) => children[index] ?? null,
			namedChildCount: namedChildren.length,
			namedChild: (index: number) => namedChildren[index] ?? null,
			childForFieldName: (name: string) => fields[name] ?? null,
		};
		for (const child of children) {
			child.parent = node;
		}
		for (const fieldNode of Object.values(fields)) {
			if (fieldNode) {
				fieldNode.parent = node;
			}
		}
		return node;
	}

	function createLeaf(type: string, snippet: string, occurrence = 0): MockNode {
		const startIndex = nthIndexOf(text, snippet, occurrence);
		return createNode({
			type,
			text: snippet,
			startIndex,
		});
	}

	function createAmountNode(snippet: string, numberText: string, currencyText: string, occurrence = 0): MockNode {
		const amountStart = nthIndexOf(text, snippet, occurrence);
		const numberStart = amountStart + snippet.indexOf(numberText);
		const currencyStart = amountStart + snippet.lastIndexOf(currencyText);
		const numberNode = createNode({
			type: 'number',
			text: numberText,
			startIndex: numberStart,
		});
		const currencyNode = createNode({
			type: 'currency',
			text: currencyText,
			startIndex: currencyStart,
		});
		return createNode({
			type: 'incomplete_amount',
			text: snippet,
			startIndex: amountStart,
			namedChildren: [numberNode, currencyNode],
			children: [numberNode, currencyNode],
		});
	}

	const tx1Date = createLeaf('date', '2024-01-01');
	const tx1Txn = createLeaf('txn', '*');
	const tx1Account1 = createLeaf('account', 'Assets:Cash:Wallet');
	const tx1Account2 = createLeaf('account', 'Expenses:Food');
	const tx1Amount2 = createAmountNode('10 USD', '10', 'USD');

	const tx2Date = createLeaf('date', '2024-01-02');
	const tx2Txn = createLeaf('txn', '*', 1);
	const tx2Account1 = createLeaf('account', 'Assets:Cash:Card');
	const tx2Account2 = createLeaf('account', 'Expenses:Coffee');
	const tx2Amount2 = createAmountNode('20 USD', '20', 'USD');

	const tx1Posting1Start = nthIndexOf(text, '  Assets:Cash:Wallet');
	const tx1Posting1 = createNode({
		type: 'posting',
		text: '  Assets:Cash:Wallet',
		startIndex: tx1Posting1Start,
		fields: {
			account: tx1Account1,
		},
	});
	const tx1Posting2Start = nthIndexOf(text, '  Expenses:Food  10 USD');
	const tx1Posting2 = createNode({
		type: 'posting',
		text: '  Expenses:Food  10 USD',
		startIndex: tx1Posting2Start,
		fields: {
			account: tx1Account2,
			amount: tx1Amount2,
		},
	});

	const tx2Posting1Start = nthIndexOf(text, '  Assets:Cash:Card');
	const tx2Posting1 = createNode({
		type: 'posting',
		text: '  Assets:Cash:Card',
		startIndex: tx2Posting1Start,
		fields: {
			account: tx2Account1,
		},
	});
	const tx2Posting2Start = nthIndexOf(text, '  Expenses:Coffee  20 USD');
	const tx2Posting2 = createNode({
		type: 'posting',
		text: '  Expenses:Coffee  20 USD',
		startIndex: tx2Posting2Start,
		fields: {
			account: tx2Account2,
			amount: tx2Amount2,
		},
	});

	const txn1Start = nthIndexOf(text, '2024-01-01 * "Store"');
	const txn1End = tx1Posting2Start + '  Expenses:Food  10 USD'.length;
	const txn1 = createNode({
		type: 'transaction',
		text: text.slice(txn1Start, txn1End),
		startIndex: txn1Start,
		endIndex: txn1End,
		fields: {
			date: tx1Date,
			txn: tx1Txn,
		},
		namedChildren: [tx1Posting1, tx1Posting2],
	});

	const txn2Start = nthIndexOf(text, '2024-01-02 * "Cafe"');
	const txn2End = tx2Posting2Start + '  Expenses:Coffee  20 USD'.length;
	const txn2 = createNode({
		type: 'transaction',
		text: text.slice(txn2Start, txn2End),
		startIndex: txn2Start,
		endIndex: txn2End,
		fields: {
			date: tx2Date,
			txn: tx2Txn,
		},
		namedChildren: [tx2Posting1, tx2Posting2],
	});

	const root = createNode({
		type: 'source_file',
		text,
		startIndex: 0,
		endIndex: text.length,
		children: [txn1, txn2],
	});

	root.descendantForIndex = (index: number) => {
		if (index >= tx1Posting1.startIndex && index < tx1Posting1.endIndex) return tx1Posting1;
		if (index >= tx1Posting2.startIndex && index < tx1Posting2.endIndex) return tx1Posting2;
		if (index >= tx2Posting1.startIndex && index < tx2Posting1.endIndex) return tx2Posting1;
		if (index >= tx2Posting2.startIndex && index < tx2Posting2.endIndex) return tx2Posting2;
		if (index >= txn1.startIndex && index < txn1.endIndex) return txn1;
		if (index >= txn2.startIndex && index < txn2.endIndex) return txn2;
		return root;
	};

	return {
		document,
		tree: { rootNode: root },
		root,
		txn1,
		txn2,
		tx1Posting1,
		tx1Posting2,
		tx2Posting1,
		tx2Posting2,
	};
}

describe('findTransactionsIntersectingRange', () => {
	it('parses empty cost spec as an explicit empty cost', () => {
		const costCompListNode: MockNode = {
			id: nextNodeId++,
			type: 'cost_comp_list',
			text: '',
			startIndex: 0,
			endIndex: 0,
			startPosition: { row: 0, column: 0 },
			endPosition: { row: 0, column: 0 },
			parent: null,
			childCount: 0,
			child: () => null,
			namedChildCount: 0,
			namedChild: () => null,
			childForFieldName: () => null,
		};
		const costSpecNode: MockNode = {
			id: nextNodeId++,
			type: 'cost_spec',
			text: '{}',
			startIndex: 0,
			endIndex: 2,
			startPosition: { row: 0, column: 0 },
			endPosition: { row: 0, column: 2 },
			parent: null,
			childCount: 1,
			child: (index: number) => index === 0 ? costCompListNode : null,
			namedChildCount: 1,
			namedChild: (index: number) => index === 0 ? costCompListNode : null,
			childForFieldName: (name: string) => name === 'cost_comp_list' ? costCompListNode : null,
		};

		expect(parseCostSpec(costSpecNode as never)).toEqual({
			number: '',
			currency: '',
			isTotalCost: false,
		});
	});

	beforeEach(() => {
		mocks.captures.mockReset();
		mocks.getQueryByTokenName.mockReset();
		mocks.getQueryByTokenName.mockReturnValue({
			captures: mocks.captures,
		});
	});

	it('returns only intersecting transactions', async () => {
		const fixture = createFixture();
		mocks.captures.mockResolvedValue([
			{ node: fixture.txn1 },
			{ node: fixture.txn2 },
		]);

		const range = Range.create(1, 0, 1, 10);
		const result = await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, range);

		expect(result).toHaveLength(1);
		expect(result[0]?.node.id).toBe(fixture.txn1.id);
	});

	it('includes boundary transaction when range starts inside posting', async () => {
		const fixture = createFixture();
		mocks.captures.mockResolvedValue([]);

		const range = Range.create(1, 4, 1, 10);
		const result = await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, range);

		expect(result).toHaveLength(1);
		expect(result[0]?.node.id).toBe(fixture.txn1.id);
	});

	it('includes boundary transaction when range ends inside posting', async () => {
		const fixture = createFixture();
		mocks.captures.mockResolvedValue([]);

		const range = Range.create(3, 0, 5, 8);
		const result = await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, range);

		expect(result).toHaveLength(1);
		expect(result[0]?.node.id).toBe(fixture.txn2.id);
	});

	it('deduplicates transactions found by both query and ancestor recovery', async () => {
		const fixture = createFixture();
		mocks.captures.mockResolvedValue([{ node: fixture.txn1 }]);

		const range = Range.create(1, 1, 1, 8);
		const result = await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, range);

		expect(result).toHaveLength(1);
		expect(result[0]?.node.id).toBe(fixture.txn1.id);
	});

	it('materializes complete transaction postings', async () => {
		const fixture = createFixture();
		mocks.captures.mockResolvedValue([{ node: fixture.txn1 }]);

		const range = Range.create(1, 0, 1, 8);
		const [transaction] = await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, range);

		expect(transaction?.postings).toHaveLength(2);
		expect(transaction?.postings[0]?.account).toBe('Assets:Cash:Wallet');
		expect(transaction?.postings[0]?.amount).toBeUndefined();
		expect(transaction?.postings[1]?.account).toBe('Expenses:Food');
		expect(transaction?.postings[1]?.amount).toEqual({ number: '10', currency: 'USD' });
	});

	it('sorts results by transaction startIndex', async () => {
		const fixture = createFixture();
		mocks.captures.mockResolvedValue([
			{ node: fixture.txn2 },
			{ node: fixture.txn1 },
		]);

		const range = Range.create(0, 0, 6, 24);
		const result = await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, range);

		expect(result.map(transaction => transaction.node.id)).toEqual([fixture.txn1.id, fixture.txn2.id]);
	});

	it('uses range-specific cache keys', async () => {
		const fixture = createFixture();
		mocks.captures.mockResolvedValue([{ node: fixture.txn1 }]);

		const firstRange = Range.create(0, 0, 2, 5);
		const secondRange = Range.create(4, 0, 6, 5);

		await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, firstRange);
		await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, firstRange);
		await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, secondRange);

		expect(mocks.captures).toHaveBeenCalledTimes(2);
	});

	it('passes request range to tree-sitter query unchanged', async () => {
		const fixture = createFixture();
		mocks.captures.mockResolvedValue([]);

		const range = Range.create(1, 4, 2, 6);
		await findTransactionsIntersectingRange(fixture.tree as never, fixture.document, range);

		expect(mocks.captures).toHaveBeenCalledWith(
			fixture.tree,
			{ row: 1, column: 4 },
			{ row: 2, column: 6 },
		);
	});
});
