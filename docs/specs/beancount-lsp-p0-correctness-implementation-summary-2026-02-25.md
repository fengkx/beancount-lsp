# Beancount-LSP P0 Correctness Implementation Summary (Team Collaboration Edition) (2026-02-25)

## Document Purpose

This document records the P0 correctness remediation work that was actually implemented, and reframes it for team collaboration:

- what changed
- why it changed
- how it was validated
- how to review it safely
- how to continue from here (P1+)

This is an execution summary and handoff spec for maintainers/reviewers, not a proposal.

## Status Snapshot

### Overall status

- P0 server-side correctness remediation (planned scope `1.1` to `1.6`) is implemented.
- Minimal Phase 0 regression coverage for touched areas is added.
- `packages/lsp-server` tests and typecheck pass.

### Scope completed (server-side)

- Beancount option lifecycle correctness (`BeancountOptionsManager` + `SymbolIndex` integration)
- Diagnostics config loading consistency (`beancount.diagnostics.*`)
- Diagnostics de-duplication key correctness
- References LSP semantics (`includeDeclaration`) for account / commodity
- Rename correctness for Beancount syntax wrappers (`#`, `^`, quoted strings) and input validation
- PriceMap direct-rate selection correctness (latest/historical)
- Conservative PriceMap cache invalidation on document changes and watched-file batches
- Minimal feature-level regression tests for all above

### Explicitly deferred (not in this implementation batch)

- P1 concurrency / ordering changes (`SymbolIndex.unleashFiles()`, watched-files refetch ordering)
- Client-side lifecycle/startup robustness (P1)
- Multi-root warning/full support (P1)

## Audience and How To Use This Doc

### Intended readers

- Reviewers of the P0 remediation changes
- Maintainers planning follow-up P1 work
- Contributors onboarding into server correctness areas (`references`, `rename`, `diagnostics`, `price-map`)

### Recommended reading order

1. `Scope and Outcomes`
2. `Change Set Breakdown`
3. `Testing and Validation`
4. `Reviewer Checklist`
5. `Risks / Rollback`
6. `Handoff and Next Steps`

## Scope and Outcomes

## Goals achieved in this execution

1. Fix user-visible correctness issues first.
2. Add regression coverage for modified behavior.
3. Keep changes incremental and architecture-compatible.
4. Favor correctness over performance in cache invalidation and selection logic.

## High-level outcome summary

- References and rename behavior now align better with LSP and Beancount syntax expectations.
- Price conversion results are no longer sensitive to insertion order of price edges.
- Option state no longer remains stale after file removal/reindex flows.
- Diagnostics config is loaded consistently and de-dup no longer drops valid same-line diagnostics.

## Change Set Breakdown (By Area)

## A. References LSP Semantics (`includeDeclaration`)

### Problem (before)

`ReferencesFeature` ignored `params.context.includeDeclaration` and effectively returned usages only for account/commodity symbols.

### Implementation (done)

File:

- `packages/lsp-server/src/common/features/references.ts`

Changes:

- Read `const includeDeclaration = params.context.includeDeclaration`
- Split account/commodity retrieval into usage and definition helpers:
  - `findAccountUsages()` / `findAccountDefinitions()`
  - `findCommodityUsages()` / `findCommodityDefinitions()`
- Include definitions only when `includeDeclaration === true`
- Added final location de-dup (`uri + range`)

### Observable effect

- `references(includeDeclaration=false)` => usages only
- `references(includeDeclaration=true)` => usages + definitions (account/commodity)

### Review focus

- Ensure non-account/non-commodity behavior is unchanged.
- Confirm de-dup preserves order and does not remove distinct same-range results from different symbol kinds unexpectedly.

## B. Rename Wrapper-Aware Correctness

### Problem (before)

Rename inserted raw `newName` into all matched ranges, which breaks Beancount syntax wrappers for tags/links/payee/narration.

### Implementation (done)

File:

- `packages/lsp-server/src/common/features/rename.ts`

Changes:

- Added rename target detection (`account | commodity | tag | link | payee | narration`)
- Added per-kind validation rules
- Added wrapper-aware formatting:
  - tag -> `#${newName}`
  - link -> `^${newName}`
  - payee/narration -> quoted + escaped
  - account/commodity -> raw
- Invalid rename input now throws `ResponseError(ErrorCodes.InvalidParams, ...)`

### Defaults/assumptions used

- `newName` is semantic content (no wrapper prefixes / no quotes)
- `#foo` as tag rename input is rejected intentionally
- Commodity validation uses `^[A-Z][A-Z0-9._-]*$`

### Review focus

- Confirm validation is strict enough to prevent malformed syntax but not overly restrictive for real-world inputs.
- Confirm `escapeQuotes()` behavior is correct for backslashes + quotes in payee/narration.

## C. PriceMap Direct-Rate Selection Correctness

### Problem (before)

`getDirectRate()` returned the first matching edge, so results could be wrong when multiple price directives existed for a pair.

### Implementation (done)

File:

- `packages/lsp-server/src/common/features/prices-index/price-map.ts`

Changes:

- Reworked `getDirectRate(baseQuote, graph, date?)`
- Collect all direct candidates (`from -> to`)
- No date:
  - choose latest dated candidate
- Historical date:
  - filter `edge.date <= date`
  - choose closest prior date
- Return `null` if no valid candidate
- Added deterministic edge sorting (`to`, then `date desc`) after graph build

### Observable effect

- Latest/historical direct conversions are stable and date-correct.

### Review focus

- Verify no regression in multi-hop conversion path logic using Bellman-Ford.
- Confirm edge sorting is deterministic and side-effect-free relative to graph consumers.

## D. PriceMap Cache Invalidation (Correctness-first)

### Problem (before)

Price-related caches could remain stale after source changes until TTL expiry.

### Implementation (done)

File:

- `packages/lsp-server/src/common/startServer.ts`

Changes:

- Document content change path now calls `priceMap.invalidateAllCaches()`
- Watched-file batch path invalidates once per batch via `shouldInvalidatePriceMap`

### Tradeoff accepted

- Over-invalidation is allowed for P0 to guarantee correctness.

### Review focus

- Confirm no accidental hot-loop invalidation beyond document/watch events.
- Note that watched-files `refetchBeanFiles()` redundancy remains (P1 scope).

## E. Beancount Option Lifecycle Refactor

### Problem (before)

Options were stored as global effective values only, causing stale option state after file updates/deletes.

### Implementation (done)

Files:

- `packages/lsp-server/src/common/utils/beancount-options.ts`
- `packages/lsp-server/src/common/features/symbol-index.ts`

Changes in `beancount-options.ts`:

- Added per-source state:
  - `sourceOptions: Map<string, Map<string, string>>`
- Added recomputed effective cache:
  - `effectiveOptions: Map<SupportedOption, BeancountOption>`
- Added APIs:
  - `replaceOptionsForSource(source, options)`
  - `clearOptionsForSource(source)`
- Added recomputation with deterministic source ordering (lexical URI)
- Emit `onOptionChange` only when effective value actually changes
- Kept `setOption()` as compatibility shim delegating to source-based storage

Changes in `symbol-index.ts`:

- `_processOptionsDirectives(document)` now replaces all options for the document source in one call
- `removeFile(uri)` now clears options for that source

### Effective merge rule implemented

- Lexical source URI ordering, later source overrides earlier source

### Review focus

- Validate compatibility with code paths that still call `setOption()` directly.
- Confirm default fallback and event emission behavior when a source is cleared.

## F. Diagnostics Config Loading Consistency + De-dup Correctness

### Problems (before)

- Config loading used inconsistent object shapes and duplicated parsing logic.
- De-dup key used only `line + severity`, dropping valid diagnostics.

### Implementation (done)

File:

- `packages/lsp-server/src/common/features/diagnostics.ts`

Changes:

- Added `loadDiagnosticsConfig(connection, scopeUri?)`
  - prefers `section: 'beancount.diagnostics'`
  - merges/falls back to legacy shapes
- Added `applyDiagnosticsConfig(...)` helper to centralize config assignment/logging
- Reused shared config loading in both initial registration and config-changed path
- Reworked `mergeAndDedupDiagnostics()` key to include:
  - start/end range

## G. Post-Implementation Follow-up (2026-02-26)

### G1. Root-name option changes now trigger diagnostics revalidation

Problem observed in playground regression:

- Editing `main.bean` to add/remove `option "name_assets"` (and related root-name options) updated effective options correctly, but existing diagnostics in other open files could remain stale until another trigger.

Fix implemented:

- `packages/lsp-server/src/common/features/diagnostics.ts`
- Extended diagnostics revalidation trigger set (`REVALIDATE_ON_OPTION_CHANGE`) to include:
  - `name_assets`
  - `name_liabilities`
  - `name_equity`
  - `name_income`
  - `name_expenses`

Observed effect:

- Adding a custom root (e.g. `Actifs`) produces expected root-account diagnostics.
- Removing/restoring the option clears those diagnostics automatically without stale leftovers.

### G2. Browser WASM custom non-ASCII root compat filter (beancheck parity workaround)

Problem observed:

- In browser WASM runtime, `beancheck` diagnostics could report `Invalid account name: <non-ASCII-root>:...` for custom non-ASCII root names, while local Python Beancount accepted equivalent minimal examples.
- Tree-sitter parsing and local LSP account-root validation supported the Unicode roots, so this was not a parser/local-validation issue.

Fix implemented:

- `packages/lsp-server/src/common/features/diagnostics.ts`
- Added a browser-WASM-only compatibility filter for beancheck diagnostics when all conditions hold:
  - runtime mode is `wasm`
  - custom root options are active
  - at least one custom root contains non-ASCII characters
- Suppresses beancheck diagnostics matching custom non-ASCII roots for:
  - `Invalid account name: ...`
  - `Invalid reference to unknown account '...'` (chained noise)
- Shows a one-time warning that browser WASM diagnostics were partially suppressed and local Python runtime is authoritative.

Observed effect in playground:

- Russian custom roots (`Активы / Пассивы / Капитал / Доходы / Расходы`) can be used in `open` directives and transactions without beancheck noise flooding the Problems panel (browser WASM mode).

### G3. Diagnostics source labeling and message language normalization

Problem observed:

- It was hard to distinguish which diagnostics came from local LSP checks vs runtime beancheck.
- Root account local validation message was emitted in Chinese while surrounding diagnostics were otherwise English-first.

Fix implemented:

- `packages/lsp-server/src/common/features/diagnostics.ts`
- Split `Diagnostic.source` values:
  - local diagnostics: `beancount-lsp (lsp)`
  - runtime beancheck diagnostics: `beancount-lsp (beancheck)`
- Converted root-account validation message to English:
  - `Invalid root account name "...". Valid root account names: ...`

Reviewer note:

- This intentionally keeps the existing validation strategy (open-document local validation does not require inclusion from `main.bean`).

### G4. Playground debug commands for browser repro verification

Problem observed:

- VSCode Web focus/panel interactions can make browser automation appear successful while text was not actually written into the intended editor.

Implementation:

- `packages/playground/src/main.ts`
- Added debug commands:
  - `demo.copyActiveFileContent`
  - `demo.copyAllProjectFilesSnapshot`

Use:

- Verify active editor content after each replacement (especially non-ASCII root tests).
- Capture deterministic file snapshots (`path`, `length`, `sha256`, `head`) for repro handoff.

### G5. Browser validation findings (manual playground runs)

Validated behaviors in VSCode Web playground (WASM v3):

- Custom root options in Cyrillic are recognized by local validation and root lists.
- Account names using Cyrillic custom roots parse and render in editor/UI (outline/breadcrumb/codelens paths observed).
- `F2` rename can be invoked on Cyrillic account names (prepare-rename succeeds and pre-fills full Cyrillic account name).
- Opening a file not included by `main.bean` can still produce local diagnostics:
  - this is expected because local LSP validation runs on open documents independently of beancheck include graph.
  - severity
  - code
  - message
  - source

### Review focus

- Confirm config loading remains safe when `getConfiguration` returns non-object values.
- Confirm de-dup preserves preferred ordering while allowing distinct same-line diagnostics.

## Change Inventory (Files)

## New files (tests / test utilities)

- `packages/lsp-server/src/test/features/references-rename.test.ts`
- `packages/lsp-server/src/test/features/price-map.test.ts`
- `packages/lsp-server/src/test/features/options-lifecycle.test.ts`
- `packages/lsp-server/src/test/features/diagnostics-config.test.ts`
- `packages/lsp-server/src/test/utils/test-server-harness.ts`

## Modified files (implementation)

- `packages/lsp-server/src/common/features/references.ts`
- `packages/lsp-server/src/common/features/rename.ts`
- `packages/lsp-server/src/common/features/prices-index/price-map.ts`
- `packages/lsp-server/src/common/startServer.ts`
- `packages/lsp-server/src/common/utils/beancount-options.ts`
- `packages/lsp-server/src/common/features/symbol-index.ts`
- `packages/lsp-server/src/common/features/diagnostics.ts`

## Testing and Validation

## Test strategy used in this batch

Because the current Vitest setup cannot directly load tree-sitter wasm + `.scm` query assets in these feature test imports, tests use targeted mocks to isolate P0 logic.

This keeps regression coverage practical without changing the repo test pipeline during the P0 fix batch.

## Added regression coverage

### `references-rename.test.ts`

- account references respect `includeDeclaration=false/true`
- commodity references include definitions when `includeDeclaration=true`
- rename preserves wrappers for tag/link/payee/narration
- invalid rename inputs return protocol errors

### `price-map.test.ts`

- latest direct rate selected correctly among multiple prices
- historical direct rate selected by closest prior date
- no valid earlier price returns `undefined`
- cache invalidation refreshes conversion result after edited prices

### `options-lifecycle.test.ts`

- source replacement recomputes effective options deterministically
- clearing source restores prior/default values
- empty source replacement removes stale effect
- option change events fire only on effective change

### `diagnostics-config.test.ts`

- direct `beancount.diagnostics` config load
- legacy config shape fallback
- de-dup preserves distinct same-line diagnostics

## Validation commands executed (final)

- `pnpm -C packages/lsp-server test` ✅
- `pnpm -C packages/lsp-server typecheck` ✅

## Reviewer Checklist (Team Use)

Use this checklist during review or before merge.

### Behavior review

- [ ] `references(includeDeclaration)` behavior verified for account and commodity
- [ ] rename edits preserve Beancount syntax wrappers and reject invalid `newName`
- [ ] direct price conversion returns expected latest/historical values
- [ ] diagnostics same-line distinct messages are no longer lost
- [ ] option deletion/update no longer leaves stale root account names

### Regression review

- [ ] no obvious behavior regressions in non-target symbol reference paths (tag/link/payee/narration)
- [ ] no regressions in `PriceMap` multi-hop conversion path resolution
- [ ] diagnostics config change path still re-validates documents

### Code quality review

- [ ] helper naming and responsibilities are clear (`rename`, `diagnostics`)
- [ ] de-dup keys are stable and deterministic
- [ ] option lifecycle state transitions are understandable and test-backed

## Suggested PR / Commit Slicing (For Future Cherry-pick / Backport / Review)

This batch was implemented end-to-end, but for future maintenance/backporting, the following slicing is recommended:

1. `test(lsp-server): add feature harness and references/rename regression tests`
2. `fix(lsp-server): honor includeDeclaration and wrapper-aware rename`
3. `test(lsp-server): add price-map regression tests`
4. `fix(lsp-server): correct direct-rate selection and invalidate price caches`
5. `test(lsp-server): add options lifecycle and diagnostics config/dedup tests`
6. `fix(lsp-server): refactor options lifecycle and diagnostics config/dedup`

Benefits of this slicing:

- review focus stays narrow
- failures bisect cleanly
- backport risk is easier to assess by subsystem

## Risk Matrix (Post-Implementation)

| Area | Risk | Severity | Likelihood | Notes |
| --- | --- | --- | --- | --- |
| Rename validation | Over-restrict valid user input edge cases | Medium | Medium | Current rules are intentionally conservative for P0 |
| Price cache invalidation | Performance hit from over-invalidation | Low | Medium | Accepted for correctness-first P0 |
| Option merge precedence | URI-lexical precedence differs from include-order semantics | Medium | Low | Explicitly matches current remediation default |
| Diagnostics config loading | Unexpected client config shape | Low | Medium | Helper is defensive and has fallback paths |
| Feature tests | Mocked tests miss parser integration issues | Medium | Medium | Follow-up test infra work recommended |

## Rollback / Containment Strategy

If a regression is found after merge, revert/disable by subsystem rather than rolling back the entire batch.

### Containment options

1. Rename-only regression
- Revert `packages/lsp-server/src/common/features/rename.ts`
- Keep references/price/options/diagnostics fixes intact

2. References-only regression
- Revert `packages/lsp-server/src/common/features/references.ts`
- Rename remains independently useful and tested

3. PriceMap regression
- Revert `packages/lsp-server/src/common/features/prices-index/price-map.ts`
- Optionally keep `startServer` cache invalidation hook if issue is selection-logic only

4. Options lifecycle regression
- Revert `packages/lsp-server/src/common/utils/beancount-options.ts` and `packages/lsp-server/src/common/features/symbol-index.ts` together
- These two files are coupled for this fix

5. Diagnostics regression
- Revert `packages/lsp-server/src/common/features/diagnostics.ts`
- Independent from other P0 fixes

### Why this is safe

The implemented changes are mostly localized by subsystem, with limited cross-file coupling except:

- options lifecycle (`beancount-options.ts` + `symbol-index.ts`)
- price cache invalidation (`price-map.ts` + `startServer.ts`) if testing cache hooks specifically

## Team Handoff Notes (Next Contributors)

## What is stable enough to build on

- P0 behavior fixes listed above
- Minimal regression tests for touched behavior
- `DiagnosticsFeature.loadDiagnosticsConfig()` and `applyDiagnosticsConfig()` helper structure
- Source-based option lifecycle model in `BeancountOptionsManager`

## Recommended next owner areas (P1)

### P1-A: Indexing/ordering stability

- `SymbolIndex.unleashFiles()` background task management
- Watched-files `refetchBeanFiles()` dedup + await ordering in `startServer.ts`

### P1-B: Test infrastructure quality

- Add Vitest support for tree-sitter wasm and `.scm` query imports
- Reduce feature-test mocks and introduce higher-fidelity integration tests

### P1-C: Multi-root safety disclosure

- Add explicit warning/documentation for first-workspace-biased behavior until full multi-root support lands

## Suggested owner split (if parallelizing)

- Maintainer A: P1-A (`symbol-index`, `startServer` ordering)
- Maintainer B: P1-B (test infra)
- Maintainer C: P1-C (multi-root warning/docs)

This split minimizes file overlap and review conflicts.

## Traceability and References

### Source remediation spec

- `docs/specs/beancount-lsp-correctness-remediation-spec-2026-02-25.md`

### This document

- `docs/specs/beancount-lsp-p0-correctness-implementation-summary-2026-02-25.md`

This document captures the executed P0 subset and adds collaboration-oriented review, risk, and handoff guidance for the team.
