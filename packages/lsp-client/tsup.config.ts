import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/extension.ts'],
    sourcemap: true,
    clean: true,
    target: 'es2022',
    loader: {
        '.wasm': 'binary',
        '.scm': 'text'
    },
    external: ['vscode']
})