declare module '*.scm' {
	const content: string;
	export = content;
}

declare module '*.wasm' {
	const content: Uint8Array;
	export = content;
}

declare module '*.py' {
	const content: string;
	export = content;
}

declare module 'beancount-wasm/runtime' {
	export interface BeancountRuntimeOptions {
		version: 'v2' | 'v3' | '2' | '3';
		pyodideBaseUrl?: string;
		wheelBaseUrl?: string;
		deps?: string[];
		inline?: 'auto' | 'prefer' | 'only' | 'off';
		onStatus?: (status: string) => void;
	}

	export interface BeancountRuntime {
		pyodide: {
			runPythonAsync: (code: string) => Promise<unknown>;
			globals: {
				set: (name: string, value: unknown) => void;
			};
		};
	}

	export interface FileTreeEntry {
		name: string;
		content: string;
	}

	export interface FileTree {
		update: (files: FileTreeEntry[]) => void;
		remove: (names: string[]) => void;
		reset: (files: FileTreeEntry[]) => void;
	}

	export function createBeancountRuntime(options: BeancountRuntimeOptions): Promise<BeancountRuntime>;
	export function createFileTree(
		pyodide: BeancountRuntime['pyodide'],
		options: { root: string; cache?: boolean },
	): FileTree;
}

declare const __VSCODE__: boolean;
