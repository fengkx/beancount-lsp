import { CustomMessages, Logger, logLevelToString, mapTraceServerToLogLevel } from '@bean-lsp/shared';
import * as vscode from 'vscode';
// Import from base package for shared types between node and browser
import { LanguageClientOptions, State } from 'vscode-languageclient';
import { Utils as UriUtils } from 'vscode-uri';
import { ClientOptions, ExtensionContext } from './types';

// Create a client logger
export const clientLogger: Logger = new Logger('Client');

/**
 * Sets up and configures the client logger based on configuration
 */
export function setupLogger(): void {
	const config = vscode.workspace.getConfiguration('beanLsp');
	const traceServerConfig = config.get<string>('trace.server', 'messages');
	const logLevel = mapTraceServerToLogLevel(traceServerConfig);
	clientLogger.setLevel(logLevel);
	clientLogger.info(`Log level set to ${logLevelToString(logLevel)} (from trace.server: ${traceServerConfig})`);
}

/**
 * Generates exclude pattern for file searching, respecting .gitignore files
 * in subdirectories similar to VSCode's search.useIgnoreFiles setting
 */
export async function generateExcludePattern(): Promise<string> {
	// Get standard exclude patterns from VSCode settings
	const searchExclude = vscode.workspace.getConfiguration('search', null).get('exclude') ?? {};
	const filesExclude = vscode.workspace.getConfiguration('files', null).get('exclude') ?? {};

	// Convert exclude objects to properly formatted glob patterns
	const standardExcludes = [
		...Object.entries(searchExclude).map(([pattern]) => sanitizeGlobPattern(pattern)),
		...Object.entries(filesExclude).map(([pattern]) => sanitizeGlobPattern(pattern)),
	];

	// Check if we should respect .gitignore files
	const respectIgnoreFiles = vscode.workspace.getConfiguration('search', null).get('useIgnoreFiles', true);

	if (!respectIgnoreFiles) {
		// If not respecting ignore files, just return the standard excludes
		return `{${standardExcludes.join(',')}}`;
	}

	try {
		// Get all .gitignore patterns from workspace folders and their subdirectories
		const gitignorePatterns = await collectGitignorePatterns();

		// Combine standard excludes with .gitignore patterns
		const allExcludes = [...standardExcludes, ...gitignorePatterns];

		// Create the exclude pattern string
		return `{${allExcludes.join(',')}}`;
	} catch (err) {
		clientLogger.warn(`Error generating exclude patterns: ${err}`);
		// Fall back to standard excludes if there's an error
		return `{${standardExcludes.join(',')}}`;
	}
}

/**
 * Sanitizes glob pattern by removing redundant slashes
 */
export function sanitizeGlobPattern(pattern: string): string {
	// Remove multiple consecutive slashes (replace // or /// etc with /)
	return pattern.replace(/\/+/g, '/');
}

/**
 * Collects patterns from .gitignore files in workspace folders and their subdirectories
 */
export async function collectGitignorePatterns(): Promise<string[]> {
	const patterns: string[] = [];

	// Process each workspace folder
	if (vscode.workspace.workspaceFolders) {
		for (const folder of vscode.workspace.workspaceFolders) {
			try {
				// Find all .gitignore files in this workspace folder
				const gitignoreFiles = await vscode.workspace.findFiles(
					new vscode.RelativePattern(folder, '**/.gitignore'),
					null,
				);

				// Process each .gitignore file
				for (const fileUri of gitignoreFiles) {
					try {
						// Use vscode.workspace.fs to read file content - works in both environments
						const contentUint8Array = await vscode.workspace.fs.readFile(fileUri);
						const content = new TextDecoder().decode(contentUint8Array);

						// Get the directory URI containing the .gitignore file
						const dirUri = UriUtils.dirname(fileUri);

						// Calculate relative path from workspace root to the directory
						let relativeDirPath = '';
						if (dirUri.toString() !== folder.uri.toString()) {
							// Get workspace folder path segments
							const workspacePathSegments = folder.uri.path.split('/').filter(segment =>
								segment.length > 0
							);

							// Get directory path segments
							const dirPathSegments = dirUri.path.split('/').filter(segment => segment.length > 0);

							// Find the segments that are unique to the dir path (not in workspace path)
							// This is a simple way to calculate the relative path without 'path' module
							if (dirPathSegments.length > workspacePathSegments.length) {
								const relativeSegments = dirPathSegments.slice(workspacePathSegments.length);
								relativeDirPath = relativeSegments.join('/');
							}
						}

						// Parse and process the patterns from the .gitignore file
						const filePatterns = parseGitignorePatterns(content, relativeDirPath);
						patterns.push(...filePatterns);
					} catch (err) {
						clientLogger.warn(`Error reading .gitignore file ${fileUri.toString()}: ${err}`);
					}
				}
			} catch (err) {
				clientLogger.warn(`Error processing workspace folder ${folder.name}: ${err}`);
			}
		}
	}

	return patterns;
}

/**
 * Parses .gitignore file content and converts patterns to VSCode glob patterns
 */
export function parseGitignorePatterns(content: string, relativeDirPath: string): string[] {
	const patterns: string[] = [];

	const lines = content.split('\n');
	for (let line of lines) {
		// Skip comments and empty lines
		line = line.trim();
		if (!line || line.startsWith('#')) {
			continue;
		}

		// Handle negation (!) in .gitignore - we can't easily support this in the exclude pattern
		if (line.startsWith('!')) {
			continue;
		}

		// Convert .gitignore pattern to VSCode glob pattern
		let pattern = line;

		// If the .gitignore is in a subdirectory, patterns should be relative to that directory
		if (relativeDirPath && relativeDirPath.length > 0) {
			// For .gitignore, patterns are relative to the .gitignore file location
			// So we need to prepend the relative directory path

			// Don't add the directory prefix for patterns that start with **/ already
			if (!pattern.startsWith('**/')) {
				pattern = `${relativeDirPath}/${pattern}`;
			}
		}

		// For patterns from root .gitignore, ensure they start with **/ to match anywhere
		// For patterns from subdirectory .gitignore, they already have the subdirectory prefix
		if (!pattern.startsWith('**/') && !relativeDirPath) {
			pattern = `**/${pattern}`;
		}

		// Clean up any duplicate slashes that might have been introduced
		pattern = sanitizeGlobPattern(pattern);

		patterns.push(pattern);
	}

	return patterns;
}

/**
 * Creates and configures the language client options
 */
export function createClientOptions(options: ClientOptions): LanguageClientOptions {
	const watcher = vscode.workspace.createFileSystemWatcher('**/*.{bean,beancount}');
	watcher.onDidChange(e => {
		clientLogger.info(`File ${e.fsPath} changed`);
	});

	return {
		documentSelector: ['beancount'],
		synchronize: {
			fileEvents: watcher,
		},
		initializationOptions: {
			webTreeSitterWasmPath: options.webTreeSitterWasmPath,
			globalStorageUri: options.globalStorageUri?.toString(),
			extensionUri: options.extensionUri?.toString(),
		},
	};
}

/**
 * Sets up status bar for the client
 */
export function setupStatusBar(ctx: ExtensionContext<'browser' | 'node'>): void {
	// Update status bar when client state changes
	ctx.client.onDidChangeState((event) => {
		if (event.newState === State.Running) {
			ctx.statusBarItem.text = '$(check) Beancount: Ready';
			setTimeout(() => {
				ctx.statusBarItem.hide();
			}, 3000);
		} else if (event.newState === State.Starting) {
			ctx.statusBarItem.text = '$(sync~spin) Beancount: Initializing...';
			ctx.statusBarItem.show();
		} else {
			ctx.statusBarItem.text = '$(error) Beancount: Stopped';
			ctx.statusBarItem.show();
		}
	});
}

/**
 * Sets up custom message handlers for the client
 */
export function setupCustomMessageHandlers(ctx: ExtensionContext<'browser' | 'node'>): void {
	ctx.client.onRequest(CustomMessages.ListBeanFile, async () => {
		const exclude = await generateExcludePattern();
		const files = await vscode.workspace.findFiles('**/*.{bean,beancount}', exclude);
		const uriStrings = files.map(f => {
			return f.toString();
		});
		return uriStrings;
	});

	ctx.client.onRequest(CustomMessages.FileRead, async (raw: string): Promise<number[]> => {
		const uri = vscode.Uri.parse(raw);

		if (uri.scheme === 'vscode-notebook-cell') {
			// we are dealing with a notebook
			try {
				const doc = await vscode.workspace.openTextDocument(uri);
				return Array.from(new TextEncoder().encode(doc.getText()));
			} catch (err) {
				console.warn(err);
				return [];
			}
		}

		if (vscode.workspace.fs.isWritableFileSystem(uri.scheme) === undefined) {
			// undefined means we don't know anything about these uris
			return [];
		}

		let data: number[];
		try {
			const stat = await vscode.workspace.fs.stat(uri);
			if (stat.size > 5 * (1024 ** 2)) {
				console.warn(`IGNORING "${uri.toString()}" because it is too large (${stat.size}bytes)`);
				data = [];
			} else {
				data = Array.from(await vscode.workspace.fs.readFile(uri));
			}
			return data;
		} catch (err) {
			// graceful
			console.warn(err);
			return [];
		}
	});
}

/**
 * Sets up configuration change watchers
 */
export function setupConfigurationWatchers(ctx: ExtensionContext<'browser' | 'node'>): void {
	ctx.context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('beanLsp.trace.server')) {
				const newConfig = vscode.workspace.getConfiguration('beanLsp');
				const newTraceServer = newConfig.get<string>('trace.server', 'messages');
				const newLogLevel = mapTraceServerToLogLevel(newTraceServer);
				clientLogger.setLevel(newLogLevel);
				clientLogger.info(
					`Log level changed to ${logLevelToString(newLogLevel)} (from trace.server: ${newTraceServer})`,
				);
			}
		}),
	);
}

export async function setupQueueInit(ctx: ExtensionContext<'browser' | 'node'>): Promise<void> {
	const exclude = await generateExcludePattern();
	const files = await vscode.workspace.findFiles(`**/*.{bean,beancount}`, exclude);

	ctx.client.sendRequest(CustomMessages.QueueInit, files.map(f => f.toString()));
}

/**
 * Sets up inlay hints configuration
 */
export function setupInlayHints(ctx: ExtensionContext<'browser' | 'node'>): void {
	// Initial configuration
	updateInlayHintsConfig();

	// Watch for configuration changes
	vscode.workspace.onDidChangeConfiguration(event => {
		if (
			event.affectsConfiguration('beanLsp.inlayHints.enable')
			|| event.affectsConfiguration('editor.inlayHints.enabled')
		) {
			updateInlayHintsConfig();
		}
	});

	// Helper function to update inlay hints based on configuration
	function updateInlayHintsConfig() {
		const config = vscode.workspace.getConfiguration('beanLsp');
		const editorConfig = vscode.workspace.getConfiguration('editor');

		const isGloballyEnabled = editorConfig.get<boolean>('inlayHints.enabled', true);
		const isBeancountEnabled = config.get<boolean>('inlayHints.enable', true);

		// Log current configuration
		clientLogger.info(
			`Inlay hints globally enabled: ${isGloballyEnabled}, Beancount specific: ${isBeancountEnabled}`,
		);

		// If client is already running, refresh inlay hints
		if (ctx.client.state === State.Running) {
			// Request a refresh of inlay hints
			ctx.client.sendNotification('workspace/inlayHint/refresh');
		}
	}
}
