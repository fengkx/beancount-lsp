import { describe, expect, it, vi } from 'vitest';
import { SymbolKind } from 'vscode-languageserver';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		error() {}
	},
}));

vi.mock('../../common/language', () => ({
	TreeQuery: {
		getQueryByTokenName: vi.fn(),
	},
}));

import { type SymbolInfo, SymbolKey, SymbolType } from '../../common/features/symbol-extractors';
import { SymbolIndex } from '../../common/features/symbol-index';

function createSymbol(
	type: SymbolInfo[typeof SymbolKey.TYPE],
	name: string,
	uri: string,
	workspace?: string,
	date?: string,
): SymbolInfo {
	return {
		[SymbolKey.TYPE]: type,
		_uri: uri,
		_workspace: workspace,
		name,
		range: [0, 0, 0, name.length],
		kind: SymbolKind.Struct,
		date,
	};
}

function createIndex(symbols: SymbolInfo[]) {
	const storage = {
		findAsync: vi.fn(async (query: Record<string, unknown>) =>
			symbols.filter(symbol =>
				Object.entries(query).every(([key, value]) => symbol[key as keyof SymbolInfo] === value)
			)
		),
		removeSync: vi.fn(),
	};
	const index = new SymbolIndex(
		{} as never,
		{} as never,
		storage as never,
		{ clearOptionsForSource: vi.fn() } as never,
	);
	return { index, storage };
}

describe('SymbolIndex account completion snapshots', () => {
	it('reuses one snapshot for all documents in the same workspace', async () => {
		const workspace = 'file:///workspace';
		const symbols = [
			createSymbol(SymbolType.ACCOUNT_DEFINITION, 'Assets:Cash', `${workspace}/main.bean`, workspace),
			createSymbol(SymbolType.ACCOUNT_USAGE, 'Assets:Cash', `${workspace}/other.bean`, workspace),
		];
		const { index, storage } = createIndex(symbols);
		index.setWorkspaceFolders([workspace]);

		const first = await index.getAccountCompletionSnapshot(`${workspace}/main.bean`);
		const repeated = await Promise.all(
			Array.from(
				{ length: 99 },
				(_, offset) => index.getAccountCompletionSnapshot(`${workspace}/nested/${offset}.bean`),
			),
		);

		expect(repeated.every(snapshot => snapshot === first)).toBe(true);
		expect(first.accountsNames).toEqual(['Assets:Cash']);
		expect(first.usageCounts.get('Assets:Cash')).toBe(1);
		expect(storage.findAsync).toHaveBeenCalledTimes(3);
	});

	it('keeps snapshots isolated between workspaces', async () => {
		const firstWorkspace = 'file:///first';
		const secondWorkspace = 'file:///second';
		const { index, storage } = createIndex([
			createSymbol(SymbolType.ACCOUNT_DEFINITION, 'Assets:First', `${firstWorkspace}/main.bean`, firstWorkspace),
			createSymbol(
				SymbolType.ACCOUNT_DEFINITION,
				'Assets:Second',
				`${secondWorkspace}/main.bean`,
				secondWorkspace,
			),
		]);
		index.setWorkspaceFolders([firstWorkspace, secondWorkspace]);

		const first = await index.getAccountCompletionSnapshot(`${firstWorkspace}/main.bean`);
		const second = await index.getAccountCompletionSnapshot(`${secondWorkspace}/main.bean`);

		expect(first.accountsNames).toEqual(['Assets:First']);
		expect(second.accountsNames).toEqual(['Assets:Second']);
		expect(storage.findAsync).toHaveBeenCalledTimes(6);
	});

	it('uses exact document scopes outside configured workspaces', async () => {
		const { index, storage } = createIndex([
			createSymbol(SymbolType.ACCOUNT_DEFINITION, 'Assets:First', 'file:///first.bean'),
			createSymbol(SymbolType.ACCOUNT_DEFINITION, 'Assets:Second', 'file:///second.bean'),
		]);

		const first = await index.getAccountCompletionSnapshot('file:///first.bean');
		const firstAgain = await index.getAccountCompletionSnapshot('file:///first.bean');
		const second = await index.getAccountCompletionSnapshot('file:///second.bean');

		expect(firstAgain).toBe(first);
		expect(first.accountsNames).toEqual(['Assets:First']);
		expect(second.accountsNames).toEqual(['Assets:Second']);
		expect(storage.findAsync).toHaveBeenCalledTimes(6);
	});

	it('coalesces concurrent snapshot builds for the same scope', async () => {
		const workspace = 'file:///workspace';
		const { index, storage } = createIndex([
			createSymbol(SymbolType.ACCOUNT_DEFINITION, 'Assets:Cash', `${workspace}/main.bean`, workspace),
		]);
		index.setWorkspaceFolders([workspace]);

		const [first, second] = await Promise.all([
			index.getAccountCompletionSnapshot(`${workspace}/main.bean`),
			index.getAccountCompletionSnapshot(`${workspace}/other.bean`),
		]);

		expect(second).toBe(first);
		expect(storage.findAsync).toHaveBeenCalledTimes(3);
	});

	it('invalidates cached snapshots when indexed data is removed', async () => {
		const uri = 'file:///main.bean';
		const { index, storage } = createIndex([
			createSymbol(SymbolType.ACCOUNT_DEFINITION, 'Assets:Cash', uri),
		]);

		const first = await index.getAccountCompletionSnapshot(uri);
		index.removeFile(uri);
		const second = await index.getAccountCompletionSnapshot(uri);

		expect(second).not.toBe(first);
		expect(second.version).toBeGreaterThan(first.version);
		expect(storage.findAsync).toHaveBeenCalledTimes(6);
	});

	it('does not let an invalidated in-flight build overwrite the new snapshot', async () => {
		const uri = 'file:///main.bean';
		let releaseFirstBuild!: () => void;
		const firstBuildBlocked = new Promise<void>(resolve => {
			releaseFirstBuild = resolve;
		});
		let callCount = 0;
		const storage = {
			findAsync: vi.fn(async (query: Record<string, unknown>) => {
				const callNumber = ++callCount;
				if (callNumber <= 3) await firstBuildBlocked;
				const name = callNumber <= 3 ? 'Assets:Old' : 'Assets:New';
				return query[SymbolKey.TYPE] === SymbolType.ACCOUNT_DEFINITION
					? [createSymbol(SymbolType.ACCOUNT_DEFINITION, name, uri)]
					: [];
			}),
			removeSync: vi.fn(),
		};
		const index = new SymbolIndex(
			{} as never,
			{} as never,
			storage as never,
			{ clearOptionsForSource: vi.fn() } as never,
		);

		const staleBuild = index.getAccountCompletionSnapshot(uri);
		index.removeFile(uri);
		const current = await index.getAccountCompletionSnapshot(uri);
		releaseFirstBuild();
		const stale = await staleBuild;
		const cached = await index.getAccountCompletionSnapshot(uri);

		expect(stale.accountsNames).toEqual(['Assets:Old']);
		expect(current.accountsNames).toEqual(['Assets:New']);
		expect(cached).toBe(current);
		expect(storage.findAsync).toHaveBeenCalledTimes(6);
	});
});
