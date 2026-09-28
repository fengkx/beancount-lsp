import { afterEach, describe, expect, it, vi } from 'vitest';
import { Connection, DidChangeWatchedFilesParams, Emitter, FileChangeType } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createBrowserBeancountManager } from '../../browser/beancount-manager';
import { DocumentStore } from '../../common/document-store';
import { RealBeancountManager } from '../../common/features/types';
import { onDidChangeWatchedFiles } from '../../common/utils/watched-files';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));

const workers = vi.hoisted(() =>
	[] as Array<{
		files: Map<string, string>;
		beancheck: ReturnType<typeof vi.fn>;
	}>
);

vi.mock('../../browser/beancount-worker-client', () => ({
	BeancountWorkerClient: class {
		files = new Map<string, string>();
		beancheck = vi.fn(async () => JSON.stringify({ errors: [], flags: [] }));
		constructor() {
			workers.push(this);
		}
		async init() {}
		async reset(files: Array<{ name: string; content: string }>) {
			this.files.clear();
			await this.sync(files, []);
		}
		async sync(files: Array<{ name: string; content: string }>, removed: string[]) {
			for (const name of removed) this.files.delete(name);
			for (const file of files) this.files.set(file.name, file.content);
		}
		dispose() {}
	},
}));

const managers: RealBeancountManager[] = [];
afterEach(() => {
	for (const manager of managers.splice(0)) manager.dispose?.();
	workers.length = 0;
	vi.useRealTimers();
});

function setup() {
	vi.useFakeTimers();
	let watched: ((event: DidChangeWatchedFilesParams) => void) | undefined;
	const connection = {
		// Match JSON-RPC's single-handler semantics rather than an event emitter.
		onDidChangeWatchedFiles: vi.fn((handler: typeof watched) => {
			watched = handler;
			return { dispose() {} };
		}),
		onDidSaveTextDocument: () => ({ dispose() {} }),
		workspace: {
			getConfiguration: async () => ({ browserWasmBeancount: { enabled: 'v3' } }),
		},
	} as unknown as Connection;
	const open = new Emitter<{ document: TextDocument }>();
	const disk = new Map<string, string>();
	const cache = new Map<string, TextDocument>();
	const documents = {
		onDidOpen: open.event,
		onDidChangeContent2: () => ({ dispose() {} }),
		onDidClose: () => ({ dispose() {} }),
		getWorkspaceFolderFor: async (uri: string) => ({ uri: uri.slice(0, uri.lastIndexOf('/')) }),
		getBeanFilesFor: (scope: string) => [...disk.keys()].filter(uri => uri.startsWith(`${scope}/`)),
		removeFile: (uri: string) => cache.delete(uri),
		retrieve: async (uri: string) => {
			if (!cache.has(uri)) cache.set(uri, TextDocument.create(uri, 'beancount', 1, disk.get(uri) ?? ''));
			return cache.get(uri)!;
		},
	} as unknown as DocumentStore;
	return {
		connection,
		documents,
		disk,
		open,
		fire: (uri: string, type: FileChangeType) => watched!({ changes: [{ uri, type }] }),
		fireBatch: (changes: DidChangeWatchedFilesParams['changes']) => watched!({ changes }),
		async manager(scope: string) {
			disk.set(`${scope}/main.bean`, 'include "./trip_jp.bean"');
			const manager = createBrowserBeancountManager(connection, documents, 'worker.js')(connection, documents);
			managers.push(manager);
			await manager.setMainFile(`${scope}/main.bean`);
			return manager;
		},
	};
}

function file(worker: typeof workers[number], name: string) {
	return [...worker.files].find(([path]) => path.endsWith(`/${name}`))?.[1];
}

describe('browser workspace file synchronization', () => {
	it('delivers create/change/delete to every workspace manager despite later subscribers', async () => {
		const fixture = setup();
		const first = await fixture.manager('file:///one');
		await fixture.manager('file:///two');
		const otherListener = vi.fn();
		const subscription = onDidChangeWatchedFiles(fixture.connection, otherListener);
		expect(fixture.connection.onDidChangeWatchedFiles).toHaveBeenCalledTimes(1);

		for (const [index, scope] of ['one', 'two'].entries()) {
			const uri = `file:///${scope}/trip_jp.bean`;
			fixture.disk.set(uri, 'created');
			fixture.fire(uri, FileChangeType.Created);
			await vi.advanceTimersByTimeAsync(400);
			expect(file(workers[index]!, 'trip_jp.bean')).toBe('created');
			expect(workers[index]!.beancheck).toHaveBeenLastCalledWith(expect.any(String), { mode: 'full' });

			fixture.disk.set(uri, 'changed');
			fixture.fire(uri, FileChangeType.Changed);
			await vi.advanceTimersByTimeAsync(400);
			expect(file(workers[index]!, 'trip_jp.bean')).toBe('changed');

			fixture.disk.delete(uri);
			fixture.fire(uri, FileChangeType.Deleted);
			await vi.advanceTimersByTimeAsync(400);
			expect(file(workers[index]!, 'trip_jp.bean')).toBeUndefined();
		}
		expect(otherListener).toHaveBeenCalledTimes(6);
		first.dispose?.();
		subscription.dispose();
		fixture.disk.set('file:///two/trip_jp.bean', 'after disposal');
		fixture.fire('file:///two/trip_jp.bean', FileChangeType.Created);
		await vi.advanceTimersByTimeAsync(400);
		expect(file(workers[1]!, 'trip_jp.bean')).toBe('after disposal');
		expect(file(workers[0]!, 'trip_jp.bean')).toBeUndefined();
		expect(otherListener).toHaveBeenCalledTimes(6);
	});

	it('syncs a pull batch on a virtual repository without opening the added file', async () => {
		const fixture = setup();
		const scope = 'vscode-vfs://github/owner/ledger';
		await fixture.manager(scope);
		const worker = workers[0]!;
		const newMain = 'include "./trip_jp.bean"\n; pulled revision';
		fixture.disk.set(`${scope}/main.bean`, newMain);
		fixture.disk.set(`${scope}/trip_jp.bean`, '2026-01-01 open Assets:Travel JPY');
		const checksBefore = worker.beancheck.mock.calls.length;
		fixture.fireBatch([
			{ uri: `${scope}/main.bean`, type: FileChangeType.Changed },
			{ uri: `${scope}/trip_jp.bean`, type: FileChangeType.Created },
		]);
		await vi.advanceTimersByTimeAsync(400);
		expect(file(worker, 'main.bean')).toBe(newMain);
		expect(file(worker, 'trip_jp.bean')).toBe('2026-01-01 open Assets:Travel JPY');
		expect(worker.beancheck.mock.calls.length).toBeGreaterThan(checksBefore);
	});

	it('syncs a newly opened file without requiring an edit or watcher notification', async () => {
		const fixture = setup();
		await fixture.manager('file:///one');
		const checksBefore = workers[0]!.beancheck.mock.calls.length;
		fixture.open.fire({ document: TextDocument.create('file:///one/trip_jp.bean', 'beancount', 1, '') });
		await vi.advanceTimersByTimeAsync(400);
		expect(file(workers[0]!, 'trip_jp.bean')).toBe('');
		expect(workers[0]!.beancheck.mock.calls.length).toBeGreaterThan(checksBefore);
	});
});
