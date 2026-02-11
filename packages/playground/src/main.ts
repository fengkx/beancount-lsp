// main.ts
import './style.css';

import '@codingame/monaco-editor-wrapper/features/workbench';
import '@codingame/monaco-editor-wrapper/features/search';
import '@codingame/monaco-editor-wrapper/features/extensionGallery';
import '@codingame/monaco-editor-wrapper/features/extensionHostWorker';
import '@codingame/monaco-editor-wrapper/features/viewPanels';
import '@codingame/monaco-vscode-api/vscode/vs/editor/contrib/codelens/browser/codelensController';
// Register suggest/snippet editor contributions; otherwise completion UI won't trigger LSP requests.
import '@codingame/monaco-vscode-api/vscode/vs/editor/contrib/suggest/browser/suggestController';
import '@codingame/monaco-vscode-api/vscode/vs/editor/contrib/snippet/browser/snippetController2';
import '@codingame/monaco-vscode-api/vscode/vs/editor/contrib/linkedEditing/browser/linkedEditing';
import { whenReady as lspClientReady } from '../lsp-client.vsix';

// @ts-expect-error TODO
import { initialize, registerFile, registerWorker, updateUserConfiguration, Worker as MonacoWorker } from '@codingame/monaco-editor-wrapper';
import { getService } from '@codingame/monaco-vscode-api';
import { IExtensionService, IExtensionsWorkbenchService } from '@codingame/monaco-vscode-api/services';
import { getBuiltinExtensions } from '@codingame/monaco-vscode-api/extensions';
import { URI } from '@codingame/monaco-vscode-api/vscode/vs/base/common/uri';
import { IFileService } from '@codingame/monaco-vscode-api/vscode/vs/platform/files/common/files.service';
import { ISearchService } from '@codingame/monaco-vscode-api/vscode/vs/workbench/services/search/common/search.service';
import {
	HTMLFileSystemProvider,
	createIndexedDBProviders,
	initFile,
	registerHTMLFileSystemProvider,
	RegisteredMemoryFile,
} from '@codingame/monaco-vscode-files-service-override';
import { ExtensionIdentifier } from '@codingame/monaco-vscode-api/vscode/vs/platform/extensions/common/extensions';
import {
	commands,
	ConfigurationTarget,
	extensions,
	languages,
	RelativePattern,
	StatusBarAlignment,
	Uri,
	window,
	workspace,
} from 'vscode';
import * as pako from 'pako';
import defaultFiles from './demo-files.json';
import defaultUserConfig from './demo-user-config.json';
import localFileSearchWorkerUrl from '@codingame/monaco-vscode-search-service-override/worker?worker&url';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROJECT_PATH_PREFIX = '/tmp/project/';
const DEFAULT_MAIN_BEAN = `${PROJECT_PATH_PREFIX}main.bean`;
const TARGET_EXTENSION_ID = 'fengkx.beancount-lsp-client';
const SHARE_HASH_KEY = 'bclsp=';
const INIT_TIMEOUT_MS = 3000;

// ---------------------------------------------------------------------------
// Debug helpers
// ---------------------------------------------------------------------------

const DEBUG =
	new URLSearchParams(globalThis.location.search).has('debug')
	|| globalThis.localStorage.getItem('bclsp:debug') === '1';

function debugLog(...args: unknown[]) {
	if (!DEBUG) {
		return;
	}
	// eslint-disable-next-line no-console
	console.log('[playground]', ...args);
}

// ---------------------------------------------------------------------------
// File System Access API detection
// ---------------------------------------------------------------------------

type WindowWithFileSystemAccess = Window & {
	showDirectoryPicker: (options?: { mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>;
};

function getFileSystemAccessWindow(): WindowWithFileSystemAccess | null {
	const candidate = globalThis as unknown as Partial<WindowWithFileSystemAccess>;
	return typeof candidate.showDirectoryPicker === 'function'
		? candidate as WindowWithFileSystemAccess
		: null;
}

// ---------------------------------------------------------------------------
// Project-file path helpers
// ---------------------------------------------------------------------------

function isProjectFile(uri: { scheme: string; path: string }): boolean {
	return uri.scheme === 'file' && uri.path.startsWith(PROJECT_PATH_PREFIX);
}

// ---------------------------------------------------------------------------
// Worker registration
// ---------------------------------------------------------------------------

registerWorker(
	'LocalFileSearchWorker',
	new MonacoWorker(new URL(localFileSearchWorkerUrl, globalThis.location.href), {
		type: 'module',
	}),
);

// ---------------------------------------------------------------------------
// Search service patch (FSA mode)
// ---------------------------------------------------------------------------

type SearchQueryLike = {
	filePattern?: unknown;
	includePattern?: unknown;
	folderQueries?: Array<{ includePattern?: unknown }>;
	_reason?: unknown;
};

type FileSearchProviderLike = {
	fileSearch: (query: SearchQueryLike, token?: unknown) => Promise<unknown>;
	__bclspGlobFilePatternPatch?: boolean;
	fileSystemProvider?: {
		getHandle?: (resource: URI) => Promise<unknown>;
	};
};

async function patchSearchServiceForGlobFindFiles(): Promise<void> {
	let searchService: { fileSearchProviders?: Map<string, FileSearchProviderLike> };
	try {
		searchService = await getService(ISearchService) as unknown as {
			fileSearchProviders?: Map<string, FileSearchProviderLike>;
		};
	} catch {
		return;
	}

	const provider = searchService.fileSearchProviders?.get('file');
	if (!provider || provider.__bclspGlobFilePatternPatch) {
		return;
	}

	const originalFileSearch = provider.fileSearch.bind(provider);
	provider.fileSearch = async (query: SearchQueryLike, token?: unknown) => {
		const filePattern = typeof query?.filePattern === 'string' ? query.filePattern.trim() : '';
		const hasGlobSyntax = /[*?[\]{}]/.test(filePattern);

		if (filePattern.length > 0 && hasGlobSyntax) {
			const hasIncludePattern = query.includePattern != null
				|| query.folderQueries?.some(folderQuery => folderQuery?.includePattern != null);

			const nextQuery = hasIncludePattern
				? { ...query, filePattern: '' }
				: { ...query, filePattern: '', includePattern: { [filePattern]: true } };
			return originalFileSearch(nextQuery, token);
		}

		return originalFileSearch(query, token);
	};

	provider.__bclspGlobFilePatternPatch = true;
}

// ---------------------------------------------------------------------------
// Configuration helpers
// ---------------------------------------------------------------------------

function readConfigValue(key: string): unknown {
	try {
		// workspace.getConfiguration().get supports "section" and "section.key" forms.
		return workspace.getConfiguration().get(key);
	} catch (error) {
		return { error: String(error) };
	}
}

function logConfigSnapshot(label: string) {
	if (!DEBUG) {
		return;
	}
	const focusKeys = [
		'editor.codeLens',
		'workbench.statusBar.visible',
		'beanLsp.codeLens.enable',
		'beanLsp.codeLens.accountBalance.enable',
		'beanLsp.codeLens.pad.enable',
		'beanLsp.mainBeanFile',
		'beanLsp.browserWasmBeancount.enabled',
		'beanLsp.trace.server',
	];
	const snapshot: Record<string, unknown> = {};
	for (const key of focusKeys) {
		snapshot[key] = readConfigValue(key);
	}
	debugLog(label, snapshot);
}

async function applyConfigHard(
	label: string,
	nextConfig: Record<string, unknown>,
): Promise<void> {
	updateUserConfiguration(JSON.stringify(nextConfig));
	logConfigSnapshot(`${label} (after updateUserConfiguration)`);

	// If the wrapper-based update doesn't stick (prod builds can re-register default overrides),
	// force the values via workspace configuration updates.
	const cfg = workspace.getConfiguration();
	const diffs: Array<{ key: string; expected: unknown; actual: unknown }> = [];
	for (const [key, expected] of Object.entries(nextConfig)) {
		const actual = cfg.get(key);
		if (JSON.stringify(actual) !== JSON.stringify(expected)) {
			diffs.push({ key, expected, actual });
		}
	}
	if (diffs.length === 0) {
		debugLog(`${label} applied ok`);
		return;
	}

	debugLog(`${label} mismatch -> forcing via workspace.update`, { diffCount: diffs.length, diffs: diffs.slice(0, 10) });
	for (const { key, expected } of diffs) {
		try {
			// Store as a user-level setting in this web sandbox so it overrides defaults.
			// This is still "reproducible" because our source of truth is the hash.
			// eslint-disable-next-line no-await-in-loop
			await cfg.update(key, expected as never, ConfigurationTarget.Global);
		} catch (error) {
			debugLog('workspace.update failed', { key, error: String(error) });
		}
	}
	logConfigSnapshot(`${label} (after workspace.update)`);
}

// ---------------------------------------------------------------------------
// Share-state codec (URL hash persistence)
// ---------------------------------------------------------------------------

type DemoFile = { path: string; content: string };
type ShareStateV1 = {
	v: 1;
	files: DemoFile[];
	config: Record<string, unknown>;
	activeFile?: string;
};

type HashCodec = 'gz';
type ShareWireV1 = { v: 1; f: Array<[string, string]>; c: Record<string, unknown>; a?: string };

function base64UrlEncodeBytes(bytes: Uint8Array): string {
	let binary = '';
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function base64UrlDecodeBytes(text: string): Uint8Array {
	const normalized = text.replaceAll('-', '+').replaceAll('_', '/');
	const padLen = (4 - (normalized.length % 4)) % 4;
	const padded = normalized + '='.repeat(padLen);
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

async function gzipCompressUtf8(text: string): Promise<Uint8Array> {
	// Prefer native CompressionStream when available; fallback to pako.
	if (typeof CompressionStream === 'undefined') {
		return pako.gzip(new TextEncoder().encode(text));
	}
	const readable = new Blob([text]).stream();
	const compressed = readable.pipeThrough(new CompressionStream('gzip'));
	const buf = await new Response(compressed).arrayBuffer();
	return new Uint8Array(buf);
}

async function gzipDecompressToUtf8(bytes: Uint8Array): Promise<string> {
	// Prefer native DecompressionStream when available; fallback to pako.
	if (typeof DecompressionStream === 'undefined') {
		return pako.ungzip(bytes, { to: 'string' }) as string;
	}
	// Ensure we pass a Uint8Array backed by an ArrayBuffer (not SharedArrayBuffer).
	const readable = new Blob([new Uint8Array(bytes)]).stream();
	const decompressed = readable.pipeThrough(new DecompressionStream('gzip'));
	return await new Response(decompressed).text();
}

function toWire(state: ShareStateV1): ShareWireV1 {
	return {
		v: 1,
		f: state.files.map((it) => [it.path, it.content]),
		c: state.config,
		a: state.activeFile,
	};
}

function fromWire(wire: ShareWireV1): ShareStateV1 | null {
	const files: DemoFile[] = [];
	for (const it of wire.f) {
		if (!Array.isArray(it) || it.length !== 2 || typeof it[0] !== 'string' || typeof it[1] !== 'string') {
			return null;
		}
		files.push({ path: it[0], content: it[1] });
	}
	return { v: 1, files, config: wire.c, activeFile: wire.a };
}

async function encodeShareState(state: ShareStateV1): Promise<string> {
	const json = JSON.stringify(toWire(state));
	const gz = await gzipCompressUtf8(json);
	return `gz.${base64UrlEncodeBytes(gz)}`;
}

async function decodeShareState(payload: string): Promise<ShareStateV1 | null> {
	const dot = payload.indexOf('.');
	if (dot <= 0) {
		return null;
	}
	const codec = payload.slice(0, dot) as HashCodec;
	const data = payload.slice(dot + 1);
	try {
		if (codec !== 'gz') {
			return null;
		}
		const bytes = base64UrlDecodeBytes(data);
		const json = await gzipDecompressToUtf8(bytes);
		return fromWire(JSON.parse(json) as ShareWireV1);
	} catch {
		return null;
	}
}

async function tryLoadShareStateFromHash(): Promise<ShareStateV1 | null> {
	const hash = globalThis.location.hash || '';
	debugLog('init hash', { len: hash.length, prefix: hash.slice(0, 32) });
	if (!hash.startsWith('#' + SHARE_HASH_KEY)) {
		return null;
	}
	const payload = hash.slice(('#' + SHARE_HASH_KEY).length);
	if (!payload) {
		return null;
	}
	const parsed = await decodeShareState(payload);
	if (!parsed) {
		return null;
	}
	if (parsed.v !== 1 || !Array.isArray(parsed.files) || typeof parsed.config !== 'object' || parsed.config == null) {
		return null;
	}
	debugLog('init hash decoded', {
		files: parsed.files.length,
		configKeys: Object.keys(parsed.config).length,
		activeFile: parsed.activeFile,
	});
	return parsed;
}

async function setShareHash(state: ShareStateV1) {
	try {
		const encoded = await encodeShareState(state);
		const nextHash = `#${SHARE_HASH_KEY}${encoded}`;
		debugLog('hash writing', { encodedLen: encoded.length });
		try {
			const nextUrl = `${globalThis.location.pathname}${globalThis.location.search}${nextHash}`;
			globalThis.history.replaceState(null, '', nextUrl);
		} catch (error) {
			debugLog('history.replaceState failed, fallback to location.hash', { error: String(error) });
			globalThis.location.hash = nextHash;
		}
		debugLog('hash updated', { hashLen: globalThis.location.hash.length });
	} catch (error) {
		debugLog('hash update failed', { error: String(error) });
	}
}

// ---------------------------------------------------------------------------
// URI normalisation helpers
// ---------------------------------------------------------------------------

function normalizeFolderUri(uri: Uri): Uri {
	if (uri.path.length > 1 && uri.path.endsWith('/')) {
		return uri.with({ path: uri.path.slice(0, -1) });
	}
	return uri;
}

function normalizeProviderUri(resource: URI): URI {
	if (resource.path.length > 1 && resource.path.endsWith('/')) {
		return resource.with({ path: resource.path.replace(/\/+$/, '') });
	}
	return resource;
}

// ---------------------------------------------------------------------------
// FSA provider patches
// ---------------------------------------------------------------------------

async function patchFsaProviderHandleResolution(): Promise<void> {
	if (!isFsaMode) {
		return;
	}
	const fileService = await getService(IFileService);
	const provider = fileService.getProvider('file');
	if (!(provider instanceof HTMLFileSystemProvider)) {
		return;
	}

	const patched = provider as HTMLFileSystemProvider & { __bclspGetHandlePatched?: boolean };
	if (patched.__bclspGetHandlePatched) {
		return;
	}

	const originalGetHandle = provider.getHandle.bind(provider);
	provider.getHandle = async (resource: URI) => {
		const normalized = normalizeProviderUri(resource);
		return originalGetHandle(normalized);
	};
	patched.__bclspGetHandlePatched = true;
}

async function alignFsaWorkspaceFolderHandles(): Promise<void> {
	if (!isFsaMode) {
		return;
	}
	const fileService = await getService(IFileService);
	const provider = fileService.getProvider('file');
	if (!(provider instanceof HTMLFileSystemProvider)) {
		return;
	}

	const folders = workspace.workspaceFolders ?? [];
	for (let i = 0; i < folders.length; i++) {
		const folder = folders[i];
		const folderUri = URI.parse(folder.uri.toString());
		const handle = await provider.getHandle(folderUri);
		if (handle) {
			continue;
		}

		// If the workspace folder URI does not map to a registered handle,
		// file-search based APIs (e.g. findFiles) can return empty results.
		const candidates = Array.from(provider.directories).filter(dir => dir.name === folder.name);
		if (candidates.length !== 1) {
			continue;
		}
		const canonicalUri = await provider.registerDirectoryHandle(candidates[0]);
		const nextFolderUri = normalizeFolderUri(Uri.parse(canonicalUri.toString()));
		if (nextFolderUri.toString() === folder.uri.toString()) {
			continue;
		}
		workspace.updateWorkspaceFolders(i, 1, {
			uri: nextFolderUri,
			name: folder.name,
		});
	}
}

// ---------------------------------------------------------------------------
// Language / file helpers
// ---------------------------------------------------------------------------

async function waitForLanguage(languageId: string, timeoutMs: number): Promise<boolean> {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const all = await languages.getLanguages();
		if (all.includes(languageId)) {
			return true;
		}
		await new Promise<void>(resolve => setTimeout(resolve, 100));
	}
	return false;
}

async function openProjectFile(path: string): Promise<void> {
	const uri = Uri.file(path);
	const ready = await waitForLanguage('beancount', 5000);
	if (!ready) {
		console.warn('[playground] beancount language registration not ready before open');
	}
	await commands.executeCommand('vscode.open', uri);
	const languageId = window.activeTextEditor?.document?.uri?.toString() === uri.toString()
		? window.activeTextEditor.document.languageId
		: undefined;
	debugLog('opened project file', { path, languageId, languageReady: ready });
}

function getWorkspaceFolderName(uri: Uri): string {
	const normalized = uri.path.endsWith('/') ? uri.path.slice(0, -1) : uri.path;
	const idx = normalized.lastIndexOf('/');
	return idx >= 0 ? normalized.slice(idx + 1) || 'workspace' : normalized || 'workspace';
}

// ---------------------------------------------------------------------------
// FSA workspace folder opening
// ---------------------------------------------------------------------------

async function openLocalWorkspaceFolder(): Promise<boolean> {
	if (!isFsaMode) {
		void window.showInformationMessage('Local File System Access mode is disabled. Use ?fs=fsa to enable it.');
		return false;
	}
	const fileService = await getService(IFileService);
	const provider = fileService.getProvider('file');
	if (!(provider instanceof HTMLFileSystemProvider)) {
		void window.showErrorMessage('HTML file system provider is not available.');
		return false;
	}
	const fsWindow = getFileSystemAccessWindow();
	if (!fsWindow) {
		void window.showErrorMessage('Browser File System Access API is not available in this environment.');
		return false;
	}
	let folderHandle: FileSystemDirectoryHandle;
	try {
		folderHandle = await fsWindow.showDirectoryPicker({ mode: 'readwrite' });
	} catch {
		// User cancelled; handled intentionally so there is no fallback path-input prompt.
		return true;
	}

	const rawFolderUri = await provider.registerDirectoryHandle(folderHandle);
	const folderUri = normalizeFolderUri(Uri.parse(rawFolderUri.toString()));

	// Prefer the standard VS Code open-folder flow (same as vscode.dev).
	// This keeps workbench and extension-host workspace state consistent.
	try {
		const opened = await commands.executeCommand<boolean>('vscode.openFolder', folderUri, {
			forceReuseWindow: true,
		});
		if (opened !== false) {
			return true;
		}
	} catch (error) {
		debugLog('vscode.openFolder failed, fallback to updateWorkspaceFolders', { error: String(error) });
	}

	const existing = workspace.workspaceFolders ?? [];
	const added = workspace.updateWorkspaceFolders(0, existing.length, {
		uri: folderUri,
		name: getWorkspaceFolderName(folderUri),
	});
	if (!added) {
		void window.showErrorMessage(`Failed to open workspace folder: ${folderUri.toString()}`);
		return false;
	}

	const beanFiles = await workspace.findFiles(
		new RelativePattern(folderUri, '**/*.{bean,beancount}'),
		'**/{node_modules,.git}/**',
		50,
	);
	if (beanFiles.length === 0) {
		void window.showInformationMessage('Workspace opened. No .bean/.beancount file found.');
		return true;
	}

	const mainCandidate = beanFiles.find(file => file.path.endsWith('/main.bean')) ?? beanFiles[0];
	await commands.executeCommand('vscode.open', mainCandidate);
	void window.showInformationMessage(`Opened local workspace: ${folderHandle.name}`);
	return true;
}

// ---------------------------------------------------------------------------
// Status-bar item factory
// ---------------------------------------------------------------------------

function addStatusBarItem(text: string, tooltip: string, commandId: string, priority: number) {
	const item = window.createStatusBarItem(StatusBarAlignment.Right, priority);
	item.text = text;
	item.tooltip = tooltip;
	item.command = commandId;
	item.show();
}

// ---------------------------------------------------------------------------
// Extension activation
// ---------------------------------------------------------------------------

async function activateTargetExtension(): Promise<void> {
	debugLog('[extensions] builtin', getBuiltinExtensions().map((ext) => ext.identifier.id));

	const extensionService = await getService(IExtensionService);
	await extensionService.whenInstalledExtensionsRegistered();
	const extensionsWorkbenchService = await getService(IExtensionsWorkbenchService);
	await extensionsWorkbenchService.whenInitialized;

	debugLog('[extensions] workbench local', extensionsWorkbenchService.local.map((ext) => ext.identifier.id));
	debugLog('[extensions] workbench installed', extensionsWorkbenchService.installed.map((ext) => ext.identifier.id));

	await extensionsWorkbenchService.openSearch('@builtin');

	try {
		await extensionService.activateById(new ExtensionIdentifier(TARGET_EXTENSION_ID), {
			startup: false,
			extensionId: new ExtensionIdentifier(TARGET_EXTENSION_ID),
			activationEvent: 'onDemand',
		});
		debugLog('[extensions] activated by service', TARGET_EXTENSION_ID);
	} catch (error) {
		console.error('[extensions] service activate failed', error);
	}

	const extension = extensions.getExtension(TARGET_EXTENSION_ID);
	debugLog('[extensions] total', extensions.all.length);
	debugLog('[extensions] target', TARGET_EXTENSION_ID, extension);

	if (!extension) {
		debugLog('[extensions] target not found');
		return;
	}

	debugLog('[extensions] isActive before', extension.isActive);
	try {
		await extension.activate();
		debugLog('[extensions] isActive after', extension.isActive);
	} catch (error) {
		console.error('[extensions] activate failed', error);
	}
}

// ===========================================================================
// Main initialisation flow
// ===========================================================================

const baseConfig = {
	'workbench.activityBar.visible': true,
	'workbench.sideBar.location': 'left',
	'workbench.statusBar.visible': true,
	'editor.codeLens': true,
	// The monaco-editor-wrapper registers editor.quickSuggestions=false as a
	// default override.  Re-enable it so that typing inside a word (e.g. an
	// account name in a posting) auto-triggers textDocument/completion via the
	// LSP triggerKind "Invoked" path, not only via explicit triggerCharacters.
	'editor.quickSuggestions': {
		other: 'on',
		comments: 'off',
		strings: 'off',
	},
};

// --- Mode detection --------------------------------------------------------

type PlaygroundFsMode = 'memfs' | 'fsa';
const requestedFsMode = new URLSearchParams(globalThis.location.search).get('fs');
const fsMode: PlaygroundFsMode = requestedFsMode?.toLowerCase() === 'fsa' ? 'fsa' : 'memfs';
const isMemfsMode = fsMode === 'memfs';
const isFsaMode = fsMode === 'fsa';
const fsaWorkspaceUri = URI.from({ scheme: 'vscode-userdata', path: '/workspaces/fsa.code-workspace' });

// --- Resolve initial state from URL hash or defaults -----------------------

const shareFromHash = isMemfsMode ? await tryLoadShareStateFromHash() : null;
debugLog('init mode', { fsMode, fromHash: Boolean(shareFromHash) });

const initialFiles: DemoFile[] = isMemfsMode
	? (shareFromHash?.files ?? (defaultFiles as DemoFile[]))
	: [];
const initialConfig: Record<string, unknown> = isMemfsMode && shareFromHash
	? { ...baseConfig, ...(shareFromHash.config ?? {}) }
	: { ...baseConfig, ...(defaultUserConfig as Record<string, unknown>) };
let activeFile: string | undefined = isMemfsMode
	? (shareFromHash?.activeFile ?? DEFAULT_MAIN_BEAN)
	: undefined;
debugLog('initialConfig', initialConfig);

// --- Mutable playground state ----------------------------------------------

const stateFiles = new Map<string, string>(initialFiles.map((f) => [f.path, f.content]));
let stateConfig: Record<string, unknown> = { ...initialConfig };

// Apply config as early as possible (before initialize / extension host startup),
// so the Beancount extension reads the intended settings during activation.
debugLog('pre-initialize updateUserConfiguration', { keys: Object.keys(stateConfig).length });
updateUserConfiguration(JSON.stringify(stateConfig));

if (isMemfsMode) {
	for (const file of initialFiles) {
		registerFile(new RegisteredMemoryFile(URI.file(file.path), file.content));
	}
}

// --- FSA provider setup ----------------------------------------------------

// In FSA mode, replace the default `file://` provider directly.
// Using an overlay provider keeps workbench fallback path-input flow instead of browser picker.
if (isFsaMode && getFileSystemAccessWindow() && typeof FileSystemDirectoryHandle !== 'undefined') {
	try {
		await createIndexedDBProviders();
		await initFile(
			fsaWorkspaceUri,
			JSON.stringify({ folders: [] }),
		);
		registerHTMLFileSystemProvider();
		debugLog('browser file system access provider enabled');
	} catch (error) {
		console.warn('[playground] failed to enable browser file system access provider', error);
	}
}

// --- Workbench initialisation ----------------------------------------------

debugLog('before initialize');
let initResolved = false;
const workspaceProvider = isFsaMode
	? {
		open: async () => false,
		workspace: { workspaceUri: fsaWorkspaceUri, label: 'FSA' },
		trusted: true,
	}
	: undefined;

const initPromise = initialize(
	{
		productConfiguration: {
			extensionsGallery: {
				serviceUrl: 'https://open-vsx.org/vscode/gallery',
				itemUrl: 'https://open-vsx.org/vscode/item',
				resourceUrlTemplate: 'https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}',
			},
			linkProtectionTrustedDomains: ['https://open-vsx.org'],
		},
		workspaceProvider,
	},
	{ container: document.getElementById('workbench')! },
)
	.then(() => {
		initResolved = true;
		debugLog('initialize resolved');
	})
	.catch((error: unknown) => {
		console.error('[playground] initialize failed', error);
	});

// In production builds, initialize() can appear "stuck" even though the workbench partially works.
// Don't block config/hash on that; continue after a short timeout and apply config anyway.
let initTimedOut = false;
await Promise.race([
	initPromise,
	new Promise<void>((resolve) => {
		setTimeout(() => {
			initTimedOut = true;
			debugLog('initialize timed out (continuing anyway)');
			resolve();
		}, INIT_TIMEOUT_MS);
	}),
]);
debugLog('after initialize race', { initResolved, initTimedOut });

// --- Post-init patches & config --------------------------------------------

if (isFsaMode) {
	await patchSearchServiceForGlobFindFiles();
	await patchFsaProviderHandleResolution();
	await commands.executeCommand('workbench.action.closeAllEditors');
}

debugLog('applied initial stateConfig', { keys: Object.keys(stateConfig).length });
await applyConfigHard('init apply', stateConfig);
setTimeout(() => {
	logConfigSnapshot('init apply (next tick)');
}, 0);

// If initialize resolves later, re-apply once more to defeat late default overrides.
void initPromise.then(async () => {
	if (isFsaMode) {
		await patchSearchServiceForGlobFindFiles();
		await patchFsaProviderHandleResolution();
	}
	await applyConfigHard('init apply (post-initialize)', stateConfig);
});

// --- Share-hash live tracking ----------------------------------------------

let shareHashTimer: ReturnType<typeof setTimeout> | undefined;
function updateShareHashSoon() {
	if (!isMemfsMode) {
		return;
	}
	if (shareHashTimer != null) {
		globalThis.clearTimeout(shareHashTimer);
	}
	shareHashTimer = globalThis.setTimeout(() => {
		void updateShareHashNow();
	}, 600);
}

async function updateShareHashNow() {
	if (!isMemfsMode) {
		return;
	}
	debugLog('updateShareHashNow start');
	const files = Array.from(stateFiles.entries())
		.filter(([path]) => path.startsWith(PROJECT_PATH_PREFIX))
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, content]) => ({ path, content }));
	const state: ShareStateV1 = {
		v: 1,
		files,
		config: stateConfig,
		activeFile,
	};
	await setShareHash(state);
	debugLog('updateShareHashNow done', { files: files.length, activeFile });
}

function refreshTrackedConfig() {
	const cfg = workspace.getConfiguration();
	const next: Record<string, unknown> = {};
	const diffs: Array<{ key: string; expected: unknown; actual: unknown }> = [];
	for (const key of Object.keys(stateConfig)) {
		const actual = cfg.get(key);
		next[key] = actual;
		const expected = stateConfig[key];
		// Shallow-ish compare for logging only.
		if (JSON.stringify(actual) !== JSON.stringify(expected)) {
			diffs.push({ key, expected, actual });
		}
	}
	// Keep config stable by preserving insertion order of stateConfig keys
	stateConfig = { ...stateConfig, ...next };
	debugLog('refreshTrackedConfig', { diffs: diffs.slice(0, 10), diffCount: diffs.length });
	logConfigSnapshot('refreshTrackedConfig snapshot');
}

// --- Event listeners -------------------------------------------------------

workspace.onDidChangeTextDocument((e) => {
	if (!isProjectFile(e.document.uri)) {
		return;
	}
	stateFiles.set(e.document.uri.path, e.document.getText());
	updateShareHashSoon();
});

workspace.onDidOpenTextDocument((doc) => {
	if (!isProjectFile(doc.uri)) {
		return;
	}
	if (!stateFiles.has(doc.uri.path)) {
		stateFiles.set(doc.uri.path, doc.getText());
		updateShareHashSoon();
	}
});

window.onDidChangeActiveTextEditor((editor) => {
	if (!editor || !isProjectFile(editor.document.uri)) {
		return;
	}
	activeFile = editor.document.uri.path;
	updateShareHashSoon();
});

workspace.onDidChangeConfiguration(() => {
	debugLog('onDidChangeConfiguration');
	refreshTrackedConfig();
	updateShareHashSoon();
});

workspace.onDidChangeWorkspaceFolders(() => {
	if (isFsaMode) {
		void alignFsaWorkspaceFolderHandles();
	}
});

// --- Demo commands ---------------------------------------------------------

commands.registerCommand('demo.copyShareUrl', async () => {
	if (!isMemfsMode) {
		void window.showInformationMessage('Share URL is only available in memfs mode.');
		return;
	}
	await updateShareHashNow();
	const url = globalThis.location.href;
	try {
		await navigator.clipboard.writeText(url);
		void window.showInformationMessage('Share URL copied.');
	} catch {
		globalThis.prompt('Copy this URL', url);
	}
});

commands.registerCommand('demo.resetDemo', () => {
	if (!isMemfsMode) {
		void window.showInformationMessage('Reset is only available in memfs mode.');
		return;
	}
	const nextUrl = `${globalThis.location.pathname}${globalThis.location.search}#`;
	globalThis.history.replaceState(null, '', nextUrl);
	globalThis.location.reload();
});

commands.registerCommand('demo.openLocalWorkspace', () => {
	void openLocalWorkspaceFolder();
});

refreshTrackedConfig();
updateShareHashSoon();

// --- LSP client VSIX -------------------------------------------------------

try {
	await lspClientReady();
} catch (error) {
	console.error('[lspClient] ready failed', error);
}
logConfigSnapshot('after lspClientReady (before re-apply)');

// Some bundled contributions register configuration defaults late in production builds
// (e.g. editor.codeLens=false). Re-apply our desired config after the VSIX is ready.
await applyConfigHard('post-vsix apply', stateConfig);
setTimeout(() => {
	logConfigSnapshot('post-vsix apply (next tick)');
}, 0);

// --- Status bar items ------------------------------------------------------

if (isMemfsMode) {
	addStatusBarItem('Share', 'Copy a fully reproducible URL (includes files + config)', 'demo.copyShareUrl', 200);
	addStatusBarItem('Reset', 'Reset demo to defaults', 'demo.resetDemo', 199);
}
if (isFsaMode) {
	addStatusBarItem('Open Local', 'Open a local folder via Browser File System Access API', 'demo.openLocalWorkspace', 198);
}

// --- Extension activation --------------------------------------------------

await activateTargetExtension();

// --- Open initial file -----------------------------------------------------

if (isMemfsMode) {
	if (activeFile && activeFile.startsWith(PROJECT_PATH_PREFIX) && stateFiles.has(activeFile)) {
		await openProjectFile(activeFile);
	} else {
		activeFile = DEFAULT_MAIN_BEAN;
		await openProjectFile(activeFile);
	}
} else {
	void window.showInformationMessage('File System Access mode enabled. Click "Open Local" to pick a folder.');
}

// Switch sidebar back to Explorer and focus the editor if a file is open.
await commands.executeCommand('workbench.view.explorer');
if (window.activeTextEditor) {
	await commands.executeCommand('workbench.action.focusActiveEditorGroup');
}
