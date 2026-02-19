import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';

const config = defineConfig({
	base: process.env['PUBLIC_URL'] || '/',
	optimizeDeps: {
		esbuildOptions: {
			plugins: [importMetaUrlPlugin],
		},
	},
	worker: {
		format: 'es',
	},
	plugins: [
		// Vite and the VSIX rollup plugin can resolve different Rollup type versions.
		// Runtime is compatible, but TS sees incompatible hook context types.
		vsixPlugin() as unknown as PluginOption,
	],
})

export default config;
