import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	sourcemap: true,
	clean: true,
	target: 'es2022',
	loader: {
		'.scm': 'text',
		'.wasm': 'binary',
	},
	noExternal: ['tree-sitter-beancount', 'web-tree-sitter'],
	dts: {
		compilerOptions: {
			rootDir: __dirname,
		},
	},
	external: ['vscode'],
});
