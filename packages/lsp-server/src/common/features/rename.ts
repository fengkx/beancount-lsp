import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { DefinitionFeature } from './definitions';
import * as positionUtils from './position-utils';
import { ReferencesFeature } from './references';
import { SymbolIndex } from './symbol-index';
import { URI, Utils as UriUtils } from 'vscode-uri';

// Create a logger for the rename module
const logger = new Logger('rename');

/**
 * Provides rename functionality for the Beancount Language Server.
 * This feature handles renaming symbols (accounts, commodities, tags, etc.) across files.
 */
export class RenameFeature {
	private references: ReferencesFeature;
	private definitions: DefinitionFeature;

	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		readonly symbolIndex: SymbolIndex,
	) {
		// Create a references feature to use for finding all references
		this.references = new ReferencesFeature(documents, trees, symbolIndex);
		// Create a definitions feature to use for finding definitions
		this.definitions = new DefinitionFeature(documents, trees, symbolIndex);
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

		// Step 1: Get all references using the ReferencesFeature
		const referencesParams: lsp.ReferenceParams = {
			textDocument: params.textDocument,
			position: params.position,
			context: { includeDeclaration: true },
		};

		const references = await this.references.onReferences(referencesParams) || [];

		// Step 2: Get all definitions using the DefinitionFeature
		const definitionParams: lsp.DefinitionParams = {
			textDocument: params.textDocument,
			position: params.position,
		};

		// Get the definitions - they might be returned as a single location or an array
		const definitionResult = await this.definitions.getDefinition(definitionParams, true);
		let definitions: lsp.Location[] = [];

		// Handle different possible return types from onDefinition
		if (definitionResult) {
			if (Array.isArray(definitionResult)) {
				definitions = definitionResult;
			} else {
				// Single location
				definitions = [definitionResult];
			}
		}

		// Step 3: Combine references and definitions, ensuring no duplicates
		const allLocations: lsp.Location[] = [...references];

		// Add definitions that aren't already in the references
		for (const def of definitions) {
			const isDuplicate = allLocations.some(ref =>
				ref.uri === def.uri
				&& ref.range.start.line === def.range.start.line
				&& ref.range.start.character === def.range.start.character
			);

			if (!isDuplicate) {
				allLocations.push(def);
			}
		}

		if (allLocations.length === 0) {
			logger.warn('No references or definitions found for renaming');
			return null;
		}

		// Step 4: Create the edit map (same as before)
		const editsMap = new Map<string, lsp.TextEdit[]>();

		// Create text edits for all locations (references and definitions)
		allLocations.forEach(location => {
			const uri = location.uri;
			if (!editsMap.has(uri)) {
				editsMap.set(uri, []);
			}

			const edits = editsMap.get(uri)!;
			edits.push({
				range: location.range,
				newText: params.newName,
			});
		});

		// Convert the map to the LSP-required format
		let documentChanges: (lsp.TextDocumentEdit | lsp.CreateFile | lsp.RenameFile | lsp.DeleteFile)[] = []
		editsMap.forEach((edits, uri) => {
			documentChanges.push({
				textDocument: { uri: uri, version: null },
				edits: edits,
			})
		});

		// If current position is account, rename also documents
		const accountAtPosition = await positionUtils.getAccountAtPosition(this.trees, document, params.position);
		if (accountAtPosition) {
			// TODO: "documents" option is a list, can be specified multiple times
			const documentsOption = this.symbolIndex.getOption("documents")
			const mainBeanFile = await this.documents.getMainBeanFileUri()

			if (mainBeanFile && documentsOption.source === mainBeanFile) {
				let documentsDirectory = URI.file(documentsOption.asString())
				// TODO: What about Windows?
				if (!documentsOption.asString().startsWith("/")) {
					// Relative paths are against mainBeanFile
					documentsDirectory = UriUtils.joinPath(UriUtils.dirname(URI.parse(mainBeanFile)), documentsOption.asString())
				}
				const accountDocumentsDirectory = UriUtils.joinPath(documentsDirectory, ...accountAtPosition.split(":"))
				logger.debug(`Searching documents for account ${accountAtPosition} in ${accountDocumentsDirectory}`);
				const documents = await this.documents.findFiles(accountDocumentsDirectory.fsPath + "/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]?*")
				documents.forEach(oldUri => {
					const documentName = UriUtils.basename(URI.parse(oldUri))
					const newUri = UriUtils.joinPath(documentsDirectory, ...params.newName.split(":"), documentName)
					documentChanges.push({
						kind: "rename",
						oldUri: oldUri,
						newUri: newUri.toString(),
						options: { overwrite: false },
					})
				})
			}
		}

		logger.debug(
			`Rename will update ${documentChanges.length
			} files and ${allLocations.length} occurrences (${references.length} references, ${definitions.length} definitions)`,
		);

		return { documentChanges };
	}
}
