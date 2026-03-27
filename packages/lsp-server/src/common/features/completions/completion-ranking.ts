import type { CompiledAccountCandidate } from '../symbol-index';

export type AccountSegmentMatchKind = 'exact' | 'prefix' | 'substring' | 'fuzzy';

export type AccountMatchRank = {
	tier: number;
	matchedSegmentCount: number;
	gapCount: number;
	rootQuality: number;
	tailHit: boolean;
	fuzzyCount: number;
	usageBucket: number;
};

type CompiledAccountQuery = {
	parts: string[];
	hasExplicitSeparators: boolean;
	collapsedCandidates: Array<{
		parts: string[];
		initials: string;
	}>;
};

type RankedLabelItem<T> = {
	item: T;
	label: string;
	usageCount: number;
	tier: number;
	filterText?: string;
};

function normalizeAccountQueryToken(input: string): string {
	return input
		.replace(/：/g, ':')
		.replace(/^["'#^]+/, '')
		.trim();
}

function isSubsequence(needle: string, haystack: string): boolean {
	if (!needle) return true;
	let i = 0;
	for (const ch of haystack) {
		if (ch === needle[i]) {
			i++;
			if (i >= needle.length) return true;
		}
	}
	return false;
}

export function rankTextMatchTier(query: string, label: string, filterText: string): number {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return 0;

	const labelLower = label.toLowerCase();
	const filter = filterText.toLowerCase();
	const filterTokens = filter.split(/\s+/).filter(Boolean);
	if (labelLower === normalizedQuery) return 6;
	if (filterTokens.some(token => token === normalizedQuery)) return 5;
	if (labelLower.startsWith(normalizedQuery) || filterTokens.some(token => token.startsWith(normalizedQuery))) {
		return 4;
	}
	if (labelLower.includes(normalizedQuery)) return 3;
	if (filter.includes(normalizedQuery)) return 2;
	if (
		normalizedQuery.length >= 2
		&& filterTokens.some(token => token.length >= normalizedQuery.length && isSubsequence(normalizedQuery, token))
	) {
		return 1;
	}
	return 0;
}

function normalizeSymbolLikeText(input: string): string {
	return input.toLowerCase().replace(/[_\-./:\\s]/g, '');
}

export function rankSymbolLikeMatchTier(query: string, label: string, filterText: string): number {
	const baseTier = rankTextMatchTier(query, label, filterText);
	const normalizedQuery = normalizeSymbolLikeText(query.trim());
	if (!normalizedQuery) return baseTier;

	const normalizedLabel = normalizeSymbolLikeText(label);
	if (normalizedLabel === normalizedQuery) return Math.max(baseTier, 6);
	if (normalizedLabel.startsWith(normalizedQuery)) return Math.max(baseTier, 5);
	if (normalizedLabel.includes(normalizedQuery)) return Math.max(baseTier, 4);
	if (isSubsequence(normalizedQuery, normalizedLabel)) return Math.max(baseTier, 3);

	const normalizedFilter = normalizeSymbolLikeText(filterText);
	if (normalizedFilter.includes(normalizedQuery) || isSubsequence(normalizedQuery, normalizedFilter)) {
		return Math.max(baseTier, 2);
	}
	return baseTier;
}

export function rankCurrencyMatchTier(query: string, label: string, filterText: string): number {
	return rankSymbolLikeMatchTier(query, label, filterText);
}

export function rankAndSortLabelItems<T>(params: {
	items: readonly T[];
	query: string;
	getLabel: (item: T) => string;
	getUsageCount: (item: T) => number;
	rankFn: (query: string, label: string, filterText: string) => number;
	getFilterText: (label: string) => string;
}): RankedLabelItem<T>[] {
	const { items, query, getLabel, getUsageCount, rankFn, getFilterText } = params;
	const hasQuery = query.length > 0;
	const ranked: RankedLabelItem<T>[] = [];

	for (const item of items) {
		const label = getLabel(item);
		const usageCount = getUsageCount(item);
		if (!hasQuery) {
			ranked.push({ item, label, usageCount, tier: 0 });
			continue;
		}
		const filterText = getFilterText(label);
		const tier = rankFn(query, label, filterText);
		if (tier <= 0) {
			continue;
		}
		ranked.push({ item, label, usageCount, tier, filterText });
	}

	ranked.sort((a, b) => {
		if (a.tier !== b.tier) return b.tier - a.tier;
		if (a.usageCount !== b.usageCount) return b.usageCount - a.usageCount;
		return a.label.localeCompare(b.label);
	});
	return ranked;
}

function scoreSegmentMatch(
	querySegment: string,
	accountSegment: string,
	accountSegmentRaw?: string,
): AccountSegmentMatchKind | null {
	if (!querySegment) return null;
	if (querySegment === accountSegment) return 'exact';
	if (accountSegment.startsWith(querySegment)) return 'prefix';
	if (accountSegment.includes(querySegment)) return 'substring';

	if (accountSegmentRaw) {
		const acronym = accountSegmentRaw
			.split('')
			.filter(ch => /[A-Z0-9]/.test(ch))
			.join('')
			.toLowerCase();
		if (acronym) {
			if (querySegment === acronym) return 'exact';
			if (acronym.startsWith(querySegment)) return 'prefix';
			if (acronym.includes(querySegment)) return 'substring';
		}
	}
	return null;
}

function scoreRootMatch(queryRoot: string, accountRoot: string): number {
	if (!queryRoot) {
		return 0;
	}
	if (queryRoot === accountRoot) {
		return 160;
	}
	if (accountRoot.startsWith(queryRoot)) {
		return 120;
	}
	if (queryRoot.length === 1 && accountRoot.startsWith(queryRoot)) {
		return 100;
	}
	if (accountRoot.includes(queryRoot)) {
		return 70;
	}
	return -1;
}

function findBestSegmentMatch(
	accountParts: string[],
	accountPartsRaw: string[],
	startIdx: number,
	queryPart: string,
): { index: number; endIndex: number; kind: AccountSegmentMatchKind } | null {
	type MatchCandidate = { index: number; endIndex: number };
	const firstMatchByKind: Partial<Record<AccountSegmentMatchKind, MatchCandidate>> = {};

	const updateCandidate = (kind: AccountSegmentMatchKind, index: number, endIndex: number) => {
		const current = firstMatchByKind[kind];
		if (!current) {
			firstMatchByKind[kind] = { index, endIndex };
			return;
		}
		const currentSpan = current.endIndex - current.index;
		const nextSpan = endIndex - index;
		if (index < current.index || (index === current.index && nextSpan < currentSpan)) {
			firstMatchByKind[kind] = { index, endIndex };
		}
	};

	for (let i = startIdx; i < accountParts.length; i++) {
		const kind = scoreSegmentMatch(queryPart, accountParts[i]!, accountPartsRaw[i]!);
		if (!kind) continue;
		updateCandidate(kind, i, i);
	}

	for (let i = startIdx; i < accountParts.length; i++) {
		let collapsed = '';
		for (let j = i; j < accountParts.length; j++) {
			collapsed += accountParts[j]!;
			if (!collapsed.includes(queryPart[0]!)) {
				continue;
			}
			let kind: AccountSegmentMatchKind | null = null;
			if (queryPart === collapsed) kind = 'exact';
			else if (collapsed.startsWith(queryPart)) kind = 'prefix';
			else if (collapsed.includes(queryPart)) kind = 'substring';
			if (!kind && j > i && queryPart.length >= 2 && isSubsequence(queryPart, collapsed)) {
				kind = 'fuzzy';
			}
			if (kind) {
				updateCandidate(kind, i, j);
			}
		}
	}

	if (firstMatchByKind.exact) return { ...firstMatchByKind.exact, kind: 'exact' };
	if (firstMatchByKind.prefix) return { ...firstMatchByKind.prefix, kind: 'prefix' };
	if (firstMatchByKind.substring) return { ...firstMatchByKind.substring, kind: 'substring' };
	if (firstMatchByKind.fuzzy) return { ...firstMatchByKind.fuzzy, kind: 'fuzzy' };
	return null;
}

export function makeEmptyAccountRank(usageCount: number): AccountMatchRank {
	return {
		tier: 0,
		matchedSegmentCount: 0,
		gapCount: 0,
		rootQuality: 0,
		tailHit: false,
		fuzzyCount: 0,
		usageBucket: Math.min(usageCount, 20),
	};
}

export function compileAccountQuery(query: string): CompiledAccountQuery {
	const normalized = normalizeAccountQueryToken(query);
	const hasExplicitSeparators = normalized.includes(':');
	const parts = normalized
		.split(':')
		.map(p => p.trim().toLowerCase())
		.filter(Boolean);

	return {
		parts,
		hasExplicitSeparators,
		collapsedCandidates: hasExplicitSeparators ? [] : buildCollapsedAccountQueryCandidates(normalized),
	};
}

function buildCollapsedAccountQueryCandidates(query: string): Array<{ parts: string[]; initials: string }> {
	const candidates = new Map<string, { parts: string[]; initials: string }>();

	const addCandidate = (parts: string[]) => {
		const normalizedParts = parts
			.map(part => part.trim().toLowerCase())
			.filter(Boolean);
		if (normalizedParts.length === 0) {
			return;
		}
		const key = normalizedParts.join('\u0000');
		if (candidates.has(key)) {
			return;
		}
		candidates.set(key, {
			parts: normalizedParts,
			initials: normalizedParts.map(part => part[0]!).join(''),
		});
	};

	addCandidate([query]);

	const shorthandParts = splitCollapsedAccountShorthand(query);
	if (shorthandParts.length > 1) {
		addCandidate(shorthandParts);
	}

	if (/^[a-z0-9._/-]+$/.test(query) && query.length >= 2 && query.length <= 4) {
		addCandidate(query.split(''));
	}

	return Array.from(candidates.values());
}

function splitCollapsedAccountShorthand(query: string): string[] {
	if (!query) {
		return [];
	}

	const result: string[] = [];
	let current = query[0]!;
	for (let i = 1; i < query.length; i++) {
		const ch = query[i]!;
		if (/[A-Z]/.test(ch)) {
			result.push(current);
			current = ch;
			continue;
		}
		current += ch;
	}
	result.push(current);
	return result;
}

function rankStructuredAccountQuery(
	normalizedQueryParts: string[],
	account: CompiledAccountCandidate,
	usageCount: number,
): AccountMatchRank | null {
	if (account.partsLower.length === 0) {
		return null;
	}

	const rootQuality = scoreRootMatch(normalizedQueryParts[0]!, account.rootLower);
	if (rootQuality < 0) {
		return null;
	}

	let segmentStart = 1;
	let prefixCount = 0;
	let substringCount = 0;
	let fuzzyCount = 0;
	let gapCount = 0;
	let lastMatchIndex = 0;
	let tailHit = false;
	const queryTailIdx = normalizedQueryParts.length - 1;
	for (let i = 1; i < normalizedQueryParts.length; i++) {
		const queryPart = normalizedQueryParts[i]!;
		const match = findBestSegmentMatch(account.partsLower, account.partsRaw, segmentStart, queryPart);
		if (!match) {
			return null;
		}
		if (match.kind === 'prefix') prefixCount++;
		if (match.kind === 'substring') substringCount++;
		if (match.kind === 'fuzzy') fuzzyCount++;
		gapCount += Math.max(0, match.index - lastMatchIndex - 1);
		lastMatchIndex = match.endIndex;
		segmentStart = match.endIndex + 1;
		if (i === queryTailIdx) {
			tailHit = match.endIndex === account.partsLower.length - 1;
		}
	}

	let tier = 2;
	if (fuzzyCount > 0) {
		tier = -1;
	} else if (substringCount > 0) {
		tier = 0;
	} else if (prefixCount > 0) {
		tier = 1;
	}

	return {
		tier,
		matchedSegmentCount: normalizedQueryParts.length - 1,
		gapCount,
		rootQuality,
		tailHit,
		fuzzyCount,
		usageBucket: Math.min(usageCount, 20),
	};
}

function rankCollapsedAccountQuery(
	compiledQuery: CompiledAccountQuery,
	account: CompiledAccountCandidate,
	usageCount: number,
): AccountMatchRank | null {
	let bestRank: AccountMatchRank | null = null;

	for (const candidate of compiledQuery.collapsedCandidates) {
		if (candidate.parts.length === 0) {
			continue;
		}
		if (!isSubsequence(candidate.initials, account.segmentInitialsLower)) {
			continue;
		}

		const rootQueryPart = candidate.parts[0]!;
		if (!account.rootLower.startsWith(rootQueryPart)) {
			continue;
		}

		let gapCount = 0;
		let lastMatchIndex = 0;
		let matchedSegmentCount = 1;
		let exactCount = rootQueryPart === account.rootLower ? 1 : 0;
		let tailHit = candidate.parts.length === 1 && account.partsLower.length === 1;
		let segmentStart = 1;
		let valid = true;

		for (let i = 1; i < candidate.parts.length; i++) {
			const queryPart = candidate.parts[i]!;
			let matchedIndex = -1;
			for (let j = segmentStart; j < account.partsLower.length; j++) {
				if (account.partsLower[j]!.startsWith(queryPart)) {
					matchedIndex = j;
					break;
				}
			}
			if (matchedIndex < 0) {
				valid = false;
				break;
			}

			matchedSegmentCount++;
			gapCount += Math.max(0, matchedIndex - lastMatchIndex - 1);
			lastMatchIndex = matchedIndex;
			segmentStart = matchedIndex + 1;
			if (account.partsLower[matchedIndex] === queryPart) {
				exactCount++;
			}
			if (i === candidate.parts.length - 1) {
				tailHit = matchedIndex === account.partsLower.length - 1;
			}
		}

		if (!valid) {
			continue;
		}

		const rank: AccountMatchRank = {
			tier: exactCount === candidate.parts.length ? 2 : 1,
			matchedSegmentCount,
			gapCount,
			rootQuality: scoreRootMatch(rootQueryPart, account.rootLower),
			tailHit,
			fuzzyCount: 0,
			usageBucket: Math.min(usageCount, 20),
		};

		if (!bestRank || compareAccountRank(rank, bestRank) < 0) {
			bestRank = rank;
		}
	}

	return bestRank;
}

export function rankCompiledAccountQuery(
	compiledQuery: CompiledAccountQuery,
	account: CompiledAccountCandidate,
	usageCount: number = 0,
): AccountMatchRank | null {
	const normalizedQueryParts = compiledQuery.parts;
	if (normalizedQueryParts.length === 0) {
		return makeEmptyAccountRank(usageCount);
	}
	if (compiledQuery.hasExplicitSeparators) {
		return rankStructuredAccountQuery(normalizedQueryParts, account, usageCount);
	}

	return rankCollapsedAccountQuery(compiledQuery, account, usageCount);
}

export function rankAccountQuery(
	query: string,
	account: string,
	usageCount: number = 0,
): AccountMatchRank | null {
	const compiledQuery = compileAccountQuery(query);
	const accountPartsRaw = account.split(':');
	const accountParts = accountPartsRaw.map(p => p.toLowerCase());
	return rankCompiledAccountQuery(compiledQuery, {
		name: account,
		partsRaw: accountPartsRaw,
		partsLower: accountParts,
		rootLower: accountParts[0] || '',
		segmentInitialsLower: accountParts.map(part => part[0] || '').join(''),
	}, usageCount);
}

export function compareAccountRank(a: AccountMatchRank, b: AccountMatchRank): number {
	if (a.tier !== b.tier) return b.tier - a.tier;
	if (a.matchedSegmentCount !== b.matchedSegmentCount) return b.matchedSegmentCount - a.matchedSegmentCount;
	if (a.tailHit !== b.tailHit) return Number(b.tailHit) - Number(a.tailHit);
	if (a.fuzzyCount !== b.fuzzyCount) return a.fuzzyCount - b.fuzzyCount;
	if (a.gapCount !== b.gapCount) return a.gapCount - b.gapCount;
	if (a.rootQuality !== b.rootQuality) return b.rootQuality - a.rootQuality;
	if (a.usageBucket !== b.usageBucket) return b.usageBucket - a.usageBucket;
	return 0;
}
