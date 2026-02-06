---
name: vscode-lsp-configuration
description: Best practices for reading and reacting to VS Code settings in a Language Server Protocol (LSP) server. Use when handling vscode configuration or LSP configuration from clients
---

# VS Code LSP Configuration Skill

## Goal
Correctly resolve VS Code settings for an LSP server, including:
- User vs Workspace vs Workspace Folder overrides
- Multi-root workspaces
- Language overrides (`"[lang]"`)
- Cache + invalidation via `onDidChangeConfiguration`

---

## Quick SOP (Minimal Correct Implementation)

1. **In extension `package.json`, set appropriate setting `scope`:**
   - Prefer `resource` (or `language-overridable`) for most LSP behavior settings.

2. **In LSP server, always read settings with `scopeUri = document.uri`:**
   - Never rely on `getConfiguration()` without `scopeUri` if you expect folder-level settings.

3. **Cache per-resource config:**
   - Cache key = `document.uri` (not workspace root).

4. **Handle config changes:**
   - `onDidChangeConfiguration`: clear cache and revalidate all open docs.

---

## Configuration Scope (Extension `package.json`)

### What `scope` controls
`contributes.configuration.properties[*].scope` declares where a setting is allowed to vary and how VS Code should resolve it.

### Common `scope` values
- `resource`
  - Setting can vary by **resource URI** (file) and therefore by **workspace folder** in multi-root.
  - Recommended for diagnostics, lint rules, formatter settings, analysis toggles.

- `language-overridable`
  - Allows language-specific overrides like:
    ```json
    "[beancount]": { "yourExtension.enable": true }
    ```
  - Still benefits from reading with `scopeUri`.

- `window`
  - Window-level only. Does **not** vary by file/folder.
  - Use for UI/window toggles only.

> Note: `machine` / `machine-overridable` exist for Remote/machine-specific settings. Most LSPs don’t need them.

---

## Reading Settings in the LSP Server

### `getConfiguration` parameters
Typical Node server call:
```ts
connection.workspace.getConfiguration({ scopeUri, section })
```

* `scopeUri` (string URI)

  * The resource used to resolve configuration (e.g., `document.uri`).
  * Required for correct behavior in:

    * multi-root workspaces
    * workspace folder overrides

* `section` (string)

  * The prefix to fetch (e.g., `"yourExtension"`).
  * Returns an object representing `yourExtension.*` settings.

### Reference pattern (per-resource + cache)

```ts
const settingsCache = new Map<string, Thenable<any>>();
let hasConfigCapability = false;

connection.onInitialize((params) => {
  hasConfigCapability = !!params.capabilities.workspace?.configuration;
  return { capabilities: { /* ... */ } };
});

async function getSettings(resourceUri: string) {
  if (!hasConfigCapability) return defaultSettings;

  let v = settingsCache.get(resourceUri);
  if (!v) {
    v = connection.workspace.getConfiguration({
      scopeUri: resourceUri,
      section: "yourExtension",
    });
    settingsCache.set(resourceUri, v);
  }
  return v;
}
```

---

## `onDidChangeConfiguration` (Server-side)

### When it triggers

VS Code sends this notification when configuration may have changed, e.g.:

* User / Workspace / Workspace Folder settings edited (UI or JSON)
* Language overrides changed (`"[lang]"`)
* External edits to `.vscode/settings.json` (git checkout, scripts, sync tools)

### Why it has no parameters

The LSP notification typically does **not** include which keys changed.
Treat it as “something changed”.

### Recommended handler

```ts
connection.onDidChangeConfiguration(() => {
  settingsCache.clear();
  for (const doc of documents.all()) {
    // revalidate(doc)
  }
});
```

---

## Precedence Rules (Avoid False Bugs)

VS Code setting precedence:
**User < Workspace < Workspace Folder**

If a key is set at Workspace or Folder level, it overrides User level.

---

## Pitfalls Checklist (Common Failure Modes)

* **No `scopeUri` passed** → Folder settings appear “ignored”, especially multi-root.
* Setting declared as `window` but you expect per-folder/per-file behavior → it won’t happen.
* Expecting raw values by layer (user/workspace/folder) → LSP `workspace/configuration` returns **merged final** only.
* Caching globally (one config for all docs) in multi-root → wrong folder settings applied.
* Not clearing cache on `onDidChangeConfiguration` → stale behavior after settings edits.

---

## Decision Guide

* If a setting affects analysis/diagnostics/formatting for a specific file:
  **`scope: resource` + read with `scopeUri=document.uri`**
* If a setting is language-specific:
  **`scope: language-overridable` + read with `scopeUri=document.uri`**
* If a setting is purely UI/window behavior:
  **`scope: window`**
