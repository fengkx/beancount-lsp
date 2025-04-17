import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';
import { defineConfig, Options } from 'tsup';

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
	clean: true,
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

export default [nodeConfig, browserConfig] as const;
