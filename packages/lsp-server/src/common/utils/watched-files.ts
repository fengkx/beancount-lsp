import { Connection, DidChangeWatchedFilesParams, Emitter, Event } from 'vscode-languageserver';

const events = new WeakMap<Connection, Event<DidChangeWatchedFilesParams>>();

/** Share one protocol handler: repeated LSP registrations replace earlier handlers. */
export function onDidChangeWatchedFiles(
	connection: Connection,
	listener: (event: DidChangeWatchedFilesParams) => void,
): { dispose(): void } {
	let event = events.get(connection);
	if (!event) {
		const emitter = new Emitter<DidChangeWatchedFilesParams>();
		connection.onDidChangeWatchedFiles(params => emitter.fire(params));
		event = emitter.event;
		events.set(connection, event);
	}
	return event(listener);
}
