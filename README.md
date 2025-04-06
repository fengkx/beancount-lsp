# beancount-lsp

[Extension README](./packages/lsp-client/README.md)

## TODO List

- [x] semantic syntax highlight
- [x] [semantic selection](https://github.com/microsoft/language-server-protocol/issues/613#issuecomment-445832563)
- [x] auto completion
- [ ] formating
- [ ] inlay hints
- [x] diagnose
- [ ] intergate with [beancount-smart-query](https://github.com/fengkx/beancount-smart-query)

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
