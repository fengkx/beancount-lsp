import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	api: {
		init: vi.fn(),
		sync: vi.fn(),
		reset: vi.fn(),
		beancheck: vi.fn(),
		interpolateIncompletePosting: vi.fn(),
	},
}));

vi.mock('async-call-rpc/base', () => ({
	AsyncCall: vi.fn(() => mocks.api),
}));

vi.mock('async-call-rpc/utils/web/worker.js', () => ({
	WorkerChannel: class {},
}));

import { BeancountWorkerClient } from '../../browser/beancount-worker-client';

class FakeWorker {
	terminate = vi.fn();
}

describe('BeancountWorkerClient', () => {
	afterEach(() => {
		for (const mock of Object.values(mocks.api)) {
			mock.mockReset();
		}
		vi.unstubAllGlobals();
	});

	it('serializes sync and beancheck calls that share the Pyodide runtime', async () => {
		vi.stubGlobal('Worker', FakeWorker);
		const calls: string[] = [];
		let releaseSync!: () => void;
		const syncGate = new Promise<void>(resolve => {
			releaseSync = resolve;
		});
		mocks.api.sync.mockImplementation(async () => {
			calls.push('sync:start');
			await syncGate;
			calls.push('sync:end');
		});
		mocks.api.beancheck.mockImplementation(async () => {
			calls.push('beancheck');
			return '{}';
		});

		const client = new BeancountWorkerClient('blob:test-worker');
		const sync = client.sync([{ name: 'main.bean', content: '' }], []);
		await vi.waitFor(() => expect(calls).toEqual(['sync:start']));

		const beancheck = client.beancheck('main.bean');
		await Promise.resolve();
		expect(calls).toEqual(['sync:start']);

		releaseSync();
		await Promise.all([sync, beancheck]);
		expect(calls).toEqual(['sync:start', 'sync:end', 'beancheck']);
	});

	it('continues processing queued calls after an operation fails', async () => {
		vi.stubGlobal('Worker', FakeWorker);
		mocks.api.sync.mockRejectedValue(new Error('sync failed'));
		mocks.api.beancheck.mockResolvedValue('{}');

		const client = new BeancountWorkerClient('blob:test-worker');
		const sync = client.sync([], []);
		const beancheck = client.beancheck('main.bean');

		await expect(sync).rejects.toThrow('sync failed');
		await expect(beancheck).resolves.toBe('{}');
		expect(mocks.api.beancheck).toHaveBeenCalledOnce();
	});
});
