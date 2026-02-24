import { Logger } from '@bean-lsp/shared/logger';
import { add, formatDate, sub } from 'date-fns';
import {
	CompletionItem,
	CompletionItemKind,
	Position,
	TextEdit,
} from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import { SymbolIndex, type CompiledAccountCandidate } from '../symbol-index';
import {
	type AccountMatchRank,
	compareAccountRank,
	compileAccountQuery,
	makeEmptyAccountRank,
	rankAndSortLabelItems,
	rankCompiledAccountQuery,
	rankSymbolLikeMatchTier,
	rankTextMatchTier,
} from './completion-ranking';
import {
	deriveAccountQueryFromLine,
	shouldSuppressCurrencyForCurrentToken,
	shouldTraceAccountQuery,
} from './completion-context';

const logger = new Logger('completions');

type CompletionTextContextLike = {
	linePrefix: string;
	tokenRange: { startChar: number; endChar: number };
	tokenText: string;
	afterHash: boolean;
	afterCaret: boolean;
};

export interface CompletionCollector {
	symbolIndex: SymbolIndex;
	position: Position;
	existingCompletions: Set<string>;
	completions: CompletionItem[];
	document?: TextDocument;
	enablePinyin: boolean;
	textCtx: CompletionTextContextLike;
}

export interface AddPayeesAndNarrationsParams {
	shouldIncludePayees: boolean;
	quotationStyle: 'none' | 'end' | 'both';
	addSpaceAfter: boolean;
}

type AccountCompletionSnapshotData = {
	accounts: CompiledAccountCandidate[];
	usageCounts: Map<string, number>;
	closedAccounts: Map<string, string>;
	fetchMs: number;
};

export function addCompletionItem(
	collector: CompletionCollector,
	item: { label: string; kind?: CompletionItemKind; detail?: string },
	textEdit: string | TextEdit,
	usageCount?: number,
	matchScore?: number,
	sortTextOverride?: string,
	filterTextOverride?: string,
): void {
	if (collector.existingCompletions.has(item.label)) {
		return;
	}

	const filterText = filterTextOverride ?? collector.symbolIndex.getFilterText(item.label);
	const score = matchScore ? Math.max(0, matchScore) * 100 : 0;
	void usageCount;
	const completionItem: CompletionItem = {
		...item,
		kind: item.kind || CompletionItemKind.Text,
		filterText,
		textEdit: typeof textEdit === 'string'
			? TextEdit.replace(
				{
					start: {
						line: collector.position.line,
						character: collector.textCtx.tokenRange.startChar,
					},
					end: {
						line: collector.position.line,
						character: collector.textCtx.tokenRange.endChar,
					},
				},
				textEdit,
			)
			: textEdit,
		data: collector.textCtx.tokenText ? { score, usageCount } : undefined,
	};
	if (sortTextOverride) {
		completionItem.sortText = sortTextOverride;
	} else if (score > 0) {
		completionItem.sortText = String(1000000 - Math.round(score)).padStart(7, '0');
	}
	collector.completions.push(completionItem);
	collector.existingCompletions.add(item.label);
}

export function addIdentifierCompletions(collector: CompletionCollector): void {
	['open', 'close', 'balance', 'pad', 'document', 'note'].forEach((t) => {
		addCompletionItem(collector, { label: t, kind: CompletionItemKind.Field }, t);
	});
}

export function addDateCompletions(
	collector: CompletionCollector,
	position: Position,
	document?: TextDocument,
): void {
	const d = new Date();
	const yesterday = sub(d, { days: 1 });
	const dayBeforeYesterday = sub(d, { days: 2 });
	const tomorrow = add(d, { days: 1 });

	const dateSet = new Set<string>();
	const standardDates = [d, yesterday, tomorrow, dayBeforeYesterday];
	const formattedStandardDates = standardDates.map(d => formatDate(d, 'yyyy-MM-dd'));
	formattedStandardDates.forEach(dateStr => dateSet.add(dateStr));

	if (document) {
		const startLine = Math.max(0, position.line - 50);
		const endLine = position.line;
		for (let lineNum = endLine; lineNum >= startLine; lineNum--) {
			const lineText = document.getText({
				start: { line: lineNum, character: 0 },
				end: { line: lineNum, character: Number.MAX_SAFE_INTEGER },
			});
			const dateMatches = lineText.match(/\d{4}[-/]\d{2}[-/]\d{2}/g);
			dateMatches?.forEach(date => dateSet.add(date));
		}
	}

	formattedStandardDates.forEach((dateStr, idx) => {
		collector.completions.push({
			label: dateStr,
			sortText: String.fromCharCode(65 + idx),
			kind: CompletionItemKind.Constant,
			detail: '',
			filterText: collector.symbolIndex.getFilterText(dateStr),
		});
		collector.existingCompletions.add(dateStr);
	});

	Array.from(dateSet)
		.filter(date => !formattedStandardDates.includes(date))
		.sort()
		.reverse()
		.forEach((dateStr, idx) => {
			if (collector.existingCompletions.has(dateStr)) return;
			collector.completions.push({
				label: dateStr,
				sortText: String.fromCharCode(65 + formattedStandardDates.length + idx),
				kind: CompletionItemKind.Constant,
				detail: '(recent)',
				filterText: collector.symbolIndex.getFilterText(dateStr),
			});
			collector.existingCompletions.add(dateStr);
		});
}

export async function addPayeesAndNarrations(
	collector: CompletionCollector,
	params: AddPayeesAndNarrationsParams,
): Promise<void> {
	const {
		shouldIncludePayees,
		quotationStyle,
		addSpaceAfter,
	} = params;
	const [payees, narrations, payeeUsageCounts, narrationUsageCounts] = await Promise.all([
		shouldIncludePayees ? collector.symbolIndex.getPayees(true, { waitTime: 100 }) : Promise.resolve([]),
		collector.symbolIndex.getNarrations(true, { waitTime: 100 }),
		shouldIncludePayees ? collector.symbolIndex.getPayeeUsageCounts() : Promise.resolve(new Map<string, number>()),
		collector.symbolIndex.getNarrationUsageCounts(),
	]);

	const quote = quotationStyle === 'both' ? '"' : quotationStyle === 'end' ? '"' : '';
	const startQuote = quotationStyle === 'both' ? '"' : '';

	type TextCompletionCandidate = {
		label: string;
		detail: string;
		insertText: string;
		usageCount: number;
	};
	const query = collector.textCtx.tokenText.trim().toLowerCase();
	const candidates: TextCompletionCandidate[] = [];

	if (shouldIncludePayees) {
		payees.forEach((payee: string) => {
			candidates.push({
				label: payee,
				detail: '(payee)',
				insertText: `${startQuote}${payee}${quote}${addSpaceAfter ? ' ' : ''}`,
				usageCount: payeeUsageCounts.get(payee) || 0,
			});
		});
	}

	narrations.forEach((narration: string) => {
		candidates.push({
			label: narration,
			detail: '(narration)',
			insertText: `${startQuote}${narration}${quote}${addSpaceAfter ? ' ' : ''}`,
			usageCount: narrationUsageCounts.get(narration) || 0,
		});
	});

	const rankedCandidates = rankAndSortLabelItems({
		items: candidates,
		query,
		getLabel: candidate => candidate.label,
		getUsageCount: candidate => candidate.usageCount,
		rankFn: rankTextMatchTier,
		getFilterText: label => collector.symbolIndex.getFilterText(label),
	});

	rankedCandidates.forEach((ranked, index) => {
		const candidate = ranked.item;
		const usageDetail = ranked.usageCount > 0
			? `${candidate.detail} | Used ${ranked.usageCount} time${ranked.usageCount === 1 ? '' : 's'}`
			: candidate.detail;
		const normalizedFilterText = query
			? `${query} ${ranked.filterText ?? collector.symbolIndex.getFilterText(candidate.label)}`
			: undefined;
		addCompletionItem(
			collector,
			{ label: candidate.label, kind: CompletionItemKind.Text, detail: usageDetail },
			candidate.insertText,
			ranked.usageCount,
			undefined,
			String(index).padStart(7, '0'),
			normalizedFilterText,
		);
	});
}

export async function addTagCompletions(collector: CompletionCollector): Promise<void> {
	const [tags, usageCounts] = await Promise.all([
		collector.symbolIndex.getTags(),
		collector.symbolIndex.getTagUsageCounts(),
	]);
	const query = collector.textCtx.tokenText.trim().toLowerCase();
	const shouldAddPrefix = !collector.textCtx.afterHash;
	const rankedTags = rankAndSortLabelItems({
		items: tags,
		query,
		getLabel: tag => tag,
		getUsageCount: tag => usageCounts.get(tag) || 0,
		rankFn: rankSymbolLikeMatchTier,
		getFilterText: label => collector.symbolIndex.getFilterText(label),
	});
	rankedTags.forEach(({ item: tag, usageCount }, index) => {
		const detail = usageCount > 0 ? `(tag) | Used ${usageCount} time${usageCount === 1 ? '' : 's'}` : '(tag)';
		addCompletionItem(
			collector,
			{ label: tag, kind: CompletionItemKind.Property, detail },
			shouldAddPrefix ? `#${tag}` : tag,
			usageCount,
			undefined,
			String(index).padStart(7, '0'),
		);
	});
}

export async function addCurrencyCompletions(collector: CompletionCollector): Promise<void> {
	if (shouldSuppressCurrencyForCurrentToken(collector.textCtx.linePrefix)) {
		return;
	}
	const query = collector.textCtx.tokenText.trim().toLowerCase();
	const { startChar, endChar } = collector.textCtx.tokenRange;
	const [currencies, usageCounts] = await Promise.all([
		collector.symbolIndex.getCommodities(),
		collector.symbolIndex.getCommodityUsageCounts(),
	]);
	const rankedCurrencies = rankAndSortLabelItems({
		items: currencies,
		query,
		getLabel: currency => currency,
		getUsageCount: currency => usageCounts.get(currency) || 0,
		rankFn: rankSymbolLikeMatchTier,
		getFilterText: label => collector.symbolIndex.getFilterText(label),
	});

	rankedCurrencies.forEach(({ item: currency, usageCount }, index) => {
		const detail = usageCount > 0
			? `(currency) | Used ${usageCount} time${usageCount === 1 ? '' : 's'}`
			: '(currency)';
		addCompletionItem(
			collector,
			{ label: currency, kind: CompletionItemKind.Unit, detail },
			TextEdit.replace(
				{
					start: { line: collector.position.line, character: startChar },
					end: { line: collector.position.line, character: endChar },
				},
				currency,
			),
			usageCount,
			undefined,
			String(index).padStart(7, '0'),
		);
	});
}

async function getAccountCompletionSnapshotData(symbolIndex: SymbolIndex): Promise<AccountCompletionSnapshotData> {
	const startedAt = performance.now();
	const snapshot = await symbolIndex.getAccountCompletionSnapshot();
	return {
		accounts: snapshot.accounts,
		usageCounts: snapshot.usageCounts,
		closedAccounts: snapshot.closedAccounts,
		fetchMs: performance.now() - startedAt,
	};
}

export async function addAccountCompletions(collector: CompletionCollector): Promise<void> {
	const accountPerfStart = performance.now();
	let currentDate: string | undefined;
	if (collector.textCtx.linePrefix) {
		const dateMatch = collector.textCtx.linePrefix.match(/(\d{4}[-/]\d{2}[-/]\d{2})/);
		if (dateMatch?.[1]) currentDate = dateMatch[1];
	}
	if (!currentDate && collector.document) {
		const startLine = Math.max(0, collector.position.line - 20);
		const endLine = collector.position.line;
		for (let lineNum = endLine; lineNum >= startLine; lineNum--) {
			const lineText = collector.document.getText({
				start: { line: lineNum, character: 0 },
				end: { line: lineNum, character: Number.MAX_SAFE_INTEGER },
			});
			const dateMatch = lineText.match(/^(\d{4}[-/]\d{2}[-/]\d{2})/);
			if (dateMatch?.[1]) {
				currentDate = dateMatch[1];
				logger.debug(`Found date ${currentDate} on line ${lineNum} for completions`);
				break;
			}
		}
	}

	const lineDerivedQuery = deriveAccountQueryFromLine(collector.textCtx.linePrefix);
	const queryFromToken = collector.textCtx.tokenText;
	const query = queryFromToken || lineDerivedQuery;
	const querySource = queryFromToken ? 'token' : 'line';
	const hasActiveQuery = query.length > 0;
	const queryCompileStart = performance.now();
	const compiledQuery = compileAccountQuery(query);
	const queryCompileMs = performance.now() - queryCompileStart;
	const accountMatchScores = new Map<string, number>();
	const accountRanks = new Map<string, AccountMatchRank>();
	const shouldTrace = shouldTraceAccountQuery(collector.textCtx.linePrefix, collector.textCtx.tokenText);
	const snapshotData = await getAccountCompletionSnapshotData(collector.symbolIndex);
	const { accounts, usageCounts: accountUsageCounts, closedAccounts, fetchMs: snapshotFetchMs } = snapshotData;

	if (shouldTrace) {
		logger.info(
			`[account-query] source=${querySource} token="${collector.textCtx.tokenText}" lineDerived="${lineDerivedQuery}" query="${query}" range=${collector.textCtx.tokenRange.startChar}-${collector.textCtx.tokenRange.endChar}`,
		);
	}

	const rankFilterStart = performance.now();
	const filteredAccounts = accounts.filter((account) => {
		if (currentDate && closedAccounts.has(account.name)) {
			const closedDate = closedAccounts.get(account.name);
			if (closedDate && currentDate >= closedDate) return false;
		}

		const usageCount = accountUsageCounts.get(account.name) || 0;
		const rank = hasActiveQuery ? rankCompiledAccountQuery(compiledQuery, account, usageCount) : makeEmptyAccountRank(usageCount);
		if (!rank) return false;
		accountRanks.set(account.name, rank);
		accountMatchScores.set(account.name, rank.tier * 100 + rank.rootQuality * 10 + (rank.tailHit ? 5 : 0));
		return true;
	});
	const rankFilterMs = performance.now() - rankFilterStart;

	const sortStart = performance.now();
	filteredAccounts.sort((a, b) => {
		const rankA = accountRanks.get(a.name);
		const rankB = accountRanks.get(b.name);
		if (rankA && rankB) {
			const rankDiff = compareAccountRank(rankA, rankB);
			if (rankDiff !== 0) return rankDiff;
		}
		const countA = accountUsageCounts.get(a.name) || 0;
		const countB = accountUsageCounts.get(b.name) || 0;
		if (countA !== countB) return countB - countA;
		return a.name.localeCompare(b.name);
	});
	const sortMs = performance.now() - sortStart;

	if (shouldTrace) {
		const top = filteredAccounts.slice(0, 8).map((account) => {
			const rank = accountRanks.get(account.name);
			const usage = accountUsageCounts.get(account.name) || 0;
			return `${account.name} (rank=${JSON.stringify(rank)}, usage=${usage})`;
		});
		logger.info(`[account-query] filtered=${filteredAccounts.length} rankTopN=${top.join(' | ')}`);
	}

	const buildItemsStart = performance.now();
	filteredAccounts.forEach((account, index) => {
		let detail = '';
		const accountName = account.name;
		const usageCount = accountUsageCounts.get(accountName) || 0;
		if (usageCount > 0) {
			detail += `Used ${usageCount} time${usageCount === 1 ? '' : 's'}`;
		}
		if (closedAccounts.has(accountName)) {
			const closedDate = closedAccounts.get(accountName);
			if (closedDate) {
				if (detail) detail += ' | ';
				detail += `Closed on ${closedDate}`;
			}
		}
		addCompletionItem(
			collector,
			{ label: accountName, kind: CompletionItemKind.Field, detail },
			TextEdit.replace(
				{
					start: { line: collector.position.line, character: collector.textCtx.tokenRange.startChar },
					end: { line: collector.position.line, character: collector.textCtx.tokenRange.endChar },
				},
				accountName + ' ',
			),
			usageCount,
			accountMatchScores.get(accountName),
			String(index).padStart(7, '0'),
		);
	});
	const buildItemsMs = performance.now() - buildItemsStart;
	const totalMs = performance.now() - accountPerfStart;
	if (shouldTrace || totalMs > 30) {
		logger.info(
			`[account-query-perf] snapshotFetchMs=${Math.round(snapshotFetchMs)} queryCompileMs=${Math.round(queryCompileMs)} rankFilterMs=${Math.round(rankFilterMs)} sortMs=${Math.round(sortMs)} buildItemsMs=${Math.round(buildItemsMs)} totalMs=${Math.round(totalMs)} accountsTotal=${accounts.length} accountsMatched=${filteredAccounts.length}`,
		);
	}
}

export async function addLinkCompletions(collector: CompletionCollector): Promise<void> {
	const [links, usageCounts] = await Promise.all([
		collector.symbolIndex.getLinks(),
		collector.symbolIndex.getLinkUsageCounts(),
	]);
	const query = collector.textCtx.tokenText.trim().toLowerCase();
	const shouldAddPrefix = !collector.textCtx.afterCaret;
	const rankedLinks = rankAndSortLabelItems({
		items: links,
		query,
		getLabel: link => link,
		getUsageCount: link => usageCounts.get(link) || 0,
		rankFn: rankSymbolLikeMatchTier,
		getFilterText: label => collector.symbolIndex.getFilterText(label),
	});
	rankedLinks.forEach(({ item: link, usageCount }, index) => {
		const detail = usageCount > 0 ? `(link) | Used ${usageCount} time${usageCount === 1 ? '' : 's'}` : '(link)';
		addCompletionItem(
			collector,
			{ label: link, kind: CompletionItemKind.Reference, detail },
			shouldAddPrefix ? `^${link}` : link,
			usageCount,
			undefined,
			String(index).padStart(7, '0'),
		);
	});
}
