import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	getTagDirectiveIndex: vi.fn(),
}));

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		warn() {}
	},
}));

vi.mock('../../common/utils/tag-directives', () => ({
	getTagDirectiveIndex: mocks.getTagDirectiveIndex,
}));

vi.mock('../../common/features/position-utils', () => ({}));

vi.mock('../../common/features/symbol-index', () => ({
	SymbolIndex: class {},
}));

vi.mock('../../common/features/symbol-extractors', () => ({
	SymbolKey: { TYPE: 's' },
	SymbolType: {},
	getRange: vi.fn(),
}));

import { DefinitionFeature } from '../../common/features/definitions';
import { LinkedEditingRangeFeature } from '../../common/features/linked-editing-ranges';

function tagNode(line: number) {
	return {
		startPosition: { row: line, column: 8 },
		endPosition: { row: line, column: 12 },
	};
}

function rangeFor(node: ReturnType<typeof tagNode>) {
	return {
		start: { line: node.startPosition.row, character: node.startPosition.column },
		end: { line: node.endPosition.row, character: node.endPosition.column },
	};
}

type TestRange = ReturnType<typeof rangeFor>;
type TestPosition = { line: number; character: number };

describe('cached tag navigation', () => {
	const pushNode = { type: 'pushtag', startIndex: 0, parent: null };
	const popNode = { type: 'poptag', startIndex: 20, parent: null };
	const pushTagNode = tagNode(0);
	const popTagNode = tagNode(2);
	const push = { type: 'pushtag', node: pushNode, tagNode: pushTagNode, name: 'same' };
	const pop = { type: 'poptag', node: popNode, tagNode: popTagNode, name: 'same' };
	const index = {
		get: vi.fn((node: unknown) => node === pushNode ? push : node === popNode ? pop : undefined),
		getPair: vi.fn((node: unknown) => node === pushNode ? pop : node === popNode ? push : undefined),
	};
	const tree = { rootNode: { descendantForIndex: vi.fn().mockReturnValue(popNode) } };
	const document = { uri: 'file:///test.bean', offsetAt: vi.fn().mockReturnValue(20) };
	const documents = { retrieve: vi.fn().mockResolvedValue(document) };
	const trees = { getParseTree: vi.fn().mockResolvedValue(tree) };

	beforeEach(() => {
		mocks.getTagDirectiveIndex.mockReset();
		mocks.getTagDirectiveIndex.mockResolvedValue(index);
	});

	it('resolves a poptag definition through the cached directive index', async () => {
		const feature = new DefinitionFeature(documents as never, trees as never, {} as never);

		const result = await (feature as unknown as {
			findPushTagDefinitions(
				doc: typeof document,
				position: TestPosition,
			): Promise<Array<{ uri: string; range: TestRange }> | null>;
		}).findPushTagDefinitions(document, { line: 2, character: 10 });

		expect(mocks.getTagDirectiveIndex).toHaveBeenCalledWith(tree);
		expect(result).toEqual([{
			uri: document.uri,
			range: rangeFor(pushTagNode),
		}]);
	});

	it('returns linked ranges in push-then-pop order when invoked from a poptag', async () => {
		const feature = new LinkedEditingRangeFeature(documents as never, trees as never);

		const result = await (feature as unknown as {
			provideLinkedEditingRanges(params: {
				textDocument: { uri: string };
				position: TestPosition;
			}): Promise<{ ranges: TestRange[] } | null>;
		}).provideLinkedEditingRanges({
			textDocument: { uri: document.uri },
			position: { line: 2, character: 10 },
		});

		expect(result?.ranges).toEqual([
			rangeFor(pushTagNode),
			rangeFor(popTagNode),
		]);
	});

	it('keeps incomplete unmatched directives non-navigable', async () => {
		mocks.getTagDirectiveIndex.mockResolvedValue({
			get: vi.fn().mockReturnValue(pop),
			getPair: vi.fn().mockReturnValue(undefined),
		});
		const feature = new LinkedEditingRangeFeature(documents as never, trees as never);

		const result = await (feature as unknown as {
			provideLinkedEditingRanges(params: {
				textDocument: { uri: string };
				position: TestPosition;
			}): Promise<{ ranges: TestRange[] } | null>;
		}).provideLinkedEditingRanges({
			textDocument: { uri: document.uri },
			position: { line: 2, character: 10 },
		});

		expect(result).toBeNull();
	});
});
