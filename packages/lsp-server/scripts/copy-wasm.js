#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function copyWasmFile() {
    const webTreeSitterWasmPath = require.resolve('web-tree-sitter/tree-sitter.wasm');
    const clientDistPath = path.join(__dirname, '../../lsp-client/server/common');

    // Create the dist directory if it doesn't exist
    fs.mkdirSync(clientDistPath, { recursive: true });

    // Copy the WASM file to the lsp-client/server/common directory
    fs.copyFileSync(webTreeSitterWasmPath, path.join(clientDistPath, 'web-tree-sitter.wasm'));

    console.log(`WASM file copied to ${clientDistPath}`);
}

copyWasmFile();