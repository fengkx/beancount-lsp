import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		'node/extension': 'src/node/extension.ts',
		'browser/extension': 'src/browser/extension.ts',
	},
	sourcemap: true,
	clean: true,
	target: 'es2022',
	loader: {
		'.wasm': 'binary',
		'.scm': 'text',
	},
	external: ['vscode'],
	noExternal: ['@bean-lsp/shared', 'vscode-languageclient'],
});
