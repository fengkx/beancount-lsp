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
});
