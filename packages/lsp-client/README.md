# Beancount language service

A powerful VSCode extension for Beancount plain text accounting, providing rich language features and intelligent assistance. Built with tree-sitter for robust parsing and analysis.

## Features

### Core Language Features

- **Syntax Highlighting**: Powered by tree-sitter for accurate and fast syntax highlighting ([semanticTokens](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_semanticTokens))
- **Code Completion**: Intelligent code completion for accounts, currencies, payees, narrations, tags, and dates ([completion](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_completion))
- **Error Detection**: Real-time error detection for transaction balancing issues (with configurable tolerance) ([diagnostics](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_publishDiagnostics))
- **Hover Information**: Hover on accounts, commodities, and prices to see detailed information and price history ([hover](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_hover))

### Navigation and Code Intelligence

- **Go to Definition**: Jump to account definitions and other symbols ([definition](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_definition))
- **Find References**: Find all references to accounts and other symbols ([references](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_references))
- **Document Symbols**: Quick navigation through your Beancount file structure ([documentSymbol](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentSymbol))
- **Folding Ranges**: Code folding support for better organization ([foldingRange](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_foldingRange))
- **Selection Ranges**: Smart selection of Beancount elements ([selectionRange](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_selectionRange))
- **Document Links**: Clickable links to included Beancount files ([documentLink](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentLink))
- **Inlay Hints**: Inline hints showing calculated amounts for auto-balanced transactions ([inlayHint](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_inlayHint))

### Code Actions and Refactoring

- **Rename Symbol**: Safely rename accounts, commodities, tags, and payees across your entire codebase ([rename](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_rename))

## Configuration

The extension provides several configuration options to customize its behavior:

### Extension Settings

- `beanLsp.maxNumberOfProblems`: Controls the maximum number of problems produced by the server. Default is 100.
- `beanLsp.trace.server`: Controls the verbosity of logging and traces the communication between VS Code and the language server. Options are:
  - `off`: Shows errors only
  - `error`: Shows errors
  - `warn`: Shows warnings and errors
  - `messages`: Shows info-level messages, warnings, and errors (default)
  - `debug`: Shows debug-level messages and below
  - `verbose`: Shows all log messages (most verbose)
- `beancount.mainBeanFile`: Specifies the main Beancount file to use for analysis. This should be relative to the workspace root. Default is "main.bean".
- `beancount.diagnostics.tolerance`: Tolerance value for transaction balancing. Set to 0 for exact matching. Default is 0.005.
- `beanLsp.inlayHints.enable`: Enable or disable inlay hints showing calculated amounts for auto-balanced transactions. Default is true.
- `beanLsp.mainCurrency`: Main currency for price conversions. If empty, the most frequently used currency will be automatically determined.
- `beanLsp.currencys`: List of currencies that should participate in price conversions. Commodities not included in this list (like stocks) will be excluded from conversion calculations. If empty, all commodities will be considered for conversions.

### Example Configuration

```json
{
	"beancount.mainBeanFile": "main.bean",
	"beanLsp.trace.server": "debug",
	"beanLsp.mainCurrency": "USD",
	"beanLsp.currencys": ["USD", "EUR", "GBP", "JPY"],
	"editor.semanticTokenColorCustomizations": {
		"enabled": true,
		"rules": {
			"date": {
				"foreground": "#569CD6",
				"bold": true
			},
			"account": {
				"foreground": "#4EC9B0"
			},
			"currency": {
				"foreground": "#D7BA7D"
			},
			"keyword": {
				"foreground": "#C586C0",
				"bold": true
			},
			"tag": {
				"foreground": "#9CDCFE"
			}
		}
	}
}
```
