import { describe, expect, it, vi } from 'vitest';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));
vi.mock('../node/beancheck.py', () => ({ default: '' }));

import { CancellationToken, type Connection } from 'vscode-languageserver';
import type { DocumentStore } from '../common/document-store';
import type { BeancountError, BeancountFlag, RealBeancountManager } from '../common/features/types';
import { createBrowserBeancountManager } from '../browser/beancount-manager';
import { beananagerFactory } from '../node/beancount-manager';

type DiagnosticsManagerInternals = RealBeancountManager & {
	diagnosticsResult: { errors: BeancountError[]; flags: BeancountFlag[] } | null;
	inputGeneration: number;
	appliedDiagnosticsGeneration: number;
	diagnosticsStatus: 'fresh' | 'pending' | 'failed';
	markBeancheckInputChanged(reason: string): void;
};

const error: BeancountError = {
	file: '/workspace/main.bean',
	line: 1,
	message: 'existing diagnostic',
};

function createDependencies(): { connection: Connection; documents: DocumentStore } {
	const disposable = { dispose() {} };
	const connection = {
		onDidSaveTextDocument: () => disposable,
		onDidChangeWatchedFiles: () => disposable,
	} as unknown as Connection;
	const documents = {
		onDidChangeContent2: () => disposable,
		onDidClose: () => disposable,
	} as unknown as DocumentStore;
	return { connection, documents };
}

function seedDiagnostics(manager: RealBeancountManager): DiagnosticsManagerInternals {
	const internals = manager as unknown as DiagnosticsManagerInternals;
	internals.inputGeneration = 1;
	internals.appliedDiagnosticsGeneration = 1;
	internals.diagnosticsStatus = 'fresh';
	internals.diagnosticsResult = { errors: [error], flags: [] };
	return internals;
}

describe.each([
	['browser', (connection: Connection, documents: DocumentStore) =>
		createBrowserBeancountManager(connection, documents, 'worker.js')(connection, documents)],
	['node', (connection: Connection, documents: DocumentStore) => beananagerFactory(connection, documents)],
])('%s diagnostics staleness', (_runtime, createManager) => {
	it('keeps the previous diagnostics visible while the new revision is pending', () => {
		const { connection, documents } = createDependencies();
		const manager = seedDiagnostics(createManager(connection, documents));

		manager.markBeancheckInputChanged('document-sync');

		expect(manager.getErrors()).toEqual([error]);
		expect(manager.getEvaluationState()).toMatchObject({
			sourceRevision: 2,
			diagnosticsRevision: 1,
			diagnosticsStatus: 'pending',
		});
	});
});

it('browser diagnostics unfreeze after the retry is exhausted', async () => {
	const { connection, documents } = createDependencies();
	const manager = seedDiagnostics(
		createBrowserBeancountManager(connection, documents, 'worker.js')(connection, documents),
	) as DiagnosticsManagerInternals & {
		enabledMode: 'v3';
		recoveryAttempts: Set<string>;
		recoverRuntimeAfterFailure(error: unknown, generation: number, mode: 'diagnostics'): Promise<void>;
	};
	manager.enabledMode = 'v3';
	manager.markBeancheckInputChanged('document-sync');
	manager.recoveryAttempts.add('2:diagnostics');

	await manager.recoverRuntimeAfterFailure(new Error('second failure'), 2, 'diagnostics');

	expect(manager.getErrors()).toEqual([]);
	expect(manager.getEvaluationState().diagnosticsStatus).toBe('failed');
});

it('node diagnostics unfreeze after the current evaluation fails', async () => {
	const { connection, documents } = createDependencies();
	const manager = seedDiagnostics(beananagerFactory(connection, documents)) as DiagnosticsManagerInternals & {
		runBeanCheck(): Promise<null>;
		revalidateDiagnostics(generation: number, token: typeof CancellationToken.None): Promise<void>;
	};
	manager.markBeancheckInputChanged('document-sync');
	manager.runBeanCheck = () => Promise.resolve(null);

	await manager.revalidateDiagnostics(2, CancellationToken.None);

	expect(manager.getErrors()).toEqual([]);
	expect(manager.getEvaluationState().diagnosticsStatus).toBe('failed');
});
