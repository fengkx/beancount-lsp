import { glob } from 'fast-glob';
import { readFile } from 'fs/promises';
import { DocumentStore } from 'src/common/document-store';
import { pathToFileURL } from 'url';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';
import { URI } from 'vscode-uri';
import { ServerOptions, startServer } from '../common/startServer';
import { beananagerFactory } from './beancount-manager';
import { factory } from './storage';

class DocumentStoreInNode extends DocumentStore {
	protected override async fallbackListBeanFiles(workspaceFolder: { uri: string }): Promise<string[]> {
		const workspacePath = URI.parse(workspaceFolder.uri).fsPath;
		const files = await glob('**/*.{bean,beancount}', {
			cwd: workspacePath,
			ignore: ['.venv/**', '**/*.log', '**/*.tmp', '**/*.tmp.*', '**/*.tmp.*.*', '**/*.pyc'],
			absolute: true,
		});
		return files.map((p) => pathToFileURL(p).toString());
	}

	protected override async fallbackFileRead(uri: string): Promise<ArrayBuffer> {
		const buffer = await readFile(new URL(uri));
		return new Uint8Array(buffer);
	}
}

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Server options - will be populated by the initialization options in startServer
const serverOptions: ServerOptions = {
	isBrowser: false,
};

const documents = new DocumentStoreInNode(connection);
// Start the server with the options
startServer(connection, factory, documents, beananagerFactory, serverOptions);

// Listen on the connection
connection.listen();
