import { describe, expect, it, vi } from 'vitest';
import type { RealBeancountManager } from '../../common/features/types';
import { ContextualBeancountManager } from '../../common/ledger/contextual-beancount-manager';

function createRuntime(balance: string): RealBeancountManager {
	return {
		isEnabled: () => true,
		canResolvePreciseIncompletePostingHint: () => false,
		getRuntimeStatus: () => ({ mode: 'local' }),
		getEvaluationState: () => ({
			sourceRevision: 1,
			diagnosticsRevision: 1,
			diagnosticsStatus: 'fresh',
			derivedRevision: 1,
			inputMode: 'saved-files',
		}),
		requestEvaluation: vi.fn(),
		getBalance: () => [{ number: balance, currency: 'USD' }],
		getBalanceSnapshot: () => ({
			value: [{ number: balance, currency: 'USD' }],
			sourceRevision: 1,
			freshness: 'fresh',
			inputMode: 'saved-files',
		}),
		getSubaccountBalances: () => new Map(),
		getPadAmounts: () => null,
		getPadAmountsSnapshot: () => ({
			value: null,
			sourceRevision: 1,
			freshness: 'fresh',
			inputMode: 'saved-files',
		}),
		getErrors: () => [],
		getFlagged: () => [],
		setMainFile: vi.fn(() => Promise.resolve()),
		getPreciseIncompletePostingHint: () => Promise.resolve(null),
		runQuery: () => Promise.resolve(''),
	};
}

describe('ContextualBeancountManager', () => {
	it('uses the only ledger for a scope outside the workspace', async () => {
		const context = {
			id: 'one',
			workspace: { uri: 'file:///ledger', name: 'ledger' },
			mainFileUri: 'file:///ledger/main.bean',
		};
		const contexts = {
			all: [context],
			forDocument: (uri: string) => uri.startsWith('file:///ledger/') ? context : null,
		};
		const manager = new ContextualBeancountManager(
			{} as never,
			{} as never,
			contexts as never,
			() => createRuntime('42'),
		);

		await manager.setMainFile(context.mainFileUri);

		expect(manager.isEnabled('file:///shared/accounts.bean')).toBe(true);
		expect(manager.getBalance('Assets:Bank', false, 'file:///shared/accounts.bean')).toEqual([
			{ number: '42', currency: 'USD' },
		]);
	});

	it('does not guess a ledger for an external scope when multiple ledgers exist', async () => {
		const contexts = [
			{
				id: 'one',
				workspace: { uri: 'file:///one', name: 'one' },
				mainFileUri: 'file:///one/main.bean',
			},
			{
				id: 'two',
				workspace: { uri: 'file:///two', name: 'two' },
				mainFileUri: 'file:///two/main.bean',
			},
		];
		const registry = {
			all: contexts,
			forDocument: (uri: string) => contexts.find(context => uri.startsWith(`${context.workspace.uri}/`)) ?? null,
		};
		let runtime = 0;
		const manager = new ContextualBeancountManager(
			{} as never,
			{} as never,
			registry as never,
			() => createRuntime(String(++runtime)),
		);

		await manager.setMainFile(contexts[0]!.mainFileUri);
		await manager.setMainFile(contexts[1]!.mainFileUri);

		expect(manager.isEnabled('file:///shared/accounts.bean')).toBe(false);
		expect(manager.getBalance('Assets:Bank', false, 'file:///shared/accounts.bean')).toEqual([]);
	});
});
