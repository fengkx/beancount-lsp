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
    external: ['vscode'],
    noExternal: ['lru-cache', 'vscode-languageserver', 'vscode-languageserver-textdocument', '@bean-lsp/shared']
})

export default config;