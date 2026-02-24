import type { Logger } from '@bean-lsp/shared/logger';
import type { Position } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type Parser from 'web-tree-sitter';

export type ReparseContext = {
	placeholderNode: Parser.SyntaxNode;
	ancestors: Map<string, Parser.SyntaxNode>;
};

export type PlaceholderKind = 'account' | 'tag' | 'link' | 'currency' | 'meta';

function findNamedAncestor(node: Parser.SyntaxNode | null, type: string): Parser.SyntaxNode | null {
	let cur: Parser.SyntaxNode | null = node;
	while (cur) {
		if (cur.isNamed() && cur.type === type) return cur;
		cur = cur.parent;
	}
	return null;
}

function computeTokenRange(fullText: string, offset: number, kind: PlaceholderKind): { start: number; end: number } {
	let start = offset;
	let end = offset;

	const isWhitespace = (ch: string) => /\s/.test(ch);
	const stopChars = new Set(['#', '^', '@', '"', "'", '(', ')', '[', ']', '{', '}', ',', ';']);
	const isStopChar = (ch: string) => stopChars.has(ch) || isWhitespace(ch);

	const isAccountChar = (ch: string) => (/[A-Za-z0-9]/.test(ch) || [':', '_', '-', '/', '.'].includes(ch));
	const isTagLinkChar = (ch: string) => (/[A-Za-z0-9]/.test(ch) || ch === '_' || ch === '-');
	const isCurrencyChar = (ch: string) => /[A-Za-z]/.test(ch);
	const isMetaKeyChar = (ch: string) => (/[A-Za-z0-9]/.test(ch) || ch === '_' || ch === '-');

	const isTokenChar = (ch: string) => {
		switch (kind) {
			case 'tag':
			case 'link':
				return isTagLinkChar(ch);
			case 'currency':
				return isCurrencyChar(ch);
			case 'meta':
				return isMetaKeyChar(ch);
			default:
				return isAccountChar(ch);
		}
	};

	while (start > 0) {
		const ch = fullText.charAt(start - 1);
		if (isStopChar(ch)) break;
		if ((kind === 'tag' || kind === 'link') && (ch === '#' || ch === '^')) break;
		if (!isTokenChar(ch)) break;
		start--;
	}

	while (end < fullText.length) {
		const ch = fullText.charAt(end);
		if (isStopChar(ch)) break;
		if (kind === 'meta' && (ch === ':' || ch === '"')) break;
		if (!isTokenChar(ch)) break;
		end++;
	}

	return { start, end };
}

function normalizePlaceholder(fullText: string, start: number, placeholder: string): string {
	let text = placeholder;
	if (start > 0) {
		const prev = fullText.charAt(start - 1);
		if ((prev === '#' || prev === '^') && text.startsWith(prev)) {
			text = text.slice(1);
		}
	}
	if (text.startsWith(' ') && start > 0 && /\s/.test(fullText.charAt(start - 1))) {
		text = text.slice(1);
	}
	return text;
}

export async function reparseWithPlaceholder(
	logger: Pick<Logger, 'debug'>,
	document: TextDocument,
	position: Position,
	placeholder: string,
	kind: PlaceholderKind,
	ancestorTypes?: string[],
): Promise<ReparseContext | null> {
	let vt: Parser.Tree | null = null;
	try {
		const fullText = document.getText();
		const offset = document.offsetAt(position);
		const { start, end } = computeTokenRange(fullText, offset, kind);
		const normalized = normalizePlaceholder(fullText, start, placeholder);
		const virtualText = fullText.slice(0, start) + normalized + fullText.slice(end);
		const { getParser } = await import('@bean-lsp/shared/parser');
		const parser = await getParser();
		vt = parser.parse(virtualText);
		const phNode = vt.rootNode.descendantForIndex(start, start + normalized.length);
		if (!phNode) return null;
		const hasError = vt.rootNode.hasError();
		if (hasError && phNode.id === vt.rootNode.id) return null;

		if (hasError) {
			let cur: Parser.SyntaxNode | null = phNode;
			while (cur) {
				if (cur.type === 'ERROR') return null;
				if (typeof cur.isMissing === 'function' && cur.isMissing()) return null;
				cur = cur.parent;
			}
		}

		const ancestors = new Map<string, Parser.SyntaxNode>();
		if (ancestorTypes && ancestorTypes.length > 0) {
			for (const type of ancestorTypes) {
				const ancestor = findNamedAncestor(phNode, type);
				if (!ancestor) return null;
				ancestors.set(type, ancestor);
			}
		} else {
			let cur: Parser.SyntaxNode | null = phNode;
			while (cur) {
				if (cur.isNamed() && cur.type) ancestors.set(cur.type, cur);
				cur = cur.parent;
			}
		}

		return { placeholderNode: phNode, ancestors };
	} catch (e) {
		logger.debug(`Placeholder reparse failed: ${e}`);
		return null;
	} finally {
		if (vt) {
			try {
				vt.delete();
			} catch {
				// ignore
			}
		}
	}
}
