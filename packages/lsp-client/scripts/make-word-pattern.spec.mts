import { createRequire } from 'node:module';
import { readFile } from 'fs/promises';
import { parse } from 'jsonc-parser';
import { describe, expect, it } from 'vitest';

type WordPatternGenerator = {
	buildSourcePattern: () => string;
	buildWordPattern: () => string;
	tokenPatterns: readonly RegExp[];
};

const require = createRequire(import.meta.url);
const { buildSourcePattern, buildWordPattern, tokenPatterns } = require('./make-word-pattern.js') as WordPatternGenerator;

async function readConfiguredPattern(): Promise<string> {
	const configText = await readFile(new URL('../language-configuration.json', import.meta.url), 'utf8');
	const config = parse(configText) as { wordPattern: string };
	return config.wordPattern;
}

function matchWhole(pattern: string, input: string): boolean {
	const m = input.match(new RegExp(pattern));
	return Boolean(m && m[0] === input);
}

function extractWords(pattern: string, input: string): string[] {
	return Array.from(input.matchAll(new RegExp(pattern, 'g')), (match) => match[0]);
}

describe('wordPattern generation', () => {
	it('keeps the generated artifact synchronized and deterministic', async () => {
		const configuredPattern = await readConfiguredPattern();
		const generatedPattern = buildWordPattern();

		expect(configuredPattern).toBe(generatedPattern);
		expect(buildWordPattern()).toBe(generatedPattern);
		expect(new RegExp(generatedPattern)).toBeInstanceOf(RegExp);
		expect(new RegExp(generatedPattern).test('')).toBe(false);
		expect(tokenPatterns.every((pattern) => !pattern.test(''))).toBe(true);
	});

	it('combines the four token classes in the specified order', () => {
		expect(buildSourcePattern()).toBe(
			"(?:[12]\\d{3}[-/]\\d{0,2}(?:[-/]\\d{0,2})?)|(?:[+-]?(?:\\d[\\d,]*(?:\\.\\d*)?|\\.\\d+))|(?:[#^][A-Za-z0-9_./-]+)|(?:\\p{L}[\\p{L}\\p{N}'._/:：-]*)",
		);
	});
});

describe('wordPattern token classes', () => {
	it('matches account and account-query intermediate tokens', async () => {
		const pattern = await readConfiguredPattern();
		const inputs = [
			'A',
			'ABS',
			'A:',
			'A:B',
			'A:BOC',
			'L:1507:',
			'L：1507',
			'Liabilities:1507',
			'Assets:Bank:Card',
			'资产:银行',
		];

		for (const input of inputs) {
			expect(matchWhole(pattern, input)).toBe(true);
		}
	});

	it('matches symbols, tags, and links', async () => {
		const pattern = await readConfiguredPattern();
		const inputs = [
			'USD',
			'BRK.B',
			"USD'24",
			'some-key',
			'metadata_key:',
			'#tag-1',
			'#tag/path.v2',
			'^link-1',
			'^link/path.v2',
		];

		for (const input of inputs) {
			expect(matchWhole(pattern, input)).toBe(true);
		}
	});

	it('matches dates, numbers, and useful intermediate states', async () => {
		const pattern = await readConfiguredPattern();
		const inputs = [
			'2026-',
			'2026-09',
			'2026-09-',
			'2026-09-01',
			'2026/09/01',
			'0',
			'-1',
			'+1.25',
			'.5',
			'1.',
			'1,234.50',
		];

		for (const input of inputs) {
			expect(matchWhole(pattern, input)).toBe(true);
		}
	});
});

describe('wordPattern boundaries', () => {
	it('keeps delimiters outside extracted words', async () => {
		const pattern = await readConfiguredPattern();

		expect(extractWords(pattern, 'A:BOC,')).toEqual(['A:BOC']);
		expect(extractWords(pattern, '"A:BOC"')).toEqual(['A:BOC']);
		expect(extractWords(pattern, 'A:BOC ')).toEqual(['A:BOC']);
		expect(extractWords(pattern, '#tag-1,')).toEqual(['#tag-1']);
		expect(extractWords(pattern, '^link/path.v2;')).toEqual(['^link/path.v2']);
		expect(extractWords(pattern, '1,234.50 USD')).toEqual(['1,234.50', 'USD']);
		expect(extractWords(pattern, 'foo@bar')).toEqual(['foo', 'bar']);
	});

	it('does not match empty or punctuation-only input', async () => {
		const pattern = await readConfiguredPattern();

		expect(extractWords(pattern, '')).toEqual([]);
		expect(extractWords(pattern, ',;@"')).toEqual([]);
		expect(matchWhole(pattern, '#')).toBe(false);
		expect(matchWhole(pattern, '^')).toBe(false);
	});
});

it('wordPattern should match mixed-case collapsed account shorthand', async () => {
	const configText = await readFile(new URL('../language-configuration.json', import.meta.url), 'utf8');
	const config = parse(configText) as { wordPattern: string };
	const pattern = config.wordPattern;

	expect(matchWhole(pattern, 'ABaC')).toBe(true);
});
