import { AsyncCall } from 'async-call-rpc/base';
import { WorkerChannel } from 'async-call-rpc/utils/web/worker.js';

type BeancountVersion = 'v2' | 'v3';

interface FileUpdate {
	name: string;
	content: string;
}

interface WorkerApi {
	init: (version: BeancountVersion) => Promise<void>;
	sync: (updates: FileUpdate[], removed: string[]) => Promise<void>;
	reset: (files: FileUpdate[]) => Promise<void>;
	beancheck: (entryFile: string) => Promise<string>;
}

interface ClientApi {
	reportStatus: (message: string) => void;
}

export class BeancountWorkerClient {
	private worker: Worker;
	private api: WorkerApi;

	constructor(workerUrl: string, onStatus?: (message: string) => void) {
		this.worker = new Worker(workerUrl, { type: 'module' });
		const clientApi: ClientApi = {
			reportStatus: (message: string) => {
				onStatus?.(message);
			},
		};
		this.api = AsyncCall<WorkerApi>(clientApi, {
			channel: new WorkerChannel(this.worker),
		});
	}

	init(version: BeancountVersion): Promise<void> {
		return this.api.init(version);
	}

	sync(updates: FileUpdate[], removed: string[]): Promise<void> {
		return this.api.sync(updates, removed);
	}

	reset(files: FileUpdate[]): Promise<void> {
		return this.api.reset(files);
	}

	beancheck(entryFile: string): Promise<string> {
		return this.api.beancheck(entryFile);
	}

	dispose(): void {
		this.worker.terminate();
	}
}
