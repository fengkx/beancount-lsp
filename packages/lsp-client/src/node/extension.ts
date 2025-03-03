import * as vscode from 'vscode';
import { LanguageClient, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import {
	clientLogger,
	createClientOptions,
	setupConfigurationWatchers,
	setupCustomMessageHandlers,
	setupLogger,
	setupStatusBar,
} from '../common/client';
import { ExtensionContext } from '../common/types';
import { resolveWebTreeSitterWasmPath } from '../common/utils';

let client: LanguageClient;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	// Initialize logger
	setupLogger();

	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = '$(sync~spin) Beancount: Initializing...';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// The server is implemented in node
	const serverModule = vscode.Uri.joinPath(vscode.Uri.file(context.extensionPath), 'server', 'node.js').fsPath;

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions,
		},
	};

	// Resolve the web-tree-sitter.wasm path
	const webTreeSitterWasmPath = resolveWebTreeSitterWasmPath(context);

	// Options to control the language client
	const clientOptions = createClientOptions({ webTreeSitterWasmPath });

	// Create the language client and start the client.
	client = new LanguageClient(
		'beanLsp',
		'BeanCount Language Server',
		serverOptions,
		clientOptions,
	);

	// Create the extension context object
	const extensionContext: ExtensionContext = {
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

	// Log when the extension is activated
	clientLogger.info('Beancount LSP extension is now active');
}

export function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
