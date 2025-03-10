import { Posting } from '../../common/utils/balance-checker';

/**
 * Helper to create a posting from raw parameters for testing
 */
export function createPosting(
	account: string,
	amount?: { number: string; currency: string },
	cost?: { number: string; currency: string },
	price?: { type: '@' | '@@'; number: string; currency: string },
): Posting {
	return {
		node: {} as any, // Mock node for testing
		account,
		amount,
		cost,
		price,
	};
}

/**
 * Helper to extract transactions from the test file
 */
export function parseTransactionsFromTestFile(): {
	balancedTransactions: Posting[][];
	unbalancedTransactions: Posting[][];
} {
	// For testing, we'll manually define the transactions from test_transaction.bean
	// In a real application, this would use parser-based extraction

	const result = {
		balancedTransactions: [
			// Simple balanced transaction
			[
				createPosting('Assets:Checking', { number: '-75.50', currency: 'USD' }),
				createPosting('Expenses:Food', { number: '75.50', currency: 'USD' }),
			],
			// Transaction with cost - balanced
			[
				createPosting('Assets:Checking', { number: '-1000.00', currency: 'USD' }),
				createPosting(
					'Assets:Savings',
					{ number: '10', currency: 'STOCK' },
					{ number: '100.00', currency: 'USD' },
				),
			],
			// Transaction with @@ (total price) annotation - balanced
			[
				createPosting('Assets:Checking', { number: '-100.00', currency: 'USD' }),
				createPosting(
					'Expenses:Food',
					{ number: '85.00', currency: 'EUR' },
					undefined,
					{ type: '@@', number: '100.00', currency: 'USD' },
				),
			],
			// Transaction mixing @ and @@ - balanced
			[
				createPosting('Assets:Checking', { number: '-200.00', currency: 'USD' }),
				createPosting(
					'Expenses:Food',
					{ number: '85.00', currency: 'EUR' },
					undefined,
					{ type: '@', number: '1.176', currency: 'USD' },
				),
				createPosting(
					'Expenses:Food',
					{ number: '85.00', currency: 'EUR' },
					undefined,
					{ type: '@@', number: '100.04', currency: 'USD' },
				),
			],
		],
		unbalancedTransactions: [
			// Simple unbalanced transaction
			[
				createPosting('Assets:Checking', { number: '-120.00', currency: 'USD' }),
				createPosting('Expenses:Utilities', { number: '119.95', currency: 'USD' }),
			],
			// Transaction with price annotation - unbalanced
			[
				createPosting('Assets:Checking', { number: '-100.00', currency: 'USD' }),
				createPosting(
					'Expenses:Food',
					{ number: '85.00', currency: 'EUR' },
					undefined,
					{ type: '@', number: '1.15', currency: 'USD' },
				),
			],
			// Transaction with cost - unbalanced
			[
				createPosting('Assets:Checking', { number: '-1000.00', currency: 'USD' }),
				createPosting(
					'Assets:Savings',
					{ number: '9', currency: 'STOCK' },
					{ number: '110.00', currency: 'USD' },
				),
			],
			// Transaction with @@ - unbalanced
			[
				createPosting('Assets:Checking', { number: '-100.00', currency: 'USD' }),
				createPosting(
					'Expenses:Food',
					{ number: '85.00', currency: 'EUR' },
					undefined,
					{ type: '@@', number: '98.50', currency: 'USD' },
				),
			],
		],
	};

	return result;
}
