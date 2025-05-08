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

import { Logger } from '@bean-lsp/shared';
import { add, formatDate, sub } from 'date-fns';
import { pinyin } from 'pinyin-pro';
import { match, P } from 'ts-pattern';
import {
	CompletionItem,
	CompletionItemKind,
	CompletionList,
	CompletionParams,
	CompletionRegistrationOptions,
	CompletionRequest,
	CompletionTriggerKind,
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
const triggerCharacters = Tuple(['2', '#', '"', '^'] as const);
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

/**
 * Extracts the user's input text at the current position
 *
 * @param document The text document
 * @param position The current cursor position
 * @param triggerCharacter The character that triggered completion
 * @returns The text the user has typed before the cursor
 */
function extractUserInput(
	document: TextDocument,
	position: Position,
	triggerCharacter?: string,
): string {
	// Get the text of the current line up to the cursor position
	const line = document.getText({
		start: { line: position.line, character: 0 },
		end: position,
	});

	// Handle different trigger scenarios
	if (triggerCharacter) {
		// For account triggers (A, L, E, I), we only need what's after the trigger
		if (['A', 'L', 'E', 'I'].includes(triggerCharacter)) {
			// If the last character is the trigger, there's no actual input yet
			if (line.endsWith(triggerCharacter)) {
				return '';
			}

			// Find the last occurrence of the trigger character
			const triggerIndex = line.lastIndexOf(triggerCharacter);
			if (triggerIndex >= 0) {
				return line.substring(triggerIndex + 1);
			}
		}

		// For payee/narration triggers ("), extract what's inside the quotes
		if (triggerCharacter === '"') {
			const lastQuoteIndex = line.lastIndexOf('"');
			if (lastQuoteIndex >= 0) {
				return line.substring(lastQuoteIndex + 1);
			}
		}

		// For tag triggers (#), extract what's after the #
		if (triggerCharacter === '#') {
			const lastHashIndex = line.lastIndexOf('#');
			if (lastHashIndex >= 0) {
				return line.substring(lastHashIndex + 1);
			}
		}

		// For space triggers, extract the last word
		if (triggerCharacter === ' ') {
			const words = line.trim().split(/\s+/);
			return words[words.length - 1] || '';
		}
	}

	// Default case: take the last token after whitespace
	const lastWhitespaceIndex = line.lastIndexOf(' ');
	if (lastWhitespaceIndex >= 0) {
		return line.substring(lastWhitespaceIndex + 1);
	}

	return line;
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
 * @returns Space-separated filter strings for the text
 */
function createFilterString(text: string): string {
	if (!text) return '';

	// Original text in lowercase
	const originalText = text.toLowerCase();

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
 * @param item The completion item to add (label, kind, detail)
 * @param position The position where the completion was triggered
 * @param textEdit The text to insert when the item is selected
 * @param set A set to track already added items and avoid duplicates
 * @param items The array of completion items to add to
 * @param cnt A counter for sorting items when no userInput is provided
 * @param userInput Optional user input text for better scoring and sorting
 * @returns Updated counter value
 */
function addCompletionItem(
	item: { label: string; kind?: CompletionItemKind; detail?: string },
	position: Position,
	textEdit: string | TextEdit,
	set: Set<string>,
	items: CompletionItem[],
	cnt: number,
	userInput?: string,
	usageCount?: number,
) {
	if (set.has(item.label)) {
		return cnt;
	}

	let filterText = undefined;
	if (/^[\w:]+$/.test(item.label)) {
		filterText = item.label;
	} else {
		filterText = createFilterString(item.label);
	}

	// Calculate score for sorting if userInput is provided
	let score = 0;
	if (userInput) {
		// score = scoreMatch(item.label, filterText, userInput);

		// Boost score based on usage count if provided
		if (usageCount !== undefined) {
			// Add a bonus based on usage count, capped at a reasonable value
			// Using 20 points per usage with a max bonus of 200 (for 10+ usages)
			const usageBonus = Math.min(usageCount * 1, 3500);
			score += usageBonus;
		}
	}

	items.push({
		...item,
		kind: item.kind || CompletionItemKind.Text,
		filterText,
		textEdit: typeof textEdit === 'string' ? TextEdit.insert(position, textEdit) : textEdit,
		sortText: String(1000000 - Math.round(score)).padStart(7, '0'),
		// Add data for debugging if needed
		data: userInput ? { score, usageCount } : undefined,
	});
	set.add(item.label);
	return cnt + 1;
}

/**
 * Parameters for the addPayeesAndNarrations function
 */
interface AddPayeesAndNarrationsParams {
	/** The symbol index to retrieve payees/narrations from */
	symbolProvider: SymbolIndex;
	/** The position where the completion was triggered */
	position: Position;
	/** Whether to include payees or just narrations */
	shouldIncludePayees: boolean;
	/** The quote style to use ('none', 'end', 'both') */
	quotationStyle: 'none' | 'end' | 'both';
	/** A set to track already added items */
	existingCompletions: Set<string>;
	/** The array of completion items to add to */
	completions: CompletionItem[];
	/** A counter for sorting when no userInput is provided */
	completionCount: number;
	/** Optional user input for better scoring and sorting */
	filterText?: string | undefined;

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
	params: AddPayeesAndNarrationsParams,
): Promise<number> {
	const {
		symbolProvider,
		position,
		shouldIncludePayees,
		quotationStyle,
		existingCompletions,
		completions,
		completionCount,
		filterText,
		addSpaceAfter,
	} = params;

	// Fetch payees and narrations in parallel
	const [payees, narrations] = await Promise.all([
		shouldIncludePayees ? symbolProvider.getPayees(true, { waitTime: 100 }) : Promise.resolve([]),
		symbolProvider.getNarrations(true, { waitTime: 100 }),
	]);

	// Add payees if requested
	if (shouldIncludePayees) {
		payees.forEach((payee: string) => {
			const quote = quotationStyle === 'both' ? '"' : quotationStyle === 'end' ? '"' : '';
			const startQuote = quotationStyle === 'both' ? '"' : '';
			const updatedCount = addCompletionItem(
				{ label: payee, kind: CompletionItemKind.Text, detail: '(payee)' },
				position,
				// Add space after to allow quick editing between payee and narration
				`${startQuote}${payee}${quote}${addSpaceAfter ? ' ' : ''}`,
				existingCompletions,
				completions,
				completionCount,
				filterText,
			);
			params.completionCount = updatedCount;
		});
	}

	// Add narrations
	narrations.forEach((narration: string) => {
		const quote = quotationStyle === 'both' ? '"' : quotationStyle === 'end' ? '"' : '';
		const startQuote = quotationStyle === 'both' ? '"' : '';
		const updatedCount = addCompletionItem(
			{ label: narration, kind: CompletionItemKind.Text, detail: '(narration)' },
			position,
			`${startQuote}${narration}${quote}${addSpaceAfter ? ' ' : ''}`,
			existingCompletions,
			completions,
			params.completionCount,
			filterText,
		);
		params.completionCount = updatedCount;
	});

	return params.completionCount;
}

/**
 * Adds tags as completion items
 *
 * This function retrieves tags from the symbol index and adds them
 * as completion items.
 *
 * @param symbolIndex The symbol index to retrieve tags from
 * @param position The position where the completion was triggered
 * @param set A set to track already added items
 * @param items The array of completion items to add to
 * @param cnt A counter for sorting when no userInput is provided
 * @param userInput Optional user input for better scoring and sorting
 * @returns Updated counter value
 */
async function addTagCompletions(
	symbolIndex: SymbolIndex,
	position: Position,
	set: Set<string>,
	items: CompletionItem[],
	cnt: number,
	userInput?: string,
): Promise<number> {
	// Fetch tags from the index
	const tags = await symbolIndex.getTags();

	// Add each tag as a completion item
	tags.forEach((tag: string) => {
		cnt = addCompletionItem(
			{ label: tag, kind: CompletionItemKind.Property, detail: '(tag)' },
			position,
			tag,
			set,
			items,
			cnt,
			userInput,
		);
	});

	return cnt;
}

/**
 * Adds currency/commodity completions
 *
 * This function retrieves currencies/commodities from the symbol index
 * and adds them as completion items.
 *
 * @param symbolIndex The symbol index to retrieve currencies from
 * @param position The position where the completion was triggered
 * @param set A set to track already added items
 * @param items The array of completion items to add to
 * @param cnt A counter for sorting when no userInput is provided
 * @param userInput Optional user input for better scoring and sorting
 * @returns Updated counter value
 */
async function addCurrencyCompletions(
	symbolIndex: SymbolIndex,
	position: Position,
	set: Set<string>,
	items: CompletionItem[],
	cnt: number,
	userInput = '',
): Promise<number> {
	// Fetch currencies/commodities from the index
	const currencies = await symbolIndex.getCommodities();

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
		cnt = addCompletionItem(
			{ label: currency, kind: CompletionItemKind.Unit, detail: '(currency)' },
			position,
			TextEdit.replace(
				{
					start: { line: position.line, character: position.character - userInput.length },
					end: { line: position.line, character: position.character },
				},
				currency,
			),
			set,
			items,
			cnt,
			userInput,
		);
	});

	return cnt;
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
 * @param symbolIndex The symbol index to retrieve accounts from
 * @param position The position where the completion was triggered
 * @param triggerChar The trigger character ('A', 'L', 'E', or 'I')
 * @param set A set to track already added items
 * @param items The array of completion items to add to
 * @param cnt A counter for sorting when no userInput is provided
 * @param userInput Optional user input for better scoring and sorting
 * @param currentLine The current line text from the document
 * @param node The current syntax node
 * @param document The text document for additional context
 * @returns Updated counter value
 */
async function addAccountCompletions(
	symbolIndex: SymbolIndex,
	position: Position,
	triggerChar: string,
	set: Set<string>,
	items: CompletionItem[],
	cnt: number,
	userInput?: string,
	currentLine?: string,
	document?: TextDocument,
): Promise<number> {
	let accountsNames: string[] = [];
	// Fetch all account definitions from the index
	const accounts = await symbolIndex.getAccountDefinitions();
	// Get account usage counts for sorting
	const accountUsageCounts = await symbolIndex.getAccountUsageCounts();

	// Get closed accounts with their closing dates
	const closedAccounts = await symbolIndex.getClosedAccounts();

	// Extract current date from the current line if possible
	let currentDate: string | undefined;
	if (currentLine) {
		// Try to match a date pattern in the current line
		const dateMatch = currentLine.match(/(\d{4}[-/]\d{2}[-/]\d{2})/);
		if (dateMatch && dateMatch[1]) {
			currentDate = dateMatch[1];
		}
	}

	// If we still don't have a date and we have a document, try to find
	// the closest date from previous lines
	if (!currentDate && document && position) {
		// Start searching from current line and work backwards
		const startLine = Math.max(0, position.line - 20); // Look up to 20 lines back
		const endLine = position.line;

		// Scan previous lines for dates
		for (let lineNum = endLine; lineNum >= startLine; lineNum--) {
			const lineText = document.getText({
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
		// First, apply the trigger character filter
		// if (triggerChar) {
		// 	if (triggerChar === 'E') {
		// 		// Special case for E: match both Equity and Expenses accounts
		// 		if (!account.startsWith('Equity:') && !account.startsWith('Expenses:')) {
		// 			return false;
		// 		}
		// 	} else if (!account.startsWith(triggerChar)) {
		// 		return false;
		// 	}
		// }

		// Now, check if the account is closed and if the current date is after the closing date
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

		cnt = addCompletionItem(
			{
				label: account,
				kind: CompletionItemKind.Field,
				detail,
			},
			position,
			TextEdit.replace(
				{
					start: { line: position.line, character: position.character - triggerChar.length },
					end: { line: position.line, character: position.character },
				},
				account + ' ',
			),
			set,
			items,
			cnt,
			userInput,
			usageCount,
		);
	});

	return cnt;
}

/**
 * Adds link completions
 *
 * This function retrieves links from the symbol index and adds them
 * as completion items.
 *
 * @param symbolIndex The symbol index to retrieve links from
 * @param position The position where the completion was triggered
 * @param set A set to track already added items
 * @param items The array of completion items to add to
 * @param cnt A counter for sorting when no userInput is provided
 * @param userInput Optional user input for better scoring and sorting
 * @returns Updated counter value
 */
async function addLinkCompletions(
	symbolIndex: SymbolIndex,
	position: Position,
	set: Set<string>,
	items: CompletionItem[],
	cnt: number,
	userInput?: string,
): Promise<number> {
	// Fetch links from the index
	const links = await symbolIndex.getLinks();

	// Add each link as a completion item
	links.forEach((link: string) => {
		cnt = addCompletionItem(
			{ label: link, kind: CompletionItemKind.Reference, detail: '(link)' },
			position,
			link,
			set,
			items,
			cnt,
			userInput,
		);
	});

	return cnt;
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
	private lastCompletionParams: CompletionParams & { version: number } | null = null;
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
		const registerOptions: CompletionRegistrationOptions = {
			documentSelector: [{ language: 'beancount' }],
			triggerCharacters,
		};

		connection.client.register(CompletionRequest.type, registerOptions);
		connection.onCompletion(this.provideCompletionItems);

		// Register the completion item resolve handler
		connection.onCompletionResolve(this.resolveCompletionItem);
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

		if (
			this.lastCompletionParams?.textDocument.uri === params.textDocument.uri
			&& this.lastCompletionParams.position.line === params.position.line
			&& this.lastCompletionParams.position.character === params.position.character
			&& this.lastCompletionParams.context?.triggerKind === params.context?.triggerKind
			&& this.lastCompletionParams.context?.triggerKind === CompletionTriggerKind.Invoked
			&& this.lastCompletionParams.version === document.version
		) {
			return [];
		}
		this.lastCompletionParams = { ...params, version: document.version };
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
		const userInput = extractUserInput(
			document,
			params.position,
			params.context?.triggerCharacter as string,
		);

		// Analyze the token at the current position
		const current = nodeAtPosition(tree.rootNode, params.position, true);

		const currentLine = document.getText({
			start: { line: params.position.line, character: 0 },
			end: { line: params.position.line, character: params.position.character },
		});

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
		let cnt = 0;
		const set = new Set<string>();
		const completionItems: CompletionItem[] = [];

		// Helper function to add a single completion item
		function addItem(item: CompletionItem) {
			if (set.has(item.label as string)) {
				return;
			}

			// Generate filter text for the item
			if (typeof item.label === 'string') {
				item.filterText = createFilterString(item.label);
			}

			completionItems.push(item);
			set.add(item.label as string);
			cnt++;
		}

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
					cnt = await addTagCompletions(this.symbolIndex, position, set, completionItems, cnt, userInput);
					logger.info(`Tags added, items: ${completionItems.length - initialCount}`);
				},
			)
			.with({ triggerCharacter: '^' }, async () => {
				// Link completions when triggered by ^ character
				logger.info('Branch: triggerCharacter ^');
				const initialCount = completionItems.length;
				cnt = await addLinkCompletions(this.symbolIndex, position, set, completionItems, cnt, userInput);
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
					cnt = await addCurrencyCompletions(
						this.symbolIndex,
						position,
						set,
						completionItems,
						cnt,
						userInput,
					);
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
					cnt = await addPayeesAndNarrations({
						symbolProvider: this.symbolIndex,
						position: position,
						shouldIncludePayees: true,
						quotationStyle: 'end',
						existingCompletions: set,
						completions: completionItems,
						completionCount: cnt,
						filterText: userInput,
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
					cnt = await addPayeesAndNarrations({
						symbolProvider: this.symbolIndex,
						position: position,
						shouldIncludePayees: false,
						quotationStyle: 'end',
						existingCompletions: set,
						completions: completionItems,
						completionCount: cnt,
						filterText: userInput,
						addSpaceAfter: false,
					});
					logger.info(`Narrations added, items: ${completionItems.length - initialCount}`);
				},
			)
			.with({ triggerCharacter: '"', currentType: 'narration' }, async () => {
				// Payee and narration completions when positioned at a narration
				logger.info('Branch: triggerCharacter " with narration current');
				const initialCount = completionItems.length;
				cnt = await addPayeesAndNarrations({
					symbolProvider: this.symbolIndex,
					position: position,
					shouldIncludePayees: true,
					quotationStyle: 'both',
					existingCompletions: set,
					completions: completionItems,
					completionCount: cnt,
					filterText: userInput,
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
				cnt = await addPayeesAndNarrations({
					symbolProvider: this.symbolIndex,
					position: position,
					shouldIncludePayees: false,
					quotationStyle: 'end',
					existingCompletions: set,
					completions: completionItems,
					completionCount: cnt,
					filterText: userInput,
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
				cnt = await addPayeesAndNarrations({
					symbolProvider: this.symbolIndex,
					position: position,
					shouldIncludePayees: true,
					quotationStyle: 'end',
					existingCompletions: set,
					completions: completionItems,
					completionCount: cnt,
					filterText: userInput,
					addSpaceAfter: true,
				});
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({ currentType: 'narration' }, async () => {
				// Payee and narration completions when positioned at a narration outside quotes
				logger.info('Branch: narration current');
				const initialCount = completionItems.length;
				cnt = await addPayeesAndNarrations({
					symbolProvider: this.symbolIndex,
					position: position,
					shouldIncludePayees: true,
					quotationStyle: 'both',
					existingCompletions: set,
					completions: completionItems,
					completionCount: cnt,
					filterText: userInput,
					addSpaceAfter: true,
				});
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({ currentType: 'account', parentType: 'posting' }, async () => {
				// Account completions after a posting
				logger.info('Branch: account current, posting parent');
				const initialCount = completionItems.length;
				cnt = await addAccountCompletions(
					this.symbolIndex,
					position,
					userInput ?? '',
					set,
					completionItems,
					cnt,
					userInput,
					info.currentLine,
					document,
				);
				logger.info(`Accounts added, items: ${completionItems.length - initialCount}`);
			})
			.otherwise(() => {
				// No matching context found, provide no completions
				logger.info('No matching branch found');
				return Promise.resolve();
			});
		await p;

		if (completionItems?.length <= 0 && current.type === 'ERROR') {
			let n = current.parent;
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
					},
				)
					.with({ head4ValidTypes: ['account', 'binary_number_expr'] }, async () => {
						const initialCount = completionItems.length;
						cnt = await addCurrencyCompletions(
							this.symbolIndex,
							position,
							set,
							completionItems,
							cnt,
							userInput,
						);
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
							head4ValidTypes: ['date', P.union('balance', 'open', 'close', 'pad', 'document', 'note')],
						},
						{
							head4ValidTypes: ['date', 'txn', 'narration'],
						},
						async () => {
							const initialCount = completionItems.length;
							cnt = await addAccountCompletions(
								this.symbolIndex,
								position,
								userInput ?? '',
								set,
								completionItems,
								cnt,
								userInput,
								info.currentLine,
								document,
							);
							logger.info(`Accounts added, items: ${completionItems.length - initialCount}`);
						},
					)
					.otherwise(() => {
						logger.info(`No matching branch found ${JSON.stringify(validTypes)}`);
						if (cnt <= 0) {
							// for inputing something includes trigger character in narration
							completionItems.push(...this.lastCompletionItems);
						}
					});
				await pp;
			}
		}

		logger.info(`Final completion items: ${completionItems.length}`);
		this.lastCompletionItems = completionItems;
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
