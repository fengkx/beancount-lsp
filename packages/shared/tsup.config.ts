import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    sourcemap: true,
    clean: true,
    target: 'es2022',
    loader: {
        '.scm': 'text',
        '.wasm': 'binary'
    },
    noExternal: ['tree-sitter-beancount'],
    dts: {
        compilerOptions: {
            rootDir: __dirname
        }
    },
    external: ['vscode']
})