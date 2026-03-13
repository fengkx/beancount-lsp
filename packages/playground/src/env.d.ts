declare module '*.vsix' {
export function whenReady(): Promise<void>;
}

declare module '@codingame/monaco-editor-wrapper' {
	export const Worker: new (...args: unknown[]) => Worker;
	export function initialize(...args: unknown[]): Promise<unknown>;
	export function registerFile(...args: unknown[]): unknown;
	export function registerWorker(...args: unknown[]): unknown;
	export function updateUserConfiguration(...args: unknown[]): Promise<unknown>;
}
