<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=fengkx.beancount-lsp-client" target="_blank" rel="noopener noreferrer">
    <img width="252" src="https://raw.githubusercontent.com/fengkx/beancount-lsp/master/packages/lsp-client/assets/icon.png" alt="Beancount LSP logo">
  </a>
</p>

# Beancount language service

A VSCode extension (Language Server) for Beancount plain text accounting, providing rich language features and intelligent assistance. Built with tree-sitter for robust parsing and analysis.

It can be run fully in a browser, which means you can use it in [VSCode for Web](https://vscode.dev/) and [github.dev](https://github.dev/) without any additional setup (even without bean and python).

## Try Online

**[Online Preview Demo](https://fengkx.github.io/beancount-lsp)** - Try the extension in your browser (note: browser version has limited features compared to the desktop VSCode extension).

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
- `beanLsp.mainBeanFile`: Specifies the main Beancount file to use for analysis. This should be relative to the workspace root. Default is "main.bean".
- `beanLsp.python3Path`: Path to Python 3 executable. If empty, the system default Python 3 will be used. This Python installation should have the beancount package installed. Default is empty (uses system default).
- `beanLsp.browserWasmBeancount.enabled`: Enable browser-side Beancount WASM diagnostics (beancheck). Values: `off` (disable), `v2` (Beancount v2), `v3` (Beancount v3). Default is `off`.
- `beanLsp.browserWasmBeancount.extraPythonPackages`: Python packages to install in the browser-side Beancount WASM runtime via micropip (e.g. fava-plugins for plugin support). Useful when your ledger uses custom plugin modules. Default is `["fava-plugins"]`.
- `beancount.diagnostics.tolerance`: Tolerance value for transaction balancing. Set to 0 for exact matching. Default is 0.005.
- `beancount.diagnostics.warnOnIncompleteTransaction`: Show warnings for incomplete transactions (marked with '!' flag). These are transactions that are considered unconfirmed in Beancount. Default is true.
- `beanLsp.inlayHints.enable`: Enable or disable inlay hints showing calculated amounts for auto-balanced transactions. Default is true.
- `beanLsp.codeLens.enable`: Master switch to enable or disable all code lens. Default is true.
- `beanLsp.codeLens.accountBalance.enable`: Enable or disable code lens for open directives showing account balances. Default is true.
- `beanLsp.codeLens.pad.enable`: Enable or disable code lens for pad directives showing pad amounts. Default is true.
- `beanLsp.mainCurrency`: Main currency for price conversions. If empty, the most frequently used currency will be automatically determined.
- `beanLsp.currencys`: List of currencies that should participate in price conversions. Commodities not included in this list (like stocks) will be excluded from conversion calculations. If empty, all commodities will be considered for conversions.
- `beanLsp.formatter.enabled`: Enable or disable automatic formatting of Beancount files. The formatter aligns accounts, amounts (with decimal point alignment), currencies, and comments for improved readability. Default is true.
- `beanLsp.hover.includeSubaccountBalance`: Enable or disable the hover window including balances of subaccounts. By default, only show the balance of the hovered account. Default is false.
- `beanLsp.formatter.alignCurrency`: When true, the formatter aligns lines by currency column. When false, the formatter aligns lines by decimal point.
- `beanLsp.completion.enableChinesePinyinFilter`: Enable or disable Chinese pinyin fuzzy filter in completions. When enabled, you can use pinyin first letters to filter Chinese characters (e.g., 'zs' to match '招商'). This feature is helpful for Chinese users but may slightly impact completion performance. Default is false.

### Example Configuration

```json
{
	"beanLsp.mainBeanFile": "main.bean",
	"beanLsp.python3Path": "/usr/local/bin/python3",
	"beanLsp.trace.server": "debug",
	"beanLsp.browserWasmBeancount.enabled": "off",
	"beanLsp.browserWasmBeancount.extraPythonPackages": [],
	"beancount.diagnostics.tolerance": 0.005,
	"beancount.diagnostics.warnOnIncompleteTransaction": true,
	"beanLsp.mainCurrency": "USD",
	"beanLsp.currencys": ["USD", "EUR", "GBP", "JPY"],
	"beanLsp.formatter.enabled": true,
	"beanLsp.formatter.alignCurrency": false,
	"beanLsp.hover.includeSubaccountBalance": false,
	"beanLsp.inlayHints.enable": true,
	"beanLsp.codeLens.enable": true,
	"beanLsp.codeLens.accountBalance.enable": true,
	"beanLsp.codeLens.pad.enable": true,
	"beanLsp.completion.enableChinesePinyinFilter": false,
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

## Development

### Prerequisites

- [VSCode](https://code.visualstudio.com/) installed
- [Node.js](https://nodejs.org/) installed
- [pnpm](https://pnpm.io/) package manager installed

### Setup and Building

To set up the development environment:

```bash
# Clone the repository
git clone https://github.com/fengkx/beancount-lsp.git
cd beancount-lsp

# Install dependencies
git submodule update --init
pnpm install

# Build all packages
pnpm build
```

### Running and Debugging

To run and debug the extension:

1. Open the project in VSCode
2. Press `F5` to start a new Extension Development Host window
   - Alternatively, you can use the "Run and Debug" tab in VSCode and select the launch configuration

The Extension Development Host will open a new VSCode window with your extension loaded, allowing you to test its functionality and debug in real-time.

### Building and Packaging

To build the extension for distribution:

```bash
# Package the extension into a .vsix file
cd packages/lsp-client
pnpm run vsix
```

## Prior Art

- [vscode-anycode](https://github.com/microsoft/vscode-anycode) Learn a lot from it about how to write a Language Server Extension
- [vscode-beancount](https://github.com/Lencerf/vscode-beancount) Used its Python [beancheck code](https://github.com/fengkx/beancount-lsp/blob/master/packages/lsp-client/pythonFiles/beancheck.py) and [snippets](https://github.com/fengkx/beancount-lsp/blob/master/packages/lsp-client/snippets/beancount.json). Get many inspiration from its features.
