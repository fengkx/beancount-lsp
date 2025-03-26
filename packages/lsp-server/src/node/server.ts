import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';

import { ServerOptions, startServer } from '../common/startServer';
import { beananagerFactory } from './beancount-manager';
import { factory } from './storage';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Server options - will be populated by the initialization options in startServer
const serverOptions: ServerOptions = {};

// Start the server with the options
startServer(connection, factory, beananagerFactory, serverOptions);

// Listen on the connection
connection.listen();
