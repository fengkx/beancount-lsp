# Repository Agent Notes

## Scope
- Directory: repository root
- Applies to: all packages unless a deeper `AGENTS.md` overrides it

## LSP Server Dependency Rule
- When adding a new runtime dependency to `packages/lsp-server/package.json`, also review `packages/lsp-server/tsup.config.ts`.
- If the dependency is imported by the server runtime code, add it to `nodeConfig.noExternal` unless there is a clear reason to keep it external.
- Reason: `packages/lsp-server/scripts/prepare-client-assets.js` copies built server artifacts into `lsp-client`; required runtime dependencies should be bundled to avoid missing module errors at extension runtime.

## Playground Browser Testing Notes
- When editing files inside the VSCode Web playground, prefer whole-file replacement (`focus editor -> Select All -> type/paste full content`) over partial line edits.
- Reason: editor language features (auto-indent, snippet/format behaviors, newline handling) can introduce unintended indentation or syntax changes during incremental typing.
- Always verify editor focus before typing. VSCode Web frequently shifts focus to the command palette, Problems panel, diff editors, or other UI panels.
- Prefer minimizing the repro fixture (for example, reduce `main.bean` includes to only the files under test) to reduce noise and focus-switch count.
- After browser automation edits, verify actual file contents before trusting diagnostics. Useful pattern: add/call debug commands that copy active file content or a project snapshot.
- Be careful when using command palette automation: fuzzy search can select similarly named commands (for example compare-with-clipboard flows) and open diff editors unexpectedly.
- If a syntax error appears immediately after automated typing, first suspect accidental auto-indent / misplaced whitespace from editor input rather than parser/runtime incompatibility.
