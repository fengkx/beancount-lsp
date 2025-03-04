import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import {
	clientLogger,
	createClientOptions,
	setupConfigurationWatchers,
	setupCustomMessageHandlers,
	setupLogger,
	setupQueueInit,
	setupStatusBar,
} from '../common/client';
import { ExtensionContext } from '../common/types';
import { resolveWebTreeSitterWasmPath } from '../common/utils';

// Explicitly declare types for the browser environment
declare const Worker: any;

let client: LanguageClient;
let statusBarItem: vscode.StatusBarItem;

// This is the browser-specific implementation
export function activate(context: vscode.ExtensionContext): void {
	// Initialize logger
	setupLogger();

	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = '$(sync~spin) Beancount: Initializing...';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// Show notification that this is experimental
	vscode.window.showInformationMessage(
		'Beancount LSP browser extension is experimental and might have limited functionality compared to the desktop version.',
	);

	try {
		// Resolve the web-tree-sitter.wasm path
		const webTreeSitterWasmPath = resolveWebTreeSitterWasmPath(context);
		// Options to control the language client
		const clientOptions = createClientOptions({
			...webTreeSitterWasmPath ? { webTreeSitterWasmPath } : {},
		});

		// Following Microsoft example pattern for creating the client
		client = createWorkerLanguageClient(context, clientOptions);

		// Create the extension context object
		const extensionContext: ExtensionContext<'browser'> = {
			context,
			client,
			statusBarItem,
		};

		// Set up status bar updates
		setupStatusBar(extensionContext);

		// Set up custom message handlers
		setupCustomMessageHandlers(extensionContext);

		// Set up configuration watchers
		setupConfigurationWatchers(extensionContext);

		// Start the client. This will also launch the server
		client.start();

		// Setup queue init
		setupQueueInit(extensionContext);

		// Log when the extension is activated
		clientLogger.info('Beancount LSP browser extension is now active');
	} catch (err) {
		// Log any errors during activation
		clientLogger.error(`Error activating browser extension: ${err instanceof Error ? err.message : String(err)}`);

		// Show an error message
		vscode.window.showErrorMessage(
			`Failed to activate Beancount LSP browser extension: ${err instanceof Error ? err.message : String(err)}`,
		);

		// Update status bar to show error
		statusBarItem.text = '$(error) Beancount: Error';
		statusBarItem.show();
	}
}

/**
 * Creates a language client that uses a web worker for the language server
 */
function createWorkerLanguageClient(context: vscode.ExtensionContext, clientOptions: any) {
	// Get path to the server's worker script
	const workerPath = vscode.Uri.joinPath(context.extensionUri, 'server', 'browser', 'server.js');
	clientLogger.info(`Worker path: ${workerPath.toString()}`);

	// Create a web worker
	const worker = new Worker(workerPath.toString());

	// Create the language client
	return new LanguageClient(
		'beanLsp',
		'BeanCount Language Server (Browser)',
		clientOptions,
		worker,
	);
}

export function deactivate(): Promise<void> {
	if (!client) {
		return Promise.resolve();
	}
	return client.stop();
}
