import { createHash } from 'node:crypto';
import { chmod, mkdir, mkdtemp, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { URI } from 'vscode-uri';
import type { SourceFileSnapshot, SourceSnapshot, SourceSnapshotChange } from '../common/ledger/snapshots';

const SHADOW_PREFIX = 'beancount-lsp-';
const MAX_OLD_SHADOW_AGE_MS = 24 * 60 * 60 * 1000;
const INCLUDE_PATTERN = /(^\s*include\s+")([^"]+)("\s*$)/gm;

export class ShadowWorkspace {
	private sessionRoot?: string;
	private contextRoot?: string;
	private originalRoot?: string;
	private mainFileUri?: string;
	private readonly runtimeToSource = new Map<string, string>();
	private readonly sourceToRuntime = new Map<string, string>();

	async reset(snapshot: SourceSnapshot): Promise<void> {
		await this.ensureSessionRoot();
		this.originalRoot = fileURLToPath(snapshot.workspaceUri);
		this.mainFileUri = snapshot.mainFileUri;
		const contextHash = createHash('sha256').update(snapshot.contextId).digest('hex').slice(0, 16);
		this.contextRoot = join(this.sessionRoot!, contextHash);
		await rm(this.contextRoot, { recursive: true, force: true });
		await mkdir(this.contextRoot, { recursive: true, mode: 0o700 });
		this.runtimeToSource.clear();
		this.sourceToRuntime.clear();
		for (const file of snapshot.files.values()) await this.writeSourceFile(file);
	}

	async sync(change: SourceSnapshotChange): Promise<void> {
		if (!this.contextRoot) throw new Error('Shadow workspace is not initialized');
		for (const uri of change.removed) {
			const runtimePath = this.sourceToRuntime.get(uri);
			if (!runtimePath) continue;
			await rm(runtimePath, { force: true });
			this.sourceToRuntime.delete(uri);
			this.runtimeToSource.delete(runtimePath);
		}
		for (const file of change.updates) await this.writeSourceFile(file);
	}

	get mainFilePath(): string {
		if (!this.mainFileUri) throw new Error('Shadow workspace has no main file');
		return this.runtimePathFor(this.mainFileUri);
	}

	get workspaceRoot(): string {
		if (!this.originalRoot) throw new Error('Shadow workspace is not initialized');
		return this.originalRoot;
	}

	mapRuntimePath(path: string): string {
		return this.runtimeToSource.get(resolve(path)) ?? path;
	}

	mapSourcePath(pathOrUri: string): string {
		const uri = pathOrUri.includes('://') ? pathOrUri : URI.file(pathOrUri).toString();
		return this.sourceToRuntime.get(uri) ?? pathOrUri;
	}

	private async writeSourceFile(file: SourceFileSnapshot): Promise<void> {
		const runtimePath = this.runtimePathFor(file.uri);
		await mkdir(dirname(runtimePath), { recursive: true, mode: 0o700 });
		const text = this.rewriteIncludes(file.uri, file.text);
		const tempPath = `${runtimePath}.tmp-${process.pid}-${Date.now()}`;
		await writeFile(tempPath, text, { encoding: 'utf8', mode: 0o600 });
		await rename(tempPath, runtimePath);
		await chmod(runtimePath, 0o600);
		this.sourceToRuntime.set(file.uri, runtimePath);
		this.runtimeToSource.set(resolve(runtimePath), fileURLToPath(file.uri));
	}

	private rewriteIncludes(sourceUri: string, text: string): string {
		if (!this.originalRoot || !this.contextRoot) return text;
		const sourceDirectory = dirname(fileURLToPath(sourceUri));
		INCLUDE_PATTERN.lastIndex = 0;
		return text.replace(INCLUDE_PATTERN, (_whole, prefix: string, target: string, suffix: string) => {
			const resolvedTarget = resolve(isAbsolute(target) ? target : join(sourceDirectory, target));
			const rel = relative(this.originalRoot!, resolvedTarget);
			const rewrittenTarget = rel.startsWith('..') || isAbsolute(rel) || rel.split(sep).includes('..')
				? resolvedTarget
				: join(this.contextRoot!, rel);
			return `${prefix}${rewrittenTarget}${suffix}`;
		});
	}

	private runtimePathFor(uri: string): string {
		if (!this.originalRoot || !this.contextRoot) throw new Error('Shadow workspace is not initialized');
		const sourcePath = fileURLToPath(uri);
		const rel = relative(this.originalRoot, sourcePath);
		if (rel.startsWith('..') || isAbsolute(rel) || rel.split(sep).includes('..')) {
			throw new Error(`File is outside the ledger workspace: ${sourcePath}`);
		}
		return join(this.contextRoot, rel);
	}

	private async ensureSessionRoot(): Promise<void> {
		if (this.sessionRoot) return;
		await ShadowWorkspace.cleanupOldSessions();
		this.sessionRoot = await mkdtemp(join(tmpdir(), SHADOW_PREFIX));
		await chmod(this.sessionRoot, 0o700);
	}

	async dispose(): Promise<void> {
		if (this.sessionRoot) await rm(this.sessionRoot, { recursive: true, force: true });
		this.sessionRoot = undefined;
		this.contextRoot = undefined;
		this.runtimeToSource.clear();
		this.sourceToRuntime.clear();
	}

	private static async cleanupOldSessions(): Promise<void> {
		let entries: string[];
		try {
			entries = await readdir(tmpdir());
		} catch {
			return;
		}
		await Promise.all(
			entries.filter(name => name.startsWith(SHADOW_PREFIX)).map(async name => {
				const path = join(tmpdir(), name);
				try {
					const info = await stat(path);
					if (Date.now() - info.mtimeMs > MAX_OLD_SHADOW_AGE_MS) {
						await rm(path, { recursive: true, force: true });
					}
				} catch {
					// Another server may have removed the path concurrently.
				}
			}),
		);
	}
}
