import { defineConfig } from 'tsup'

const config = defineConfig({
    entry: ['src/server.ts'],
    outDir: 'dist',
    sourcemap: true,
    clean: true,
    target: 'es2022',
    loader: {
        '.wasm': 'binary',
        '.scm': 'text'
    },
    external: ['vscode']
})

export default config;