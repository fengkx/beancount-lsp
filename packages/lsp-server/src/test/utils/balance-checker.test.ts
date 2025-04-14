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
		expect(testParseExpression('3*-1.99')).toBe('-5.97');
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

	it('should handle expressions with commas', () => {
		expect(testParseExpression('1,000.00')).toBe('1000');
		expect(testParseExpression('1,000.00 / 2')).toBe('500');
		expect(testParseExpression('1,000.00 / 2,000')).toBe('0.5');
		expect(testParseExpression('1,000.00 / 2,000.00')).toBe('0.5');
		expect(testParseExpression('(10,0.5 + 32.5) / 4')).toBe('33.25');
	});

	// Additional fuzzy tests
	it('should handle nested parentheses', () => {
		expect(testParseExpression('(1 + (2 * 3))')).toBe('7');
		expect(testParseExpression('((2 + 3) * (4 - 1))')).toBe('15');
		expect(testParseExpression('(1 + (2 + (3 + (4 + 5))))')).toBe('15');
		expect(testParseExpression('(((((1) + 2) + 3) + 4) + 5)')).toBe('15');
	});

	it('should handle negative numbers in complex expressions', () => {
		expect(testParseExpression('-5 + 10')).toBe('5');
		expect(testParseExpression('10 + -5')).toBe('5');
		expect(testParseExpression('-5 * -2')).toBe('10');
		expect(testParseExpression('(-5) * (-2)')).toBe('10');
		expect(testParseExpression('5 * (-2 + 3)')).toBe('5');
		expect(testParseExpression('(-3) * (-2) * (-1)')).toBe('-6');
	});

	it('should handle edge cases with zero', () => {
		expect(testParseExpression('0 + 0')).toBe('0');
		expect(testParseExpression('5 - 5')).toBe('0');
		expect(testParseExpression('0 * 100')).toBe('0');
		expect(testParseExpression('0 / 5')).toBe('0');
		expect(testParseExpression('(0) * (0 + 1)')).toBe('0');
	});

	it('should handle division by zero gracefully', () => {
		expect(testParseExpression('5 / 0')).toBe('0'); // Should return 0 as fallback for errors
	});

	it('should handle expressions with large numbers', () => {
		expect(testParseExpression('1000000 + 2000000')).toBe('3000000');
		expect(testParseExpression('9999999 * 0.0001')).toBe('999.9999');
		expect(testParseExpression('1000000 / 1000')).toBe('1000');
		expect(testParseExpression('9876543.21 - 1234567.89')).toBe('8641975.32');
	});

	it('should handle expressions with very small numbers', () => {
		expect(testParseExpression('0.0001 + 0.0002')).toBe('0.0003');
		expect(testParseExpression('0.1 * 0.1')).toBe('0.01');
		expect(testParseExpression('1 / 1000')).toBe('0.001');
		expect(testParseExpression('0.000005 + 0.000007')).toBe('0.000012');
	});

	it('should handle unusual but valid expressions', () => {
		expect(testParseExpression('(((1)))')).toBe('1');
		expect(testParseExpression('(0) + (0)')).toBe('0');
		expect(testParseExpression('-(-(-5))')).toBe('-5');
		expect(testParseExpression('1 - - 1')).toBe('2');
		expect(testParseExpression('1 + 1')).toBe('2');
	});

	it('should handle unbalanced parentheses gracefully', () => {
		expect(testParseExpression('(1 + 2')).toBe('0');
		expect(testParseExpression('1 + 2)')).toBe('0');
		expect(testParseExpression('(1 + (2 * 3)')).toBe('0');
		expect(testParseExpression('(1 + 2)) * 3')).toBe('0');
	});

	it('should handle malformed expressions gracefully', () => {
		expect(testParseExpression('1 ++ 2')).toBe('3');
		expect(testParseExpression('1 + * 2')).toBe('0');
		expect(testParseExpression('1 +.+ 2')).toBe('0');
		expect(testParseExpression('1 + 2 +')).toBe('0');
		expect(testParseExpression('* 1 + 2')).toBe('0');
	});

	it('should handle expressions with mixed financial formats', () => {
		expect(testParseExpression('1,234.56 + 9,876.54')).toBe('11111.1');
		expect(testParseExpression('(1,000.00 - 500) * 2')).toBe('1000');
		expect(testParseExpression('1,000 * 1.05 + 2,000 * 1.03')).toBe('3110');
		expect(testParseExpression('(1,234.56 + 5,432.10) / 3')).toBe('2222.22');
	});

	it('should handle expressions with excessive whitespace', () => {
		expect(testParseExpression('   1   +   2   ')).toBe('3');
		expect(testParseExpression('\t5\t*\t3\t')).toBe('15');
		expect(testParseExpression(' ( 10  /  2 ) ')).toBe('5');
		expect(testParseExpression('  3  *  (  4  +  5  )  ')).toBe('27');
	});

	it('should handle more complex financial expressions', () => {
		expect(testParseExpression('1234.56 / 3 + 500')).toBe('911.52');
		expect(testParseExpression('(10000 * 0.05) / 12')).toBe('41.66666666666666666667');
		expect(testParseExpression('100 * 1.05 - 100')).toBe('5');
	});

	// Additional fuzzy tests for edge cases
	describe('Expression Parser - Advanced Fuzzy Tests', () => {
		// Very long decimals and precision tests
		it('should handle very long decimals with appropriate precision', () => {
			expect(testParseExpression('1.23456789 + 2.34567891')).toBe('3.5802468');
			expect(testParseExpression('0.1 + 0.2')).toBe('0.3'); // Classic floating point issue
			expect(testParseExpression('0.3333333333 * 3')).toBe('0.9999999999');
			expect(testParseExpression('1 / 3')).toBe('0.33333333333333333333');
			expect(testParseExpression('1 / 6 + 1 / 3')).toBe('0.5');
		});

		// Consecutive operations
		it('should handle expressions with many consecutive operations', () => {
			expect(testParseExpression('1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10')).toBe('55');
			expect(testParseExpression('10 - 9 - 8 - 7 - 6 - 5 - 4 - 3 - 2 - 1')).toBe('-35');
			expect(testParseExpression('1 * 2 * 3 * 4 * 5')).toBe('120');
			expect(testParseExpression('100 / 2 / 2 / 5 / 5')).toBe('1');
			expect(testParseExpression('1 + 2 - 3 * 4 / 5 + 6 - 7 * 8')).toBe('-49.4');
		});

		// Mixed decimal precision
		it('should handle mixed decimal precision correctly', () => {
			expect(testParseExpression('100.00 + 200.5 + 300.25 + 400.125')).toBe('1000.875');
			expect(testParseExpression('1.1 * 10 + 2.22 * 100 + 3.333 * 1000')).toBe('3566');
			expect(testParseExpression('10000.00 / 3')).toBe('3333.33333333333333333333');
			expect(testParseExpression('(100.5 + 99.5) / 100')).toBe('2');
		});

		// Boundary cases and extreme values
		it('should handle boundary cases and extreme values', () => {
			expect(testParseExpression('9999999999 + 1')).toBe('10000000000');
			expect(testParseExpression('0.0000000001 * 10000000000')).toBe('1');
			expect(testParseExpression('9999999.99 * 0.01')).toBe('99999.9999');
		});

		// Complex chained operations
		it('should handle complex chained operations', () => {
			expect(testParseExpression('(1 + 2) * 3 - 4 / 2 + 5')).toBe('12');
			expect(testParseExpression('10 * (5 + ((3 - 1) * 2)) / 2')).toBe('45');
			expect(testParseExpression('(((10 + 20) * 2) - 5) / 5')).toBe('11');
			expect(testParseExpression('1 + (2 * (3 + (4 * (5 + 6))))')).toBe('95');
		});

		// Financial scenarios
		it('should handle realistic financial calculations', () => {
			// Discount calculation
			expect(testParseExpression('100 - (100 * 0.15)')).toBe('85');

			// Tax calculation
			expect(testParseExpression('100 + (100 * 0.0725)')).toBe('107.25');

			// Split bill with tip
			expect(testParseExpression('(120 + (120 * 0.18)) / 4')).toBe('35.4');

			expect(testParseExpression('200000 * 0.005 * (1 + 0.005) / ((1 + 0.005) - 1)')).toBe('201000');
		});

		// International number formats
		it('should handle international number formats or gracefully fail', () => {
			// Indian lakh/crore format
			expect(testParseExpression('1,00,000.00')).toBe('100000');

			// Mixed formats
			expect(testParseExpression('1,234.56 + 7,890.12')).toBe('9124.68');
		});

		// Expression length limits
		it('should handle expressions of various lengths', () => {
			expect(testParseExpression('1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1')).toBe('30');

			// Very long expression
			const longExpression = Array(50).fill('1').join('+');
			expect(testParseExpression(longExpression)).toBe('50');

			// Long decimal
			expect(testParseExpression('1.1111111111111111111 + 2.2222222222222222222')).toBe('3.3333333333333333333');
		});

		// Recovery from partial syntax errors
		it('should recover from partial syntax errors where possible', () => {
			expect(testParseExpression('5 + (3 * 2')).toBe('0'); // Unmatched parenthesis
			expect(testParseExpression('(5 + 3) * 2)')).toBe('0'); // Extra closing parenthesis
			expect(testParseExpression('5 + *3')).toBe('0'); // Invalid operator sequence
		});

		// Special characters and formatting
		it('should handle or reject special characters in expressions', () => {
			expect(testParseExpression('$100 + $200')).toBe('0'); // Currency symbols
			expect(testParseExpression('100€ + 200€')).toBe('0'); // Currency symbols at end
			expect(testParseExpression('100.00USD + 200.00USD')).toBe('0'); // Currency codes
			expect(testParseExpression('½ + ¼')).toBe('0'); // Fraction characters
			expect(testParseExpression('1,234.56 + 5,432.10')).toBe('6666.66'); // Properly handles commas
		});

		// Random combination stress tests
		it('should handle random combinations of valid operations', () => {
			// Randomly generated expressions with valid syntax
			expect(testParseExpression('((15 / 3) * 4) + (10 - 2)')).toBe('28');
			expect(testParseExpression('(1000 - 500) / (100 / 20)')).toBe('100');
			expect(testParseExpression('(7 * 8) - (9 / 3) + (5 * 4)')).toBe('73');
			expect(testParseExpression('((((1 + 2) * 3) + 4) * 5)')).toBe('65');
			expect(testParseExpression('1 + 2 * 3 / 4 - 5 + 6 * 7 / 8')).toBe('2.75');
		});

		// Multi-currency expressions (should fail gracefully)
		it('should handle or reject multi-currency expressions', () => {
			expect(testParseExpression('100 USD + 200 EUR')).toBe('0'); // Different currencies
			expect(testParseExpression('100USD - 50EUR')).toBe('0'); // Different currencies no space
			expect(testParseExpression('(100 * 1.5) USD')).toBe('0'); // Currency after expression
		});

		// Extreme cases and destructive testing
		it('should handle extreme inputs and destructive tests', () => {
			// Very large numbers
			expect(testParseExpression('99999999999999999 + 1')).toBe('100000000000000000');

			// Very small numbers
			expect(testParseExpression('0.000000000000001 * 10000000000000000')).toBe('10');

			// Potentially problematic inputs
			expect(testParseExpression('0/0')).toBe('0'); // Division by zero
			expect(testParseExpression('NaN')).toBe('0'); // Not a number
			expect(testParseExpression('Infinity')).toBe('0'); // Infinity
			expect(testParseExpression('-Infinity')).toBe('0'); // Negative infinity

			// Empty or all whitespace
			expect(testParseExpression('')).toBe('0');
			expect(testParseExpression('   ')).toBe('0');

			// Random characters and special chars
			expect(testParseExpression('@#$%^&*')).toBe('0');
			expect(testParseExpression('hello world')).toBe('0');

			// SQL injection-like tests
			expect(testParseExpression('1; DROP TABLE')).toBe('0');
			expect(testParseExpression('1 OR 1=1')).toBe('0');
		});

		// Fuzz testing with generated inputs
		it('should safely handle fuzzy generated expressions', () => {
			// Generate a long random expression
			const ops = ['+', '-', '*', '/'];
			let fuzzyExpr = '5';
			for (let i = 0; i < 10; i++) {
				const op = ops[Math.floor(Math.random() * ops.length)];
				const num = Math.floor(Math.random() * 10) + 1; // Avoid division by zero
				fuzzyExpr += ` ${op} ${num}`;
			}

			// Test that it either returns a valid number or gracefully returns 0
			const result = testParseExpression(fuzzyExpr);
			expect(typeof result === 'string').toBe(true);
			expect(isNaN(Number(result))).toBe(false);

			// Some examples of tricky but valid expressions
			expect(testParseExpression('0.1 + 0.2 - 0.3')).toBe('0');
			expect(testParseExpression('999999.999999 + 0.000001')).toBe('1000000');
			expect(testParseExpression('0.000001 * 0.000001')).toBe('1e-12');
		});

		// Accounting and Beancount specific expressions
		it('should handle accounting-specific expressions', () => {
			// Common accounting calculations
			expect(testParseExpression('1000 * 0.03')).toBe('30'); // Simple interest
			expect(testParseExpression('1000 * 1.03')).toBe('1030'); // Principal plus interest
			expect(testParseExpression('1200 / 12')).toBe('100'); // Monthly amount
			expect(testParseExpression('(100 + 200 + 300) / 3')).toBe('200'); // Average

			// Tax calculations
			expect(testParseExpression('100 + (100 * 0.06)')).toBe('106'); // Sales tax
			expect(testParseExpression('5000 * 0.22')).toBe('1100'); // Income tax bracket
			expect(testParseExpression('1000 - (1000 * 0.25)')).toBe('750'); // After-tax income

			// Depreciation
			expect(testParseExpression('10000 / 5')).toBe('2000'); // Straight-line depreciation

			// Exchange rate calculations
			expect(testParseExpression('100 * 1.35')).toBe('135'); // USD to EUR
			expect(testParseExpression('200 / 1.35')).toBe('148.14814814814814814815'); // EUR to USD

			// Investment returns
			expect(testParseExpression('1000 * (1.08 - 1)')).toBe('80'); // Annual return

			// Complex transaction split
			expect(testParseExpression('(156.83 / 3) * 2')).toBe('104.55333333333333333334'); // 2/3 of an expense
			expect(testParseExpression('156.83 - (156.83 / 3) * 2')).toBe('52.27666666666666666666'); // Remaining 1/3

			// Rounding to nearest cent
			expect(testParseExpression('(156.83 / 3) + 0.005')).toBe('52.28166666666666666667'); // For manual rounding

			// Cost basis calculations
			expect(testParseExpression('(10 * 100 + 20 * 120) / (10 + 20)')).toBe('113.33333333333333333333');

			// Percentage calculations
			expect(testParseExpression('(90 - 80) / 80 * 100')).toBe('12.5'); // Percentage increase
			expect(testParseExpression('(80 - 90) / 90 * 100')).toBe('-11.111111111111111111'); // Percentage decrease
		});

		it('should handle expressions with leading plus and minus signs', () => {
			expect(testParseExpression('+200.00')).toBe('200');
			expect(testParseExpression('-200.00')).toBe('-200');
		});
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

	describe('Total Cost with Double Brackets', () => {
		// Test single bracket per-unit cost
		it('should correctly calculate per-unit cost with single brackets', () => {
			const postings: Posting[] = [
				createPosting('Assets:Checking', { number: '-1000.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments',
					{ number: '10', currency: 'STOCK' },
					{ number: '100.00', currency: 'USD', isTotalCost: false },
				),
			];

			const result = checkTransactionBalance(postings, 0.005);
			expect(result.isBalanced).toBe(true);
		});

		// Test double bracket total cost
		it('should correctly calculate total cost with double brackets', () => {
			const postings: Posting[] = [
				createPosting('Assets:Checking', { number: '-400.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments:Fund1',
					{ number: '12.072', currency: 'STOCK1' },
					{ number: '240.00', currency: 'USD', isTotalCost: true },
				),
				createPosting(
					'Assets:Investments:Fund2',
					{ number: '11.552', currency: 'STOCK2' },
					{ number: '160.00', currency: 'USD', isTotalCost: true },
				),
			];

			const result = checkTransactionBalance(postings, 0.005);
			expect(result.isBalanced).toBe(true);
		});

		// Test unbalanced transaction with double bracket total cost
		it('should detect imbalance with double bracket total cost', () => {
			const postings: Posting[] = [
				createPosting('Assets:Checking', { number: '-405.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments:Fund1',
					{ number: '12.072', currency: 'STOCK1' },
					{ number: '240.00', currency: 'USD', isTotalCost: true },
				),
				createPosting(
					'Assets:Investments:Fund2',
					{ number: '11.552', currency: 'STOCK2' },
					{ number: '160.00', currency: 'USD', isTotalCost: true },
				),
			];

			const result = checkTransactionBalance(postings, 0.005);
			expect(result.isBalanced).toBe(false);
			expect(result.imbalances.length).toBeGreaterThan(0);
			const imbalance = result.imbalances[0];
			expect(imbalance).toBeDefined();
			expect(imbalance?.difference.toString()).toBe('-5');
		});

		// Test the difference between per-unit cost and total cost calculations
		it('should calculate differently for per-unit vs total cost', () => {
			// Per-unit cost: 10 shares at 20 USD per share = 200 USD total
			const perUnitPostings: Posting[] = [
				createPosting('Assets:Checking', { number: '-200.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments',
					{ number: '10', currency: 'STOCK' },
					{ number: '20.00', currency: 'USD', isTotalCost: false },
				),
			];

			// Total cost: 10 shares with total cost of 200 USD
			const totalCostPostings: Posting[] = [
				createPosting('Assets:Checking', { number: '-200.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments',
					{ number: '10', currency: 'STOCK' },
					{ number: '200.00', currency: 'USD', isTotalCost: true },
				),
			];

			// Different number of shares but same per-unit cost - should be unbalanced
			const unbalancedPerUnitPostings: Posting[] = [
				createPosting('Assets:Checking', { number: '-200.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments',
					{ number: '8', currency: 'STOCK' },
					{ number: '20.00', currency: 'USD', isTotalCost: false },
				),
			];

			// Different number of shares but same total cost - should be balanced
			const balancedTotalCostPostings: Posting[] = [
				createPosting('Assets:Checking', { number: '-200.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments',
					{ number: '8', currency: 'STOCK' },
					{ number: '200.00', currency: 'USD', isTotalCost: true },
				),
			];

			// Check results
			expect(checkTransactionBalance(perUnitPostings, 0.005).isBalanced).toBe(true);
			expect(checkTransactionBalance(totalCostPostings, 0.005).isBalanced).toBe(true);
			expect(checkTransactionBalance(unbalancedPerUnitPostings, 0.005).isBalanced).toBe(false);
			expect(checkTransactionBalance(balancedTotalCostPostings, 0.005).isBalanced).toBe(true);
		});

		// Test mixed transaction with both single and double bracket costs
		it('should correctly balance transactions with mixed cost types', () => {
			const mixedPostings: Posting[] = [
				createPosting('Assets:Checking', { number: '-500.00', currency: 'USD' }),
				createPosting(
					'Assets:Investments:Fund1',
					{ number: '10', currency: 'STOCK1' },
					{ number: '30.00', currency: 'USD', isTotalCost: false }, // Per-unit cost: 10 * 30 = 300 USD
				),
				createPosting(
					'Assets:Investments:Fund2',
					{ number: '15', currency: 'STOCK2' },
					{ number: '200.00', currency: 'USD', isTotalCost: true }, // Total cost: 200 USD
				),
			];

			const result = checkTransactionBalance(mixedPostings, 0.005);
			expect(result.isBalanced).toBe(true);
		});
	});

	describe('checkTransactionBalance', () => {
		const { balancedTransactions, unbalancedTransactions } = parseTransactionsFromTestFile();

		it('should identify all balanced transactions', () => {
			for (const [index, postings] of balancedTransactions.entries()) {
				const result = checkTransactionBalance(postings, 0.005);
				console.log(`Transaction ${index}:`, {
					isBalanced: result.isBalanced,
					imbalances: result.imbalances,
				});
				expect(result.isBalanced, `Transaction ${index} should be balanced`).toBe(true);
			}
		});

		it('should identify all unbalanced transactions', () => {
			for (const [index, postings] of unbalancedTransactions.entries()) {
				const result = checkTransactionBalance(postings, 0.005);
				expect(result.isBalanced, `Transaction ${index} should be unbalanced`).toBe(false);
				expect(result.imbalances.length).toBeGreaterThan(0);
				const imbalance = result.imbalances[0];
				expect(imbalance).toBeDefined();
				expect(imbalance?.currency).toBe('USD');
			}
		});

		it('should calculate the correct difference for unbalanced transactions', () => {
			// Test specific examples with known differences

			// Simple unbalanced transaction: -120.00 + 119.95 = -0.05
			const simpleResult = checkTransactionBalance(unbalancedTransactions[0]!, 0.005);
			expect(simpleResult.isBalanced).toBe(false);
			expect(simpleResult.imbalances.length).toBeGreaterThan(0);
			const simpleImbalance = simpleResult.imbalances[0];
			expect(simpleImbalance).toBeDefined();
			expect(simpleImbalance?.currency).toBe('USD');
			expect(simpleImbalance?.difference.toString()).toBe('-0.05');

			// Price annotation transaction: -100.00 + (85.00 * 1.15) = -100.00 + 97.75 = -2.25
			const priceResult = checkTransactionBalance(unbalancedTransactions[1]!, 0.005);
			expect(priceResult.isBalanced).toBe(false);
			expect(priceResult.imbalances.length).toBeGreaterThan(0);
			const priceImbalance = priceResult.imbalances[0];
			expect(priceImbalance).toBeDefined();
			expect(priceImbalance?.currency).toBe('USD');
			expect(priceImbalance?.difference.toString()).toBe('-2.25');

			// Cost transaction: -1000.00 + (9 * 110.00) = -1000.00 + 990.00 = -10.00
			const costResult = checkTransactionBalance(unbalancedTransactions[2]!, 0.005);
			expect(costResult.isBalanced).toBe(false);
			expect(costResult.imbalances.length).toBeGreaterThan(0);
			const costImbalance = costResult.imbalances[0];
			expect(costImbalance).toBeDefined();
			expect(costImbalance?.currency).toBe('USD');
			expect(costImbalance?.difference.toString()).toBe('-10');

			// @@ price transaction: -100.00 + 98.50 = -1.50
			const totalPriceResult = checkTransactionBalance(unbalancedTransactions[3]!, 0.005);
			expect(totalPriceResult.isBalanced).toBe(false);
			expect(totalPriceResult.imbalances.length).toBeGreaterThan(0);
			const totalPriceImbalance = totalPriceResult.imbalances[0];
			expect(totalPriceImbalance).toBeDefined();
			expect(totalPriceImbalance?.currency).toBe('USD');
			expect(totalPriceImbalance?.difference.toString()).toBe('-1.5');
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

	// Test for expressions in amounts
	it('should correctly balance transactions with expressions in amounts', () => {
		// Transaction with expressions (243.00 / 3) which should equal 81.00
		const postingsWithExpressions = [
			createPosting('Expenses:Food', { number: '(243.00 / 3)', currency: 'CNY' }),
			createPosting('Assets:Receivables:Person1', { number: '(243.00 / 3)', currency: 'CNY' }),
			createPosting('Assets:Receivables:Person2', { number: '(243.00 / 3)', currency: 'CNY' }),
			createPosting('Assets:Payment', { number: '-243.00', currency: 'CNY' }),
		];

		const result = checkTransactionBalance(postingsWithExpressions, 0.005);

		// The transaction should be balanced
		expect(result.isBalanced).toBe(true);

		// Verify calculation of expressions
		// 243.00 / 3 = 81.00, so 3 * 81.00 - 243.00 = 0
		expect(result.imbalances.length).toBe(0); // No imbalances when balanced
	});

	// Additional test to verify expression calculations specifically
	it('should correctly calculate the expressions in posting amounts', () => {
		// Create a posting with an expression
		const posting = createPosting('Expenses:Food', { number: '(243.00 / 3)', currency: 'CNY' });

		// Instead of trying to access the non-exported sumPostings directly,
		// we'll use checkTransactionBalance which internally uses sumPostings
		const result = checkTransactionBalance([posting], 0.005);

		// Verify the expression was evaluated correctly: 243.00 / 3 = 81.00
		// We know the balance is 81 CNY as there is only one posting
		expect(result.isBalanced).toBe(false); // Not balanced with just one posting
		expect(result.imbalances.length).toBeGreaterThan(0);
		const imbalance = result.imbalances[0];
		expect(imbalance).toBeDefined();
		expect(imbalance?.currency).toBe('CNY');
		expect(imbalance?.difference.toString()).toBe('81'); // The difference is exactly 81
	});
});
