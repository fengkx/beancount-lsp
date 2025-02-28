// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { CustomMessages } from '@bean-lsp/shared';
import path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

/**
 * Resolves the path to web-tree-sitter.wasm file
 * @param context Extension context
 * @returns The resolved path to the WASM file
 */
function resolveWebTreeSitterWasmPath(context: vscode.ExtensionContext): string | undefined {
	return path.join(context.extensionUri.fsPath, 'server', 'common', 'web-tree-sitter.wasm');
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	// The server is implemented in node
	const serverModule = path.join(context.extensionPath, 'server', 'node.js');

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

	// Get the log level from configuration
	const config = vscode.workspace.getConfiguration('beanLsp');
	const logLevel = config.get('logLevel', 'info');

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'beancount' }],
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher('**/*.bean(count)?$'),
		},
		initializationOptions: {
			webTreeSitterWasmPath: webTreeSitterWasmPath,
			logLevel: logLevel
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'beanLsp',
		'BeanCount Language Server',
		serverOptions,
		clientOptions,
	);

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

	// Register configuration change listener
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('beanLsp.logLevel')) {
				const newLogLevel = vscode.workspace.getConfiguration('beanLsp').get('logLevel', 'info');
				client.sendNotification('custom/setLogLevel', { logLevel: newLogLevel });
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {/** TODO */ }
