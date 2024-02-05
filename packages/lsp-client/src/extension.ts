// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { CustomMessages, FileGlobParams } from '@bean-lsp/shared';
import * as vscode from 'vscode';


import {
	LanguageClient,
	LanguageClientOptions,
	RegistrationRequest,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;


// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	// The server is implemented in node
	const serverModule = require.resolve('beancount-lsp-server');

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'beancount' }],
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher('**/*.bean(count)?$')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'beanLsp',
		'BeanCount Language Server',
		serverOptions,
		clientOptions
	);

	client.onRequest(CustomMessages.ListBeanFile, async () => {
		const files = await vscode.workspace.findFiles('**/*.{bean,beancount}');
		const uriStrings = files.map(f => {
			return f.toString()
		})
		return uriStrings;
	})

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
}

// This method is called when your extension is deactivated
export function deactivate() {/** TODO */ }
