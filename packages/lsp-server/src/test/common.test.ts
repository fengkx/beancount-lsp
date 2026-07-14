import { describe, expect, it, vi } from 'vitest';
import { nodeAtPosition } from '../common/common';

describe('nodeAtPosition', () => {
	it('uses tree-sitter native descendant lookup', () => {
		const candidate = { type: 'account' };
		const descendantForPosition = vi.fn().mockReturnValue(candidate);
		const root = { descendantForPosition };

		expect(nodeAtPosition(root as never, { line: 4, character: 7 })).toBe(candidate);
		expect(descendantForPosition).toHaveBeenCalledOnce();
		expect(descendantForPosition).toHaveBeenCalledWith({ row: 4, column: 7 });
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
