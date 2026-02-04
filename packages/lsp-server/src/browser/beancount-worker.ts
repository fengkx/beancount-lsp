import { AsyncCall } from 'async-call-rpc/base';
import { WorkerChannel } from 'async-call-rpc/utils/web/worker.js';
import { createBeancountRuntime, createFileTree } from 'beancount-wasm/runtime';
// eslint-disable-next-line import-x/no-relative-packages
import beanCheckPythonCode from '../node/beancheck.py';

type BeancountVersion = 'v2' | 'v3';

interface FileUpdate {
	name: string;
	content: string;
}

interface FileTree {
	update: (files: FileUpdate[]) => void;
	remove: (names: string[]) => void;
	reset: (files: FileUpdate[]) => void;
}

interface PyodideRuntime {
	runPythonAsync: (code: string) => Promise<unknown>;
	globals: {
		set: (name: string, value: unknown) => void;
	};
}

interface RuntimeState {
	version: BeancountVersion;
	pyodide: PyodideRuntime;
	fileTree: FileTree;
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

const WORK_ROOT = '/work';

const BEANCHECK_WRAPPER = String.raw`
import sys
import io
from contextlib import redirect_stdout

sys.argv = ["beancheck.py", entry_path]
stdout = io.StringIO()
with redirect_stdout(stdout):
    exec(beancheck_code, {})
stdout.getvalue()
`;

let runtimeState: RuntimeState | null = null;
let runtimePromise: Promise<RuntimeState> | null = null;
/** Version currently being loaded; only set while runtimePromise is active. */
let loadingVersion: BeancountVersion | null = null;

function postStatus(message: string) {
	void mainApi.reportStatus(message);
}

async function loadRuntime(version: BeancountVersion): Promise<RuntimeState> {
	if (runtimeState?.version === version) {
		return runtimeState;
	}
	if (runtimePromise && loadingVersion === version) {
		return runtimePromise;
	}
	if (runtimePromise && loadingVersion !== version) {
		await runtimePromise;
		return loadRuntime(version);
	}

	loadingVersion = version;
	runtimePromise = (async () => {
		postStatus(`Loading Beancount ${version} runtime...`);
		const { pyodide } = await createBeancountRuntime({
			version,
			inline: 'auto',
			onStatus: postStatus,
		});
		const fileTree = createFileTree(pyodide, { root: WORK_ROOT });
		runtimeState = {
			version,
			pyodide,
			fileTree,
		};
		postStatus(`Runtime ready (${version}).`);
		return runtimeState;
	})();

	try {
		return await runtimePromise;
	} finally {
		runtimePromise = null;
		loadingVersion = null;
	}
}

async function init(version: BeancountVersion): Promise<void> {
	await loadRuntime(version);
}

async function sync(updates: FileUpdate[], removed: string[]): Promise<void> {
	const runtime = await loadRuntime(runtimeState?.version ?? 'v3');
	if (updates.length > 0) {
		runtime.fileTree.update(updates);
	}
	if (removed.length > 0) {
		runtime.fileTree.remove(removed);
	}
}

async function reset(files: FileUpdate[]): Promise<void> {
	const runtime = await loadRuntime(runtimeState?.version ?? 'v3');
	runtime.fileTree.reset(files);
}

async function beancheck(entryFile: string): Promise<string> {
	const runtime = await loadRuntime(runtimeState?.version ?? 'v3');
	const entryPath = `${WORK_ROOT}/${entryFile}`;
	runtime.pyodide.globals.set('entry_path', entryPath);
	runtime.pyodide.globals.set('beancheck_code', beanCheckPythonCode);
	const result = await runtime.pyodide.runPythonAsync(BEANCHECK_WRAPPER);
	return result as string;
}

const workerApi: WorkerApi = {
	init,
	sync,
	reset,
	beancheck,
};

const mainApi = AsyncCall<ClientApi>(workerApi, {
	channel: new WorkerChannel(),
});
