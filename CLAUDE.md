# Repository Agent Notes

This file provides guidance to coding agents working with code in this repository.

## Project Overview

This is a **VSCode Language Server Extension** for **Beancount** (plain text accounting language). It provides rich language features including syntax highlighting, code completion, error detection, hover information, navigation, and code intelligence for Beancount files. The extension runs fully in browsers (VSCode Web, github.dev) without requiring Python or bean installation.

**Beancount Syntax Reference**: https://beancount.github.io/docs/beancount_language_syntax.html

## Architecture

### Monorepo Structure

The project uses a pnpm monorepo with Turbo for task orchestration:

- **packages/lsp-client**: VSCode extension client (UI/UX, configuration, client-side logic)
- **packages/lsp-server**: Core language server implementation with tree-sitter parsing
- **packages/shared**: Shared types, constants, and utilities
- **packages/storage**: Data persistence layer
- **packages/tree-sitter-beancount**: Custom tree-sitter parser written in Rust with WASM output

### Key Technical Decisions

- **Tree-sitter Integration**: Uses custom tree-sitter grammar (`tree-sitter-beancount`) for robust parsing of Beancount syntax
- **Dual Build Targets**: Supports both Node.js (desktop VSCode) and browser (VSCode Web) environments
- **Language Server Protocol**: Implements comprehensive LSP features (syntax highlighting, completion, diagnostics, hover, navigation, etc.)
- **AI/LLM Integration**: Includes language model tools for Beancount queries

## Development Commands

### Root Level Commands

```bash
# Install dependencies and initialize git hooks
pnpm install
git submodule update --init

# Build all packages
pnpm build

# Development watch mode
pnpm dev

# Run type checking, linting, and formatting checks
pnpm check

# Run tests across all packages
pnpm test

# Format code using dprint
pnpm format

# Build for npm publication
pnpm build:npm
```

### Package-Specific Commands

Each package has its own scripts. Key ones include:

**lsp-server**:

```bash
cd packages/lsp-server
pnpm build        # Build with VSCode client assets
pnpm build:npm    # Build for npm publication
pnpm watch        # Watch mode for development
pnpm test         # Run tests with Vitest
pnpm test:watch   # Run tests in watch mode
```

**lsp-client**:

```bash
cd packages/lsp-client
pnpm run vsix     # Package extension into .vsix file
```

### Pre-commit Hooks

The project uses `simple-git-hooks` with `nano-staged`:

- Automatically formats code with dprint
- Runs ESLint fixes
- Executes `pnpm check` before commit

## Code Organization

### LSP Server Architecture

- **Tree-sitter queries**: Located in `packages/lsp-server/src/common/language/queries/`
- **Symbol index**: Defined in `packages/lsp-server/src/common/features/symbol-index.ts`
- **Feature interface**: All LSP features must implement the `Feature` interface in `packages/lsp-server/src/common/features/types.ts`
- **Existing features**: Located in `packages/lsp-server/src/common/features/` folder

### LSP Client Architecture

- **Custom messages**: Defined in `packages/shared/src/messages.ts`
- **LLM tools**: Must implement `ToolImpl` interface in `packages/lsp-client/src/common/llm/tools/tool.ts`
- **Communication**: Client communicates with server through LSP or JSON RPC with custom messages

## Important Patterns and Rules

### Text Document Import (Critical)

When working with text documents in the LSP server:

```typescript
// DO NOT use this:
import { TextDocument } from 'vscode-languageserver';

// DO use this instead:
import { TextDocument } from 'vscode-languageserver-textdocument';
```

### Feature Implementation Guidelines

1. **Parsing and calculations should be done server-side**
2. **Reuse existing parsing and symbol index processes** when possible
3. **Improve existing implementations** rather than creating new ones
4. **When returning capabilities, always return something** on its handler

### Package Manager

- **Use pnpm instead of npm** for all package management operations

### Language and Comments

- **Use English in code and comments**

### Completion System Architecture

The completion system uses a **placeholder reparse** technique for context detection:

1. **Universal try strategy**: Instead of pre-determining contexts, define completion scenarios and try them sequentially
2. **Syntax tree validation**: The tree-sitter parser automatically rejects invalid placeholders
3. **Smart trigger handling**: Automatically removes trigger characters from placeholders if already typed
4. **Error detection**: Immediately rejects trees with syntax errors to avoid wasted processing

**Key completion scenarios** (in priority order):

1. Account completions (`Assets:Bank`) - works in postings, directives (note, balance, close, pad, document)
2. Tag completions (`#tag`) - works in tags_links, pushtag, poptag, transaction lines
3. Currency completions (`CNY`) - works in price_annotation, amount after numbers
4. Link completions (`^link`) - works in tags_links, transaction lines
5. Metadata key-value (`somekey: "value"`) - works in key_value contexts

### Default Tolerance Algorithm

The diagnostics feature implements a **conservative default tolerance algorithm**:

- Only considers **base amounts** of postings (ignores cost and price annotations)
- Uses **highest precision** when multiple precisions exist for same currency (most restrictive approach)
- Calculates tolerance as **0.5 × (10^(-precision))** per currency
- **Skips integer amounts** (no tolerance inferred for precision 0)

**Important**: This differs from Beancount's official specification (which uses the "coarsest" tolerance). Our implementation is more conservative, using the smallest tolerance for stricter validation.

## Testing

- Uses Vitest for unit testing
- Test files are co-located with source files (e.g., `*.test.ts`)
- Run tests with `pnpm test` from root or package directories

## Configuration

The extension provides extensive VSCode configuration options (see README.md for details):

- Transaction balancing tolerance
- Main Beancount file path
- Python 3 executable path
- Formatter settings (alignment, currency alignment)
- Hover information settings
- Completion settings (including Chinese pinyin filter)

## Building for Distribution

1. Build all packages: `pnpm build`
2. Package the extension: `cd packages/lsp-client && pnpm run vsix`
3. The resulting `.vsix` file can be installed in VSCode or published to the marketplace

## Development Workflow

1. Use `pnpm dev` for watch mode during development
2. Press `F5` in VSCode to launch Extension Development Host for testing
3. Use the "Run and Debug" tab in VSCode with provided launch configurations
4. Pre-commit hooks ensure code quality before committing

## Key Implementation Files

- **Diagnostics tolerance algorithm**: `packages/lsp-server/src/common/features/diagnostics.ts`
- **Completion placeholder reparse entrypoint**: `packages/lsp-server/src/common/features/completions/index.ts`
- **Completion engine internals**: `packages/lsp-server/src/common/features/completions/completion-engine.ts`
- **Symbol index**: `packages/lsp-server/src/common/features/symbol-index.ts`
- **Tree-sitter queries**: `packages/lsp-server/src/common/language/queries/`

## Beancount Resources

- **Official syntax documentation**: https://beancount.github.io/docs/beancount_language_syntax.html
- **Precision & tolerances**: https://beancount.github.io/docs/precision_tolerances.html
- **Language Server Protocol spec**: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification

## GitHub.dev CSP Notes
- GitHub.dev blocks creating web workers from remote extension assets. Example: creating a worker from `https://*.vscode-unpkg.net/.../server/beancount-worker.js` is blocked by CSP because `child-src` allows only `self`, `data:`, and `blob:`.
- `worker-src` is not explicitly set in the GitHub.dev CSP, so `child-src` is the fallback for workers.
- Mitigation: create workers from `blob:` URLs (e.g., fetch the script text, wrap in `Blob`, then `URL.createObjectURL`), or use in-extension `self`/`blob` URLs. Remote HTTPS worker URLs will be blocked.


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
- In FSA-mode browser automation, prefer the Explorer `Open Folder` button as the most stable entrypoint; command palette invocation of `Open Local` is more prone to fuzzy-command misfires.
- For rename tests (`F2`), place the caret inside the symbol token (not at the token boundary) before invoking rename, otherwise VSCode Web may report `The element can't be renamed.` even when rename support is working.
- If a syntax error appears immediately after automated typing, first suspect accidental auto-indent / misplaced whitespace from editor input rather than parser/runtime incompatibility.
