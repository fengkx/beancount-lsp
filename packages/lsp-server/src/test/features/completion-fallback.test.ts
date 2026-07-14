import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from 'web-tree-sitter';

const mocks = vi.hoisted(() => ({
	getParser: vi.fn(),
}));

vi.mock('@bean-lsp/shared/parser', () => ({
	getParser: mocks.getParser,
}));

import { type PlaceholderKind, reparseWithPlaceholder } from '../../common/features/completions/completion-fallback';

const logger = { debug: vi.fn() };
let parser: Parser;

beforeAll(async () => {
	await Parser.init({
		wasmBinary: readFileSync(
			fileURLToPath(new URL('../../../node_modules/web-tree-sitter/tree-sitter.wasm', import.meta.url)),
		),
	});
	const language = await Parser.Language.load(
		fileURLToPath(new URL('../../../../tree-sitter-beancount/tree-sitter-beancount.wasm', import.meta.url)),
	);
	parser = new Parser();
	parser.setLanguage(language);
	mocks.getParser.mockResolvedValue(parser);
});

async function expectFallbackContext(
	text: string,
	placeholder: string,
	kind: PlaceholderKind,
	ancestorType: string,
) {
	const document = TextDocument.create('file:///editing.bean', 'beancount', 1, text);
	const sourceTree = parser.parse(text);
	const result = await reparseWithPlaceholder(
		logger,
		document,
		document.positionAt(text.length),
		placeholder,
		kind,
		[ancestorType],
		sourceTree,
	);

	expect(result?.ancestors.has(ancestorType)).toBe(true);
	expect(sourceTree.rootNode.text).toBe(text);
	sourceTree.delete();
}

describe('completion placeholder fallback', () => {
	it.each([
		{
			name: 'partial account posting',
			text: '2000-01-01 * "Lunch"\n  Assets:',
			placeholder: 'Assets:Bank',
			kind: 'account' as const,
			ancestor: 'posting',
		},
		{
			name: 'tag trigger',
			text: '2000-01-01 * "Lunch" #',
			placeholder: 'tag',
			kind: 'tag' as const,
			ancestor: 'transaction',
		},
		{
			name: 'currency after an amount',
			text: '2000-01-01 * "Lunch"\n  Assets:Cash  1 ',
			placeholder: ' CNY',
			kind: 'currency' as const,
			ancestor: 'posting',
		},
		{
			name: 'metadata key while typing',
			text: '2000-01-01 * "Lunch"\n  Assets:Cash\n    no',
			placeholder: 'somekey: "value"',
			kind: 'meta' as const,
			ancestor: 'key_value',
		},
		{
			name: 'non-ASCII text before the edit',
			text: '2000-01-01 * "午餐"\n  Assets:',
			placeholder: 'Assets:Bank',
			kind: 'account' as const,
			ancestor: 'posting',
		},
	])('incrementally reparses $name without mutating the cached tree', async ({
		text,
		placeholder,
		kind,
		ancestor,
	}) => {
		await expectFallbackContext(text, placeholder, kind, ancestor);
	});

	it('falls back to a full parse when no source tree is available', async () => {
		const text = '2000-01-01 open Assets:';
		const document = TextDocument.create('file:///editing.bean', 'beancount', 1, text);

		const result = await reparseWithPlaceholder(
			logger,
			document,
			document.positionAt(text.length),
			'Assets:Bank',
			'account',
			['open'],
		);

		expect(result?.ancestors.has('open')).toBe(true);
	});
});
