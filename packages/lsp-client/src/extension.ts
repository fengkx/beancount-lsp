// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


import {
	LanguageClient,
	LanguageClientOptions,
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
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
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
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();

	// const modifiers = TOKEN_MODIFIERS;
	// const selector: vscode.DocumentSelector = {
	// 	language: LANGUAGE_ID,
	// 	scheme: "file",
	// };

	// const legend = new vscode.SemanticTokensLegend(TOKEN_TYPES, modifiers);
	// const provider = new SemanticTokenProvider(legend);

	// context.subscriptions.push(
	// 	vscode.languages.registerDocumentSemanticTokensProvider(
	// 		selector,
	// 		provider,
	// 		legend
	// 	)
	// );
}

// This method is called when your extension is deactivated
export function deactivate() {/** TODO */ }
