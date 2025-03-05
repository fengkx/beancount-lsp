import { CustomMessages, Logger, logLevelToString, mapTraceServerToLogLevel } from '@bean-lsp/shared';
import * as vscode from 'vscode';
// Import from base package for shared types between node and browser
import { LanguageClientOptions, State } from 'vscode-languageclient';
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
		const files = await vscode.workspace.findFiles('**/*.{bean,beancount}');
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
	const files = await vscode.workspace.findFiles(`**/*.{bean,beancount}`);

	ctx.client.sendRequest(CustomMessages.QueueInit, files.map(f => f.toString()));
}
