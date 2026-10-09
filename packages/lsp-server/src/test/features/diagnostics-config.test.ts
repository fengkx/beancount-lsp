import { describe, expect, it, vi } from 'vitest';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));
vi.mock('../../common/language', () => ({ TreeQuery: {} }));
vi.mock('../../common/trees', () => ({ Trees: class {} }));
vi.mock('../../common/document-store', () => ({ DocumentStore: class {} }));
vi.mock('../../common/utils/ast-utils', () => ({ findAllTransactions: async () => [] }));
vi.mock('../../common/utils/balance-checker', () => ({
	checkTransactionBalance: () => ({ isBalanced: true, imbalances: [] }),
	hasBothCostAndPrice: () => false,
	hasEmptyCost: () => false,
	hasOnlyOneIncompleteAmount: () => false,
}));
vi.mock('../../common/utils/expression-parser', () => ({ validateExpression: () => true }));

import { DiagnosticSeverity } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DiagnosticsFeature } from '../../common/features/diagnostics';
import type { RuntimeEvaluationState } from '../../common/features/types';
import { BeancountOptionsManager } from '../../common/utils/beancount-options';
import { makeFakeConnection } from '../utils/test-server-harness';

describe('Diagnostics config and dedup correctness', () => {
	it('loads diagnostics config from beancount.diagnostics section', async () => {
		const feature = new DiagnosticsFeature({} as never, {} as never, new BeancountOptionsManager(), undefined);
		const { connection } = makeFakeConnection({
			configBySection: {
				'beancount.diagnostics': {
					tolerance: 0.01,
					warnOnIncompleteTransaction: false,
				},
			},
		});
		const loaded = await (feature as any).loadDiagnosticsConfig(connection, 'file:///main.bean');
		expect(loaded).toEqual({ tolerance: 0.01, warnOnIncompleteTransaction: false });
	});

	it('falls back to legacy config shape when direct section is unavailable', async () => {
		const feature = new DiagnosticsFeature({} as never, {} as never, new BeancountOptionsManager(), undefined);
		const { connection } = makeFakeConnection({
			legacyConfig: {
				settings: {
					beancount: {
						diagnostics: {
							tolerance: 0.02,
							warnOnIncompleteTransaction: true,
						},
					},
				},
			},
		});
		const loaded = await (feature as any).loadDiagnosticsConfig(connection, 'file:///main.bean');
		expect(loaded).toEqual({ tolerance: 0.02, warnOnIncompleteTransaction: true });
	});

	it('dedups only identical diagnostics and preserves distinct ones on same line', () => {
		const feature = new DiagnosticsFeature({} as never, {} as never, new BeancountOptionsManager(), undefined);
		const preferred = [{
			severity: DiagnosticSeverity.Error,
			range: { start: { line: 1, character: 0 }, end: { line: 1, character: 5 } },
			message: 'A',
			source: 'beancount-lsp',
		}] as any[];
		const secondary = [
			{
				severity: DiagnosticSeverity.Error,
				range: { start: { line: 1, character: 0 }, end: { line: 1, character: 5 } },
				message: 'A',
				source: 'beancount-lsp',
			},
			{
				severity: DiagnosticSeverity.Error,
				range: { start: { line: 1, character: 6 }, end: { line: 1, character: 8 } },
				message: 'B',
				source: 'beancount-lsp',
			},
			{
				severity: DiagnosticSeverity.Warning,
				range: { start: { line: 1, character: 0 }, end: { line: 1, character: 5 } },
				message: 'A',
				source: 'beancount-lsp',
			},
		] as any[];

		const merged = (feature as any).mergeAndDedupDiagnostics(preferred, secondary);
		expect(merged).toHaveLength(3);
	});

	it('publishes only when beancheck diagnostics match the current source revision', () => {
		let diagnosticsRevision: number | null = 1;
		let diagnosticsStatus: RuntimeEvaluationState['diagnosticsStatus'] = 'pending';
		const beanMgr = {
			isEnabled: () => true,
			getEvaluationState: () => ({ sourceRevision: 2, diagnosticsRevision, diagnosticsStatus }),
		};
		const feature = new DiagnosticsFeature(
			{} as never,
			{} as never,
			new BeancountOptionsManager(),
			beanMgr as never,
		);
		const canPublishDiagnostics = (feature as unknown as {
			canPublishDiagnostics(uri: string): boolean;
		}).canPublishDiagnostics.bind(feature);

		expect(canPublishDiagnostics('file:///main.bean')).toBe(false);
		diagnosticsRevision = null;
		diagnosticsStatus = 'failed';
		expect(canPublishDiagnostics('file:///main.bean')).toBe(true);
		diagnosticsRevision = 2;
		diagnosticsStatus = 'fresh';
		expect(canPublishDiagnostics('file:///main.bean')).toBe(true);
	});

	it('clears stale beancheck diagnostics for standalone URIs after errors are fixed', async () => {
		let errors = [
			{ file: '/tmp/main.bean<load>', line: 1, message: 'parse error' },
		];
		const beanMgr = {
			isEnabled: () => true,
			getErrors: () => errors,
			getFlagged: () => [],
			getRuntimeStatus: () => ({ mode: 'off' }),
		};
		const documents = {
			all: () => [],
			keys: () => [],
			getMainBeanFileUri: async () => 'file:///workspace/main.bean',
		};
		const feature = new DiagnosticsFeature(
			documents as never,
			{} as never,
			new BeancountOptionsManager(),
			beanMgr as never,
		);
		const { connection, sentDiagnostics } = makeFakeConnection();

		(feature as any).updateDiagnosticsFromBeancount();
		await (feature as any).validateAllDocuments(connection);

		expect(sentDiagnostics.at(-1)).toMatchObject({
			uri: 'file:///workspace/main.bean',
		});
		expect(sentDiagnostics.at(-1)?.diagnostics).toHaveLength(1);

		errors = [];
		(feature as any).updateDiagnosticsFromBeancount();
		await (feature as any).validateAllDocuments(connection);

		expect(sentDiagnostics.at(-1)).toEqual({
			uri: 'file:///workspace/main.bean',
			diagnostics: [],
		});
	});
});

describe('revision document diagnostics', () => {
	it.each(['github', 'git'])('clears %s snapshots while continuing to validate the working file', async (scheme) => {
		const path = '://github/fengkx/beancount-assets/2026/10.bean';
		const snapshot = TextDocument.create(`${scheme}${path}`, 'beancount', 1, '2026-10-09 ! "Gas"');
		const working = TextDocument.create(`vscode-vfs${path}`, 'beancount', 2, '2026-10-09 * "Gas"');
		const documents = {
			all: () => [snapshot, working],
			keys: () => [snapshot.uri, working.uri],
		};
		const feature = new DiagnosticsFeature(
			documents as never,
			{} as never,
			new BeancountOptionsManager(),
			undefined,
		);
		const internals = feature as any;
		const warning = { message: 'transaction flagged with "!"' };
		const provideDiagnostics = vi.spyOn(internals, 'provideDiagnostics').mockImplementation(
			async (...args: unknown[]) => {
				return (args[0] as TextDocument).getText().includes('!') ? [warning] : [];
			},
		);
		const { connection, sentDiagnostics } = makeFakeConnection();

		await internals.validateAllDocuments(connection);

		expect(provideDiagnostics).toHaveBeenCalledTimes(1);
		expect(provideDiagnostics.mock.calls[0]?.[0]).toBe(working);
		expect(sentDiagnostics).toContainEqual({ uri: snapshot.uri, diagnostics: [] });
		expect(sentDiagnostics).toContainEqual({ uri: working.uri, diagnostics: [] });

		// Working resources must still publish warnings when a pending flag is introduced.
		const pending = TextDocument.create(working.uri, 'beancount', 3, snapshot.getText());
		await internals.validateDocument(pending, connection);
		expect(sentDiagnostics.at(-1)).toEqual({ uri: working.uri, diagnostics: [warning] });
	});

	it.each(['github', 'git'])('clears standalone beancheck diagnostics for %s snapshots', async (scheme) => {
		const uri = `${scheme}://github/fengkx/beancount-assets/2026/10.bean`;
		const feature = new DiagnosticsFeature(
			{ all: () => [], keys: () => [] } as never,
			{} as never,
			new BeancountOptionsManager(),
			undefined,
		);
		const internals = feature as any;
		internals.diagnosticsFromBeancount = { [uri]: [{ message: 'old diagnostic' }] };
		const { connection, sentDiagnostics } = makeFakeConnection();

		await internals.validateAllDocuments(connection);

		expect(sentDiagnostics).toEqual([{ uri, diagnostics: [] }]);
	});
});
