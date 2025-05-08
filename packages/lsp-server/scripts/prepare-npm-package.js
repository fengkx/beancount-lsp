#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * This script prepares the assets needed for the npm package by:
 * 1. Copying the WebAssembly file from web-tree-sitter to the dist directory
 */

const fs = require('fs');
const path = require('path');

/**
 * Copies the WebAssembly file from web-tree-sitter to the dist directory
 * @returns {boolean} True if the operation is successful
 */
function prepareWasmAsset() {
	try {
		const webTreeSitterWasmPath = require.resolve('web-tree-sitter/tree-sitter.wasm');
		const distCommonPath = path.join(__dirname, '../dist/common');

		// Create the dist common directory if it doesn't exist
		fs.mkdirSync(distCommonPath, { recursive: true });

		// Copy the WASM file to the dist/common directory
		fs.copyFileSync(webTreeSitterWasmPath, path.join(distCommonPath, 'web-tree-sitter.wasm'));

		console.log(`✅ WASM asset prepared: ${path.join(distCommonPath, 'web-tree-sitter.wasm')}`);
		return true;
	} catch (error) {
		console.error(`❌ Failed to prepare WASM asset: ${error.message}`);
		return false;
	}
}

/**
 * Main function to prepare all npm package assets
 */
function prepareNpmPackage() {
	console.log('🚀 Preparing npm package assets...');

	const wasmSuccess = prepareWasmAsset();

	if (wasmSuccess) {
		console.log('✨ All npm package assets prepared successfully!');
		process.exit(0);
	} else {
		console.error('⚠️ Some assets failed to prepare. Check logs above for details.');
		process.exit(1);
	}
}

// Execute the main function
prepareNpmPackage();
