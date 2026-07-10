import { describe, expect, it } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { SourceSnapshotService } from '../../common/ledger/source-snapshot-service';

class SnapshotDocumentStore {
	private readonly docs = new Map<string, TextDocument>();
	private readonly open = new Set<string>();

	set(uri: string, text: string, isOpen = false): void {
		this.docs.set(uri, TextDocument.create(uri, 'beancount', 1, text));
		if (isOpen) this.open.add(uri);
	}

	retrieve(uri: string): Promise<TextDocument> {
		const document = this.docs.get(uri);
		if (!document) return Promise.reject(new Error(`missing ${uri}`));
		return Promise.resolve(document);
	}

	isOpen(uri: string): boolean {
		return this.open.has(uri);
	}
}

describe('SourceSnapshotService', () => {
	it('prefers open buffers and computes the include closure', async () => {
		const root = 'file:///ledger';
		const main = `${root}/main.bean`;
		const included = `${root}/accounts.bean`;
		const unreachable = `${root}/archive.bean`;
		const documents = new SnapshotDocumentStore();
		documents.set(main, 'include "accounts.bean"\n', true);
		documents.set(included, '2000-01-01 open Assets:Cash\n');
		documents.set(unreachable, '2000-01-01 open Assets:Old\n');

		const service = new SourceSnapshotService(documents as never, root, main);
		const snapshot = await service.reset([main, included, unreachable]);

		expect(snapshot.files.get(main)?.origin).toBe('open-buffer');
		expect(snapshot.reachableUris).toEqual(new Set([main, included]));
		expect(snapshot.reachableUris.has(unreachable)).toBe(false);
	});

	it('increments revision and publishes the new editor content', async () => {
		const root = 'file:///ledger';
		const main = `${root}/main.bean`;
		const documents = new SnapshotDocumentStore();
		documents.set(main, 'option "title" "Before"\n', true);
		const service = new SourceSnapshotService(documents as never, root, main);
		await service.reset([main]);
		const revisions: number[] = [];
		service.onDidChange(change => revisions.push(change.revision));

		service.update(main, 'option "title" "After"\n', 2, 'open-buffer');

		expect(service.snapshot.files.get(main)?.text).toContain('After');
		expect(service.snapshot.revision).toBe(2);
		expect(revisions).toEqual([2]);
	});
});
