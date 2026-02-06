# Playground Agent Notes

This file captures implementation pitfalls and stable patterns discovered while integrating `@codingame/monaco-vscode-api` + `@codingame/monaco-editor-wrapper` in this playground.

## Scope
- Directory: `packages/playground`
- Primary file: `packages/playground/src/main.ts`
- Goal: keep playground behavior close to `vscode.dev` while supporting both `memfs` and browser File System Access (FSA) mode.

## Core Mode Separation

### Pattern
- Keep two explicit modes and avoid hybrid behavior:
  - `memfs` (default): register demo files, hash share/reset features enabled.
  - `fsa` (`?fs=fsa`): no demo files, use browser filesystem provider + workspace file.

### Pitfall
- Mixing memfs bootstrap logic into FSA mode leads to phantom files (e.g. `main.bean`) and confusing workspace state.

## Initialization Order (Very Important)

### Pattern
1. Register required editor/workbench features first.
2. Register worker(s) needed by services.
3. Setup filesystem providers (if FSA mode).
4. Call `initialize(...)` with `workspaceProvider`.
5. After init race, apply compatibility patches and config.

### Pitfall
- If services are initialized before provider setup, APIs can silently fall back to unsupported behavior.

## FSA Provider Setup

### Pattern
- Use indexeddb-backed userdata + HTML provider:
  - `createIndexedDBProviders()`
  - `initFile(vscode-userdata:/workspaces/fsa.code-workspace, ...)`
  - `registerHTMLFileSystemProvider()`
- Use `vscode-userdata` for workspace file persistence.

### Pitfall
- Writing workspace file to `file:///tmp/...` in browser mode often fails with `No file system handle registered`.
- Calling `initFile(..., { overwrite: true })` destroys persisted workspace metadata.

## Open Folder Behavior

### Pattern
- In FSA mode, implement explicit command flow:
  - `showDirectoryPicker()`
  - `provider.registerDirectoryHandle(...)`
  - `vscode.openFolder(...)` (preferred)
  - fallback to `workspace.updateWorkspaceFolders(...)` only when needed.

### Pitfall
- Relying on default workbench `Open Folder` path-input flow in this stack can miss the browser picker behavior.

## `workspace.findFiles` Returns Empty

### Pattern
- Ensure search worker is registered:
  - register `LocalFileSearchWorker` via `registerWorker(...)`
  - include package `@codingame/monaco-vscode-search-service-override`
- Patch search provider query when glob is sent in `filePattern`:
  - move glob to `includePattern` if needed.
- Normalize trailing slash for FSA handle resolution (`provider.getHandle`).

### Pitfall
- Missing search worker causes runtime errors and always-empty file search.
- FSA URI normalization mismatches can make handle lookup fail and indirectly break file search/listing.

## Workspace URI / Handle Consistency

### Pattern
- Keep folder URIs canonical (no trailing slash drift).
- On workspace folder changes in FSA mode, realign folder URIs with registered handles when necessary.

### Pitfall
- Non-canonical URI forms may look valid in UI but still fail provider handle lookup.

## Avoid Temporary Debug Workarounds in Final Code

### Do Not Keep
- Forcing search config overrides globally (e.g. disabling ignore files) as a permanent fix.
- Clearing all workspace folders after init unless there is a proven deterministic need.
- Excessive console debug logging in stable path.

### Keep
- Minimal guardrails and resilient fallbacks with clear user-facing error messages.

## Feature Wiring Checklist (Before Merge)
- `linkedEditing` contribution imported when linked editing is expected.
- FSA mode has no demo file bootstrap.
- Workspace file persists in `vscode-userdata` and is not overwritten on each load.
- `Open Local` command can open system folder picker and mount folder.
- `workspace.findFiles('**/*.{bean,beancount}')` returns expected results in FSA mode.
- `pnpm -C packages/playground exec tsc --noEmit` passes.

## If Something Breaks Again
1. Check browser console for worker-related errors first.
2. Verify provider registration order and mode branch.
3. Verify workspace folder URI equals provider-registered URI shape.
4. Verify `findFiles` query shape (`filePattern` vs `includePattern`).
5. Reproduce against upstream demo behavior before introducing workaround.
