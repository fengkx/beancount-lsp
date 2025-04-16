import * as vscode from 'vscode';
import type { BaseLanguageClient, LanguageClient as BrowserLanguageClient } from 'vscode-languageclient/browser';
import type { LanguageClient as NodeLanguageClient } from 'vscode-languageclient/node';
export interface ClientOptions {
	webTreeSitterWasmPath?: string | undefined;
	globalStorageUri?: vscode.Uri | undefined;
	extensionUri: vscode.Uri | undefined;
}

export interface ExtensionContext<T extends 'browser' | 'node'> {
	context: vscode.ExtensionContext;
	client: T extends 'browser' ? BrowserLanguageClient : T extends 'node' ? NodeLanguageClient : BaseLanguageClient;
	statusBarItem: vscode.StatusBarItem;
}
