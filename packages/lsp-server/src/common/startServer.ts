import { getParser } from '@bean-lsp/shared';
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

export type SymbolInfoStorage = Db<SymbolInfo>;

export interface IStorageFactory {
	create(name: string): Promise<SymbolInfoStorage>;
	destroy(index: SymbolInfoStorage): Promise<void>;
}

export function startServer(connection: Connection, factory: IStorageFactory) {
	console.log = connection.console.log.bind(connection.console);
	console.warn = connection.console.warn.bind(connection.console);
	console.error = connection.console.error.bind(connection.console);

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
			},
		};
		if (params.capabilities.workspace?.configuration) {
			hasConfigurationCapability = true;
		}
		if (params.capabilities.workspace?.workspaceFolders) {
			hasWorkspaceFolderCapability = true;
		}

		try {
			await getParser();
		} catch (err) {
			connection.console.error(String(err));
		}

		const symbolStorage = await factory.create('_beancount_lsp_db');
		connection.onExit(() => factory.destroy(symbolStorage));

		documents = new DocumentStore(connection);
		const trees = new Trees(documents);

		symbolIndex = new SymbolIndex(documents, trees, symbolStorage);

		// features.push(new SemanticTokenFeature(documents, trees));
		// features.push(new FoldingRangeFeature(documents, trees));
		// features.push(new CompletionFeature(documents, trees));
		// features.push(new SelectionRangesFeature(documents, trees))

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
		// const mainBeanUri = await documents.getMainBeanFileUri();
		// if (mainBeanUri) {
		//     console.info(`mainBeanFIle: ${mainBeanUri}`);
		//     symbolIndex.addFile(mainBeanUri)
		// }
		await symbolIndex.startIndex();

		return result;
	});

	connection.onInitialized(async () => {
		if (hasConfigurationCapability) {
			// Register for all configuration changes.
			connection.client.register(DidChangeConfigurationNotification.type, undefined);
		}
		if (hasWorkspaceFolderCapability) {
			connection.workspace.onDidChangeWorkspaceFolders(_event => {
				connection.console.log('Workspace folder change event received.');
			});
		}

		const mainBeanFile = await documents.getMainBeanFileUri();
		console.info(`mainBeanFile ${mainBeanFile}`);
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
