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

import { Trees } from '../common/trees';

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

function createHarness() {
	let listener: ChangeListener | undefined;
	const documents = {
		onDidChangeContent2: (next: ChangeListener) => {
			listener = next;
			return { dispose() {} };
		},
	};
	const firstTree = { edit: vi.fn(), delete: vi.fn() };
	const nextTree = { edit: vi.fn(), delete: vi.fn() };
	const parser = {
		parse: vi.fn()
			.mockReturnValueOnce(firstTree)
			.mockReturnValueOnce(nextTree),
	};
	mocks.getParser.mockResolvedValue(parser);

	return {
		trees: new Trees(documents as never),
		fire: (event: Parameters<ChangeListener>[0]) => listener?.(event),
		firstTree,
		nextTree,
		parser,
	};
}

function document(version: number, text: string): TextDocument {
	return TextDocument.create('file:///test.bean', 'beancount', version, text);
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

	it('applies queued single-change notifications incrementally in order', async () => {
		const harness = createHarness();
		await harness.trees.getParseTree(document(1, 'a'));
		const firstEdit = insertChange(1, 'b');
		const secondEdit = insertChange(2, 'c');

		harness.fire({ document: document(2, 'ab'), fullContent: false, changes: [firstEdit] });
		harness.fire({ document: document(3, 'abc'), fullContent: false, changes: [secondEdit] });
		const result = await harness.trees.getParseTree(document(3, 'abc'));

		expect(harness.firstTree.edit.mock.calls.map(([edit]) => edit.startIndex)).toEqual([1, 2]);
		expect(harness.parser.parse).toHaveBeenLastCalledWith('abc', harness.firstTree);
		expect(harness.firstTree.delete).toHaveBeenCalledOnce();
		expect(result).toBe(harness.nextTree);
	});

	it('falls back to a full parse for a multi-change notification', async () => {
		const harness = createHarness();
		await harness.trees.getParseTree(document(1, 'ab'));
		const firstEdit = insertChange(0, 'x');
		const secondEdit = insertChange(1, 'y');

		harness.fire({
			document: document(2, 'xy'),
			fullContent: false,
			changes: [firstEdit, secondEdit],
		});
		await harness.trees.getParseTree(document(2, 'xy'));

		expect(harness.firstTree.edit).not.toHaveBeenCalled();
		expect(harness.parser.parse).toHaveBeenLastCalledWith('xy');
	});
});
