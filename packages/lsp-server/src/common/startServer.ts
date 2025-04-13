import { CustomMessages, Logger, LogLevel, logLevelToString, mapTraceServerToLogLevel } from '@bean-lsp/shared';
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
import { DefinitionFeature } from './features/definitions';
import { DiagnosticsFeature } from './features/diagnostics';
import { DocumentLinksFeature } from './features/document-links';
import { DocumentSymbolsFeature } from './features/document-symbols';
import { FoldingRangeFeature } from './features/folding-ranges';
import { FormatterFeature } from './features/formatter';
import { HoverFeature } from './features/hover';
import { InlayHintFeature } from './features/inlay-hints';
import { PriceMap } from './features/prices-index/price-map';
import { ReferencesFeature } from './features/references';
import { RenameFeature } from './features/rename';
import { SelectionRangesFeature } from './features/selection-ranges';
import { SemanticTokenFeature } from './features/semantic-token';
import { BeancountManagerFactory, Feature, RealBeancountManager } from './features/types';
import { Trees } from './trees';

import Db from '@seald-io/nedb';
import { SymbolInfo } from './features/symbol-extractors';
import { SymbolIndex } from './features/symbol-index';
import { setWasmFilePath } from './language';
import { BeancountOptionsManager } from './utils/beancount-options';
import { EventBus, globalEventBus, GlobalEvents } from './utils/event-bus';
export type SymbolInfoStorage = Db<SymbolInfo>;

export interface IStorageFactory {
	create(name: string, prefix?: string): Promise<SymbolInfoStorage>;
	destroy(index: SymbolInfoStorage): Promise<void>;
}

export interface ServerOptions {
	webTreeSitterWasmPath?: string;
	logLevel?: LogLevel;
}

// Create a server logger
const serverLogger = new Logger('Server');

export function startServer(
	connection: Connection,
	factory: IStorageFactory,
	beanMgrFactory: BeancountManagerFactory | undefined,
	options: ServerOptions = {},
): void {
	// Set initial log level from options
	if (options.logLevel !== undefined) {
		serverLogger.setLevel(options.logLevel);
	}

	// patch console.log/warn/error calls
	console.log = connection.console.log.bind(connection.console);
	console.info = connection.console.info.bind(connection.console);
	console.debug = connection.console.debug.bind(connection.console);
	console.warn = connection.console.warn.bind(connection.console);
	console.error = connection.console.error.bind(connection.console);

	// connection configurations
	let hasConfigurationCapability: boolean = false;
	let hasWorkspaceFolderCapability: boolean = false;

	const features: Feature[] = [];

	let documents: DocumentStore;
	let symbolIndex: SymbolIndex;
	let beanMgr: RealBeancountManager | undefined;

	connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {
		const result: InitializeResult = {
			capabilities: {
				textDocumentSync: TextDocumentSyncKind.Incremental,
				// Tell the client that this server supports code completion.
				completionProvider: {
					resolveProvider: true,
				},
				selectionRangeProvider: true,
				// Add definition provider capability
				definitionProvider: true,
				// Add references provider capability
				referencesProvider: true,
				// Add rename provider capability
				renameProvider: {
					prepareProvider: true,
				},
				// Add document links provider capability
				documentLinkProvider: {
					resolveProvider: true,
				},
				// Add document symbol provider capability
				documentSymbolProvider: true,
				// Add hover provider capability
				hoverProvider: true,
				// Add inlay hint provider capability with more detailed configuration
				inlayHintProvider: {
					resolveProvider: false, // We don't need to resolve hints further
				},
				// Add document formatting capability
				documentFormattingProvider: true,
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

		const symbolStorage = await factory.create('_beancount_lsp_db', params.initializationOptions?.globalStorageUri);
		await symbolStorage.autoloadPromise;
		connection.onExit(() => factory.destroy(symbolStorage));

		documents = new DocumentStore(connection);
		const trees = new Trees(documents, options.webTreeSitterWasmPath!);
		const optionsManager = BeancountOptionsManager.getInstance();
		symbolIndex = new SymbolIndex(documents, trees, symbolStorage, optionsManager);

		// 创建PriceMap实例
		const priceMap = new PriceMap(symbolIndex, trees, documents);

		features.push(new SemanticTokenFeature(documents, trees));
		features.push(new CompletionFeature(documents, trees, symbolIndex));
		features.push(new SelectionRangesFeature(documents, trees));
		features.push(new DefinitionFeature(documents, trees, symbolIndex));
		features.push(new ReferencesFeature(documents, trees, symbolIndex));
		features.push(new FoldingRangeFeature(documents, trees));
		features.push(new RenameFeature(documents, trees, symbolIndex));
		features.push(new DocumentSymbolsFeature(documents, trees));
		features.push(new DocumentLinksFeature(documents, trees));
		features.push(new FormatterFeature(documents, trees));

		if (typeof beanMgrFactory === 'function') {
			beanMgr = beanMgrFactory(connection, params.initializationOptions?.extensionUri);
		}
		features.push(new DiagnosticsFeature(documents, trees, optionsManager, beanMgr));
		features.push(new HoverFeature(documents, trees, priceMap, symbolIndex, beanMgr));
		features.push(new InlayHintFeature(documents, trees));
		// Initialize all features
		symbolIndex.initFiles(documents.all().map(doc => doc.uri));

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
			symbolIndex.unleashFiles([]);
		});

		return result;
	});

	connection.onInitialized(async () => {
		for (const feature of features) {
			feature.register(connection);
		}

		connection.onRequest(CustomMessages.QueueInit, async (uris: string[]) => {
			serverLogger.info(`QueueInit ${uris}`);
			await symbolIndex.initFiles(uris);
			await symbolIndex.unleashFiles([]);
		});

		const mainBeanFile = await documents.getMainBeanFileUri();
		serverLogger.info(`mainBeanFile ${mainBeanFile}`);
		await documents.refetchBeanFiles();

		if (mainBeanFile) {
			await symbolIndex.initFiles([mainBeanFile]);
			await beanMgr?.setMainFile?.(mainBeanFile);
		}

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

			// Apply main currency setting
			if (config.mainCurrency) {
				const featureWithPriceMap = features.find(f => f instanceof HoverFeature) as HoverFeature;
				if (featureWithPriceMap) {
					featureWithPriceMap.setPriceMapMainCurrency(config.mainCurrency);
					serverLogger.info(`Main currency set to: ${config.mainCurrency}`);
				}
			}

			// Set allowed currencies list
			if (config.currencys !== undefined) {
				const featureWithPriceMap = features.find(f => f instanceof HoverFeature) as HoverFeature;
				if (featureWithPriceMap) {
					featureWithPriceMap.setPriceMapAllowedCurrencies(config.currencys || []);
					if (config.currencys && config.currencys.length > 0) {
						serverLogger.info(`Allowed currencies set to: ${config.currencys.join(', ')}`);
					} else {
						serverLogger.info('No currency restrictions set, all commodities will be used for conversions');
					}
				}
			}

			// Listen for configuration changes
			connection.onDidChangeConfiguration(async _ => {
				if (hasConfigurationCapability) {
					globalEventBus.emit(GlobalEvents.ConfigurationChanged);
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

					// Update main currency setting
					if (config.mainCurrency !== undefined) {
						const featureWithPriceMap = features.find(f => f instanceof HoverFeature) as HoverFeature;
						if (featureWithPriceMap) {
							featureWithPriceMap.setPriceMapMainCurrency(config.mainCurrency);
							serverLogger.info(`Main currency changed to: ${config.mainCurrency || '(auto)'}`);
						}
					}

					// Update allowed currencies list
					if (config.currencys !== undefined) {
						const featureWithPriceMap = features.find(f => f instanceof HoverFeature) as HoverFeature;
						if (featureWithPriceMap) {
							featureWithPriceMap.setPriceMapAllowedCurrencies(config.currencys || []);
							if (config.currencys && config.currencys.length > 0) {
								serverLogger.info(`Allowed currencies changed to: ${config.currencys.join(', ')}`);
							} else {
								serverLogger.info(
									'Currency restrictions removed, all commodities will be used for conversions',
								);
							}
						}
					}
				}
			});
		}
		if (hasWorkspaceFolderCapability) {
			connection.workspace.onDidChangeWorkspaceFolders(_event => {
				serverLogger.info('Workspace folder change event received.');
			});
		}
	});
}
