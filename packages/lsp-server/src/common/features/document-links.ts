import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { URI, Utils } from 'vscode-uri';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { TreeQuery } from '../language';
import { Trees } from '../trees';

// Create a logger for document links
const logger = new Logger('document-links');

/**
 * Implements the LSP DocumentLinks provider for Beancount files.
 * This feature detects include statements and converts them to clickable links.
 */
export class DocumentLinksFeature {
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
	) {}

	/**
	 * Registers the document links handler with the language server connection
	 */
	register(connection: lsp.Connection): void {
		connection.onDocumentLinks((params) => this.onDocumentLinks(params));
		connection.onDocumentLinkResolve((link) => this.onDocumentLinkResolve(link));
	}

	/**
	 * Processes document links requests
	 */
	private async onDocumentLinks(params: lsp.DocumentLinkParams): Promise<lsp.DocumentLink[]> {
		const document = await this.documents.retrieve(params.textDocument.uri);
		if (!document) {
			logger.warn(`Document not found: ${params.textDocument.uri}`);
			return [];
		}

		logger.debug(`Finding document links in: ${params.textDocument.uri}`);
		return await this.findIncludeLinks(document);
	}

	/**
	 * Handles resolving document links (adding more data when a link is hovered/activated)
	 */
	private async onDocumentLinkResolve(link: lsp.DocumentLink): Promise<lsp.DocumentLink> {
		// Add tooltip information if not already present
		if (!link.tooltip && link.target) {
			// Extract the filename from the target URI
			try {
				const uri = URI.parse(link.target);
				// Use Utils.basename from vscode-uri which works consistently across platforms
				link.tooltip = Utils.basename(uri);
			} catch (_e) {
				// If we can't parse as URI, use the raw target
				link.tooltip = link.target;
			}
		}
		return link;
	}

	/**
	 * Finds all include directives in a document and converts them to links
	 */
	private async findIncludeLinks(document: TextDocument): Promise<lsp.DocumentLink[]> {
		const links: lsp.DocumentLink[] = [];
		const tree = await this.trees.getParseTree(document);

		if (!tree) {
			logger.warn(`Failed to get parse tree for document: ${document.uri}`);
			return [];
		}

		try {
			// Use the include query to find all include directives
			const captures = await TreeQuery.captures('(include (string) @path)', tree.rootNode);

			for (const capture of captures) {
				// Extract the string content without quotes
				const pathNode = capture.node;
				const pathText = pathNode.text;
				const filePath = pathText.replace(/^"|"$/g, '');

				// Create a range for the string node
				const range = asLspRange(pathNode);

				// Skip creating links for glob patterns
				if (this.containsGlobPattern(filePath)) {
					logger.debug(`Skipping link creation for glob pattern: ${filePath}`);
					continue;
				}

				// Resolve the target relative to the current document
				const docUri = URI.parse(document.uri);

				try {
					let targetUri: URI;

					if (filePath.startsWith('/')) {
						// For absolute paths, just modify the path part of the original URI
						targetUri = docUri.with({ path: filePath });
					} else {
						// For relative paths, use Utils.joinPath which handles URI paths correctly
						// Get directory of current document first
						const docDirUri = Utils.dirname(docUri);
						// Join with the include path
						targetUri = Utils.joinPath(docDirUri, filePath);
					}

					links.push({
						range,
						target: targetUri.toString(),
						tooltip: `Open ${Utils.basename(targetUri)}`,
					});

					logger.debug(`Found include link: ${filePath} -> ${targetUri.toString()}`);
				} catch (e) {
					logger.warn(`Failed to resolve include path: ${filePath}`, e);
				}
			}
		} catch (e) {
			logger.error(`Error finding include links: ${e}`);
		}

		return links;
	}

	/**
	 * Checks if a file path contains glob pattern characters
	 * @param path The file path to check
	 * @returns true if the path contains glob pattern characters
	 */
	private containsGlobPattern(path: string): boolean {
		// Check for common glob pattern characters: *, ?, [, ], {, }, and **
		return /[*?[\]{}]/.test(path) || path.includes('**');
	}
}
