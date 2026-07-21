import { describe, expect, it } from 'vitest';
import { CompletionItemKind, TextEdit } from 'vscode-languageserver';
import { deriveAccountQueryFromLine } from '../../common/features/completions/completion-context';
import {
	addAccountCompletions,
	addCompletionItem,
	type CompletionCollector,
} from '../../common/features/completions/completion-providers';
import {
	type AccountMatchRank,
	compareAccountRank,
	compileAccountQuery,
	makeEmptyAccountRank,
	rankCompiledAccountQuery,
} from '../../common/features/completions/completion-ranking';
import type {
	AccountCompletionSnapshot,
	CompiledAccountCandidate,
	SymbolIndex,
} from '../../common/features/symbol-index';

function compileAccount(name: string): CompiledAccountCandidate {
	const partsRaw = name.split(':');
	const partsLower = partsRaw.map(part => part.toLowerCase());
	return {
		name,
		partsRaw,
		partsLower,
		rootLower: partsLower[0] || '',
		segmentInitialsLower: partsLower.map(part => part[0] || '').join(''),
	};
}

function createCollector(
	snapshot: AccountCompletionSnapshot,
	query: string,
	linePrefix = query,
	existingLabels: string[] = [],
): CompletionCollector {
	const symbolIndex = {
		getAccountCompletionSnapshot: async () => snapshot,
		getFilterText: (label: string) => `filter:${label.toLocaleLowerCase()}`,
	} as unknown as SymbolIndex;
	return {
		symbolIndex,
		position: { line: 0, character: linePrefix.length },
		existingCompletions: new Set(existingLabels),
		completions: [],
		enablePinyin: false,
		textCtx: {
			linePrefix,
			tokenRange: { startChar: Math.max(0, linePrefix.length - query.length), endChar: linePrefix.length },
			tokenText: query,
			afterHash: false,
			afterCaret: false,
		},
	};
}

async function addAccountCompletionsBaseline(collector: CompletionCollector): Promise<void> {
	let currentDate: string | undefined;
	if (collector.textCtx.linePrefix) {
		const dateMatch = collector.textCtx.linePrefix.match(/(\d{4}[-/]\d{2}[-/]\d{2})/);
		if (dateMatch?.[1]) currentDate = dateMatch[1];
	}

	const lineDerivedQuery = deriveAccountQueryFromLine(collector.textCtx.linePrefix);
	const query = collector.textCtx.tokenText || lineDerivedQuery;
	const hasActiveQuery = query.length > 0;
	const compiledQuery = compileAccountQuery(query);
	const accountMatchScores = new Map<string, number>();
	const accountRanks = new Map<string, AccountMatchRank>();
	const { accounts, usageCounts, closedAccounts } = await collector.symbolIndex.getAccountCompletionSnapshot();
	const filteredAccounts = accounts.filter((account) => {
		if (currentDate && closedAccounts.has(account.name)) {
			const closedDate = closedAccounts.get(account.name);
			if (closedDate && currentDate >= closedDate) return false;
		}
		const usageCount = usageCounts.get(account.name) || 0;
		const rank = hasActiveQuery
			? rankCompiledAccountQuery(compiledQuery, account, usageCount)
			: makeEmptyAccountRank(usageCount);
		if (!rank) return false;
		accountRanks.set(account.name, rank);
		accountMatchScores.set(account.name, rank.tier * 100 + rank.rootQuality * 10 + (rank.tailHit ? 5 : 0));
		return true;
	});

	filteredAccounts.sort((left, right) => {
		const leftRank = accountRanks.get(left.name);
		const rightRank = accountRanks.get(right.name);
		if (leftRank && rightRank) {
			const rankDiff = compareAccountRank(leftRank, rightRank);
			if (rankDiff !== 0) return rankDiff;
		}
		const leftCount = usageCounts.get(left.name) || 0;
		const rightCount = usageCounts.get(right.name) || 0;
		if (leftCount !== rightCount) return rightCount - leftCount;
		return left.name.localeCompare(right.name);
	});

	filteredAccounts.forEach((account, index) => {
		const usageCount = usageCounts.get(account.name) || 0;
		let detail = usageCount > 0
			? `Used ${usageCount} time${usageCount === 1 ? '' : 's'}`
			: '';
		const closedDate = closedAccounts.get(account.name);
		if (closedDate) {
			if (detail) detail += ' | ';
			detail += `Closed on ${closedDate}`;
		}
		addCompletionItem(
			collector,
			{ label: account.name, kind: CompletionItemKind.Field, detail },
			TextEdit.replace(
				{
					start: { line: collector.position.line, character: collector.textCtx.tokenRange.startChar },
					end: { line: collector.position.line, character: collector.textCtx.tokenRange.endChar },
				},
				`${account.name} `,
			),
			usageCount,
			accountMatchScores.get(account.name),
			String(index).padStart(7, '0'),
		);
	});
}

describe('account completion optimization equivalence', () => {
	const accountNames = [
		'Assets:Cash',
		'Assets:Bank:Checking',
		'Assets:Bank:Savings',
		'Assets:银行:储蓄😀',
		'Expenses:Café',
		'Income:Salary',
		'Liabilities:Card',
		'Equity:Opening-Balances',
	];
	const snapshot: AccountCompletionSnapshot = {
		version: 1,
		accountsNames: accountNames,
		accounts: accountNames.map(compileAccount),
		usageCounts: new Map([
			['Assets:Cash', 25],
			['Assets:Bank:Checking', 20],
			['Assets:Bank:Savings', 20],
			['Assets:银行:储蓄😀', 3],
			['Expenses:Café', 1],
		]),
		closedAccounts: new Map([
			['Assets:Cash', '2024-12-31'],
			['Assets:Bank:Savings', '2026-12-31'],
		]),
	};

	for (
		const testCase of [
			{ name: 'empty query', query: '' },
			{ name: 'wide partial query', query: 'a' },
			{ name: 'incomplete segmented query', query: 'Assets:Ba:' },
			{ name: 'collapsed shorthand query', query: 'ABC' },
			{ name: 'Unicode query', query: 'Assets:银行' },
			{ name: 'emoji suffix query', query: 'Assets:银行:😀' },
		]
	) {
		it(`matches the baseline for ${testCase.name}`, async () => {
			const baseline = createCollector(snapshot, testCase.query);
			const optimized = createCollector(snapshot, testCase.query);

			await addAccountCompletionsBaseline(baseline);
			await addAccountCompletions(optimized);

			expect(optimized.completions).toEqual(baseline.completions);
		});
	}

	it('preserves date-based closing filters and existing completion gaps', async () => {
		const linePrefix = '2025-01-01 * "Payee" "Narration" Assets:';
		const baseline = createCollector(snapshot, 'Assets:', linePrefix, ['Assets:Bank:Checking']);
		const optimized = createCollector(snapshot, 'Assets:', linePrefix, ['Assets:Bank:Checking']);

		await addAccountCompletionsBaseline(baseline);
		await addAccountCompletions(optimized);

		expect(optimized.completions).toEqual(baseline.completions);
		expect(optimized.completions.some(item => item.label === 'Assets:Cash')).toBe(false);
		expect(optimized.completions.some(item => item.label === 'Assets:Bank:Checking')).toBe(false);
		expect(optimized.completions.find(item => item.label === 'Assets:Bank:Savings')?.detail).toContain(
			'2026-12-31',
		);
	});
});
