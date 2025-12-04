import DataStore from '@bean-lsp/storage';
import { Logger, LogLevel, setGlobalLogLevel } from '@bean-lsp/shared';
import { CancellationTokenSource } from 'vscode-languageserver';
import { SymbolInfo, SymbolKey, SymbolType, getSymbols } from '../common/features/symbol-extractors';
import { BeancountOptionsManager } from '../common/utils/beancount-options';
import { DocumentStoreCLI } from './document-store-cli';
import { TreesCLI } from './trees-cli';
import { TreeQuery } from '../common/language';
import { parallel, StopWatch } from '../common/common';

const logger = new Logger('CLI');

/**
 * Parse CLI log level string to LogLevel enum
 */
function parseCLILogLevel(level: string): LogLevel {
	switch (level.toLowerCase()) {
		case 'off':
		case 'none':
			return LogLevel.NONE;
		case 'error':
			return LogLevel.ERROR;
		case 'warn':
			return LogLevel.WARN;
		case 'info':
			return LogLevel.INFO;
		case 'debug':
			return LogLevel.DEBUG;
		default:
			return LogLevel.NONE;
	}
}

/**
 * Options for creating a CLI context
 */
export interface CLIContextOptions {
	/** Path to the workspace directory */
	workspacePath: string;
	/** Main beancount file (default: 'main.bean') */
	mainBeanFile?: string;
	/** Log level */
	logLevel?: 'off' | 'error' | 'warn' | 'info' | 'debug';
}

/**
 * CLI Context providing access to beancount data
 */
export interface CLIContext {
	/** Get all account names */
	getAccounts(filter?: string): Promise<string[]>;
	/** Get all payee names */
	getPayees(filter?: string): Promise<string[]>;
	/** Get all narration strings */
	getNarrations(filter?: string): Promise<string[]>;
	/** Get all tag names */
	getTags(filter?: string): Promise<string[]>;
	/** Get all link names */
	getLinks(filter?: string): Promise<string[]>;
	/** Get all commodity/currency names */
	getCommodities(filter?: string): Promise<string[]>;
	/** Get workspace path */
	getWorkspacePath(): string;
	/** Get number of indexed files */
	getFileCount(): number;
}

/**
 * Simple in-memory storage for CLI use
 */
class CLISymbolStorage {
	private _store = new DataStore<SymbolInfo>({
		indices: [SymbolKey.TYPE, '_uri'],
	});

	async insertAsync(docs: SymbolInfo[]): Promise<void> {
		await this._store.insertAsync(docs);
	}

	async findAsync(query: Record<string, unknown>): Promise<SymbolInfo[]> {
		return this._store.findAsync(query) as Promise<SymbolInfo[]>;
	}

	removeSync(query: Record<string, unknown>): void {
		this._store.removeSync(query);
	}
}

/**
 * Create a CLI context for accessing beancount data
 */
export async function createCLIContext(options: CLIContextOptions): Promise<CLIContext> {
	// Set global log level if provided (defaults to NONE for silent operation)
	const logLevel = options.logLevel ? parseCLILogLevel(options.logLevel) : LogLevel.NONE;
	setGlobalLogLevel(logLevel);

	const sw = new StopWatch();
	logger.info(`Creating CLI context for workspace: ${options.workspacePath}`);

	// Create document store and load files
	const documents = new DocumentStoreCLI(options.workspacePath);
	const fileUris = await documents.loadWorkspace();
	logger.info(`Loaded ${fileUris.length} files in ${sw.elapsed()}ms`);

	// Create trees parser
	const trees = new TreesCLI(documents);

	// Create symbol storage
	const storage = new CLISymbolStorage();

	// Create options manager
	const optionsManager = BeancountOptionsManager.getInstance();

	// Index all files
	sw.reset();
	logger.info('Indexing files...');

	const indexTasks = fileUris.map((uri) => async () => {
		try {
			const document = await documents.retrieve(uri);
			const tree = await trees.getParseTree(document);
			if (!tree) {
				logger.warn(`Failed to parse: ${uri}`);
				return;
			}

			// Extract symbols
			const symbols = await getSymbols(document, trees as any);
			if (symbols.length > 0) {
				await storage.insertAsync(symbols);
			}

			// Extract options
			await extractOptions(document, tree, optionsManager);
		} catch (err) {
			logger.error(`Error indexing ${uri}: ${err}`);
		}
	});

	// Process files in parallel
	await parallel(indexTasks, 10, new CancellationTokenSource().token);
	logger.info(`Indexed ${fileUris.length} files in ${sw.elapsed()}ms`);

	// Create context object
	const context: CLIContext = {
		async getAccounts(filter?: string): Promise<string[]> {
			const accountDefs = await storage.findAsync({
				[SymbolKey.TYPE]: SymbolType.ACCOUNT_DEFINITION,
			});
			let accounts = [...new Set(accountDefs.map(a => a.name))];
			
			if (filter) {
				const filterLower = filter.toLowerCase();
				accounts = accounts.filter(a => a.toLowerCase().includes(filterLower));
			}
			
			return accounts.sort();
		},

		async getPayees(filter?: string): Promise<string[]> {
			const payees = await storage.findAsync({
				[SymbolKey.TYPE]: SymbolType.PAYEE,
			});
			let uniquePayees = [...new Set(payees.map(p => p.name))];
			
			if (filter) {
				const filterLower = filter.toLowerCase();
				uniquePayees = uniquePayees.filter(p => p.toLowerCase().includes(filterLower));
			}
			
			return uniquePayees.sort();
		},

		async getNarrations(filter?: string): Promise<string[]> {
			const narrations = await storage.findAsync({
				[SymbolKey.TYPE]: SymbolType.NARRATION,
			});
			let uniqueNarrations = [...new Set(narrations.map(n => n.name))];
			
			if (filter) {
				const filterLower = filter.toLowerCase();
				uniqueNarrations = uniqueNarrations.filter(n => n.toLowerCase().includes(filterLower));
			}
			
			return uniqueNarrations.sort();
		},

		async getTags(filter?: string): Promise<string[]> {
			const tags = await storage.findAsync({
				[SymbolKey.TYPE]: SymbolType.TAG,
			});
			let uniqueTags = [...new Set(tags.map(t => t.name))];
			
			if (filter) {
				const filterLower = filter.toLowerCase();
				uniqueTags = uniqueTags.filter(t => t.toLowerCase().includes(filterLower));
			}
			
			return uniqueTags.sort();
		},

		async getLinks(filter?: string): Promise<string[]> {
			const links = await storage.findAsync({
				[SymbolKey.TYPE]: SymbolType.LINK,
			});
			let uniqueLinks = [...new Set(links.map(l => l.name))];
			
			if (filter) {
				const filterLower = filter.toLowerCase();
				uniqueLinks = uniqueLinks.filter(l => l.toLowerCase().includes(filterLower));
			}
			
			return uniqueLinks.sort();
		},

		async getCommodities(filter?: string): Promise<string[]> {
			const commodities = await storage.findAsync({
				[SymbolKey.TYPE]: SymbolType.COMMODITY,
			});
			let uniqueCommodities = [...new Set(commodities.map(c => c.name))];
			
			if (filter) {
				const filterLower = filter.toLowerCase();
				uniqueCommodities = uniqueCommodities.filter(c => c.toLowerCase().includes(filterLower));
			}
			
			return uniqueCommodities.sort();
		},

		getWorkspacePath(): string {
			return options.workspacePath;
		},

		getFileCount(): number {
			return fileUris.length;
		},
	};

	return context;
}

/**
 * Extract beancount options from a document
 */
async function extractOptions(
	document: { uri: string; getText(range?: { start: { line: number; character: number }; end: { line: number; character: number } }): string; positionAt(offset: number): { line: number; character: number } },
	tree: any,
	optionsManager: BeancountOptionsManager,
): Promise<void> {
	try {
		const optionQuery = TreeQuery.getQueryByTokenName('option');
		const optionCaptures = await optionQuery.captures(tree);

		for (const capture of optionCaptures) {
			if (capture.name !== 'option' || capture.node.type !== 'option') {
				continue;
			}

			const optionNode = capture.node;
			const keyNode = optionNode.childForFieldName('key');
			const valueNode = optionNode.childForFieldName('value');

			if (!keyNode || !valueNode) {
				continue;
			}

			let key = document.getText({
				start: document.positionAt(keyNode.startIndex),
				end: document.positionAt(keyNode.endIndex),
			});
			let value = document.getText({
				start: document.positionAt(valueNode.startIndex),
				end: document.positionAt(valueNode.endIndex),
			});

			// Remove surrounding quotes
			key = key.replace(/^"(.*)"$/, '$1');
			value = value.replace(/^"(.*)"$/, '$1');

			// @ts-expect-error intended set all options
			optionsManager.setOption(key, value, document.uri);
		}
	} catch (error) {
		logger.error(`Error extracting options from ${document.uri}: ${error}`);
	}
}

// Re-export types
export type { SymbolInfo } from '../common/features/symbol-extractors';

