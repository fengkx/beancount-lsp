import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorCodes } from 'vscode-languageserver';

const positionKinds = new Map<string, string>();
const posKey = (line: number, character: number) => `${line}:${character}`;
vi.stubGlobal('__VSCODE__', false);

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
	CustomMessages: {},
	LANGUAGE_ID: 'beancount',
}));

vi.mock('../../common/features/symbol-index', () => ({
	SymbolIndex: class {},
}));

vi.mock('../../common/features/symbol-extractors', () => {
	const SymbolType = {
		ACCOUNT_USAGE: 0,
		ACCOUNT_DEFINITION: 1,
		ACCOUNT_CLOSE: 2,
		PAYEE: 3,
		NARRATION: 4,
		COMMODITY: 5,
		TAG: 6,
		PUSHTAG: 7,
		POPTAG: 8,
		PRICE: 9,
		LINK: 10,
		CURRENCY_DEFINITION: 11,
	} as const;
	const SymbolKey = { TYPE: 's' } as const;
	return {
		SymbolType,
		SymbolKey,
		getRange: (symbol: { range: [number, number, number, number] }) => ({
			start: { line: symbol.range[0], character: symbol.range[1] },
			end: { line: symbol.range[2], character: symbol.range[3] },
		}),
	};
});

vi.mock('../../common/features/position-utils', () => ({
	getRangeAtPosition: async () => ({ start: { line: 0, character: 0 }, end: { line: 0, character: 1 } }),
	getAccountAtPosition: async (_t: unknown, _d: unknown, p: { line: number; character: number }) =>
		positionKinds.get(posKey(p.line, p.character)) === 'account' ? 'Assets:Cash' : null,
	getCommodityAtPosition: async (_t: unknown, _d: unknown, p: { line: number; character: number }) =>
		positionKinds.get(posKey(p.line, p.character)) === 'commodity' ? 'USD' : null,
	getTagAtPosition: async (_t: unknown, _d: unknown, p: { line: number; character: number }) =>
		positionKinds.get(posKey(p.line, p.character)) === 'tag' ? 'oldtag' : null,
	getPushTagAtPosition: async () => null,
	getPopTagAtPosition: async () => null,
	getLinkAtPosition: async (_t: unknown, _d: unknown, p: { line: number; character: number }) =>
		positionKinds.get(posKey(p.line, p.character)) === 'link' ? 'oldlink' : null,
	getPayeeAtPosition: async (_t: unknown, _d: unknown, p: { line: number; character: number }) =>
		positionKinds.get(posKey(p.line, p.character)) === 'payee' ? 'Old Payee' : null,
	getNarrationAtPosition: async (_t: unknown, _d: unknown, p: { line: number; character: number }) =>
		positionKinds.get(posKey(p.line, p.character)) === 'narration' ? 'Old Narration' : null,
}));

import { ReferencesFeature } from '../../common/features/references';
import { RenameFeature } from '../../common/features/rename';
import { SymbolKey, SymbolType } from '../../common/features/symbol-extractors';
import { InMemoryDocumentStore, positionAt, rangeForOccurrence } from '../utils/test-server-harness';

function makeSymbol(
	type: typeof SymbolType[keyof typeof SymbolType],
	uri: string,
	name: string,
	range: [number, number, number, number],
) {
	return { [SymbolKey.TYPE]: type, _uri: uri, name, range, kind: 1 };
}

function compact(range: { start: { line: number; character: number }; end: { line: number; character: number } }): [number, number, number, number] {
	return [range.start.line, range.start.character, range.end.line, range.end.character];
}

describe('references + rename correctness', () => {
	const uri = 'file:///main.bean';
	const text = [
		'2024-01-01 open Assets:Cash',
		'2024-01-01 commodity USD',
		'2024-01-02 * "Old Payee" "Old Narration" #oldtag ^oldlink',
		'  Assets:Cash  1 USD',
		'  Income:Salary',
	].join('\n');
	const docs = new InMemoryDocumentStore({ [uri]: text });
	const trees = {} as never;

	const accountDef = makeSymbol(SymbolType.ACCOUNT_DEFINITION, uri, 'Assets:Cash', compact(rangeForOccurrence(text, 'Assets:Cash', 0)));
	const accountUse = makeSymbol(SymbolType.ACCOUNT_USAGE, uri, 'Assets:Cash', compact(rangeForOccurrence(text, 'Assets:Cash', 1)));
	const commodityDef = makeSymbol(SymbolType.CURRENCY_DEFINITION, uri, 'USD', compact(rangeForOccurrence(text, 'USD', 0)));
	const commodityUse = makeSymbol(SymbolType.COMMODITY, uri, 'USD', compact(rangeForOccurrence(text, 'USD', 1)));
	const tagUse = makeSymbol(SymbolType.TAG, uri, 'oldtag', compact(rangeForOccurrence(text, '#oldtag', 0)));
	const linkUse = makeSymbol(SymbolType.LINK, uri, 'oldlink', compact(rangeForOccurrence(text, '^oldlink', 0)));
	const payeeUse = makeSymbol(SymbolType.PAYEE, uri, 'Old Payee', compact(rangeForOccurrence(text, '"Old Payee"', 0)));
	const narrationUse = makeSymbol(SymbolType.NARRATION, uri, 'Old Narration', compact(rangeForOccurrence(text, '"Old Narration"', 0)));
	const all = [accountDef, accountUse, commodityDef, commodityUse, tagUse, linkUse, payeeUse, narrationUse];

	const symbolIndex = {
		async findAsync(query: Record<string, unknown>) {
			return all.filter((s) => {
				if (query[SymbolKey.TYPE] !== undefined && s[SymbolKey.TYPE] !== query[SymbolKey.TYPE]) return false;
				if (query['name'] !== undefined && s.name !== query['name']) return false;
				return true;
			});
		},
		async getAccountDefinitions() { return [accountDef]; },
		async getCommodityDefinitions() { return [commodityDef]; },
		addAsyncFile() {},
	} as unknown as import('../../common/features/symbol-index').SymbolIndex;

	beforeEach(() => {
		positionKinds.clear();
	});

	it('honors includeDeclaration for account references', async () => {
		const feature = new ReferencesFeature(docs as never, trees, symbolIndex);
		const pos = positionAt(text, 'Assets:Cash', text.indexOf('Assets:Cash', text.indexOf('Assets:Cash') + 1) - text.indexOf('Assets:Cash'));
		positionKinds.set(posKey(pos.line, pos.character), 'account');
		const withoutDef = await feature.onReferences({ textDocument: { uri }, position: pos, context: { includeDeclaration: false } });
		const withDef = await feature.onReferences({ textDocument: { uri }, position: pos, context: { includeDeclaration: true } });
		expect(withoutDef).toHaveLength(1);
		expect(withDef).toHaveLength(2);
	});

	it('includes commodity definitions when includeDeclaration=true', async () => {
		const feature = new ReferencesFeature(docs as never, trees, symbolIndex);
		const secondUsdIndex = text.indexOf('USD', text.indexOf('USD') + 1);
		const pos = positionAt(text, 'USD', secondUsdIndex - text.indexOf('USD'));
		positionKinds.set(posKey(pos.line, pos.character), 'commodity');
		const refs = await feature.onReferences({ textDocument: { uri }, position: pos, context: { includeDeclaration: true } });
		expect(refs).toHaveLength(2);
	});

	it('rename preserves tag/link/payee/narration wrappers', async () => {
		const rename = new RenameFeature(docs as never, trees, symbolIndex);
		const tagPos = positionAt(text, '#oldtag', 1);
		const linkPos = positionAt(text, '^oldlink', 1);
		const payeePos = positionAt(text, 'Old Payee');
		const narrationPos = positionAt(text, 'Old Narration');
		positionKinds.set(posKey(tagPos.line, tagPos.character), 'tag');
		positionKinds.set(posKey(linkPos.line, linkPos.character), 'link');
		positionKinds.set(posKey(payeePos.line, payeePos.character), 'payee');
		positionKinds.set(posKey(narrationPos.line, narrationPos.character), 'narration');

		const tagEdit = await (rename as any).onRename({ textDocument: { uri }, position: tagPos, newName: 'newtag' });
		expect(Object.values(tagEdit.changes).flat().some((e: any) => e.newText === '#newtag')).toBe(true);
		const linkEdit = await (rename as any).onRename({ textDocument: { uri }, position: linkPos, newName: 'newlink' });
		expect(Object.values(linkEdit.changes).flat().some((e: any) => e.newText === '^newlink')).toBe(true);
		const payeeEdit = await (rename as any).onRename({ textDocument: { uri }, position: payeePos, newName: 'ACME "Store"' });
		expect(Object.values(payeeEdit.changes).flat().some((e: any) => e.newText === '"ACME \\"Store\\""')).toBe(true);
		const narrationEdit = await (rename as any).onRename({ textDocument: { uri }, position: narrationPos, newName: 'New Narration' });
		expect(Object.values(narrationEdit.changes).flat().some((e: any) => e.newText === '"New Narration"')).toBe(true);
	});

	it('rename rejects invalid wrapper-prefixed or malformed names', async () => {
		const rename = new RenameFeature(docs as never, trees, symbolIndex);
		const tagPos = positionAt(text, '#oldtag', 1);
		const commodityPos = positionAt(text, 'USD', 1);
		const payeePos = positionAt(text, 'Old Payee');
		positionKinds.set(posKey(tagPos.line, tagPos.character), 'tag');
		positionKinds.set(posKey(commodityPos.line, commodityPos.character), 'commodity');
		positionKinds.set(posKey(payeePos.line, payeePos.character), 'payee');

		await expect((rename as any).onRename({ textDocument: { uri }, position: tagPos, newName: '#foo' }))
			.rejects.toMatchObject({ code: ErrorCodes.InvalidParams });
		await expect((rename as any).onRename({ textDocument: { uri }, position: commodityPos, newName: 'usd lower' }))
			.rejects.toMatchObject({ code: ErrorCodes.InvalidParams });
		await expect((rename as any).onRename({ textDocument: { uri }, position: payeePos, newName: 'bad\nname' }))
			.rejects.toMatchObject({ code: ErrorCodes.InvalidParams });
	});
});
