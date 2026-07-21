import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';

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

import { ParseTreeLease, Trees } from '../common/trees';

type ChangeListener = (event: {
	document: TextDocument;
	fullContent: boolean;
	changes: Array<{
		range: { start: { line: number; character: number }; end: { line: number; character: number } };
		rangeOffset: number;
		rangeLength: number;
		text: string;
	}>;
}) => void;

function createDocuments() {
	let listener: ChangeListener | undefined;
	return {
		documents: {
			onDidChangeContent2: (next: ChangeListener) => {
				listener = next;
				return { dispose() {} };
			},
		},
		fire: (event: Parameters<ChangeListener>[0]) => listener?.(event),
	};
}

function createTree() {
	return { edit: vi.fn(), copy: vi.fn(), delete: vi.fn() };
}

function createHarness() {
	const store = createDocuments();
	const firstTree = createTree();
	const incrementalBase = createTree();
	const nextTree = createTree();
	firstTree.copy.mockReturnValue(incrementalBase);
	const parser = {
		parse: vi.fn()
			.mockReturnValueOnce(firstTree)
			.mockReturnValueOnce(nextTree),
	};
	mocks.getParser.mockResolvedValue(parser);

	return {
		trees: new Trees(store.documents as never),
		fire: store.fire,
		firstTree,
		incrementalBase,
		nextTree,
		parser,
	};
}

function document(version: number, text: string, uri = 'file:///test.bean'): TextDocument {
	return TextDocument.create(uri, 'beancount', version, text);
}

async function acquire(trees: Trees, currentDocument: TextDocument): Promise<ParseTreeLease> {
	const lease = await trees.acquireParseTree(currentDocument);
	expect(lease).toBeDefined();
	return lease!;
}

function insertChange(character: number, text: string) {
	return {
		range: {
			start: { line: 0, character },
			end: { line: 0, character },
		},
		rangeOffset: character,
		rangeLength: 0,
		text,
	};
}

describe('Trees incremental parsing', () => {
	beforeEach(() => {
		mocks.getParser.mockReset();
	});

	it('applies queued single-change notifications to a tree copy in order', async () => {
		const harness = createHarness();
		(await acquire(harness.trees, document(1, 'a'))).dispose();
		const firstEdit = insertChange(1, 'b');
		const secondEdit = insertChange(2, 'c');

		harness.fire({ document: document(2, 'ab'), fullContent: false, changes: [firstEdit] });
		harness.fire({ document: document(3, 'abc'), fullContent: false, changes: [secondEdit] });
		const lease = await acquire(harness.trees, document(3, 'abc'));

		expect(harness.firstTree.edit).not.toHaveBeenCalled();
		expect(harness.incrementalBase.edit.mock.calls.map(([edit]) => edit.startIndex)).toEqual([1, 2]);
		expect(harness.parser.parse).toHaveBeenLastCalledWith('abc', harness.incrementalBase);
		expect(harness.incrementalBase.delete).toHaveBeenCalledOnce();
		expect(harness.firstTree.delete).toHaveBeenCalledOnce();
		expect(lease.tree).toBe(harness.nextTree);
		lease.dispose();
	});

	it('falls back to a full parse for a multi-change notification', async () => {
		const harness = createHarness();
		(await acquire(harness.trees, document(1, 'ab'))).dispose();
		const firstEdit = insertChange(0, 'x');
		const secondEdit = insertChange(1, 'y');

		harness.fire({
			document: document(2, 'xy'),
			fullContent: false,
			changes: [firstEdit, secondEdit],
		});
		(await acquire(harness.trees, document(2, 'xy'))).dispose();

		expect(harness.firstTree.copy).not.toHaveBeenCalled();
		expect(harness.parser.parse).toHaveBeenLastCalledWith('xy');
	});

	it('falls back to a full parse when a changed version has no recorded edit', async () => {
		const harness = createHarness();
		(await acquire(harness.trees, document(1, 'a'))).dispose();

		(await acquire(harness.trees, document(2, 'ab'))).dispose();

		expect(harness.firstTree.copy).not.toHaveBeenCalled();
		expect(harness.parser.parse).toHaveBeenLastCalledWith('ab');
	});

	it('returns a same-version tree without requesting the WASM parser again', async () => {
		const harness = createHarness();
		const currentDocument = document(1, 'a');
		const first = await acquire(harness.trees, currentDocument);
		mocks.getParser.mockClear();

		const second = await acquire(harness.trees, currentDocument);

		expect(second.tree).toBe(first.tree);
		expect(mocks.getParser).not.toHaveBeenCalled();
		expect(harness.parser.parse).toHaveBeenCalledOnce();
		first.dispose();
		second.dispose();
	});

	it('invalidates the cached tree after a full-content replacement', async () => {
		const harness = createHarness();
		(await acquire(harness.trees, document(1, 'a'))).dispose();

		harness.fire({ document: document(2, 'replacement'), fullContent: true, changes: [] });
		(await acquire(harness.trees, document(2, 'replacement'))).dispose();

		expect(harness.firstTree.copy).not.toHaveBeenCalled();
		expect(harness.firstTree.delete).toHaveBeenCalledOnce();
		expect(harness.parser.parse).toHaveBeenLastCalledWith('replacement');
	});

	it('keeps an invalidated tree alive until its active lease is released', async () => {
		const harness = createHarness();
		const first = await acquire(harness.trees, document(1, 'a'));

		harness.fire({ document: document(2, 'replacement'), fullContent: true, changes: [] });
		expect(harness.firstTree.delete).not.toHaveBeenCalled();

		(await acquire(harness.trees, document(2, 'replacement'))).dispose();
		expect(harness.firstTree.delete).not.toHaveBeenCalled();

		first.dispose();
		expect(harness.firstTree.delete).toHaveBeenCalledOnce();
	});

	it('deduplicates concurrent parse requests for the same document', async () => {
		const harness = createHarness();
		let resolveParser!: (parser: typeof harness.parser) => void;
		mocks.getParser.mockReset();
		mocks.getParser.mockReturnValue(new Promise(resolve => resolveParser = resolve));

		const firstPending = acquire(harness.trees, document(1, 'a'));
		const secondPending = acquire(harness.trees, document(1, 'a'));
		resolveParser(harness.parser);
		const [first, second] = await Promise.all([firstPending, secondPending]);

		expect(harness.parser.parse).toHaveBeenCalledOnce();
		expect(first.tree).toBe(second.tree);
		first.dispose();
		second.dispose();
	});

	it('deletes trees evicted from the LRU cache', async () => {
		const store = createDocuments();
		const parsedTrees = Array.from({ length: 101 }, createTree);
		const parser = { parse: vi.fn((_text: string) => parsedTrees.shift()!) };
		mocks.getParser.mockResolvedValue(parser);
		const trees = new Trees(store.documents as never);
		const firstTree = parsedTrees[0]!;

		for (let i = 0; i < 101; i++) {
			(await acquire(trees, document(1, String(i), `file:///${i}.bean`))).dispose();
		}

		expect(firstTree.delete).toHaveBeenCalledOnce();
	});
});
