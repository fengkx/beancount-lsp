# Beancount-LSP Correctness Remediation Spec (2026-02-25)

## Summary

This spec converts the previously reviewed remediation plan into an implementation-ready document.
It prioritizes correctness issues in Beancount semantics and VSCode/LSP behavior before maintainability and performance work.

Priority order:

1. Correctness
2. Maintainability
3. Readability
4. Performance

This spec focuses on the following high-risk areas:

- Beancount `option` lifecycle and stale state
- Price conversion / hover cache correctness
- LSP references/rename semantics
- Diagnostics configuration and de-dup correctness
- Event/order/concurrency stability in indexing and file watching
- VSCode client startup/lifecycle robustness

## Goals

### Primary goals

- Ensure diagnostics and editor features reflect current ledger state (no stale results)
- Ensure rename/reference behavior matches both Beancount syntax and LSP semantics
- Make correctness behavior deterministic and testable

### Secondary goals

- Reduce implicit state coupling across `SymbolIndex`, `BeancountOptionsManager`, `PriceMap`, and diagnostics
- Improve lifecycle handling for long-lived listeners and background tasks
- Improve client startup reliability (especially browser mode)

## Non-Goals (Current Spec)

- Full multi-root (multi-workspace) support implementation
- Large-scale formatter redesign
- Completion engine ranking or UX improvements
- Performance optimization without baseline/profiling

## Scope

### In scope

- `packages/lsp-server` correctness and lifecycle fixes
- `packages/lsp-client` startup and subscription lifecycle fixes
- New tests for affected feature behavior
- Documentation note / warning for multi-root limitation

### Out of scope (deferred)

- Complete multi-root architecture refactor
- Replacing custom client capability patching with a fully new integration approach (only risk reduction now)

## Problem Statement (Validated)

The current implementation has several correctness risks:

- Beancount options can remain stale after file edits/deletes because options are tracked as global effective values only
- `PriceMap` caches do not invalidate when underlying price directives change
- `PriceMap.getDirectRate()` may choose the wrong price when multiple prices exist for a pair
- `ReferencesFeature` ignores `includeDeclaration`, and some symbol kinds miss definitions
- `RenameFeature` may produce invalid Beancount syntax by stripping prefixes/quotes
- Diagnostics configuration access is inconsistent and may not apply on change
- Diagnostics de-duplication may suppress valid diagnostics on the same line

## Design Principles

- Prefer deterministic behavior over incidental behavior caused by async ordering
- Prefer explicit lifecycle cleanup over global singleton leakage
- Prefer conservative cache invalidation for correctness, then optimize later
- Keep changes incremental and test-backed

## Implementation Plan

## Phase 0: Test Coverage Before Behavior Changes

### Deliverables

- Add feature-level tests for options lifecycle, diagnostics config, references/rename semantics, and price-map behavior
- Add lightweight test harness utilities (fake connection / in-memory storage / documents)

### Files to add (recommended)

- `packages/lsp-server/src/test/features/options-lifecycle.test.ts`
- `packages/lsp-server/src/test/features/diagnostics-config.test.ts`
- `packages/lsp-server/src/test/features/references-rename.test.ts`
- `packages/lsp-server/src/test/features/price-map.test.ts`
- `packages/lsp-server/src/test/utils/test-server-harness.ts`

### Required test scenarios

- Option changes in a file update diagnostics/root account validation
- Deleting a file containing options restores defaults (or previous effective values)
- Diagnostics config changes (`beancount.diagnostics.*`) are applied
- `references(includeDeclaration=true/false)` behaves correctly
- Rename preserves Beancount syntax wrappers (`#`, `^`, quotes)
- Latest and historical price selection are correct with multiple price entries
- Price changes invalidate cached hover/conversion results

## Phase 1: Correctness Fixes (P0)

## 1.1 Beancount option lifecycle refactor

### Problem

`BeancountOptionsManager` stores only effective values and does not track values by source file.
This causes stale option state after reindexing/deleting files.

### Changes

Modify `packages/lsp-server/src/common/utils/beancount-options.ts`:

- Add per-source storage:
  - `sourceOptions: Map<string, Map<string, string>>`
- Add recomputed effective option cache:
  - `effectiveOptions: Map<SupportedOption, BeancountOption>`
- Add APIs:
  - `replaceOptionsForSource(source: string, options: Map<string, string>): void`
  - `clearOptionsForSource(source: string): void`
  - internal `recomputeEffectiveOptions(): void`

### Effective option merge rule (default in this spec)

- Deterministic merge by stable source ordering (e.g. lexical URI order)
- Do not rely on indexing order timing
- Only emit `onOptionChange` when effective value actually changes

### `SymbolIndex` integration changes

Modify `packages/lsp-server/src/common/features/symbol-index.ts`:

- In `_processOptionsDirectives(document)`, collect all options for the document and call:
  - `optionsManager.replaceOptionsForSource(document.uri, optionsMap)`
- In `removeFile(uri)`, call:
  - `optionsManager.clearOptionsForSource(uri)`

## 1.2 Diagnostics config loading consistency

### Problem

Diagnostics reads config using inconsistent object shapes (`configuration.settings...` vs `configuration...`).

### Changes

Modify `packages/lsp-server/src/common/features/diagnostics.ts`:

- Add `loadDiagnosticsConfig(connection, scopeUri?)`
- Prefer querying `section: 'beancount.diagnostics'`
- Fallback to legacy shape if necessary
- Replace duplicate inline config parsing in:
  - initial registration path
  - `GlobalEvents.ConfigurationChanged` path

### Expected behavior

- `beancount.diagnostics.tolerance`
- `beancount.diagnostics.warnOnIncompleteTransaction`

must apply consistently on startup and on configuration changes.

## 1.3 Diagnostics de-duplication correctness

### Problem

Current de-dup key uses only `line + severity`, which can drop valid diagnostics.

### Changes

Modify `mergeAndDedupDiagnostics()` in `packages/lsp-server/src/common/features/diagnostics.ts`:

- New de-dup key includes:
  - range start/end
  - severity
  - code
  - message
  - source

Keep preferred source ordering (Beancount runtime diagnostics first).

## 1.4 References LSP semantics (`includeDeclaration`)

### Problem

`ReferencesFeature` ignores `params.context.includeDeclaration`.
Account and commodity references also miss definitions by default.

### Changes

Modify `packages/lsp-server/src/common/features/references.ts`:

- Read `const includeDeclaration = params.context.includeDeclaration`
- Split account/commodity queries into usage + definition helpers
- Return definitions only when `includeDeclaration` is true
- Commodity definitions must include `SymbolType.CURRENCY_DEFINITION`
- Deduplicate final locations by URI + range

### Result

Behavior aligns with LSP semantics and VSCode expectations.

## 1.5 Rename correctness for Beancount syntax wrappers

### Problem

Rename currently replaces the raw range with `newName`, breaking syntax for tags/links/payees/narrations.

### Changes

Modify `packages/lsp-server/src/common/features/rename.ts`:

- Detect target kind:
  - `account | commodity | tag | link | payee | narration`
- Validate `newName` based on target kind
- Format replacement text by target kind:
  - tag -> `#${newName}`
  - link -> `^${newName}`
  - payee/narration -> quoted and escaped string
  - account/commodity -> raw validated text

### Required helper functions (in `RenameFeature`)

- `detectRenameTargetKind(...)`
- `validateNewName(kind, newName)`
- `formatReplacementText(kind, newName)`
- `escapeQuotes(text)`

### Error behavior

- On invalid rename input, return a protocol error (`ResponseError`) rather than generating invalid edits

## 1.6 PriceMap cache invalidation and direct-rate selection

### Problem A

`PriceMap` caches remain valid across source edits and may return stale hover/conversion results.

### Problem B

`getDirectRate()` returns the first matching edge, which may not be the latest or the correct historical edge.

### Changes A (short-term correctness-first)

Modify `packages/lsp-server/src/common/startServer.ts`:

- In document change handling, invalidate price caches conservatively:
  - `priceMap.invalidateAllCaches()`
- In watched file changes handling, invalidate once after processing batch

This is intentionally conservative and correctness-biased.

### Changes B (must-fix selection logic)

Modify `packages/lsp-server/src/common/features/prices-index/price-map.ts`:

- Rework `getDirectRate(baseQuote, graph, date?)`
- Collect all candidate edges for `from -> to`
- If `date` is absent:
  - return newest valid edge
- If `date` is present:
  - filter `edge.date <= date`
  - return the closest prior edge
- Return `null` if no match

### Optional stabilization (recommended)

- Sort edges (e.g. by `to` then `date desc`) when building graph to improve deterministic behavior

## Phase 2: Concurrency / Event / Ordering Stability (P1)

## 2.1 `SymbolIndex.unleashFiles()` background task management

### Problem

The async recursive fire-and-forget pattern can hide errors and complicate state reasoning.

### Changes

Modify `packages/lsp-server/src/common/features/symbol-index.ts`:

- Replace recursive fire-and-forget with a tracked loop promise:
  - `private _backgroundUnleashPromise: Promise<void> | null`
- Ensure only one background unleash loop runs at a time
- Catch and log errors in one place
- Clear tracked promise on completion

### Call site behavior

- Any fire-and-forget call should use `void ...catch(...)`

## 2.2 Watched-files `refetchBeanFiles()` ordering and dedup

### Problem

`startServer` currently calls `documents.refetchBeanFiles()` redundantly and without awaiting.

### Changes

Modify `packages/lsp-server/src/common/startServer.ts` watched-files handler:

- Remove unconditional upfront refetch
- Track `needRefetch` during change processing
- `await documents.refetchBeanFiles()` exactly once after batch if needed
- Trigger `symbolIndex.unleashFiles([])` after state updates

## 2.3 EventBus cleanup simplification

### Problem

`EventBus.hasListeners()` is not meaningful and makes cleanup logic misleading.

### Changes

Modify `packages/lsp-server/src/common/utils/event-bus.ts`:

- Remove empty-emitter auto-cleanup logic from `on()` / `once()`
- Keep `clear()` and `dispose()` as explicit cleanup entry points
- Retain behavior compatibility for callers

## Phase 3: VSCode Client Startup / Lifecycle Robustness (P1)

## 3.1 Reduce risk in custom capability injection

### Problem

Client monkey-patches private `doInitialize`, which is fragile across `vscode-languageclient` upgrades.

### Short-term changes (this spec)

Modify `packages/lsp-client/src/common/client.ts`:

- Remove debug `console.log('===== doInitialize', params)`
- Guard patching with runtime checks
- If patch fails, degrade gracefully (no crash)

### Deferred improvement

- Investigate replacement via supported client API/middleware hooks

## 3.2 Fix browser/node startup race for `QueueInit`

### Problem

Queue initialization may run before client/server is fully ready.

### Changes (browser)

Modify `packages/lsp-client/src/browser/extension.ts`:

- Make `activate` async
- `await client.start()`
- `await setupQueueInit(...)` inside `try/catch`

### Changes (node)

Modify `packages/lsp-client/src/node/extension.ts`:

- `await setupQueueInit(...)`
- Log warning on failure instead of silent fire-and-forget

## 3.3 Subscription lifecycle consistency (`setupInlayHints`)

### Problem

`setupInlayHints()` creates a config listener not attached to `context.subscriptions`.

### Changes

Modify `packages/lsp-client/src/common/client.ts`:

- Push `vscode.workspace.onDidChangeConfiguration(...)` disposable into `ctx.context.subscriptions`

## Phase 4: Multi-root Handling (P1, staged)

## 4.1 Short-term behavior disclosure (required before full support)

### Problem

Many code paths assume `workspace[0]`, which can produce silent wrong behavior in multi-root workspaces.

### Changes

- Detect multi-root workspace and log/warn once that behavior is currently first-workspace-biased
- Add documentation note describing current limitation

Relevant files include:

- `packages/lsp-server/src/common/document-store.ts`
- `packages/lsp-server/src/common/features/diagnostics.ts`
- `packages/lsp-server/src/common/features/hover.ts`
- `packages/lsp-server/src/common/features/formatter.ts`
- `packages/lsp-server/src/common/startServer.ts`

## 4.2 Full multi-root support (deferred implementation track)

### Target direction

- Resolve config and `mainBeanFile` by request/document URI scope, not global first workspace

### Recommended API addition

Modify `packages/lsp-server/src/common/document-store.ts`:

- Add `getMainBeanFileUriFor(scopeUri?: string): Promise<string | null>`
- Keep existing `getMainBeanFileUri()` as compatibility wrapper

## Public API / Interface / Type Changes

## Internal API changes (server)

### `BeancountOptionsManager`

Add methods:

- `replaceOptionsForSource(source: string, options: Map<string, string>): void`
- `clearOptionsForSource(source: string): void`

### `DocumentStore`

Add method:

- `getMainBeanFileUriFor(scopeUri?: string): Promise<string | null>`

## Optional event additions (future phase)

If index-driven cache invalidation is introduced later:

- `GlobalEvents.IndexUpdated`

Not required for the short-term conservative invalidation strategy in this spec.

## Acceptance Criteria

## Correctness acceptance (must pass)

1. Option edits/deletes do not leave stale effective values
2. Diagnostics config changes apply consistently at runtime
3. Multiple diagnostics on same line are preserved when distinct
4. `references(includeDeclaration)` follows LSP semantics
5. Rename preserves Beancount syntax wrappers
6. PriceMap returns correct latest and historical direct conversion edges
7. Price hover/conversion results reflect edited prices without waiting for TTL

## Stability acceptance (must pass)

1. No unhandled promise errors from background indexing unleash loop
2. Watched file changes do not cause redundant refetch storms
3. Browser extension startup does not race `QueueInit`

## Regression acceptance (must pass)

- `pnpm -C packages/lsp-server test`
- `pnpm -C packages/lsp-server typecheck`
- `pnpm -C packages/lsp-client typecheck` (recommended to add to validation routine)

## Test Matrix (Concrete Scenarios)

### A. Beancount options and diagnostics

- Change `option "name_assets"` from `Assets` to `Asset`
- Delete file containing root-name options
- Toggle `beancount.diagnostics.warnOnIncompleteTransaction`
- Toggle `beancount.diagnostics.tolerance`

### B. References and rename

- Account references with declaration included/excluded
- Commodity references including `commodity` directive definitions
- Rename `#tag`, `^link`, `"payee"`, `"narration"`
- Invalid rename attempts (e.g. newline in payee, malformed commodity)

### C. Price map and hover

- Multiple prices for same pair over different dates
- Historical conversion with target date between entries
- Edit price line and verify hover result changes

### D. Startup and lifecycle

- Browser client activation path with `QueueInit`
- Node client activation path with `QueueInit`
- Multiple config listener registration / disposal sanity

## Assumptions and Defaults

1. Multi-root support is not fully implemented in this spec
- Current behavior remains effectively single-primary-workspace
- A warning/documentation note is added to reduce silent misuse

2. Option precedence is made deterministic first
- Stable source ordering is used as short-term merge rule
- Full include-order-aware precedence is deferred

3. Rename `newName` input excludes syntax wrappers
- Users provide semantic text (`food`, not `#food`)
- Feature adds wrappers based on token kind

4. Price date comparison uses standard JS `Date`
- Assumes Beancount-style date strings (`YYYY-MM-DD`) in current paths

5. Cache invalidation is correctness-biased
- Over-invalidating `PriceMap` on edits is acceptable for now
- Optimization requires later profiling and finer-grained events

## Suggested Execution Order

1. Add tests for target regressions
2. Refactor options lifecycle (`BeancountOptionsManager` + `SymbolIndex`)
3. Fix diagnostics config loading and de-dup key
4. Fix references semantics
5. Fix rename wrapper-aware replacements and validation
6. Fix PriceMap direct rate selection and cache invalidation hooks
7. Stabilize indexing unleash loop and watched-files refetch ordering
8. Fix client startup race and subscription lifecycle
9. Add multi-root limitation warning/documentation

