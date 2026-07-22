import { describe, expect, it, vi } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';

vi.mock('@bean-lsp/shared/logger', () => ({
	Logger: class {
		info() {}
	},
}));

vi.mock('../../common/language', () => ({
	TreeQuery: {
		getQueryByTokenName: vi.fn(),
	},
}));

import {
	addCurrencyCompletions,
	addLinkCompletions,
	addPayeesAndNarrations,
	addTagCompletions,
	type CompletionCollector,
} from '../../common/features/completions/completion-providers';
import { SymbolType } from '../../common/features/symbol-extractors';
import type { SymbolIndex } from '../../common/features/symbol-index';

type SymbolCompletionSnapshot = {
	items: string[];
	usageCounts: Map<string, number>;
};

function createCollector(
	snapshots: Map<number, SymbolCompletionSnapshot>,
	overrides: Partial<CompletionCollector['textCtx']> = {},
) {
	const snapshot = (type: number) => snapshots.get(type) ?? { items: [], usageCounts: new Map<string, number>() };
	const getPayees = vi.fn(async () => snapshot(SymbolType.PAYEE).items);
	const getNarrations = vi.fn(async () => snapshot(SymbolType.NARRATION).items);
	const getTags = vi.fn(async () => snapshot(SymbolType.TAG).items);
	const getLinks = vi.fn(async () => snapshot(SymbolType.LINK).items);
	const getCommodities = vi.fn(async () => snapshot(SymbolType.COMMODITY).items);
	const getPayeeUsageCounts = vi.fn(async () => snapshot(SymbolType.PAYEE).usageCounts);
	const getNarrationUsageCounts = vi.fn(async () => snapshot(SymbolType.NARRATION).usageCounts);
	const getTagUsageCounts = vi.fn(async () => snapshot(SymbolType.TAG).usageCounts);
	const getLinkUsageCounts = vi.fn(async () => snapshot(SymbolType.LINK).usageCounts);
	const getCommodityUsageCounts = vi.fn(async () => snapshot(SymbolType.COMMODITY).usageCounts);
	const symbolIndex = {
		getPayees,
		getNarrations,
		getTags,
		getLinks,
		getCommodities,
		getPayeeUsageCounts,
		getNarrationUsageCounts,
		getTagUsageCounts,
		getLinkUsageCounts,
		getCommodityUsageCounts,
		getFilterText: vi.fn((label: string) => label.toLowerCase()),
	} as unknown as SymbolIndex;
	const collector: CompletionCollector = {
		symbolIndex,
		position: { line: 0, character: 4 },
		existingCompletions: new Set(),
		completions: [],
		document: TextDocument.create('file:///workspace/main.bean', 'beancount', 1, ''),
		enablePinyin: true,
		textCtx: {
			linePrefix: '',
			tokenRange: { startChar: 0, endChar: 4 },
			tokenText: '',
			afterHash: false,
			afterCaret: false,
			...overrides,
		},
	};
	return {
		collector,
		getPayees,
		getNarrations,
		getTags,
		getLinks,
		getCommodities,
		getPayeeUsageCounts,
		getNarrationUsageCounts,
		getTagUsageCounts,
		getLinkUsageCounts,
		getCommodityUsageCounts,
	};
}

describe('completion provider symbol snapshots', () => {
	it('ranks tags by usage and adds the missing hash prefix', async () => {
		const { collector, getTags, getTagUsageCounts } = createCollector(
			new Map([
				[
					SymbolType.TAG,
					{ items: ['travel', 'tax'], usageCounts: new Map([['travel', 1], ['tax', 5]]) },
				],
			]),
		);

		await addTagCompletions(collector);

		expect(collector.completions.map(item => item.label)).toEqual(['tax', 'travel']);
		expect(collector.completions.map(item => item.textEdit)).toMatchObject([
			{ newText: '#tax' },
			{ newText: '#travel' },
		]);
		expect(getTags).toHaveBeenCalledWith('file:///workspace/main.bean');
		expect(getTagUsageCounts).toHaveBeenCalledWith('file:///workspace/main.bean');
	});

	it('uses payee and narration snapshots while preserving quoting and ranking', async () => {
		const { collector, getPayees, getNarrations, getPayeeUsageCounts, getNarrationUsageCounts } = createCollector(
			new Map([
				[
					SymbolType.PAYEE,
					{ items: ['Alice'], usageCounts: new Map([['Alice', 2]]) },
				],
				[
					SymbolType.NARRATION,
					{ items: ['Dinner'], usageCounts: new Map([['Dinner', 3]]) },
				],
			]),
		);

		await addPayeesAndNarrations(collector, {
			shouldIncludePayees: true,
			quotationStyle: 'both',
			addSpaceAfter: true,
		});

		expect(collector.completions.map(item => item.label)).toEqual(['Dinner', 'Alice']);
		expect(collector.completions.map(item => item.textEdit)).toMatchObject([
			{ newText: '"Dinner" ' },
			{ newText: '"Alice" ' },
		]);
		expect(getPayees).toHaveBeenCalledWith(
			true,
			{ waitTime: 100 },
			'file:///workspace/main.bean',
		);
		expect(getNarrations).toHaveBeenCalledWith(
			true,
			{ waitTime: 100 },
			'file:///workspace/main.bean',
		);
		expect(getPayeeUsageCounts).toHaveBeenCalledWith('file:///workspace/main.bean');
		expect(getNarrationUsageCounts).toHaveBeenCalledWith('file:///workspace/main.bean');
	});

	it('does not fetch payees when the current context only accepts narration', async () => {
		const { collector, getPayees, getNarrations, getPayeeUsageCounts, getNarrationUsageCounts } = createCollector(
			new Map([
				[
					SymbolType.NARRATION,
					{ items: ['Dinner'], usageCounts: new Map([['Dinner', 1]]) },
				],
			]),
		);

		await addPayeesAndNarrations(collector, {
			shouldIncludePayees: false,
			quotationStyle: 'end',
			addSpaceAfter: false,
		});

		expect(collector.completions).toHaveLength(1);
		expect(collector.completions[0]).toMatchObject({
			label: 'Dinner',
			textEdit: { newText: 'Dinner"' },
		});
		expect(getPayees).not.toHaveBeenCalled();
		expect(getPayeeUsageCounts).not.toHaveBeenCalled();
		expect(getNarrations).toHaveBeenCalledWith(
			true,
			{ waitTime: 100 },
			'file:///workspace/main.bean',
		);
		expect(getNarrationUsageCounts).toHaveBeenCalledWith('file:///workspace/main.bean');
	});

	it('preserves an already typed caret for link completions', async () => {
		const { collector, getLinks, getLinkUsageCounts } = createCollector(
			new Map([
				[
					SymbolType.LINK,
					{ items: ['invoice-1'], usageCounts: new Map([['invoice-1', 1]]) },
				],
			]),
			{ afterCaret: true },
		);

		await addLinkCompletions(collector);

		expect(collector.completions[0]).toMatchObject({
			label: 'invoice-1',
			textEdit: { newText: 'invoice-1' },
		});
		expect(getLinks).toHaveBeenCalledWith('file:///workspace/main.bean');
		expect(getLinkUsageCounts).toHaveBeenCalledWith('file:///workspace/main.bean');
	});

	it('does not fetch currencies while the current token is still a number', async () => {
		const { collector, getCommodities, getCommodityUsageCounts } = createCollector(
			new Map([
				[
					SymbolType.COMMODITY,
					{ items: ['USD'], usageCounts: new Map([['USD', 1]]) },
				],
			]),
			{ linePrefix: '2026-02-22 balance Assets:Bank 2', tokenText: '2' },
		);

		await addCurrencyCompletions(collector);

		expect(collector.completions).toEqual([]);
		expect(getCommodities).not.toHaveBeenCalled();
		expect(getCommodityUsageCounts).not.toHaveBeenCalled();
	});
});
