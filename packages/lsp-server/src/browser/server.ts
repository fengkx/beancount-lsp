import {
	BrowserMessageReader,
	BrowserMessageWriter,
	createConnection,
	ProposedFeatures,
} from 'vscode-languageserver/browser';

import { DocumentStore } from 'src/common/document-store';
import { ServerOptions, startServer } from '../common/startServer';
import { factory } from './storage';

// Create a connection for the browser using the WebWorker message reader/writer
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

// Create a connection using browser-specific transport
const connection = createConnection(ProposedFeatures.all, messageReader, messageWriter);

// Server options - will be populated by the initialization options in startServer
const serverOptions: ServerOptions = {
	isBrowser: true,
};

const documents = new DocumentStore(connection);
// Start the server with the options
startServer(connection, factory, documents, undefined, serverOptions);

// Listen on the connection
connection.listen();
