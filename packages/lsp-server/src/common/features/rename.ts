import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import * as positionUtils from './position-utils';
import { ReferencesFeature } from './references';
import { SymbolIndex } from './symbol-index';

// Create a logger for the rename module
const logger = new Logger('rename');

/**
 * Provides rename functionality for the Beancount Language Server.
 * This feature handles renaming symbols (accounts, commodities, tags, etc.) across files.
 */
export class RenameFeature {
	private references: ReferencesFeature;

	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly symbolIndex: SymbolIndex,
	) {
		// Create a references feature to use for finding all references
		this.references = new ReferencesFeature(documents, trees, symbolIndex);
	}

	/**
	 * Registers the rename handlers with the language server connection
	 */
	register(connection: lsp.Connection): void {
		connection.onPrepareRename((params) => this.onPrepareRename(params));
		connection.onRenameRequest((params) => this.onRename(params));
	}

	/**
	 * Validates if the symbol at the current position can be renamed
	 */
	private async onPrepareRename(
		params: lsp.PrepareRenameParams,
	): Promise<lsp.Range | { range: lsp.Range; placeholder: string } | null> {
		logger.debug(`Prepare rename requested at position: ${JSON.stringify(params.position)}`);

		const document = await this.documents.retrieve(params.textDocument.uri);
		if (!document) {
			logger.warn(`Document not found: ${params.textDocument.uri}`);
			return null;
		}

		// Get range at position first - we'll use it to extract the exact text
		const range = await positionUtils.getRangeAtPosition(this.trees, document, params.position);

		// Get exact text from document at this range
		const textAtRange = document.getText(range);

		// Get relevant symbol at position using helper methods
		// Check for account at position
		const accountAtPosition = await positionUtils.getAccountAtPosition(this.trees, document, params.position);
		if (accountAtPosition) {
			logger.debug(`Found renamable account at position: ${accountAtPosition}`);
			return {
				range,
				placeholder: textAtRange, // Use exact text from document
			};
		}

		// Check for commodity at position
		const commodityAtPosition = await positionUtils.getCommodityAtPosition(this.trees, document, params.position);
		if (commodityAtPosition) {
			logger.debug(`Found renamable commodity at position: ${commodityAtPosition}`);
			return {
				range,
				placeholder: textAtRange, // Use exact text from document
			};
		}

		// Check for tag at position
		const tagAtPosition = await positionUtils.getTagAtPosition(this.trees, document, params.position);
		if (tagAtPosition) {
			logger.debug(`Found renamable tag at position: ${tagAtPosition}`);
			return {
				range,
				placeholder: textAtRange, // Use exact text from document
			};
		}

		// Check for payee at position
		const payeeAtPosition = await positionUtils.getPayeeAtPosition(this.trees, document, params.position);
		if (payeeAtPosition) {
			logger.debug(`Found renamable payee at position: ${payeeAtPosition}`);
			return {
				range,
				placeholder: textAtRange, // Use exact text from document
			};
		}

		// Check for narration at position
		const narrationAtPosition = await positionUtils.getNarrationAtPosition(this.trees, document, params.position);
		if (narrationAtPosition) {
			logger.debug(`Found renamable narration at position: ${narrationAtPosition}`);
			return {
				range,
				placeholder: textAtRange, // Use exact text from document
			};
		}

		logger.debug('No renamable symbol found at the current position');
		return null;
	}

	/**
	 * Handles the actual rename request
	 */
	private async onRename(
		params: lsp.RenameParams,
	): Promise<lsp.WorkspaceEdit | null> {
		logger.debug(`Rename requested at position: ${JSON.stringify(params.position)} to "${params.newName}"`);

		const document = await this.documents.retrieve(params.textDocument.uri);
		if (!document) {
			logger.warn(`Document not found: ${params.textDocument.uri}`);
			return null;
		}

		// First, find all references to the symbol being renamed
		// We can piggyback on the ReferencesFeature's onReferences method
		const referencesParams: lsp.ReferenceParams = {
			textDocument: params.textDocument,
			position: params.position,
			context: { includeDeclaration: true },
		};

		const references = await this.references.onReferences(referencesParams);

		if (!references || references.length === 0) {
			logger.warn('No references found for renaming');
			return null;
		}

		// 使用Map来避免未定义错误
		const editsMap = new Map<string, lsp.TextEdit[]>();

		// 为每个引用创建文本编辑
		references.forEach(ref => {
			const uri = ref.uri;
			if (!editsMap.has(uri)) {
				editsMap.set(uri, []);
			}

			// 通过get方法获取数组，TypeScript能确保它不是undefined
			const edits = editsMap.get(uri)!;
			edits.push({
				range: ref.range,
				newText: params.newName,
			});
		});

		// 将Map转换为LSP需要的格式
		const changes: { [uri: string]: lsp.TextEdit[] } = {};
		editsMap.forEach((edits, uri) => {
			changes[uri] = edits;
		});

		logger.debug(`Rename will update ${Object.keys(changes).length} files and ${references.length} occurrences`);

		return { changes };
	}
}
