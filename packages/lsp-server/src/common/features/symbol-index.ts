import mm from 'micromatch';
import { difference, intersection } from 'mnemonist/set';
import { CancellationTokenSource } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { isInteresting, parallel, StopWatch } from '../common';
import { DocumentStore } from '../document-store';
import { SymbolInfoStorage } from '../startServer';
import { Trees } from '../trees';
import {
	getAccountsDefinition,
	getAccountsUsage,
	getCommodities,
	getCurrencyDefinitions,
	getNarrations,
	getPayees,
	getTags,
	SymbolInfo,
} from './references';

import { Logger } from '@bean-lsp/shared';
import { URI, Utils as UriUtils } from 'vscode-uri';
import { TreeQuery } from '../language';
import { SwrCache, SwrOptions } from '../utils/swr';

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
	private logger = new Logger('index');

	constructor(
		private readonly _documents: DocumentStore,
		private readonly _trees: Trees,
		private readonly _symbolInfoStorage: SymbolInfoStorage,
	) {
		// Initialize SWR caches
		this._payeesCache = new SwrCache(() => this._fetchPayees(), 'index.payees');
		this._narrationsCache = new SwrCache(() => this._fetchNarrations(), 'index.narrations');
	}

	private readonly _syncQueue = new Queue();
	private readonly _asyncQueue = new Queue();
	// private readonly _suffixFilter = new SuffixFilter();

	// SWR cache instances
	private readonly _payeesCache: SwrCache<string[]>;
	private readonly _narrationsCache: SwrCache<string[]>;

	addFile(uri: string): void {
		this._syncQueue.enqueue(uri);
		this._asyncQueue.dequeue(uri);
	}

	removeFile(uri: string): void {
		this._syncQueue.dequeue(uri);
		this._asyncQueue.dequeue(uri);
		// this.index.delete(uri);
	}

	async consume(): Promise<void> {
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

	public async initFiles(_uris: string[]): Promise<void> {
		const uris = new Set(_uris);
		const sw = new StopWatch();
		this.logger.debug(`[index] initializing index for ${uris.size} files.`);

		const all = await this._symbolInfoStorage.findAsync({});
		const urisInStore = new Set(all.map((info: { _uri: string }) => info._uri));

		const urisNotSeen = difference(urisInStore, uris);
		const newUris = difference(uris, urisInStore);
		const urisNeedAsyncUpdate = intersection(uris, urisInStore);

		urisNeedAsyncUpdate.forEach((uri: string) => {
			this._asyncQueue.enqueue(uri);
		});

		for (const uri of newUris) {
			this.addFile(uri);
		}

		this._symbolInfoStorage.remove({ _uri: { $in: Array.from(urisNotSeen) } }, { multi: true });
		this.logger.debug(
			`[index] added FROM CACHE ${all.length} files ${sw.elapsed()}ms, all need revalidation, ${uris.size} files are NEW, ${urisNotSeen.size} where OBSOLETE`,
		);
	}

	public async unleashFiles(suffixes: string[]): Promise<void> {
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

			this.logger.debug(
				`[index] (${async ? 'async' : 'sync'}) added ${uris.length} files ${sw.elapsed()}ms (retrieval: ${
					Math.round(totalRetrieve)
				}ms, indexing: ${Math.round(totalIndex)}ms) (files: ${uris.map(String)})`,
			);
		}
	}

	private _createIndexTask(uri: string): () => Promise<{ durationRetrieve: number; durationIndex: number }> {
		return async () => {
			this.logger.debug(`Building Index ${uri}`);
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
				this.logger.error(`FAILED to index ${uri}, ${e}`);
			}
			const durationIndex = performance.now() - _t1Index;

			return { durationRetrieve, durationIndex };
		};
	}

	private async _doIndex(document: TextDocument) {
		this.logger.debug(`[index] Indexing document: ${document.uri}`);
		const [accountUsages, accountDefinitions, payees, narrations, commodities, tags] = await Promise.all(
			[
				getAccountsUsage(document, this._trees),
				getAccountsDefinition(document, this._trees),
				getPayees(document, this._trees),
				getNarrations(document, this._trees),
				getCommodities(document, this._trees),
				getTags(document, this._trees),
			],
		);

		this.logger.debug(`[index] Found symbols in ${document.uri}:
			- Account usages: ${accountUsages.length}
			- Account definitions: ${accountDefinitions.length}
			- Payees: ${payees.length}
			- Narrations: ${narrations.length}
			- Commodities: ${commodities.length}
			- Tags: ${tags.length}
		`);

		await this._symbolInfoStorage.removeAsync({ _uri: document.uri }, { multi: true });
		await Promise.all([
			this._symbolInfoStorage.insertAsync(accountUsages),
			this._symbolInfoStorage.insertAsync(accountDefinitions),
			this._symbolInfoStorage.insertAsync(payees),
			this._symbolInfoStorage.insertAsync(narrations),
			this._symbolInfoStorage.insertAsync(commodities),
			this._symbolInfoStorage.insertAsync(tags),
		]);

		const tree = await this._trees.getParseTree(document);
		if (tree) {
			const captures = await TreeQuery.captures('(include (string) @path)', tree.rootNode);
			const includePatterns = captures.map((c: { node: { text: string } }) => {
				const text = c.node.text;
				const stripedQuotationMark = text.replace(/^"/, '').replace(/"$/, '');
				const u = UriUtils.joinPath(UriUtils.dirname(URI.parse(document.uri)), stripedQuotationMark);
				return u.path;
			});
			let hasNew = false;
			const beanFiles = this._documents.beanFiles;
			this.logger.debug(`[index] Found ${beanFiles.length} bean files`);
			includePatterns.forEach((pattern: string) => {
				const list = beanFiles; // .map(s => URI.parse(s).path);
				const matched = mm.match(list, pattern, { contains: true });
				matched.map((p: string) => p).forEach((uri: string) => {
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

		// Add currency definitions
		const currencyDefinitions = await getCurrencyDefinitions(document, this._trees);
		await Promise.all(
			currencyDefinitions.map(async (d) => {
				await this._symbolInfoStorage.insertAsync(d);
			}),
		);
	}

	public async getAccountDefinitions(): Promise<import('@seald-io/nedb').Document<SymbolInfo[]>> {
		this.logger.debug('[index] Getting account definitions');
		const accountDefinitions = this._symbolInfoStorage.findAsync({ _symType: 'account_definition' });
		accountDefinitions.then(defs => this.logger.debug(`[index] Found ${defs.length} account definitions`));
		return accountDefinitions;
	}

	public async getCommodityDefinitions(): Promise<import('@seald-io/nedb').Document<SymbolInfo[]>> {
		this.logger.debug('[index] Getting commodity definitions');
		const commodityDefinitions = this._symbolInfoStorage.findAsync({ _symType: 'currency_definition' });
		commodityDefinitions.then(defs => this.logger.debug(`[index] Found ${defs.length} commodity definitions`));
		return commodityDefinitions;
	}

	/**
	 * Gets all payees with optional SWR caching
	 *
	 * @param swr Whether to use SWR caching
	 * @param options SWR caching options including:
	 *   - maxAge: Maximum age of cached data in milliseconds (default: 10000ms)
	 *   - waitTime: Maximum time to wait for fresh data before returning cached data (default: 100ms)
	 *   - debug: Whether to log detailed caching information (default: false)
	 * @returns List of unique payee names
	 *
	 * @example
	 * // Get payees with default SWR behavior (wait up to 100ms for fresh data)
	 * const payees = await symbolIndex.getPayees(true);
	 *
	 * @example
	 * // Get payees with custom wait time of 200ms
	 * const payees = await symbolIndex.getPayees(true, { waitTime: 200 });
	 *
	 * @example
	 * // Get payees with immediate cache return (no waiting)
	 * const payees = await symbolIndex.getPayees(true, { waitTime: 0 });
	 */
	public async getPayees(swr = false, options?: SwrOptions): Promise<string[]> {
		this.logger.debug('[index] Getting payees');
		return this._payeesCache.get(swr, options);
	}

	private async _fetchPayees(): Promise<string[]> {
		const payees = await this._symbolInfoStorage.findAsync({ _symType: 'payee' }) as SymbolInfo[];
		const uniquePayees = [...new Set(payees.map(p => p.name))];
		this.logger.debug(`[index] Found ${payees.length} payees (${uniquePayees.length} unique)`);
		return uniquePayees;
	}

	public async getCommodities(): Promise<string[]> {
		this.logger.debug('[index] Getting commodities');
		const commodities = await this._symbolInfoStorage.findAsync({ _symType: 'commodity' }) as SymbolInfo[];
		const uniqueCommodities = [...new Set(commodities.map(c => c.name))];
		this.logger.debug(`[index] Found ${commodities.length} commodities (${uniqueCommodities.length} unique)`);
		return uniqueCommodities;
	}

	public async getTags(): Promise<string[]> {
		this.logger.debug('[index] Getting tags');
		const tags = await this._symbolInfoStorage.findAsync({ _symType: 'tag' }) as SymbolInfo[];
		const uniqueTags = [...new Set(tags.map(t => t.name))];
		this.logger.debug(`[index] Found ${tags.length} tags (${uniqueTags.length} unique)`);
		return uniqueTags;
	}

	/**
	 * Gets all narrations with optional SWR caching
	 *
	 * @param swr Whether to use SWR caching
	 * @param options SWR caching options including:
	 *   - maxAge: Maximum age of cached data in milliseconds (default: 10000ms)
	 *   - waitTime: Maximum time to wait for fresh data before returning cached data (default: 100ms)
	 *   - debug: Whether to log detailed caching information (default: false)
	 * @returns List of unique narration strings
	 *
	 * @example
	 * // Get narrations with default SWR behavior (wait up to 100ms for fresh data)
	 * const narrations = await symbolIndex.getNarrations(true);
	 *
	 * @example
	 * // Get narrations with custom wait time of 200ms
	 * const narrations = await symbolIndex.getNarrations(true, { waitTime: 200 });
	 *
	 * @example
	 * // Get narrations with immediate cache return (no waiting)
	 * const narrations = await symbolIndex.getNarrations(true, { waitTime: 0 });
	 */
	public async getNarrations(swr = false, options?: SwrOptions): Promise<string[]> {
		this.logger.debug('[index] Getting narrations');
		return this._narrationsCache.get(swr, options);
	}

	private async _fetchNarrations(): Promise<string[]> {
		const narrations = await this._symbolInfoStorage.findAsync({ _symType: 'narration' }) as SymbolInfo[];
		const uniqueNarrations = [...new Set(narrations.map(n => n.name))];
		this.logger.debug(`[index] Found ${narrations.length} narrations (${uniqueNarrations.length} unique)`);
		return uniqueNarrations;
	}

	/**
	 * Gets the usage count for each account across all documents
	 *
	 * @returns A Map of account names to their usage counts
	 */
	public async getAccountUsageCounts(): Promise<Map<string, number>> {
		this.logger.debug('[index] Getting account usage counts');
		const accountUsages = await this._symbolInfoStorage.findAsync({ _symType: 'account_usage' }) as SymbolInfo[];

		// Count occurrences of each account
		const usageCounts = new Map<string, number>();
		for (const usage of accountUsages) {
			const count = usageCounts.get(usage.name) || 0;
			usageCounts.set(usage.name, count + 1);
		}

		this.logger.debug(`[index] Found usage counts for ${usageCounts.size} unique accounts`);
		return usageCounts;
	}
}
