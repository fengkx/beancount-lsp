import Big from 'big.js';
import { describe, expect, it, vi } from 'vitest';
import {
	ASTNode,
	BinaryOpNode,
	Lexer,
	NumberNode,
	parseExpression,
	Parser,
	Token,
	TokenType,
	UnaryOpNode,
} from '../../common/utils/expression-parser';

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

describe('Lexer', () => {
	describe('tokenization', () => {
		it('should tokenize numbers', () => {
			const lexer = new Lexer('123');

			const token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.NUMBER);
			expect(token.value).toBe('123');

			const eofToken = lexer.getNextToken();
			expect(eofToken.type).toBe(TokenType.EOF);
		});

		it('should tokenize decimal numbers', () => {
			const lexer = new Lexer('123.45');

			const token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.NUMBER);
			expect(token.value).toBe('123.45');

			const eofToken = lexer.getNextToken();
			expect(eofToken.type).toBe(TokenType.EOF);
		});

		it('should tokenize negative numbers', () => {
			const lexer = new Lexer('-123.45');

			let token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.MINUS);

			token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.NUMBER);
			expect(token.value).toBe('123.45');

			const eofToken = lexer.getNextToken();
			expect(eofToken.type).toBe(TokenType.EOF);
		});

		it('should tokenize operators', () => {
			const lexer = new Lexer('+ - * /');

			let token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.PLUS);

			token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.MINUS);

			token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.MULTIPLY);

			token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.DIVIDE);

			const eofToken = lexer.getNextToken();
			expect(eofToken.type).toBe(TokenType.EOF);
		});

		it('should tokenize parentheses', () => {
			const lexer = new Lexer('( )');

			let token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.LEFT_PAREN);

			token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.RIGHT_PAREN);

			const eofToken = lexer.getNextToken();
			expect(eofToken.type).toBe(TokenType.EOF);
		});

		it('should tokenize a simple expression', () => {
			const lexer = new Lexer('2 + 3');

			let token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.NUMBER);
			expect(token.value).toBe('2');

			token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.PLUS);

			token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.NUMBER);
			expect(token.value).toBe('3');

			const eofToken = lexer.getNextToken();
			expect(eofToken.type).toBe(TokenType.EOF);
		});

		it('should tokenize a complex expression', () => {
			const lexer = new Lexer('(2.5 + 3) * -4 / 2');

			const expectedTokens = [
				{ type: TokenType.LEFT_PAREN, value: '(' },
				{ type: TokenType.NUMBER, value: '2.5' },
				{ type: TokenType.PLUS, value: '+' },
				{ type: TokenType.NUMBER, value: '3' },
				{ type: TokenType.RIGHT_PAREN, value: ')' },
				{ type: TokenType.MULTIPLY, value: '*' },
				{ type: TokenType.NUMBER, value: '-4' },
				{ type: TokenType.DIVIDE, value: '/' },
				{ type: TokenType.NUMBER, value: '2' },
				{ type: TokenType.EOF, value: '' },
			];

			expectedTokens.forEach(expected => {
				const token = lexer.getNextToken();
				expect(token.type).toBe(expected.type);
				expect(token.value).toBe(expected.value);
			});
		});

		it('should handle expressions with no spaces', () => {
			const lexer = new Lexer('2+3*4/5');

			const expectedTokens = [
				{ type: TokenType.NUMBER, value: '2' },
				{ type: TokenType.PLUS, value: '+' },
				{ type: TokenType.NUMBER, value: '3' },
				{ type: TokenType.MULTIPLY, value: '*' },
				{ type: TokenType.NUMBER, value: '4' },
				{ type: TokenType.DIVIDE, value: '/' },
				{ type: TokenType.NUMBER, value: '5' },
				{ type: TokenType.EOF, value: '' },
			];

			expectedTokens.forEach(expected => {
				const token = lexer.getNextToken();
				expect(token.type).toBe(expected.type);
				expect(token.value).toBe(expected.value);
			});
		});

		it('should handle unary plus and minus operators', () => {
			const lexer = new Lexer('+2 + -3');

			const expectedTokens = [
				{ type: TokenType.PLUS, value: '+' },
				{ type: TokenType.NUMBER, value: '2' },
				{ type: TokenType.PLUS, value: '+' },
				{ type: TokenType.NUMBER, value: '-3' },
				{ type: TokenType.EOF, value: '' },
			];

			expectedTokens.forEach(expected => {
				const token = lexer.getNextToken();
				expect(token.type).toBe(expected.type);
				expect(token.value).toBe(expected.value);
			});
		});

		it('should handle consecutive operators correctly', () => {
			const lexer = new Lexer('2 + -3');

			const expectedTokens = [
				{ type: TokenType.NUMBER, value: '2' },
				{ type: TokenType.PLUS, value: '+' },
				{ type: TokenType.NUMBER, value: '-3' },
				{ type: TokenType.EOF, value: '' },
			];

			expectedTokens.forEach(expected => {
				const token = lexer.getNextToken();
				expect(token.type).toBe(expected.type);
				expect(token.value).toBe(expected.value);
			});
		});

		it('should handle edge case with multiple unary operators', () => {
			const lexer = new Lexer('--2');

			let token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.MINUS);

			token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.MINUS);

			token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.NUMBER);
			expect(token.value).toBe('2');

			const eofToken = lexer.getNextToken();
			expect(eofToken.type).toBe(TokenType.EOF);
		});

		it('should handle empty input', () => {
			const lexer = new Lexer('');

			const token = lexer.getNextToken();
			expect(token.type).toBe(TokenType.EOF);
		});

		it('should handle whitespace correctly', () => {
			const lexer = new Lexer('  2  +  3  ');

			const expectedTokens = [
				{ type: TokenType.NUMBER, value: '2' },
				{ type: TokenType.PLUS, value: '+' },
				{ type: TokenType.NUMBER, value: '3' },
				{ type: TokenType.EOF, value: '' },
			];

			expectedTokens.forEach(expected => {
				const token = lexer.getNextToken();
				expect(token.type).toBe(expected.type);
				expect(token.value).toBe(expected.value);
			});
		});
	});
});

describe('Parser', () => {
	describe('parsing and evaluation', () => {
		it('should parse and evaluate a simple number', () => {
			const lexer = new Lexer('42');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast).toBeInstanceOf(NumberNode);
			expect(ast.evaluate().toString()).toBe('42');
		});

		it('should parse and evaluate a negative number', () => {
			const lexer = new Lexer('-42');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast).toBeInstanceOf(UnaryOpNode);
			expect(ast.evaluate().toString()).toBe('-42');
		});

		it('should parse and evaluate a positive number', () => {
			const lexer = new Lexer('+32');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast).toBeInstanceOf(NumberNode);
			expect(ast.evaluate().toString()).toBe('32');
		});

		it('should parse and evaluate a simple addition', () => {
			const lexer = new Lexer('2 + 3');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast).toBeInstanceOf(BinaryOpNode);
			expect((ast as BinaryOpNode).operator).toBe(TokenType.PLUS);
			expect(ast.evaluate().toString()).toBe('5');
		});

		it('should parse and evaluate a simple subtraction', () => {
			const lexer = new Lexer('5 - 3');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast).toBeInstanceOf(BinaryOpNode);
			expect((ast as BinaryOpNode).operator).toBe(TokenType.MINUS);
			expect(ast.evaluate().toString()).toBe('2');
		});

		it('should parse and evaluate a simple multiplication', () => {
			const lexer = new Lexer('4 * 3');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast).toBeInstanceOf(BinaryOpNode);
			expect((ast as BinaryOpNode).operator).toBe(TokenType.MULTIPLY);
			expect(ast.evaluate().toString()).toBe('12');
		});

		it('should parse and evaluate a simple division', () => {
			const lexer = new Lexer('10 / 2');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast).toBeInstanceOf(BinaryOpNode);
			expect((ast as BinaryOpNode).operator).toBe(TokenType.DIVIDE);
			expect(ast.evaluate().toString()).toBe('5');
		});

		it('should handle division by zero safely', () => {
			const lexer = new Lexer('10 / 0');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast.evaluate().toString()).toBe('0');
		});

		it('should handle parentheses correctly', () => {
			const lexer = new Lexer('(2 + 3) * 4');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast.evaluate().toString()).toBe('20');
		});

		it('should handle nested parentheses', () => {
			const lexer = new Lexer('(2 + (3 * 4))');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast.evaluate().toString()).toBe('14');
		});

		it('should respect operator precedence', () => {
			const lexer = new Lexer('2 + 3 * 4');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast.evaluate().toString()).toBe('14'); // Not 20, as multiplication has higher precedence
		});

		it('should handle unary operators correctly', () => {
			const lexer = new Lexer('-2 * -3');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast.evaluate().toString()).toBe('6');
		});

		it('should handle complex expressions', () => {
			const lexer = new Lexer('2 * (3 + 4) - 5 / (1 + 1)');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			expect(ast.evaluate().toString()).toBe('11.5');
		});

		it('should handle decimal calculations accurately', () => {
			const lexer = new Lexer('0.1 + 0.2');
			const parser = new Parser(lexer);
			const ast = parser.parse();

			// Using Big.js ensures precise decimal arithmetic
			expect(ast.evaluate().toString()).toBe('0.3');
		});
	});
});

describe('parseExpression', () => {
	it('should evaluate simple expressions', () => {
		expect(parseExpression('5 + 3').toString()).toBe('8');
		expect(parseExpression('10 - 4').toString()).toBe('6');
		expect(parseExpression('3 * 4').toString()).toBe('12');
		expect(parseExpression('10 / 2').toString()).toBe('5');
	});

	it('should handle undefined or empty input', () => {
		expect(parseExpression().toString()).toBe('0');
		expect(parseExpression('').toString()).toBe('0');
	});

	it('should remove commas from input', () => {
		expect(parseExpression('1,234.56').toString()).toBe('1234.56');
	});

	it('should handle expressions with unbalanced parentheses', () => {
		expect(parseExpression('(2 + 3').toString()).toBe('0');
		expect(parseExpression('2 + 3)').toString()).toBe('0');
	});

	it('should handle malformed expressions', () => {
		expect(parseExpression('2 + + 3').toString()).toBe('0');
		expect(parseExpression('2 +.+ 3').toString()).toBe('0');
		expect(parseExpression('2 +').toString()).toBe('0');
		expect(parseExpression('* 2').toString()).toBe('0');
	});

	it('should handle simple number case', () => {
		expect(parseExpression('123').toString()).toBe('123');
		expect(parseExpression('+123').toString()).toBe('123');
		expect(parseExpression('-123').toString()).toBe('-123');
	});

	it('should handle complex expressions with multiple operations', () => {
		expect(parseExpression('2 * 3 + 4 * 5').toString()).toBe('26');
		expect(parseExpression('(2 + 3) * (4 + 5)').toString()).toBe('45');
		expect(parseExpression('2 + 3 * 4 / 2 - 1').toString()).toBe('7');
	});
});
