import mm from 'micromatch';
import { difference, intersection } from 'mnemonist/set';
import { Nominal } from 'nominal-types';
import { CancellationTokenSource, DocumentUri } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { isInteresting, parallel, StopWatch } from '../common';
import { DocumentStore } from '../document-store';
import { SymbolInfoStorage } from '../startServer';
import { Trees } from '../trees';
import { getAccountsDefinition, getAccountsUsage, SymbolInfo } from './references';

import { URI, Utils as UriUtils } from 'vscode-uri';
import { TreeQuery } from '../language';

type SNText = Nominal<'SyntaxNodeText', string>;
// type DocUri = Nominal<'DocUri', DocumentUri>

class Queue {
	private readonly _queue = new Set<string>();

	enqueue(uri: string): void {
		if (isInteresting(uri) && !this._queue.has(uri)) {
			this._queue.add(uri);
		}
	}

	dequeue(uri: string): void {
		this._queue.delete(uri);
	}

	consume(n: number | undefined, filter: (uri: string) => boolean): string[] {
		if (n === undefined) {
			n = this._queue.size;
		}
		const result: string[] = [];
		for (const uri of this._queue) {
			if (!filter(uri)) {
				continue;
			}
			this._queue.delete(uri);
			if (result.push(uri) >= n) {
				break;
			}
		}
		return result;
	}
}

export class SymbolIndex {
	constructor(
		private readonly _documents: DocumentStore,
		private readonly _trees: Trees,
		private readonly _symbolInfoStorage: SymbolInfoStorage,
	) {}

	private readonly _syncQueue = new Queue();
	private readonly _asyncQueue = new Queue();
	// private readonly _suffixFilter = new SuffixFilter();

	addFile(uri: string): void {
		this._syncQueue.enqueue(uri);
		this._asyncQueue.dequeue(uri);
	}

	removeFile(uri: string): void {
		this._syncQueue.dequeue(uri);
		this._asyncQueue.dequeue(uri);
		// this.index.delete(uri);
	}

	async consume() {
		const uris = this._syncQueue.consume(50, () => {
			return true;
		});

		await Promise.all(uris.map((uri) => this._createIndexTask(uri)()));
	}
	public async update(): Promise<void> {
		await this._currentUpdate;
		const uris = this._syncQueue.consume(undefined, uri => true);
		this._currentUpdate = this._doUpdate(uris, false);
		return this._currentUpdate;
	}

	private _currentUpdate: Promise<void> | undefined;

	public async initFiles(_uris: string[]) {
		const uris = new Set(_uris);
		const sw = new StopWatch();
		console.log(`[index] initializing index for ${uris.size} files.`);

		const all = await this._symbolInfoStorage.findAsync({});
		const urisInStore = new Set(all.map(info => info._uri));

		const urisNotSeen = difference(urisInStore, uris);
		const newUris = difference(uris, urisInStore);
		const urisNeedAsyncUpdate = intersection(uris, urisInStore);

		urisNeedAsyncUpdate.forEach((uri) => {
			this._asyncQueue.enqueue(uri);
		});

		for (const uri of newUris) {
			this.addFile(uri);
		}

		this._symbolInfoStorage.remove({ _uri: { $in: Array.from(urisNotSeen) } }, { multi: true });
		console.log(
			`[index] added FROM CACHE ${all.length} files ${sw.elapsed()}ms, all need revalidation, ${uris.size} files are NEW, ${urisNotSeen.size} where OBSOLETE`,
		);
	}

	public async unleashFiles(suffixes: string[]) {
		// this._suffixFilter.update(suffixes);

		await this.update();

		// async update all files that were taken from cache
		const asyncUpdate = async () => {
			const uris = this._asyncQueue.consume(70, uri => true);
			if (uris.length === 0) {
				return;
			}
			const t1 = performance.now();
			await this._doUpdate(uris, true);
			setTimeout(() => asyncUpdate(), (performance.now() - t1) * 4);
		};
		asyncUpdate();
	}

	private async _doUpdate(uris: string[], async: boolean): Promise<void> {
		if (uris.length !== 0) {
			// schedule a new task to update the cache for changed uris
			const sw = new StopWatch();
			const tasks = uris.map(this._createIndexTask, this);
			const stats = await parallel(tasks, 50, new CancellationTokenSource().token);

			let totalRetrieve = 0;
			let totalIndex = 0;
			for (const stat of stats) {
				totalRetrieve += stat.durationRetrieve;
				totalIndex += stat.durationIndex;
			}

			console.log(
				`[index] (${async ? 'async' : 'sync'}) added ${uris.length} files ${sw.elapsed()}ms (retrieval: ${
					Math.round(totalRetrieve)
				}ms, indexing: ${Math.round(totalIndex)}ms) (files: ${uris.map(String)})`,
			);
		}
	}

	private _createIndexTask(uri: string): () => Promise<{ durationRetrieve: number; durationIndex: number }> {
		return async () => {
			console.log(`Building Index ${uri}`);
			// fetch document
			const _t1Retrieve = performance.now();
			const document = await this._documents.retrieve(uri);
			const durationRetrieve = performance.now() - _t1Retrieve;

			// remove current data
			await this._symbolInfoStorage.removeAsync({ _uri: uri }, { multi: true });

			// update index
			const _t1Index = performance.now();
			try {
				await this._doIndex(document);
			} catch (e: unknown) {
				console.log(`FAILED to index ${uri}, ${e}`);
			}
			const durationIndex = performance.now() - _t1Index;

			return { durationRetrieve, durationIndex };
		};
	}

	private async _doIndex(document: TextDocument) {
		const [accountUsages, accountDefinitions] = await Promise.all(
			[
				getAccountsUsage(document, this._trees),
				getAccountsDefinition(document, this._trees),
			],
		);

		await this._symbolInfoStorage.removeAsync({ _uri: document.uri }, { multi: true });
		await Promise.all([
			this._symbolInfoStorage.insertAsync(accountUsages),
			this._symbolInfoStorage.insertAsync(accountDefinitions),
		]);

		const tree = await this._trees.getParseTree(document);
		if (tree) {
			const captures = await TreeQuery.captures('(include (string) @path)', tree.rootNode);
			const includePatterns = captures.map(c => {
				const text = c.node.text;
				const stripedQuotationMark = text.replace(/^"/, '').replace(/"$/, '');
				const u = UriUtils.joinPath(UriUtils.dirname(URI.parse(document.uri)), stripedQuotationMark);
				return u.path;
			});
			let hasNew = false;
			const beanFiles = this._documents.beanFiles;
			includePatterns.forEach((pattern) => {
				// pattern = escapeRegExp(pattern)
				const list = beanFiles.map(s => URI.parse(s).path);
				const matched = mm.match(list, pattern);
				matched.map(p => URI.file(p).toString()).forEach(uri => {
					hasNew = true;
					this.addFile(uri);
				});
			});

			if (hasNew) {
				setTimeout(() => {
					this.unleashFiles([]);
				}, 10);
			}
		}
	}

	public async getAccountDefinitions() {
		const accountDefinitions = this._symbolInfoStorage.findAsync({ _symType: 'account_definition' });
		return accountDefinitions;
	}
}
