import { describe, expect, it, vi } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));

import { LedgerContextRegistry } from '../../common/ledger/context-registry';

describe('LedgerContextRegistry', () => {
	it('uses longest workspace URI prefix and keeps source contexts isolated', async () => {
		const folders = [
			{ uri: 'file:///repo', name: 'repo' },
			{ uri: 'file:///repo/nested', name: 'nested' },
		];
		let watchedHandler: ((event: { changes: never[] }) => void) | undefined;
		const connection = {
			workspace: { getWorkspaceFolders: () => Promise.resolve(folders) },
			onDidChangeWatchedFiles(handler: typeof watchedHandler) {
				watchedHandler = handler;
				return { dispose() {} };
			},
		};
		type DocumentHandler = (event: { document: TextDocument }) => void;
		const handlers: Partial<Record<'open' | 'change' | 'close', DocumentHandler>> = {};
		const files = new Map([
			['file:///repo/main.bean', ''],
			['file:///repo/nested/main.bean', ''],
		]);
		const documents = {
			refetchBeanFiles: () => Promise.resolve(),
			getMainBeanFileUriFor: (scope: string) => Promise.resolve(`${scope}/main.bean`),
			getBeanFilesFor: (scope: string) => [`${scope}/main.bean`],
			retrieve: (uri: string) => Promise.resolve(TextDocument.create(uri, 'beancount', 1, files.get(uri) ?? '')),
			isOpen: () => false,
			removeFile: () => true,
			onDidOpen: (handler: DocumentHandler) => {
				handlers.open = handler;
				return { dispose() {} };
			},
			onDidChangeContent: (handler: DocumentHandler) => {
				handlers.change = handler;
				return { dispose() {} };
			},
			onDidClose: (handler: DocumentHandler) => {
				handlers.close = handler;
				return { dispose() {} };
			},
		};

		const registry = new LedgerContextRegistry(connection as never, documents as never);
		await registry.initialize();

		expect(registry.all).toHaveLength(2);
		expect(registry.forDocument('file:///repo/nested/accounts.bean')?.workspace.uri).toBe('file:///repo/nested');
		expect(registry.forDocument('file:///repo/accounts.bean')?.workspace.uri).toBe('file:///repo');
		expect(registry.forDocument('file:///outside.bean')).toBeNull();
		expect(watchedHandler).toBeTypeOf('function');

		const mainUri = 'file:///repo/main.bean';
		const unsaved = TextDocument.create(mainUri, 'beancount', 2, 'unsaved');
		handlers.open?.({ document: unsaved });
		expect(registry.forDocument(mainUri)?.sources.snapshot.files.get(mainUri)?.text).toBe('unsaved');
		files.set(mainUri, 'disk');
		handlers.close?.({ document: unsaved });
		await vi.waitFor(() => {
			expect(registry.forDocument(mainUri)?.sources.snapshot.files.get(mainUri)?.text).toBe('disk');
		});
		registry.dispose();
	});
});
