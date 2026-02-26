import { TextDocument } from 'vscode-languageserver-textdocument';
import type { Diagnostic, Range } from 'vscode-languageserver';

export class InMemoryDocumentStore {
	private docs = new Map<string, TextDocument>();
	public readonly onDidChangeContent2 = () => ({ dispose() {} });
	public readonly sentDiagnostics: Array<{ uri: string; diagnostics: Diagnostic[] }> = [];

	constructor(initialDocs: Record<string, string>) {
		for (const [uri, text] of Object.entries(initialDocs)) {
			this.set(uri, text);
		}
	}

	set(uri: string, text: string): TextDocument {
		const prev = this.docs.get(uri);
		const version = (prev?.version ?? 0) + 1;
		const doc = TextDocument.create(uri, 'beancount', version, text);
		this.docs.set(uri, doc);
		return doc;
	}

	get(uri: string): TextDocument | undefined {
		return this.docs.get(uri);
	}

	async retrieve(uri: string): Promise<TextDocument> {
		const doc = this.docs.get(uri);
		if (!doc) throw new Error(`Document not found: ${uri}`);
		return doc;
	}

	all(): TextDocument[] {
		return Array.from(this.docs.values());
	}

	keys(): string[] {
		return Array.from(this.docs.keys());
	}

	onDidChangeContentDebounced(): { dispose(): void } {
		return { dispose() {} };
	}

	removeFile(uri: string): boolean {
		// Mirrors DocumentStore.removeFile semantics: clear only retrieved file cache,
		// not LSP-opened documents tracked by TextDocuments.
		return this.docs.has(uri);
	}

	isOpen(uri: string): boolean {
		return this.docs.has(uri);
	}

	async getMainBeanFileUri(): Promise<string | null> {
		return this.keys()[0] ?? null;
	}
}

type ListenerFn = (...args: unknown[]) => unknown;

export function positionAt(text: string, needle: string, offsetInNeedle = 0): { line: number; character: number } {
	const index = text.indexOf(needle);
	if (index < 0) {
		throw new Error(`Needle not found: ${needle}`);
	}
	const abs = index + offsetInNeedle;
	const prefix = text.slice(0, abs);
	const lines = prefix.split('\n');
	return {
		line: lines.length - 1,
		character: lines[lines.length - 1]?.length ?? 0,
	};
}

export function rangeForOccurrence(text: string, needle: string, occurrence = 0): Range {
	let searchFrom = 0;
	let index = -1;
	for (let i = 0; i <= occurrence; i++) {
		index = text.indexOf(needle, searchFrom);
		if (index < 0) throw new Error(`Needle not found: ${needle}#${occurrence}`);
		searchFrom = index + needle.length;
	}
	const startPrefix = text.slice(0, index);
	const endPrefix = text.slice(0, index + needle.length);
	const s = startPrefix.split('\n');
	const e = endPrefix.split('\n');
	return {
		start: { line: s.length - 1, character: s[s.length - 1]?.length ?? 0 },
		end: { line: e.length - 1, character: e[e.length - 1]?.length ?? 0 },
	};
}

export function makeFakeConnection(options?: {
	configBySection?: Record<string, unknown>;
	legacyConfig?: unknown;
	workspaceFolders?: { uri: string; name: string }[];
}) {
	const sentDiagnostics: Array<{ uri: string; diagnostics: Diagnostic[] }> = [];
	const configurationRequests: Array<unknown> = [];
	const listeners: Record<string, ListenerFn[]> = {};

	const connection = {
		workspace: {
			async getConfiguration(arg?: { section?: string; scopeUri?: string }) {
				configurationRequests.push(arg);
				if (arg?.section && options?.configBySection && arg.section in options.configBySection) {
					return options.configBySection[arg.section];
				}
				return options?.legacyConfig ?? {};
			},
			async getWorkspaceFolders() {
				return options?.workspaceFolders ?? [];
			},
		},
		sendDiagnostics(payload: { uri: string; diagnostics: Diagnostic[] }) {
			sentDiagnostics.push(payload);
		},
		onExit(cb: ListenerFn) {
			(listeners['exit'] ||= []).push(cb);
		},
		onReferences(cb: ListenerFn) {
			(listeners['references'] ||= []).push(cb);
		},
		onRenameRequest(cb: ListenerFn) {
			(listeners['rename'] ||= []).push(cb);
		},
		onPrepareRename(cb: ListenerFn) {
			(listeners['prepareRename'] ||= []).push(cb);
		},
	} as unknown as import('vscode-languageserver').Connection;

	return {
		connection,
		sentDiagnostics,
		configurationRequests,
		listeners,
	};
}
