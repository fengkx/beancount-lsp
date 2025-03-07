// Mock the dependencies
vi.mock('@bean-lsp/shared', () => {
	return {
		Logger: class MockLogger {
			constructor() {}
			info() {}
			error() {}
			warn() {}
		},
	};
});

// Import after mocks
// Mock the web-tree-sitter import
vi.mock('web-tree-sitter', () => {
	return {
		default: class MockParser {
			static init() {
				return Promise.resolve();
			}
			static Language = class MockLanguage {};
		},
	};
});

import { describe, expect, it, vi } from 'vitest';
import {
	checkTransactionBalance,
	hasBothCostAndPrice,
	hasOnlyOneIncompleteAmount,
	Posting,
} from '../../common/utils/balance-checker';
import { parseExpression } from '../../common/utils/expression-parser';
import { createPosting, parseTransactionsFromTestFile } from './parser-simulator';

// Helper function for testing expressions
function testParseExpression(expression: string): string {
	try {
		const result = parseExpression(expression);
		return result.toString();
	} catch (e) {
		return `Error: ${e}`;
	}
}

// New test suite for parseExpression functionality
describe('Expression Parser', () => {
	// Basic numbers
	it('should parse basic numeric values', () => {
		expect(testParseExpression('42')).toBe('42');
		expect(testParseExpression('-42')).toBe('-42');
		expect(testParseExpression('3.14')).toBe('3.14');
		expect(testParseExpression('0')).toBe('0');
	});

	// Simple operations
	it('should handle basic arithmetic operations', () => {
		expect(testParseExpression('1+2')).toBe('3');
		expect(testParseExpression('5-3')).toBe('2');
		expect(testParseExpression('4*5')).toBe('20');
		expect(testParseExpression('10/2')).toBe('5');
		expect(testParseExpression('90.00/3')).toBe('30');
	});

	// Operator precedence
	it('should respect standard operator precedence', () => {
		// Multiplication before addition
		expect(testParseExpression('3*2+1')).toBe('7');
		expect(testParseExpression('1+3*2')).toBe('7');

		// Parentheses override precedence
		expect(testParseExpression('3*(2+1)')).toBe('9');
		expect(testParseExpression('(2+1)*3')).toBe('9');
	});

	// Complex expressions
	it('should correctly evaluate complex expressions', () => {
		expect(testParseExpression('100.01+200+300.05')).toBe('600.06');
		expect(testParseExpression('5+4*3/2-1')).toBe('10');
		expect(testParseExpression('(5+4)*(3/2-1)')).toBe('4.5');
		expect(testParseExpression('(2-3)*(10+1)')).toBe('-11');
	});

	// Spaces in expressions
	it('should handle spaces in expressions', () => {
		expect(testParseExpression('1 + 2')).toBe('3');
		expect(testParseExpression('5 - 3')).toBe('2');
		expect(testParseExpression('4 * 5')).toBe('20');
		expect(testParseExpression('10 / 2')).toBe('5');
		expect(testParseExpression('3 * (2 + 1)')).toBe('9');
	});

	// Error cases
	it('should gracefully handle invalid expressions', () => {
		// Should return 0 for invalid expressions
		expect(testParseExpression('invalid')).toBe('0');
		expect(testParseExpression('')).toBe('0');
	});
});

describe('Balance Checker', () => {
	describe('hasOnlyOneIncompleteAmount', () => {
		it('should identify transactions with one incomplete amount', () => {
			const postings: Posting[] = [
				createPosting('Assets:Checking', { number: '-500.00', currency: 'USD' }),
				createPosting('Assets:Savings'),
			];

			expect(hasOnlyOneIncompleteAmount(postings)).toBe(true);
		});

		it('should reject transactions where all postings have amounts', () => {
			const postings: Posting[] = [
				createPosting('Assets:Checking', { number: '-75.50', currency: 'USD' }),
				createPosting('Expenses:Food', { number: '75.50', currency: 'USD' }),
			];

			expect(hasOnlyOneIncompleteAmount(postings)).toBe(false);
		});

		it('should reject transactions with multiple incomplete amounts', () => {
			const postings: Posting[] = [
				createPosting('Assets:Checking'),
				createPosting('Expenses:Food'),
				createPosting('Expenses:Tips', { number: '10.00', currency: 'USD' }),
			];

			expect(hasOnlyOneIncompleteAmount(postings)).toBe(false);
		});
	});

	describe('hasBothCostAndPrice', () => {
		it('should identify postings with both cost and price', () => {
			const postings: Posting[] = [
				createPosting('Assets:Checking', { number: '-100.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments',
					{ number: '10', currency: 'STOCK' },
					{ number: '9.00', currency: 'USD' },
					{ type: '@', number: '9.50', currency: 'USD' },
				),
			];

			expect(hasBothCostAndPrice(postings)).toBe(true);
		});

		it('should return false when no posting has both cost and price', () => {
			const postings: Posting[] = [
				createPosting('Assets:Checking', { number: '-100.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments',
					{ number: '10', currency: 'STOCK' },
					{ number: '10.00', currency: 'USD' },
				),
			];

			expect(hasBothCostAndPrice(postings)).toBe(false);
		});
	});

	describe('checkTransactionBalance', () => {
		const { balancedTransactions, unbalancedTransactions } = parseTransactionsFromTestFile();

		it('should identify all balanced transactions', () => {
			for (const [index, postings] of balancedTransactions.entries()) {
				const result = checkTransactionBalance(postings, 0.005);
				console.log(`Transaction ${index}:`, {
					isBalanced: result.isBalanced,
					currency: result.currency,
					difference: result.difference?.toString(),
					tolerance: result.tolerance?.toString(),
				});
				expect(result.isBalanced, `Transaction ${index} should be balanced`).toBe(true);
			}
		});

		it('should identify all unbalanced transactions', () => {
			for (const [index, postings] of unbalancedTransactions.entries()) {
				const result = checkTransactionBalance(postings, 0.005);
				expect(result.isBalanced, `Transaction ${index} should be unbalanced`).toBe(false);
				expect(result.currency).toBe('USD');
			}
		});

		it('should calculate the correct difference for unbalanced transactions', () => {
			// Test specific examples with known differences

			// Simple unbalanced transaction: -120.00 + 119.95 = -0.05
			const simpleResult = checkTransactionBalance(unbalancedTransactions[0]!, 0.005);
			expect(simpleResult.difference?.toString()).toBe('-0.05');

			// Price annotation transaction: -100.00 + (85.00 * 1.15) = -100.00 + 97.75 = -2.25
			const priceResult = checkTransactionBalance(unbalancedTransactions[1]!, 0.005);
			expect(priceResult.difference?.toString()).toBe('-2.25');

			// Cost transaction: -1000.00 + (9 * 110.00) = -1000.00 + 990.00 = -10.00
			const costResult = checkTransactionBalance(unbalancedTransactions[2]!, 0.005);
			expect(costResult.difference?.toString()).toBe('-10');

			// @@ price transaction: -100.00 + 98.50 = -1.50
			const totalPriceResult = checkTransactionBalance(unbalancedTransactions[3]!, 0.005);
			expect(totalPriceResult.difference?.toString()).toBe('-1.5');
		});

		it('should respect the provided tolerance value', () => {
			// The simple unbalanced transaction is off by 0.05 USD
			const postings = unbalancedTransactions[0]!;

			// With tolerance of 0.06, it should be considered balanced
			expect(checkTransactionBalance(postings, 0.06).isBalanced).toBe(true);

			// With tolerance of 0.04, it should be considered unbalanced
			expect(checkTransactionBalance(postings, 0.04).isBalanced).toBe(false);
		});
	});

	it('should identify balanced simple transactions', () => {
		const postings = [
			{
				account: 'Assets:Checking',
				amount: { number: '-75.50', currency: 'USD' },
			},
			{
				account: 'Expenses:Food',
				amount: { number: '75.50', currency: 'USD' },
			},
		];

		// @ts-expect-error - This is a test
		const result = checkTransactionBalance(postings, 0.005);
		expect(result.isBalanced).toBe(true);
	});
});
