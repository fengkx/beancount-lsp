# Beancount LSP Server

A Language Server Protocol (LSP) implementation for [Beancount](https://beancount.github.io/) using by [beancount-lsp extension](https://marketplace.visualstudio.com/items?itemName=fengkx.beancount-lsp-client)

## Overview

The Beancount LSP Server provides intelligent features for Beancount files, including diagnostics, completions, hover information, and navigation capabilities etc...

```bash
npx beancount-lsp-server
```

## Usage

The LSP server can be used programmatically in your JavaScript/TypeScript application or as a standalone process.

### Programmatic Usage

```typescript
import { BeancountLSPServer } from 'beancount-lsp-server';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Create the Beancount LSP server
const server = new BeancountLSPServer({
	connection,
	// Additional initialization options
});

// Start the server
server.start();
```

### Initialization Parameters

When initializing the Beancount LSP server, you can provide the following parameters:

#### Required Parameters

- `connection`: The LSP connection created from `vscode-languageserver`.

#### Optional Parameters

- `webTreeSitterWasmPath`: Path to the WebAssembly binary for Tree-sitter parsing.
- `extensionUri`: URI string for the extension's location. which contain `pythonFiles` directory [and python files needed](https://github.com/fengkx/beancount-lsp/tree/master/packages/lsp-client/pythonFiles)

## Server Configuration

Clients can configure the server by providing initialization options when creating the language client:

```typescript
// Connect to the server
const client = new LanguageClient(
	'beancountLanguageServer',
	'Beancount Language Server',
	{
		run: {
			module: 'beancount-lsp-server',
			transport: TransportKind.ipc,
		},
		debug: {
			module: 'beancount-lsp-server',
			transport: TransportKind.ipc,
			options: {
				execArgv: ['--nolazy', '--inspect=6009'],
			},
		},
	},
	{
		documentSelector: [{ scheme: 'file', language: 'beancount' }],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher('**/*.bean'),
		},
		initializationOptions: {
			webTreeSitterWasmPath: '/path/to/tree-sitter-wasm',
			extensionUri: extensionUri.toString(),
		},
	},
);

// Start the client
client.start();
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
