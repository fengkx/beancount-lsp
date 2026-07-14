import DataStore from '@bean-lsp/storage';
import { describe, expect, it } from 'vitest';

type StoredSymbol = {
	_uri: string;
	s: number;
	name: string;
	range: number[];
};

describe('DataStore.replaceAsync', () => {
	it('inserts normally when no matching documents exist', async () => {
		const store = new DataStore<StoredSymbol>();
		store.ensureIndexAsync('_uri');
		store.ensureIndexAsync('name');

		const inserted = await store.replaceAsync(
			{ _uri: 'a' },
			[{ _uri: 'a', s: 1, name: 'first', range: [1] }],
			doc => doc.name,
		);

		expect(inserted).toHaveLength(1);
		expect(await store.findAsync({ _uri: 'a', name: 'first' })).toEqual(inserted);
	});

	it('reuses IDs only when every indexed value is unchanged', async () => {
		const store = new DataStore<StoredSymbol>();
		store.ensureIndexAsync('_uri');
		store.ensureIndexAsync('s');
		store.ensureIndexAsync('name');
		const inserted = await store.insertAsync([
			{ _uri: 'a', s: 1, name: 'same', range: [1] },
			{ _uri: 'a', s: 1, name: 'same', range: [2] },
			{ _uri: 'a', s: 2, name: 'collision', range: [3] },
			{ _uri: 'a', s: 3, name: 'removed', range: [4] },
			{ _uri: 'b', s: 1, name: 'outside', range: [5] },
		]);
		const reusableIds = new Set(inserted.slice(0, 2).map(doc => doc._id));
		const collisionId = inserted[2]!._id;
		const outsideId = inserted[4]!._id;

		const replacements = await store.replaceAsync(
			{ _uri: 'a' },
			[
				{ _uri: 'a', s: 1, name: 'same', range: [10] },
				{ _uri: 'a', s: 1, name: 'same', range: [20] },
				{ _uri: 'a', s: 4, name: 'collision', range: [30] },
				{ _uri: 'a', s: 5, name: 'added', range: [40] },
			],
			doc => doc.name,
		);

		expect(new Set(replacements.slice(0, 2).map(doc => doc._id))).toEqual(reusableIds);
		expect(replacements[2]?._id).not.toBe(collisionId);
		expect(await store.findAsync({ _uri: 'a', s: 3 })).toEqual([]);
		expect(await store.findAsync({ _uri: 'a', s: 2 })).toEqual([]);
		expect((await store.findAsync({ _uri: 'a', name: 'same' })).map(doc => doc.range).sort())
			.toEqual([[10], [20]]);
		expect((await store.findAsync({ _uri: 'b' }))[0]?._id).toBe(outsideId);
		expect(await store.countAsync()).toBe(5);
	});

	it('supports removing every matching document', async () => {
		const store = new DataStore<StoredSymbol>();
		store.ensureIndexAsync('_uri');
		await store.insertAsync([
			{ _uri: 'a', s: 1, name: 'one', range: [1] },
			{ _uri: 'b', s: 1, name: 'two', range: [2] },
		]);

		await store.replaceAsync({ _uri: 'a' }, [], doc => doc.name);

		expect(await store.findAsync({ _uri: 'a' })).toEqual([]);
		expect(await store.countAsync()).toBe(1);
	});
});
