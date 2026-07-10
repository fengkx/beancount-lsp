import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Connection, DidChangeTextDocumentParams, DidOpenTextDocumentParams } from 'vscode-languageserver';

vi.mock('@bean-lsp/shared', () => ({
	CustomMessages: {
		FileRead: 'beanLsp/fileRead',
		ListBeanFile: 'beanLsp/listBeanFile',
	},
	LANGUAGE_ID: 'beancount',
	Logger: class {
		debug() {}
		warn() {}
		info() {}
	},
}));

import { DocumentStore } from '../../common/document-store';

describe('DocumentStore', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('debounces content changes independently for each document', async () => {
		vi.useFakeTimers();

		let didOpen: ((params: DidOpenTextDocumentParams) => void) | undefined;
		let didChange: ((params: DidChangeTextDocumentParams) => void) | undefined;
		const disposable = { dispose() {} };
		const connection = {
			onDidOpenTextDocument(handler: (params: DidOpenTextDocumentParams) => void) {
				didOpen = handler;
				return disposable;
			},
			onDidChangeTextDocument(handler: (params: DidChangeTextDocumentParams) => void) {
				didChange = handler;
				return disposable;
			},
			onDidCloseTextDocument: () => disposable,
			onWillSaveTextDocument: () => disposable,
			onWillSaveTextDocumentWaitUntil: () => disposable,
			onDidSaveTextDocument: () => disposable,
		} as unknown as Connection;

		const store = new DocumentStore(connection);
		const validatedUris: string[] = [];
		const subscription = store.onDidChangeContentDebounced(
			event => {
				validatedUris.push(event.document.uri);
			},
			{ minDelayMs: 10, maxDelayMs: 10, multiplier: 1 },
		);

		const firstUri = 'file:///first.bean';
		const secondUri = 'file:///second.bean';
		didOpen?.({
			textDocument: { uri: firstUri, languageId: 'beancount', version: 1, text: '' },
		});
		didOpen?.({
			textDocument: { uri: secondUri, languageId: 'beancount', version: 1, text: '' },
		});
		await vi.advanceTimersByTimeAsync(10);
		validatedUris.length = 0;

		didChange?.({
			textDocument: { uri: firstUri, version: 2 },
			contentChanges: [{
				range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
				text: 'first',
			}],
		});
		didChange?.({
			textDocument: { uri: secondUri, version: 2 },
			contentChanges: [{
				range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
				text: 'second',
			}],
		});

		await vi.advanceTimersByTimeAsync(10);

		expect(validatedUris).toHaveLength(2);
		expect(new Set(validatedUris)).toEqual(new Set([firstUri, secondUri]));
		subscription.dispose();
	});

	it('publishes the updated document for whole-content replacements', () => {
		let didOpen: ((params: DidOpenTextDocumentParams) => void) | undefined;
		let didChange: ((params: DidChangeTextDocumentParams) => void) | undefined;
		const disposable = { dispose() {} };
		const connection = {
			onDidOpenTextDocument(handler: (params: DidOpenTextDocumentParams) => void) {
				didOpen = handler;
				return disposable;
			},
			onDidChangeTextDocument(handler: (params: DidChangeTextDocumentParams) => void) {
				didChange = handler;
				return disposable;
			},
			onDidCloseTextDocument: () => disposable,
			onWillSaveTextDocument: () => disposable,
			onWillSaveTextDocumentWaitUntil: () => disposable,
			onDidSaveTextDocument: () => disposable,
		} as unknown as Connection;
		const store = new DocumentStore(connection);
		const events: Array<{ text: string; fullContent: boolean }> = [];
		store.onDidChangeContent2(event => {
			events.push({ text: event.document.getText(), fullContent: event.fullContent });
		});
		const uri = 'file:///whole.bean';
		didOpen?.({ textDocument: { uri, languageId: 'beancount', version: 1, text: 'before' } });
		didChange?.({
			textDocument: { uri, version: 2 },
			contentChanges: [{ text: 'after' }],
		});

		expect(events).toEqual([{ text: 'after', fullContent: true }]);
	});
});
