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
	noExternal: [
		'@abraham/reflection',
		'@bean-lsp/shared',
		'@seald-io/nedb',
		'date-fns',
		'fast-glob',
		'micromatch',
		'mnemonist',
		'nominal-types',
		'pinyin-pro',
		'ts-pattern',
		'tsyringe',
		'vscode-languageserver',
		'vscode-languageserver-textdocument',
		'vscode-uri',
		'web-tree-sitter',
		'lru-cache',
	],
});

export default [config];
