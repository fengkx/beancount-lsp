import mm from 'micromatch';
import { difference, intersection } from 'mnemonist/set';
import { CancellationTokenSource } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { isInteresting, parallel, StopWatch } from '../common';
import { DocumentStore } from '../document-store';
import { SymbolInfoStorage } from '../startServer';
import { Trees } from '../trees';
import {
	getAccountsClose,
	getAccountsDefinition,
	getAccountsUsage,
	getCommodities,
	getCurrencyDefinitions,
	getLinks,
	getNarrations,
	getPayees,
	getPopTags,
	getPricesDeclarations,
	getPushTags,
	getTags,
	SymbolInfo,
} from './symbol-extractors';

import { Logger } from '@bean-lsp/shared';
import { URI, Utils as UriUtils } from 'vscode-uri';
import { TreeQuery } from '../language';
import { BeancountOptionsManager, SupportedOption } from '../utils/beancount-options';
import type { HistoryContext } from '../utils/history-context';
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
	public findAsync: (query: Record<string, unknown>) => Promise<SymbolInfo[]>;

	constructor(
		private readonly _documents: DocumentStore,
		private readonly _trees: Trees,
		private readonly _symbolInfoStorage: SymbolInfoStorage,
		private readonly _optionsManager: BeancountOptionsManager,
		private readonly _historyContext: HistoryContext,
	) {
		// Initialize SWR caches
		this._payeesCache = new SwrCache(() => this._fetchPayees(), 'index.payees');
		this._narrationsCache = new SwrCache(() => this._fetchNarrations(), 'index.narrations');
		this.findAsync = this._symbolInfoStorage.findAsync.bind(this._symbolInfoStorage);
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
		this._symbolInfoStorage.remove({ _uri: uri }, { multi: true });
	}

	async consume(): Promise<void> {
		const uris = this._syncQueue.consume(50, () => {
			return true;
		});

		await Promise.all(uris.map((uri) => this._createIndexTask(uri)()));
	}
	public async update(): Promise<void> {
		await this._currentUpdate;
		const uris = this._syncQueue.consume(undefined, () => true);
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

		const newUris = difference(uris, urisInStore);
		const urisNeedAsyncUpdate = intersection(uris, urisInStore);

		urisNeedAsyncUpdate.forEach((uri: string) => {
			this._asyncQueue.enqueue(uri);
		});

		for (const uri of newUris) {
			this.addFile(uri);
		}

		const totalSymbolsInStorage = await this._symbolInfoStorage.countAsync({});
		this.logger.info(`Total symbols in storage: ${totalSymbolsInStorage}`);

		this.logger.debug(
			`[index] added FROM CACHE ${all.length} files ${sw.elapsed()}ms, all need revalidation, ${uris.size} files are NEW`,
		);
	}

	public async unleashFiles(_suffixes: string[]): Promise<void> {
		// this._suffixFilter.update(suffixes);

		await this.update();

		// async update all files that were taken from cache
		const asyncUpdate = async () => {
			const uris = this._asyncQueue.consume(70, () => true);
			if (uris.length === 0) {
				return;
			}
			const t1 = performance.now();
			await this._doUpdate(uris, true);
			setTimeout(() => asyncUpdate(), Math.max(50, (performance.now() - t1) * 4));
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
			this._symbolInfoStorage.remove({ _uri: uri }, { multi: true });

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

		// Process options directives in this document
		await this._processOptionsDirectives(document);

		const [
			accountUsages,
			accountDefinitions,
			accountCloseDertives,
			payees,
			narrations,
			commodities,
			tags,
			pushTags,
			popTags,
			pricesDeclarations,
			links,
		] = await Promise.all(
			[
				getAccountsUsage(document, this._trees),
				getAccountsDefinition(document, this._trees),
				getAccountsClose(document, this._trees),
				getPayees(document, this._trees),
				getNarrations(document, this._trees),
				getCommodities(document, this._trees),
				getTags(document, this._trees),
				getPushTags(document, this._trees),
				getPopTags(document, this._trees),
				getPricesDeclarations(document, this._trees),
				getLinks(document, this._trees),
			],
		);

		this.logger.debug(`We Found symbols in ${document.uri}:
			- Account usages: ${accountUsages.length}
			- Account definitions: ${accountDefinitions.length}
			- Account closures: ${accountCloseDertives.length}
			- Payees: ${payees.length}
			- Narrations: ${narrations.length}
			- Commodities: ${commodities.length}
			- Tags: ${tags.length}
			- Push tags: ${pushTags.length}
			- Pop tags: ${popTags.length}
			- Prices declarations: ${pricesDeclarations.length}
			- Links: ${links.length}
		`);

		this._symbolInfoStorage.remove({ _uri: document.uri }, { multi: true });
		await Promise.all([
			this._symbolInfoStorage.insertAsync(accountUsages),
			this._symbolInfoStorage.insertAsync(accountDefinitions),
			this._symbolInfoStorage.insertAsync(accountCloseDertives),
			this._symbolInfoStorage.insertAsync(payees),
			this._symbolInfoStorage.insertAsync(narrations),
			this._symbolInfoStorage.insertAsync(commodities),
			this._symbolInfoStorage.insertAsync(tags),
			this._symbolInfoStorage.insertAsync(pushTags),
			this._symbolInfoStorage.insertAsync(popTags),
			this._symbolInfoStorage.insertAsync(pricesDeclarations),
			this._symbolInfoStorage.insertAsync(links),
		]);

		const totalSymbolsInStorage = await this._symbolInfoStorage.countAsync({});
		this.logger.info(`Total symbols in storage: ${totalSymbolsInStorage}`);

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
				const list = beanFiles;
				const matched = mm.match(list, pattern, { contains: true });
				matched.map((p: string) => p).forEach((uri: string) => {
					hasNew = true;
					this.addFile(uri);
				});
			});

			await this._historyContext.extractFromDocument(document);

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

	/**
	 * Process option directives in a document and register them in the options manager
	 * @param document The document to process
	 */
	private async _processOptionsDirectives(document: TextDocument): Promise<void> {
		try {
			const tree = await this._trees.getParseTree(document);
			if (!tree) {
				this.logger.warn(`No syntax tree available for options processing: ${document.uri}`);
				return;
			}

			const optionQuery = TreeQuery.getQueryByTokenName('option');
			const optionCaptures = await optionQuery.captures(tree.rootNode);

			const options = new Map<string, string>();

			for (const capture of optionCaptures) {
				// Only process the option node itself, not its children
				if (capture.name !== 'option' || capture.node.type !== 'option') {
					continue;
				}

				const optionNode = capture.node;
				const keyNode = optionNode.childForFieldName('key');
				const valueNode = optionNode.childForFieldName('value');

				if (!keyNode || !valueNode) {
					this.logger.warn(`Invalid option directive found in ${document.uri}`);
					continue;
				}

				// Extract the key and value from the nodes (remove quotes)
				let key = document.getText({
					start: document.positionAt(keyNode.startIndex),
					end: document.positionAt(keyNode.endIndex),
				});
				let value = document.getText({
					start: document.positionAt(valueNode.startIndex),
					end: document.positionAt(valueNode.endIndex),
				});

				// Remove surrounding quotes from key and value
				key = key.replace(/^"(.*)"$/, '$1');
				value = value.replace(/^"(.*)"$/, '$1');

				options.set(key, value);
				this.logger.debug(`Found option in ${document.uri}: ${key} = ${value}`);
			}

			// Register discovered options in the options manager
			for (const [key, value] of options.entries()) {
				// @ts-expect-error intented set all options by only SupportedKeys can read
				this._optionsManager.setOption(key, value, document.uri);
			}

			if (options.size > 0) {
				this.logger.info(`Processed ${options.size} Beancount options in ${document.uri}`);
			}
		} catch (error) {
			this.logger.error(`Error processing options in ${document.uri}: ${error}`);
		}
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
	 * Gets all unique links from the index
	 */
	public async getLinks(): Promise<string[]> {
		this.logger.debug('[index] Getting links');
		const links = await this._symbolInfoStorage.findAsync({ _symType: 'link' }) as SymbolInfo[];
		const uniqueLinks = [...new Set(links.map(l => l.name))];
		this.logger.debug(`[index] Found ${links.length} links (${uniqueLinks.length} unique)`);
		return uniqueLinks;
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
		const [accountUsages] = await Promise.all([
			this._symbolInfoStorage.findAsync({ _symType: 'account_usage' }) as Promise<SymbolInfo[]>,
		]);

		// Count occurrences of each account, excluding closed accounts
		const usageCounts = new Map<string, number>();
		for (const usage of accountUsages) {
			const count = usageCounts.get(usage.name) || 0;
			usageCounts.set(usage.name, count + 1);
		}

		this.logger.debug(`[index] Found usage counts for ${usageCounts.size} unique open accounts`);
		return usageCounts;
	}

	/**
	 * Gets all closed accounts with their closing dates
	 *
	 * @returns A Map of account names to their closing dates
	 */
	public async getClosedAccounts(): Promise<Map<string, string>> {
		this.logger.debug('[index] Getting closed accounts');
		const closedAccounts = await this._symbolInfoStorage.findAsync({
			_symType: 'account_close',
		}) as SymbolInfo[];

		// Create a map of account names to their closing dates
		const accountClosingDates = new Map<string, string>();
		for (const account of closedAccounts) {
			// Only add the account if it has a date
			if (account.date) {
				accountClosingDates.set(account.name, account.date);
			}
		}

		this.logger.debug(`[index] Found ${accountClosingDates.size} closed accounts`);
		return accountClosingDates;
	}

	public async getPricesDeclarations(query: { name?: string } = {}): Promise<SymbolInfo[]> {
		this.logger.debug('[index] Getting prices declarations');
		const pricesDeclarations = await this._symbolInfoStorage.findAsync({
			_symType: 'price',
			...query,
		}) as SymbolInfo[];
		this.logger.debug(`[index] Found ${pricesDeclarations.length} prices declarations`);
		return pricesDeclarations;
	}

	/**
	 * Get a specific Beancount option value
	 * @param name Option name
	 * @returns Option value and metadata, or undefined if not found
	 */
	public getOption(name: SupportedOption) {
		return this._optionsManager.getOption(name);
	}

	public getAllContexts() {
		return this._historyContext.getAllContexts();
	}
}
