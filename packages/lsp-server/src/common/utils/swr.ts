import { Logger } from '@bean-lsp/shared';

/**
 * Options for SWR (Stale-While-Revalidate) caching
 */
export interface SwrOptions {
	/**
	 * Maximum age of cached data in milliseconds.
	 * If cached data is older than this, a fresh fetch will be performed even when swr=true.
	 * Set to 0 to always use cache (if available) regardless of age.
	 * Default: 10000 (10 seconds)
	 */
	maxAge?: number;

	/**
	 * Whether to log detailed information about cache hits/misses
	 * Default: false
	 */
	debug?: boolean;

	/**
	 * Maximum time (in milliseconds) to wait for revalidation to complete.
	 * If revalidation completes within this time, the fresh data will be returned.
	 * If revalidation takes longer, the cached data will be returned immediately.
	 * Set to 0 to always return cached data immediately (if available).
	 * Set to Infinity to always wait for fresh data.
	 * Default: 100 (wait up to 100ms for fresh data)
	 */
	waitTime?: number;
}

/**
 * Default SWR options
 */
const DEFAULT_SWR_OPTIONS: Required<SwrOptions> = {
	maxAge: 10000, // 10 seconds
	debug: false,
	waitTime: 100, // Wait up to 100ms for fresh data before falling back to cache
};

/**
 * A generic utility for implementing the Stale-While-Revalidate pattern
 */
export class SwrCache<T> {
	private cache: T | null = null;
	private cacheTime: number = 0;
	private refreshPromise: Promise<T> | null = null;
	private logger: Logger;

	/**
	 * Creates a new SWR cache
	 *
	 * @param fetchFn The function to call to fetch fresh data
	 * @param loggerName Name to use for the logger
	 */
	constructor(
		private readonly fetchFn: () => Promise<T>,
		loggerName: string = 'swr',
	) {
		this.logger = new Logger(loggerName);
	}

	/**
	 * Gets data with optional SWR caching
	 *
	 * @param swr Whether to use SWR caching
	 * @param options SWR caching options
	 * @returns The requested data
	 */
	async get(swr: boolean = false, options?: SwrOptions): Promise<T> {
		const opts = { ...DEFAULT_SWR_OPTIONS, ...(options || {}) };

		const now = Date.now();
		const cacheAge = now - this.cacheTime;
		const cacheValid = this.cache !== null && (Array.isArray(this.cache) ? this.cache.length > 0 : true);
		const cacheExpired = opts.maxAge > 0 && cacheAge > opts.maxAge;

		// If debugging is enabled, log cache state
		if (opts.debug) {
			this.logger.debug(`[swr] Cache state: valid=${cacheValid}, age=${cacheAge}ms, expired=${cacheExpired}`);
		}

		// For SWR with valid cache
		if (swr && cacheValid) {
			if (opts.debug) {
				this.logger.debug(`[swr] Cache ${cacheExpired ? 'expired' : 'valid'}, waitTime=${opts.waitTime}ms`);
			}

			// If waitTime is 0, we immediately use cache and refresh in background
			if (opts.waitTime === 0) {
				this._refreshInBackground(opts.debug);
				return this.cache!;
			}

			// If waitTime > 0, we try to get fresh data within the time limit
			// Otherwise fallback to cached data
			try {
				// Only start a new fetch if we're not already refreshing
				const fetchPromise = this.refreshPromise || this._createRefreshPromise(opts.debug);

				// Create a promise that resolves after waitTime with the cached value
				const timeoutPromise = new Promise<T>(resolve => {
					setTimeout(() => {
						if (opts.debug) {
							this.logger.debug(`[swr] Wait time of ${opts.waitTime}ms elapsed, using cached data`);
						}
						resolve(this.cache!);
					}, opts.waitTime);
				});

				// Race the fetch against the timeout
				return await Promise.race([fetchPromise, timeoutPromise]);
			} catch (err) {
				this.logger.error('[swr] Error during timed refresh:', err);
				return this.cache!;
			}
		}

		// No cache or no SWR, do a fresh fetch
		if (opts.debug) {
			this.logger.debug('[swr] No valid cache or SWR disabled, fetching fresh data');
		}

		const result = await this.fetchFn();
		this.cache = result;
		this.cacheTime = Date.now();
		return result;
	}

	/**
	 * Creates a promise that refreshes the cache
	 * @param debug Whether to log debug information
	 * @returns Promise that resolves with the fresh data
	 */
	private _createRefreshPromise(debug: boolean): Promise<T> {
		this.refreshPromise = this.fetchFn().then(result => {
			if (debug) {
				this.logger.debug('[swr] Background refresh completed successfully');
			}
			this.cache = result;
			this.cacheTime = Date.now();
			this.refreshPromise = null;
			return result;
		}).catch(err => {
			this.logger.error('[swr] Error refreshing data:', err);
			this.refreshPromise = null;
			// We know cache is not null here because of the cacheValid check in the caller
			return this.cache!;
		});

		return this.refreshPromise;
	}

	/**
	 * Starts a background refresh if one isn't already in progress
	 * @param debug Whether to log debug information
	 */
	private _refreshInBackground(debug: boolean): void {
		if (!this.refreshPromise) {
			if (debug) {
				this.logger.debug('[swr] Starting background refresh');
			}
			this._createRefreshPromise(debug);
		} else if (debug) {
			this.logger.debug('[swr] Background refresh already in progress');
		}
	}

	/**
	 * Invalidates the cache, forcing a fresh fetch on next request
	 */
	invalidate(): void {
		this.cache = null;
		this.cacheTime = 0;
	}
}
