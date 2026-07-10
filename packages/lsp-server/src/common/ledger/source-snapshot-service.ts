import { Emitter, Event } from 'vscode-languageserver';
import { URI, Utils as UriUtils } from 'vscode-uri';
import { DocumentStore } from '../document-store';
import {
	createLedgerContextId,
	IncludeGraph,
	SourceFileSnapshot,
	SourceSnapshot,
	SourceSnapshotChange,
} from './snapshots';

const INCLUDE_PATTERN = /^\s*include\s+"([^"]+)"/gm;

export class SourceSnapshotService {
	private revision = 0;
	private files = new Map<string, SourceFileSnapshot>();
	private currentSnapshot: SourceSnapshot;
	private readonly contextId: string;
	private readonly onDidChangeEmitter = new Emitter<SourceSnapshotChange>();
	readonly onDidChange: Event<SourceSnapshotChange> = this.onDidChangeEmitter.event;

	constructor(
		private readonly documents: DocumentStore,
		readonly workspaceUri: string,
		readonly mainFileUri: string,
	) {
		this.contextId = createLedgerContextId(workspaceUri, mainFileUri);
		this.currentSnapshot = this.buildSnapshot();
	}

	get snapshot(): SourceSnapshot {
		return this.currentSnapshot;
	}

	async reset(uris: readonly string[]): Promise<SourceSnapshot> {
		const next = new Map<string, SourceFileSnapshot>();
		for (const uri of uris) {
			if (!this.isManagedBeanFile(uri)) continue;
			const document = await this.documents.retrieve(uri);
			next.set(uri, {
				uri,
				text: document.getText(),
				documentVersion: this.documents.isOpen(uri) ? document.version : undefined,
				origin: this.documents.isOpen(uri) ? 'open-buffer' : 'disk',
			});
		}
		if (!next.has(this.mainFileUri)) {
			const main = await this.documents.retrieve(this.mainFileUri);
			next.set(this.mainFileUri, {
				uri: this.mainFileUri,
				text: main.getText(),
				documentVersion: this.documents.isOpen(this.mainFileUri) ? main.version : undefined,
				origin: this.documents.isOpen(this.mainFileUri) ? 'open-buffer' : 'disk',
			});
		}
		const removed = [...this.files.keys()].filter(uri => !next.has(uri));
		this.files = next;
		this.commit([...next.values()], removed);
		return this.currentSnapshot;
	}

	update(
		uri: string,
		text: string,
		documentVersion?: number,
		origin: SourceFileSnapshot['origin'] = 'open-buffer',
	): void {
		if (!this.isManagedBeanFile(uri)) return;
		const previous = this.files.get(uri);
		if (previous?.text === text && previous.documentVersion === documentVersion && previous.origin === origin) {
			return;
		}
		const file = { uri, text, documentVersion, origin } satisfies SourceFileSnapshot;
		this.files.set(uri, file);
		this.commit([file], []);
	}

	remove(uri: string): void {
		if (!this.files.delete(uri)) return;
		this.commit([], [uri]);
	}

	private commit(updates: readonly SourceFileSnapshot[], removed: readonly string[]): void {
		this.revision += 1;
		this.currentSnapshot = this.buildSnapshot();
		this.onDidChangeEmitter.fire({
			contextId: this.contextId,
			revision: this.revision,
			updates,
			removed,
		});
	}

	private buildSnapshot(): SourceSnapshot {
		const includeGraph = this.buildIncludeGraph();
		return {
			contextId: this.contextId,
			workspaceUri: this.workspaceUri,
			mainFileUri: this.mainFileUri,
			revision: this.revision,
			files: new Map(this.files),
			reachableUris: this.findReachable(includeGraph),
			includeGraph,
		};
	}

	private buildIncludeGraph(): IncludeGraph {
		const edges = new Map<string, ReadonlySet<string>>();
		const unresolved = new Map<string, readonly string[]>();
		for (const [uri, file] of this.files) {
			const targets = new Set<string>();
			const missing: string[] = [];
			INCLUDE_PATTERN.lastIndex = 0;
			for (let match = INCLUDE_PATTERN.exec(file.text); match; match = INCLUDE_PATTERN.exec(file.text)) {
				const raw = match[1]!;
				const resolved = this.resolveInclude(uri, raw);
				if (resolved && this.files.has(resolved)) targets.add(resolved);
				else missing.push(raw);
			}
			edges.set(uri, targets);
			if (missing.length > 0) unresolved.set(uri, missing);
		}
		return { edges, unresolved };
	}

	private resolveInclude(fromUri: string, raw: string): string | null {
		if (/[*?[]/.test(raw)) return null;
		try {
			if (raw.startsWith('file:')) return URI.parse(raw).toString();
			if (raw.startsWith('/')) return URI.file(raw).toString();
			return UriUtils.resolvePath(UriUtils.dirname(URI.parse(fromUri)), raw).toString();
		} catch {
			return null;
		}
	}

	private findReachable(graph: IncludeGraph): ReadonlySet<string> {
		const reachable = new Set<string>();
		const pending = [this.mainFileUri];
		while (pending.length > 0) {
			const uri = pending.pop()!;
			if (reachable.has(uri)) continue;
			reachable.add(uri);
			for (const target of graph.edges.get(uri) ?? []) pending.push(target);
		}
		return reachable;
	}

	private isManagedBeanFile(uri: string): boolean {
		const parent = this.workspaceUri.endsWith('/') ? this.workspaceUri : `${this.workspaceUri}/`;
		return (uri === this.workspaceUri || uri.startsWith(parent))
			&& (uri.endsWith('.bean') || uri.endsWith('.beancount'));
	}

	dispose(): void {
		this.onDidChangeEmitter.dispose();
	}
}
