import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';
import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

// Common configuration options
const commonConfig: Partial<Options> = {
	outDir: 'dist',
	sourcemap: true,
	target: 'es2022',
	loader: {
		'.wasm': 'binary',
		'.scm': 'text',
		'.prompt.txt': 'text',
	},
	external: ['vscode'],
	noExternal: ['@bean-lsp/shared', 'vscode-languageclient', 'vscode-uri'],
};

const nodeConfig = defineConfig({
	...commonConfig,
	entry: {
		'node/extension': 'src/node/extension.ts',
	},
	platform: 'node',
	clean: true,
});

const cliConfig = defineConfig({
	...commonConfig,
	entry: {
		'node/cli': 'src/cli/index.ts',
	},
	platform: 'node',
	clean: false, // Don't clean - nodeConfig already cleans
	format: ['cjs'],
	banner: {
		js: '#!/usr/bin/env node',
	},
	external: ['vscode'], // Keep vscode external even though CLI doesn't use it
	noExternal: ['@bean-lsp/shared', 'vscode-uri', 'beancount-lsp-server', 'cac'],
});

const browserConfig = defineConfig({
	...commonConfig,
	entry: {
		'browser/extension': 'src/browser/extension.ts',
	},
	platform: 'browser',
	clean: false, // Don't clean twice
	esbuildPlugins: [nodeModulesPolyfillPlugin(
		{
			modules: {
				fs: 'empty',
				path: 'empty',
			},
		},
	)],
});

export default [nodeConfig, cliConfig, browserConfig] as const;
