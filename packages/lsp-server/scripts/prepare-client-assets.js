#!/usr/bin/env node

/**
 * This script prepares the assets needed for the LSP client by:
 * 1. Copying the WebAssembly file from web-tree-sitter to lsp-client
 * 2. Copying the compiled server.js (node version) to the lsp-client server directory
 * 3. Copying the compiled server.js (browser version) to the lsp-client server directory
 */

const fs = require('fs');
const path = require('path');

/**
 * Copies the WebAssembly file from web-tree-sitter to the client's common directory
 * @returns {boolean} True if the operation is successful
 */
function prepareWasmAsset() {
	try {
		const webTreeSitterWasmPath = require.resolve('web-tree-sitter/tree-sitter.wasm');
		const clientCommonPath = path.join(__dirname, '../../lsp-client/server/common');

		// Create the client common directory if it doesn't exist
		fs.mkdirSync(clientCommonPath, { recursive: true });

		// Copy the WASM file to the lsp-client/server/common directory
		fs.copyFileSync(webTreeSitterWasmPath, path.join(clientCommonPath, 'web-tree-sitter.wasm'));

		console.log(`✅ WASM asset prepared: ${path.join(clientCommonPath, 'web-tree-sitter.wasm')}`);
		return true;
	} catch (error) {
		console.error(`❌ Failed to prepare WASM asset: ${error.message}`);
		return false;
	}
}

/**
 * Copies the compiled node server.js to the client's server directory
 * @returns {boolean} True if the operation is successful
 */
function prepareNodeServerAsset() {
	try {
		const serverJsPath = path.join(__dirname, '../dist/node/server.js');
		const clientServerPath = path.join(__dirname, '../../lsp-client/server/node.js');

		// Check if the server.js file exists
		if (!fs.existsSync(serverJsPath)) {
			throw new Error(`node server.js not found at ${serverJsPath}`);
		}

		// Copy the server.js file to the lsp-client/server/node.js
		fs.copyFileSync(serverJsPath, clientServerPath);
		console.log(`✅ Node server asset prepared: ${clientServerPath}`);
		return true;
	} catch (error) {
		console.error(`❌ Failed to prepare node server asset: ${error.message}`);
		return false;
	}
}

/**
 * Copies the compiled browser server.js to the client's server directory
 * @returns {boolean} True if the operation is successful
 */
function prepareBrowserServerAsset() {
	try {
		const serverJsPath = path.join(__dirname, '../dist/browser/server.js');
		const browserDirPath = path.join(__dirname, '../../lsp-client/server/browser');
		const clientServerPath = path.join(browserDirPath, 'server.js');

		// Check if the server.js file exists
		if (!fs.existsSync(serverJsPath)) {
			throw new Error(`browser server.js not found at ${serverJsPath}`);
		}

		// Create the browser directory if it doesn't exist
		fs.mkdirSync(browserDirPath, { recursive: true });

		// Copy the server.js file to the lsp-client/server/browser/server.js
		fs.copyFileSync(serverJsPath, clientServerPath);
		console.log(`✅ Browser server asset prepared: ${clientServerPath}`);
		return true;
	} catch (error) {
		console.error(`❌ Failed to prepare browser server asset: ${error.message}`);
		return false;
	}
}

/**
 * Main function to prepare all client assets
 */
function prepareClientAssets() {
	console.log('🚀 Preparing client assets...');

	const wasmSuccess = prepareWasmAsset();
	const nodeServerSuccess = prepareNodeServerAsset();
	const browserServerSuccess = prepareBrowserServerAsset();

	if (wasmSuccess && nodeServerSuccess && browserServerSuccess) {
		console.log('✨ All client assets prepared successfully!');
		process.exit(0);
	} else {
		console.error('⚠️ Some assets failed to prepare. Check logs above for details.');
		process.exit(1);
	}
}

// Execute the main function
prepareClientAssets();
