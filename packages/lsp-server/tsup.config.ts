import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';
import { defineConfig } from 'tsup';

const nodeConfig = defineConfig({
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

const browserConfig = defineConfig({
	entry: ['src/browser/server.ts'],
	outDir: 'dist/browser',
	sourcemap: true,
	platform: 'browser',
	target: 'es2022',
	loader: {
		'.wasm': 'binary',
		'.scm': 'text',
	},
	external: ['vscode'],
	noExternal: [
		'@bean-lsp/shared',
		'@seald-io/nedb',
		'date-fns',
		'micromatch', // Note: Some modules might not be fully compatible with browser
		'mnemonist',
		'nominal-types',
		'pinyin-pro',
		'ts-pattern',
		'tsyringe',
		'vscode-languageserver',
		'vscode-languageserver-textdocument',
		'vscode-uri',
		'web-tree-sitter',
	],
	// Add browser-specific configuration
	define: {
		'process.env.NODE_ENV': JSON.stringify('production'),
	},
	// Handle node built-ins
	inject: ['./src/browser/polyfills.js'],
	esbuildPlugins: [
		nodeModulesPolyfillPlugin({
			modules: {
				fs: 'empty',
				path: 'empty',
			},
		}),
	],
});

export default [nodeConfig, browserConfig];
