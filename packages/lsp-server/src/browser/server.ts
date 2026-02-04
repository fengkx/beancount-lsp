import {
	BrowserMessageReader,
	BrowserMessageWriter,
	createConnection,
	ProposedFeatures,
} from 'vscode-languageserver/browser';

import { DocumentStore } from 'src/common/document-store';
import { ServerOptions, startServer } from '../common/startServer';
import { createBrowserBeancountManager } from './beancount-manager';
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
let workerUrlLogged = false;

function describeLocation(): { base?: string; display: string } {
	try {
		const loc = typeof self !== 'undefined' && 'location' in self ? self.location : undefined;
		if (!loc) {
			return { display: 'none' };
		}
		const href = (loc as Location).href;
		if (href) {
			return { base: href, display: href };
		}
		return { display: String(loc) };
	} catch (err) {
		return { display: `error: ${String(err)}` };
	}
}

function resolveWorkerUrl(): string {
	const relative = './beancount-worker.js';
	const { base, display } = describeLocation();

	if (base) {
		try {
			return new URL(relative, base).toString();
		} catch (err) {
			if (!workerUrlLogged) {
				connection.console.warn(
					`[beanlsp] invalid worker base (${display}): ${String(err)}; using relative path`,
				);
				workerUrlLogged = true;
			}
			// Fall through to relative URL below.
		}
	}

	// Let the Worker constructor resolve relative URL against the current worker location.
	if (!workerUrlLogged) {
		connection.console.warn(`[beanlsp] worker base unavailable (${display}); using relative path`);
		workerUrlLogged = true;
	}
	return relative;
}

function getWorkerUrl(): string {
	if (serverOptions.beancountWorkerUrl) {
		return serverOptions.beancountWorkerUrl;
	}
	return resolveWorkerUrl();
}

// Start the server with the options
startServer(
	connection,
	factory,
	documents,
	createBrowserBeancountManager(connection, documents, getWorkerUrl),
	serverOptions,
);

// Listen on the connection
connection.listen();
