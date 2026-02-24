/**
 * This file implements autocompletion functionality for Beancount files.
 * It includes various types of completions:
 * - Account completions (Assets, Liabilities, Equity, Expenses, Income)
 * - Payee and narration completions
 * - Tag completions
 * - Currency completions
 * - Date completions
 *
 * The file also includes logic for filtering and sorting completions,
 * with special handling for Chinese text using pinyin first letters.
 */

import { Logger } from '@bean-lsp/shared/logger';
import { add, formatDate, sub } from 'date-fns';
import { globalEventBus, GlobalEvents } from '../../utils/event-bus';
import { match, P } from 'ts-pattern';
import {
	CompletionItem,
	CompletionItemKind,
	CompletionList,
	CompletionParams,
	Connection,
	Position,
	TextEdit,
} from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type Parser from 'web-tree-sitter';
import { nodeAtPosition } from '../../common';
import { DocumentStore } from '../../document-store';
import { Trees } from '../../trees';
import { SymbolIndex } from '../symbol-index';
import { Feature } from '../types';

const Tuple = <T extends unknown[]>(xs: readonly [...T]): T => xs as T;

/**
 * Trigger characters for autocompletion:
 * '2' - Date completions
 * '#' - Tag completions
 * '"' - Payee/narration completions
 * '^' - Link completions
 */
export const triggerCharacters = Tuple([
	'2',
	'#',
	'"',
	'^',
] as const);
type TriggerCharacter = (typeof triggerCharacters)[number];

/**
 * Information about the context where completion was triggered
 * Used to determine what kind of completions to provide
 */
export type TriggerInfo = {
	triggerCharacter: TriggerCharacter | undefined;
	currentType: string;
	parentType: string | undefined;
	previousSiblingType: string | undefined;
	previousPreviousSiblingType: string | undefined;
};

type TokenRange = {
	startChar: number;
	endChar: number;
};

type CompletionTextContext = {
	linePrefix: string;
	tokenRange: TokenRange;
	tokenText: string;
	triggerCharacter?: string;
	inOpenQuote: boolean;
	afterHash: boolean;
	afterCaret: boolean;
};

type AccountSegmentMatchKind = 'exact' | 'prefix' | 'substring';

type AccountMatchRank = {
	tier: number;
	matchedSegmentCount: number;
	gapCount: number;
	rootQuality: number;
	tailHit: boolean;
	usageBucket: number;
};

type CompletionIntent =
	| {
		type: 'date';
	}
	| {
		type: 'identifier';
	}
	| {
		type: 'tag';
	}
	| {
		type: 'link';
	}
	| {
		type: 'currency';
	}
	| {
		type: 'payeeNarration';
		params: AddPayeesAndNarrationsParams;
	}
	| {
		type: 'account';
	};

// -----------------------------
// Placeholder reparse utilities
// -----------------------------

/**
 * Helper to find the nearest named ancestor of a given type
 */
function findNamedAncestor(node: Parser.SyntaxNode | null, type: string): Parser.SyntaxNode | null {
	let cur: Parser.SyntaxNode | null = node;
	while (cur) {
		if (cur.isNamed() && cur.type === type) return cur;
		cur = cur.parent;
	}
	return null;
}

/**
 * Context check result from placeholder reparse
 */
type ReparseContext = {
	/** The placeholder node that was inserted */
	placeholderNode: Parser.SyntaxNode;
	/** Ancestor nodes found during the check */
	ancestors: Map<string, Parser.SyntaxNode>;
};

// Placeholder kind controls token scanning rules
type PlaceholderKind = 'account' | 'tag' | 'link' | 'currency' | 'meta';

// Compute left/right token range around the cursor according to kind
function computeTokenRange(fullText: string, offset: number, kind: PlaceholderKind): { start: number; end: number } {
	let start = offset;
	let end = offset;

	const isWhitespace = (ch: string) => /\s/.test(ch);
	const stopChars = new Set(['#', '^', '@', '"', "'", '(', ')', '[', ']', '{', '}', ',', ';']);
	const isStopChar = (ch: string) => stopChars.has(ch) || isWhitespace(ch);

	const isAccountChar = (
		ch: string,
	) => (/[A-Za-z0-9]/.test(ch) || ch === ':' || ch === '_' || ch === '-' || ch === '/' || ch === '.');
	const isTagLinkChar = (ch: string) => (/[A-Za-z0-9]/.test(ch) || ch === '_' || ch === '-');
	const isCurrencyChar = (ch: string) => /[A-Za-z]/.test(ch);
	const isMetaKeyChar = (ch: string) => (/[A-Za-z0-9]/.test(ch) || ch === '_' || ch === '-');

	const isTokenChar = (ch: string) => {
		switch (kind) {
			case 'tag':
			case 'link':
				return isTagLinkChar(ch);
			case 'currency':
				return isCurrencyChar(ch);
			case 'meta':
				return isMetaKeyChar(ch);
			default:
				return isAccountChar(ch);
		}
	};

	// Scan left
	while (start > 0) {
		const ch = fullText.charAt(start - 1);
		// Do not cross stop chars
		if (isStopChar(ch)) break;
		// Do not swallow leading prefix markers for tag/link
		if ((kind === 'tag' || kind === 'link') && (ch === '#' || ch === '^')) break;
		if (!isTokenChar(ch)) break;
		start--;
	}

	// Scan right (rarely needed but keeps symmetry and avoids partial merges)
	while (end < fullText.length) {
		const ch = fullText.charAt(end);
		if (isStopChar(ch)) break;
		if ((kind === 'meta') && (ch === ':' || ch === '"')) break; // don't cross into value
		if (!isTokenChar(ch)) break;
		end++;
	}

	// Special handling for currency: do not cross a leading space on the left
	if (kind === 'currency' && start > 0 && isWhitespace(fullText.charAt(start - 1))) {
		// keep start as-is; already stopped at whitespace
	}

	return { start, end };
}

function normalizePlaceholder(fullText: string, start: number, placeholder: string): string {
	let text = placeholder;
	// Adjacent marker dedup for # and ^
	if (start > 0) {
		const prev = fullText.charAt(start - 1);
		if ((prev === '#' || prev === '^') && (text.startsWith(prev))) {
			text = text.slice(1);
		}
	}
	// Leading space coordination: avoid double space
	if (text.startsWith(' ') && start > 0 && /\s/.test(fullText.charAt(start - 1))) {
		text = text.slice(1);
	}
	return text;
}

/**
 * Performs a placeholder reparse to detect syntax context
 *
 * @param document The text document
 * @param position The cursor position
 * @param placeholder The placeholder text to insert
 * @param ancestorTypes Optional ancestor node types to look for. If provided, all must exist. If undefined, accepts any result.
 * @returns Context information if successful (and all required ancestors found if specified), null otherwise
 */
async function reparseWithPlaceholder(
	document: TextDocument,
	position: Position,
	placeholder: string,
	kind: PlaceholderKind,
	ancestorTypes?: string[],
): Promise<ReparseContext | null> {
	let vt: Parser.Tree | null = null;
	try {
		const fullText = document.getText();
		const offset = document.offsetAt(position);
		const { start, end } = computeTokenRange(fullText, offset, kind);
		const normalized = normalizePlaceholder(fullText, start, placeholder);
		const virtualText = fullText.slice(0, start) + normalized + fullText.slice(end);
		const { getParser } = await import('@bean-lsp/shared/parser');
		const parser = await getParser();
		vt = parser.parse(virtualText);
		const phNode = vt.rootNode.descendantForIndex(start, start + normalized.length);
		if (!phNode) return null;
		const hasError = vt.rootNode.hasError();
		if (hasError && phNode.id === vt.rootNode.id) {
			return null;
		}

		// Be tolerant to global parse errors: only reject when the error/missing
		// is on the path of the placeholder (local context is broken)
		if (hasError) {
			let cur: Parser.SyntaxNode | null = phNode;
			while (cur) {
				if (cur.type === 'ERROR') {
					return null;
				}
				if (typeof cur.isMissing === 'function' && cur.isMissing()) {
					return null;
				}
				cur = cur.parent;
			}
		}

		const ancestors = new Map<string, Parser.SyntaxNode>();

		// If ancestorTypes specified, validate all exist
		if (ancestorTypes && ancestorTypes.length > 0) {
			for (const type of ancestorTypes) {
				const ancestor = findNamedAncestor(phNode, type);
				if (!ancestor) return null; // Required ancestor missing
				ancestors.set(type, ancestor);
			}
		} else {
			// If no specific ancestors required, collect all named ancestors for logging
			let cur: Parser.SyntaxNode | null = phNode;
			while (cur) {
				if (cur.isNamed() && cur.type) {
					ancestors.set(cur.type, cur);
				}
				cur = cur.parent;
			}
		}

		return {
			placeholderNode: phNode,
			ancestors,
		};
	} catch (e) {
		logger.debug(`Placeholder reparse failed: ${e}`);
		return null;
	} finally {
		// Clean up the temporary tree
		if (vt) {
			try {
				vt.delete();
			} catch {
				// Ignore cleanup errors
			}
		}
	}
}

export function buildCompletionTextContext(
	document: TextDocument,
	position: Position,
	triggerCharacter?: string,
): CompletionTextContext {
	const linePrefix = document.getText({
		start: { line: position.line, character: 0 },
		end: position,
	});
	const isTokenChar = (ch: string) => /[\p{L}\p{N}:：._/-]/u.test(ch);
	let startChar = linePrefix.length;
	while (startChar > 0 && isTokenChar(linePrefix.charAt(startChar - 1))) {
		startChar--;
	}
	const endChar = linePrefix.length;
	const tokenText = linePrefix.slice(startChar, endChar);
	const leftChar = startChar > 0 ? linePrefix.charAt(startChar - 1) : '';
	const quoteCount = linePrefix.split('"').length - 1;

	return {
		linePrefix,
		tokenRange: { startChar, endChar },
		tokenText: normalizeAccountQueryToken(tokenText),
		triggerCharacter,
		inOpenQuote: quoteCount % 2 === 1,
		afterHash: tokenText.startsWith('#') || leftChar === '#',
		afterCaret: tokenText.startsWith('^') || leftChar === '^',
	};
}

function normalizeAccountQueryToken(input: string): string {
	return input
		.replace(/：/g, ':')
		.replace(/^["'#^]+/, '')
		.trim();
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
	return 0;
}

function normalizeSymbolLikeText(input: string): string {
	return input.toLowerCase().replace(/[_\-./:\\s]/g, '');
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

type RankedLabelItem<T> = {
	item: T;
	label: string;
	usageCount: number;
	tier: number;
	filterText?: string;
};

function rankAndSortLabelItems<T>(params: {
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

export function resolveCompletionIntent(
	info: TriggerInfo,
	textCtx: CompletionTextContext,
): CompletionIntent[] {
	const intents: CompletionIntent[] = [];
	const numberExprTypes = new Set(['unary_number_expr', 'number', 'binary_number_expr']);
	const trimmedPrefix = textCtx.linePrefix.trim();
	const suppressCurrencyForCurrentToken = shouldSuppressCurrencyForCurrentToken(textCtx.linePrefix);

	if (trimmedPrefix.length > 0 && /^\d{0,4}$/.test(trimmedPrefix)) {
		intents.push({ type: 'date' });
	}
	if (info.currentType === 'identifier' && info.previousSiblingType === 'date') {
		intents.push({ type: 'identifier' });
	}
	if (info.triggerCharacter === '#' || info.currentType === '#' || textCtx.afterHash) {
		intents.push({ type: 'tag' });
	}
	if (info.triggerCharacter === '^' || textCtx.afterCaret) {
		intents.push({ type: 'link' });
	}
	if (
		(numberExprTypes.has(info.previousSiblingType || '') && info.previousPreviousSiblingType === 'account')
		|| (
			info.currentType === 'flag'
			&& info.previousSiblingType === 'account'
			&& /^PSTCURM$/.test(textCtx.tokenText)
		)
		|| (
			info.currentType === 'currency'
			&& numberExprTypes.has(info.previousSiblingType || '')
		)
	) {
		if (!suppressCurrencyForCurrentToken) {
			intents.push({ type: 'currency' });
		}
	}

	if (
		(
			info.triggerCharacter === '"'
			&& (
				info.previousSiblingType === 'txn'
				|| info.currentType === 'payee'
				|| (
					info.previousSiblingType === 'txn'
					&& info.previousPreviousSiblingType === 'date'
				)
			)
		)
		|| (
			textCtx.inOpenQuote
			&& (info.previousSiblingType === 'txn' || info.currentType === 'payee')
		)
	) {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: true,
				quotationStyle: 'end',
				addSpaceAfter: true,
			},
		});
	}
	if (
		(
			info.triggerCharacter === '"'
			&& (info.previousSiblingType === 'payee' || info.previousSiblingType === 'string')
		)
		|| (
			textCtx.inOpenQuote
			&& (info.previousSiblingType === 'payee' || info.previousSiblingType === 'string')
		)
		|| (
			info.currentType === 'ERROR'
			&& info.previousSiblingType === 'string'
			&& info.previousPreviousSiblingType === 'txn'
			&& (info.triggerCharacter === '"' || textCtx.inOpenQuote)
		)
	) {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: false,
				quotationStyle: 'end',
				addSpaceAfter: false,
			},
		});
	}
	if (
		(
			info.triggerCharacter === '"'
			&& info.currentType === 'narration'
		)
		|| (textCtx.inOpenQuote && info.currentType === 'narration')
	) {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: true,
				quotationStyle: 'both',
				addSpaceAfter: false,
			},
		});
	}
	if (
		info.currentType === 'ERROR'
		&& info.previousSiblingType === 'txn'
		&& info.previousPreviousSiblingType === 'date'
		&& (info.triggerCharacter === '"' || textCtx.inOpenQuote)
	) {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: true,
				quotationStyle: 'end',
				addSpaceAfter: true,
			},
		});
	}
	if (info.currentType === 'narration') {
		intents.push({
			type: 'payeeNarration',
			params: {
				shouldIncludePayees: true,
				quotationStyle: 'both',
				addSpaceAfter: true,
			},
		});
	}
	if (info.currentType === 'account' && info.parentType === 'posting') {
		intents.push({ type: 'account' });
	}

	// Lexical fallback for unstable AST states.
	if (intents.length === 0) {
		if (textCtx.inOpenQuote) {
			intents.push({
				type: 'payeeNarration',
				params: {
					shouldIncludePayees: true,
					quotationStyle: 'end',
					addSpaceAfter: true,
				},
			});
		}
		if (textCtx.afterHash) {
			intents.push({ type: 'tag' });
		}
		if (textCtx.afterCaret) {
			intents.push({ type: 'link' });
		}
		if (/^[AEIL][:A-Za-z0-9._/-]*$/i.test(textCtx.tokenText)) {
			intents.push({ type: 'account' });
		}
	}

	// Deduplicate while preserving order.
	const seen = new Set<string>();
	return intents.filter((intent) => {
		const key = JSON.stringify(intent);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

/**
 * Adds a completion item to the list with proper filtering and sorting
 *
 * @param params Parameters for adding the completion item
 * @returns Updated counter value
 */
function addCompletionItem(
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

	// Get filter text from symbol index cache
	const filterText = filterTextOverride ?? collector.symbolIndex.getFilterText(item.label);

	// Calculate score for sorting if user input is provided
	let score = matchScore ? Math.max(0, matchScore) * 100 : 0;
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
		// Add data for debugging if needed
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

// no wrapper: callers should directly pass context fields to addCompletionItem

/**
 * Common context for completion functions
 */
interface CompletionCollector {
	/** The symbol index to retrieve data from */
	symbolIndex: SymbolIndex;
	/** The position where the completion was triggered */
	position: Position;
	/** A set to track already added items */
	existingCompletions: Set<string>;
	/** The array of completion items to add to */
	completions: CompletionItem[];
	/** Optional document for additional context */
	document?: TextDocument;
	/** Whether to enable Chinese pinyin fuzzy filter */
	enablePinyin: boolean;
	/** Unified completion text context */
	textCtx: CompletionTextContext;
}

/**
 * Parameters for the addPayeesAndNarrations function
 */
interface AddPayeesAndNarrationsParams {
	/** Whether to include payees or just narrations */
	shouldIncludePayees: boolean;
	/** The quote style to use ('none', 'end', 'both') */
	quotationStyle: 'none' | 'end' | 'both';
	/** Whether to add a space after the text edit */
	addSpaceAfter: boolean;
}

/**
 * Adds payees and narrations as completion items
 *
 * This function retrieves payees and/or narrations from the symbol index
 * and adds them as completion items. It handles different quote styles:
 * - 'none': No quotes
 * - 'end': Only closing quote (")
 * - 'both': Both opening and closing quotes ("...")
 *
 * @param params Object containing all parameters for the function
 * @returns Updated counter value
 */
async function addPayeesAndNarrations(
	collector: CompletionCollector,
	params: AddPayeesAndNarrationsParams,
): Promise<void> {
	const {
		shouldIncludePayees,
		quotationStyle,
		addSpaceAfter,
	} = params;

	// Fetch values and usage counts in parallel to support stable tie-break by usage
	const [payees, narrations, payeeUsageCounts, narrationUsageCounts] = await Promise.all([
		shouldIncludePayees ? collector.symbolIndex.getPayees(true, { waitTime: 100 }) : Promise.resolve([]),
		collector.symbolIndex.getNarrations(true, { waitTime: 100 }),
		shouldIncludePayees ? collector.symbolIndex.getPayeeUsageCounts() : Promise.resolve(new Map<string, number>()),
		collector.symbolIndex.getNarrationUsageCounts(),
	]);

	// Precompute quote strings based on the chosen style
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

	// Add payees if requested
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

	// Add narrations
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

/**
 * Adds tags as completion items
 *
 * This function retrieves tags from the symbol index and adds them
 * as completion items.
 *
 * @param collector Completion context
 */
async function addTagCompletions(collector: CompletionCollector): Promise<void> {
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
		const detail = usageCount > 0
			? `(tag) | Used ${usageCount} time${usageCount === 1 ? '' : 's'}`
			: '(tag)';
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

/**
 * Adds currency/commodity completions
 *
 * This function retrieves currencies/commodities from the symbol index
 * and adds them as completion items.
 *
 * @param collector Completion context
 */
async function addCurrencyCompletions(collector: CompletionCollector): Promise<void> {
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
					start: {
						line: collector.position.line,
						character: startChar,
					},
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
		// Prefer earlier match; if same start index, prefer shorter span.
		if (index < current.index || (index === current.index && nextSpan < currentSpan)) {
			firstMatchByKind[kind] = { index, endIndex };
		}
	};

	// 1) Single-segment matching.
	for (let i = startIdx; i < accountParts.length; i++) {
		const kind = scoreSegmentMatch(queryPart, accountParts[i]!, accountPartsRaw[i]!);
		if (!kind) continue;
		updateCandidate(kind, i, i);
	}

	// 2) Collapsed multi-segment matching, e.g. `FundsCMB` -> `Funds:CMB`.
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
			if (kind) {
				updateCandidate(kind, i, j);
			}
		}
	}

	if (firstMatchByKind.exact) {
		return { ...firstMatchByKind.exact, kind: 'exact' };
	}
	if (firstMatchByKind.prefix) {
		return { ...firstMatchByKind.prefix, kind: 'prefix' };
	}
	if (firstMatchByKind.substring) {
		return { ...firstMatchByKind.substring, kind: 'substring' };
	}
	return null;
}

export function rankAccountQuery(
	query: string,
	account: string,
	usageCount: number = 0,
): AccountMatchRank | null {
	const normalizedQueryParts = normalizeAccountQueryToken(query)
		.split(':')
		.map(p => p.trim().toLowerCase())
		.filter(Boolean);
	if (normalizedQueryParts.length === 0) {
		return {
			tier: 0,
			matchedSegmentCount: 0,
			gapCount: 0,
			rootQuality: 0,
			tailHit: false,
			usageBucket: Math.min(usageCount, 20),
		};
	}

	const accountPartsRaw = account.split(':');
	const accountParts = accountPartsRaw.map(p => p.toLowerCase());
	if (accountParts.length === 0) {
		return null;
	}

	const rootQuality = scoreRootMatch(normalizedQueryParts[0]!, accountParts[0]!);
	if (rootQuality < 0) {
		return null;
	}

	let segmentStart = 1;
	let prefixCount = 0;
	let substringCount = 0;
	let gapCount = 0;
	let lastMatchIndex = 0;
	let tailHit = false;
	const queryTailIdx = normalizedQueryParts.length - 1;
	for (let i = 1; i < normalizedQueryParts.length; i++) {
		const queryPart = normalizedQueryParts[i]!;
		const match = findBestSegmentMatch(accountParts, accountPartsRaw, segmentStart, queryPart);
		if (!match) {
			return null;
		}
		if (match.kind === 'prefix') prefixCount++;
		if (match.kind === 'substring') substringCount++;
		gapCount += Math.max(0, match.index - lastMatchIndex - 1);
		lastMatchIndex = match.endIndex;
		segmentStart = match.endIndex + 1;
		if (i === queryTailIdx) {
			tailHit = match.endIndex === accountParts.length - 1;
		}
	}

	let tier = 2;
	if (substringCount > 0) {
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
		usageBucket: Math.min(usageCount, 20),
	};
}

function compareAccountRank(a: AccountMatchRank, b: AccountMatchRank): number {
	if (a.tier !== b.tier) return b.tier - a.tier;
	if (a.matchedSegmentCount !== b.matchedSegmentCount) return b.matchedSegmentCount - a.matchedSegmentCount;
	if (a.tailHit !== b.tailHit) return Number(b.tailHit) - Number(a.tailHit);
	if (a.gapCount !== b.gapCount) return a.gapCount - b.gapCount;
	if (a.rootQuality !== b.rootQuality) return b.rootQuality - a.rootQuality;
	if (a.usageBucket !== b.usageBucket) return b.usageBucket - a.usageBucket;
	return 0;
}

export function deriveAccountQueryFromLine(linePrefix: string): string {
	const normalizedLine = linePrefix.replace(/：/g, ':');
	// Prefer strict account query with at least one non-empty segment after ':'.
	const strict = normalizedLine.match(/(?:^|\s)([AEIL](?::[A-Za-z0-9._/-]+)+)$/i);
	if (strict && strict[1]) {
		return normalizeAccountQueryToken(strict[1]);
	}
	// Then fallback to looser account-like token.
	const m = normalizedLine.match(/(?:^|\s)([AEIL](?::[A-Za-z0-9._/-]*)*)$/i);
	if (m && m[1]) {
		return normalizeAccountQueryToken(m[1]);
	}
	const lastToken = normalizedLine.trim().split(/\s+/).at(-1) ?? '';
	return normalizeAccountQueryToken(lastToken);
}

function shouldTraceAccountQuery(linePrefix: string, tokenText: string): boolean {
	return /(?:^|\s)[AEIL](?::|：)/i.test(linePrefix) || /^[AEIL](?::|：)/i.test(tokenText);
}

function getCurrentWhitespaceToken(linePrefix: string): string {
	const normalized = linePrefix.replace(/：/g, ':');
	const currentToken = normalized.match(/(?:^|\s)(\S*)$/)?.[1] ?? '';
	return currentToken.trim();
}

function isNumericInputToken(token: string): boolean {
	if (!token) return false;
	return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(token);
}

// Generic currency guard:
// - While user is typing a numeric token, keep number input uninterrupted.
// - Once number token is finished (cursor after whitespace), currency can be suggested.
export function shouldSuppressCurrencyForCurrentToken(linePrefix: string): boolean {
	const currentToken = getCurrentWhitespaceToken(linePrefix);
	return isNumericInputToken(currentToken);
}

/**
 * Adds account completions using token range replacement and token query filtering.
 */
async function addAccountCompletions(collector: CompletionCollector): Promise<void> {
	let accountsNames: string[] = [];
	// Fetch all account definitions from the index
	const accounts = await collector.symbolIndex.getAccountDefinitions();
	// Get account usage counts for sorting
	const accountUsageCounts = await collector.symbolIndex.getAccountUsageCounts();

	// Get closed accounts with their closing dates
	const closedAccounts = await collector.symbolIndex.getClosedAccounts();

	// Extract current date from the current line if possible
	let currentDate: string | undefined;
	if (collector.textCtx.linePrefix) {
		// Try to match a date pattern in the current line
		const dateMatch = collector.textCtx.linePrefix.match(/(\d{4}[-/]\d{2}[-/]\d{2})/);
		if (dateMatch && dateMatch[1]) {
			currentDate = dateMatch[1];
		}
	}

	// If we still don't have a date and we have a document, try to find
	// the closest date from previous lines
	if (!currentDate && collector.document && collector.position) {
		// Start searching from current line and work backwards
		const startLine = Math.max(0, collector.position.line - 20); // Look up to 20 lines back
		const endLine = collector.position.line;

		// Scan previous lines for dates
		for (let lineNum = endLine; lineNum >= startLine; lineNum--) {
			const lineText = collector.document.getText({
				start: { line: lineNum, character: 0 },
				end: { line: lineNum, character: Number.MAX_SAFE_INTEGER },
			});

			// Look for a date at the beginning of the line (common in Beancount files)
			const dateMatch = lineText.match(/^(\d{4}[-/]\d{2}[-/]\d{2})/);
			if (dateMatch && dateMatch[1]) {
				currentDate = dateMatch[1];
				logger.debug(`Found date ${currentDate} on line ${lineNum} for completions`);
				break;
			}
		}
	}

	if (accounts.length <= 0) {
		accountsNames = [...accountUsageCounts.keys()];
	} else {
		accountsNames = accounts.map((account) => account.name);
	}

	accountsNames = Array.from(new Set(accountsNames));
	const lineDerivedQuery = deriveAccountQueryFromLine(collector.textCtx.linePrefix);
	const queryFromToken = collector.textCtx.tokenText;
	const query = queryFromToken || lineDerivedQuery;
	const querySource = queryFromToken ? 'token' : 'line';
	const hasActiveQuery = query.length > 0;
	const accountMatchScores = new Map<string, number>();
	const accountRanks = new Map<string, AccountMatchRank>();
	const shouldTrace = shouldTraceAccountQuery(collector.textCtx.linePrefix, collector.textCtx.tokenText);

	if (shouldTrace) {
		logger.info(
			`[account-query] source=${querySource} token="${collector.textCtx.tokenText}" lineDerived="${lineDerivedQuery}" query="${query}" range=${collector.textCtx.tokenRange.startChar}-${collector.textCtx.tokenRange.endChar}`,
		);
	}

	// Filter accounts by lifecycle and token query (supports skipped account segments).
	const filteredAccounts = accountsNames.filter((account) => {
		// check if the account is closed and if the current date is after the closing date
		if (currentDate && closedAccounts.has(account)) {
			const closedDate = closedAccounts.get(account);
			if (closedDate && currentDate >= closedDate) {
				// The account is closed before or on the current date, so exclude it
				return false;
			}
		}

		const usageCount = accountUsageCounts.get(account) || 0;
		const rank = hasActiveQuery ? rankAccountQuery(query, account, usageCount) : {
			tier: 0,
			matchedSegmentCount: 0,
			gapCount: 0,
			rootQuality: 0,
			tailHit: false,
			usageBucket: Math.min(usageCount, 20),
		};
		if (!rank) {
			return false;
		}
		accountRanks.set(account, rank);
		accountMatchScores.set(account, rank.tier * 100 + rank.rootQuality * 10 + (rank.tailHit ? 5 : 0));
		return true;
	});

	// Sort by query relevance first, then usage count.
	filteredAccounts.sort((a, b) => {
		const rankA = accountRanks.get(a);
		const rankB = accountRanks.get(b);
		if (rankA && rankB) {
			const rankDiff = compareAccountRank(rankA, rankB);
			if (rankDiff !== 0) {
				return rankDiff;
			}
		}
		const countA = accountUsageCounts.get(a) || 0;
		const countB = accountUsageCounts.get(b) || 0;
		if (countA !== countB) {
			return countB - countA;
		}
		return a.localeCompare(b);
	});

	if (shouldTrace) {
		const top = filteredAccounts.slice(0, 8).map((account) => {
			const rank = accountRanks.get(account);
			const usage = accountUsageCounts.get(account) || 0;
			return `${account} (rank=${JSON.stringify(rank)}, usage=${usage})`;
		});
		logger.info(`[account-query] filtered=${filteredAccounts.length} rankTopN=${top.join(' | ')}`);
	}

	// Add each filtered account as a completion item
	filteredAccounts.forEach((account, index) => {
		let detail = '';

		// Add usage count to the detail if available
		const usageCount = accountUsageCounts.get(account) || 0;
		if (usageCount > 0) {
			detail += `Used ${usageCount} time${usageCount === 1 ? '' : 's'}`;
		}

		// Add closing status to the detail if available
		if (closedAccounts.has(account)) {
			const closedDate = closedAccounts.get(account);
			if (closedDate) {
				if (detail) detail += ' | ';
				detail += `Closed on ${closedDate}`;
			}
		}

		addCompletionItem(
			collector,
			{
				label: account,
				kind: CompletionItemKind.Field,
				detail,
			},
			TextEdit.replace(
				{
					start: { line: collector.position.line, character: collector.textCtx.tokenRange.startChar },
					end: { line: collector.position.line, character: collector.textCtx.tokenRange.endChar },
				},
				account + ' ',
				),
				usageCount,
				accountMatchScores.get(account),
				String(index).padStart(7, '0'),
			);
	});
}

/**
 * Adds link completions
 *
 * This function retrieves links from the symbol index and adds them
 * as completion items.
 *
 * @param collector Completion context
 */
async function addLinkCompletions(collector: CompletionCollector): Promise<void> {
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
		const detail = usageCount > 0
			? `(link) | Used ${usageCount} time${usageCount === 1 ? '' : 's'}`
			: '(link)';
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

// Create a logger for the completions module
const logger = new Logger('completions');

/**
 * Completion feature implementation for Beancount language server
 *
 * This class provides completion suggestions for:
 * - Account names (Assets, Liabilities, Equity, Expenses, Income)
 * - Payees and narrations
 * - Tags
 * - Currencies
 * - Dates
 *
 * It implements context-aware matching to provide appropriate completions
 * based on the cursor position and surrounding tokens.
 */
export class CompletionFeature implements Feature {
	private connection: Connection | null = null;
	private enablePinyin: boolean = false;
	private hasFetchedCompletionConfig: boolean = false;
	private requestSeq: number = 0;
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly symbolIndex: SymbolIndex,
	) {}

	/**
	 * Registers the completion provider with the language server
	 *
	 * @param connection The language server connection
	 */
	register(connection: Connection): void {
		this.connection = connection;
		connection.onCompletion(this.provideCompletionItems);
		connection.onCompletionResolve(this.resolveCompletionItem);
		globalEventBus.on(GlobalEvents.ConfigurationChanged, () => {
			void this.refreshCompletionConfig();
		});
	}

	/**
	 * Gets the configuration for Chinese pinyin fuzzy filter
	 *
	 * @param scopeUri Optional URI to use as scope for configuration
	 * @returns Whether pinyin filter is enabled
	 */
	private async getEnablePinyinConfig(scopeUri?: string): Promise<boolean> {
		if (!this.hasFetchedCompletionConfig) {
			await this.refreshCompletionConfig(scopeUri);
		}
		return this.enablePinyin;
	}

	private async refreshCompletionConfig(scopeUri?: string): Promise<void> {
		try {
			const config = await this.connection!.workspace.getConfiguration({
				scopeUri,
				section: 'beanLsp.completion',
			});
			this.enablePinyin = config?.enableChinesePinyinFilter ?? false;
			this.hasFetchedCompletionConfig = true;
			// Update symbol index with the new pinyin setting
			this.symbolIndex.setEnablePinyin(this.enablePinyin);
			logger.debug(`Completion config refreshed: enableChinesePinyinFilter=${this.enablePinyin}`);
		} catch (e) {
			logger.debug(`Failed to refresh completion config: ${e}`);
			this.hasFetchedCompletionConfig = true; // avoid repeated fetch in error loop
		}
	}

	/**
	 * Resolves additional information for a completion item that has been selected
	 *
	 * This method is called when a user selects a completion item from the list.
	 * It can provide additional information like documentation, more details, etc.
	 *
	 * @param item The selected completion item to resolve
	 * @returns The completion item with additional information
	 */
	resolveCompletionItem = (item: CompletionItem): CompletionItem => {
		// Currently, we don't need to add any additional information
		// But the method must be implemented to handle the protocol request
		return item;
	};

	/**
	 * Provides completion items based on the context
	 *
	 * This method analyzes the token at the current position, determines
	 * what kind of completions are appropriate, and returns relevant items.
	 *
	 * @param params Completion parameters from the client
	 * @returns Array of completion items
	 */
	provideCompletionItems = async (
		params: CompletionParams,
	): Promise<CompletionItem[] | CompletionList | null> => {
		const requestId = ++this.requestSeq;
		const document = await this.documents.retrieve(params.textDocument.uri);
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return CompletionList.create([]);
		}
		const textCtx = buildCompletionTextContext(
			document,
			params.position,
			params.context?.triggerCharacter as string | undefined,
		);
		logger.info(
			`[completion-context] requestId=${requestId} triggerKind=${params.context?.triggerKind ?? 'n/a'} triggerChar="${params.context?.triggerCharacter ?? ''}" token="${textCtx.tokenText}" range=${textCtx.tokenRange.startChar}-${textCtx.tokenRange.endChar} cursor=${params.position.character} isIncomplete=true`,
		);
		if (textCtx.tokenRange.endChar !== params.position.character) {
			logger.warn(
				`[completion-context] requestId=${requestId} stale-range tokenEnd=${textCtx.tokenRange.endChar} cursor=${params.position.character}`,
			);
		}

		// Check if this is a closing quote
		if (params.context?.triggerCharacter === '"') {
			if (!textCtx.inOpenQuote) {
				return CompletionList.create([]); // Don't trigger completion for closing quotes
			}
		}

		// Analyze the token at the current position
		const current = nodeAtPosition(tree.rootNode, params.position, true);

		// Get completion items based on the context
		const completionItems = await this.calcCompletionItems(
			{
				currentType: current.type,
				parentType: current.parent?.type,
				triggerCharacter: params.context?.triggerCharacter as TriggerCharacter,
				previousSiblingType: current.previousSibling?.type,
				previousPreviousSiblingType: current.previousSibling?.previousSibling?.type,
			},
			params.position,
			current,
			textCtx,
			document,
		);
		logger.info(
			`[completion-context] requestId=${requestId} itemsCount=${completionItems.length}`,
		);

		return CompletionList.create(completionItems, true);
	};

	/**
	 * Calculates appropriate completion items based on context
	 *
	 * This method uses pattern matching to determine what kind of completions
	 * to provide based on the trigger information and surrounding tokens.
	 *
	 * @param info Information about the trigger context
	 * @param position The current cursor position
	 * @param textCtx Unified text context around cursor
	 * @returns Array of completion items
	 */
	async calcCompletionItems(
		info: TriggerInfo,
		position: Position,
		current: Parser.SyntaxNode,
		textCtx: CompletionTextContext,
		document?: TextDocument,
	): Promise<CompletionItem[]> {
		const completionItems: CompletionItem[] = [];

		// Get pinyin configuration
		const enablePinyin = await this.getEnablePinyinConfig(document?.uri);

		// Create common completion context
		const collector: CompletionCollector = {
			symbolIndex: this.symbolIndex,
			position,
			existingCompletions: new Set<string>(),
			completions: completionItems,
			document,
			enablePinyin,
			textCtx,
		};

		// Helper function to add a single completion item
		const addItem = (item: CompletionItem) => {
			if (collector.existingCompletions.has(item.label as string)) {
				return;
			}

			// Generate filter text for the item using symbol index cache
			if (typeof item.label === 'string') {
				item.filterText = collector.symbolIndex.getFilterText(item.label);
			}

			completionItems.push(item);
			collector.existingCompletions.add(item.label as string);
		};

		logger.info(`Starting completion with info: ${JSON.stringify(info)}`);
		const intents = resolveCompletionIntent(info, textCtx);
		for (const intent of intents) {
			const initialCount = completionItems.length;
			switch (intent.type) {
				case 'date': {
					const d = new Date();
					const yesterday = sub(d, { days: 1 });
					const dayBeforeYesterday = sub(d, { days: 2 });
					const tomorrow = add(d, { days: 1 });

					const dateSet = new Set<string>();
					const standardDates = [d, yesterday, tomorrow, dayBeforeYesterday];
					const formattedStandardDates = standardDates.map(d => formatDate(d, 'yyyy-MM-dd'));
					formattedStandardDates.forEach(dateStr => dateSet.add(dateStr));

					if (document && position) {
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
						addItem({
							label: dateStr,
							sortText: String.fromCharCode(65 + idx),
							kind: CompletionItemKind.Constant,
							detail: '',
						});
					});

					Array.from(dateSet)
						.filter(date => !formattedStandardDates.includes(date))
						.sort()
						.reverse()
						.forEach((dateStr, idx) => {
							addItem({
								label: dateStr,
								sortText: String.fromCharCode(65 + formattedStandardDates.length + idx),
								kind: CompletionItemKind.Constant,
								detail: '(recent)',
							});
						});
					break;
				}
				case 'identifier':
					['open', 'close', 'balance', 'pad', 'document', 'note'].forEach((t) => {
						addItem({ label: t, kind: CompletionItemKind.Field });
					});
					break;
				case 'tag':
					await addTagCompletions(collector);
					break;
				case 'link':
					await addLinkCompletions(collector);
					break;
				case 'currency':
					await addCurrencyCompletions(collector);
					break;
				case 'payeeNarration':
					await addPayeesAndNarrations(collector, intent.params);
					break;
				case 'account':
					await addAccountCompletions(collector);
					break;
			}
			if (completionItems.length > initialCount) {
				break;
			}
		}

		if (current.type === 'ERROR') {
			let n = current.parent;
			while (completionItems.length <= 0 && n) {
				let childCount = n?.childCount ?? 0;
				if (childCount === 1 && n!.child(0)?.type === 'ERROR') {
					n = n!.previousNamedSibling;
					childCount = n?.childCount ?? 0;
				}
				if (childCount > 0) {
					const childrenType = n!.children.map(c => c.type);
					const validTypes = childrenType.filter(t => t !== 'ERROR' && t.length > 1);
					const pp = match(
						{
							validTypes,
							head4ValidTypes: validTypes.slice(0, 4),
							triggerCharacter: info.triggerCharacter,
							tokenText: textCtx.tokenText,
						},
					)
						.with({ head4ValidTypes: ['account', 'binary_number_expr'] }, async () => {
							if (shouldSuppressCurrencyForCurrentToken(textCtx.linePrefix)) {
								return;
							}
							const initialCount = completionItems.length;
							await addCurrencyCompletions(collector);
							logger.info(`Currencies added, items: ${completionItems.length - initialCount}`);
						})
						.with(
							{
								validTypes: [
									'date',
									'txn',
									'payee',
									'narration',
									'posting',
								],
							},
							{
								head4ValidTypes: ['date', 'txn', 'payee', 'narration'],
							},
							{
								head4ValidTypes: ['date', 'txn', 'payee', 'posting'],
							},
							{
								head4ValidTypes: ['date', 'txn', 'narration', 'posting'],
							},
							{
								head4ValidTypes: [
									'date',
									P.union('balance', 'open', 'close', 'pad', 'document', 'note'),
								],
							},
							{ head4ValidTypes: ['date', 'txn', 'narration'] },
							{ head4ValidTypes: ['date', 'txn', 'narration', 'tags_links'] },
							{ head4ValidTypes: ['date', 'txn', 'narration', 'key_value'] },
							{ head4ValidTypes: ['date', P.union('pad', 'balance'), P.union('account', 'identifier')] },
							{ head4ValidTypes: ['date', 'pad', 'identifier', 'identifier'] },
							{
								head4ValidTypes: [P._, P._, P.union('atat', 'at'), 'number'],
								tokenText: P.string.regex(/^[AEIL]+$/),
							},
							async () => {
								const initialCount = completionItems.length;
								await addAccountCompletions(collector);
								logger.info(`Accounts added, items: ${completionItems.length - initialCount}`);
							},
						)
						.otherwise(() => {
							logger.info(`No matching branch found ${JSON.stringify(validTypes)}`);
						});
					await pp;
				}
				if (completionItems.length > 0) {
					break;
				}
				n = n?.children.filter(q => q.type !== 'ERROR')?.at?.(-1) ?? null;
			}
		}

		// Fallback: placeholder reparse to detect various syntax contexts
		// Try all possible placeholder types and let the syntax tree tell us what fits
		if (completionItems.length === 0 && document) {
			try {
				const initial = completionItems.length;

				// Define all possible completion scenarios to try
				type CompletionScenario = {
					placeholder: string;
					kind?: PlaceholderKind;
					ancestorTypes?: string[]; // If undefined, accept any result
					onSuccess: (ctx: ReparseContext) => Promise<void>;
					description: string;
				};

				const scenarios: CompletionScenario[] = [
					// Account completions (works in many contexts: posting, directives, etc.)
					{
						placeholder: 'Assets:Bank',
						kind: 'account',
						onSuccess: async () => {
							await addAccountCompletions(collector);
						},
						description: 'account',
					},
					// Tag completions (works in tags_links, pushtag, poptag, etc.)
					{
						placeholder: '#tag',
						kind: 'tag',
						onSuccess: async () => {
							await addTagCompletions(collector);
						},
						description: 'tag',
					},
					// Currency completions (works in price_annotation, amount, etc.)
					{
						placeholder: ' CNY',
						kind: 'currency',
						onSuccess: async () => {
							await addCurrencyCompletions(collector);
						},
						description: 'currency',
					},
					// Link completions
					{
						placeholder: '^link',
						kind: 'link',
						onSuccess: async () => {
							await addLinkCompletions(collector);
						},
						description: 'link',
					},
					// Metadata key (for key_value contexts)
					{
						placeholder: 'somekey: "value"',
						kind: 'meta',
						onSuccess: async () => {
							// Could add metadata key completions here in the future
							logger.info('Fallback: metadata key_value context detected');
						},
						description: 'metadata_key_value',
					},
				];

				// Try each scenario until one succeeds
				for (const scenario of scenarios) {
					if (completionItems.length > initial) {
						break; // Already found completions, stop
					}

					const ctx = await reparseWithPlaceholder(
						document,
						position,
						scenario.placeholder[0] === info.triggerCharacter
							? scenario.placeholder.slice(1)
							: scenario.placeholder,
						scenario.kind!,
						scenario.ancestorTypes,
					);

					if (ctx) {
						await scenario.onSuccess(ctx);
						if (completionItems.length > initial) {
							const ancestorTypes = Array.from(ctx.ancestors.keys()).join(' > ');
							logger.info(
								`Fallback: ${scenario.description} (${ancestorTypes}), added ${
									completionItems.length - initial
								} items`,
							);
							break;
						}
					}
				}
			} catch (e) {
				logger.info(`Fallback (placeholder reparse) failed: ${e}`);
			}
		}

		logger.info(`Final completion items: ${completionItems.length}`);
		return completionItems;
	}
}
