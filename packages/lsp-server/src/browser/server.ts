// Polyfill for process.nextTick in browser environment
if (typeof self !== 'undefined' && !('process' in self)) {
	(self as unknown as { process: { nextTick: (callback: (...args: unknown[]) => void, ...args: unknown[]) => void } })
		.process = {
			nextTick: (callback: (...args: unknown[]) => void, ...args: unknown[]) => {
				setTimeout(() => callback(...args), 0);
			},
		};
}

import {
	BrowserMessageReader,
	BrowserMessageWriter,
	createConnection,
	ProposedFeatures,
} from 'vscode-languageserver/browser';

import { ServerOptions, startServer } from '../common/startServer';
import { factory } from './storage';

// Create a connection for the browser using the WebWorker message reader/writer
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

// Create a connection using browser-specific transport
const connection = createConnection(ProposedFeatures.all, messageReader, messageWriter);

// Server options - will be populated by the initialization options in startServer
const serverOptions: ServerOptions = {};

// Start the server with the options
startServer(connection, factory, serverOptions);

// Listen on the connection
connection.listen();
