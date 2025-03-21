import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import { compactToRange } from '../common';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import * as positionUtils from './position-utils';
import { PriceMap } from './prices-index/price-map';
import { SymbolInfo } from './symbol-extractors';
import { SymbolIndex } from './symbol-index';
import { Feature } from './types';

// Create a logger for hover functionality
const logger = new Logger('hover');

export class HoverFeature implements Feature {
	connection: lsp.Connection | null = null;
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly priceMap: PriceMap,
		private readonly symbolIndex: SymbolIndex,
	) {}

	register(connection: lsp.Connection): void {
		this.connection = connection;
		connection.onHover(async (params: lsp.HoverParams): Promise<lsp.Hover | null> => {
			try {
				return await this.onHover(params);
			} catch (error) {
				logger.error(`Error handling hover request: ${error}`);
				return null;
			}
		});
	}

	/**
	 * Sets the main currency for PriceMap
	 * @param currency The main currency code
	 */
	setPriceMapMainCurrency(currency: string): void {
		this.priceMap.setMainCurrency(currency);
	}

	/**
	 * Sets the allowed currencies for PriceMap
	 * @param currencies List of allowed currency codes
	 */
	setPriceMapAllowedCurrencies(currencies: string[]): void {
		this.priceMap.setAllowedCurrencies(currencies);
	}

	/**
	 * Handle Beancount option changes
	 * @param event The option change event
	 */
	private handleOptionChange(event: any): void {
		// Example: Handle 'operating_currency' option change
		if (event.name === 'operating_currency') {
			logger.info(`Operating currency changed to: ${event.option.value}`);
			// Update main currency in price map if it was set by a Beancount option
			this.setPriceMapMainCurrency(event.option.value);
		}
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

		// If not an account, try to find a tag at the current position
		const tagAtPosition = await positionUtils.getTagAtPosition(
			this.trees,
			document,
			params.position,
		);

		if (tagAtPosition) {
			logger.debug(`Found tag at position: ${tagAtPosition}`);

			// Get the range of the tag
			const range = await positionUtils.getRangeAtPosition(
				this.trees,
				document,
				params.position,
			);

			// Create hover content for tag
			const contents = await this.createTagHoverContents(tagAtPosition);

			return {
				contents,
				range,
			};
		}

		// If not a tag, try to find a commodity at the current position
		const commodityAtPosition = await positionUtils.getCommodityAtPosition(
			this.trees,
			document,
			params.position,
		);

		if (commodityAtPosition) {
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

		// Check if the hover is on a price directive amount or price keyword
		const priceAtPosition = await this.getPriceAtPosition(document, params.position);
		if (priceAtPosition) {
			logger.debug(`Found price at position: ${JSON.stringify(priceAtPosition)}`);

			// Create hover content for price
			const contents = await this.createPriceHoverContents(priceAtPosition);

			return {
				contents,
				range: priceAtPosition.range,
			};
		}

		return null;
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
				// Use the original currency of the price instead of converting to main currency
				const originalCurrency = latestPrice.price.currency;
				const priceTrend = await this.priceMap.getPriceTrend(commodity, originalCurrency, 30);

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
					if (priceTrend.currency) {
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
			const barChart = sampledPrices.map(() => blockChars[mid]).join('');

			// Get the first and last price from the original array
			const firstPrice = prices[0]?.toFixed(2) || '?';
			const lastPrice = prices[prices.length - 1]?.toFixed(2) || '?';

			// Create price labels at bottom (with spacing to align with chart)
			const priceLabelSpace = barChart.length - firstPrice.length - lastPrice.length;
			const priceLabel = firstPrice + ' '.repeat(Math.max(0, priceLabelSpace)) + lastPrice;

			return barChart + '\n' + priceLabel;
		}

		// Create a horizontal bar chart
		const result: string[] = [];

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

		// Get the first and last price from the original array
		const firstPrice = prices[0]?.toFixed(2) || '?';
		const lastPrice = prices[prices.length - 1]?.toFixed(2) || '?';

		// Create price labels at bottom (with spacing to align with chart)
		const priceLabelSpace = bars.length - firstPrice.length - lastPrice.length;
		const priceLabel = firstPrice + ' '.repeat(Math.max(0, priceLabelSpace)) + lastPrice;

		result.push(bars);
		result.push(priceLabel);

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

	/**
	 * Checks if the cursor is positioned on a price amount within a price directive
	 * @param document The text document
	 * @param position The cursor position
	 * @returns The price information if cursor is on a price amount, null otherwise
	 */
	private async getPriceAtPosition(
		document: TextDocument,
		position: lsp.Position,
	): Promise<{ commodity: string; targetCurrency: string; amount: string; date: string; range: lsp.Range } | null> {
		try {
			// Get the line containing the position
			const line = document.getText({
				start: { line: position.line, character: 0 },
				end: { line: position.line, character: Number.MAX_SAFE_INTEGER },
			});

			// Check if this is a price directive line
			const priceLine = line.trim();
			if (!priceLine.includes('price ')) {
				return null;
			}

			// Parse the price directive using regex
			// YYYY-MM-DD price COMMODITY AMOUNT CURRENCY
			const priceRegex =
				/^(\d{4}[-/]\d{2}[-/]\d{2})\s+price\s+([A-Z][A-Z0-9._-]*)\s+([-+]?[\d,]+\.?\d*)\s+([A-Z][A-Z0-9._-]*)/;
			const priceMatch = priceLine.match(priceRegex);

			if (!priceMatch || priceMatch.length < 5) {
				return null;
			}

			// Safely extract match groups with null checking
			const date = priceMatch[1] || '';
			const commodity = priceMatch[2] || '';
			const amount = priceMatch[3] || '';
			const targetCurrency = priceMatch[4] || '';

			// Skip if any required field is missing
			if (!date || !commodity || !amount || !targetCurrency) {
				return null;
			}

			// Calculate the range of the amount and price keyword
			const priceKeywordIndex = line.indexOf('price');
			const priceKeywordStartCharacter = priceKeywordIndex;
			const priceKeywordEndCharacter = priceKeywordStartCharacter + 'price'.length;

			const amountStartCharacter = line.indexOf(amount);
			const amountEndCharacter = amountStartCharacter + amount.length;

			// Check if cursor position is within the amount range
			if (
				position.character >= amountStartCharacter
				&& position.character <= amountEndCharacter
			) {
				// Return the price information with the range of the amount
				return {
					commodity,
					targetCurrency,
					amount,
					date,
					range: {
						start: { line: position.line, character: amountStartCharacter },
						end: { line: position.line, character: amountEndCharacter },
					},
				};
			}

			// Check if cursor position is within the 'price' keyword range
			if (
				position.character >= priceKeywordStartCharacter
				&& position.character <= priceKeywordEndCharacter
			) {
				// Return information with the range of the 'price' keyword
				return {
					commodity,
					targetCurrency,
					amount,
					date,
					range: {
						start: { line: position.line, character: priceKeywordStartCharacter },
						end: { line: position.line, character: priceKeywordEndCharacter },
					},
				};
			}

			return null;
		} catch (error) {
			logger.error(`Error getting price at position: ${error}`);
			return null;
		}
	}

	/**
	 * Creates price hover content with information including trends, conversions and comparisons
	 *
	 * Note: All comments and hover content have been translated to English as requested.
	 * There may be some TypeScript errors in price-map.ts related to possibly undefined values
	 * that should be addressed in a separate fix.
	 */
	private async createPriceHoverContents(
		priceInfo: { commodity: string; targetCurrency: string; amount: string; date: string; range: lsp.Range },
	): Promise<lsp.MarkupContent> {
		try {
			const { commodity, targetCurrency, amount, date } = priceInfo;
			const numericAmount = parseFloat(amount.replace(/,/g, ''));

			// Unified format, regardless of whether hovering on price keyword or amount
			// Using a format similar to commodity hover
			let result = `\n`;
			result += `**${commodity} to ${targetCurrency}** - ${numericAmount} ${targetCurrency} (${date})\n\n`;

			// Add commodity price history summary
			const priceHistory = await this.priceMap.getPriceHistoryByCommodity(commodity);
			if (priceHistory && priceHistory.length > 0) {
				// Analyze currency usage
				const uniqueCurrencies = new Set(
					priceHistory
						.filter(p => p.price && p.price.currency)
						.map(p => p.price.currency),
				);

				// Add concise price history summary
				result += `Price history: ${priceHistory.length} entries`;
				if (uniqueCurrencies.size > 0) {
					result += ` in ${uniqueCurrencies.size} currencies`;
				}
				result += `\n\n`;
			}

			// Get price trend data and display chart
			try {
				const priceTrend = await this.priceMap.getPriceTrend(commodity, targetCurrency, 30);

				if (priceTrend.dates.length > 0) {
					// Add price trend visualization
					if (priceTrend.dates.length >= 2) {
						// Sort dates chronologically
						const sortedDates = [...priceTrend.dates].filter(d => d !== undefined);
						sortedDates.sort((a, b) => {
							if (!a || !b) return 0;
							return new Date(a).getTime() - new Date(b).getTime();
						});

						// Get date range for display
						if (sortedDates.length >= 2) {
							const earliestDateStr = sortedDates[0];
							const latestDateStr = sortedDates[sortedDates.length - 1];

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

					// Create ASCII chart
					const chart = this.createAsciiChart(priceTrend.prices);
					result += '```\n' + chart + '\n```\n\n';

					// Add price statistics
					const max = Math.max(...priceTrend.prices);
					const min = Math.min(...priceTrend.prices);
					const avg = priceTrend.prices.reduce((sum, price) => sum + price, 0) / priceTrend.prices.length;

					// Calculate price change
					let changeText = '';
					if (priceTrend.prices.length >= 2) {
						const firstPrice = priceTrend.prices[0];
						const lastPrice = priceTrend.prices[priceTrend.prices.length - 1];

						if (firstPrice !== undefined && lastPrice !== undefined && firstPrice !== 0) {
							const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
							const changeSymbol = changePercent >= 0 ? '↑' : '↓';
							changeText = `Change: ${Math.abs(changePercent).toFixed(2)}% ${changeSymbol}`;
						}
					}

					// Display statistics in compact format
					result += `High: ${max.toFixed(2)} | Low: ${min.toFixed(2)} | Avg: ${avg.toFixed(2)}`;
					if (changeText) {
						result += ` | ${changeText}`;
					}
					result += '\n\n';
				}
			} catch (error) {
				logger.error(`Error getting price trend: ${error}`);
			}

			// Show conversions to other currencies
			result += '**Conversions:**\n\n';

			// Get main currency
			const mainCurrency = await this.priceMap.getMainCurrency();

			// Only convert to main currency if different from current currency
			let hasAnyConversion = false;
			if (mainCurrency && mainCurrency !== targetCurrency) {
				// Use getConvertedPrice to get optimal conversion
				const conversion = await this.priceMap.getConvertedPrice(commodity, mainCurrency, date);
				if (conversion) {
					hasAnyConversion = true;
					const convertedAmount = conversion.conversionRate.toFixed(2);

					result += `1 ${commodity} = **${convertedAmount} ${mainCurrency}**\n`;

					// Show conversion path if not direct conversion
					if (conversion.path.length > 1) {
						result += `  Via: ${conversion.path.join(' → ')} (rate: ${
							conversion.conversionRate.toFixed(4)
						})\n`;
					}
				}
			}

			if (!hasAnyConversion) {
				if (mainCurrency) {
					result += `No conversion rates available to ${mainCurrency} (main currency).\n`;
				} else {
					result += 'No main currency defined for conversions.\n';
				}
			}

			// Try to get the latest price for comparison
			try {
				const latestPrice = await this.priceMap.getPriceByCommodity(commodity);

				if (
					latestPrice
					&& latestPrice.price
					&& latestPrice.price.amount
					&& latestPrice.price.currency === targetCurrency
					&& latestPrice.date !== date
				) {
					// Format latest date
					const latestDate = new Date(latestPrice.date);
					const formattedLatestDate = `${latestDate.getFullYear()}-${
						String(latestDate.getMonth() + 1).padStart(2, '0')
					}-${String(latestDate.getDate()).padStart(2, '0')}`;

					// Calculate percentage change
					const latestAmount = parseFloat(latestPrice.price.amount);
					const changePercentage = ((latestAmount - numericAmount) / numericAmount * 100).toFixed(2);
					const changeSymbol = parseFloat(changePercentage) >= 0 ? '↑' : '↓';

					// Add latest price information
					result += `\n**Latest Price (${formattedLatestDate}):** ${latestAmount} ${targetCurrency} `;
					result += `(${Math.abs(parseFloat(changePercentage))}% ${changeSymbol} since ${date})\n`;
				}
			} catch (error) {
				logger.debug(`Error getting latest price: ${error}`);
			}

			return {
				kind: lsp.MarkupKind.Markdown,
				value: result,
			};
		} catch (error) {
			logger.error(`Error creating price hover contents: ${error}`);
			return {
				kind: lsp.MarkupKind.Markdown,
				value: `**Price Information**\n\nUnable to retrieve conversion details.`,
			};
		}
	}

	/**
	 * Create hover contents for a tag, showing usage statistics
	 */
	private async createTagHoverContents(tag: string): Promise<lsp.MarkupContent> {
		// Find all tag usages
		const tagUsages = await this.symbolIndex.findAsync({
			_symType: 'tag',
			name: tag,
		});

		// Find all pushtag usages
		const pushtagUsages = await this.symbolIndex.findAsync({
			_symType: 'pushtag',
			name: tag,
		});

		// Find all poptag usages
		const poptagUsages = await this.symbolIndex.findAsync({
			_symType: 'poptag',
			name: tag,
		});

		// Total usage count
		const totalUsages = tagUsages.length + pushtagUsages.length + poptagUsages.length;

		// Generate a more structured and readable content
		let content = `**Tag: #${tag}**\n\n`;

		// Summary line with counts
		content += `**Total: ${totalUsages}**\n`;
		content += `• Regular: ${tagUsages.length}\n`;
		content += `• Push directives: ${pushtagUsages.length}\n`;
		content += `• Pop directives: ${poptagUsages.length}\n`;

		// Create a file-based usage map to better organize the information
		const fileUsageMap = new Map<string, { regular: number; push: number; pop: number }>();

		// Check if connection is available
		if (!this.connection) {
			return {
				kind: lsp.MarkupKind.Markdown,
				value: content,
			};
		}

		const workspaceFolders = await this.connection.workspace.getWorkspaceFolders();

		// Process all usages and group by filename
		const processUsage = (usage: SymbolInfo, type: 'regular' | 'push' | 'pop') => {
			if (!workspaceFolders) return;

			const workspaceFolder = workspaceFolders.find(folder => usage._uri.startsWith(folder.uri));
			if (!workspaceFolder) return;

			const uri = URI.parse(usage._uri);
			const workspaceFolderFilePath = URI.parse(workspaceFolder.uri).fsPath;
			const filepath = uri.fsPath.replace(workspaceFolderFilePath, '').replace(/^[\\/\\]/, '');
			if (!fileUsageMap.has(filepath)) {
				fileUsageMap.set(filepath, { regular: 0, push: 0, pop: 0 });
			}
			const stats = fileUsageMap.get(filepath)!;
			stats[type]++;
		};

		tagUsages.forEach(usage => processUsage(usage, 'regular'));
		pushtagUsages.forEach(usage => processUsage(usage, 'push'));
		poptagUsages.forEach(usage => processUsage(usage, 'pop'));

		// Only show file details if we have files with pushtag/poptag directives
		if (pushtagUsages.length > 0 || poptagUsages.length > 0) {
			const files = Array.from(fileUsageMap.entries())
				.filter(([_, stats]) => stats.push > 0 || stats.pop > 0)
				.sort((a, b) => a[0].localeCompare(b[0]));

			if (files.length > 0) {
				content += `\n**Files with push/pop directives:**\n`;

				files.forEach(([filename, stats]) => {
					content += `\n**${filename}**\n`;

					if (stats.push > 0) {
						content += `  • Push: ${stats.push}\n`;
					}

					if (stats.pop > 0) {
						content += `  • Pop: ${stats.pop}\n`;
					}

					if (stats.regular > 0) {
						content += `  • Regular uses: ${stats.regular}\n`;
					}
				});
			}
		}

		return {
			kind: lsp.MarkupKind.Markdown,
			value: content,
		};
	}
}
