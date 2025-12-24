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
import { CodeActionFeature } from './features/code-actions';
import { CodeLensFeature } from './features/code-lens';
import { CompletionFeature, triggerCharacters } from './features/completions';
import { DefinitionFeature } from './features/definitions';
import { DiagnosticsFeature } from './features/diagnostics';
import { DocumentLinksFeature } from './features/document-links';
import { DocumentSymbolsFeature } from './features/document-symbols';
import { FoldingRangeFeature } from './features/folding-ranges';
import { FormatterFeature } from './features/formatter';
import { HoverFeature } from './features/hover';
import { InlayHintFeature } from './features/inlay-hints';
import { LinkedEditingRangeFeature } from './features/linked-editing-ranges';
import { PriceMap } from './features/prices-index/price-map';
import { ReferencesFeature } from './features/references';
import { RenameFeature } from './features/rename';
import { SelectionRangesFeature } from './features/selection-ranges';
import { SemanticTokenFeature } from './features/semantic-token';
import { BeancountManagerFactory, Feature, RealBeancountManager } from './features/types';
import { Trees } from './trees';

import Db from '@bean-lsp/storage';
import { SymbolInfo } from './features/symbol-extractors';
import { SymbolIndex } from './features/symbol-index';
import { registerCustomMessageHandlers } from './messages';
import { BeancountOptionsManager } from './utils/beancount-options';
import { globalEventBus, GlobalEvents } from './utils/event-bus';
export type StorageInstance<T> = Db<T>;

export interface IStorageFactory<T> {
	create<T>(name: string, prefix?: string): Promise<StorageInstance<T>>;
	destroy(index: StorageInstance<T>): Promise<void>;
}

export interface ServerOptions {
	webTreeSitterWasmPath?: string;
	logLevel?: LogLevel;

	isBrowser: boolean;
}

// Create a server logger
const serverLogger = new Logger('Server');

export function startServer(
	connection: Connection,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	factory: IStorageFactory<any>,
	documents: DocumentStore,
	beanMgrFactory: BeancountManagerFactory | undefined,
	options: ServerOptions,
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

	let symbolIndex: SymbolIndex;
	let beanMgr: RealBeancountManager | undefined;

	connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {
		documents.setInitializeParams(params);
		const result: InitializeResult = {
			capabilities: {
				textDocumentSync: TextDocumentSyncKind.Incremental,
				// Tell the client that this server supports code completion.
				completionProvider: {
					resolveProvider: true,
					triggerCharacters,
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
				codeActionProvider: {
					codeActionKinds: ['quickfix'],
				},
				// Add linked editing range provider capability
				linkedEditingRangeProvider: true,
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
		}

		const symbolStorage = await factory.create<SymbolInfo>(
			'_beancount_lsp_db',
			params.initializationOptions?.globalStorageUri,
		);
		// await symbolStorage.autoloadPromise;
		connection.onExit(() => factory.destroy(symbolStorage));

		const trees = new Trees(documents);
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
		features.push(new LinkedEditingRangeFeature(documents, trees));
		result.capabilities.codeActionProvider = {
			codeActionKinds: ['quickfix'],
		};

		if (typeof beanMgrFactory === 'function') {
			beanMgr = beanMgrFactory(connection);
		}
		features.push(new DiagnosticsFeature(documents, trees, optionsManager, beanMgr));
		features.push(new HoverFeature(documents, trees, priceMap, symbolIndex, beanMgr));
		features.push(new InlayHintFeature(documents, trees));
		features.push(new CodeActionFeature(documents, trees, beanMgr));

		// Add CodeLens feature only when beancount manager is available (node environment)
		if (beanMgr) {
			// CodeAction capability (only when bean manager available)
			result.capabilities.codeLensProvider = {
				resolveProvider: true,
			};
			features.push(new CodeLensFeature(documents, trees, beanMgr));
		}
		// Initialize all features
		symbolIndex.initFiles(documents.all().map(doc => doc.uri));

		documents.onDidOpen(event => symbolIndex.addSyncFile(event.document.uri));
		// Debounced update to avoid frequent re-index during rapid typing
		// Uses exponential backoff: timeout = max(150ms, lastIndexTime) * 2
		// But caps at lastIndexTime * 10 to prevent unbounded growth
		let debouncedUpdateTimer: NodeJS.Timeout | undefined;
		const MIN_DEBOUNCE_TIMEOUT_MS = 150;
		let timeoutMs = MIN_DEBOUNCE_TIMEOUT_MS;
		let lastIndexTime = 0;

		const indexTimeConsumedUnsubscribe = globalEventBus.on(
			GlobalEvents.IndexTimeConsumed,
			(event: { totalTime: number }) => {
				lastIndexTime = event.totalTime;
				// Exponential backoff: timeout = max(min, indexTime) * 2
				// But limit to indexTime * 10 to prevent unbounded growth
				timeoutMs = Math.max(MIN_DEBOUNCE_TIMEOUT_MS, lastIndexTime);
				timeoutMs = Math.min(timeoutMs * 2, lastIndexTime * 10);
			},
		);
		const documentChangeUnsubscribe = documents.onDidChangeContent(event => {
			symbolIndex.addSyncFile(event.document.uri);
			if (debouncedUpdateTimer) clearTimeout(debouncedUpdateTimer);
			debouncedUpdateTimer = setTimeout(() => {
				try {
					symbolIndex.update();
				} catch (e) {
					serverLogger.debug(`debounced symbolIndex.update error: ${String(e)}`);
				}
			}, timeoutMs);
		});

		// Clean up resources on exit
		connection.onExit(() => {
			if (debouncedUpdateTimer) {
				clearTimeout(debouncedUpdateTimer);
				debouncedUpdateTimer = undefined;
			}
			indexTimeConsumedUnsubscribe();
			documentChangeUnsubscribe.dispose();
		});

		connection.onDidChangeWatchedFiles(e => {
			documents.refetchBeanFiles();
			for (const { type, uri } of e.changes) {
				switch (type) {
					case FileChangeType.Created:
						documents.refetchBeanFiles();
						symbolIndex.addSyncFile(uri);
						break;
					case FileChangeType.Deleted:
						documents.refetchBeanFiles();
						symbolIndex.removeFile(uri);
						documents.removeFile(uri);
						break;
					case FileChangeType.Changed:
						symbolIndex.addSyncFile(uri);
						documents.removeFile(uri);
						break;
				}
			}
			symbolIndex.unleashFiles([]);
		});

		// Add this code to register our custom message handlers
		registerCustomMessageHandlers(connection, documents, symbolIndex, beanMgr);

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
		let initFiles = documents.beanFiles;

		if (mainBeanFile) {
			await symbolIndex.initFiles([mainBeanFile]);
			await beanMgr?.setMainFile?.(mainBeanFile);
			initFiles = initFiles.filter(f => f !== mainBeanFile);
		}

		await symbolIndex.initFiles(initFiles);
		await symbolIndex.unleashFiles([]);

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
