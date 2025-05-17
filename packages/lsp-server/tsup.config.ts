import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';
import { defineConfig, Options } from 'tsup';

const commonConfig = {
	sourcemap: true,
	clean: true,
	loader: {
		'.wasm': 'binary',
		'.scm': 'text',
		'.py': 'text',
	},
	external: ['vscode'],
	noExternal: [
		'big.js',
		'@bean-lsp/shared',
		'@seald-io/nedb',
		'date-fns',
		'micromatch',
		'mnemonist',
		'nominal-types',
		'pinyin-pro',
		'ts-pattern',
		'vscode-languageserver',
		'vscode-languageserver-textdocument',
		'vscode-uri',
		'web-tree-sitter',
	],
} satisfies Partial<Options>;

const nodeConfig = defineConfig({
	...commonConfig,
	platform: 'node',
	entry: ['src/node/server.ts'],
	outDir: 'dist/node',
	clean: true,
	target: 'node20',
	noExternal: [
		...commonConfig.noExternal,
		'execa',
		'fast-glob',
	],
	banner: {
		js: '#!/usr/bin/env node',
	},
});

const browserConfig = defineConfig({
	...commonConfig,
	entry: ['src/browser/server.ts'],
	outDir: 'dist/browser',
	platform: 'browser',
	target: 'es2022',
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
				events: 'empty',
			},
		}),
	],
});

export default [nodeConfig, browserConfig];
