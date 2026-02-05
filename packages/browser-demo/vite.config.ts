import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin';
import type { UserConfig } from 'vite';

const config = {
	optimizeDeps: {
		esbuildOptions: {
			plugins: [importMetaUrlPlugin],
		},
	},
	plugins: [
		vsixPlugin(),
	],
} satisfies UserConfig;

export default config;
