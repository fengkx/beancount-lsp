# beancount-lsp README

VSCode extension for Beancount plain text accounting.

## Configuration

The extension provides several configuration options to customize its behavior:

### Extension Settings

- `beanLsp.maxNumberOfProblems`: Controls the maximum number of problems produced by the server. Default is 100.
- `beanLsp.trace.server`: Traces the communication between VS Code and the language server. Options are "off", "messages", or "verbose". Default is "messages".
- `beancount.mainBeanFile`: Specifies the main Beancount file to use for analysis. This should be relative to the workspace root. Default is "main.bean".

### Example Configuration

```json
{
	"beancount.mainBeanFile": "main.bean",
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
