import { defineConfig } from 'tsup';

const config = defineConfig({
	entry: ['src/node/server.ts'],
	outDir: 'dist/node',
	sourcemap: true,
	clean: true,
	target: 'node18',
	loader: {
		'.wasm': 'binary',
		'.scm': 'text',
	},
	external: ['vscode'],
	noExternal: ['lru-cache', 'vscode-languageserver', 'vscode-languageserver-textdocument', '@bean-lsp/shared'],
});

export default [config];
