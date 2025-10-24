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

import { getParser, Logger } from '@bean-lsp/shared';
import { add, formatDate, sub } from 'date-fns';
import { pinyin } from 'pinyin-pro';
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
import { getPinyinFirstLetters, processChineseSegment, segmentText } from './chinese-pinyin';

const Tuple = <T extends unknown[]>(xs: readonly [...T]): T => xs as T;

/**
 * Trigger characters for autocompletion:
 * '2' - Date completions
 * '#' - Tag completions
 * '"' - Payee/narration completions
 * '^' - Reserved
 */
export const triggerCharacters = Tuple(['2', '#', '"', '^'] as const);
type TriggerCharacter = (typeof triggerCharacters)[number];

/**
 * Information about the context where completion was triggered
 * Used to determine what kind of completions to provide
 */
type TriggerInfo = {
	triggerCharacter: TriggerCharacter | undefined;
	currentType: string;
	parentType: string | undefined;
	previousSiblingType: string | undefined;
	previousPreviousSiblingType: string | undefined;
	currentLine: string;
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
		const parser = await getParser();
		vt = parser.parse(virtualText);
		const phNode = vt.rootNode.descendantForIndex(start, start + normalized.length);
		if (!phNode) return null;

		// Be tolerant to global parse errors: only reject when the error/missing
		// is on the path of the placeholder (local context is broken)
		if (vt.rootNode.hasError()) {
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

/**
 * Result of extracting user input
 */
type ExtractedUserInput = {
	/** The text the user has typed (relevant portion for filtering) */
	userInput: string;
	/** The full current line text up to the cursor position */
	currentLine: string;
};

/**
 * Extracts the user's input text at the current position
 *
 * @param document The text document
 * @param position The current cursor position
 * @param triggerCharacter The character that triggered completion
 * @returns Object containing userInput and currentLine
 */
function extractUserInput(
	document: TextDocument,
	position: Position,
	triggerCharacter?: string,
): ExtractedUserInput {
	// Get the text of the current line up to the cursor position
	const currentLine = document.getText({
		start: { line: position.line, character: 0 },
		end: position,
	});

	let userInput = '';

	// Handle different trigger scenarios
	if (triggerCharacter) {
		// For account triggers (A, L, E, I), we only need what's after the trigger
		if (['A', 'L', 'E', 'I'].includes(triggerCharacter)) {
			// If the last character is the trigger, there's no actual input yet
			if (currentLine.endsWith(triggerCharacter)) {
				userInput = '';
			} else {
				// Find the last occurrence of the trigger character
				const triggerIndex = currentLine.lastIndexOf(triggerCharacter);
				if (triggerIndex >= 0) {
					userInput = currentLine.substring(triggerIndex + 1);
				}
			}
		} else if (triggerCharacter === '"') {
			// For payee/narration triggers ("), extract what's inside the quotes
			const lastQuoteIndex = currentLine.lastIndexOf('"');
			if (lastQuoteIndex >= 0) {
				userInput = currentLine.substring(lastQuoteIndex + 1);
			}
		} else if (triggerCharacter === '#') {
			// For tag triggers (#), extract what's after the #
			const lastHashIndex = currentLine.lastIndexOf('#');
			if (lastHashIndex >= 0) {
				userInput = currentLine.substring(lastHashIndex + 1);
			}
		} else if (triggerCharacter === ' ') {
			// For space triggers, extract the last word
			const words = currentLine.trim().split(/\s+/);
			userInput = words[words.length - 1] || '';
		}
	}

	// Default case: take the last token after whitespace
	if (!userInput && !triggerCharacter) {
		const lastWhitespaceIndex = currentLine.lastIndexOf(' ');
		if (lastWhitespaceIndex >= 0) {
			userInput = currentLine.substring(lastWhitespaceIndex + 1);
		} else {
			userInput = currentLine;
		}
	}

	return {
		userInput,
		currentLine,
	};
}

/**
 * Creates filter strings for completion items
 *
 * This function generates multiple variations of the input text
 * to allow fuzzy searching with pinyin support for Chinese characters.
 *
 * Examples of filter variations generated:
 *
 * Example 1: "华夏恒生ETF联接A"
 * - Original: "华夏恒生etf联接a"
 * - Pinyin first letters + Latin: "hxhsetflja"
 * - Full pinyin: "hua xia heng sheng etf lian jie a"
 * - Segment-based variations: "huaxiahengsheng", "etf", "lianjie", "a"
 * - First letters only: "hxhslja"
 *
 * Example 2: "中证500ETF"
 * - Original: "中证500etf"
 * - Pinyin first letters + Latin: "zz500etf"
 * - Full pinyin: "zhong zheng 500 etf"
 * - Segment-based variations: "zhongzheng", "500", "etf"
 * - First letters only: "zzetf"
 *
 * Example 3: "招商银行App"
 * - Original: "招商银行app"
 * - Pinyin first letters + Latin: "zsyhapp"
 * - Full pinyin: "zhao shang yin hang app"
 * - Segment-based variations: "zhaoshangyinhang", "app"
 * - First letters only: "zsyha"
 *
 * @param text The text to create filter strings for
 * @param enablePinyin Whether to enable Chinese pinyin fuzzy filter
 * @returns Space-separated filter strings for the text
 */
function createFilterString(text: string, enablePinyin: boolean = true): string {
	if (!text) return '';

	// Original text in lowercase
	const originalText = text.toLowerCase();

	// If pinyin is disabled, only return the original text
	if (!enablePinyin) {
		return originalText;
	}

	// Full pinyin conversion with spaces between each character's pinyin
	const fullPinyin = pinyin(text, { toneType: 'none', type: 'array' })
		.map(p => p.toLowerCase())
		.join(' ');

	// Enhanced first letter extraction with preserved non-Chinese characters
	const enhancedFirstLetters = getPinyinFirstLetters(text);

	// Segment the text by script type
	const segments = segmentText(text);

	// Process segments to create diverse filter variations
	const processedSegments: string[] = [];
	const wordFirstLetters: string[] = [];

	// Process each segment based on its type
	for (const segment of segments) {
		if (segment.type === 'chinese') {
			// Add Chinese-specific variations
			const variations = processChineseSegment(segment.text);
			processedSegments.push(...variations);

			// Add first letters to wordFirstLetters array
			for (const p of pinyin(segment.text, { toneType: 'none', type: 'array' })) {
				if (p && p.length > 0) {
					wordFirstLetters.push(p[0]!.toLowerCase());
				}
			}
		} else if (segment.type === 'latin') {
			// Add Latin-specific variations
			const { variations, firstLetters } = processLatinSegment(segment.text);
			processedSegments.push(...variations);
			wordFirstLetters.push(...firstLetters);
		}
	}

	// Generate combined first letters of all segments
	const combinedFirstLetters = wordFirstLetters.join('');

	// Create partial match patterns (subsequences) for better fuzzy matching
	const partialMatches: string[] = [];

	// Generate subsequences of reasonable length (max 8 chars)
	// This helps match partial inputs like "hxetf" for "华夏ETF联接"
	const maxSubsequenceLength = Math.min(8, enhancedFirstLetters.length);
	for (let i = 0; i < enhancedFirstLetters.length; i++) {
		for (let j = i + 2; j <= i + maxSubsequenceLength && j <= enhancedFirstLetters.length; j++) {
			const subsequence = enhancedFirstLetters.substring(i, j);
			if (subsequence.length >= 2) {
				partialMatches.push(subsequence);
			}
		}
	}

	// Combine all filter variations, removing duplicates
	const allVariations = [
		originalText,
		enhancedFirstLetters,
		fullPinyin,
		combinedFirstLetters,
		...processedSegments,
		...partialMatches,
	];

	// Remove duplicates before joining
	const uniqueVariations = Array.from(new Set(allVariations));

	return uniqueVariations.join(' ');
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
): void {
	if (collector.existingCompletions.has(item.label)) {
		return;
	}

	let filterText: string | undefined = undefined;
	if (/^[\w:\s]+$/.test(item.label)) {
		filterText = item.label;
		let matches = item.label.match(/:[^:]+/g);
		if (matches && matches?.length > 0) {
			if (matches?.length === 1) {
				// Make the suffix appear twice to boost the score when it is a one level account
				matches = [matches[0], matches[0]];
			}

			// boots the score of suffixes match
			matches?.forEach(suffix => {
				filterText = `${item.label[0]}${suffix} ${filterText}`;
			});
		}
	} else {
		filterText = createFilterString(item.label, collector.enablePinyin);
	}

	// Calculate score for sorting if userInput is provided
	let score = 0;
	if (collector.userInput) {
		// score = scoreMatch(item.label, filterText, userInput);

		// Boost score based on usage count if provided
		if (usageCount !== undefined) {
			// Add a bonus based on usage count, capped at a reasonable value
			// Using 20 points per usage with a max bonus of 200 (for 10+ usages)
			const usageBonus = Math.min(usageCount * 1, 3500);
			score += usageBonus;
		}
	}

	const completionItem: CompletionItem = {
		...item,
		kind: item.kind || CompletionItemKind.Text,
		filterText,
		textEdit: typeof textEdit === 'string' ? TextEdit.insert(collector.position, textEdit) : textEdit,
		// Add data for debugging if needed
		data: collector.userInput ? { score, usageCount } : undefined,
	};
	if (score > 0) {
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
	/** Optional user input for better scoring and sorting */
	userInput?: string;
	/** Optional current line text for context */
	currentLine?: string;
	/** Optional document for additional context */
	document?: TextDocument;
	/** Whether to enable Chinese pinyin fuzzy filter */
	enablePinyin: boolean;
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

	// Fetch payees and narrations in parallel
	const [payees, narrations] = await Promise.all([
		shouldIncludePayees ? collector.symbolIndex.getPayees(true, { waitTime: 100 }) : Promise.resolve([]),
		collector.symbolIndex.getNarrations(true, { waitTime: 100 }),
	]);

	// Precompute quote strings based on the chosen style
	const quote = quotationStyle === 'both' ? '"' : quotationStyle === 'end' ? '"' : '';
	const startQuote = quotationStyle === 'both' ? '"' : '';

	// Add payees if requested
	if (shouldIncludePayees) {
		payees.forEach((payee: string) => {
			addCompletionItem(
				collector,
				{ label: payee, kind: CompletionItemKind.Text, detail: '(payee)' },
				`${startQuote}${payee}${quote}${addSpaceAfter ? ' ' : ''}`,
			);
		});
	}

	// Add narrations
	narrations.forEach((narration: string) => {
		addCompletionItem(
			collector,
			{ label: narration, kind: CompletionItemKind.Text, detail: '(narration)' },
			`${startQuote}${narration}${quote}${addSpaceAfter ? ' ' : ''}`,
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
	// Fetch tags from the index
	const tags = await collector.symbolIndex.getTags();

	const shouldAddPrefix = collector.currentLine && !collector.currentLine.endsWith('#');

	// Add each tag as a completion item
	tags.forEach((tag: string) => {
		addCompletionItem(
			collector,
			{ label: tag, kind: CompletionItemKind.Property, detail: '(tag)' },
			shouldAddPrefix ? `#${tag}` : tag,
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
	const userInput = collector.userInput ?? '';
	// Fetch currencies/commodities from the index
	const currencies = await collector.symbolIndex.getCommodities();

	// Add each currency as a completion item
	currencies.filter(c => {
		if (!userInput) {
			return true;
		}
		if (!/^[A-Z]/.test(userInput)) {
			return true;
		}
		return c.startsWith(userInput);
	}).forEach((currency: string) => {
		addCompletionItem(
			collector,
			{ label: currency, kind: CompletionItemKind.Unit, detail: '(currency)' },
			TextEdit.replace(
				{
					start: {
						line: collector.position.line,
						character: collector.position.character - userInput.length,
					},
					end: { line: collector.position.line, character: collector.position.character },
				},
				currency,
			),
		);
	});
}

/**
 * Parameters for addAccountCompletions
 */
interface AddAccountCompletionsParams {
	/** The trigger character or empty string */
	triggerChar: string;
}

/**
 * Adds account completions based on the trigger letter
 *
 * This function filters accounts from the symbol index based on their type:
 * - 'A': Assets accounts
 * - 'L': Liabilities accounts
 * - 'E': Both Equity and Expenses accounts (special case)
 * - 'I': Income accounts
 *
 * It adds appropriate detail information to distinguish account types,
 * particularly for the 'E' trigger which can match two account types.
 *
 * Closed accounts are excluded from completions to keep the suggestions relevant.
 *
 * @param params Account completion parameters
 * @returns Updated counter value
 */
async function addAccountCompletions(
	collector: CompletionCollector,
	params: AddAccountCompletionsParams,
): Promise<void> {
	const {
		triggerChar,
	} = params;
	let accountsNames: string[] = [];
	// Fetch all account definitions from the index
	const accounts = await collector.symbolIndex.getAccountDefinitions();
	// Get account usage counts for sorting
	const accountUsageCounts = await collector.symbolIndex.getAccountUsageCounts();

	// Get closed accounts with their closing dates
	const closedAccounts = await collector.symbolIndex.getClosedAccounts();

	// Extract current date from the current line if possible
	let currentDate: string | undefined;
	if (collector.currentLine) {
		// Try to match a date pattern in the current line
		const dateMatch = collector.currentLine.match(/(\d{4}[-/]\d{2}[-/]\d{2})/);
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

	// Filter accounts based on the trigger character and closed status
	const filteredAccounts = accountsNames.filter((account) => {
		// check if the account is closed and if the current date is after the closing date
		if (currentDate && closedAccounts.has(account)) {
			const closedDate = closedAccounts.get(account);
			if (closedDate && currentDate >= closedDate) {
				// The account is closed before or on the current date, so exclude it
				return false;
			}
		}

		return true;
	});

	// Sort accounts by usage count (most used first)
	filteredAccounts.sort((a, b) => {
		const countA = accountUsageCounts.get(a) || 0;
		const countB = accountUsageCounts.get(b) || 0;
		return countB - countA; // Descending order
	});

	// Compute how many characters to delete from the left of the cursor once
	let deleteCount = triggerChar.length;
	// If we have a concrete userInput, prefer replacing exactly that
	if (!deleteCount && collector.userInput && collector.userInput.length > 0) {
		deleteCount = collector.userInput.length;
	}
	// Otherwise, derive by scanning left for an account-like token
	if (!deleteCount && collector.document) {
		try {
			const lineText = collector.document.getText({
				start: { line: collector.position.line, character: 0 },
				end: { line: collector.position.line, character: collector.position.character },
			});
			let i = lineText.length - 1;
			const isAccountCharLocal = (
				ch: string,
			) => (/[A-Za-z0-9]/.test(ch) || ch === ':' || ch === '_' || ch === '-' || ch === '/' || ch === '.');
			while (i >= 0 && isAccountCharLocal(lineText.charAt(i))) {
				deleteCount++;
				i--;
			}
		} catch {
			// ignore
		}
	}

	// Add each filtered account as a completion item
	filteredAccounts.forEach((account) => {
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
					start: { line: collector.position.line, character: collector.position.character - deleteCount },
					end: { line: collector.position.line, character: collector.position.character },
				},
				account + ' ',
			),
			usageCount,
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
	// Fetch links from the index
	const links = await collector.symbolIndex.getLinks();

	const shouldAddPrefix = collector.currentLine && !collector.currentLine.endsWith('^');

	// Add each link as a completion item
	links.forEach((link: string) => {
		addCompletionItem(
			collector,
			{ label: link, kind: CompletionItemKind.Reference, detail: '(link)' },
			shouldAddPrefix ? `^${link}` : link,
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
	private lastCompletionItems: CompletionItem[] = [];
	private connection: Connection | null = null;
	private enablePinyin: boolean = false;
	private hasFetchedCompletionConfig: boolean = false;
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
		// Preload completion-related configuration once and listen for changes
		void this.refreshCompletionConfig();
		connection.onDidChangeConfiguration(() => {
			void this.refreshCompletionConfig();
		});
	}

	/**
	 * Gets the configuration for Chinese pinyin fuzzy filter
	 *
	 * @returns Whether pinyin filter is enabled
	 */
	private async getEnablePinyinConfig(): Promise<boolean> {
		if (!this.hasFetchedCompletionConfig) {
			await this.refreshCompletionConfig();
		}
		return this.enablePinyin;
	}

	private async refreshCompletionConfig(): Promise<void> {
		try {
			const config = await this.connection!.workspace.getConfiguration({ section: 'beanLsp.completion' });
			this.enablePinyin = config?.enableChinesePinyinFilter ?? false;
			this.hasFetchedCompletionConfig = true;
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
		const document = await this.documents.retrieve(params.textDocument.uri);
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return CompletionList.create([]);
		}

		// Check if this is a closing quote
		if (params.context?.triggerCharacter === '"') {
			// Get the text of the current line up to the cursor position
			const line = document.getText({
				start: { line: params.position.line, character: 0 },
				end: params.position,
			});

			// Count quotes in the line
			const quoteCount = line.split('"').length - 1;
			// If there's an even number of quotes, this is a closing quote
			if (quoteCount % 2 === 0) {
				return CompletionList.create([]); // Don't trigger completion for closing quotes
			}
		}

		// Extract user input for better sorting
		const { userInput, currentLine } = extractUserInput(
			document,
			params.position,
			params.context?.triggerCharacter as string,
		);

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
				currentLine,
			},
			params.position,
			current,
			userInput,
			document,
		);

		return CompletionList.create(completionItems, false);
	};

	/**
	 * Calculates appropriate completion items based on context
	 *
	 * This method uses pattern matching to determine what kind of completions
	 * to provide based on the trigger information and surrounding tokens.
	 *
	 * @param info Information about the trigger context
	 * @param position The current cursor position
	 * @param userInput Optional user input for scoring and sorting
	 * @returns Array of completion items
	 */
	async calcCompletionItems(
		info: TriggerInfo,
		position: Position,
		current: Parser.SyntaxNode,
		userInput?: string,
		document?: TextDocument,
	): Promise<CompletionItem[]> {
		const completionItems: CompletionItem[] = [];

		// Get pinyin configuration
		const enablePinyin = await this.getEnablePinyinConfig();

		// Create common completion context
		const collector: CompletionCollector = {
			symbolIndex: this.symbolIndex,
			position,
			existingCompletions: new Set<string>(),
			completions: completionItems,
			userInput,
			currentLine: info.currentLine,
			document,
			enablePinyin,
		};

		// Helper function to add a single completion item
		const addItem = (item: CompletionItem) => {
			if (collector.existingCompletions.has(item.label as string)) {
				return;
			}

			// Generate filter text for the item
			if (typeof item.label === 'string') {
				item.filterText = createFilterString(item.label, enablePinyin);
			}

			completionItems.push(item);
			collector.existingCompletions.add(item.label as string);
		};

		logger.info(`Starting completion with info: ${JSON.stringify(info)}`);
		const p: Promise<void> = match({ ...info, userInput })
			.with({ triggerCharacter: '2', currentLine: P.string.regex(/^\d*$/) }, async () => {
				// Date completions: Provide the current date, yesterday, day before yesterday, and tomorrow
				logger.info('Branch: triggerCharacter 2');
				const d = new Date();
				const yesterday = sub(d, { days: 1 });
				const dayBeforeYesterday = sub(d, { days: 2 });
				const tomorrow = add(d, { days: 1 });

				// Create a set to track all dates for deduplication
				const dateSet = new Set<string>();

				// Add standard dates in specific order
				const standardDates = [d, yesterday, tomorrow, dayBeforeYesterday];
				const formattedStandardDates = standardDates.map(d => formatDate(d, 'yyyy-MM-dd'));

				// Add these standard dates to the set for deduplication
				formattedStandardDates.forEach(dateStr => dateSet.add(dateStr));

				// Find recent dates from previous lines if document is available
				if (document && position) {
					// Start searching from current line and work backwards
					const startLine = Math.max(0, position.line - 50); // Look up to 50 lines back
					const endLine = position.line;
					const recentDates: string[] = [];

					// Scan previous lines for dates
					for (let lineNum = endLine; lineNum >= startLine; lineNum--) {
						const lineText = document.getText({
							start: { line: lineNum, character: 0 },
							end: { line: lineNum, character: Number.MAX_SAFE_INTEGER },
						});

						// Find all dates in the line
						const dateMatches = lineText.match(/\d{4}[-/]\d{2}[-/]\d{2}/g);
						if (dateMatches) {
							dateMatches.forEach(date => {
								// Only add if not already in the set
								if (!dateSet.has(date)) {
									dateSet.add(date);
									recentDates.push(date);
								}
							});
						}
					}

					logger.info(`Found ${recentDates.length} recent dates from previous lines`);
				}

				// First add standard dates in the specified order
				formattedStandardDates.forEach((dateStr, idx) => {
					addItem({
						label: dateStr,
						sortText: String.fromCharCode(65 + idx), // A, B, C, D for the standard dates
						kind: CompletionItemKind.Constant,
						detail: '', // No detail for standard dates
					});
				});

				// Then add recent dates from the document, sorted by recency (most recent first)
				const recentDatesFromDocument = Array.from(dateSet)
					.filter(date => !formattedStandardDates.includes(date))
					.sort()
					.reverse();

				recentDatesFromDocument.forEach((dateStr, idx) => {
					addItem({
						label: dateStr,
						sortText: String.fromCharCode(65 + formattedStandardDates.length + idx), // E, F, G, etc. for recent dates
						kind: CompletionItemKind.Constant,
						detail: '(recent)',
					});
				});

				logger.info(`Date completions added, items: ${completionItems.length}`);
			})
			.with({ currentType: 'identifier', previousSiblingType: P.union('date') }, async () => {
				['open', 'close', 'balance', 'pad', 'document', 'note'].forEach((t) => {
					addItem({ label: t, kind: CompletionItemKind.Field });
				});
				logger.info(`Identifier completions added, items: ${completionItems.length}`);
			})
			.with(
				{ triggerCharacter: '#' },
				{ currentType: '#' },
				async () => {
					// Tag completions when triggered by # character
					logger.info('Branch: triggerCharacter #');
					const initialCount = completionItems.length;
					await addTagCompletions(collector);
					logger.info(`Tags added, items: ${completionItems.length - initialCount}`);
				},
			)
			.with({ triggerCharacter: '^' }, async () => {
				// Link completions when triggered by ^ character
				logger.info('Branch: triggerCharacter ^');
				const initialCount = completionItems.length;
				await addLinkCompletions(collector);
				logger.info(`Links added, items: ${completionItems.length - initialCount}`);
			})
			.with(
				{
					previousSiblingType: P.union('unary_number_expr', 'number', 'binary_number_expr'),
					previousPreviousSiblingType: 'account',
				},
				{
					// Currency completions after a account (staring with flag leetters)
					currentType: 'flag',
					previousSiblingType: 'account',
					userInput: P.string.regex(/^PSTCURM$/),
				},
				{
					currentType: 'currency',
					previousSiblingType: P.union('unary_number_expr', 'number', 'binary_number_expr'),
				},
				async () => {
					// Currency completions after a number and space
					logger.info('Branch: number in posting - currency context');
					const initialCount = completionItems.length;
					await addCurrencyCompletions(collector);
					logger.info(`Currencies added, items: ${completionItems.length - initialCount}`);
				},
			)
			.with(
				{ triggerCharacter: '"', previousSiblingType: 'txn' },
				{
					triggerCharacter: '"',
					currentType: 'payee',
				},
				{
					triggerCharacter: '"',
					previousSiblingType: 'txn',
					previousPreviousSiblingType: 'date',
				},
				async () => {
					// Payee and narration completions after a transaction keyword
					logger.info('Branch: triggerCharacter " with txn sibling');
					const initialCount = completionItems.length;
					await addPayeesAndNarrations(collector, {
						shouldIncludePayees: true,
						quotationStyle: 'end',
						addSpaceAfter: true,
					});
					logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
				},
			)
			.with(
				{ triggerCharacter: '"', previousSiblingType: 'payee' },
				{ triggerCharacter: '"', previousSiblingType: 'string' },
				async () => {
					// Narration completions only after a payee
					logger.info('Branch: triggerCharacter " with payee sibling');
					const initialCount = completionItems.length;
					await addPayeesAndNarrations(collector, {
						shouldIncludePayees: false,
						quotationStyle: 'end',
						addSpaceAfter: false,
					});
					logger.info(`Narrations added, items: ${completionItems.length - initialCount}`);
				},
			)
			.with({ triggerCharacter: '"', currentType: 'narration' }, async () => {
				// Payee and narration completions when positioned at a narration
				logger.info('Branch: triggerCharacter " with narration current');
				const initialCount = completionItems.length;
				await addPayeesAndNarrations(collector, {
					shouldIncludePayees: true,
					quotationStyle: 'both',
					addSpaceAfter: false,
				});
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({
				triggerCharacter: '"',
				currentType: 'ERROR',
				previousSiblingType: 'string',
				previousPreviousSiblingType: 'txn',
			}, async () => {
				// Narration completions in error recovery mode after string and txn
				logger.info('Branch: triggerCharacter " with ERROR current, string sibling, txn previous');
				const initialCount = completionItems.length;
				await addPayeesAndNarrations(collector, {
					shouldIncludePayees: false,
					quotationStyle: 'end',
					addSpaceAfter: false,
				});
				logger.info(`Narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({
				triggerCharacter: '"',
				currentType: 'ERROR',
				previousSiblingType: 'txn',
				previousPreviousSiblingType: 'date',
			}, async () => {
				// Payee and narration completions in error recovery mode after txn and date
				logger.info('Branch: triggerCharacter " with ERROR current, txn sibling, date previous');
				const initialCount = completionItems.length;
				await addPayeesAndNarrations(collector, {
					shouldIncludePayees: true,
					quotationStyle: 'end',
					addSpaceAfter: true,
				});
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({ currentType: 'narration' }, async () => {
				// Payee and narration completions when positioned at a narration outside quotes
				logger.info('Branch: narration current');
				const initialCount = completionItems.length;
				await addPayeesAndNarrations(collector, {
					shouldIncludePayees: true,
					quotationStyle: 'both',
					addSpaceAfter: true,
				});
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({ currentType: 'account', parentType: 'posting' }, async () => {
				// Account completions after a posting
				logger.info('Branch: account current, posting parent');
				const initialCount = completionItems.length;
				await addAccountCompletions(collector, {
					triggerChar: userInput ?? '',
				});
				logger.info(`Accounts added, items: ${completionItems.length - initialCount}`);
			})
			.otherwise(() => {
				// No matching context found, provide no completions
				logger.info('No matching branch found');
				return Promise.resolve();
			});
		await p;

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
							userInput,
						},
					)
						.with({ head4ValidTypes: ['account', 'binary_number_expr'] }, async () => {
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
								userInput: P.string.regex(/^[AEIL]+$/),
							},
							async () => {
								const initialCount = completionItems.length;
								await addAccountCompletions(collector, {
									triggerChar: userInput ?? '',
								});
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
							await addAccountCompletions(collector, {
								triggerChar: '',
							});
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
		this.lastCompletionItems = completionItems;
		if (completionItems.length <= 0) {
			// for inputting something includes trigger character in narration
			completionItems.push(...this.lastCompletionItems);
		}
		return completionItems;
	}
}

/**
 * Processes a Latin text segment to generate filter variations
 * Handles English/Latin text to support acronym-based filtering
 *
 * @param text The Latin text to process
 * @returns Object with filter strings and first letters of words
 */
function processLatinSegment(text: string): { variations: string[]; firstLetters: string[] } {
	const variations: string[] = [];
	const firstLetters: string[] = [];

	// 1. Add the whole segment (all lowercase)
	const latinSegment = text.toLowerCase();
	variations.push(latinSegment);

	// 2. Split by word boundaries and get first letters
	const words = latinSegment.split(/[\s_-]+/).filter(w => w.length > 0);
	if (words.length > 1) {
		// If multiple words, add first letter of each (acronym)
		const acronym = words.map(w => w[0]!).join('');
		variations.push(acronym);
		firstLetters.push(...words.map(w => w[0]!));
	} else if (words.length === 1) {
		// If single word, just add first letter to firstLetters
		firstLetters.push(words[0]![0]!);
	}

	return { variations, firstLetters };
}
