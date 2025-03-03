import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';

export interface ClientOptions {
	webTreeSitterWasmPath?: string;
}

export interface ExtensionContext {
	context: vscode.ExtensionContext;
	client: LanguageClient;
	statusBarItem: vscode.StatusBarItem;
}
