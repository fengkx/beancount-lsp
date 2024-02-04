import '@abraham/reflection';
import {
    createConnection,
    ProposedFeatures,
} from 'vscode-languageserver/node';


import { startServer } from '../common/startServer';


// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

startServer(connection);

// Listen on the connection
connection.listen();


