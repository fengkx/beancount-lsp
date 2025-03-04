// This is the entry point for the extension
// We'll handle the export based on environment
// By default, the browser and node entry points are handled by package.json configuration

import * as vscode from 'vscode';

// This is a dummy file as the actual implementation is determined by package.json
// which points to either dist/node/extension.js or dist/browser/extension.js based on environment

export function activate(_: vscode.ExtensionContext): void {
	// This function will never be called directly as package.json points
	// to the correct implementation based on environment
	throw new Error(
		'This file should not be imported directly. The actual implementation is determined by package.json.',
	);
}

export function deactivate(): Promise<void> {
	// This function will never be called directly
	throw new Error(
		'This file should not be imported directly. The actual implementation is determined by package.json.',
	);
}
