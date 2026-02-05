import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin';
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
		vsixPlugin(),
	],
})

export default config;
