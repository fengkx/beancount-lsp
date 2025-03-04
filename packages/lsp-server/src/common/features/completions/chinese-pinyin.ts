import { pinyin } from 'pinyin-pro';

/**
 * Checks if a character is a Chinese character
 * This covers the main CJK unified ideograph blocks
 *
 * @param char The character to check
 * @returns Whether the character is a Chinese character
 */
export function isChineseChar(char: string): boolean {
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
export function segmentText(text: string): TextSegment[] {
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
export function getPinyinFirstLetters(text: string): string {
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
					result += p[0]?.toLowerCase() || '';
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
export function processChineseSegment(text: string): string[] {
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
 * Builds Chinese acronyms from the item label, segmenting by script type
 */
export function buildChineseAcronyms(itemLabel: string): { chineseAcronym: string; segmentAcronyms: string[] } {
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
