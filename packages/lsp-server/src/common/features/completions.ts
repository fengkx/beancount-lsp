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
	CompletionParams,
	CompletionRegistrationOptions,
	CompletionRequest,
	Connection,
	Position,
	TextDocument,
	TextEdit,
} from 'vscode-languageserver';
import { deflate } from 'zlib';
import { asTsPoint, nodeAtPosition } from '../common';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { SymbolIndex } from './symbol-index';
import { Feature } from './types';

const Tuple = <T extends unknown[]>(xs: readonly [...T]): T => xs as T;

/**
 * Trigger characters for autocompletion:
 * '2' - Date completions
 * '#' - Tag completions
 * '"' - Payee/narration completions
 * '^' - Reserved
 * ' ' - Currency completions after numbers
 * 'A', 'L', 'E', 'I' - First letters of Beancount account types:
 *   'A' - Assets
 *   'L' - Liabilities
 *   'E' - Equity and Expenses (both start with E)
 *   'I' - Income
 */
const triggerCharacters = Tuple(['2', '#', '"', '^', ' ', 'A', 'L', 'E', 'I'] as const);
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
	descendantForPositionType: string | undefined;
	lastChildType: string | undefined;
	lastCurrentChildTypeInError?: string;
};

/**
 * Checks if a character is a Chinese character
 * This covers the main CJK unified ideograph blocks
 *
 * @param char The character to check
 * @returns Whether the character is a Chinese character
 */
function isChineseChar(char: string): boolean {
	// Handle common Chinese character ranges
	return /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf\uf900-\ufaff]/.test(
		char,
	);
}

/**
 * Determines the script type of a character
 * Used for text segmentation in mixed language contexts
 *
 * @param char The character to check
 * @returns The script type: 'chinese', 'latin', or 'other'
 */
function getScriptType(char: string): 'chinese' | 'latin' | 'other' {
	if (isChineseChar(char)) return 'chinese';
	if (/[a-zA-Z0-9]/.test(char)) return 'latin';
	return 'other';
}

/**
 * Type representing a segment of text with its script type
 * Used to process mixed Chinese-English text appropriately
 */
type TextSegment = {
	text: string;
	type: 'chinese' | 'latin' | 'other';
};

/**
 * Segments text into chunks of the same script type
 * This helps process mixed Chinese-English text appropriately
 *
 * For example, "华夏ETF基金" would be segmented into:
 * [
 *   { text: "华夏", type: "chinese" },
 *   { text: "ETF", type: "latin" },
 *   { text: "基金", type: "chinese" }
 * ]
 *
 * @param text The text to segment
 * @returns Array of text segments with their script types
 */
function segmentText(text: string): TextSegment[] {
	if (!text) return [];

	const segments: TextSegment[] = [];
	let currentSegment = '';
	let currentType: 'chinese' | 'latin' | 'other' | null = null;

	for (let i = 0; i < text.length; i++) {
		const char = text.charAt(i);
		const type = getScriptType(char);

		if (currentType === null) {
			currentType = type;
			currentSegment = char;
		} else if (type === currentType) {
			currentSegment += char;
		} else {
			segments.push({ text: currentSegment, type: currentType });
			currentSegment = char;
			currentType = type;
		}
	}

	if (currentSegment) {
		segments.push({ text: currentSegment, type: currentType as 'chinese' | 'latin' | 'other' });
	}

	return segments;
}

/**
 * Gets the first letter of each pinyin word for Chinese characters
 * and preserves Latin characters. This is crucial for filtering Chinese text.
 *
 * This function supports filtering by pinyin first letters and mixed Chinese-English text.
 *
 * Examples:
 * - "华夏恒生ETF联接A" → "hxhsetflja"
 * - "中证500ETF" → "zz500etf"
 * - "Alipay转账" → "alipayzz"
 * - "招商银行App" → "zsyhapp"
 *
 * @param text The text to process
 * @returns A string with pinyin first letters and preserved Latin text
 */
function getPinyinFirstLetters(text: string): string {
	if (!text) return '';

	// Segment the text by script type
	const segments = segmentText(text);

	// Process each segment based on its type
	let result = '';

	for (const segment of segments) {
		if (segment.type === 'chinese') {
			// For Chinese characters, get pinyin first letters
			const pinyinSegment = pinyin(segment.text, { toneType: 'none', type: 'array' });
			for (const p of pinyinSegment) {
				if (p && p.length > 0) {
					result += p[0].toLowerCase();
				}
			}
		} else if (segment.type === 'latin') {
			// For Latin script, preserve the characters
			result += segment.text.toLowerCase();
		} else if (segment.type === 'other' && segment.text.trim()) {
			// Handle other scripts/punctuation if needed
			// For spaces, add them only if meaningful
			if (!/^\s+$/.test(segment.text)) {
				result += segment.text;
			}
		}
	}

	return result;
}

/**
 * Processes a Chinese text segment to generate filter variations
 * Creates different representations of the text for flexible filtering
 *
 * @param text The Chinese text to process
 * @returns Array of filter strings for the Chinese text
 */
function processChineseSegment(text: string): string[] {
	const variations: string[] = [];

	// 1. Get pinyin for the entire segment (all lowercase)
	const pinyinFull = pinyin(text, { toneType: 'none', type: 'array' })
		.map(p => p.toLowerCase())
		.join('');
	variations.push(pinyinFull);

	// 2. Get first letters of pinyin (abbreviation)
	const pinyinFirstLetters = pinyin(text, { toneType: 'none', type: 'array' })
		.map(p => p[0]?.toLowerCase() || '')
		.join('');
	variations.push(pinyinFirstLetters);

	return variations;
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
		const acronym = words.map(w => w[0]).join('');
		variations.push(acronym);
		firstLetters.push(...words.map(w => w[0]));
	} else if (words.length === 1) {
		// If single word, just add first letter to firstLetters
		firstLetters.push(words[0][0]);
	}

	return { variations, firstLetters };
}

/**
 * Scores a completion match based on its relevance to the user's input
 * Higher scores indicate better matches
 *
 * The scoring algorithm applies several techniques in combination:
 * 1. Exact/prefix/substring matching against the original label
 * 2. Specialized Chinese character and pinyin matching
 * 3. Segment-by-segment analysis for mixed Chinese-English text
 * 4. Sequential character matching to prioritize correct order
 * 5. Position-aware scoring to prioritize earlier matches
 * 6. Consecutive character matching to prioritize matches that occur in sequence
 *
 * Examples of how various inputs match against "华夏恒生ETF联接A":
 * - "hxhs" → High score (matches first letters of first two segments)
 * - "华夏" → High score (exact match of first segment)
 * - "hxhsa" → High score (matches first letters + last character)
 * - "hxetf" → Medium-high score (matches first segment + abbreviation)
 * - "etf" → Medium score (matches middle segment exactly)
 * - "hsa" → Lower score (characters appear but not in consecutive segments)
 *
 * @param itemLabel The completion item's label
 * @param filterText The item's filter text containing all variations
 * @param userInput The text the user has typed so far
 * @returns A score indicating how well the item matches the input
 */
function scoreMatch(itemLabel: string, filterText: string, userInput: string): number {
	if (!userInput) return 0; // No input, no score

	// Convert to lowercase for case-insensitive matching
	const input = userInput.toLowerCase();
	const label = itemLabel.toLowerCase();

	// Initialize final score
	let score = 0;

	// Add scores from different matching strategies
	score += scoreBasicMatches(label, input);
	score += scoreFilterVariations(filterText, input);

	// Special handling for Chinese text
	if (isChineseChar(itemLabel[0])) {
		score += scoreChineseMatches(itemLabel, input);
	}

	// Add scores from sequence matching
	score += scoreSequenceMatches(filterText, input, itemLabel);

	// Add scores from character-by-character similarity
	score += scoreCharacterSimilarity(label, input);

	// Add scores from adjacency bonus
	score += scoreAdjacencyBonus(filterText, input);

	// Add special case handling for beginning-consecutive + end pattern
	// This specifically handles cases like "hxhsa" matching "华夏恒生ETF联接A"
	if (input.length >= 3 && isChineseChar(itemLabel[0])) {
		const enhancedScore = scoreBeginningConsecutivePlusEndPattern(itemLabel, input);
		score += enhancedScore;
	}

	return score;
}

/**
 * Scores basic exact, prefix, and substring matches against the original label
 */
function scoreBasicMatches(label: string, input: string): number {
	let score = 0;

	// 1. Exact match with label gets highest priority
	if (label === input) {
		score += 100;
	} // 2. Label starts with input (prefix match)
	else if (label.startsWith(input)) {
		score += 75;
	} // 3. Label contains input as a substring
	else if (label.includes(input)) {
		score += 50;
	}

	return score;
}

/**
 * Scores matches against filter variations (pinyin, acronyms, etc.)
 */
function scoreFilterVariations(filterText: string, input: string): number {
	let score = 0;
	const filterVariations = filterText.split(' ');

	// 4. Check if any of the filter variations match exactly
	for (const variation of filterVariations) {
		if (variation === input) {
			score += 40;
			break;
		}
	}

	// 5. Check for prefix matches in filter variations
	for (const variation of filterVariations) {
		if (variation.startsWith(input)) {
			score += 30;
			break;
		}
	}

	// 6. Check for substring matches in filter variations
	for (const variation of filterVariations) {
		if (variation.includes(input)) {
			score += 20;
			break;
		}
	}

	return score;
}

/**
 * Performs special scoring for Chinese characters and mixed Chinese-English text
 * This is critical for handling pinyin-based matching and segmented text
 */
function scoreChineseMatches(itemLabel: string, input: string): number {
	let score = 0;

	// Get special representations for Chinese text
	const pinyinFirstLetters = getPinyinFirstLetters(itemLabel);

	// Build segment acronyms for better matching
	const { chineseAcronym, segmentAcronyms } = buildChineseAcronyms(itemLabel);

	// Handle special case for segment-by-segment matching (e.g., "hxhs" type searches)
	score += scoreSegmentMatching(segmentAcronyms, input);

	// Score pinyin first letter matches
	score += scorePinyinFirstLetters(pinyinFirstLetters, input);

	// Score Chinese acronym matches
	score += scoreChineseAcronym(chineseAcronym, input);

	// Look for sequential segment matching
	score += scoreSequentialSegments(segmentAcronyms, input);

	return score;
}

/**
 * Builds Chinese acronyms from the item label, segmenting by script type
 */
function buildChineseAcronyms(itemLabel: string): { chineseAcronym: string; segmentAcronyms: string[] } {
	let chineseAcronym = '';
	const segmentAcronyms: string[] = [];

	const segments = segmentText(itemLabel);

	// Process each segment to build acronyms
	for (const segment of segments) {
		if (segment.type === 'chinese') {
			const segAcronym = pinyin(segment.text, { toneType: 'none', type: 'array' })
				.map(p => p[0]?.toLowerCase() || '')
				.join('');

			chineseAcronym += segAcronym;
			segmentAcronyms.push(segAcronym);
		} else if (segment.type === 'latin') {
			// For Latin segments, include them as-is for matching
			chineseAcronym += segment.text.toLowerCase();
			segmentAcronyms.push(segment.text.toLowerCase());
		}
	}

	return { chineseAcronym, segmentAcronyms };
}

/**
 * Scores input against segment acronyms
 * Handles special cases like "hxhs" for "华夏恒生ETF"
 */
function scoreSegmentMatching(segmentAcronyms: string[], input: string): number {
	let score = 0;

	// For each segment acronym, check if input starts with it or contains it
	for (let i = 0; i < segmentAcronyms.length; i++) {
		const acronym = segmentAcronyms[i];
		if (acronym.length > 0) {
			// Case: input matches the start of multiple segment acronyms in order
			// Example: "hxhs" for "华夏" + "恒生"
			if (input.startsWith(acronym)) {
				// Remove the matched part from input for next segment
				const remainingInput = input.substring(acronym.length);

				// If there are more segments and the remaining input starts with the next segment
				if (i < segmentAcronyms.length - 1 && remainingInput.startsWith(segmentAcronyms[i + 1])) {
					// This is a very strong match - input matches consecutive segment acronyms
					score += 80;
					break;
				}
			}
		}
	}

	return score;
}

/**
 * Scores sequential segment matching
 * For example, if input is "hxhs", match "华夏" (hx) + "恒生" (hs)
 */
function scoreSequentialSegments(segmentAcronyms: string[], input: string): number {
	let score = 0;

	// Case 1: Check for direct matches of segment acronyms in sequence
	let matchedSegmentCount = 0;
	let matchedChars = 0;
	let remainingInput = input;

	for (const segAcronym of segmentAcronyms) {
		if (segAcronym.length > 0 && remainingInput.startsWith(segAcronym)) {
			matchedSegmentCount++;
			matchedChars += segAcronym.length;
			remainingInput = remainingInput.substring(segAcronym.length);
			// Add points for each segment matched in sequence
			score += 20;
		}
	}

	// If we matched segments and have additional characters in the input (like 'a' in 'hxhsa')
	// Check if those remaining characters match the start of any remaining segments
	if (matchedSegmentCount > 0 && remainingInput.length > 0) {
		// Check trailing characters match with later segments
		let foundTrailingMatch = false;
		for (let i = matchedSegmentCount; i < segmentAcronyms.length; i++) {
			if (segmentAcronyms[i].startsWith(remainingInput)) {
				// Found a match for the trailing part
				score += 15;
				foundTrailingMatch = true;
				break;
			}
		}

		// If no match in later segments, check if the trailing characters
		// are single character matches from later segments
		if (!foundTrailingMatch) {
			for (let i = 0; i < remainingInput.length; i++) {
				const char = remainingInput.charAt(i);
				// Look for this character as the start of any remaining segment
				for (let j = matchedSegmentCount; j < segmentAcronyms.length; j++) {
					if (segmentAcronyms[j].startsWith(char)) {
						score += 5; // Lower score for individual character matches
						break;
					}
				}
			}
		}
	}

	// Case 2: Check if individual characters from input match the first letters of segments in order
	if (score === 0 && input.length > 0) {
		let lastMatchedSegmentIndex = -1;
		let orderedMatches = 0;

		for (let i = 0; i < input.length; i++) {
			const char = input.charAt(i);
			// Look for segments that start with this character
			for (let j = lastMatchedSegmentIndex + 1; j < segmentAcronyms.length; j++) {
				if (segmentAcronyms[j].startsWith(char)) {
					lastMatchedSegmentIndex = j;
					orderedMatches++;
					break;
				}
			}
		}

		// Award points for matching characters in the correct segment order
		if (orderedMatches > 0) {
			score += orderedMatches * 5;

			// Bonus if a significant portion of input was matched
			if (orderedMatches >= input.length / 2) {
				score += 10;
			}
		}
	}

	return score;
}

/**
 * Scores matches against pinyin first letters
 */
function scorePinyinFirstLetters(pinyinFirstLetters: string, input: string): number {
	let score = 0;

	// Strong prioritization for exact pinyin first letter matches
	if (pinyinFirstLetters === input) {
		score += 75; // Very high priority
	} else if (pinyinFirstLetters.startsWith(input)) {
		score += 60;
	} else if (input.startsWith(pinyinFirstLetters)) {
		// Input contains the pinyin first letters plus more
		score += 45;
	} else if (pinyinFirstLetters.includes(input)) {
		score += 35;
	}

	// Special case for "pinyin first letters + trailing characters"
	// Example: "hxhsa" matching "华夏恒生ETF联接A" (hxhsetflja)
	// Patterns like "hxhsa" should match the beginning "hxhs" + "a" from the end
	if (input.length >= 3) {
		// Check for beginning + end pattern
		// This is very important for cases like "hxhsa" where:
		// - The prefix "hxhs" matches the beginning of "hxhsetflja"
		// - The last character "a" matches the last letter of "hxhsetflja"
		for (let i = 2; i <= input.length - 1; i++) {
			const prefix = input.substring(0, i);
			const suffix = input.substring(i);

			// If the prefix matches the beginning of pinyin first letters AND
			// the suffix matches the last part of pinyin first letters
			if (
				pinyinFirstLetters.startsWith(prefix)
				&& pinyinFirstLetters.endsWith(suffix)
			) {
				// Calculate how much of the input is matched
				const matchPercentage = (prefix.length + suffix.length) / input.length;

				// Higher score for high-quality matches
				if (matchPercentage >= 0.9) {
					score += 85; // Extremely strong match - almost everything matched
					break;
				} else if (matchPercentage >= 0.7) {
					score += 65; // Very strong match
					break;
				} else if (matchPercentage >= 0.5) {
					score += 45; // Good match
					break;
				}
			}
		}

		// Special handling for significant prefix matches
		// E.g., if "hxhs" from "hxhsa" matches the beginning of "hxhsetflja"
		// and the remaining "a" exists somewhere in the string
		const significantPrefixLength = Math.max(Math.floor(input.length * 0.7), 3);
		if (input.length >= significantPrefixLength) {
			const prefix = input.substring(0, significantPrefixLength);
			const suffix = input.substring(significantPrefixLength);

			if (
				pinyinFirstLetters.startsWith(prefix)
				&& (suffix.length === 0 || pinyinFirstLetters.includes(suffix))
			) {
				score += 55; // Strong prefix match + suffix exists somewhere
			}
		}
	}

	return score;
}

/**
 * Scores Chinese acronym matches
 */
function scoreChineseAcronym(chineseAcronym: string, input: string): number {
	let score = 0;

	// Special case for when input matches the Chinese acronym
	if (chineseAcronym === input) {
		score += 80; // Highest priority for Chinese text
	} else if (chineseAcronym.startsWith(input)) {
		score += 70;
	} else if (input.startsWith(chineseAcronym)) {
		score += 50;
	} else if (chineseAcronym.includes(input)) {
		score += 40;
	}

	// Handle character distribution matching
	// This checks if the input characters are distributed throughout the acronym
	// in the correct order, which is a strong signal of intent
	if (input.length >= 2) {
		let lastIndex = -1;
		let matchCount = 0;

		for (let i = 0; i < input.length; i++) {
			const char = input.charAt(i);
			const index = chineseAcronym.indexOf(char, lastIndex + 1);

			if (index > -1) {
				lastIndex = index;
				matchCount++;
			}
		}

		// If all characters matched in sequence
		if (matchCount === input.length) {
			// Calculate how "spread out" the matches are
			const matchSpread = lastIndex - chineseAcronym.indexOf(input.charAt(0));
			const spreadRatio = matchSpread / chineseAcronym.length;

			// Reward for finding all characters in order
			score += 30;

			// Add bonus for tight grouping (less spread out)
			if (spreadRatio < 0.7) {
				score += 20 * (1 - spreadRatio);
			}
		}
	}

	return score;
}

/**
 * Scores sequence matches with positional awareness
 * Prioritizes characters appearing in the correct order and position
 */
function scoreSequenceMatches(filterText: string, input: string, itemLabel: string): number {
	const filterVariations = filterText.split(' ');
	let maxSequenceScore = 0;

	for (const variation of filterVariations) {
		// Skip very short variations
		if (variation.length < 2) continue;

		// Initialize variables for sequence matching
		let sequenceScore = 0;
		let lastFoundIndex = -1;
		let consecutiveMatches = 0;
		let allCharsFound = true;
		let positionScore = 0;

		// Track the positions where input characters are found in the variation
		const matchPositions: number[] = [];

		// First check if all input characters exist in the variation in order
		for (let i = 0; i < input.length; i++) {
			const foundIndex = variation.indexOf(input[i], lastFoundIndex + 1);

			if (foundIndex > -1) {
				matchPositions.push(foundIndex);

				// Calculate position-based score (earlier positions get higher scores)
				// Earlier matches are worth more (max 10 points, min 1 point)
				const positionValue = Math.max(10 - foundIndex / variation.length * 10, 1);
				positionScore += positionValue;

				// Check for consecutive characters (strong signal of intent)
				if (lastFoundIndex !== -1 && foundIndex === lastFoundIndex + 1) {
					consecutiveMatches++;
					// Award extra points for consecutive matches (they compound)
					sequenceScore += 5 * consecutiveMatches;
				}

				lastFoundIndex = foundIndex;
			} else {
				allCharsFound = false;
				break;
			}
		}

		if (allCharsFound) {
			// Base score for finding all characters in sequence
			sequenceScore += 15;

			// Add position score
			sequenceScore += positionScore;

			// Calculate how "spread out" the matches are
			// For tightly grouped matches (indicating a better match), award more points
			if (matchPositions.length > 1) {
				const spread = (matchPositions[matchPositions.length - 1] - matchPositions[0]) / variation.length;
				// Lower spread = better match
				sequenceScore += Math.max(20 * (1 - spread), 0);
			}

			// Stronger bonus if the sequence starts at the beginning
			if (matchPositions[0] === 0) {
				sequenceScore += 15;
			}

			// Award bonus points if the input matches the beginning of a segment
			// This is especially important for multi-segment items like "华夏恒生ETF联接A"
			const segments = segmentText(itemLabel);
			let segmentStartBonus = 0;

			for (const segment of segments) {
				const segmentStart = getPinyinFirstLetters(segment.text).toLowerCase();
				if (segmentStart.startsWith(input)) {
					segmentStartBonus += 20;
					break;
				} else if (input.startsWith(segmentStart)) {
					segmentStartBonus += 15;
					break;
				}
			}

			sequenceScore += segmentStartBonus;

			// Normalize by input length to avoid biasing toward shorter inputs
			sequenceScore = sequenceScore * (1 + Math.min(input.length / 10, 1));

			// Account for relative lengths - closer lengths indicate better matches
			const lengthRatio = Math.min(input.length / variation.length, 1);
			sequenceScore *= 0.5 + lengthRatio * 0.5;
		}

		maxSequenceScore = Math.max(maxSequenceScore, sequenceScore);
	}

	return maxSequenceScore;
}

/**
 * Scores character-by-character similarity
 */
function scoreCharacterSimilarity(label: string, input: string): number {
	let score = 0;

	// Count matched characters
	let matchedChars = 0;
	for (let i = 0; i < input.length; i++) {
		if (label.includes(input[i])) {
			matchedChars++;
		}
	}

	// Add score based on the percentage of matched characters
	if (input.length > 0) {
		const matchPercentage = matchedChars / input.length;
		score += matchPercentage * 8; // Reduced weight compared to sequence matching
	}

	return score;
}

/**
 * Scores adjacency bonus - rewards adjacent characters in the text
 */
function scoreAdjacencyBonus(filterText: string, input: string): number {
	let score = 0;
	const filterVariations = filterText.split(' ');

	// Look for adjacent sequences of input in all filter variations
	// This rewards when input characters appear next to each other
	for (const variation of filterVariations) {
		let currentAdjacentLen = 0;
		let maxAdjacentLen = 0;

		for (let i = 0; i < input.length - 1; i++) {
			const currChar = input[i];
			const nextChar = input[i + 1];

			// Look for adjacent characters in variation
			const currIndex = variation.indexOf(currChar);
			if (currIndex >= 0 && currIndex + 1 < variation.length && variation[currIndex + 1] === nextChar) {
				currentAdjacentLen++;
				maxAdjacentLen = Math.max(maxAdjacentLen, currentAdjacentLen);
			} else {
				currentAdjacentLen = 0;
			}
		}

		// Award points for adjacent characters (more points for longer sequences)
		if (maxAdjacentLen > 0) {
			score += maxAdjacentLen * 10;
		}
	}

	return score;
}

/**
 * Test function to evaluate the scoring algorithm with various examples
 * This helps validate and debug the scoring logic with different input patterns
 *
 * Test cases include:
 * - Several fund names with different Chinese-English mixing patterns
 * - Various input scenarios to test different matching strategies
 *
 * @param userInput The input to test
 */
function testCompletionScoring(userInput: string): void {
	// Define test entries - examples of Chinese-English mixed financial products
	const testEntries = [
		'华夏恒生ETF联接A', // Huaxia Hang Seng ETF Link A
		'中证传媒ETF', // CSI Media ETF
		'富国中证煤炭指数A', // Fullgoal CSI Coal Index A
		'博时沪深300ETF', // Bosera HS300 ETF
		'长信全球债券QDII', // Chang Xin Global Bond QDII
		'好时HSY卖出', // Hershey HSY Sell
		'招商银行App', // China Merchants Bank App
		'中证500ETF', // CSI 500 ETF
		'汇添富中证新能源汽车A', // China New Energy Vehicle ETF
	];

	console.log(`Testing scoring algorithm with input: "${userInput}"`);
	console.log('-'.repeat(60));

	// Score each entry and sort by score
	const results = testEntries.map(entry => {
		const filterText = createFilterString(entry);
		const score = scoreMatch(entry, filterText, userInput);
		return { entry, score };
	}).sort((a, b) => b.score - a.score);

	// Print results
	results.forEach(({ entry, score }) => {
		console.log(`${score.toFixed(2).padStart(8)}: ${entry}`);
	});

	console.log('-'.repeat(60));
}

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
					wordFirstLetters.push(p[0].toLowerCase());
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
	textEdit: string,
	set: Set<string>,
	items: CompletionItem[],
	cnt: number,
	userInput?: string,
	usageCount?: number,
) {
	if (set.has(item.label)) {
		return cnt;
	}

	const filterText = createFilterString(item.label);

	// Calculate score for sorting if userInput is provided
	let score = 0;
	if (userInput) {
		score = scoreMatch(item.label, filterText, userInput);

		// Boost score based on usage count if provided
		if (usageCount !== undefined) {
			// Add a bonus based on usage count, capped at a reasonable value
			// Using 20 points per usage with a max bonus of 200 (for 10+ usages)
			const usageBonus = Math.min(usageCount * 50, 3500);
			score += usageBonus;
		}
	}

	items.push({
		...item,
		kind: item.kind || CompletionItemKind.Text,
		filterText,
		textEdit: TextEdit.insert(position, textEdit),
		sortText: String(1000000 - Math.round(score)).padStart(7, '0'),
		// Add data for debugging if needed
		data: userInput ? { score, usageCount } : undefined,
	});
	set.add(item.label);
	return cnt + 1;
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
 * @param symbolIndex The symbol index to retrieve payees/narrations from
 * @param position The position where the completion was triggered
 * @param addPayees Whether to include payees or just narrations
 * @param quoteStyle The quote style to use ('none', 'end', 'both')
 * @param set A set to track already added items
 * @param items The array of completion items to add to
 * @param cnt A counter for sorting when no userInput is provided
 * @param userInput Optional user input for better scoring and sorting
 * @returns Updated counter value
 */
async function addPayeesAndNarrations(
	symbolIndex: SymbolIndex,
	position: Position,
	addPayees: boolean,
	quoteStyle: 'none' | 'end' | 'both',
	set: Set<string>,
	items: CompletionItem[],
	cnt: number,
	userInput?: string,
): Promise<number> {
	// Fetch payees and narrations in parallel
	const [payees, narrations] = await Promise.all([
		addPayees ? symbolIndex.getPayees() : Promise.resolve([]),
		symbolIndex.getNarrations(),
	]);

	// Add payees if requested
	if (addPayees) {
		payees.forEach((payee: string) => {
			const quote = quoteStyle === 'both' ? '"' : quoteStyle === 'end' ? '"' : '';
			const startQuote = quoteStyle === 'both' ? '"' : '';
			cnt = addCompletionItem(
				{ label: payee, kind: CompletionItemKind.Text, detail: '(payee)' },
				position,
				// Add space after to allow quick editing between payee and narration
				`${startQuote}${payee}${quote} `,
				set,
				items,
				cnt,
				userInput,
			);
		});
	}

	// Add narrations
	narrations.forEach((narration: string) => {
		const quote = quoteStyle === 'both' ? '"' : quoteStyle === 'end' ? '"' : '';
		const startQuote = quoteStyle === 'both' ? '"' : '';
		cnt = addCompletionItem(
			{ label: narration, kind: CompletionItemKind.Text, detail: '(narration)' },
			position,
			`${startQuote}${narration}${quote}`,
			set,
			items,
			cnt,
			userInput,
		);
	});

	return cnt;
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
	userInput?: string,
): Promise<number> {
	// Fetch currencies/commodities from the index
	const currencies = await symbolIndex.getCommodities();

	// Add each currency as a completion item
	currencies.forEach((currency: string) => {
		cnt = addCompletionItem(
			{ label: currency, kind: CompletionItemKind.Unit, detail: '(currency)' },
			position,
			// Add space before to make it look like '100 USD'
			` ${currency}`,
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
 * @param symbolIndex The symbol index to retrieve accounts from
 * @param position The position where the completion was triggered
 * @param triggerChar The trigger character ('A', 'L', 'E', or 'I')
 * @param set A set to track already added items
 * @param items The array of completion items to add to
 * @param cnt A counter for sorting when no userInput is provided
 * @param userInput Optional user input for better scoring and sorting
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
): Promise<number> {
	// Fetch all account definitions from the index
	const accounts = await symbolIndex.getAccountDefinitions();

	// Get account usage counts for sorting
	const accountUsageCounts = await symbolIndex.getAccountUsageCounts();

	// Filter accounts based on the trigger character
	const filteredAccounts = accounts.filter((account: { name: string }) => {
		if (triggerChar === 'E') {
			// Special case for E: match both Equity and Expenses accounts
			return account.name.startsWith('Equity:') || account.name.startsWith('Expenses:');
		}
		return account.name.startsWith(triggerChar);
	});

	// Sort accounts by usage count (most used first)
	filteredAccounts.sort((a, b) => {
		const countA = accountUsageCounts.get(a.name) || 0;
		const countB = accountUsageCounts.get(b.name) || 0;
		return countB - countA; // Descending order
	});

	// Add each filtered account as a completion item
	filteredAccounts.forEach((account: { name: string }) => {
		let detail = '';

		// Add usage count to the detail if available
		const usageCount = accountUsageCounts.get(account.name) || 0;
		if (usageCount > 0) {
			detail += `Used ${usageCount} time${usageCount === 1 ? '' : 's'}`;
		}

		cnt = addCompletionItem(
			{
				label: account.name,
				kind: CompletionItemKind.Field,
				detail,
			},
			position,
			account.name.replace(new RegExp(`^${triggerChar}`), '') + ' ',
			set,
			items,
			cnt,
			userInput,
			usageCount,
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
	provideCompletionItems = async (params: CompletionParams): Promise<CompletionItem[]> => {
		const document = await this.documents.retrieve(params.textDocument.uri);
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return [];
		}

		// Extract user input for better sorting
		const userInput = extractUserInput(
			document,
			params.position,
			params.context?.triggerCharacter as string,
		);

		// Analyze the token at the current position
		const current = nodeAtPosition(tree.rootNode, params.position, true);
		let lastCurrentChildTypeInError = undefined;
		if (current.type === 'ERROR' && current.childCount > 0) {
			lastCurrentChildTypeInError = current.children[current.childCount - 1]?.type;
		}

		// Find the token for the current position
		const descendantForCurPos = tree.rootNode.descendantForPosition(asTsPoint(params.position));
		let lastChildNode = descendantForCurPos.child(descendantForCurPos.childCount - 1);

		// Handle error cases by looking at parent/sibling nodes
		if (!lastChildNode || lastChildNode.type === 'ERROR') {
			// find up
			let parent = lastChildNode?.parent;
			logger.info(`pp ${parent?.type} AAAA`);
			while (
				typeof parent == 'object' && parent !== null
				&& parent.type === 'ERROR'
			) {
				logger.info(`pp ${parent?.type}`);
				parent = parent?.parent;
			}
			lastChildNode = parent ?? null;
			logger.info(`pp ${parent?.type}`);

			// find sibling
			if ((parent?.childCount ?? 0) > 0) {
				let n = parent?.children[parent.childCount - 1];
				while (n && n.type === 'ERROR') {
					n = n.previousNamedSibling ?? undefined;
				}
				lastChildNode = n ?? null;
			}

			// find last child
			if (lastChildNode) {
				let n = lastChildNode;
				while (n.childCount > 0) {
					n = n.children[n.childCount - 1];
				}
				lastChildNode = n;
			}
		}

		// Get completion items based on the context
		const completionItems: CompletionItem[] = await this.calcCompletionItems(
			{
				currentType: current.type,
				parentType: current.parent?.type,
				triggerCharacter: params.context?.triggerCharacter as TriggerCharacter,
				previousSiblingType: current.previousSibling?.type,
				previousPreviousSiblingType: current.previousSibling?.previousSibling?.type,
				descendantForPositionType: descendantForCurPos?.type,
				lastChildType: lastChildNode?.type,
				lastCurrentChildTypeInError,
			},
			params.position,
			userInput,
		);

		return completionItems;
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
	async calcCompletionItems(info: TriggerInfo, position: Position, userInput?: string): Promise<CompletionItem[]> {
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

				// Calculate score for sorting if userInput is provided
				if (userInput) {
					const score = scoreMatch(item.label, item.filterText, userInput);
					// Format to ensure higher scores come first
					// Using a very high number (1000000) to handle even large scores
					// The negative sign ensures higher scores sort first
					item.sortText = `A${String(1000000 - Math.min(score, 999999)).padStart(6, '0')}`;
					// Add data for debugging if needed
					item.data = { score };
				} else {
					item.sortText = String.fromCharCode(95 + cnt);
				}
			}

			completionItems.push(item);
			set.add(item.label as string);
			cnt++;
		}

		logger.info(`Starting completion with info: ${JSON.stringify(info)}`);
		const p: Promise<void> = match({ ...info, userInput })
			.with({ triggerCharacter: '2' }, async () => {
				// Date completions: Provide the current date, yesterday, day before yesterday, and tomorrow
				logger.info('Branch: triggerCharacter 2');
				const d = new Date();
				const yesterday = sub(d, { days: 1 });
				const dayBeforeYesterday = sub(d, { days: 2 });
				const tomorrow = add(d, { days: 1 });
				[d, yesterday, tomorrow, dayBeforeYesterday].forEach(d => {
					addItem({ label: formatDate(d, 'yyyy-MM-dd') });
				});
				logger.info(`Date completions added, items: ${completionItems.length}`);
			})
			.with({ triggerCharacter: '#' }, async () => {
				// Tag completions when triggered by # character
				logger.info('Branch: triggerCharacter #');
				const initialCount = completionItems.length;
				cnt = await addTagCompletions(this.symbolIndex, position, set, completionItems, cnt, userInput);
				logger.info(`Tags added, items: ${completionItems.length - initialCount}`);
			})
			.with({ currentType: '#' }, async () => {
				// Tag completions when positioned at a # token
				logger.info('Branch: triggerCharacter #');
				const initialCount = completionItems.length;
				cnt = await addTagCompletions(this.symbolIndex, position, set, completionItems, cnt, userInput);
				logger.info(`Tags added, items: ${completionItems.length - initialCount}`);
			})
			.with({
				triggerCharacter: ' ',
				lastCurrentChildTypeInError: 'number',
			}, async () => {
				// Currency completions after a number and space
				logger.info('Branch: number in posting - currency context');
				const initialCount = completionItems.length;
				cnt = await addCurrencyCompletions(this.symbolIndex, position, set, completionItems, cnt, userInput);
				logger.info(`Currencies added, items: ${completionItems.length - initialCount}`);
			})
			.with({ triggerCharacter: 'A' }, { triggerCharacter: P.nullish, userInput: 'A' }, async () => {
				// Assets account completions
				logger.info('Branch: triggerCharacter A - Account completion');
				const initialCount = completionItems.length;
				cnt = await addAccountCompletions(
					this.symbolIndex,
					position,
					'A',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Assets accounts added, items: ${completionItems.length - initialCount}`);
			})
			.with({ triggerCharacter: 'L' }, { triggerCharacter: P.nullish, userInput: 'L' }, async () => {
				// Liabilities account completions
				logger.info('Branch: triggerCharacter L - Account completion');
				const initialCount = completionItems.length;
				cnt = await addAccountCompletions(
					this.symbolIndex,
					position,
					'L',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Liabilities accounts added, items: ${completionItems.length - initialCount}`);
			})
			.with({ triggerCharacter: 'E' }, { triggerCharacter: P.nullish, userInput: 'E' }, async () => {
				// Equity and Expenses account completions
				logger.info('Branch: triggerCharacter E - Account completion');
				const initialCount = completionItems.length;
				cnt = await addAccountCompletions(
					this.symbolIndex,
					position,
					'E',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Equity and Expenses accounts added, items: ${completionItems.length - initialCount}`);
			})
			.with({ triggerCharacter: 'I' }, { triggerCharacter: P.nullish, userInput: 'I' }, async () => {
				// Income account completions
				logger.info('Branch: triggerCharacter I - Account completion');
				const initialCount = completionItems.length;
				cnt = await addAccountCompletions(
					this.symbolIndex,
					position,
					'I',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Income accounts added, items: ${completionItems.length - initialCount}`);
			})
			.with({ triggerCharacter: '"', previousSiblingType: 'txn' }, async () => {
				// Payee and narration completions after a transaction keyword
				logger.info('Branch: triggerCharacter " with txn sibling');
				const initialCount = completionItems.length;
				cnt = await addPayeesAndNarrations(
					this.symbolIndex,
					position,
					true,
					'end',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({
				triggerCharacter: '"',
				previousSiblingType: 'txn',
				previousPreviousSiblingType: 'date',
			}, async () => {
				// Payee and narration completions after date and transaction keyword
				logger.info('Branch: triggerCharacter " with txn sibling and date previous');
				const initialCount = completionItems.length;
				cnt = await addPayeesAndNarrations(
					this.symbolIndex,
					position,
					true,
					'end',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({ triggerCharacter: '"', previousSiblingType: 'payee' }, async () => {
				// Narration completions only after a payee
				logger.info('Branch: triggerCharacter " with payee sibling');
				const initialCount = completionItems.length;
				cnt = await addPayeesAndNarrations(
					this.symbolIndex,
					position,
					false,
					'end',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({ triggerCharacter: '"', currentType: 'narration' }, async () => {
				// Payee and narration completions when positioned at a narration
				logger.info('Branch: triggerCharacter " with narration current');
				const initialCount = completionItems.length;
				cnt = await addPayeesAndNarrations(
					this.symbolIndex,
					position,
					true,
					'end',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({ triggerCharacter: '"', previousSiblingType: 'string' }, async () => {
				// Narration completions after a string (likely a payee)
				logger.info('Branch: triggerCharacter " with string sibling');
				const initialCount = completionItems.length;
				cnt = await addPayeesAndNarrations(
					this.symbolIndex,
					position,
					false,
					'end',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Narrations added, items: ${completionItems.length - initialCount}`);
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
				cnt = await addPayeesAndNarrations(
					this.symbolIndex,
					position,
					false,
					'end',
					set,
					completionItems,
					cnt,
					userInput,
				);
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
				cnt = await addPayeesAndNarrations(
					this.symbolIndex,
					position,
					true,
					'end',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({ currentType: 'narration' }, async () => {
				// Payee and narration completions when positioned at a narration outside quotes
				logger.info('Branch: narration current');
				const initialCount = completionItems.length;
				cnt = await addPayeesAndNarrations(
					this.symbolIndex,
					position,
					true,
					'both',
					set,
					completionItems,
					cnt,
					userInput,
				);
				logger.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
			})
			.with({
				previousPreviousSiblingType: '\n',
				previousSiblingType: 'transaction',
				parentType: 'file',
			}, async () => {
				// Account completions after a transaction line
				logger.info('Branch: transaction sibling with newline previous');
				const initialCount = completionItems.length;
				const accounts = await this.symbolIndex.getAccountDefinitions();
				accounts.forEach((account: { name: string }) => {
					addItem({ label: account.name });
				});
				logger.info(`Accounts added, items: ${completionItems.length - initialCount}`);
			})
			.with({ lastChildType: 'narration' }, async () => {
				// Account completions after a narration
				logger.info('Branch: narration last child');
				const initialCount = completionItems.length;
				const accounts = await this.symbolIndex.getAccountDefinitions();
				accounts.forEach((account: { name: string }) => {
					addItem({ label: account.name });
				});
				logger.info(`Accounts added, items: ${completionItems.length - initialCount}`);
			})
			.otherwise(() => {
				// No matching context found, provide no completions
				logger.info('No matching branch found');
				return Promise.resolve();
			});
		await p;

		logger.info(`Final completion items: ${completionItems.length}`);
		return completionItems;
	}
}

// Example test calls - uncomment to run
// testCompletionScoring("hxhs");  // Should match "华夏恒生ETF联接A" first
// testCompletionScoring("zzcm");  // Should match "中证传媒ETF" first
// testCompletionScoring("hsy");   // Tests disambiguation between "好时HSY卖出" and others
// testCompletionScoring("etf");   // Tests how ETF is prioritized across entries
// testCompletionScoring("zzmt");  // Should match "富国中证煤炭指数A" well

/**
 * Runs a series of tests with different inputs to validate the scoring algorithm
 * This function tests various scenarios to ensure the algorithm works correctly
 * with mixed Chinese-English text patterns.
 */
function runTests(): void {
	// Define test cases with expected top result
	const testCases = [
		{ input: 'hxhs', expectedTop: '华夏恒生ETF联接A', description: 'First letters of first two Chinese segments' },
		{ input: 'zzcm', expectedTop: '中证传媒ETF', description: 'First letters of Chinese + media abbreviation' },
		{ input: 'zzmt', expectedTop: '富国中证煤炭指数A', description: 'Coal index abbreviation (煤炭)' },
		{ input: 'hs300', expectedTop: '博时沪深300ETF', description: 'Common index name' },
		{ input: 'qdii', expectedTop: '长信全球债券QDII', description: 'International fund type' },
		{ input: 'hsy', expectedTop: '好时HSY卖出', description: 'Direct match against ticker' },
		{ input: 'zsyh', expectedTop: '招商银行App', description: 'Bank abbreviation' },
		{ input: '500', expectedTop: '中证500ETF', description: 'Numeric index' },
		{ input: 'xnyqc', expectedTop: '汇添富中证新能源汽车A', description: 'New energy vehicle abbreviation' },
	];

	logger.info('\n===== TESTING COMPLETION SCORING ALGORITHM =====\n');

	// Run each test case
	testCases.forEach((testCase, index) => {
		// Get test entries
		const testEntries = [
			'华夏恒生ETF联接A', // Huaxia Hang Seng ETF Link A
			'中证传媒ETF', // CSI Media ETF
			'富国中证煤炭指数A', // Fullgoal CSI Coal Index A
			'博时沪深300ETF', // Bosera HS300 ETF
			'长信全球债券QDII', // Chang Xin Global Bond QDII
			'好时HSY卖出', // Hershey HSY Sell
			'招商银行App', // China Merchants Bank App
			'中证500ETF', // CSI 500 ETF
			'汇添富中证新能源汽车A', // China New Energy Vehicle ETF
		];

		// Score each entry
		const results = testEntries.map(entry => {
			const filterText = createFilterString(entry);
			const score = scoreMatch(entry, filterText, testCase.input);
			return { entry, score };
		}).sort((a, b) => b.score - a.score);

		// Check if the top result matches the expected
		const topResult = results[0].entry;
		const passed = topResult === testCase.expectedTop;

		// Print test results
		logger.info(`Test #${index + 1}: "${testCase.input}" (${testCase.description})`);
		logger.info(`  Expected: ${testCase.expectedTop}`);
		logger.info(`  Result:   ${topResult}`);
		logger.info(`  Status:   ${passed ? 'PASSED ✓' : 'FAILED ✗'}`);

		// Show top 3 matches with scores
		logger.info('  Top matches:');
		results.slice(0, 3).forEach(({ entry, score }, i) => {
			logger.info(`    ${i + 1}. ${score.toFixed(2).padStart(7)} - ${entry}`);
		});

		logger.info(''); // Empty line between tests
	});

	logger.info('===== TESTING COMPLETE =====');
}

// Uncomment to run tests
// runTests();

/**
 * Command-line interface for testing the scoring algorithm
 * This function can be called from the command line to test the algorithm with custom inputs
 *
 * Usage:
 *   node -e "require('./dist/common/features/completions').testFromCommandLine()" -- "hxhs"
 *   node -e "require('./dist/common/features/completions').testFromCommandLine()" -- "zzcm"
 *   node -e "require('./dist/common/features/completions').testFromCommandLine()" -- "runTests"
 */
export function testFromCommandLine(): void {
	// Get the input from command line arguments
	const args = process.argv.slice(2);
	const input = args[0];

	if (!input) {
		logger.info('Please provide a search term as an argument.');
		logger.info(
			'Usage: node -e "require(\'./dist/common/features/completions\').testFromCommandLine()" -- "search term"',
		);
		logger.info(
			'       node -e "require(\'./dist/common/features/completions\').testFromCommandLine()" -- "runTests"',
		);
		return;
	}

	// If the input is "runTests", run all predefined tests
	if (input === 'runTests') {
		runTests();
		return;
	}

	// Define test entries
	const testEntries = [
		'华夏恒生ETF联接A', // Huaxia Hang Seng ETF Link A
		'中证传媒ETF', // CSI Media ETF
		'富国中证煤炭指数A', // Fullgoal CSI Coal Index A
		'博时沪深300ETF', // Bosera HS300 ETF
		'长信全球债券QDII', // Chang Xin Global Bond QDII
		'好时HSY卖出', // Hershey HSY Sell
		'招商银行App', // China Merchants Bank App
		'中证500ETF', // CSI 500 ETF
		'汇添富中证新能源汽车A', // China New Energy Vehicle ETF
	];

	logger.info(`\n===== TESTING COMPLETION SCORING FOR: "${input}" =====\n`);

	// Score each entry
	const results = testEntries.map(entry => {
		const filterText = createFilterString(entry);
		const score = scoreMatch(entry, filterText, input);

		// Get detailed scoring breakdown
		const details = getDetailedScoring(entry, filterText, input);

		return { entry, score, details };
	}).sort((a, b) => b.score - a.score);

	// Display results
	logger.info('Results (sorted by score):');
	results.forEach(({ entry, score, details }, i) => {
		logger.info(`\n${i + 1}. ${entry} - Score: ${score.toFixed(2)}`);
		logger.info(`   Filter variations: ${details.filterVariations}`);
		logger.info(`   Scoring details:`);
		logger.info(`     - Exact match: ${details.exactMatch}`);
		logger.info(`     - Prefix match: ${details.prefixMatch}`);
		logger.info(`     - Substring match: ${details.substringMatch}`);
		logger.info(`     - Pinyin first letters: ${details.pinyinFirstLetters}`);
		logger.info(`     - Segment acronym match: ${details.segmentAcronymMatch}`);
		logger.info(`     - Character sequence match: ${details.sequenceMatch}`);
		logger.info(`     - Consecutive bonus: ${details.consecutiveBonus}`);
		logger.info(`     - Position bonus: ${details.positionBonus}`);
	});

	logger.info('\n===== TESTING COMPLETE =====');
}

/**
 * Gets detailed scoring breakdown for debugging and analysis
 */
function getDetailedScoring(text: string, filterText: string, userInput: string): any {
	if (!userInput) return { score: 0 };

	const lowerText = text.toLowerCase();
	const lowerInput = userInput.toLowerCase();

	// Basic scoring
	const exactMatch = lowerText === lowerInput ? 100 : 0;
	const prefixMatch = lowerText.startsWith(lowerInput) ? 75 : 0;
	const substringMatch = lowerText.includes(lowerInput) ? 50 : 0;

	// Get filter variations
	const variations = filterText.split(' ');

	// Check for pinyin first letters match
	let pinyinFirstLetters = 0;
	for (const variation of variations) {
		if (variation === lowerInput) {
			pinyinFirstLetters = 45;
			break;
		} else if (variation.startsWith(lowerInput)) {
			pinyinFirstLetters = 40;
			break;
		} else if (variation.includes(lowerInput)) {
			pinyinFirstLetters = 35;
			break;
		}
	}

	// Chinese special handling
	let segmentAcronymMatch = 0;
	const segments = segmentText(text);
	const segmentAcronyms: string[] = [];

	// Extract acronyms from segments
	for (const segment of segments) {
		if (segment.type === 'chinese') {
			const pinyin = getPinyinFirstLetters(segment.text);
			if (pinyin) {
				segmentAcronyms.push(pinyin.toLowerCase());
			}
		}
	}

	// Check if input matches segment acronyms in sequence
	const combinedAcronyms = segmentAcronyms.join('');
	if (combinedAcronyms === lowerInput) {
		segmentAcronymMatch = 80;
	} else if (combinedAcronyms.startsWith(lowerInput)) {
		segmentAcronymMatch = 70;
	} else if (combinedAcronyms.includes(lowerInput)) {
		segmentAcronymMatch = 60;
	}

	// Sequence matching
	let sequenceMatch = 0;
	let consecutiveBonus = 0;
	let positionBonus = 0;

	let lastIndex = -1;
	let consecutiveCount = 0;
	let totalPositionScore = 0;

	for (let i = 0; i < lowerInput.length; i++) {
		const char = lowerInput.charAt(i);
		const index = lowerText.indexOf(char, lastIndex + 1);

		if (index !== -1) {
			// Character found in sequence
			sequenceMatch += 1;

			// Position bonus (earlier matches score higher)
			const positionScore = 1 - (index / lowerText.length);
			totalPositionScore += positionScore;

			// Check for consecutive matches
			if (index === lastIndex + 1) {
				consecutiveCount++;
				consecutiveBonus += consecutiveCount * 0.5;
			} else {
				consecutiveCount = 0;
			}

			lastIndex = index;
		}
	}

	// Normalize sequence match score
	sequenceMatch = (sequenceMatch / lowerInput.length) * 30;
	positionBonus = totalPositionScore * 10;

	return {
		filterVariations: variations.join(' | '),
		exactMatch,
		prefixMatch,
		substringMatch,
		pinyinFirstLetters,
		segmentAcronymMatch,
		sequenceMatch: sequenceMatch.toFixed(2),
		consecutiveBonus: consecutiveBonus.toFixed(2),
		positionBonus: positionBonus.toFixed(2),
	};
}

/**
 * Special scoring function for the beginning-consecutive + end pattern
 * This function specifically targets cases like "hxhsa" matching "华夏恒生ETF联接A"
 * where there are consecutive matches at the beginning followed by a match at the end
 */
function scoreBeginningConsecutivePlusEndPattern(itemLabel: string, input: string): number {
	let score = 0;

	// First, get pinyin first letters representation
	const pinyinFirstLetters = getPinyinFirstLetters(itemLabel);
	const label = itemLabel.toLowerCase();
	const inputLower = input.toLowerCase();

	// The key pattern we're looking for:
	// 1. Longest possible prefix of input that matches the beginning of pinyin first letters
	// 2. The remaining suffix of input (if any) that matches the end of the item

	// Check for a direct prefix match at the beginning - this is highest priority
	let longestPrefixMatch = 0;
	for (let i = Math.min(input.length, pinyinFirstLetters.length); i >= 2; i--) {
		const prefix = input.substring(0, i);
		if (pinyinFirstLetters.startsWith(prefix)) {
			longestPrefixMatch = i;
			break;
		}
	}

	// Massive bonus for longer prefix matches
	if (longestPrefixMatch > 0) {
		// Calculate the direct consecutive match score - this should be the dominant factor
		// Exponential scoring to strongly favor longer consecutive matches
		score += Math.pow(longestPrefixMatch, 2) * 20;

		// Additional bonus if the prefix is a significant portion of the input
		if (longestPrefixMatch >= input.length * 0.7) {
			score += 100;
		}

		// Check for the "beginning + end" pattern with the remaining suffix
		if (longestPrefixMatch < input.length) {
			const suffix = input.substring(longestPrefixMatch);
			if (pinyinFirstLetters.endsWith(suffix) || label.endsWith(suffix)) {
				// The suffix matches the end - this is the exact "hxhsa" pattern we want
				score += 150 + suffix.length * 30;
			}
		}
	}

	// Process segments directly to better recognize segment prefix patterns
	const segments = segmentText(itemLabel);
	const segmentFirstLetters: string[] = [];

	// Get first letters of each segment
	for (const segment of segments) {
		if (segment.type === 'chinese') {
			const pinyinSegment = pinyin(segment.text, { toneType: 'none', type: 'array' });
			// For Chinese segments, we want the first letter of each character's pinyin
			for (const p of pinyinSegment) {
				if (p && p.length > 0) {
					segmentFirstLetters.push(p[0].toLowerCase());
				}
			}
		} else if (segment.type === 'latin') {
			// For Latin segments, just take the first letter
			if (segment.text.length > 0) {
				segmentFirstLetters.push(segment.text[0].toLowerCase());
			}
		}
	}

	// Specifically check for consecutive matches against segment first letters
	// This directly addresses the "hxhsa" vs "华夏恒生ETF联接A" case where
	// we have "h" (华), "x" (夏), "h" (恒), "s" (生) as 4 consecutive matches
	let consecutiveSegmentMatches = 0;
	let maxConsecutiveSegmentMatches = 0;

	for (let i = 0; i < Math.min(input.length, segmentFirstLetters.length); i++) {
		if (input[i] === segmentFirstLetters[i]) {
			consecutiveSegmentMatches++;
			maxConsecutiveSegmentMatches = Math.max(maxConsecutiveSegmentMatches, consecutiveSegmentMatches);
		} else {
			// Reset only if we're not looking at the last character of input
			// This helps with cases where all but one character matches
			if (i < input.length - 1) {
				consecutiveSegmentMatches = 0;
			}
		}
	}

	// Huge bonus for consecutive segment first letter matches
	// This is the specific pattern we're looking for in "hxhsa" matching "h(华)x(夏)h(恒)s(生)"
	if (maxConsecutiveSegmentMatches >= 4) {
		score += 800; // Massive bonus for 4+ consecutive first letter matches
	} else if (maxConsecutiveSegmentMatches >= 3) {
		score += 500; // Very high bonus for 3 consecutive first letter matches
	} else if (maxConsecutiveSegmentMatches >= 2) {
		score += 200; // High bonus for 2 consecutive first letter matches
	}

	// Special handling for the classic "hxhsa" pattern where "a" matches the end
	if (input.length >= 3) {
		const lastChar = input[input.length - 1];
		const lastItemChar = label[label.length - 1];
		const lastPinyinChar = pinyinFirstLetters[pinyinFirstLetters.length - 1];

		// Check if we have a beginning match + last character match
		if (
			(maxConsecutiveSegmentMatches >= 2 || longestPrefixMatch >= 3)
			&& (lastChar === lastItemChar || lastChar === lastPinyinChar)
		) {
			// This directly handles the "hxhsa" matching "华夏恒生ETF联接A" pattern
			// where the last "a" matches the end of "联接A"
			score += 400;
		}
	}

	// Specific pattern matching for certain inputs
	// This allows us to handle special cases as needed
	const segmentFirstLettersStr = segmentFirstLetters.join('');

	// Special high score for patterns that match first characters in sequence plus the last character
	if (input.length >= 4) {
		// Check if the first characters of input match first letters of segments in sequence
		const prefix = input.substring(0, input.length - 1);
		const lastChar = input[input.length - 1];

		// If the prefix matches the start of segment first letters and the last char matches the last char
		if (
			segmentFirstLettersStr.startsWith(prefix)
			&& (label.endsWith(lastChar) || pinyinFirstLetters.endsWith(lastChar))
		) {
			// This is exactly the pattern we want to match highly
			score += 900;
		}
	}

	// If we have a very long sequence of consecutive matches at the beginning,
	// ensure it gets a high enough score to beat any competitor
	if (maxConsecutiveSegmentMatches >= 4 && input.length >= 4) {
		score = Math.max(score, 1500);
	}

	// Consecutive segment matches plus end match is the strongest signal
	if (maxConsecutiveSegmentMatches >= 3 && input.length >= 4) {
		const lastChar = input[input.length - 1];
		const lastItemChar = label[label.length - 1];

		if (lastChar === lastItemChar) {
			score = Math.max(score, 2000);
		}
	}

	return score;
}

/**
 * Runs example tests specifically for the "hxhsa" case to verify the algorithm works
 */
function testSpecificCase(): void {
	// Test items, including expected top result and another competitive item
	const testItems = [
		'华夏恒生ETF联接A', // Expected top result for "hxhsa"
		'好时HSY买入', // Competitive item that might have matched previously
		'星散海运', // Another competitive item
		'恒生ETF',
		'沪深300ETF',
		'北方稀土A',
		'浙江银行',
		'招商银行App',
		'长信全球债券QDII',
		'中证500指数',
	];

	// Input to test
	const testInput = 'hxhsa';

	logger.info(`\n===== TESTING "${testInput}" CASE =====\n`);

	// Score each item and show detailed diagnostics
	const results = testItems.map(item => {
		const filterText = createFilterString(item);
		const score = scoreMatch(item, filterText, testInput);

		const pinyinFirstLetters = getPinyinFirstLetters(item);
		const segments = segmentText(item);
		const segmentFirstLetters = segments.map(segment => {
			if (segment.type === 'chinese') {
				return pinyin(segment.text, { toneType: 'none', type: 'array' })
					.map(p => p[0]?.toLowerCase() || '').join('');
			}
			return segment.text.toLowerCase()[0] || '';
		}).join('');

		return {
			item,
			score,
			pinyin: pinyinFirstLetters,
			segmentFirstLetters,
		};
	}).sort((a, b) => b.score - a.score);

	// Print sorted results with diagnostics
	logger.info(`Input: "${testInput}"\n`);
	logger.info('Rank | Score  | Item | Pinyin | Segment First Letters');
	logger.info('-'.repeat(80));

	results.forEach(({ item, score, pinyin, segmentFirstLetters }, i) => {
		logger.info(
			`${i + 1}.   | ${score.toFixed(2).padStart(6)} | ${item.padEnd(20)} | ${
				pinyin.padEnd(15)
			} | ${segmentFirstLetters}`,
		);
	});

	logger.info(`\n===== EXPECTED TOP RESULT: "华夏恒生ETF联接A" =====\n`);
}

// Uncomment to test the specific case
// testSpecificCase();

/**
 * Verifies that the sorting mechanism works properly by testing the completion item sorting
 * This specifically tests the sortText generation to ensure items are properly ordered
 */
function verifySortingMechanism(): void {
	// Test items, including expected top result and other competitive items
	const testItems = [
		'华夏恒生ETF联接A', // Should be top result for "hxhsa"
		'星散海运', // Competitive item that might be ranked incorrectly
		'好时HSY买入', // Another competitive item
		'恒生ETF',
		'沪深300ETF',
		'北方稀土A',
	];

	// Input to test
	const testInput = 'hxhsa';

	logger.info(`\n===== VERIFYING SORT MECHANISM FOR "${testInput}" =====\n`);

	// First, calculate scores for each item
	const scoredItems = testItems.map(label => {
		const filterText = createFilterString(label);
		const score = scoreMatch(label, filterText, testInput);
		return { label, filterText, score };
	});

	// Log the raw scores for diagnostic purposes
	logger.info('Raw scores:');
	scoredItems.forEach(({ label, score }) => {
		logger.info(`${label}: ${score}`);
	});

	// Now, generate sortText for each item as it would be in completions
	const itemsWithSortText = scoredItems.map(({ label, score, filterText }) => {
		const sortText = `A${String(1000000 - Math.min(score, 999999)).padStart(6, '0')}`;
		return { label, score, sortText, filterText };
	});

	// Sort items based on sortText (alphabetically) - this simulates how VS Code sorts completions
	const sortedItems = [...itemsWithSortText].sort((a, b) => a.sortText.localeCompare(b.sortText));

	// Print detailed diagnostic information
	logger.info('\nItems by Score (higher is better):');
	logger.info('-'.repeat(80));
	logger.info('Rank | Score  | Label');
	logger.info('-'.repeat(80));

	// Print items sorted by score (what we want)
	scoredItems
		.sort((a, b) => b.score - a.score)
		.forEach(({ label, score }, i) => {
			logger.info(`${i + 1}.   | ${score.toFixed(2).padStart(6)} | ${label}`);
		});

	logger.info('\nItems by SortText (how they will appear in completions):');
	logger.info('-'.repeat(80));
	logger.info('Rank | SortText       | Score  | Label');
	logger.info('-'.repeat(80));

	// Print items sorted by sortText (what will actually happen)
	sortedItems.forEach(({ label, score, sortText }, i) => {
		logger.info(`${i + 1}.   | ${sortText} | ${score.toFixed(2).padStart(6)} | ${label}`);
	});

	// Make sure the first item is what we expect
	const topItem = sortedItems[0].label;
	const expectedTopItem = '华夏恒生ETF联接A';

	logger.info(`\nTop Item: ${topItem}`);
	logger.info(`Expected: ${expectedTopItem}`);
	logger.info(`Result:   ${topItem === expectedTopItem ? 'SUCCESS ✓' : 'FAILURE ✗'}`);

	logger.info(`\n===== SORTING VERIFICATION COMPLETE =====\n`);
}

// Execute the test to verify our fix
// verifySortingMechanism();

/**
 * Function to test the scoring algorithm with a specific input
 * @param userInput The input to test
 * @param entries Array of strings to score against the input
 */
function testScoringAlgorithm(userInput: string, entries: string[]): void {
	logger.debug(`Testing scoring algorithm with input: "${userInput}"`);
	logger.debug('-'.repeat(60));

	// Score entries by relevance
	const results = entries
		.map(entry => ({
			entry,
			score: scoreCompletionItem(userInput, entry),
		}))
		.sort((a, b) => b.score - a.score);

	// Display results
	results.forEach(({ entry, score }) => {
		logger.debug(`${score.toFixed(2).padStart(8)}: ${entry}`);
	});

	logger.debug('-'.repeat(60));
}

/**
 * Score a completion item based on user input
 * This is a wrapper around scoreMatch to simplify testing
 */
function scoreCompletionItem(userInput: string, entry: string): number {
	const filterText = createFilterString(entry);
	return scoreMatch(entry, filterText, userInput);
}
