import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { compactToRange } from '../common';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import * as positionUtils from './position-utils';
import { PriceMap } from './prices-index/price-map';
import { Feature } from './types';

// Create a logger for hover functionality
const logger = new Logger('hover');

export class HoverFeature implements Feature {
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly priceMap: PriceMap,
	) {}

	register(connection: lsp.Connection): void {
		connection.onHover(async (params: lsp.HoverParams): Promise<lsp.Hover | null> => {
			try {
				return await this.onHover(params);
			} catch (error) {
				logger.error(`Error handling hover request: ${error}`);
				return null;
			}
		});
	}

	private async onHover(
		params: lsp.HoverParams,
	): Promise<lsp.Hover | null> {
		logger.debug(`Hover requested at position: ${JSON.stringify(params.position)}`);

		const document = await this.documents.retrieve(params.textDocument.uri);
		if (!document) {
			logger.warn(`Document not found: ${params.textDocument.uri}`);
			return null;
		}

		// First try to find an account at the current position
		const accountAtPosition = await positionUtils.getAccountAtPosition(
			this.trees,
			document,
			params.position,
		);

		if (accountAtPosition) {
			logger.debug(`Found account at position: ${accountAtPosition}`);

			// Get the range of the account
			const range = await positionUtils.getRangeAtPosition(
				this.trees,
				document,
				params.position,
			);

			// Create hover content for account
			const contents = await this.createAccountHoverContents(accountAtPosition);

			return {
				contents,
				range,
			};
		}

		// If not an account, try to find a commodity at the current position
		const commodityAtPosition = await positionUtils.getCommodityAtPosition(
			this.trees,
			document,
			params.position,
		);

		if (!commodityAtPosition) {
			return null;
		}

		logger.debug(`Found commodity at position: ${commodityAtPosition}`);

		// Get the range of the commodity
		const range = await positionUtils.getRangeAtPosition(
			this.trees,
			document,
			params.position,
		);

		// Create hover content for commodity
		const contents = await this.createCommodityHoverContents(commodityAtPosition);

		return {
			contents,
			range,
		};
	}

	private async createCommodityHoverContents(commodity: string): Promise<lsp.MarkupContent> {
		// Get the latest price
		const latestPrice = await this.priceMap.getPriceByCommodity(commodity);

		// Generate price information
		let result = '';

		if (latestPrice) {
			const date = new Date(latestPrice.date);
			const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${
				String(date.getDate()).padStart(2, '0')
			}`;

			// Use smaller heading and more compact layout
			result +=
				`**${commodity}** - ${latestPrice.price.amount} ${latestPrice.price.currency} (${formattedDate})\n\n`;

			// Get price trend data
			try {
				const priceTrend = await this.priceMap.getPriceTrend(commodity, undefined, 30);

				if (priceTrend.dates.length > 0) {
					// Add small label for the chart
					if (priceTrend.dates.length >= 2) {
						// Make a copy of dates array to sort without affecting the original
						const sortedDates = [...priceTrend.dates].filter(d => d !== undefined);

						// Sort dates chronologically (earliest to latest)
						sortedDates.sort((a, b) => {
							if (!a || !b) return 0;
							return new Date(a).getTime() - new Date(b).getTime();
						});

						// Get earliest and latest dates if available
						if (sortedDates.length >= 2) {
							const earliestDateStr = sortedDates[0];
							const latestDateStr = sortedDates[sortedDates.length - 1];

							// Format dates properly
							if (earliestDateStr && latestDateStr) {
								try {
									const earliestDate = new Date(earliestDateStr);
									const latestDate = new Date(latestDateStr);

									if (!isNaN(earliestDate.getTime()) && !isNaN(latestDate.getTime())) {
										const earliestFormatted = `${earliestDate.getFullYear()}-${
											String(earliestDate.getMonth() + 1).padStart(2, '0')
										}-${String(earliestDate.getDate()).padStart(2, '0')}`;
										const latestFormatted = `${latestDate.getFullYear()}-${
											String(latestDate.getMonth() + 1).padStart(2, '0')
										}-${String(latestDate.getDate()).padStart(2, '0')}`;

										// Only show date range if they're different
										if (earliestFormatted !== latestFormatted) {
											result += `Price trend (${earliestFormatted} to ${latestFormatted}):\n\n`;
										} else {
											result += `Price trend (${earliestFormatted}):\n\n`;
										}
									} else {
										result += `Price trend (last 30 days):\n\n`;
									}
								} catch (e) {
									result += `Price trend (last 30 days):\n\n`;
								}
							} else {
								result += `Price trend (last 30 days):\n\n`;
							}
						} else {
							result += `Price trend (last 30 days):\n\n`;
						}
					} else {
						result += `Price trend (last 30 days):\n\n`;
					}

					// Create a more compact chart and wrap in code block to preserve formatting
					const chart = this.createAsciiChart(priceTrend.prices);
					result += '```\n' + chart + '\n```\n\n';

					// Compact price statistics on a single line
					const max = Math.max(...priceTrend.prices);
					const min = Math.min(...priceTrend.prices);
					const avg = priceTrend.prices.reduce((sum, price) => sum + price, 0) / priceTrend.prices.length;

					// Calculate price change
					let changeText = '';
					if (priceTrend.prices.length >= 2) {
						const firstPrice = priceTrend.prices[0];
						const lastPrice = priceTrend.prices[priceTrend.prices.length - 1];

						// Ensure firstPrice and lastPrice are not undefined
						if (firstPrice !== undefined && lastPrice !== undefined && firstPrice !== 0) {
							const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
							const changeSymbol = changePercent >= 0 ? '↑' : '↓';
							changeText = `Change: ${Math.abs(changePercent).toFixed(2)}% ${changeSymbol}`;
						}
					}

					// Display stats in a more compact format
					result += `High: ${max.toFixed(2)} | Low: ${min.toFixed(2)} | Avg: ${avg.toFixed(2)}`;
					if (changeText) {
						result += ` | ${changeText}`;
					}

					// Add currency info if available
					if (priceTrend.currency && priceTrend.currency !== latestPrice.price.currency) {
						result += `\nCurrency: ${priceTrend.currency}`;
					}
				}
			} catch (error) {
				logger.error(`Error getting price trend for ${commodity}: ${error}`);
			}
		} else {
			result = `No price information found for **${commodity}**`;
		}

		return {
			kind: lsp.MarkupKind.Markdown,
			value: result,
		};
	}

	/**
	 * Create a chart using Unicode block characters with enhanced visual scaling
	 *
	 * Mathematical principles:
	 * 1. Data sampling: For N data points and display width W, sample points at intervals of N/W
	 *    to maintain visual proportions while respecting display constraints.
	 *
	 * 2. Linear vs Non-linear scaling:
	 *    - Linear scaling: normalized = (price - min) / (max - min)
	 *      Maps values between 0 and 1 linearly, but small differences may not be visible
	 *    - Non-linear scaling: normalized = ((price - min) / (max - min))^p where p is a power value
	 *      When p < 1 (e.g., 0.7): Enhances visibility of small differences
	 *      When p > 1 (e.g., 1.5): Emphasizes large differences
	 *
	 * 3. Percentile mapping:
	 *    - Instead of direct mapping, sort values and map based on their rank
	 *    - This ensures even distribution across all available height levels
	 *    - Prevents clustering at certain heights and maximizes visual distinction
	 *
	 * 4. Block character mapping:
	 *    - 8 unique block characters: ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
	 *    - Each normalized value maps to index = floor(normalized * 8)
	 *    - Ensures min/max values always map to lowest/highest blocks for maximum contrast
	 */
	private createAsciiChart(prices: number[]): string {
		if (prices.length === 0) {
			return 'No price data available';
		}

		// Use a smaller chart with fewer columns
		const numCols = Math.min(prices.length, 15); // Maintain compact width

		// If there are more than numCols data points, sample the data
		// This performs data reduction while preserving the overall shape of the trend
		// Example: For 30 prices displayed in 15 columns, sample every other price
		const sampledPrices: number[] = [];
		if (prices.length > numCols) {
			const step = prices.length / numCols;
			for (let i = 0; i < numCols; i++) {
				const idx = Math.min(Math.floor(i * step), prices.length - 1);
				const price = prices[idx];
				if (typeof price === 'number') {
					sampledPrices.push(price);
				}
			}
		} else {
			// Filter out undefined values
			sampledPrices.push(...prices.filter((p): p is number => typeof p === 'number'));
		}

		// If there's no valid data after filtering, return a message
		if (sampledPrices.length === 0) {
			return 'Invalid price data';
		}

		const min = Math.min(...sampledPrices);
		const max = Math.max(...sampledPrices);
		const range = max - min;

		// Use higher resolution Unicode block characters for better contrast
		// ▁ ▂ ▃ ▄ ▅ ▆ ▇ █ - These represent increasing heights from 1/8 to 8/8
		const blockChars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
		const numLevels = blockChars.length;

		// For a horizontal bar chart approach with Unicode blocks
		// Handle the special case where all prices are identical or nearly identical
		if (range === 0 || range < 0.0001) {
			// If all prices are the same, use a mid-level block
			const mid = Math.floor(blockChars.length / 2);
			return sampledPrices.map(() => blockChars[mid]).join('');
		}

		// Create a horizontal bar chart
		const result: string[] = [];

		// Add top and bottom values with more precise formatting
		const topValue = max.toFixed(1);
		const bottomValue = min.toFixed(1);

		// APPROACH 1: PERCENTILE-BASED MAPPING FOR BETTER DISTRIBUTION
		// First, prepare a data structure for percentile calculation
		interface PricePoint {
			index: number; // Original position in the sampledPrices array
			price: number; // The price value
			rank: number; // Assigned after sorting (0 to length-1)
			level: number; // Final block level (0 to numLevels-1)
		}

		// Create price points with their original indices
		const pricePoints: PricePoint[] = sampledPrices.map((price, index) => ({
			index,
			price,
			rank: 0,
			level: 0,
		}));

		// Sort by price to prepare for percentile ranking
		pricePoints.sort((a, b) => a.price - b.price);

		// Step 1: Assign ranks and ensure even distribution
		const numPoints = pricePoints.length;

		// Handle special case for few points to enforce max contrast
		if (numPoints <= numLevels) {
			// If we have fewer points than levels, space them out evenly
			pricePoints.forEach((point, i) => {
				// Ensure min maps to 0 and max maps to numLevels-1
				point.level = Math.round((i / (numPoints - 1)) * (numLevels - 1));
				if (point.price === min) point.level = 0;
				if (point.price === max) point.level = numLevels - 1;
			});
		} else {
			// Calculate the ideal number of points per level for even distribution
			// We want approximately the same number of points in each level
			const pointsPerLevel = numPoints / numLevels;

			// Assign ranks based on sorted position
			pricePoints.forEach((point, i) => {
				point.rank = i;
				// Calculate level based on rank's percentile
				// Formula: level = floor(rank / (n-1) * (numLevels))
				// This ensures values are distributed across all levels
				point.level = Math.floor((i / (numPoints - 1)) * numLevels);

				// Ensure we don't exceed the maximum level
				if (point.level >= numLevels) {
					point.level = numLevels - 1;
				}

				// Always ensure min is lowest and max is highest
				if (point.price === min) point.level = 0;
				if (point.price === max) point.level = numLevels - 1;
			});
		}

		// Resort by original index to maintain chronological order
		pricePoints.sort((a, b) => a.index - b.index);

		// Create the bar string from the calculated levels
		const bars = pricePoints.map(point => blockChars[point.level]).join('');

		result.push(topValue);
		result.push(bars);
		result.push(bottomValue);

		return result.join('\n');
	}

	/**
	 * Creates hover content for an account, showing relevant financial information
	 *
	 * @param account The account name to generate hover content for
	 * @returns Markdown-formatted hover content
	 */
	private async createAccountHoverContents(account: string): Promise<lsp.MarkupContent> {
		try {
			// Access symbolIndex to get detailed information
			const symbolIndex = this.priceMap['symbolIndex'];

			// Add top padding for better vertical spacing
			let result = '\n';

			// Generate basic information with moderate spacer to make hover wider
			const spacer = '                        ';
			result += `**${account}**${spacer}\n\n`;

			// Get account usage count and file appearance information
			const usageCountsMap = await symbolIndex.getAccountUsageCounts();
			const usageCount = usageCountsMap.get(account) || 0;

			// Create a horizontal stats display
			const stats: string[] = [];

			stats.push(`Usage: ${usageCount} times`);

			// Find account definition to get opening date
			let openingDate = '';
			const accountDefinitions = await symbolIndex.getAccountDefinitions();
			const accountDef = accountDefinitions.find(def => def.name === account);

			// Extract opening date from account definition
			if (accountDef) {
				try {
					const document = await this.documents.retrieve(accountDef._uri);
					if (document) {
						const range = compactToRange(accountDef.range);
						const openingLine = document.getText({
							start: { line: range.start.line, character: 0 },
							end: { line: range.start.line, character: 100 },
						});

						const dateMatch = openingLine.match(/^(\d{4}-\d{2}-\d{2})\s+open\s+/i);
						if (dateMatch && dateMatch[1]) {
							openingDate = dateMatch[1];
							stats.push(`Opened: ${openingDate}`);
						}
					}
				} catch (error) {
					logger.debug(`Error extracting opening date: ${error}`);
				}
			}

			// Retrieve all account-related symbols
			const allAccountSymbols = await symbolIndex.findAsync({
				name: account,
				$or: [
					{ _symType: 'account_usage' },
					{ _symType: 'account_definition' },
				],
			});

			// Display file usage information
			const uniqueFiles = new Set(allAccountSymbols.map(s => s._uri));
			if (uniqueFiles.size > 0) {
				stats.push(`Files: ${uniqueFiles.size}`);
			}

			// Add the horizontal stats line with adequate spacing
			result += `${stats.join('  ·  ')}\n\n\n`;

			// Account hierarchy visualization with tree-like structure
			const accountParts = account.split(':');
			if (accountParts.length > 1) {
				result += `**Account Hierarchy**\n\n`;

				// Add code block with tree structure
				result += '```\n';

				// Generate tree-like structure
				for (let i = 0; i < accountParts.length; i++) {
					const part = accountParts[i];

					// Tree-like indentation
					if (i === 0) {
						result += `${part}${spacer}\n`;
					} else {
						// Create proper tree structure with vertical lines
						let indent = '';
						for (let j = 0; j < i - 1; j++) {
							// For each level, add either a vertical line or space
							if (j < i - 1) {
								indent += '│  ';
							} else {
								indent += '   ';
							}
						}

						// Last element gets └─, others get ├─
						const connector = i === accountParts.length - 1 ? '└─ ' : '├─ ';
						result += `${indent}${connector}${part}\n`;
					}
				}

				// Add bottom padding within the code block
				result += '\n```\n\n';
			}

			return {
				kind: lsp.MarkupKind.Markdown,
				value: result,
			};
		} catch (error) {
			logger.error(`Error creating account hover contents: ${error}`);
			return {
				kind: lsp.MarkupKind.Markdown,
				value: `**${account}**\n\nUnable to retrieve information.`,
			};
		}
	}
}
