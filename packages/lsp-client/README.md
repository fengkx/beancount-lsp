<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=fengkx.beancount-lsp-client" target="_blank" rel="noopener noreferrer">
    <img width="252" src="https://raw.githubusercontent.com/fengkx/beancount-lsp/master/packages/lsp-client/assets/icon.png" alt="Beancount LSP logo">
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
- `beanLsp.mainBeanFile`: Specifies the main Beancount file to use for analysis. This should be relative to the workspace root. Default is "main.bean".
- `beanLsp.python3Path`: Path to Python 3 executable. If empty, the system default Python 3 will be used. This Python installation should have the beancount package installed. Default is empty (uses system default).
- `beancount.diagnostics.tolerance`: Tolerance value for transaction balancing. Set to 0 for exact matching. Default is 0.005.
- `beancount.diagnostics.warnOnIncompleteTransaction`: Show warnings for incomplete transactions (marked with '!' flag). These are transactions that are considered unconfirmed in Beancount. Default is true.
- `beanLsp.inlayHints.enable`: Enable or disable inlay hints showing calculated amounts for auto-balanced transactions. Default is true.
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
	"beancount.diagnostics.tolerance": 0.005,
	"beancount.diagnostics.warnOnIncompleteTransaction": true,
	"beanLsp.mainCurrency": "USD",
	"beanLsp.currencys": ["USD", "EUR", "GBP", "JPY"],
	"beanLsp.formatter.enabled": true,
	"beanLsp.formatter.alignCurrency": false,
	"beanLsp.hover.includeSubaccountBalance": false,
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

## CLI Usage

The extension also provides a command-line interface for querying your beancount data. This is useful for scripting, testing, or quick lookups.

### Installation

After building the project, you can use the CLI directly:

```bash
# From the project root
pnpm build

# Run CLI directly
node packages/lsp-client/dist/node/cli.js --help

# Or link it globally
cd packages/lsp-client
pnpm link --global
beancount-lsp --help
```

### Commands

```bash
# Get all accounts
beancount-lsp accounts --workspace /path/to/ledger

# Get accounts matching a filter
beancount-lsp accounts Bank --workspace /path/to/ledger

# Get all payees
beancount-lsp payees --workspace /path/to/ledger

# Get payees matching a filter
beancount-lsp payees Amazon --workspace /path/to/ledger

# Get narrations
beancount-lsp narrations --workspace /path/to/ledger

# Get tags
beancount-lsp tags --workspace /path/to/ledger

# Get links
beancount-lsp links --workspace /path/to/ledger

# Get commodities/currencies
beancount-lsp commodities --workspace /path/to/ledger
```

#### Interactive REPL Mode (Default)

Start an interactive session to explore your beancount files:

```bash
beancount-lsp --workspace /path/to/ledger

# Or just run in current directory
beancount-lsp
```

REPL commands:

- `help` - Show available commands
- `exit` / `quit` - Exit the REPL
- `status` - Show workspace status
- `accounts [filter]` - Get accounts (optional filter)
- `payees [filter]` - Get payees (optional filter)
- `narrations [filter]` - Get narrations (optional filter)
- `tags [filter]` - Get tags (optional filter)
- `links [filter]` - Get links (optional filter)
- `commodities [filter]` - Get commodities/currencies (optional filter)

### Configuration

The CLI supports configuration through:

1. **Command-line options:**
   - `-w, --workspace <path>` - Path to workspace directory (default: current directory)
   - `-c, --config <path>` - Path to config file
   - `--verbose` - Enable verbose logging (show indexing progress)
   - `--log-level <level>` - Log level (off, error, warn, info, debug). Default is `off` for clean output
   - `--main-bean-file <file>` - Main beancount file path

2. **Configuration file:** Create `.beanlsp.json` in your workspace root:

```json
{
	"mainBeanFile": "main.bean",
	"trace": {
		"server": "messages"
	},
	"diagnostics": {
		"tolerance": 0.005,
		"warnOnIncompleteTransaction": true
	},
	"formatter": {
		"enabled": true,
		"alignCurrency": false
	}
}
```

Configuration priority: CLI Args > Config File > Defaults

### Examples

```bash
# Get all income accounts (quiet mode, only results)
beancount-lsp accounts Income -w ~/ledger

# Get payees containing "Amazon"
beancount-lsp payees amazon -w ~/ledger

# Show indexing progress with --verbose
beancount-lsp accounts -w ~/ledger --verbose

# Start interactive REPL
beancount-lsp --workspace ~/ledger

# Use custom config file
beancount-lsp accounts --workspace ~/ledger --config ~/ledger/my-config.json
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
