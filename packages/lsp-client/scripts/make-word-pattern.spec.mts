import { it, expect } from 'vitest';
import { readFile } from 'fs/promises';
import { parse } from 'jsonc-parser';

function matchWhole(pattern: string, input: string): boolean {
	const m = input.match(new RegExp(pattern));
	return Boolean(m && m[0] === input);
}

it('wordPattern should match account query intermediate tokens', async () => {
	const configText = await readFile(new URL('../language-configuration.json', import.meta.url), 'utf8');
	const config = parse(configText) as { wordPattern: string };
	const pattern = config.wordPattern;

	expect(matchWhole(pattern, 'L:')).toBe(true);
	expect(matchWhole(pattern, 'L:1507')).toBe(true);
	expect(matchWhole(pattern, 'L:1507:')).toBe(true);
	expect(matchWhole(pattern, 'L：1507')).toBe(true);
	expect(matchWhole(pattern, 'Liabilities:1507')).toBe(true);

	expect(matchWhole(pattern, '#tag-1')).toBe(true);
	expect(matchWhole(pattern, '^link-1')).toBe(true);
	expect(matchWhole(pattern, 'USD')).toBe(true);
});
