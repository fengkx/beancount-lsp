import { describe, expect, it, vi } from 'vitest';
import { CompletionItemKind } from 'vscode-languageserver';
import { runCompletionEngine } from '../../common/features/completions/completion-engine';

function node(type: string) {
	return { type };
}

function collector() {
	return {
		completions: [],
		existingCompletions: new Set<string>(),
		position: { line: 0, character: 0 },
		symbolIndex: {},
		enablePinyin: false,
		textCtx: {
			linePrefix: '',
			tokenRange: { startChar: 0, endChar: 0 },
			tokenText: '',
			afterHash: false,
			afterCaret: false,
		},
	};
}

function dependencies() {
	return {
		logger: { debug: vi.fn() },
		resolveCompletionIntent: vi.fn().mockReturnValue([]),
		shouldSuppressCurrencyForCurrentToken: vi.fn().mockReturnValue(false),
		addTagCompletions: vi.fn(),
		addLinkCompletions: vi.fn(),
		addCurrencyCompletions: vi.fn(),
		addPayeesAndNarrations: vi.fn(),
		addAccountCompletions: vi.fn(),
		addDateCompletions: vi.fn(),
		addIdentifierCompletions: vi.fn(),
		reparseWithPlaceholder: vi.fn(),
		completionItemKind: CompletionItemKind,
	};
}

describe('completion ERROR recovery traversal', () => {
	it('reads sibling children once before account recovery', async () => {
		const children = [node('date'), node('txn'), node('narration')];
		const childrenGetter = vi.fn(() => children);
		const parent = {
			get children() {
				return childrenGetter();
			},
			previousNamedSibling: null,
		};
		const current = { type: 'ERROR', parent };
		const resultCollector = collector();
		const deps = dependencies();
		deps.addAccountCompletions.mockImplementation(async () => {
			resultCollector.completions.push({ label: 'Assets:Cash' } as never);
		});

		await runCompletionEngine({
			info: {} as never,
			position: { line: 0, character: 0 },
			current: current as never,
			textCtx: { ...resultCollector.textCtx, inOpenQuote: false },
			collector: resultCollector as never,
			deps,
		});

		expect(deps.addAccountCompletions).toHaveBeenCalledOnce();
		expect(childrenGetter).toHaveBeenCalledOnce();
	});

	it('preserves single-ERROR previous-sibling currency recovery', async () => {
		const previousChildrenGetter = vi.fn(() => [node('account'), node('binary_number_expr')]);
		const previous = {
			get children() {
				return previousChildrenGetter();
			},
			previousNamedSibling: null,
		};
		const errorChild = node('ERROR');
		const parentChildrenGetter = vi.fn(() => [errorChild]);
		const parent = {
			get children() {
				return parentChildrenGetter();
			},
			previousNamedSibling: previous,
		};
		const resultCollector = collector();
		const deps = dependencies();
		deps.addCurrencyCompletions.mockImplementation(async () => {
			resultCollector.completions.push({ label: 'USD' } as never);
		});

		await runCompletionEngine({
			info: {} as never,
			position: { line: 0, character: 0 },
			current: { type: 'ERROR', parent } as never,
			textCtx: { ...resultCollector.textCtx, inOpenQuote: false },
			collector: resultCollector as never,
			deps,
		});

		expect(deps.addCurrencyCompletions).toHaveBeenCalledOnce();
		expect(parentChildrenGetter).toHaveBeenCalledOnce();
		expect(previousChildrenGetter).toHaveBeenCalledOnce();
	});
});
