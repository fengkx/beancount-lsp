import { describe, expect, it, vi } from 'vitest';
vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));
import { BeancountOptionsManager } from '../../common/utils/beancount-options';

describe('BeancountOptionsManager option lifecycle', () => {
	it('replaces options per source and recomputes effective values deterministically', () => {
		const mgr = new BeancountOptionsManager();
		mgr.replaceOptionsForSource('file:///b.bean', new Map([['name_assets', 'BAssets']]));
		mgr.replaceOptionsForSource('file:///a.bean', new Map([['name_assets', 'AAssets']]));
		// lexical order a -> b, later source overrides earlier
		expect(mgr.getOption('name_assets').asString()).toBe('BAssets');

		mgr.replaceOptionsForSource('file:///z.bean', new Map([['name_assets', 'ZAssets']]));
		expect(mgr.getOption('name_assets').asString()).toBe('ZAssets');
	});

	it('clears deleted source and falls back to prior/default values', () => {
		const mgr = new BeancountOptionsManager();
		mgr.replaceOptionsForSource('file:///a.bean', new Map([['name_assets', 'Asset']]));
		expect(mgr.getValidRootAccounts().has('Asset')).toBe(true);
		mgr.clearOptionsForSource('file:///a.bean');
		expect(mgr.getOption('name_assets').asString()).toBe('Assets');
		expect(mgr.getValidRootAccounts().has('Assets')).toBe(true);
	});

	it('empty source replacement removes stale options without deleting source explicitly', () => {
		const mgr = new BeancountOptionsManager();
		mgr.replaceOptionsForSource('file:///a.bean', new Map([['name_assets', 'Asset']]));
		expect(mgr.getOption('name_assets').asString()).toBe('Asset');
		mgr.replaceOptionsForSource('file:///a.bean', new Map());
		expect(mgr.getOption('name_assets').asString()).toBe('Assets');
	});

	it('only emits option change when effective option changes', () => {
		const mgr = new BeancountOptionsManager();
		const seen: Array<{ name: string; value: string }> = [];
		mgr.onOptionChange((e) => seen.push({ name: e.name, value: e.option.asString() }));

		mgr.replaceOptionsForSource('file:///a.bean', new Map([['name_assets', 'Asset']]));
		mgr.replaceOptionsForSource('file:///a.bean', new Map([['name_assets', 'Asset']]));
		mgr.clearOptionsForSource('file:///a.bean');

		expect(seen.filter(e => e.name === 'name_assets').map(e => e.value)).toEqual(['Asset', 'Assets']);
	});

	it('isolates effective options by workspace scope', () => {
		const mgr = new BeancountOptionsManager();
		mgr.setWorkspaceFolders(['file:///one', 'file:///two']);
		mgr.setWorkspaceMainFiles([
			{ workspaceUri: 'file:///one', mainFileUri: 'file:///one/main.bean' },
			{ workspaceUri: 'file:///two', mainFileUri: 'file:///two/main.bean' },
		]);
		mgr.replaceOptionsForSource('file:///one/main.bean', new Map([['name_assets', 'OneAssets']]));
		mgr.replaceOptionsForSource('file:///two/main.bean', new Map([['name_assets', 'TwoAssets']]));

		expect(mgr.getOption('name_assets', 'file:///one/account.bean').asString()).toBe('OneAssets');
		expect(mgr.getOption('name_assets', 'file:///two/account.bean').asString()).toBe('TwoAssets');
	});

	it('uses only the top-level main file options for a workspace scope', () => {
		const mgr = new BeancountOptionsManager();
		mgr.setWorkspaceFolders(['file:///one']);
		mgr.setWorkspaceMainFiles([
			{ workspaceUri: 'file:///one', mainFileUri: 'file:///one/main.bean' },
		]);
		mgr.replaceOptionsForSource('file:///one/main.bean', new Map([['name_assets', 'MainAssets']]));
		mgr.replaceOptionsForSource('file:///one/included.bean', new Map([['name_assets', 'IncludedAssets']]));

		expect(mgr.getOption('name_assets', 'file:///one/included.bean').asString()).toBe('MainAssets');
	});

	it('falls back to defaults instead of another workspace option', () => {
		const mgr = new BeancountOptionsManager();
		mgr.setWorkspaceFolders(['file:///one', 'file:///two']);
		mgr.setWorkspaceMainFiles([
			{ workspaceUri: 'file:///one', mainFileUri: 'file:///one/main.bean' },
			{ workspaceUri: 'file:///two', mainFileUri: 'file:///two/main.bean' },
		]);
		mgr.replaceOptionsForSource('file:///one/main.bean', new Map([['name_assets', 'OneAssets']]));

		expect(mgr.getOption('name_assets', 'file:///two/account.bean').asString()).toBe('Assets');
	});

	it('emits changes when a main file option changes outside the global fallback', () => {
		const mgr = new BeancountOptionsManager();
		mgr.setWorkspaceFolders(['file:///one', 'file:///two']);
		mgr.setWorkspaceMainFiles([
			{ workspaceUri: 'file:///one', mainFileUri: 'file:///one/main.bean' },
			{ workspaceUri: 'file:///two', mainFileUri: 'file:///two/main.bean' },
		]);
		mgr.replaceOptionsForSource('file:///one/main.bean', new Map([['name_assets', 'OneAssets']]));
		mgr.replaceOptionsForSource('file:///two/main.bean', new Map([['name_assets', 'TwoAssets']]));
		const seen: string[] = [];
		mgr.onOptionChange(event => seen.push(event.option.asString()));

		mgr.replaceOptionsForSource('file:///one/main.bean', new Map([['name_assets', 'UpdatedAssets']]));

		expect(seen).toContain('UpdatedAssets');
	});
});
