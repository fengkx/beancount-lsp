import { Logger } from '@bean-lsp/shared';
import Big from 'big.js';
import type Parser from 'web-tree-sitter';
import { parseExpression } from './expression-parser';

// Logger for balance checker
const logger = new Logger('BalanceChecker');

/**
 * Represents a posting in a transaction with optional amount, cost, and price
 */
// Interface to represent a posting in a transaction
export interface Posting {
	node: Parser.SyntaxNode;
	account: string;
	amount?: {
		number: string; // Changed to string to work with Big.js
		currency: string;
	} | undefined;
	cost?: {
		number: string; // Changed to string to work with Big.js
		currency: string;
	} | undefined;
	price?: {
		type: '@' | '@@';
		number: string; // Changed to string to work with Big.js
		currency: string;
	} | undefined;
}

/**
 * Result of balance checking
 */
export interface BalanceResult {
	// Whether the transaction is balanced
	isBalanced: boolean;
	// The currency with the imbalance (if any)
	currency?: string;
	// The difference amount (positive means missing, negative means extra)
	difference?: Big;
	// The tolerance used for this check
	tolerance?: Big;
}

/**
 * Checks if any posting has both cost and price annotations
 * Beancount doesn't support this combination, and we should skip balance validation
 * for these transactions
 *
 * @param postings List of postings to check
 * @returns True if any posting has both cost and price
 */
export function hasBothCostAndPrice(postings: Posting[]): boolean {
	return postings.some(posting => posting.cost && posting.price);
}

export function hasEmptyCost(postings: Posting[]): boolean {
	return postings.some(posting => posting.cost && posting.cost.number === '' && posting.cost.currency === '');
}

/**
 * Checks if a transaction has only one posting with incomplete amount
 * Beancount auto-balances these transactions, so no validation is needed
 *
 * @param postings List of postings to check
 * @returns True if exactly one posting has no explicit amount
 */
export function hasOnlyOneIncompleteAmount(postings: Posting[]): boolean {
	// Count postings with missing amounts
	const incompleteAmounts = postings.filter(posting => !posting.amount).length;

	// If exactly one posting has no amount, Beancount will auto-balance it
	return incompleteAmounts === 1;
}

/**
 * Checks if a transaction is balanced
 * A transaction is balanced when the sum of all postings in each currency is zero
 * (within the specified tolerance)
 *
 * @param postings List of postings in the transaction
 * @param tolerance Tolerance value to use for balance checking
 * @returns Result of the balance check
 */
export function checkTransactionBalance(postings: Posting[], tolerance: number): BalanceResult {
	// Group postings by currency
	const postingsByCurrency = groupByCurrency(postings);

	// For each currency group, check if they balance to zero (within tolerance)
	for (const [currency, currencyPostings] of Object.entries(postingsByCurrency)) {
		// Use the configured tolerance value
		const toleranceBig = new Big(tolerance);

		// Sum all postings for this currency
		const sum = sumPostings(currencyPostings, currency);

		// Check if sum is within tolerance
		if (sum.abs().gt(toleranceBig)) {
			return {
				isBalanced: false,
				currency,
				difference: sum,
				tolerance: toleranceBig,
			};
		}
	}

	return { isBalanced: true };
}

/**
 * Groups postings by currency correctly handling cost and price annotations
 *
 * A critical part of balance checking is to group postings by the right currency:
 * - For commodities with cost (like shares), only the cost currency matters for balance
 * - For postings with price annotations, we consider both currencies
 * - For normal postings, we use the posting's currency
 *
 * @param postings List of postings to group
 * @returns Map of currency to list of postings
 */
function groupByCurrency(postings: Posting[]): Record<string, Posting[]> {
	const result: Record<string, Posting[]> = {};

	for (const posting of postings) {
		// Handle different cases based on whether the posting has cost/price

		if (posting.amount) {
			if (posting.cost) {
				// Case 1: Posting with cost - only add to cost currency group
				const costCurrency = posting.cost.currency;
				if (!result[costCurrency]) {
					result[costCurrency] = [];
				}
				result[costCurrency].push(posting);
			} else if (posting.price) {
				// Case 2: Posting with price - add to price currency group
				const priceCurrency = posting.price.currency;
				if (!result[priceCurrency]) {
					result[priceCurrency] = [];
				}
				result[priceCurrency].push(posting);
			} else {
				// Case 3: Simple posting without cost/price - add to its currency group
				const currency = posting.amount.currency;
				if (!result[currency]) {
					result[currency] = [];
				}
				result[currency].push(posting);
			}
		}
	}

	return result;
}

/**
 * Calculates the total cost for a posting with a cost specification
 *
 * @param posting The posting with cost
 * @returns The total cost as a Big number
 */
function calculateTotalCost(posting: Posting): Big {
	if (!posting.amount || !posting.cost) return new Big(0);

	try {
		// Use updated parseExpression that handles undefined
		const units = parseExpression(posting.amount.number);
		const perUnitCost = parseExpression(posting.cost.number);

		// Calculate the total cost (units * cost per unit)
		return units.times(perUnitCost);
	} catch (e) {
		logger.error(`Error calculating total cost: ${e}`);
		return new Big(0);
	}
}

/**
 * Calculates the converted amount for a posting with a price annotation
 *
 * Handles both per-unit (@) and total (@@) price annotations:
 * - @ 1.25 USD means each unit is worth 1.25 USD
 * - @@ 100 USD means the total amount is worth 100 USD regardless of units
 *
 * @param posting The posting with price annotation
 * @returns The converted amount as a Big number
 */
function calculateWithPrice(posting: Posting): Big {
	if (!posting.amount || !posting.price) return new Big(0);

	try {
		// Use updated parseExpression that handles undefined
		const units = parseExpression(posting.amount.number);

		// For @ (per-unit price)
		if (posting.price.type === '@') {
			const perUnitPrice = parseExpression(posting.price.number);
			return units.times(perUnitPrice);
		} // For @@ (total price)
		else {
			return parseExpression(posting.price.number);
		}
	} catch (e) {
		logger.error(`Error calculating with price: ${e}`);
		return new Big(0);
	}
}

/**
 * Calculates the sum of all postings for a specific currency
 *
 * This function handles the complex logic of how different posting types
 * contribute to the balance:
 * - Simple amounts in the target currency are added directly
 * - Amounts in other currencies with price annotations to target currency are converted
 * - Amounts in other currencies with cost in target currency use the total cost
 *
 * @param postings List of postings to sum
 * @param currency The currency to calculate the sum for
 * @returns The sum as a Big number
 */
function sumPostings(postings: Posting[], currency: string): Big {
	let sum = new Big(0);

	for (const posting of postings) {
		try {
			// We need to handle each posting exactly once based on its relationship to the target currency

			if (posting.amount && typeof posting.amount.number === 'string') {
				if (posting.amount.currency === currency) {
					// Case 1: Direct amount in the target currency
					sum = sum.plus(parseExpression(posting.amount.number));
				} else {
					// Case 2: Amount in another currency with price annotation to target currency
					if (posting.price && posting.price.currency === currency) {
						const convertedAmount = calculateWithPrice(posting);
						sum = sum.plus(convertedAmount);
					} // Case 3: Amount in another currency with cost in target currency
					else if (posting.cost && posting.cost.currency === currency) {
						const totalCost = calculateTotalCost(posting);
						sum = sum.plus(totalCost);
					}
				}
			}
		} catch (e) {
			logger.error(`Error in sumPostings: ${e}`);
		}
	}

	return sum;
}
