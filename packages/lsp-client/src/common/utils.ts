import * as vscode from 'vscode';

/**
 * Resolves the path to web-tree-sitter.wasm file
 * @param context Extension context
 * @returns The resolved path to the WASM file
 */
export function resolveWebTreeSitterWasmPath(context: vscode.ExtensionContext): string | undefined {
	return vscode.Uri.joinPath(context.extensionUri, 'server', 'common', 'web-tree-sitter.wasm').fsPath;
}
