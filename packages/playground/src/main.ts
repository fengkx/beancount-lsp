// main.ts
import './style.css';

import '@codingame/monaco-editor-wrapper/features/workbench';
import '@codingame/monaco-editor-wrapper/features/search';
import '@codingame/monaco-editor-wrapper/features/extensionGallery';
import '@codingame/monaco-editor-wrapper/features/extensionHostWorker';
import '@codingame/monaco-editor-wrapper/features/viewPanels';
import '@codingame/monaco-vscode-api/vscode/vs/editor/contrib/codelens/browser/codelensController';
import { whenReady as lspClientReady } from '../lsp-client.vsix';

// @ts-expect-error TODO
import { initialize, registerFile, updateUserConfiguration } from '@codingame/monaco-editor-wrapper';
import { getService } from '@codingame/monaco-vscode-api';
import { IExtensionService, IExtensionsWorkbenchService } from '@codingame/monaco-vscode-api/services';
import { getBuiltinExtensions } from '@codingame/monaco-vscode-api/extensions';
import { URI } from '@codingame/monaco-vscode-api/vscode/vs/base/common/uri';
import { RegisteredMemoryFile } from '@codingame/monaco-vscode-files-service-override';
import { ExtensionIdentifier } from '@codingame/monaco-vscode-api/vscode/vs/platform/extensions/common/extensions';
import { commands, extensions, StatusBarAlignment, Uri, window, workspace } from 'vscode';
import * as pako from 'pako';
import defaultFiles from './demo-files.json';
import defaultUserConfig from './demo-user-config.json';

type DemoFile = { path: string; content: string };
type ShareStateV1 = {
	v: 1;
	files: DemoFile[];
	config: Record<string, unknown>;
	activeFile?: string;
};

const SHARE_HASH_KEY = 'bclsp=';

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

type HashCodec = 'gz';

type ShareWireV1 = { v: 1; f: Array<[string, string]>; c: Record<string, unknown>; a?: string };

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
	return parsed;
}

async function setShareHash(state: ShareStateV1) {
	const encoded = await encodeShareState(state);
	const nextHash = `#${SHARE_HASH_KEY}${encoded}`;
	const nextUrl = `${globalThis.location.pathname}${globalThis.location.search}${nextHash}`;
	globalThis.history.replaceState(null, '', nextUrl);
}

const baseConfig = {
	'workbench.activityBar.visible': true,
	'workbench.sideBar.location': 'left',
	'workbench.statusBar.visible': true,
	'editor.codeLens': true,
};

const shareFromHash = await tryLoadShareStateFromHash();
const initialFiles: DemoFile[] = shareFromHash?.files ?? (defaultFiles as DemoFile[]);
const initialConfig: Record<string, unknown> = shareFromHash
	? { ...baseConfig, ...(shareFromHash.config ?? {}) }
	: { ...baseConfig, ...(defaultUserConfig as Record<string, unknown>) };
let activeFile: string | undefined = shareFromHash?.activeFile ?? '/tmp/project/main.bean';

const stateFiles = new Map<string, string>(initialFiles.map((f) => [f.path, f.content]));
let stateConfig: Record<string, unknown> = { ...initialConfig };

for (const file of initialFiles) {
	registerFile(new RegisteredMemoryFile(URI.file(file.path), file.content));
}

await initialize(
	{
		productConfiguration: {
			extensionsGallery: {
				serviceUrl: 'https://open-vsx.org/vscode/gallery',
				itemUrl: 'https://open-vsx.org/vscode/item',
				resourceUrlTemplate: 'https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}',
			},
			linkProtectionTrustedDomains: ['https://open-vsx.org'],
		},
	},
	{ container: document.getElementById('workbench')! },
);
updateUserConfiguration(JSON.stringify(stateConfig));

let shareHashTimer: ReturnType<typeof setTimeout> | undefined;
function updateShareHashSoon() {
	if (shareHashTimer != null) {
		globalThis.clearTimeout(shareHashTimer);
	}
	shareHashTimer = globalThis.setTimeout(() => {
		void updateShareHashNow();
	}, 600);
}

async function updateShareHashNow() {
	const files = Array.from(stateFiles.entries())
		.filter(([path]) => path.startsWith('/tmp/project/'))
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([path, content]) => ({ path, content }));
	const state: ShareStateV1 = {
		v: 1,
		files,
		config: stateConfig,
		activeFile,
	};
	await setShareHash(state);
}

function refreshTrackedConfig() {
	const cfg = workspace.getConfiguration();
	const next: Record<string, unknown> = {};
	for (const key of Object.keys(stateConfig)) {
		next[key] = cfg.get(key);
	}
	// Keep config stable by preserving insertion order of stateConfig keys
	stateConfig = { ...stateConfig, ...next };
}

workspace.onDidChangeTextDocument((e) => {
	const doc = e.document;
	if (doc.uri.scheme !== 'file') {
		return;
	}
	const path = doc.uri.path;
	if (!path.startsWith('/tmp/project/')) {
		return;
	}
	stateFiles.set(path, doc.getText());
	updateShareHashSoon();
});

workspace.onDidOpenTextDocument((doc) => {
	if (doc.uri.scheme !== 'file') {
		return;
	}
	const path = doc.uri.path;
	if (!path.startsWith('/tmp/project/')) {
		return;
	}
	if (!stateFiles.has(path)) {
		stateFiles.set(path, doc.getText());
		updateShareHashSoon();
	}
});

window.onDidChangeActiveTextEditor((editor) => {
	const path = editor?.document?.uri?.scheme === 'file' ? editor.document.uri.path : undefined;
	if (!path || !path.startsWith('/tmp/project/')) {
		return;
	}
	activeFile = path;
	updateShareHashSoon();
});

workspace.onDidChangeConfiguration(() => {
	refreshTrackedConfig();
	updateShareHashSoon();
});

commands.registerCommand('demo.copyShareUrl', async () => {
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
	const nextUrl = `${globalThis.location.pathname}${globalThis.location.search}#`;
	globalThis.history.replaceState(null, '', nextUrl);
	globalThis.location.reload();
});

const shareItem = window.createStatusBarItem(StatusBarAlignment.Right, 200);
shareItem.text = '$(link-external) Share';
shareItem.tooltip = 'Copy a fully reproducible URL (includes files + config)';
shareItem.command = 'demo.copyShareUrl';
shareItem.show();

const resetItem = window.createStatusBarItem(StatusBarAlignment.Right, 199);
resetItem.text = '$(refresh) Reset';
resetItem.tooltip = 'Reset demo to defaults';
resetItem.command = 'demo.resetDemo';
resetItem.show();

refreshTrackedConfig();
updateShareHashSoon();

try {
	await lspClientReady();
} catch (error) {
	console.error('[lspClient] ready failed', error);
}
console.info('[extensions] builtin', getBuiltinExtensions().map((ext) => ext.identifier.id));

const targetExtensionId = 'fengkx.beancount-lsp-client';
const extensionService = await getService(IExtensionService);
await extensionService.whenInstalledExtensionsRegistered();
const extensionsWorkbenchService = await getService(IExtensionsWorkbenchService);
await extensionsWorkbenchService.whenInitialized;
console.info('[extensions] workbench local', extensionsWorkbenchService.local.map((ext) => ext.identifier.id));
console.info(
	'[extensions] workbench installed',
	extensionsWorkbenchService.installed.map((ext) => ext.identifier.id),
);
await extensionsWorkbenchService.openSearch('@builtin');
try {
	await extensionService.activateById(new ExtensionIdentifier(targetExtensionId), {
		startup: false,
		extensionId: new ExtensionIdentifier(targetExtensionId),
		activationEvent: 'onDemand',
	});
	console.info('[extensions] activated by service', targetExtensionId);
} catch (error) {
	console.error('[extensions] service activate failed', error);
}

const extension = extensions.getExtension(targetExtensionId);
console.info('[extensions] total', extensions.all.length);
console.info('[extensions] target', targetExtensionId, extension);
if (!extension) {
	console.warn('[extensions] target not found');
} else {
	console.info('[extensions] isActive before', extension.isActive);
	try {
		await extension.activate();
		console.info('[extensions] isActive after', extension.isActive);
	} catch (error) {
		console.error('[extensions] activate failed', error);
	}
}

if (activeFile && activeFile.startsWith('/tmp/project/') && stateFiles.has(activeFile)) {
	await commands.executeCommand('vscode.open', Uri.file(activeFile));
} else {
	activeFile = '/tmp/project/main.bean';
	await commands.executeCommand('vscode.open', Uri.file(activeFile));
}
await commands.executeCommand('workbench.view.extensions');
await extensionsWorkbenchService.openSearch('@builtin');
