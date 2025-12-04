import { LANGUAGE_ID, Logger } from '@bean-lsp/shared';
import { glob } from 'fast-glob';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Emitter, Event, Range, WorkspaceFolder } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';
import type { TextDocumentChange2 } from '../common/document-store';

/**
 * CLI version of DocumentStore that doesn't require a Connection.
 * Loads files directly from the filesystem.
 */
export class DocumentStoreCLI {
	private readonly _documents = new Map<string, TextDocument>();
	private readonly _decoder = new TextDecoder();
	private readonly _logger = new Logger('DocumentStoreCLI');

	private _beanFiles: string[] = [];
	private _workspacePath: string;

	// Dummy emitter for compatibility with Trees
	private readonly _onDidChangeContent2 = new Emitter<TextDocumentChange2>();
	readonly onDidChangeContent2: Event<TextDocumentChange2> = this._onDidChangeContent2.event;

	constructor(workspacePath: string) {
		this._workspacePath = path.resolve(workspacePath);
	}

	/**
	 * Load all beancount files in the workspace
	 */
	async loadWorkspace(): Promise<string[]> {
		this._logger.info(`Loading workspace: ${this._workspacePath}`);

		const patterns = ['**/*.bean', '**/*.beancount'];
		const ignore = ['**/node_modules/**', '**/.git/**', '**/.venv/**'];

		const files = await glob(patterns, {
			cwd: this._workspacePath,
			ignore,
			absolute: true,
		});

		this._logger.info(`Found ${files.length} beancount files`);

		// Load all files
		for (const filePath of files) {
			await this._loadFile(filePath);
		}

		this._beanFiles = [...this._documents.keys()];
		return this._beanFiles;
	}

	/**
	 * Load a single file from disk
	 */
	private async _loadFile(filePath: string): Promise<TextDocument> {
		const uri = URI.file(filePath).toString();

		// Check if already loaded
		const existing = this._documents.get(uri);
		if (existing) {
			return existing;
		}

		try {
			const content = fs.readFileSync(filePath, 'utf-8');
			const doc = TextDocument.create(uri, LANGUAGE_ID, 1, content);
			this._documents.set(uri, doc);
			return doc;
		} catch (err) {
			this._logger.error(`Failed to load file ${filePath}: ${err}`);
			throw err;
		}
	}

	/**
	 * Retrieve a document by URI
	 */
	async retrieve(uri: string): Promise<TextDocument> {
		const existing = this._documents.get(uri);
		if (existing) {
			return existing;
		}

		// Try to load from disk
		const parsedUri = URI.parse(uri);
		if (parsedUri.scheme === 'file') {
			return this._loadFile(parsedUri.fsPath);
		}

		throw new Error(`Document not found: ${uri}`);
	}

	/**
	 * Get all loaded documents
	 */
	all(): TextDocument[] {
		return [...this._documents.values()];
	}

	/**
	 * Get bean file URIs
	 */
	get beanFiles(): string[] {
		return this._beanFiles;
	}

	/**
	 * Get workspace folder info (for compatibility)
	 */
	getWorkspaceFolder(): WorkspaceFolder {
		return {
			uri: URI.file(this._workspacePath).toString(),
			name: path.basename(this._workspacePath),
		};
	}

	/**
	 * Refetch bean files (for compatibility with DocumentStore interface)
	 */
	async refetchBeanFiles(): Promise<void> {
		// In CLI mode, files are already loaded
		// Just update the list
		this._beanFiles = [...this._documents.keys()];
	}

	/**
	 * Remove a file from the store
	 */
	removeFile(uri: string): boolean {
		return this._documents.delete(uri);
	}

	/**
	 * Check if a document exists
	 */
	has(uri: string): boolean {
		return this._documents.has(uri);
	}

	/**
	 * Get a document if it exists (for Trees compatibility)
	 */
	get(uri: string): TextDocument | undefined {
		return this._documents.get(uri);
	}
}

