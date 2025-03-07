import { compactToRange, nodeAtPosition } from 'src/common/common';
import { DocumentStore } from '../../document-store';
import { Trees } from '../../trees';
import { SymbolInfo } from '../symbol-extractors';
import { SymbolIndex } from '../symbol-index';

interface PriceDeclaration {
	name: string;
	date: string;
	price: { amount: string; currency: string };
}

interface PriceConversionPath {
	path: string[];
	rate: number;
}

export class PriceMap {
	private priceCache: Map<string, Map<string, PriceDeclaration[]>> = new Map();

	constructor(
		private readonly symbolIndex: SymbolIndex,
		private readonly trees: Trees,
		private readonly documents: DocumentStore,
	) {
	}

	/**
	 * 获取指定商品在指定日期的价格信息
	 * @param commodity 商品代码
	 * @param date 日期，如果未指定则返回最新价格
	 * @returns 价格声明对象
	 */
	async getPriceByCommodity(commodity: string, date?: string): Promise<PriceDeclaration | undefined> {
		const pricesDeclarations = await this.symbolIndex.getPricesDeclarations({ name: commodity });
		const prices = await Promise.all(pricesDeclarations.map(async (declaration) => {
			const priceDeclaration = await this._parsePriceDeclaration(declaration);
			return priceDeclaration;
		}));
		if (date) {
			const price = prices.find((p) => p.date === date);
			if (price) {
				return price;
			}
		}
		return prices.sort((a: PriceDeclaration, b: PriceDeclaration) =>
			new Date(b.date).getTime() - new Date(a.date).getTime()
		)[0];
	}

	/**
	 * 获取指定商品的所有历史价格
	 * @param commodity 商品代码
	 * @returns 按日期排序的价格列表（从最新到最旧）
	 */
	async getPriceHistoryByCommodity(commodity: string): Promise<PriceDeclaration[]> {
		const pricesDeclarations = await this.symbolIndex.getPricesDeclarations({ name: commodity });
		const prices = await Promise.all(pricesDeclarations.map(async (declaration) => {
			return await this._parsePriceDeclaration(declaration);
		}));

		// 按日期排序（从最新到最旧）
		return prices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	/**
	 * 计算指定商品在指定日期的目标货币价格
	 * @param commodity 源商品代码
	 * @param targetCurrency 目标货币代码
	 * @param date 日期，如果未指定则使用最新价格
	 * @returns 价格转换结果，包含转换路径和汇率
	 */
	async getConvertedPrice(commodity: string, targetCurrency: string, date?: string): Promise<
		{
			amount: string;
			path: string[];
			conversionRate: number;
		} | undefined
	> {
		// 如果商品本身就是目标货币，直接返回1:1比率
		if (commodity === targetCurrency) {
			return {
				amount: '1.0',
				path: [commodity],
				conversionRate: 1.0,
			};
		}

		// 尝试直接转换
		const directPrice = await this.getPriceByCommodity(commodity, date);
		if (directPrice && directPrice.price.currency === targetCurrency) {
			return {
				amount: directPrice.price.amount,
				path: [commodity, targetCurrency],
				conversionRate: parseFloat(directPrice.price.amount),
			};
		}

		// 需要多层转换，使用BFS寻找转换路径
		const conversionPath = await this._findConversionPath(commodity, targetCurrency, date);
		if (!conversionPath) {
			return undefined;
		}

		// 计算最终金额
		return {
			amount: conversionPath.rate.toString(),
			path: conversionPath.path,
			conversionRate: conversionPath.rate,
		};
	}

	/**
	 * 使用BFS查找从源货币到目标货币的转换路径
	 * @param fromCommodity 源商品代码
	 * @param toCurrency 目标货币代码
	 * @param date 日期
	 * @returns 转换路径和汇率
	 */
	private async _findConversionPath(
		fromCommodity: string,
		toCurrency: string,
		date?: string,
	): Promise<PriceConversionPath | undefined> {
		// 初始化访问集合和队列
		const visited = new Set<string>();
		const queue: Array<{
			commodity: string;
			path: string[];
			rate: number;
		}> = [];

		// 将起始商品加入队列
		queue.push({
			commodity: fromCommodity,
			path: [fromCommodity],
			rate: 1.0,
		});

		visited.add(fromCommodity);

		// BFS搜索
		while (queue.length > 0) {
			const { commodity, path, rate } = queue.shift()!;

			// 获取当前商品的最新价格信息
			const priceInfo = await this.getPriceByCommodity(commodity, date);
			if (!priceInfo) continue;

			const nextCurrency = priceInfo.price.currency;
			const nextRate = parseFloat(priceInfo.price.amount);

			// 如果下一个货币是目标货币，找到路径
			if (nextCurrency === toCurrency) {
				return {
					path: [...path, toCurrency],
					rate: rate * nextRate,
				};
			}

			// 如果下一个货币未访问过，加入队列
			if (!visited.has(nextCurrency)) {
				visited.add(nextCurrency);
				queue.push({
					commodity: nextCurrency,
					path: [...path, nextCurrency],
					rate: rate * nextRate,
				});
			}
		}

		// 未找到转换路径
		return undefined;
	}

	/**
	 * 获取价格走势数据，用于图表显示
	 * @param commodity 商品代码
	 * @param targetCurrency 目标货币（可选）
	 * @param days 天数，默认30天
	 * @returns 价格走势数据
	 */
	async getPriceTrend(commodity: string, targetCurrency?: string, days: number = 30): Promise<{
		dates: string[];
		prices: number[];
		currency: string;
	}> {
		// 获取商品价格历史
		const priceHistory = await this.getPriceHistoryByCommodity(commodity);

		// 如果没有价格历史记录，返回空数据
		if (priceHistory.length === 0) {
			return { dates: [], prices: [], currency: targetCurrency || '' };
		}

		// 获取当前日期和起始日期
		const today = new Date();
		const startDate = new Date();
		startDate.setDate(today.getDate() - days);

		// 如果不需要货币转换或者没有提供目标货币
		if (!targetCurrency || priceHistory[0].price.currency === targetCurrency) {
			// 过滤并处理时间范围内的价格数据
			const filteredPrices = priceHistory
				.filter(p => new Date(p.date) >= startDate)
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

			return {
				dates: filteredPrices.map(p => p.date),
				prices: filteredPrices.map(p => parseFloat(p.price.amount)),
				currency: priceHistory[0].price.currency,
			};
		}

		// 到这里我们确定targetCurrency是存在的，使用非空断言
		const nonNullTargetCurrency = targetCurrency as string;

		// 需要货币转换
		const result: { dates: string[]; prices: number[]; currency: string } = {
			dates: [],
			prices: [],
			currency: nonNullTargetCurrency,
		};

		// 对每个日期进行转换
		for (const priceData of priceHistory) {
			const priceDate = new Date(priceData.date);
			if (priceDate < startDate) continue;

			// 使用非空断言确保targetCurrency存在
			const convertedPrice = await this.getConvertedPrice(
				commodity,
				nonNullTargetCurrency,
				priceData.date,
			);

			if (convertedPrice) {
				result.dates.push(priceData.date);
				result.prices.push(parseFloat(convertedPrice.amount));
			}
		}

		// 按日期排序
		const sortedIndices = result.dates
			.map((_, i) => i)
			.sort((a, b) => new Date(result.dates[a]).getTime() - new Date(result.dates[b]).getTime());

		result.dates = sortedIndices.map(i => result.dates[i]);
		result.prices = sortedIndices.map(i => result.prices[i]);

		return result;
	}

	private async _parsePriceDeclaration(node: SymbolInfo): Promise<PriceDeclaration> {
		try {
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
			if (!dateMatch || dateMatch.length < 2) {
				throw new Error(`Failed to parse date from price line: ${priceLine}`);
			}
			const date = dateMatch[1];

			// Extract commodity name, amount, and currency using regex
			// Improved regex to handle Beancount's commodity format:
			// - Commodity names can include A-Z, 0-9, ., -, and _
			// - Amount can include digits, decimal points, and possibly commas
			const priceRegex = /price\s+([A-Z][A-Z0-9._-]*)\s+([-+]?[\d,]+\.?\d*)\s+([A-Z][A-Z0-9._-]*)/;
			const priceMatch = priceLine.match(priceRegex);

			if (!priceMatch || priceMatch.length < 4) {
				throw new Error(`Failed to parse price components from line: ${priceLine}`);
			}

			// Safe extraction with null checks
			const commodity = priceMatch[1] || '';
			const amount = priceMatch[2] || '';
			const currency = priceMatch[3] || '';

			// Validate we've extracted the expected commodity
			if (commodity !== node.name) {
				console.log(
					`Warning: Extracted commodity ${commodity} doesn't match expected ${node.name}, using node.name`,
				);
				// Fall back to node.name rather than throwing an error
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
		} catch (error) {
			console.error(`Error parsing price declaration for ${node.name}: ${error}`);
			// Fallback to minimal valid data from the node itself
			return {
				name: node.name,
				date: new Date().toISOString().split('T')[0], // Today's date as fallback
				price: {
					amount: '0',
					currency: 'USD', // Default currency as fallback
				},
			};
		}
	}
}
