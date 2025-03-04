import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';
import { defineConfig } from 'tsup';

const nodeConfig = defineConfig({
	entry: {
		'node/extension': 'src/node/extension.ts',
	},
	outDir: 'dist',
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

const browserConfig = defineConfig({
	entry: {
		'browser/extension': 'src/browser/extension.ts',
	},
	outDir: 'dist',
	sourcemap: true,
	platform: 'browser',
	clean: false, // Don't clean twice
	target: 'es2022',
	loader: {
		'.wasm': 'binary',
		'.scm': 'text',
	},
	external: ['vscode'],
	noExternal: ['@bean-lsp/shared', 'vscode-languageclient'],
	esbuildPlugins: [nodeModulesPolyfillPlugin(
		{
			modules: {
				fs: 'empty',
				path: 'empty',
			},
		},
	)],
});

export default [nodeConfig, browserConfig] as const;
