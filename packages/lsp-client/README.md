# beancount-lsp README

VSCode extension for Beancount plain text accounting.

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

### Example Configuration

```json
{
	"beancount.mainBeanFile": "main.bean",
	"beanLsp.trace.server": "debug",
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
