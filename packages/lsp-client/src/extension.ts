// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LANGUAGE_ID, TOKEN_TYPES } from './constraint/language';
import { SemanticTokenProvider } from './providers/semantic-tokens-provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "beancount-lsp" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('beancount-lsp.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from beancount-lsp!');
	});

	context.subscriptions.push(disposable);


	const modifiers = ["definition", "deprecated", "documentation", "declartion"];
	const selector: vscode.DocumentSelector = {
		language: LANGUAGE_ID,
		scheme: "file",
	};

	const legend = new vscode.SemanticTokensLegend(TOKEN_TYPES, modifiers);
	const provider = new SemanticTokenProvider(legend);

	context.subscriptions.push(
		vscode.languages.registerDocumentSemanticTokensProvider(
			selector,
			provider,
			legend
		)
	);
}

// This method is called when your extension is deactivated
export function deactivate() {/** TODO */ }
