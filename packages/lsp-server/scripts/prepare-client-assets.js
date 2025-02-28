#!/usr/bin/env node

/**
 * This script prepares the assets needed for the LSP client by:
 * 1. Copying the WebAssembly file from web-tree-sitter to lsp-client
 * 2. Copying the compiled server.js to the lsp-client server directory
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
 * Copies the compiled server.js to the client's server directory
 * @returns {boolean} True if the operation is successful
 */
function prepareServerAsset() {
    try {
        const serverJsPath = path.join(__dirname, '../dist/node/server.js');
        const clientServerPath = path.join(__dirname, '../../lsp-client/server/node.js');

        // Check if the server.js file exists
        if (!fs.existsSync(serverJsPath)) {
            throw new Error(`server.js not found at ${serverJsPath}`);
        }

        // Copy the server.js file to the lsp-client/server/node.js
        fs.copyFileSync(serverJsPath, clientServerPath);
        console.log(`✅ Server asset prepared: ${clientServerPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to prepare server asset: ${error.message}`);
        return false;
    }
}

/**
 * Main function to prepare all client assets
 */
function prepareClientAssets() {
    console.log('🚀 Preparing client assets...');
    
    const wasmSuccess = prepareWasmAsset();
    const serverSuccess = prepareServerAsset();
    
    if (wasmSuccess && serverSuccess) {
        console.log('✨ All client assets prepared successfully!');
        process.exit(0);
    } else {
        console.error('⚠️ Some assets failed to prepare. Check logs above for details.');
        process.exit(1);
    }
}

// Execute the main function
prepareClientAssets();