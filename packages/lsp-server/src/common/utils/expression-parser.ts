import { Logger } from '@bean-lsp/shared';
import Big from 'big.js';

const logger = new Logger('expression-parser');

/**
 * Parses and evaluates a numeric expression string like "90.00 / 3" or "2 * 1.5"
 * @param expression The expression string to evaluate, or undefined
 * @returns The evaluated Big result, or zero if undefined input
 */
export function parseExpression(expression?: string): Big {
	if (!expression) {
		return new Big(0);
	}

	try {
		// Trim the input
		const expr = expression.trim();

		// Simple number case
		if (/^-?\d*\.?\d+$/.test(expr)) {
			return new Big(expr);
		}

		// Handle parentheses first - this allows for proper operator precedence
		if (expr.includes('(')) {
			// Find the innermost parentheses
			const parenMatch = /\(([^()]+)\)/.exec(expr);
			if (parenMatch) {
				const [fullMatch, innerExpr] = parenMatch;
				// Calculate the inner expression
				const innerValue = parseExpression(innerExpr);
				// Replace the parenthesized part and recursively process the new expression
				const newExpr = expr.replace(fullMatch, innerValue.toString());
				return parseExpression(newExpr);
			}
		}

		// Handle multiplication and division (higher precedence)
		const multDivRegex = /([^+\-*/]+)([*/])([^+\-*/]+)/;
		if (multDivRegex.test(expr)) {
			const match = multDivRegex.exec(expr);
			if (match) {
				const [fullMatch, leftStr, operator, rightStr] = match;
				const left = parseExpression(leftStr);
				const right = parseExpression(rightStr);

				// Calculate the result
				const result = operator === '*'
					? left.times(right)
					: left.div(right);

				// Replace the processed part and continue parsing
				const newExpr = expr.replace(fullMatch, result.toString());
				return parseExpression(newExpr);
			}
		}

		// Handle addition and subtraction (lower precedence)
		// Find leftmost + or - operator that isn't a unary minus
		const addSubRegex = /^(.+?)([+-])(.+)$/;
		const match = addSubRegex.exec(expr);
		if (match) {
			const [, leftStr, operator, rightStr] = match;
			const left = parseExpression(leftStr);
			const right = parseExpression(rightStr);

			return operator === '+'
				? left.plus(right)
				: left.minus(right);
		}

		// If we get here and still can't parse, try as a regular number
		logger.warn(`Unable to parse expression: ${expr}, trying as regular number`);
		return new Big(expr); // Will throw if invalid
	} catch (e) {
		logger.error(`Error evaluating expression "${expression}": ${e}`);
		// Return 0 as fallback to avoid breaking the balance checker
		return new Big(0);
	}
}
