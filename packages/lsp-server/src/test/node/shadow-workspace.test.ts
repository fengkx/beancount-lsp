import { mkdtemp, readFile, rm, stat, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { SourceSnapshot } from '../../common/ledger/snapshots';
import { ShadowWorkspace } from '../../node/shadow-workspace';

describe('ShadowWorkspace', () => {
	it('materializes buffer contents and applies incremental sync', async () => {
		const rootPath = await mkdtemp(join(tmpdir(), 'bean-shadow-test-'));
		const mainPath = join(rootPath, 'main.bean');
		const accountsPath = join(rootPath, 'accounts.bean');
		await writeFile(mainPath, 'include "accounts.bean"\n');
		await writeFile(accountsPath, 'disk\n');
		const workspaceUri = pathToFileURL(rootPath).toString();
		const mainUri = pathToFileURL(mainPath).toString();
		const accountsUri = pathToFileURL(accountsPath).toString();
		const snapshot: SourceSnapshot = {
			contextId: 'test-context',
			workspaceUri,
			mainFileUri: mainUri,
			revision: 1,
			files: new Map([
				[mainUri, { uri: mainUri, text: 'include "accounts.bean"\n', origin: 'disk' }],
				[accountsUri, { uri: accountsUri, text: 'unsaved\n', documentVersion: 2, origin: 'open-buffer' }],
			]),
			reachableUris: new Set([mainUri, accountsUri]),
			includeGraph: { edges: new Map(), unresolved: new Map() },
		};
		const shadow = new ShadowWorkspace();
		await shadow.reset(snapshot);
		const shadowAccounts = shadow.mapSourcePath(accountsUri);

		expect(await readFile(shadowAccounts, 'utf8')).toBe('unsaved\n');
		if (process.platform !== 'win32') {
			expect((await stat(shadowAccounts)).mode & 0o777).toBe(0o600);
		}

		await shadow.sync({
			contextId: 'test-context',
			revision: 2,
			updates: [{ uri: accountsUri, text: 'latest\n', documentVersion: 3, origin: 'open-buffer' }],
			removed: [],
		});
		expect(await readFile(shadowAccounts, 'utf8')).toBe('latest\n');
		expect(shadow.mapRuntimePath(shadowAccounts)).toBe(accountsPath);
		await shadow.dispose();
	});

	it('rewrites managed absolute includes to the shadow tree', async () => {
		const rootPath = await mkdtemp(join(tmpdir(), 'bean-shadow-test-'));
		const mainPath = join(rootPath, 'main.bean');
		const childPath = join(rootPath, 'child.bean');
		const workspaceUri = pathToFileURL(rootPath).toString();
		const mainUri = pathToFileURL(mainPath).toString();
		const childUri = pathToFileURL(childPath).toString();
		const shadow = new ShadowWorkspace();
		await shadow.reset({
			contextId: 'absolute-context',
			workspaceUri,
			mainFileUri: mainUri,
			revision: 1,
			files: new Map([
				[mainUri, { uri: mainUri, text: `include "${childPath}"\n`, origin: 'disk' }],
				[childUri, { uri: childUri, text: '', origin: 'disk' }],
			]),
			reachableUris: new Set([mainUri, childUri]),
			includeGraph: { edges: new Map(), unresolved: new Map() },
		});
		const text = await readFile(shadow.mainFilePath, 'utf8');
		expect(text).toContain(shadow.mapSourcePath(childUri));
		await shadow.dispose();
	});

	it('rebuilds the shadow tree when the operating system removes its temporary directory', async () => {
		const rootPath = await mkdtemp(join(tmpdir(), 'bean-shadow-test-'));
		const mainPath = join(rootPath, 'main.bean');
		const mainUri = pathToFileURL(mainPath).toString();
		const snapshot: SourceSnapshot = {
			contextId: 'recovery-context',
			workspaceUri: pathToFileURL(rootPath).toString(),
			mainFileUri: mainUri,
			revision: 1,
			files: new Map([[mainUri, { uri: mainUri, text: 'option "title" "Recovered"\n', origin: 'open-buffer' }]]),
			reachableUris: new Set([mainUri]),
			includeGraph: { edges: new Map(), unresolved: new Map() },
		};
		const shadow = new ShadowWorkspace();
		try {
			await shadow.reset(snapshot);
			const sessionRoot = dirname(dirname(shadow.mainFilePath));
			await rm(sessionRoot, { recursive: true, force: true });

			expect(await shadow.isMaterialized()).toBe(false);
			expect(await shadow.ensureMaterialized(snapshot)).toBe(true);
			expect(await readFile(shadow.mainFilePath, 'utf8')).toBe('option "title" "Recovered"\n');
		} finally {
			await shadow.dispose();
			await rm(rootPath, { recursive: true, force: true });
		}
	});

	it('does not clean an old session owned by a running process', async () => {
		const ownedSessionRoot = await mkdtemp(join(tmpdir(), 'beancount-lsp-'));
		const rootPath = await mkdtemp(join(tmpdir(), 'bean-shadow-test-'));
		const mainPath = join(rootPath, 'main.bean');
		const mainUri = pathToFileURL(mainPath).toString();
		const shadow = new ShadowWorkspace();
		try {
			await writeFile(join(ownedSessionRoot, '.owner.json'), JSON.stringify({ pid: process.pid }));
			const staleTime = new Date(Date.now() - 25 * 60 * 60 * 1000);
			await utimes(ownedSessionRoot, staleTime, staleTime);

			await shadow.reset({
				contextId: 'cleanup-context',
				workspaceUri: pathToFileURL(rootPath).toString(),
				mainFileUri: mainUri,
				revision: 1,
				files: new Map([[mainUri, { uri: mainUri, text: '', origin: 'disk' }]]),
				reachableUris: new Set([mainUri]),
				includeGraph: { edges: new Map(), unresolved: new Map() },
			});

			expect((await stat(ownedSessionRoot)).isDirectory()).toBe(true);
		} finally {
			await shadow.dispose();
			await rm(ownedSessionRoot, { recursive: true, force: true });
			await rm(rootPath, { recursive: true, force: true });
		}
	});

	it('resolves an external relative include from the declaring file', async () => {
		const parentPath = await mkdtemp(join(tmpdir(), 'bean-shadow-test-'));
		const rootPath = join(parentPath, 'ledger');
		const mainPath = join(rootPath, 'main.bean');
		const sharedPath = join(parentPath, 'shared.bean');
		const workspaceUri = pathToFileURL(rootPath).toString();
		const mainUri = pathToFileURL(mainPath).toString();
		const shadow = new ShadowWorkspace();
		await shadow.reset({
			contextId: 'external-relative-context',
			workspaceUri,
			mainFileUri: mainUri,
			revision: 1,
			files: new Map([
				[mainUri, { uri: mainUri, text: 'include "../shared.bean"\n', origin: 'disk' }],
			]),
			reachableUris: new Set([mainUri]),
			includeGraph: {
				edges: new Map(),
				unresolved: new Map([[mainUri, ['../shared.bean']]]),
			},
		});

		expect(await readFile(shadow.mainFilePath, 'utf8')).toBe(`include "${sharedPath}"\n`);
		await shadow.dispose();
	});
});
