import { describe, expect, it, vi } from 'vitest';
import { asLspRange, nodeAtPosition, nodeToCompact } from '../common/common';

describe('nodeAtPosition', () => {
	it('uses tree-sitter native descendant lookup', () => {
		const candidate = { type: 'account' };
		const descendantForPosition = vi.fn().mockReturnValue(candidate);
		const root = { descendantForPosition };

		expect(nodeAtPosition(root as never, { line: 4, character: 7 })).toBe(candidate);
		expect(descendantForPosition).toHaveBeenCalledOnce();
		expect(descendantForPosition).toHaveBeenCalledWith({ row: 4, column: 7 });
	});

	it('does not probe before the beginning of the document for left bias', () => {
		const candidate = { type: 'source_file' };
		const descendantForPosition = vi.fn().mockReturnValue(candidate);

		expect(nodeAtPosition({ descendantForPosition } as never, { line: 0, character: 0 }, true))
			.toBe(candidate);
		expect(descendantForPosition).toHaveBeenCalledOnce();
		expect(descendantForPosition).toHaveBeenCalledWith({ row: 0, column: 0 });
	});

	it('preserves left bias when a node ends exactly at the cursor', () => {
		const candidate = { type: 'posting' };
		const leftCandidate = {
			type: 'account',
			endPosition: { row: 4, column: 7 },
		};
		const descendantForPosition = vi.fn()
			.mockReturnValueOnce(candidate)
			.mockReturnValueOnce(leftCandidate);

		expect(nodeAtPosition({ descendantForPosition } as never, { line: 4, character: 7 }, true))
			.toBe(leftCandidate);
		expect(descendantForPosition).toHaveBeenNthCalledWith(2, { row: 4, column: 6 }, { row: 4, column: 7 });
	});

	it('keeps the exact candidate when the left range spans whitespace', () => {
		const candidate = { type: 'account' };
		const leftCandidate = {
			type: 'posting',
			endPosition: { row: 5, column: 0 },
		};
		const descendantForPosition = vi.fn()
			.mockReturnValueOnce(candidate)
			.mockReturnValueOnce(leftCandidate);

		expect(nodeAtPosition({ descendantForPosition } as never, { line: 4, character: 7 }, true))
			.toBe(candidate);
	});

	it('preserves left bias at the start of an incomplete line', () => {
		const incompleteCandidate = { type: 'ERROR' };
		const previousDirective = {
			type: 'transaction',
			endPosition: { row: 5, column: 0 },
		};
		const descendantForPosition = vi.fn()
			.mockReturnValueOnce(incompleteCandidate)
			.mockReturnValueOnce(previousDirective);

		expect(nodeAtPosition({ descendantForPosition } as never, { line: 5, character: 0 }, true))
			.toBe(previousDirective);
		expect(descendantForPosition).toHaveBeenNthCalledWith(
			2,
			{ row: 4, column: 0x7FFF_FFFF },
			{ row: 5, column: 0 },
		);
	});
});

describe('tree-sitter range conversion', () => {
	it('reads each WASM position once for compact ranges', () => {
		const startPosition = vi.fn(() => ({ row: 1, column: 2 }));
		const endPosition = vi.fn(() => ({ row: 3, column: 4 }));
		const node = {
			get startPosition() {
				return startPosition();
			},
			get endPosition() {
				return endPosition();
			},
		};

		expect(nodeToCompact(node as never)).toEqual([1, 2, 3, 4]);
		expect(startPosition).toHaveBeenCalledOnce();
		expect(endPosition).toHaveBeenCalledOnce();
	});

	it('reads each WASM position once for LSP ranges', () => {
		const startPosition = vi.fn(() => ({ row: 1, column: 2 }));
		const endPosition = vi.fn(() => ({ row: 3, column: 4 }));
		const node = {
			get startPosition() {
				return startPosition();
			},
			get endPosition() {
				return endPosition();
			},
		};

		expect(asLspRange(node as never)).toEqual({
			start: { line: 1, character: 2 },
			end: { line: 3, character: 4 },
		});
		expect(startPosition).toHaveBeenCalledOnce();
		expect(endPosition).toHaveBeenCalledOnce();
	});
});
