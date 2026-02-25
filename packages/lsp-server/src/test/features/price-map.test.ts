import { describe, expect, it, vi } from 'vitest';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));
vi.mock('../../common/features/symbol-index', () => ({
	SymbolIndex: class {},
}));
vi.mock('../../common/features/symbol-extractors', () => ({
	SymbolKey: { TYPE: 's' },
	SymbolType: { PRICE: 9 },
}));
vi.mock('../../common/utils/ast-utils', () => ({
	findAllTransactions: async () => [],
}));
vi.mock('../../common/document-store', () => ({
	DocumentStore: class {},
}));
vi.mock('../../common/trees', () => ({
	Trees: class {},
}));
import { SymbolKey, SymbolType } from '../../common/features/symbol-extractors';
import { PriceMap } from '../../common/features/prices-index/price-map';
import { InMemoryDocumentStore } from '../utils/test-server-harness';

function sym(uri: string, name: string, line: number) {
	return {
		[SymbolKey.TYPE]: SymbolType.PRICE,
		_uri: uri,
		name,
		range: [line, 0, line, 10],
		kind: 1,
	};
}

describe('PriceMap correctness', () => {
	it('chooses latest and historical direct rate correctly', async () => {
		const uri = 'file:///prices.bean';
		const text = [
			'2024-01-01 price HOOL 100 USD',
			'2024-01-10 price HOOL 120 USD',
			'2024-01-20 price HOOL 150 USD',
		].join('\n');
		const docs = new InMemoryDocumentStore({ [uri]: text });
		const trees = {} as never;
		const declarations = [sym(uri, 'HOOL', 0), sym(uri, 'HOOL', 1), sym(uri, 'HOOL', 2)];
		const symbolIndex = {
			async getPricesDeclarations(query: { name?: string }) {
				return query?.name ? declarations.filter(d => d.name === query.name) : declarations;
			},
		} as unknown as import('../../common/features/symbol-index').SymbolIndex;

		const priceMap = new PriceMap(symbolIndex, trees, docs as never);
		const latest = await priceMap.getConvertedPrice('HOOL', 'USD');
		const historical = await priceMap.getConvertedPrice('HOOL', 'USD', '2024-01-15');
		const tooEarly = await priceMap.getConvertedPrice('HOOL', 'USD', '2023-12-31');

		expect(latest?.conversionRate.toString()).toBe('150');
		expect(historical?.conversionRate.toString()).toBe('120');
		expect(tooEarly).toBeUndefined();
	});

	it('invalidates caches and reflects edited prices', async () => {
		const uri = 'file:///prices.bean';
		const initial = [
			'2024-01-01 price HOOL 100 USD',
			'2024-01-10 price AAPL 200 USD',
		].join('\n');
		const docs = new InMemoryDocumentStore({ [uri]: initial });
		const trees = {} as never;
		const declarations = [sym(uri, 'HOOL', 0), sym(uri, 'AAPL', 1)];
		const symbolIndex = {
			async getPricesDeclarations(query: { name?: string }) {
				return query?.name ? declarations.filter(d => d.name === query.name) : declarations;
			},
		} as unknown as import('../../common/features/symbol-index').SymbolIndex;

		const priceMap = new PriceMap(symbolIndex, trees, docs as never);
		const first = await priceMap.getConvertedPrice('HOOL', 'AAPL');
		expect(first?.conversionRate.toString()).toBe('0.5');

		docs.set(uri, [
			'2024-01-01 price HOOL 300 USD',
			'2024-01-10 price AAPL 200 USD',
		].join('\n'));

		const stale = await priceMap.getConvertedPrice('HOOL', 'AAPL');
		expect(stale?.conversionRate.toString()).toBe('0.5');

		priceMap.invalidateAllCaches();
		const refreshed = await priceMap.getConvertedPrice('HOOL', 'AAPL');
		expect(refreshed?.conversionRate.toString()).toBe('1.5');
	});
});
