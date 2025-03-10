import { Logger } from '@bean-lsp/shared';
import Big from 'big.js';
import { DocumentStore } from '../../document-store';
import { Trees } from '../../trees';
import { findAllTransactions } from '../../utils/ast-utils';
import { parseExpression } from '../../utils/expression-parser';
import { SymbolInfo } from '../symbol-extractors';
import { SymbolIndex } from '../symbol-index';

// 创建日志记录器
const logger = new Logger('price-map');

interface PriceDeclaration {
	name: string;
	date: string;
	price: { amount: string; currency: string };
}

interface PriceConversionPath {
	path: string[];
	rate: Big;
}

// 用于表示货币转换图的边
interface ConversionEdge {
	from: string;
	to: string;
	rate: Big;
	date: string;
}

// 用于基准货币和目标货币对
type BaseQuote = [string, string];

/**
 * Bellman-Ford algorithm implementation for finding the optimal currency conversion path
 * Based on the implementation in Fava
 */
class BellmanFord {
	private table: Map<string, [Big, string | null]> = new Map();
	private searched = false;

	/**
	 * Initialize the Bellman-Ford algorithm
	 * @param allNodes All currency nodes in the graph
	 * @param edges Map of edges from each currency to its targets
	 * @param getRate Function to get the conversion rate between two currencies
	 * @param start Start currency
	 */
	constructor(
		private readonly allNodes: string[],
		private readonly edges: Map<string, Set<string>>,
		private readonly getRate: (baseQuote: BaseQuote) => Big | null,
		private readonly start: string,
	) {
		// Initialize distance table
		for (const node of allNodes) {
			// Use 0 to represent infinity (since we're finding max path, not min path)
			this.table.set(node, [new Big(0), null]);
		}
		// Distance to self is 1 (identity)
		this.table.set(start, [new Big(1), null]);
	}

	/**
	 * Get the path from start to the given end node
	 * @param endNode End node
	 * @returns Array of currencies forming the path
	 */
	getPath(endNode: string): string[] {
		if (!this.searched) {
			this.search();
		}

		const result: string[] = [endNode];
		let current = this.table.get(endNode);

		while (current && current[1] !== null && current[1] !== this.start) {
			// Check for cycles
			if (result.includes(current[1])) {
				return result.reverse();
			}

			result.push(current[1]);
			current = this.table.get(current[1]);
		}

		// Add the start node
		if (current && current[1] !== null) {
			result.push(current[1]);
		}

		// Reverse the result to get path from start to end
		return result.reverse();
	}

	/**
	 * Update the distance table with one iteration of Bellman-Ford
	 * @returns True if any distances were updated
	 */
	updateTable(): boolean {
		let updated = false;

		for (const fromNode of this.allNodes) {
			const fromEntry = this.table.get(fromNode);
			if (!fromEntry || fromEntry[0].eq(0)) {
				// Skip nodes with infinite distance
				continue;
			}

			const fromValue = fromEntry[0];
			const toNodes = this.edges.get(fromNode) || new Set<string>();

			for (const toNode of toNodes) {
				// Skip if this is the start node
				if (toNode === this.start) {
					continue;
				}

				const rate = this.getRate([fromNode, toNode]);
				if (!rate) {
					continue;
				}

				const targetValue = fromValue.times(rate);
				const toEntry = this.table.get(toNode);

				if (!toEntry || this.start === toNode) {
					continue;
				}

				// Check if the new path is better
				if (toEntry[0].eq(0) || targetValue.minus(toEntry[0]).abs().gt(0.001)) {
					// Check for existing path to avoid cycles
					const existingPath = this.getPath(toNode);
					if (existingPath.includes(fromNode)) {
						continue;
					}

					// Update the table
					this.table.set(toNode, [targetValue, fromNode]);
					updated = true;
				}
			}
		}

		return updated;
	}

	/**
	 * Run the Bellman-Ford algorithm to find the optimal conversion paths
	 * @returns The distance table
	 */
	search(): Map<string, [Big, string | null]> {
		if (this.searched) {
			return this.table;
		}

		this.searched = true;
		let updated = true;
		let iterations = 0;
		const maxIterations = this.allNodes.length - 1;

		// Run Bellman-Ford algorithm
		while (updated && iterations < maxIterations) {
			updated = this.updateTable();
			iterations++;
		}

		return this.table;
	}
}

export class PriceMap {
	private mainCurrency: string | null = null;
	private currencyUsageCache: Map<string, number> = new Map();
	private lastCurrencyUsageUpdate: number = 0;
	private allowedCurrencies: Set<string> | null = null;

	// 直接使用Map存储转换图，不使用SWR缓存
	private conversionGraph: Map<string, ConversionEdge[]> = new Map();
	private lastConversionGraphUpdate: number = 0;
	private readonly GRAPH_CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存过期时间

	// 直接使用Map存储转换路径，不使用SWR缓存
	private conversionPathCache: Map<string, Map<string, PriceConversionPath>> = new Map();

	constructor(
		private readonly symbolIndex: SymbolIndex,
		private readonly trees: Trees,
		private readonly documents: DocumentStore,
	) {
		// 不再需要初始化SwrCache
	}

	/**
	 * Sets the main currency
	 * @param currency The currency code
	 */
	setMainCurrency(currency: string): void {
		if (this.mainCurrency !== currency) {
			this.mainCurrency = currency;
			// Clear conversion caches when main currency changes
			this.invalidateConversionCaches();
		}
	}

	/**
	 * Sets the allowed currencies for conversion
	 * @param currencies List of allowed currency codes
	 */
	setAllowedCurrencies(currencies: string[]): void {
		// Convert to Set for faster lookups
		this.allowedCurrencies = currencies.length > 0 ? new Set(currencies) : null;
		// Clear conversion caches when allowed currencies change
		this.invalidateConversionCaches();
	}

	/**
	 * Check if a commodity should be included in conversion calculations
	 * @param commodity The commodity code to check
	 * @returns True if the commodity should be included in conversions
	 */
	private isCurrencyAllowed(commodity: string): boolean {
		// If no allowed currencies are specified, all commodities are allowed
		if (!this.allowedCurrencies) {
			return true;
		}

		// Only include commodities in the allowed currencies set
		return this.allowedCurrencies.has(commodity);
	}

	/**
	 * Invalidates conversion-related caches
	 */
	private invalidateConversionCaches(): void {
		this.conversionGraph.clear();
		this.lastConversionGraphUpdate = 0;
		this.conversionPathCache.clear();
	}

	/**
	 * Gets the main currency
	 * @returns The main currency code
	 */
	async getMainCurrency(): Promise<string> {
		// If main currency is already set, return it directly
		if (this.mainCurrency) {
			return this.mainCurrency;
		}

		// Otherwise, use the most frequently used currency as default
		return this.getMostUsedCurrency();
	}

	/**
	 * Gets the most frequently used currency
	 * @returns The most frequently used currency code
	 */
	async getMostUsedCurrency(): Promise<string> {
		// If cache exists and is not expired (valid within 10 minutes), use the cache
		const now = Date.now();
		if (this.currencyUsageCache.size > 0 && now - this.lastCurrencyUsageUpdate < 10 * 60 * 1000) {
			// Find the most used currency
			let mostUsedCurrency = 'USD'; // Default to USD
			let maxUsage = 0;

			for (const [currency, usage] of this.currencyUsageCache.entries()) {
				if (usage > maxUsage) {
					maxUsage = usage;
					mostUsedCurrency = currency;
				}
			}

			return mostUsedCurrency;
		}

		// Count currency usage from all sources
		const currencyUsage = new Map<string, number>();

		try {
			// 1. Count currencies from price declarations
			const allPriceDeclarations = await this.symbolIndex.getPricesDeclarations({});
			for (const declaration of allPriceDeclarations) {
				try {
					const priceDeclaration = await this._parsePriceDeclaration(declaration);
					if (priceDeclaration.price && priceDeclaration.price.currency) {
						const currency = priceDeclaration.price.currency;
						currencyUsage.set(currency, (currencyUsage.get(currency) || 0) + 1);
					}

					// Also count the commodity itself as a currency
					if (priceDeclaration.name) {
						const commodity = priceDeclaration.name;
						currencyUsage.set(commodity, (currencyUsage.get(commodity) || 0) + 1);
					}
				} catch (error) {
					logger.error(`Error parsing price declaration: ${error}`);
				}
			}

			// 2. Count currencies from commodity definitions
			const commodityDefinitions = await this.symbolIndex.getCommodities();
			for (const commodity of commodityDefinitions) {
				if (commodity) {
					currencyUsage.set(commodity, (currencyUsage.get(commodity) || 0) + 3); // Give higher weight to defined commodities
				}
			}

			// 3. Count currencies from transaction postings
			// Get all documents
			const documents = this.documents.all();

			for (const document of documents) {
				try {
					// Get parse tree
					const tree = await this.trees.getParseTree(document);
					if (!tree) continue;

					// Find all transactions and extract postings
					const transactions = findAllTransactions(tree.rootNode, document);

					// Count currencies in each posting
					for (const transaction of transactions) {
						for (const posting of transaction.postings) {
							// Count currency in amount
							if (posting.amount?.currency) {
								const currency = posting.amount.currency;
								currencyUsage.set(currency, (currencyUsage.get(currency) || 0) + 2); // Give higher weight to currencies used in transactions
							}

							// Count currency in cost
							if (posting.cost?.currency) {
								const currency = posting.cost.currency;
								currencyUsage.set(currency, (currencyUsage.get(currency) || 0) + 2);
							}

							// Count currency in price annotation
							if (posting.price?.currency) {
								const currency = posting.price.currency;
								currencyUsage.set(currency, (currencyUsage.get(currency) || 0) + 1);
							}
						}
					}
				} catch (error) {
					logger.error(`Error analyzing transactions in document: ${error}`);
				}
			}
		} catch (error) {
			logger.error(`Error counting currency usage: ${error}`);
		}

		// Update cache
		this.currencyUsageCache = currencyUsage;
		this.lastCurrencyUsageUpdate = now;

		// Find the most used currency
		let mostUsedCurrency = 'USD'; // Default to USD
		let maxUsage = 0;

		for (const [currency, usage] of currencyUsage.entries()) {
			if (usage > maxUsage) {
				maxUsage = usage;
				mostUsedCurrency = currency;
			}
		}

		return mostUsedCurrency;
	}

	/**
	 * Get price information for a specific commodity on a specific date
	 * @param commodity The commodity code
	 * @param date The date, if not specified returns the latest price
	 * @returns The price declaration object
	 */
	async getPriceByCommodity(commodity: string, date?: string): Promise<PriceDeclaration | undefined> {
		if (!commodity) {
			return undefined;
		}

		const pricesDeclarations = await this.symbolIndex.getPricesDeclarations({ name: commodity });

		// Parse each declaration and filter out any that fail to parse
		const prices: PriceDeclaration[] = [];
		for (const declaration of pricesDeclarations) {
			try {
				const priceDeclaration = await this._parsePriceDeclaration(declaration);
				prices.push(priceDeclaration);
			} catch (error) {
				logger.warn(`Skipping invalid price declaration: ${error}`);
			}
		}

		if (prices.length === 0) {
			return undefined;
		}

		// Sort prices by date (newest first)
		const sortedPrices = prices.sort((a: PriceDeclaration, b: PriceDeclaration) =>
			new Date(b.date).getTime() - new Date(a.date).getTime()
		);

		if (date) {
			// First check for exact date match
			const exactMatch = prices.find((p) => p.date === date);
			if (exactMatch) {
				return exactMatch;
			}

			// If no exact match, find the most recent price before the specified date
			const targetDate = new Date(date).getTime();
			// Find the most recent price before or on the specified date
			for (const price of sortedPrices) {
				const priceDate = new Date(price.date).getTime();
				if (priceDate <= targetDate) {
					return price;
				}
			}

			// If no price before the specified date, return undefined
			// This behavior differs from original - now we don't default to the latest price
			// if there's no price before the specified date
			return undefined;
		}

		// If no date specified, return the most recent price
		return sortedPrices[0];
	}

	/**
	 * Get all historical prices for a specific commodity
	 * @param commodity The commodity code
	 * @returns Price list sorted by date (from newest to oldest)
	 */
	async getPriceHistoryByCommodity(commodity: string): Promise<PriceDeclaration[]> {
		if (!commodity) {
			return [];
		}

		const pricesDeclarations = await this.symbolIndex.getPricesDeclarations({ name: commodity });

		// Parse each declaration and filter out any that fail to parse
		const prices: PriceDeclaration[] = [];
		for (const declaration of pricesDeclarations) {
			try {
				const priceDeclaration = await this._parsePriceDeclaration(declaration);
				prices.push(priceDeclaration);
			} catch (error) {
				logger.warn(`Skipping invalid price declaration: ${error}`);
			}
		}

		// Sort by date (from newest to oldest)
		return prices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	/**
	 * Calculate the target currency price for a specific commodity on a specific date
	 * @param commodity The source commodity code
	 * @param targetCurrency The target currency code
	 * @param date The date, if not specified uses the latest price
	 * @returns The conversion result, including path and rate
	 */
	async getConvertedPrice(commodity: string, targetCurrency: string, date?: string): Promise<
		{
			path: string[];
			conversionRate: Big;
		} | undefined
	> {
		if (!commodity || !targetCurrency) {
			return undefined;
		}

		// If the commodity itself is the target currency, return 1:1 ratio
		if (commodity === targetCurrency) {
			return {
				path: [commodity],
				conversionRate: new Big(1),
			};
		}

		// Try direct conversion
		const directPrice = await this.getPriceByCommodity(commodity, date);
		if (directPrice && directPrice.price && directPrice.price.currency === targetCurrency) {
			const amount = parseExpression(directPrice.price.amount);
			return {
				path: [commodity, targetCurrency],
				conversionRate: amount,
			};
		}

		// Need multi-level conversion, use optimized algorithm to find the best conversion path
		const conversionPath = await this._findOptimalConversionPath(commodity, targetCurrency, date);
		if (!conversionPath) {
			return undefined;
		}

		// Calculate final amount
		return {
			path: conversionPath.path,
			conversionRate: conversionPath.rate,
		};
	}

	/**
	 * Build the currency conversion graph
	 * @returns Currency conversion graph (adjacency list representation)
	 */
	private async _buildConversionGraph(): Promise<Map<string, ConversionEdge[]>> {
		logger.debug('Building currency conversion graph');

		// Check if the cached graph is still valid
		const now = Date.now();
		if (this.conversionGraph.size > 0 && now - this.lastConversionGraphUpdate < this.GRAPH_CACHE_TTL) {
			logger.debug('Using cached conversion graph');
			return this.conversionGraph;
		}

		// Create currency conversion graph (adjacency list)
		const graph = new Map<string, ConversionEdge[]>();

		// Get all price declarations
		const allPriceDeclarations = await this.symbolIndex.getPricesDeclarations({});

		// Process each price declaration to build the conversion graph
		for (const declaration of allPriceDeclarations) {
			try {
				const priceDeclaration = await this._parsePriceDeclaration(declaration);

				if (!priceDeclaration.name || !priceDeclaration.price || !priceDeclaration.price.currency) {
					continue;
				}

				const fromCurrency = priceDeclaration.name;
				const toCurrency = priceDeclaration.price.currency;
				const rate = parseExpression(priceDeclaration.price.amount);
				const date = priceDeclaration.date || '';

				if (rate.lte(0)) {
					continue;
				}

				// Add forward edge
				if (!graph.has(fromCurrency)) {
					graph.set(fromCurrency, []);
				}
				graph.get(fromCurrency)?.push({
					from: fromCurrency,
					to: toCurrency,
					rate: rate,
					date: date,
				});

				// Add reverse edge (using reciprocal as the rate)
				if (!graph.has(toCurrency)) {
					graph.set(toCurrency, []);
				}
				graph.get(toCurrency)?.push({
					from: toCurrency,
					to: fromCurrency,
					rate: new Big(1).div(rate),
					date: date,
				});
			} catch (error) {
				logger.error(`Error processing price declaration: ${error}`);
			}
		}

		// Update the cache
		this.conversionGraph = graph;
		this.lastConversionGraphUpdate = now;

		logger.debug(`Conversion graph built with ${graph.size} currencies`);
		return graph;
	}

	/**
	 * Build a map of currency to its connected currencies
	 * @param graph The conversion graph
	 * @returns A map from currency to set of connected currencies
	 */
	private buildEdgesMap(graph: Map<string, ConversionEdge[]>): Map<string, Set<string>> {
		const edgesMap = new Map<string, Set<string>>();

		for (const [from, edges] of graph.entries()) {
			if (!edgesMap.has(from)) {
				edgesMap.set(from, new Set<string>());
			}

			for (const edge of edges) {
				edgesMap.get(from)?.add(edge.to);
			}
		}

		return edgesMap;
	}

	/**
	 * Get the conversion rate between two currencies on a specific date
	 * @param baseQuote Currency pair [from, to]
	 * @param graph Conversion graph
	 * @param date Optional date
	 * @returns Conversion rate or null if not found
	 */
	private getDirectRate(baseQuote: BaseQuote, graph: Map<string, ConversionEdge[]>, date?: string): Big | null {
		const [from, to] = baseQuote;

		// Identity conversion
		if (from === to) {
			return new Big(1);
		}

		const edges = graph.get(from);
		if (!edges) {
			return null;
		}

		// Find the edge for the target currency
		for (const edge of edges) {
			if (edge.to === to) {
				// If date is specified, check if this edge applies
				if (date && edge.date && new Date(edge.date) > new Date(date)) {
					continue;
				}
				return edge.rate;
			}
		}

		return null;
	}

	/**
	 * Find the optimal conversion path between two currencies using Bellman-Ford algorithm
	 * Based on the get_nested_price method from Fava
	 * @param fromCommodity Source commodity
	 * @param toCurrency Target currency
	 * @param date Optional date for historical conversions
	 * @returns Optimal conversion path and rate
	 */
	private async _findOptimalConversionPath(
		fromCommodity: string,
		toCurrency: string,
		date?: string,
	): Promise<PriceConversionPath | undefined> {
		// Check if result already exists in cache
		const fromCacheKey = `${fromCommodity}:${date || 'latest'}`;

		if (this.conversionPathCache.has(fromCacheKey)) {
			const toPathMap = this.conversionPathCache.get(fromCacheKey);
			if (toPathMap && toPathMap.has(toCurrency)) {
				logger.debug(`Using cached conversion path from ${fromCommodity} to ${toCurrency}`);
				return toPathMap.get(toCurrency);
			}
		}

		logger.debug(`Finding optimal conversion path from ${fromCommodity} to ${toCurrency}`);

		// Get conversion graph
		const graph = await this._buildConversionGraph();

		// Try direct conversion first (fast path)
		const directRate = this.getDirectRate([fromCommodity, toCurrency], graph, date);
		if (directRate) {
			const result: PriceConversionPath = {
				path: [fromCommodity, toCurrency],
				rate: directRate,
			};

			// Update cache
			if (!this.conversionPathCache.has(fromCacheKey)) {
				this.conversionPathCache.set(fromCacheKey, new Map());
			}
			this.conversionPathCache.get(fromCacheKey)?.set(toCurrency, result);

			return result;
		}

		// If no direct conversion, use Bellman-Ford to find the optimal path
		const allCurrencies = Array.from(graph.keys());

		// If source or target currency not in graph, conversion is impossible
		if (!allCurrencies.includes(fromCommodity) || !allCurrencies.includes(toCurrency)) {
			return undefined;
		}

		// Build map of edges
		const edgesMap = this.buildEdgesMap(graph);

		// Initialize Bellman-Ford
		const bf = new BellmanFord(
			allCurrencies.filter((currency) =>
				this.isCurrencyAllowed(currency) || currency === fromCommodity || currency === toCurrency
			),
			edgesMap,
			(baseQuote) => this.getDirectRate(baseQuote, graph, date),
			fromCommodity,
		);

		// Run Bellman-Ford search
		const table = bf.search();

		// Check if target currency is reachable
		const targetEntry = table.get(toCurrency);
		if (!targetEntry || targetEntry[0].eq(0)) {
			return undefined;
		}

		// Get the path
		const pathArray = bf.getPath(toCurrency);

		// Calculate the final rate
		const rate = targetEntry[0];

		// Create result
		const result: PriceConversionPath = {
			path: pathArray,
			rate,
		};

		// Update cache
		if (!this.conversionPathCache.has(fromCacheKey)) {
			this.conversionPathCache.set(fromCacheKey, new Map());
		}
		this.conversionPathCache.get(fromCacheKey)?.set(toCurrency, result);

		logger.debug(`Found conversion path: ${pathArray.join(' -> ')} with rate ${rate.toString()}`);
		return result;
	}

	/**
	 * Get price trend data for charting
	 * @param commodity The commodity code
	 * @param targetCurrency The target currency (optional)
	 * @param days Number of days, default 30
	 * @returns Price trend data
	 */
	async getPriceTrend(commodity: string, targetCurrency?: string, days: number = 30): Promise<{
		dates: string[];
		prices: number[];
		currency: string;
	}> {
		// Get commodity price history
		const priceHistory = await this.getPriceHistoryByCommodity(commodity);

		// If no price history records, return empty data
		if (priceHistory.length === 0) {
			return { dates: [], prices: [], currency: targetCurrency || '' };
		}

		// Get current date and start date
		const today = new Date();
		const startDate = new Date();
		startDate.setDate(today.getDate() - days);

		// If no target currency provided, use main currency
		let effectiveTargetCurrency = targetCurrency;
		if (!effectiveTargetCurrency) {
			effectiveTargetCurrency = await this.getMainCurrency();
		}

		// If no currency conversion needed or first price record's currency is the target currency
		if (
			priceHistory[0] && priceHistory[0].price && priceHistory[0].price.currency
			&& (!effectiveTargetCurrency || priceHistory[0].price.currency === effectiveTargetCurrency)
		) {
			// Filter and process price data within the time range
			const filteredPrices = priceHistory
				.filter(p => p.date && new Date(p.date) >= startDate)
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

			const baseCurrency = priceHistory[0].price && priceHistory[0].price.currency
				? priceHistory[0].price.currency
				: '';

			return {
				dates: filteredPrices.map(p => p.date || ''),
				prices: filteredPrices.map(p => parseExpression(p.price.amount).toNumber()),
				currency: baseCurrency,
			};
		}

		// At this point we know targetCurrency exists, use non-null assertion
		const nonNullTargetCurrency = effectiveTargetCurrency || '';

		// Need currency conversion
		const result: { dates: string[]; prices: number[]; currency: string } = {
			dates: [],
			prices: [],
			currency: nonNullTargetCurrency,
		};

		// Convert for each date
		for (const priceData of priceHistory) {
			if (!priceData.date) continue;

			const priceDate = new Date(priceData.date);
			if (priceDate < startDate) continue;

			// Ensure target currency exists
			const convertedPrice = await this.getConvertedPrice(
				commodity,
				nonNullTargetCurrency,
				priceData.date,
			);

			if (convertedPrice) {
				result.dates.push(priceData.date);
				result.prices.push(convertedPrice.conversionRate.toNumber());
			}
		}

		// Sort by date
		const sortedIndices = result.dates
			.map((_, i) => i)
			.sort((a, b) => {
				const dateA = result.dates[a] || '';
				const dateB = result.dates[b] || '';
				return new Date(dateA).getTime() - new Date(dateB).getTime();
			});

		result.dates = sortedIndices.map(i => result.dates[i] || '');
		result.prices = sortedIndices.map(i => result.prices[i] || 0);

		return result;
	}

	/**
	 * Parse a price declaration node
	 * @param node Symbol information node
	 * @returns Price declaration object
	 * @throws Error when parsing fails
	 */
	private async _parsePriceDeclaration(node: SymbolInfo): Promise<PriceDeclaration> {
		// Retrieve the document for this symbol
		const document = await this.documents.retrieve(node._uri);

		// Get the line of text containing the price declaration
		const lineRange = {
			start: { line: node.range[0], character: 0 },
			end: { line: node.range[0], character: Number.MAX_SAFE_INTEGER },
		};
		const lineContent = document.getText(lineRange);

		// Parse the price directive using regex
		// According to Beancount syntax:
		// YYYY-MM-DD price COMMODITY AMOUNT CURRENCY
		// Example: 2014-07-09 price HOOL 579.18 USD
		const priceLine = lineContent.trim();

		// Extract date (YYYY-MM-DD)
		const dateMatch = priceLine.match(/^(\d{4}[-/]\d{2}[-/]\d{2})/);
		if (!dateMatch || dateMatch.length < 2 || !dateMatch[1]) {
			throw new Error(`Failed to parse date from price line: ${priceLine}`);
		}
		// Force the type system to recognize this as a string
		const date = String(dateMatch[1]);

		// Extract commodity name, amount, and currency using regex
		// Improved regex to handle Beancount's commodity format:
		// - Commodity names can include A-Z, 0-9, ., -, and _
		// - Amount can include expressions with arithmetic operations
		const priceRegex = /price\s+([A-Z][A-Z0-9._-]*)\s+([-+0-9.,()*/\s]+)\s+([A-Z][A-Z0-9._-]*)/;
		const priceMatch = priceLine.match(priceRegex);

		if (!priceMatch || priceMatch.length < 4) {
			throw new Error(`Failed to parse price components from line: ${priceLine}`);
		}

		// Extract components and ensure they're strings
		const commodity: string = priceMatch[1] || '';
		const amountExpression: string = priceMatch[2] || '';
		const currency: string = priceMatch[3] || '';

		if (!commodity || !amountExpression || !currency) {
			throw new Error(`Missing required price components in line: ${priceLine}`);
		}

		// Evaluate the amount expression
		const amountValue = parseExpression(amountExpression);
		const amount: string = amountValue.toString();

		// Validate we've extracted the expected commodity
		if (commodity !== node.name) {
			logger.warn(`Extracted commodity ${commodity} doesn't match expected ${node.name}, using node.name`);

			return {
				name: node.name,
				date: date,
				price: {
					amount: amount,
					currency: currency,
				},
			};
		}

		return {
			name: commodity,
			date: date,
			price: {
				amount: amount,
				currency: currency,
			},
		};
	}

	/**
	 * Invalidates all caches
	 */
	invalidateAllCaches(): void {
		this.currencyUsageCache.clear();
		this.lastCurrencyUsageUpdate = 0;
		this.invalidateConversionCaches();
	}
}
