import * as vscode from 'vscode';
import type { LanguageClient as BrowserLanguageClient } from 'vscode-languageclient/browser';
import type { LanguageClient as NodeLanguageClient } from 'vscode-languageclient/node';
export interface ClientOptions {
	webTreeSitterWasmPath?: string | undefined;
}

export interface ExtensionContext<T extends 'browser' | 'node'> {
	context: vscode.ExtensionContext;
	client: T extends 'browser' ? BrowserLanguageClient : NodeLanguageClient;
	statusBarItem: vscode.StatusBarItem;
}
