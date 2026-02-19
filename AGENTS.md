# Repository Agent Notes

## Scope
- Directory: repository root
- Applies to: all packages unless a deeper `AGENTS.md` overrides it

## LSP Server Dependency Rule
- When adding a new runtime dependency to `packages/lsp-server/package.json`, also review `packages/lsp-server/tsup.config.ts`.
- If the dependency is imported by the server runtime code, add it to `nodeConfig.noExternal` unless there is a clear reason to keep it external.
- Reason: `packages/lsp-server/scripts/prepare-client-assets.js` copies built server artifacts into `lsp-client`; required runtime dependencies should be bundled to avoid missing module errors at extension runtime.
