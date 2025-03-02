import {
	getParser,
	Logger,
	LogLevel,
	logLevelToString,
	mapTraceServerToLogLevel,
	parseLogLevel,
} from '@bean-lsp/shared';
import {
	Connection,
	DidChangeConfigurationNotification,
	FileChangeType,
	InitializeParams,
	InitializeResult,
	TextDocumentSyncKind,
} from 'vscode-languageserver';
import { DocumentStore } from './document-store';
import { CompletionFeature } from './features/completions';
import { FoldingRangeFeature } from './features/folding-ranges';
import { SelectionRangesFeature } from './features/selection-ranges';
import { SemanticTokenFeature } from './features/semantic-token';
import { Feature } from './features/types';
import { Trees } from './trees';

import Db from '@seald-io/nedb';
import { SymbolInfo } from './features/references';
import { SymbolIndex } from './features/symbol-index';
import { setWasmFilePath } from './language';

export type SymbolInfoStorage = Db<SymbolInfo>;

export interface IStorageFactory {
	create(name: string): Promise<SymbolInfoStorage>;
	destroy(index: SymbolInfoStorage): Promise<void>;
}

export interface ServerOptions {
	webTreeSitterWasmPath?: string;
	logLevel?: LogLevel;
}

// Create a server logger
const serverLogger = new Logger('Server');

export function startServer(connection: Connection, factory: IStorageFactory, options: ServerOptions = {}) {
	// Set initial log level from options
	if (options.logLevel !== undefined) {
		serverLogger.setLevel(options.logLevel);
	}

	// Store original console methods
	const originalConsoleLog = console.log;
	const originalConsoleInfo = console.info;
	const originalConsoleWarn = console.warn;
	const originalConsoleError = console.error;

	// Replace with custom implementations that don't use logger
	console.log = function(...args: any[]) {
		originalConsoleLog('[Server]', ...args);
	};
	console.info = function(...args: any[]) {
		originalConsoleInfo('[Server]', ...args);
	};
	console.warn = function(...args: any[]) {
		originalConsoleWarn('[Server]', ...args);
	};
	console.error = function(...args: any[]) {
		originalConsoleError('[Server]', ...args);
	};

	// Also bind connection console for LSP-based logging directly to original console methods
	connection.console.log = function(...args: any[]) {
		originalConsoleLog('[Server]', ...args);
	};
	connection.console.info = function(...args: any[]) {
		originalConsoleInfo('[Server]', ...args);
	};
	connection.console.warn = function(...args: any[]) {
		originalConsoleWarn('[Server]', ...args);
	};
	connection.console.error = function(...args: any[]) {
		originalConsoleError('[Server]', ...args);
	};

	let hasConfigurationCapability: boolean = false;
	let hasWorkspaceFolderCapability: boolean = false;
	// let hasDiagnosticRelatedInformationCapability: boolean = false;

	const features: Feature[] = [];

	let documents: DocumentStore;
	let symbolIndex: SymbolIndex;

	connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {
		const result: InitializeResult = {
			capabilities: {
				textDocumentSync: TextDocumentSyncKind.Incremental,
				// Tell the client that this server supports code completion.
				completionProvider: {
					resolveProvider: true,
				},
				selectionRangeProvider: true,
			},
		};
		if (params.capabilities.workspace?.configuration) {
			hasConfigurationCapability = true;
		}
		if (params.capabilities.workspace?.workspaceFolders) {
			hasWorkspaceFolderCapability = true;
		}

		// Extract webTreeSitterWasmPath from initialization options if available
		if (params.initializationOptions?.webTreeSitterWasmPath) {
			options.webTreeSitterWasmPath = params.initializationOptions.webTreeSitterWasmPath;
			// Update wasmFilePath in the language module
			setWasmFilePath(options.webTreeSitterWasmPath);
		}

		try {
			// The parser will be initialized when needed with the correct WASM path
		} catch (err) {
			connection.console.error(String(err));
		}

		const symbolStorage = await factory.create('_beancount_lsp_db');
		connection.onExit(() => factory.destroy(symbolStorage));

		documents = new DocumentStore(connection);
		const trees = new Trees(documents, options.webTreeSitterWasmPath);

		symbolIndex = new SymbolIndex(documents, trees, symbolStorage);

		features.push(new SemanticTokenFeature(documents, trees));
		features.push(new FoldingRangeFeature(documents, trees));
		features.push(new CompletionFeature(documents, trees, symbolIndex));
		features.push(new SelectionRangesFeature(documents, trees));

		documents.all().forEach(doc => {
			symbolIndex.addFile(doc.uri);
		});
		documents.onDidOpen(event => symbolIndex.addFile(event.document.uri));
		documents.onDidChangeContent(event => symbolIndex.addFile(event.document.uri));

		connection.onDidChangeWatchedFiles(e => {
			documents.refetchBeanFiles();
			for (const { type, uri } of e.changes) {
				switch (type) {
					case FileChangeType.Created:
						documents.refetchBeanFiles();
						symbolIndex.addFile(uri);
						break;
					case FileChangeType.Deleted:
						documents.refetchBeanFiles();
						symbolIndex.removeFile(uri);
						documents.removeFile(uri);
						break;
					case FileChangeType.Changed:
						symbolIndex.addFile(uri);
						documents.removeFile(uri);
						break;
				}
			}
		});

		return result;
	});

	connection.onInitialized(async () => {
		if (hasConfigurationCapability) {
			// Register for all configuration changes.
			connection.client.register(DidChangeConfigurationNotification.type, undefined);

			// Get initial configuration for trace server setting
			const config = await connection.workspace.getConfiguration({ section: 'beanLsp' });
			if (config.trace && config.trace.server) {
				const logLevel = mapTraceServerToLogLevel(config.trace.server);
				serverLogger.setLevel(logLevel);
				serverLogger.info(
					`Log level set to ${logLevelToString(logLevel)} (from trace.server: ${config.trace.server})`,
				);
			}

			// Listen for configuration changes
			connection.onDidChangeConfiguration(async change => {
				if (hasConfigurationCapability) {
					const config = await connection.workspace.getConfiguration({ section: 'beanLsp' });
					if (config.trace && config.trace.server) {
						const logLevel = mapTraceServerToLogLevel(config.trace.server);
						serverLogger.setLevel(logLevel);
						serverLogger.info(
							`Log level changed to ${
								logLevelToString(logLevel)
							} (from trace.server: ${config.trace.server})`,
						);
					}
				}
			});
		}
		if (hasWorkspaceFolderCapability) {
			connection.workspace.onDidChangeWorkspaceFolders(_event => {
				serverLogger.info('Workspace folder change event received.');
			});
		}

		const mainBeanFile = await documents.getMainBeanFileUri();
		serverLogger.info(`mainBeanFile ${mainBeanFile}`);
		await documents.refetchBeanFiles();

		if (mainBeanFile) {
			await symbolIndex.initFiles([mainBeanFile]);
		}

		await symbolIndex.unleashFiles([]);
		for (const feature of features) {
			feature.register(connection);
		}
	});
}

const timeout = (ms: number) =>
	new Promise(resolve => {
		setTimeout(resolve, ms);
	});
