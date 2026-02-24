import { AsyncCall } from 'async-call-rpc/base';
import { WorkerChannel } from 'async-call-rpc/utils/web/worker.js';

type BeancountVersion = 'v2' | 'v3';
export type BeancheckMode = 'diagnostics' | 'full';

interface FileUpdate {
	name: string;
	content: string;
}

interface WorkerApi {
	init: (
		version: BeancountVersion,
		options?: {
			extraPythonPackages?: string[];
		},
	) => Promise<void>;
	sync: (updates: FileUpdate[], removed: string[]) => Promise<void>;
	reset: (files: FileUpdate[]) => Promise<void>;
	beancheck: (entryFile: string, options?: { mode?: BeancheckMode }) => Promise<string>;
}

interface ClientApi {
	reportStatus: (message: string) => void;
}

export class BeancountWorkerClient {
	private workerUrl: string;
	private onStatus?: (message: string) => void;
	private worker: Worker | null = null;
	private api: WorkerApi | null = null;
	private readyPromise: Promise<void> | null = null;
	private disposed = false;

	constructor(workerUrl: string, onStatus?: (message: string) => void) {
		this.workerUrl = workerUrl;
		this.onStatus = onStatus;
	}

	private async initialize(): Promise<void> {
		const worker = await this.createWorker(this.workerUrl);
		this.worker = worker;
		const clientApi: ClientApi = {
			reportStatus: (message: string) => {
				this.onStatus?.(message);
			},
		};
		this.api = AsyncCall<WorkerApi>(clientApi, {
			channel: new WorkerChannel(worker),
		});
	}

	private async createWorker(workerUrl: string): Promise<Worker> {
		// If the URL is already blob/data, create directly.
		if (workerUrl.startsWith('blob:') || workerUrl.startsWith('data:')) {
			return new Worker(workerUrl);
		}

		// Prefer creating a blob worker to satisfy CSP (child-src allows blob).
		let fetchError: unknown;
		if (typeof fetch === 'function') {
			try {
				const response = await fetch(workerUrl);
				if (!response.ok) {
					throw new Error(`fetch worker failed: ${response.status} ${response.statusText}`);
				}
				const source = await response.text();
				const blobUrl = URL.createObjectURL(
					new Blob([source], { type: 'text/javascript' }),
				);
				const worker = new Worker(blobUrl);
				URL.revokeObjectURL(blobUrl);
				return worker;
			} catch (err) {
				fetchError = err;
			}
		}

		// Fallback: attempt direct worker creation.
		try {
			return new Worker(workerUrl);
		} catch (err) {
			if (fetchError) {
				console.warn(`[beanlsp] fetch-to-blob worker failed: ${String(fetchError)}`);
			}
			throw err;
		}
	}

	private async ensureReady(): Promise<void> {
		if (this.disposed) {
			throw new Error('BeancountWorkerClient is disposed');
		}
		if (this.api) {
			return;
		}
		if (!this.readyPromise) {
			this.readyPromise = this.initialize();
		}
		try {
			await this.readyPromise;
			this.readyPromise = null;
		} finally {
			// Allow retry if initialization failed.
			if (!this.api) {
				this.readyPromise = null;
			}
		}
	}

	async init(
		version: BeancountVersion,
		options?: {
			extraPythonPackages?: string[];
		},
	): Promise<void> {
		await this.ensureReady();
		return this.api!.init(version, options);
	}

	async sync(updates: FileUpdate[], removed: string[]): Promise<void> {
		await this.ensureReady();
		return this.api!.sync(updates, removed);
	}

	async reset(files: FileUpdate[]): Promise<void> {
		await this.ensureReady();
		return this.api!.reset(files);
	}

	async beancheck(entryFile: string, options?: { mode?: BeancheckMode }): Promise<string> {
		await this.ensureReady();
		return this.api!.beancheck(entryFile, options);
	}

	dispose(): void {
		this.disposed = true;
		this.worker?.terminate();
	}
}
