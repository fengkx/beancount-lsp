<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=fengkx.beancount-lsp-client" target="_blank" rel="noopener noreferrer">
    <img width="252" src="https://cdn.sa.net/2025/03/08/YGTOpSwVHLAm5aW.png" alt="Beancount LSP logo">
  </a>
</p>

# Beancount language service

A VSCode extension (Language Server) for Beancount plain text accounting, providing rich language features and intelligent assistance. Built with tree-sitter for robust parsing and analysis.

It can be run fully in a browser, which means you can use it in [VSCode for Web](https://vscode.dev/) and [github.dev](https://github.dev/) without any additional setup (even without bean and python).

## Features

### Core Language Features

- **Syntax Highlighting**: Powered by tree-sitter for accurate and fast syntax highlighting ([semanticTokens](https://microsoft.github.io/language-server-protocol/specification/#textDocument_semanticTokens))
- **Code Completion**: Intelligent code completion for accounts, currencies, payees, narrations, tags, and dates ([completion](https://microsoft.github.io/language-server-protocol/specification/#textDocument_completion))
- **Error Detection**: Real-time error detection for transaction balancing issues (with configurable tolerance) ([diagnostics](https://microsoft.github.io/language-server-protocol/specification/#textDocument_publishDiagnostics))
- **Hover Information**: Hover on accounts, commodities, and prices to see detailed information and price history ([hover](https://microsoft.github.io/language-server-protocol/specification/#textDocument_hover))

### Navigation and Code Intelligence

- **Go to Definition**: Jump to account definitions and other symbols ([definition](https://microsoft.github.io/language-server-protocol/specification/#textDocument_definition))
- **Find References**: Find all references to accounts and other symbols ([references](https://microsoft.github.io/language-server-protocol/specification/#textDocument_references))
- **Document Symbols**: Quick navigation through your Beancount file structure ([documentSymbol](https://microsoft.github.io/language-server-protocol/specification/#textDocument_documentSymbol))
- **Folding Ranges**: Code folding support for better organization ([foldingRange](https://microsoft.github.io/language-server-protocol/specification/#textDocument_foldingRange))
- **Selection Ranges**: Smart selection of Beancount elements ([selectionRange](https://microsoft.github.io/language-server-protocol/specification/#textDocument_selectionRange))
- **Document Links**: Clickable links to included Beancount files ([documentLink](https://microsoft.github.io/language-server-protocol/specification/#textDocument_documentLink))
- **Inlay Hints**: Inline hints showing calculated amounts for auto-balanced transactions ([inlayHint](https://microsoft.github.io/language-server-protocol/specification/#textDocument_inlayHint))

### Code Actions and Refactoring

- **Rename Symbol**: Safely rename accounts, commodities, tags, and payees across your entire codebase ([rename](https://microsoft.github.io/language-server-protocol/specification/#textDocument_rename))

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
- `beanLsp.manBeanFile`: Specifies the main Beancount file to use for analysis. This should be relative to the workspace root. Default is "main.bean".
- `beancount.diagnostics.tolerance`: Tolerance value for transaction balancing. Set to 0 for exact matching. Default is 0.005.
- `beancount.diagnostics.warnOnIncompleteTransaction`: Show warnings for incomplete transactions (marked with '!' flag). These are transactions that are considered unconfirmed in Beancount. Default is true.
- `beanLsp.inlayHints.enable`: Enable or disable inlay hints showing calculated amounts for auto-balanced transactions. Default is true.
- `beanLsp.mainCurrency`: Main currency for price conversions. If empty, the most frequently used currency will be automatically determined.
- `beanLsp.currencys`: List of currencies that should participate in price conversions. Commodities not included in this list (like stocks) will be excluded from conversion calculations. If empty, all commodities will be considered for conversions.
- `beanLsp.formatter.enabled`: Enable or disable automatic formatting of Beancount files. The formatter aligns accounts, amounts (with decimal point alignment), currencies, and comments for improved readability. Default is true.

### Example Configuration

```json
{
	"beanLsp.manBeanFile": "main.bean",
	"beanLsp.trace.server": "debug",
	"beancount.diagnostics.tolerance": 0.005,
	"beancount.diagnostics.warnOnIncompleteTransaction": true,
	"beanLsp.mainCurrency": "USD",
	"beanLsp.currencys": ["USD", "EUR", "GBP", "JPY"],
	"beanLsp.formatter.enabled": true,
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

## Support

If you find this extension helpful, please consider:

1. Rating the extension on the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=fengkx.beancount-lsp-client)
2. Starring the [GitHub repository](https://github.com/fengkx/beancount-lsp)
3. Contributing to the project by submitting issues or pull requests
