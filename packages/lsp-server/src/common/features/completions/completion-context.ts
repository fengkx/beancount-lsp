import type { Position } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';

export type CompletionTextContextLike = {
	linePrefix: string;
	tokenRange: { startChar: number; endChar: number };
	tokenText: string;
	triggerCharacter?: string;
	inOpenQuote: boolean;
	afterHash: boolean;
	afterCaret: boolean;
};

export function normalizeAccountQueryToken(input: string): string {
	return input
		.replace(/：/g, ':')
		.replace(/^["'#^]+/, '')
		.trim();
}

export function buildCompletionTextContext(
	document: TextDocument,
	position: Position,
	triggerCharacter?: string,
): CompletionTextContextLike {
	const linePrefix = document.getText({
		start: { line: position.line, character: 0 },
		end: position,
	});
	const isTokenChar = (ch: string) => /[\p{L}\p{N}:：._/-]/u.test(ch);
	let startChar = linePrefix.length;
	while (startChar > 0 && isTokenChar(linePrefix.charAt(startChar - 1))) {
		startChar--;
	}
	const endChar = linePrefix.length;
	const tokenText = linePrefix.slice(startChar, endChar);
	const leftChar = startChar > 0 ? linePrefix.charAt(startChar - 1) : '';
	const quoteCount = linePrefix.split('"').length - 1;

	return {
		linePrefix,
		tokenRange: { startChar, endChar },
		tokenText: normalizeAccountQueryToken(tokenText),
		triggerCharacter,
		inOpenQuote: quoteCount % 2 === 1,
		afterHash: tokenText.startsWith('#') || leftChar === '#',
		afterCaret: tokenText.startsWith('^') || leftChar === '^',
	};
}

export function deriveAccountQueryFromLine(linePrefix: string): string {
	const normalizedLine = linePrefix.replace(/：/g, ':');
	const strict = normalizedLine.match(/(?:^|\s)([AEIL](?::[A-Za-z0-9._/-]+)+)$/i);
	if (strict && strict[1]) {
		return normalizeAccountQueryToken(strict[1]);
	}
	const m = normalizedLine.match(/(?:^|\s)([AEIL](?::[A-Za-z0-9._/-]*)*)$/i);
	if (m && m[1]) {
		return normalizeAccountQueryToken(m[1]);
	}
	const lastToken = normalizedLine.trim().split(/\s+/).at(-1) ?? '';
	return normalizeAccountQueryToken(lastToken);
}

export function shouldTraceAccountQuery(linePrefix: string, tokenText: string): boolean {
	return /(?:^|\s)[AEIL](?::|：)/i.test(linePrefix) || /^[AEIL](?::|：)/i.test(tokenText);
}

function getCurrentWhitespaceToken(linePrefix: string): string {
	const normalized = linePrefix.replace(/：/g, ':');
	const currentToken = normalized.match(/(?:^|\s)(\S*)$/)?.[1] ?? '';
	return currentToken.trim();
}

function isNumericInputToken(token: string): boolean {
	if (!token) return false;
	return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(token);
}

export function shouldSuppressCurrencyForCurrentToken(linePrefix: string): boolean {
	const currentToken = getCurrentWhitespaceToken(linePrefix);
	return isNumericInputToken(currentToken);
}
