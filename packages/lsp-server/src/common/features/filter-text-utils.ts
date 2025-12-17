import { pinyin } from 'pinyin-pro';
import { getPinyinFirstLetters, processChineseSegment, segmentText } from './completions/chinese-pinyin';

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
export function createFilterString(text: string, enablePinyin: boolean = true): string {
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
 * Processes a Latin text segment to generate filter variations
 * Handles English/Latin text to support acronym-based filtering
 *
 * @param text The Latin text to process
 * @returns Object with filter strings and first letters of words
 */
export function processLatinSegment(text: string): { variations: string[]; firstLetters: string[] } {
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

/**
 * Creates filter text for ASCII-only symbols (account names, etc.)
 * Handles suffix matching for account names with colons
 *
 * @param text The ASCII text to create filter text for
 * @returns Filter text string
 */
export function createAsciiFilterText(text: string): string {
	if (!text) return '';

	let filterText = text;
	const matches = text.match(/:[^:]+/g);
	if (matches && matches.length > 0) {
		// Make a copy to avoid modifying the original array
		let processedMatches = matches;
		if (processedMatches.length === 1) {
			// Make the suffix appear twice to boost the score when it is a one level account
			processedMatches = [processedMatches[0], processedMatches[0]];
		}
		// Boost the score of suffixes match
		processedMatches.forEach(suffix => {
			filterText = `${text[0]}${suffix} ${filterText}`;
		});
	}
	return filterText;
}
