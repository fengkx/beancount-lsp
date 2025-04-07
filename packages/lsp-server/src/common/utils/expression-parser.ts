import { Logger } from '@bean-lsp/shared';
import Big from 'big.js';

const logger = new Logger('expression-parser');

/**
 * Token types for the expression parser
 */
export const enum TokenType {
	NUMBER = 'NUMBER',
	PLUS = 'PLUS',
	MINUS = 'MINUS',
	MULTIPLY = 'MULTIPLY',
	DIVIDE = 'DIVIDE',
	LEFT_PAREN = 'LEFT_PAREN',
	RIGHT_PAREN = 'RIGHT_PAREN',
	EOF = 'EOF',
}

/**
 * Token class for representing lexical tokens
 */
export class Token {
	constructor(
		public type: TokenType,
		public value: string,
		public position: number,
	) {}
}

/**
 * Lexer class for tokenizing the input expression
 */
export class Lexer {
	private position = 0;
	private text: string;
	private currentChar: string | null;

	constructor(text: string) {
		// Insert spaces around operators for consistent tokenization
		// This helps with handling expressions like "3*-1.99"
		let normalizedText = text;
		normalizedText = normalizedText.replace(/\*/g, ' * ');
		normalizedText = normalizedText.replace(/\//g, ' / ');
		normalizedText = normalizedText.replace(/(?<!\s)-(?!\s)/g, ' - '); // Add spaces around - but not if already spaced
		normalizedText = normalizedText.replace(/\(/g, ' ( ');
		normalizedText = normalizedText.replace(/\)/g, ' ) ');
		normalizedText = normalizedText.replace(/\s+/g, ' ').trim(); // Normalize multiple spaces

		this.text = normalizedText;
		this.currentChar = this.text.length > 0 ? this.text.charAt(0) : null;
	}

	/**
	 * Advance the position pointer and set the current character
	 */
	private advance(): void {
		this.position++;
		if (this.position >= this.text.length) {
			this.currentChar = null;
		} else {
			this.currentChar = this.text.charAt(this.position);
		}
	}

	/**
	 * Look at the next character without advancing
	 */
	private peek(): string | null {
		const peekPos = this.position + 1;
		if (peekPos >= this.text.length) {
			return null;
		}
		return this.text.charAt(peekPos);
	}

	/**
	 * Skip whitespace characters
	 */
	private skipWhitespace(): void {
		while (this.currentChar !== null && /\s/.test(this.currentChar)) {
			this.advance();
		}
	}

	/**
	 * Extract a multi-digit number from the input
	 */
	private number(): Token {
		let numStr = '';
		const startPos = this.position;

		// Handle negative numbers that start with -
		if (this.currentChar === '-') {
			numStr += this.currentChar;
			this.advance();
		} // Handle positive numbers that start with +
		else if (this.currentChar === '+') {
			// Skip the + (implicit positive)
			this.advance();
		}

		// Extract the integer part
		while (this.currentChar !== null && /[0-9]/.test(this.currentChar)) {
			numStr += this.currentChar;
			this.advance();
		}

		// Extract the decimal part if present
		if (this.currentChar === '.') {
			numStr += '.';
			this.advance();

			while (this.currentChar !== null && /[0-9]/.test(this.currentChar)) {
				numStr += this.currentChar;
				this.advance();
			}
		}

		// Handle empty numStr (in case we just saw a '+' sign)
		if (numStr === '' || numStr === '-') {
			numStr = numStr === '-' ? '-0' : '0';
		}

		return new Token(TokenType.NUMBER, numStr, startPos);
	}

	/**
	 * Tokenize the input and return the next token
	 */
	public getNextToken(): Token {
		while (this.currentChar !== null) {
			// Skip whitespace
			if (/\s/.test(this.currentChar)) {
				this.skipWhitespace();
				continue;
			}

			// Handle numbers
			if (/[0-9]/.test(this.currentChar)) {
				return this.number();
			}

			// Handle negative numbers or minus operator
			if (this.currentChar === '-') {
				// Check if this is a unary minus (negative sign) or binary minus (subtraction)
				const isUnary = this.position === 0 // At start of expression
					|| this.position > 0 && /[\s(+\-*/]/.test(this.text.charAt(this.position - 1)); // After operator or open paren

				// Look ahead to see if a number or open parenthesis follows
				const nextChar = this.peek();
				const isFollowedByNumber = nextChar !== null
					&& (/[0-9]/.test(nextChar) || nextChar === '(' || nextChar === '-');

				if (isUnary && isFollowedByNumber) {
					// This is a negative number or negation of a parenthesized expression
					if (nextChar === '(' || nextChar === '-') {
						// It's a negative parenthesized expression or double negation
						const minusToken = new Token(TokenType.MINUS, '-', this.position);
						this.advance();
						return minusToken;
					} else {
						// It's a negative number
						return this.number();
					}
				} else {
					// It's a binary subtraction operator
					const minusToken = new Token(TokenType.MINUS, '-', this.position);
					this.advance();
					return minusToken;
				}
			}

			// Handle positive sign (+) as number or operator
			if (this.currentChar === '+') {
				// Check if this is a unary plus or binary plus
				const isUnary = this.position === 0 // At start of expression
					|| this.position > 0 && /[\s(+\-*/]/.test(this.text.charAt(this.position - 1)); // After operator or open paren

				// Look ahead to see if a number or open parenthesis follows
				const nextChar = this.peek();
				const isFollowedByNumber = nextChar !== null
					&& (/[0-9]/.test(nextChar) || nextChar === '(' || nextChar === '+' || nextChar === '-');

				// Special case for '1 + +1': Skip multiple + signs and treat it as a single +
				if (nextChar === '+') {
					// Skip this + sign and continue to get the next token
					this.advance();
					continue;
				}

				if (isUnary && isFollowedByNumber) {
					// This is a positive sign or application to a parenthesized expression
					const plusToken = new Token(TokenType.PLUS, '+', this.position);
					if (nextChar === '(' || nextChar === '-') {
						// It's a positive parenthesized expression
						this.advance();
						return plusToken;
					} else {
						// It's a positive number (just skip the + sign)
						this.advance(); // Skip the + sign
						return plusToken;
					}
				} else {
					// It's a binary addition operator
					const plusToken = new Token(TokenType.PLUS, '+', this.position);
					this.advance();
					return plusToken;
				}
			}

			// Handle other operators
			switch (this.currentChar) {
				case '*':
					const multToken = new Token(TokenType.MULTIPLY, '*', this.position);
					this.advance();
					return multToken;
				case '/':
					const divToken = new Token(TokenType.DIVIDE, '/', this.position);
					this.advance();
					return divToken;
				case '(':
					const leftParenToken = new Token(TokenType.LEFT_PAREN, '(', this.position);
					this.advance();
					return leftParenToken;
				case ')':
					const rightParenToken = new Token(TokenType.RIGHT_PAREN, ')', this.position);
					this.advance();
					return rightParenToken;
				default:
					// Handle unexpected characters
					logger.error(`Unexpected character: ${this.currentChar} at position ${this.position}`);
					throw new Error(`Invalid character: ${this.currentChar} at position ${this.position}`);
			}
		}

		return new Token(TokenType.EOF, '', this.position);
	}
}

/**
 * Abstract syntax tree node classes
 */
export abstract class ASTNode {
	abstract evaluate(): Big;
}

export class NumberNode extends ASTNode {
	constructor(public value: string) {
		super();
	}

	evaluate(): Big {
		return new Big(this.value);
	}
}

export class BinaryOpNode extends ASTNode {
	constructor(
		public left: ASTNode,
		public operator: TokenType,
		public right: ASTNode,
	) {
		super();
	}

	evaluate(): Big {
		try {
			const leftVal = this.left.evaluate();
			const rightVal = this.right.evaluate();

			switch (this.operator) {
				case TokenType.PLUS:
					return leftVal.plus(rightVal);
				case TokenType.MINUS:
					return leftVal.minus(rightVal);
				case TokenType.MULTIPLY:
					return leftVal.times(rightVal);
				case TokenType.DIVIDE:
					if (rightVal.eq(0)) {
						logger.warn('Division by zero encountered, returning 0');
						return new Big(0);
					}
					return leftVal.div(rightVal);
				default:
					throw new Error(`Invalid binary operator: ${this.operator}`);
			}
		} catch (e) {
			logger.error(`Error evaluating binary operation: ${e}`);
			return new Big(0);
		}
	}
}

export class UnaryOpNode extends ASTNode {
	constructor(
		public operator: TokenType,
		public expr: ASTNode,
	) {
		super();
	}

	evaluate(): Big {
		try {
			const exprVal = this.expr.evaluate();

			switch (this.operator) {
				case TokenType.PLUS:
					return exprVal;
				case TokenType.MINUS:
					return exprVal.times(new Big(-1));
				default:
					throw new Error(`Invalid unary operator: ${this.operator}`);
			}
		} catch (e) {
			logger.error(`Error evaluating unary expression: ${e}`);
			return new Big(0);
		}
	}
}

/**
 * Parser class for parsing the token stream and building an AST
 */
export class Parser {
	private lexer: Lexer;
	private currentToken: Token;

	constructor(lexer: Lexer) {
		this.lexer = lexer;
		this.currentToken = this.lexer.getNextToken();
	}

	/**
	 * Check if the current token matches the expected type and advance
	 */
	private eat(tokenType: TokenType): void {
		if (this.currentToken.type === tokenType) {
			this.currentToken = this.lexer.getNextToken();
		} else {
			throw new Error(`Unexpected token: ${this.currentToken.value}, expected type: ${tokenType}`);
		}
	}

	/**
	 * Parse factor: NUMBER | (expr) | +factor | -factor
	 * This handles atomic expressions, parentheses, and unary operators
	 */
	private factor(): ASTNode {
		const token = this.currentToken;

		if (token.type === TokenType.NUMBER) {
			this.eat(TokenType.NUMBER);
			return new NumberNode(token.value);
		} else if (token.type === TokenType.LEFT_PAREN) {
			this.eat(TokenType.LEFT_PAREN);
			const node = this.expr(); // Parse the expression inside parentheses
			this.eat(TokenType.RIGHT_PAREN);
			return node;
		} else if (token.type === TokenType.PLUS) {
			// Unary plus (positive sign)
			this.eat(TokenType.PLUS);
			// The unary plus doesn't change the value
			return this.factor();
		} else if (token.type === TokenType.MINUS) {
			// Unary minus (negative sign)
			this.eat(TokenType.MINUS);
			// Apply negation to the factor
			return new UnaryOpNode(TokenType.MINUS, this.factor());
		}

		throw new Error(`Invalid factor: ${token.value}`);
	}

	/**
	 * Parse term: factor ((MUL | DIV) factor)*
	 * This handles multiplication and division
	 */
	private term(): ASTNode {
		let node = this.factor();

		while (
			this.currentToken.type === TokenType.MULTIPLY
			|| this.currentToken.type === TokenType.DIVIDE
		) {
			const token = this.currentToken;

			if (token.type === TokenType.MULTIPLY) {
				this.eat(TokenType.MULTIPLY);
				node = new BinaryOpNode(node, TokenType.MULTIPLY, this.factor());
			} else if (token.type === TokenType.DIVIDE) {
				this.eat(TokenType.DIVIDE);
				node = new BinaryOpNode(node, TokenType.DIVIDE, this.factor());
			}
		}

		return node;
	}

	/**
	 * Parse expression: term ((PLUS | MINUS) term)*
	 * This handles addition and subtraction
	 */
	private expr(): ASTNode {
		let node = this.term();

		while (
			this.currentToken.type === TokenType.PLUS
			|| this.currentToken.type === TokenType.MINUS
		) {
			const token = this.currentToken;

			if (token.type === TokenType.PLUS) {
				this.eat(TokenType.PLUS);
				node = new BinaryOpNode(node, TokenType.PLUS, this.term());
			} else if (token.type === TokenType.MINUS) {
				this.eat(TokenType.MINUS);
				node = new BinaryOpNode(node, TokenType.MINUS, this.term());
			}
		}

		return node;
	}

	/**
	 * Parse the entire input and return the AST
	 */
	public parse(): ASTNode {
		try {
			const node = this.expr();

			if (this.currentToken.type !== TokenType.EOF) {
				logger.warn(`Unexpected token at end: ${this.currentToken.value}`);
			}

			return node;
		} catch (e) {
			logger.error(`Error parsing expression: ${e}`);
			// Return a safe default value node
			return new NumberNode('0');
		}
	}
}

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
		// Trim the input and remove commas
		let expr = expression.trim().replace(/,/g, '');

		// Check for unbalanced parentheses
		let openCount = 0;
		let closeCount = 0;
		for (const char of expr) {
			if (char === '(') openCount++;
			if (char === ')') closeCount++;
		}
		if (openCount !== closeCount) {
			return new Big(0);
		}

		// Check for malformed expressions
		if (
			/[+\-*/]\s*[+*/]/.test(expr) // Double operators like + +, + *, etc.
			|| /[+\-*/]\.[+\-*/]/.test(expr) // Operators with dots between like +.+
			|| expr.endsWith('+') || expr.endsWith('-') || expr.endsWith('*') || expr.endsWith('/') // Ending with operator
			|| expr.match(/^[*/]/) // Starting with * or /
		) {
			return new Big(0);
		}

		// Simple number case (including leading + or - sign)
		if (/^[+-]?\d*\.?\d+$/.test(expr)) {
			// Remove leading + sign if present
			if (expr.startsWith('+')) {
				expr = expr.substring(1);
			}
			return new Big(expr);
		}

		// Use the standard parser approach
		const lexer = new Lexer(expr);
		const parser = new Parser(lexer);
		const ast = parser.parse();
		return ast.evaluate();
	} catch (e) {
		logger.error(`Error evaluating expression "${expression}": ${e}`);
		// Return 0 as fallback to avoid breaking the balance checker
		return new Big(0);
	}
}
