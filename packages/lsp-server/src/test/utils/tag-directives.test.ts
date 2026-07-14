import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	matches: vi.fn(),
}));

vi.mock('../../common/language', () => ({
	TreeQuery: {
		getQueryByTokenName: vi.fn(() => ({ matches: mocks.matches })),
	},
}));

import { getTagDirectiveIndex } from '../../common/utils/tag-directives';

type MockNode = {
	startIndex: number;
	text: string;
};

function directiveMatch(type: 'pushtag' | 'poptag', startIndex: number, name: string) {
	const node: MockNode = { startIndex, text: `${type} #${name}` };
	const tagNode: MockNode = { startIndex: startIndex + type.length + 1, text: `#${name}` };
	return {
		node,
		tagNode,
		match: {
			captures: [
				{ name: type, node },
				{ name: 'tag', node: tagNode },
			],
		},
	};
}

describe('getTagDirectiveIndex', () => {
	beforeEach(() => {
		mocks.matches.mockReset();
	});

	it('pairs nested directives by tag name in source order', async () => {
		const outerPush = directiveMatch('pushtag', 0, 'same');
		const innerPush = directiveMatch('pushtag', 20, 'same');
		const innerPop = directiveMatch('poptag', 40, 'same');
		const outerPop = directiveMatch('poptag', 60, 'same');
		mocks.matches.mockResolvedValue([
			outerPop.match,
			innerPush.match,
			outerPush.match,
			innerPop.match,
		]);
		const tree = {};

		const index = await getTagDirectiveIndex(tree as never);

		expect(index.getPair(innerPush.node as never)?.node).toBe(innerPop.node);
		expect(index.getPair(innerPop.node as never)?.node).toBe(innerPush.node);
		expect(index.getPair(outerPush.node as never)?.node).toBe(outerPop.node);
		expect(index.getPair(outerPop.node as never)?.node).toBe(outerPush.node);
	});

	it('keeps independent stacks for different tag names', async () => {
		const alphaPush = directiveMatch('pushtag', 0, 'alpha');
		const betaPush = directiveMatch('pushtag', 20, 'beta');
		const alphaPop = directiveMatch('poptag', 40, 'alpha');
		const betaPop = directiveMatch('poptag', 60, 'beta');
		mocks.matches.mockResolvedValue([
			alphaPush.match,
			betaPush.match,
			alphaPop.match,
			betaPop.match,
		]);

		const index = await getTagDirectiveIndex({} as never);

		expect(index.getPair(alphaPush.node as never)?.node).toBe(alphaPop.node);
		expect(index.getPair(betaPush.node as never)?.node).toBe(betaPop.node);
	});

	it('caches the built index for a parse tree', async () => {
		mocks.matches.mockResolvedValue([]);
		const tree = {};

		const first = await getTagDirectiveIndex(tree as never);
		const second = await getTagDirectiveIndex(tree as never);

		expect(second).toBe(first);
		expect(mocks.matches).toHaveBeenCalledOnce();
	});

	it('leaves incomplete and unmatched directives unpaired', async () => {
		const unmatchedPush = directiveMatch('pushtag', 0, 'open');
		mocks.matches.mockResolvedValue([
			unmatchedPush.match,
			{ captures: [{ name: 'poptag', node: { startIndex: 20, text: 'poptag' } }] },
		]);

		const index = await getTagDirectiveIndex({} as never);

		expect(index.get(unmatchedPush.node as never)?.name).toBe('open');
		expect(index.getPair(unmatchedPush.node as never)).toBeUndefined();
		expect(index.get({ startIndex: 20 } as never)).toBeUndefined();
	});

	it('ignores an incomplete middle directive without disturbing a later pair', async () => {
		const pushtag = directiveMatch('pushtag', 0, 'stable');
		const poptag = directiveMatch('poptag', 40, 'stable');
		mocks.matches.mockResolvedValue([
			pushtag.match,
			{ captures: [{ name: 'poptag', node: { startIndex: 20, text: 'poptag #' } }] },
			poptag.match,
		]);

		const index = await getTagDirectiveIndex({} as never);

		expect(index.getPair(pushtag.node as never)?.node).toBe(poptag.node);
		expect(index.getPair(poptag.node as never)?.node).toBe(pushtag.node);
		expect(index.get({ startIndex: 20 } as never)).toBeUndefined();
	});
});
