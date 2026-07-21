import { describe, expect, it, vi } from 'vitest';
import { SelectionRangesFeature } from '../../common/features/selection-ranges';

function node(
	startLine: number,
	endLine: number,
	parent: unknown = null,
) {
	return {
		startPosition: { row: startLine, column: 0 },
		endPosition: { row: endLine, column: 1 },
		parent,
	};
}

describe('SelectionRangesFeature', () => {
	it('uses native descendant lookup and reconstructs the parent chain', async () => {
		const root = { ...node(0, 10), endIndex: 200 };
		const directive = node(4, 7, root);
		const leaf = node(5, 5, directive);
		const descendantForIndex = vi.fn().mockReturnValue(leaf);
		Object.assign(root, { descendantForIndex });
		const document = { offsetAt: vi.fn().mockReturnValue(123) };
		const feature = new SelectionRangesFeature(
			{ retrieve: vi.fn().mockResolvedValue(document) } as never,
			{
				withParseTree: vi.fn((_document, callback) => callback({ rootNode: root })),
			} as never,
		);

		const [result] = await feature.provideSelectionRanges({
			textDocument: { uri: 'file:///test.bean' },
			positions: [{ line: 5, character: 1 }],
		});

		expect(descendantForIndex).toHaveBeenCalledWith(123, 124);
		expect(result?.range.start.line).toBe(5);
		expect(result?.parent?.range.start.line).toBe(4);
		expect(result?.parent?.parent?.range.start.line).toBe(0);
	});

	it('keeps the root selection at the end of the document', async () => {
		const descendantForIndex = vi.fn();
		const root = { ...node(0, 10), endIndex: 200, descendantForIndex };
		const document = { offsetAt: vi.fn().mockReturnValue(200) };
		const feature = new SelectionRangesFeature(
			{ retrieve: vi.fn().mockResolvedValue(document) } as never,
			{
				withParseTree: vi.fn((_document, callback) => callback({ rootNode: root })),
			} as never,
		);

		const [result] = await feature.provideSelectionRanges({
			textDocument: { uri: 'file:///test.bean' },
			positions: [{ line: 10, character: 1 }],
		});

		expect(descendantForIndex).not.toHaveBeenCalled();
		expect(result?.range.start.line).toBe(0);
		expect(result?.parent).toBeUndefined();
	});
});
