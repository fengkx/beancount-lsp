import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from 'web-tree-sitter';

const mocks = vi.hoisted(() => ({
	getParser: vi.fn(),
}));

vi.mock('@bean-lsp/shared', () => ({
	getParser: mocks.getParser,
	Logger: class {
		debug() {}
		error() {}
	},
}));

import type { TextDocumentChange2 } from '../common/document-store';
import { type ParseTreeLease, Trees } from '../common/trees';

beforeAll(async () => {
	await Parser.init({
		wasmBinary: readFileSync(
			fileURLToPath(new URL('../../node_modules/web-tree-sitter/tree-sitter.wasm', import.meta.url)),
		),
	});
	const language = await Parser.Language.load(
		fileURLToPath(new URL('../../../tree-sitter-beancount/tree-sitter-beancount.wasm', import.meta.url)),
	);
	const parser = new Parser();
	parser.setLanguage(language);
	mocks.getParser.mockResolvedValue(parser);
});

function createStore() {
	let listener: ((event: TextDocumentChange2) => void) | undefined;
	return {
		store: {
			onDidChangeContent2: (next: (event: TextDocumentChange2) => void) => {
				listener = next;
				return { dispose() {} };
			},
		},
		fire: (event: TextDocumentChange2) => listener?.(event),
	};
}

async function acquire(trees: Trees, document: TextDocument): Promise<ParseTreeLease> {
	const lease = await trees.acquireParseTree(document);
	expect(lease).toBeDefined();
	return lease!;
}

describe('Trees real parser lifecycle', () => {
	it('keeps nodes readable across concurrent reparses until their lease is released', async () => {
		const { store, fire } = createStore();
		const trees = new Trees(store as never);
		let document = TextDocument.create(
			'file:///lifecycle.bean',
			'beancount',
			1,
			'2000-01-01 open Assets:Cash USD',
		);
		let lease = await acquire(trees, document);

		for (let version = 2; version <= 250; version++) {
			const previousDocument = document;
			const staleNode = lease.tree.rootNode;
			const suffix = `\n; edit ${version}`;
			document = TextDocument.create(
				previousDocument.uri,
				'beancount',
				version,
				previousDocument.getText() + suffix,
			);
			const fullContent = version % 11 === 0;
			fire({
				document,
				fullContent,
				changes: fullContent
					? []
					: [{
						range: {
							start: previousDocument.positionAt(previousDocument.getText().length),
							end: previousDocument.positionAt(previousDocument.getText().length),
						},
						rangeOffset: previousDocument.getText().length,
						rangeLength: 0,
						text: suffix,
					}],
			});

			const [nextLease, parsedText] = await Promise.all([
				acquire(trees, document),
				trees.withParseTree(document, async tree => {
					await Promise.resolve();
					return tree.rootNode.text;
				}),
			]);

			expect(staleNode.text).toBe(previousDocument.getText());
			expect(parsedText).toBe(document.getText());
			lease.dispose();
			lease = nextLease;
		}

		const finalNode = lease.tree.rootNode;
		trees.dispose();
		expect(finalNode.text).toBe(document.getText());
		lease.dispose();
	});
});
