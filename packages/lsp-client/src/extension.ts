// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { CustomMessages, Logger, LogLevel, logLevelToString, mapTraceServerToLogLevel } from '@bean-lsp/shared';
import * as vscode from 'vscode';

import { LanguageClient, LanguageClientOptions, ServerOptions, State, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;
let statusBarItem: vscode.StatusBarItem;

// Create a client logger
const clientLogger = new Logger('Client');

/**
 * Resolves the path to web-tree-sitter.wasm file
 * @param context Extension context
 * @returns The resolved path to the WASM file
 */
function resolveWebTreeSitterWasmPath(context: vscode.ExtensionContext): string | undefined {
	return vscode.Uri.joinPath(context.extensionUri, 'server', 'common', 'web-tree-sitter.wasm').fsPath;
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	// Initialize logger with configuration
	const config = vscode.workspace.getConfiguration('beanLsp');
	const traceServerConfig = config.get<string>('trace.server', 'messages');
	const logLevel = mapTraceServerToLogLevel(traceServerConfig);
	clientLogger.setLevel(logLevel);
	clientLogger.info(`Log level set to ${logLevelToString(logLevel)} (from trace.server: ${traceServerConfig})`);

	// Watch for configuration changes
	context.subscriptions.push(
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
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'beancount' }],
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher('**/*.bean(count)?$'),
		},
		initializationOptions: {
			webTreeSitterWasmPath: webTreeSitterWasmPath,
		},
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'beanLsp',
		'BeanCount Language Server',
		serverOptions,
		clientOptions,
	);

	// Update status bar when client state changes
	client.onDidChangeState(event => {
		if (event.newState === State.Running) {
			statusBarItem.text = '$(check) Beancount: Ready';
			setTimeout(() => {
				statusBarItem.hide();
			}, 3000);
		} else if (event.newState === State.Starting) {
			statusBarItem.text = '$(sync~spin) Beancount: Initializing...';
			statusBarItem.show();
		} else {
			statusBarItem.text = '$(error) Beancount: Stopped';
			statusBarItem.show();
		}
	});

	client.onRequest(CustomMessages.ListBeanFile, async () => {
		const files = await vscode.workspace.findFiles('**/*.{bean,beancount}');
		const uriStrings = files.map(f => {
			return f.toString();
		});
		return uriStrings;
	});

	client.onRequest(CustomMessages.FileRead, async (raw: string): Promise<number[]> => {
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

	// Start the client. This will also launch the server
	client.start();

	// Log when the extension is activated
	clientLogger.info('Beancount LSP extension is now active');
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
