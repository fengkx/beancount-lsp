import { describe, expect, it } from 'vitest';
import type { Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
	buildCompletionTextContext,
	deriveAccountQueryFromLine,
	rankCurrencyMatchTier,
	rankSymbolLikeMatchTier,
	rankTextMatchTier,
	rankAccountQuery,
	resolveCompletionIntent,
	shouldSuppressCurrencyForCurrentToken,
	type TriggerInfo,
} from '../../common/features/completions';

function makeDoc(line: string): TextDocument {
	return TextDocument.create('file:///test.bean', 'beancount', 1, line);
}

function endPos(line: string): Position {
	return { line: 0, character: line.length };
}

function makeTriggerInfo(overrides: Partial<TriggerInfo> = {}): TriggerInfo {
	return {
		triggerCharacter: undefined,
		currentType: 'ERROR',
		parentType: undefined,
		previousSiblingType: undefined,
		previousPreviousSiblingType: undefined,
		...overrides,
	};
}

describe('completion text context', () => {
	it('extracts account token range for L:1507', () => {
		const line = 'L:1507';
		const doc = makeDoc(line);
		const ctx = buildCompletionTextContext(doc, endPos(line));
		expect(ctx.tokenRange).toEqual({ startChar: 0, endChar: line.length });
		expect(ctx.tokenText).toBe('L:1507');
	});

	it('extracts account token with full-width colon', () => {
		const line = 'L：1507';
		const doc = makeDoc(line);
		const ctx = buildCompletionTextContext(doc, endPos(line));
		expect(ctx.tokenRange).toEqual({ startChar: 0, endChar: line.length });
		expect(ctx.tokenText).toBe('L:1507');
	});

	it('detects open quote state', () => {
		const line = '"aa';
		const doc = makeDoc(line);
		const ctx = buildCompletionTextContext(doc, endPos(line));
		expect(ctx.inOpenQuote).toBe(true);
	});
});

describe('completion intent guards', () => {
	it('does not treat empty line as date completion context', () => {
		const line = '   ';
		const doc = makeDoc(line);
		const ctx = buildCompletionTextContext(doc, endPos(line));
		const intents = resolveCompletionIntent(makeTriggerInfo(), ctx);
		expect(intents.some((intent) => intent.type === 'date')).toBe(false);
	});

	it('suppresses currency intent while balance line is awaiting number', () => {
		const line = '2026-02-22 balance Assets:Bank:CMB 26386.89';
		const doc = makeDoc(line);
		const ctx = buildCompletionTextContext(doc, endPos(line));
		expect(shouldSuppressCurrencyForCurrentToken(ctx.linePrefix)).toBe(true);
		const intents = resolveCompletionIntent(
			makeTriggerInfo({
				previousSiblingType: 'number',
				previousPreviousSiblingType: 'account',
			}),
			ctx,
		);
		expect(intents.some((intent) => intent.type === 'currency')).toBe(false);
	});

	it('suppresses currency intent for partial numeric token', () => {
		const line = '2026-02-22 balance Assets:Bank:CMB 2';
		const doc = makeDoc(line);
		const ctx = buildCompletionTextContext(doc, endPos(line));
		expect(shouldSuppressCurrencyForCurrentToken(ctx.linePrefix)).toBe(true);
		const intents = resolveCompletionIntent(
			makeTriggerInfo({
				previousSiblingType: 'number',
				previousPreviousSiblingType: 'account',
			}),
			ctx,
		);
		expect(intents.some((intent) => intent.type === 'currency')).toBe(false);
	});

	it('allows currency intent when previous token is number and current token is empty', () => {
		const line = '2026-02-22 balance Assets:Bank:CMB 26386.89 ';
		const doc = makeDoc(line);
		const ctx = buildCompletionTextContext(doc, endPos(line));
		expect(shouldSuppressCurrencyForCurrentToken(ctx.linePrefix)).toBe(false);
		const intents = resolveCompletionIntent(
			makeTriggerInfo({
				previousSiblingType: 'number',
				previousPreviousSiblingType: 'account',
			}),
			ctx,
		);
		expect(intents.some((intent) => intent.type === 'currency')).toBe(true);
	});
});

describe('deriveAccountQueryFromLine', () => {
	it('derives strict account query from line suffix', () => {
		expect(deriveAccountQueryFromLine('  L:1507')).toBe('L:1507');
	});

	it('falls back to last token normalization', () => {
		expect(deriveAccountQueryFromLine('  "L：1507')).toBe('L:1507');
	});
});

describe('rankAccountQuery', () => {
	it('matches L:1507 and rejects non-matching suffix', () => {
		const matched = rankAccountQuery('L:1507', 'Liabilities:CreditCard:ICBC:1507', 2);
		const rejected = rankAccountQuery('L:1507', 'Liabilities:CreditCard:BOC:8418', 999);
		expect(matched).not.toBeNull();
		expect(rejected).toBeNull();
	});

	it('supports ordered skip-segment matching and rejects wrong order', () => {
		const matched = rankAccountQuery('L:CC:1507', 'Liabilities:CreditCard:ICBC:1507', 1);
		const rejected = rankAccountQuery('L:1507:CC', 'Liabilities:CreditCard:ICBC:1507', 1);
		expect(matched).not.toBeNull();
		expect(rejected).toBeNull();
	});

	it('prefers exact segment over substring tier', () => {
		const exact = rankAccountQuery('L:1507', 'Liabilities:CreditCard:ICBC:1507', 0);
		const substring = rankAccountQuery('L:1507', 'Liabilities:CreditCard:ICBC:X1507', 0);
		expect(exact).not.toBeNull();
		expect(substring).not.toBeNull();
		expect(exact!.tier).toBeGreaterThan(substring!.tier);
	});

	it('supports collapsed multi-segment query matching', () => {
		const prefixMatch = rankAccountQuery('A:FundsC', 'Assets:Funds:CMB', 1);
		const exactCollapsed = rankAccountQuery('A:FundsCMB', 'Assets:Funds:CMB', 1);
		expect(prefixMatch).not.toBeNull();
		expect(exactCollapsed).not.toBeNull();
		expect(exactCollapsed!.tier).toBeGreaterThanOrEqual(prefixMatch!.tier);
	});

	it('rejects collapsed query with wrong order', () => {
		const rejected = rankAccountQuery('A:CMBFunds', 'Assets:Funds:CMB', 1);
		expect(rejected).toBeNull();
	});

});

describe('rankTextMatchTier', () => {
	it('treats label-prefix and pinyin-token-prefix as the same tier', () => {
		const query = 'z';
		const tierForLatin = rankTextMatchTier(query, 'zlib', 'zlib');
		const tierForChinese = rankTextMatchTier(query, '转账', '转账 zz zhang zhuan');
		expect(tierForChinese).toBe(tierForLatin);
		expect(tierForChinese).toBeGreaterThan(0);
	});

	it('keeps same match tier for pinyin initials and lets usage break ties', () => {
		const query = 'zz';
		const tierForTransfer = rankTextMatchTier(query, '转账', '转账 zz zhang zhuan');
		const tierForTable = rankTextMatchTier(query, '桌子', '桌子 zz zhuo zi');
		expect(tierForTransfer).toBe(tierForTable);
		expect(tierForTransfer).toBeGreaterThan(0);
	});
});

describe('rankCurrencyMatchTier', () => {
	it('matches currency fuzzy query across separators', () => {
		const tier = rankCurrencyMatchTier('hk0', 'HK_00700', 'HK_00700');
		expect(tier).toBeGreaterThan(0);
	});

	it('keeps exact code as highest tier', () => {
		const exact = rankCurrencyMatchTier('hkd', 'HKD', 'HKD');
		const fuzzy = rankCurrencyMatchTier('hk0', 'HK_00700', 'HK_00700');
		expect(exact).toBeGreaterThan(fuzzy);
	});
});

describe('rankSymbolLikeMatchTier', () => {
	it('matches separator-insensitive fuzzy query for tag-like symbols', () => {
		const tier = rankSymbolLikeMatchTier('hk0', 'HK_00700', 'HK_00700');
		expect(tier).toBeGreaterThan(0);
	});

	it('matches subsequence query for link-like symbols', () => {
		const tier = rankSymbolLikeMatchTier('mb22', 'MBA13_2022', 'MBA13_2022');
		expect(tier).toBeGreaterThan(0);
	});
});
