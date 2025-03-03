import * as vscode from 'vscode';
import { clientLogger, setupLogger } from '../common/client';

// This is a placeholder for a browser-specific implementation
// It would need proper implementation for web extension

export function activate(context: vscode.ExtensionContext) {
	// Initialize logger
	setupLogger();

	// Implementation for browser extension would go here
	clientLogger.info('Browser extension activated - not fully implemented yet');

	// Show an informational message to the user
	vscode.window.showInformationMessage('Beancount LSP browser extension is not fully implemented yet.');
}

export function deactivate() {
	// Browser-specific deactivation logic
	return undefined;
}
