declare module '*.vsix' {
export function whenReady(): Promise<void>;
}
