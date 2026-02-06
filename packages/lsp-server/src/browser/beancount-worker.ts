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

interface PyProxy {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	toJs: (options?: { dict_converter?: (...args: any[]) => any; create_pyproxies?: boolean }) => unknown;
	destroy: () => void;
}

interface PyodideRuntime {
	runPythonAsync: (code: string) => Promise<unknown>;
	globals: {
		set: (name: string, value: unknown) => void;
	};
}

interface RuntimeState {
	version: BeancountVersion;
	extraPythonPackages: string[];
	pyodide: PyodideRuntime;
	fileTree: FileTree;
	beancheckLoaded: boolean;
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
	beancheck: (entryFile: string) => Promise<string>;
}

interface ClientApi {
	reportStatus: (message: string) => void;
}

const WORK_ROOT = '/work';

const BEANCHECK_LOAD_SCRIPT = String.raw`
if "beancheck_namespace" not in globals():
    beancheck_namespace = {"__name__": "beancheck_module"}
    exec(beancheck_code, beancheck_namespace)

if "run_beancheck" not in beancheck_namespace:
    raise RuntimeError("run_beancheck() is not defined in beancheck.py")
`;

const BEANCHECK_RUN_WRAPPER = String.raw`
beancheck_namespace["run_beancheck"](entry_path)
`;

let runtimeState: RuntimeState | null = null;
let runtimePromise: Promise<RuntimeState> | null = null;
/** Version currently being loaded; only set while runtimePromise is active. */
let loadingVersion: BeancountVersion | null = null;
let loadingExtraPackages: string[] | null = null;

function postStatus(message: string) {
	void mainApi.reportStatus(message);
}

function normalizePackages(packages?: string[]): string[] {
	if (!packages) {
		return [];
	}
	const normalized = packages
		.map(pkg => (typeof pkg === 'string' ? pkg.trim() : ''))
		.filter(Boolean);
	return Array.from(new Set(normalized));
}

function samePackages(left: string[], right: string[]): boolean {
	if (left.length !== right.length) {
		return false;
	}
	for (let i = 0; i < left.length; i++) {
		if (left[i] !== right[i]) {
			return false;
		}
	}
	return true;
}

async function loadRuntime(
	version: BeancountVersion,
	extraPythonPackages?: string[],
): Promise<RuntimeState> {
	const normalizedPackages = normalizePackages(extraPythonPackages);
	if (
		runtimeState?.version === version
		&& samePackages(runtimeState.extraPythonPackages, normalizedPackages)
	) {
		return runtimeState;
	}
	if (
		runtimePromise
		&& loadingVersion === version
		&& samePackages(loadingExtraPackages ?? [], normalizedPackages)
	) {
		return runtimePromise;
	}
	if (runtimePromise && (loadingVersion !== version || !samePackages(loadingExtraPackages ?? [], normalizedPackages))) {
		await runtimePromise;
		return loadRuntime(version, normalizedPackages);
	}

	loadingVersion = version;
	loadingExtraPackages = normalizedPackages;
	runtimePromise = (async () => {
		postStatus(`Loading Beancount ${version} runtime...`);
		const { pyodide } = await createBeancountRuntime({
			version,
			inline: 'auto',
			onStatus: postStatus,
			pythonPackages: normalizedPackages,
		});

		const fileTree = createFileTree(pyodide, { root: WORK_ROOT });
		runtimeState = {
			version,
			extraPythonPackages: normalizedPackages,
			pyodide,
			fileTree,
			beancheckLoaded: false,
		};
		postStatus(`Runtime ready (${version}).`);
		return runtimeState;
	})();

	try {
		return await runtimePromise;
	} finally {
		runtimePromise = null;
		loadingVersion = null;
		loadingExtraPackages = null;
	}
}

async function init(
	version: BeancountVersion,
	options?: {
		extraPythonPackages?: string[];
	},
): Promise<void> {
	await loadRuntime(version, options?.extraPythonPackages);
}

async function sync(updates: FileUpdate[], removed: string[]): Promise<void> {
	const runtime = await loadRuntime(runtimeState?.version ?? 'v3', runtimeState?.extraPythonPackages);
	if (updates.length > 0) {
		runtime.fileTree.update(updates);
	}
	if (removed.length > 0) {
		runtime.fileTree.remove(removed);
	}
}

async function reset(files: FileUpdate[]): Promise<void> {
	const runtime = await loadRuntime(runtimeState?.version ?? 'v3', runtimeState?.extraPythonPackages);
	runtime.fileTree.reset(files);
}

async function beancheck(entryFile: string): Promise<string> {
	const runtime = await loadRuntime(runtimeState?.version ?? 'v3', runtimeState?.extraPythonPackages);
	if (!runtime.beancheckLoaded) {
		runtime.pyodide.globals.set('beancheck_code', beanCheckPythonCode);
		await runtime.pyodide.runPythonAsync(BEANCHECK_LOAD_SCRIPT);
		runtime.beancheckLoaded = true;
	}
	const entryPath = `${WORK_ROOT}/${entryFile}`;
	runtime.pyodide.globals.set('entry_path', entryPath);
	const pyResult = await runtime.pyodide.runPythonAsync(BEANCHECK_RUN_WRAPPER);
	// Use Pyodide's toJs() to convert Python dict to JS object, then native
	// JSON.stringify. This avoids running json.dumps inside WASM Python which
	// is 3-10x slower than native V8 JSON serialization.
	if (pyResult != null && typeof (pyResult as PyProxy).toJs === 'function') {
		const proxy = pyResult as PyProxy;
		try {
			const jsResult = proxy.toJs({ dict_converter: Object.fromEntries });
			return JSON.stringify(jsResult);
		} finally {
			proxy.destroy();
		}
	}
	// Fallback: result is already a string (e.g. if Python returned json.dumps)
	return pyResult as string;
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
