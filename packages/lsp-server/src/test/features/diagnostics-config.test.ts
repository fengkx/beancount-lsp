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
import { DiagnosticsFeature } from '../../common/features/diagnostics';
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
});
