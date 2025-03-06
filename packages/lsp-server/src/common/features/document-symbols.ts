import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { TreeQuery } from '../language';
import { Trees } from '../trees';
import { SymbolIndex } from './symbol-index';

// Create a logger for the document symbols module
const logger = new Logger('document-symbols');

export class DocumentSymbolsFeature {
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
	) {}

	register(connection: lsp.Connection): void {
		connection.onDocumentSymbol((params) => this.onDocumentSymbol(params));
	}

	private async onDocumentSymbol(
		params: lsp.DocumentSymbolParams,
	): Promise<lsp.DocumentSymbol[] | lsp.SymbolInformation[] | null> {
		logger.debug(`Document symbols requested for: ${params.textDocument.uri}`);

		const document = this.documents.get(params.textDocument.uri);
		if (!document) {
			logger.warn(`Document not found: ${params.textDocument.uri}`);
			return null;
		}

		try {
			return await this.getDocumentSymbols(document);
		} catch (error) {
			logger.error(`Error getting document symbols: ${error}`);
			return null;
		}
	}

	private async getDocumentSymbols(document: TextDocument): Promise<lsp.DocumentSymbol[]> {
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			logger.warn(`Failed to get parse tree for document: ${document.uri}`);
			return [];
		}

		const symbols: lsp.DocumentSymbol[] = [];

		// Get transaction nodes with the new transaction query
		const transactionQuery = TreeQuery.getQueryByTokenName('transaction');
		const transactionCaptures = await transactionQuery.captures(tree.rootNode);
		for (const capture of transactionCaptures) {
			const date = capture.node.childForFieldName('date');
			let name = 'Transaction';
			const children: lsp.DocumentSymbol[] = [];

			if (date && capture.node.namedChild(0)?.type === 'date') {
				const payee = capture.node.namedChild(2);
				if (payee) {
					name = date.text + ' ' + payee.text;
				}
				const narration = capture.node.namedChild(3);
				if (narration) {
					name = name + ' ' + narration.text;
				}
				if (capture.node.namedChildCount > 4) {
					// const postings = [];

					for (let i = 4; i < capture.node.namedChildCount; i++) {
						const posting = capture.node.namedChild(i);
						if (posting && posting.type === 'posting') {
							const account = posting.childForFieldName('account');
							const postingChildren: lsp.DocumentSymbol[] = [];
							const amount = posting.childForFieldName('amount');
							if (amount) {
								postingChildren.push({
									name: amount.text,
									kind: lsp.SymbolKind.Variable,
									range: asLspRange(amount),
									selectionRange: asLspRange(amount),
								});
							}
							children.push({
								name: account?.text ?? 'Posting',
								kind: lsp.SymbolKind.Variable,
								range: asLspRange(posting),
								selectionRange: asLspRange(account ?? posting),
								children: postingChildren,
							});
						}
					}
				}
			}
			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Struct,
				range: asLspRange(capture.node),
				selectionRange: asLspRange(capture.node),
				children,
			};
			symbols.push(symbol);
		}
		return symbols;
	}
}
