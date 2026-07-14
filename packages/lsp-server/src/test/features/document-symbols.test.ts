import { describe, expect, it, vi } from 'vitest';
import type { DocumentSymbol } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		warn() {}
		error() {}
	},
}));

import { DocumentSymbolsFeature } from '../../common/features/document-symbols';

type MockNode = {
	type: string;
	text: string;
	startPosition: { row: number; column: number };
	endPosition: { row: number; column: number };
	namedChildren: MockNode[];
	namedChildCount: number;
	childForFieldName: (name: string) => MockNode | null;
	namedChild: (index: number) => MockNode | null;
};

function createLeaf(type: string, text: string, row: number, column: number): MockNode {
	return {
		type,
		text,
		startPosition: { row, column },
		endPosition: { row, column: column + text.length },
		namedChildren: [],
		namedChildCount: 0,
		childForFieldName: () => null,
		namedChild: () => null,
	};
}

function createDirective(
	type: string,
	row: number,
	fields: Record<string, MockNode>,
	namedChildren: MockNode[] = [],
): MockNode {
	return {
		type,
		text: type,
		startPosition: { row, column: 0 },
		endPosition: { row, column: 80 },
		namedChildren,
		namedChildCount: namedChildren.length,
		childForFieldName: name => fields[name] ?? null,
		namedChild: index => namedChildren[index] ?? null,
	};
}

async function getDocumentSymbols(captures: Record<string, MockNode[]>): Promise<DocumentSymbol[]> {
	const document = TextDocument.create('file:///symbols.bean', 'beancount', 1, '');
	const trees = {
		getParseTree: vi.fn().mockResolvedValue({
			rootNode: { namedChildren: Object.values(captures).flat() },
		}),
	};
	const feature = new DocumentSymbolsFeature({} as never, trees as never);
	const featureWithPrivateMethod = feature as unknown as {
		getDocumentSymbols(document: TextDocument): Promise<DocumentSymbol[]>;
	};
	return featureWithPrivateMethod.getDocumentSymbols(document);
}

function collectNames(symbols: DocumentSymbol[]): string[] {
	return symbols.flatMap(symbol => [symbol.name, ...collectNames(symbol.children ?? [])]);
}

describe('DocumentSymbolsFeature', () => {
	it('omits the empty description symbol from an event', async () => {
		const date = createLeaf('date', '2026-07-07', 72, 0);
		const type = createLeaf('string', '"信用卡激活"', 72, 17);
		const desc = createLeaf('string', '""', 72, 25);
		const event = createDirective('event', 72, { date, type, desc });

		const symbols = await getDocumentSymbols({ event: [event] });

		expect(symbols).toHaveLength(1);
		expect(symbols[0]).toMatchObject({
			name: '2026-07-07 Event 信用卡激活',
			children: [
				{ name: 'Date' },
				{ name: '信用卡激活' },
			],
		});
		expect(collectNames(symbols).every(name => name.trim().length > 0)).toBe(true);
	});

	it('never returns empty names for directives with empty strings', async () => {
		const noteDate = createLeaf('date', '2026-07-07', 0, 0);
		const noteAccount = createLeaf('account', 'Assets:Cash', 0, 16);
		const noteText = createLeaf('string', '""', 0, 28);
		const note = createDirective('note', 0, {
			date: noteDate,
			account: noteAccount,
			note: noteText,
		});

		const queryDate = createLeaf('date', '2026-07-08', 1, 0);
		const queryName = createLeaf('string', '""', 1, 17);
		const queryText = createLeaf('string', '""', 1, 20);
		const query = createDirective('query', 1, {
			date: queryDate,
			name: queryName,
			query: queryText,
		});

		const documentDate = createLeaf('date', '2026-07-09', 2, 0);
		const documentAccount = createLeaf('account', 'Assets:Cash', 2, 20);
		const filename = createLeaf('filename', '""', 2, 32);
		const document = createDirective('document', 2, {
			date: documentDate,
			account: documentAccount,
			filename,
		});

		const customDate = createLeaf('date', '2026-07-10', 3, 0);
		const customName = createLeaf('string', '""', 3, 18);
		const custom = createDirective('custom', 3, {
			date: customDate,
			name: customName,
		});

		const filePath = createLeaf('string', '""', 4, 8);
		const include = createDirective('include', 4, {}, [filePath]);

		const symbols = await getDocumentSymbols({
			document: [document],
			note: [note],
			query: [query],
			custom: [custom],
			include: [include],
		});

		expect(symbols.map(symbol => symbol.name)).toEqual([
			'2026-07-09 Doc Assets:Cash',
			'2026-07-07 Note Assets:Cash',
			'2026-07-08 Query',
			'2026-07-10 Custom',
			'Include',
		]);
		expect(collectNames(symbols).every(name => name.trim().length > 0)).toBe(true);
	});
});
