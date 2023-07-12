"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsup_1 = require("tsup");
exports.default = (0, tsup_1.defineConfig)({
    entry: ['src/index.ts'],
    sourcemap: true,
    clean: true,
    target: 'es2022',
    bundle: true,
    loader: {
        '.scm': 'text',
        '.wasm': 'binary'
    },
    noExternal: ['tree-sitter-beancount'],
    external: ['vscode']
});
//# sourceMappingURL=tsup.config.js.map