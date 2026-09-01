# Beancount `wordPattern` Design Spec (2026-09-01)

## Status

Implemented. This document defines the client-side word model and the
acceptance criteria for the implementation. The generator, generated language
configuration, and automated tests now implement it; completion server
behavior remains unchanged. The VS Code Web Playground smoke check remains
environment-dependent.

## Summary

The Beancount VS Code extension needs a `wordPattern` that models interactive
editor tokens, not only fully valid Beancount syntax. In particular, a user
must be able to type account queries incrementally (`A`, `ABaC`, `A:`,
`A:BOC`) without VS Code truncating the word used for local completion
filtering.

The selected design replaces the current overlapping account, commodity, and
identifier alternatives with four ordered token classes:

1. Partial or complete dates
2. Numbers
3. Tags and links
4. Symbol-like words, including account queries, commodities, metadata keys,
   and identifiers

The source expressions remain Unicode-aware and are transformed with
`regexpu-core` before being written to `language-configuration.json`. The
generator is the source of truth; the JSON value is a checked-in generated
artifact.

## Goals

- Preserve complete account shorthand such as `ABaC` for local completion
  filtering.
- Keep every useful intermediate account query in one word, including trailing
  ASCII or full-width colons.
- Support Beancount dates, numbers, commodities, metadata keys, tags, links,
  and Unicode account names without duplicating the parser grammar.
- Keep punctuation and whitespace boundaries predictable for word selection,
  navigation, filtering, and replacement.
- Generate a deterministic, legacy-compatible JavaScript regular expression
  for VS Code Desktop and VS Code Web.
- Make generator/config drift detectable in tests and CI.

## Non-goals

- Validating complete Beancount syntax on the client.
- Replacing tree-sitter or server-side completion-context detection.
- Changing server ranking, completion intent, or completion item ranges.
- Adding or changing completion trigger characters.
- Changing the LSP protocol or any public client/server API.
- Defining word behavior for prose inside quoted strings or comments beyond
  normal lexical boundaries.

## Why `wordPattern` Matters

`wordPattern` is a VS Code language-configuration regular expression. It does
not register an LSP trigger character and does not directly turn a typed
character into a `TriggerCharacter` completion request. It still affects the
completion lifecycle indirectly:

- Quick suggestions use the editor's word at the cursor to decide whether the
  cursor is in an auto-triggerable word.
- While a completion session is active, VS Code uses the word before the cursor
  to determine whether an incomplete provider should be requested again with
  `TriggerForIncompleteCompletions`.
- VS Code uses the current word for client-side filtering and scoring.
- A completion item without an explicit range inherits a default replacement
  range from the current word.
- Word selection, word navigation, deletion, and other editor commands use the
  same word definition.

The Beancount server currently returns an incomplete `CompletionList` and
provides explicit `TextEdit` ranges for its completion items. Therefore the
server remains authoritative for replacement and ranking, but the client word
must still contain the complete query so VS Code does not filter against a
truncated prefix.

Trigger characters remain a separate mechanism. The current server registers
`2`, `#`, `"`, and `^`; this design does not add `:` or whitespace as trigger
characters.

## Current Problems

The current generator has separate alternatives for account queries, complete
accounts, commodities, account prefixes, and normal words. Those alternatives
overlap and encode different ideas of what an account-like token is.

Observable consequences include:

- Mixed-case collapsed shorthand such as `ABaC` is matched only as `AB`.
- Interactive states and complete syntax require separate expressions that can
  drift apart.
- Unicode character classes are expanded repeatedly by `regexpu-core`, making
  the generated pattern difficult to inspect.
- The number expression owns trailing whitespace even though whitespace is a
  delimiter rather than part of a word.
- Tags and links do not currently preserve every separator accepted by the
  Beancount grammar.

Issue [#165](https://github.com/fengkx/beancount-lsp/issues/165) exposed the
client-tokenization problem. Server-side account ranking already supports
collapsed and separator-based shorthand; the regression occurs before or
alongside that ranking when VS Code filters with a truncated word.

## Selected Token Model

The source pattern consists of the following alternatives in this exact order.
Ordering matters because JavaScript regular-expression alternation selects the
first alternative that matches at a position.

| Priority | Token class      | Responsibility                                      |
| -------- | ---------------- | --------------------------------------------------- |
| 1        | Date             | Preserve complete and useful partial date tokens    |
| 2        | Number           | Preserve signed, decimal, and grouped numeric input |
| 3        | Tag or link      | Preserve `#` or `^` with its complete symbol body   |
| 4        | Symbol-like word | Preserve account queries and other identifiers      |

The alternatives must be combined with non-capturing groups:

```js
const date = /[12]\d{3}[-/]\d{0,2}(?:[-/]\d{0,2})?/u;
const number = /[+-]?(?:\d(?:[\d,]*\d)?(?:\.\d*)?|\.\d+)/u;
const tagOrLink = /[#^][A-Za-z0-9_./-]+/u;
const symbol = /\p{L}[\p{L}\p{N}'._/:：-]*/u;

const source = [date, number, tagOrLink, symbol]
	.map(pattern => `(?:${pattern.source})`)
	.join('|');

const wordPattern = rewritePattern(source, 'u', {
	unicodeFlag: 'transform',
});
```

The combined expression must not contain an alternative capable of matching an
empty string.

### Date

The date alternative is intentionally valid for both complete dates and useful
typing states:

- `2026-`
- `2026-09`
- `2026-09-`
- `2026-09-01`
- `2026/09/01`

Before the first separator, an input such as `2` or `2026` is handled by the
number alternative. Once `-` or `/` is present after a four-digit year, the date
alternative wins and keeps the complete partial date in one word.

This is a lexical model. Calendar validity, such as the number of days in a
month, remains a parser/server concern.

### Number

The number alternative supports common Beancount numeric input and useful
intermediate states:

- `0`
- `-1`
- `+1.25`
- `.5`
- `1.`
- `1,234.50`

Grouping commas are retained only when they occur between digits. For example,
`1,234.50` is one word, while `1, USD` produces the words `1` and `USD`.

The sign belongs to the number only when a number follows. Arithmetic operators
between tokens remain boundaries. Whitespace is never part of the number.

### Tag and link

Tags and links preserve their semantic prefix and support the separator set
accepted by the tree-sitter grammar:

- `#tag`
- `#tag-1`
- `#project/2026.09`
- `^invoice_2026`
- `^invoice/2026.09`

A bare `#` or `^` is not a word. Those characters already trigger completion;
after one body character is typed, the complete tag or link becomes the current
word.

### Symbol-like word

The symbol alternative deliberately combines several server-level syntactic
categories that need the same editor token boundary:

- Account names
- Collapsed account shorthand
- Explicit account query segments
- Commodities
- Metadata keys
- Directive and query identifiers
- Other Unicode identifiers

It requires a Unicode letter at the start. Subsequent characters may be Unicode
letters or numbers plus the separators `'`, `.`, `_`, `/`, ASCII `:`, full-width
`：`, and `-`.

Examples include:

- `A`
- `ABS`
- `ABaC`
- `A:`
- `A:B`
- `A:BOC`
- `L:1507:`
- `L：1507`
- `Assets:Bank:Card`
- `资产:银行`
- `BRK.B`
- `USD'24`
- `some-key`

This expression intentionally accepts invalid final syntax such as repeated or
trailing colons. Those strings are valid editor input states. The parser and
completion context decide whether they are meaningful in the current Beancount
location.

## Boundary Rules

The following characters are not part of a word unless explicitly listed in a
token class:

- Spaces, tabs, and newlines
- Double quotes
- Semicolons
- Braces, brackets, and parentheses
- Commas outside numbers
- Arithmetic and annotation operators
- Other punctuation such as `@`, `!`, and `?`

Expected extraction examples:

| Input            | Extracted words relevant to this design |
| ---------------- | --------------------------------------- |
| `A:BOC,`         | `A:BOC`                                 |
| `"A:BOC"`        | `A:BOC`                                 |
| `A:BOC␠`         | `A:BOC`                                 |
| `#tag-1,`        | `#tag-1`                                |
| `^link/path.v2;` | `^link/path.v2`                         |
| `1,234.50 USD`   | `1,234.50`, `USD`                       |
| `1, USD`         | `1`, `USD`                              |
| `foo@bar`        | `foo`, `bar`                            |

Here `␠` denotes one trailing ASCII space in the input.

Recognizing a word inside a comment or quoted string does not imply that a
completion should be offered there. Syntax context remains the server's
responsibility.

## Source of Truth and Generation

`packages/lsp-client/scripts/make-word-pattern.js` is the source of truth.
`packages/lsp-client/language-configuration.json` is a generated, checked-in
artifact because VS Code consumes the language configuration directly.

The implementation makes generation deterministic and exposes a pure
`buildWordPattern()` operation so tests can evaluate the source design without
first modifying the JSON file. The script supports two modes:

- Generate mode writes the computed value to `language-configuration.json`.
- Check mode computes the value, compares it with the checked-in JSON value,
  and exits non-zero without writing when they differ.

Package scripts and CI run check mode before build/package operations.
This avoids a build that silently rewrites a tracked file or tests stale
generated output.

The generated expression must continue using `regexpu-core` with Unicode flag
transformation so the JSON pattern does not depend on a regular-expression
`u` flag that language configuration cannot provide.

The design prototype produced the following sizes with the repository's current
dependencies:

| Pattern                    | Generated source length |
| -------------------------- | ----------------------: |
| Current checked-in pattern |       24,229 characters |
| Selected design prototype  |       18,112 characters |

The approximate 25% reduction is useful evidence that overlapping expansions
were removed. Generated size is not an acceptance threshold; correctness,
determinism, and maintainability take priority.

## Completion Interaction

For a settled completion session, incremental account input should behave as
follows:

| Text after input | Client word | Expected request reason                                       |
| ---------------- | ----------- | ------------------------------------------------------------- |
| `A`              | `A`         | Initial quick/manual completion (`Invoked`)                   |
| `A:`             | `A:`        | Incomplete-provider retrigger when the session remains active |
| `A:B`            | `A:B`       | Incomplete-provider retrigger                                 |
| `A:BO`           | `A:BO`      | Incomplete-provider retrigger                                 |
| `A:BOC`          | `A:BOC`     | Incomplete-provider retrigger                                 |

Fast typing can cancel or coalesce requests, so the implementation must not
assert one network request per keystroke. The invariant is that every settled
request and every client-side filter sees the complete current word rather than
a truncated prefix.

No character in this table becomes an LSP trigger character under this design.
`wordPattern` only supplies the word state used by VS Code's existing quick and
incomplete-completion logic.

## Alternatives Rejected

### Reproduce the full Beancount grammar

Rejected because parser-valid syntax excludes useful typing states and would
duplicate account configuration, Unicode, and validation rules already owned by
tree-sitter and the server. It would also make client behavior change whenever
the grammar changes.

### Continue adding specialized alternatives

Rejected because the current account-query, account, commodity, account-part,
and normal-word expressions overlap. Alternation order then determines which
prefix VS Code sees, as demonstrated by `ABaC` becoming `AB`. Repeated Unicode
expansion also makes the generated result unnecessarily large.

### Include trailing whitespace in a word

Rejected because whitespace is a token boundary. Including it makes word
selection and replacement surprising and couples tokenization to speculative
completion-trigger behavior. If completion after whitespace needs different
behavior, it should be designed explicitly in the completion lifecycle rather
than hidden in `wordPattern`.

### Add `:` or space as trigger characters

Rejected for this change. `:` is preserved in the word and the server already
returns incomplete completion lists. Space would cause broad requests in many
unrelated contexts. Trigger policy can be evaluated separately with measured
client behavior.

## Implementation Plan

The implementation follows these steps:

1. Retain the regression assertion from commit `4740883` in the expanded client
   test suite; it asserts that `ABaC` is one complete client word.
2. Replace the overlapping source alternatives in
   `make-word-pattern.js` with the four ordered expressions defined here.
3. Build the source with non-capturing alternation and transform it once with
   `regexpu-core`.
4. Expose pure generation and non-writing check paths.
5. Regenerate `language-configuration.json` and verify that no unrelated JSONC
   formatting changes occur.
6. Expand client tests for the complete behavior matrix and generated-artifact
   synchronization.
7. Run server ranking tests to prove that the client-only change does not alter
   ranking semantics.
8. Build the Playground with the updated extension and validate `ABaC` and
   incremental colon input when the browser worker and editor interaction are
   available.

## Test Plan

### Generator and artifact tests

- The generated pattern exactly equals `language-configuration.json`'s
  `wordPattern` value.
- Repeated generation produces byte-identical output.
- The transformed expression compiles without flags in the supported Node.js
  runtime.
- No alternative and no combined match can produce an empty string.

### Whole-token positive cases

Account and shorthand:

- `A`
- `ABS`
- `ABaC`
- `A:`
- `A:B`
- `A:BOC`
- `L:1507:`
- `L：1507`
- `Assets:Bank:Card`
- `资产:银行`

Other symbols:

- `USD`
- `BRK.B`
- `USD'24`
- `some-key`
- `#tag-1`
- `#tag/path.v2`
- `^link-1`
- `^link/path.v2`

Dates and numbers:

- `2026-`
- `2026-09-`
- `2026-09-01`
- `2026/09/01`
- `0`
- `-1`
- `+1.25`
- `.5`
- `1.`
- `1,234.50`

### Boundary cases

- `A:BOC,` excludes the comma.
- `"A:BOC"` excludes both quotes.
- `A:BOC␠` excludes the trailing ASCII space.
- `#tag-1,` excludes the comma.
- `^link/path.v2;` excludes the semicolon.
- `1,234.50 USD` produces two words.
- Empty input and punctuation-only input do not match.
- A comma is retained only inside a numeric match.

Tests should include both whole-string assertions and extraction from surrounding
text at representative cursor positions. Whole-string assertions alone cannot
detect accidental delimiter ownership or competing-prefix behavior.

### Regression and integration checks

Run at minimum:

```bash
pnpm --filter beancount-lsp-client exec vitest run scripts/make-word-pattern.spec.mts
pnpm --filter beancount-lsp-server exec vitest run src/test/utils/completions-ranking.test.ts
pnpm check
git diff --check
```

In the Playground, define an account such as `Assets:Bank:Card`, type `ABaC`,
invoke or wait for completion, and verify that the expected account remains in
the candidate list. Also type `A:BOC` one character at a time and confirm that
the word and completion filter remain continuous across the colon.

## Acceptance Criteria

- All four token classes and their ordering match this specification.
- `ABaC` and every listed account intermediate state are complete words.
- Unicode accounts and full-width colon input remain supported.
- Date, number, commodity, metadata, tag, and link cases pass.
- Delimiters are excluded exactly as specified and no empty match is possible.
- The generated JSON value is deterministic and synchronized with the source.
- Existing server completion-ranking tests remain unchanged and pass.
- No LSP capability, trigger character, or public API changes are introduced.
- The Playground reproducer for issue #165 succeeds.

## References

- [VS Code `SuggestModel`](https://github.com/microsoft/vscode/blob/main/src/vs/editor/contrib/suggest/browser/suggestModel.ts)
- [VS Code completion model](https://github.com/microsoft/vscode/blob/main/src/vs/editor/contrib/suggest/browser/completionModel.ts)
- [VS Code language configuration guide](https://code.visualstudio.com/api/language-extensions/language-configuration-guide)
- [LSP 3.17 completion specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_completion)
- [beancount-lsp issue #165](https://github.com/fengkx/beancount-lsp/issues/165)
