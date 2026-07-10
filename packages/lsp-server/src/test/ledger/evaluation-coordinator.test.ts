import { describe, expect, it, vi } from 'vitest';
vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));
import { TextDocument } from 'vscode-languageserver-textdocument';
import { LedgerEvaluationCoordinator } from '../../common/ledger/evaluation-coordinator';
import type {
	EvaluationData,
	EvaluationMode,
	LedgerRuntimeAdapter,
	SourceSnapshot,
	SourceSnapshotChange,
} from '../../common/ledger/snapshots';
import { SourceSnapshotService } from '../../common/ledger/source-snapshot-service';

class TestDocumentStore {
	private readonly document: TextDocument;

	constructor(uri: string, text: string) {
		this.document = TextDocument.create(uri, 'beancount', 1, text);
	}

	retrieve(): Promise<TextDocument> {
		return Promise.resolve(this.document);
	}

	isOpen(): boolean {
		return true;
	}
}

class TestAdapter implements LedgerRuntimeAdapter {
	readonly capabilities = {
		supportsLiveBuffers: true,
		supportsDiagnosticsMode: true,
		supportsFullMode: true,
	};
	readonly runtime = { mode: 'local' as const, inputMode: 'live-buffers' as const };
	readonly evaluated: Array<{ revision: number; mode: EvaluationMode }> = [];
	readonly synced: number[] = [];
	resetCount = 0;
	failNextMode?: EvaluationMode;

	reset(_snapshot: SourceSnapshot): Promise<void> {
		this.resetCount += 1;
		return Promise.resolve();
	}

	sync(change: SourceSnapshotChange): Promise<void> {
		this.synced.push(change.revision);
		return Promise.resolve();
	}

	evaluate(snapshot: SourceSnapshot, mode: EvaluationMode): Promise<EvaluationData> {
		this.evaluated.push({ revision: snapshot.revision, mode });
		if (this.failNextMode === mode) {
			this.failNextMode = undefined;
			return Promise.reject(new Error('runtime crashed'));
		}
		return Promise.resolve({
			errors: [],
			flags: [],
			general: {
				accounts: {},
				commodities: [],
				payees: [],
				narrations: [],
				tags: [],
				links: [],
			},
		});
	}

	disposeContext(): Promise<void> {
		return Promise.resolve();
	}
}

describe('LedgerEvaluationCoordinator', () => {
	it('invalidates diagnostics, retains stale derived data, and applies only the latest revision', async () => {
		vi.useFakeTimers();
		const workspaceUri = 'file:///ledger';
		const mainFileUri = `${workspaceUri}/main.bean`;
		const source = new SourceSnapshotService(
			new TestDocumentStore(mainFileUri, 'option "title" "one"\n') as never,
			workspaceUri,
			mainFileUri,
		);
		await source.reset([mainFileUri]);
		const adapter = new TestAdapter();
		const coordinator = new LedgerEvaluationCoordinator(source, adapter, {
			diagnosticsDebounceMs: 1,
			fullDebounceMs: 1,
		});
		await coordinator.initialize();
		expect(coordinator.diagnosticsSnapshot?.sourceRevision).toBe(1);
		expect(coordinator.derivedSnapshot?.state).toBe('fresh');

		source.update(mainFileUri, 'option "title" "two"\n', 2);
		expect(coordinator.diagnosticsSnapshot).toBeUndefined();
		expect(coordinator.derivedSnapshot?.state).toBe('stale');
		source.update(mainFileUri, 'option "title" "three"\n', 3);
		await vi.runAllTimersAsync();
		await Promise.resolve();

		expect(adapter.synced).toEqual([2, 3]);
		expect(coordinator.diagnosticsSnapshot?.sourceRevision).toBe(3);
		expect(coordinator.derivedSnapshot?.state).toBe('fresh');
		expect(adapter.evaluated.some(item => item.revision === 2)).toBe(false);
		await coordinator.dispose();
		vi.useRealTimers();
	});

	it('rebuilds a crashed runtime once and retries the latest revision', async () => {
		const workspaceUri = 'file:///ledger';
		const mainFileUri = `${workspaceUri}/main.bean`;
		const source = new SourceSnapshotService(
			new TestDocumentStore(mainFileUri, '') as never,
			workspaceUri,
			mainFileUri,
		);
		await source.reset([mainFileUri]);
		const adapter = new TestAdapter();
		const coordinator = new LedgerEvaluationCoordinator(source, adapter);
		await coordinator.initialize();
		adapter.failNextMode = 'full';

		await coordinator.request('full', true);

		expect(adapter.resetCount).toBe(2);
		expect(coordinator.derivedSnapshot?.sourceRevision).toBe(1);
		expect(adapter.evaluated.filter(item => item.mode === 'full')).toHaveLength(3);
		await coordinator.dispose();
	});
});
