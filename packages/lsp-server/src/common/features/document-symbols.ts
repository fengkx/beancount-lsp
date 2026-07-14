import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import * as Parser from 'web-tree-sitter';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { getRecoverableTopLevelNodes } from '../utils/top-level-nodes';

// Create a logger for the document symbols module
const logger = new Logger('document-symbols');

function getStringContent(node: Parser.SyntaxNode | null): string | undefined {
	if (!node) {
		return undefined;
	}

	const text = node.text.startsWith('"') && node.text.endsWith('"')
		? node.text.slice(1, -1)
		: node.text;
	return text.trim() ? text : undefined;
}

function createStringSymbol(
	node: Parser.SyntaxNode | null,
	kind: lsp.SymbolKind,
): lsp.DocumentSymbol | null {
	const name = getStringContent(node);
	if (!node || !name) {
		return null;
	}

	return {
		name,
		kind,
		range: asLspRange(node),
		selectionRange: asLspRange(node),
	};
}

function filterEmptyDocumentSymbols(symbols: lsp.DocumentSymbol[]): lsp.DocumentSymbol[] {
	return symbols.flatMap((symbol) => {
		if (!symbol.name.trim()) {
			return [];
		}

		if (!symbol.children) {
			return [symbol];
		}

		return [{ ...symbol, children: filterEmptyDocumentSymbols(symbol.children) }];
	});
}

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

		const document = await this.documents.retrieve(params.textDocument.uri);
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

		const nodes = (type: string) => getRecoverableTopLevelNodes(tree, type);
		const symbols = [
			this.getTransactionSymbol(nodes('transaction')),
			this.getCommodityDefinitionSymbol(nodes('commodity')),
			this.getAccountDefinitionSymbol(nodes('open')),
			this.getPriceDirectiveSymbol(nodes('price')),
			this.getBalanceDirectiveSymbol(nodes('balance')),
			this.getCloseDirectiveSymbol(nodes('close')),
			this.getPadDirectiveSymbol(nodes('pad')),
			this.getDocumentDirectiveSymbol(nodes('document')),
			this.getNoteDirectiveSymbol(nodes('note')),
			this.getEventDirectiveSymbol(nodes('event')),
			this.getQueryDirectiveSymbol(nodes('query')),
			this.getCustomDirectiveSymbol(nodes('custom')),
			this.getIncludeDirectiveSymbol(nodes('include')),
		].flat();

		return filterEmptyDocumentSymbols(symbols);
	}

	private getTransactionSymbol(transactionNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const transactionNode of transactionNodes) {
			const date = transactionNode.childForFieldName('date');
			const namedChildren = transactionNode.namedChildren;
			let name = 'Txn';
			const children: lsp.DocumentSymbol[] = [];

			if (date && namedChildren[0]?.type === 'date') {
				const payee = namedChildren[2] ?? null;
				const narration = namedChildren[3] ?? null;

				name = `${date.text}`;
				const payeeText = getStringContent(payee);
				if (payeeText) {
					name += ` ${payeeText}`;
				}
				const narrationText = getStringContent(narration);
				if (narrationText) {
					// Only add narration if it's not too long or if there's no payee
					if (!payeeText || narrationText.length < 30) {
						name += payeeText ? `: ${narrationText}` : ` ${narrationText}`;
					}
				}

				if (namedChildren.length > 4) {
					for (let i = 4; i < namedChildren.length; i++) {
						const posting = namedChildren[i];
						if (posting && posting.type === 'posting') {
							const account = posting.childForFieldName('account');
							const postingChildren: lsp.DocumentSymbol[] = [];
							const amount = posting.childForFieldName('amount');
							if (amount) {
								postingChildren.push({
									name: amount.text,
									kind: lsp.SymbolKind.Number,
									range: asLspRange(amount),
									selectionRange: asLspRange(amount),
								});
							}
							children.push({
								name: account?.text ?? 'Posting',
								kind: lsp.SymbolKind.Field,
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
				kind: lsp.SymbolKind.Class,
				range: asLspRange(transactionNode),
				selectionRange: asLspRange(transactionNode),
				children,
			};
			if (symbol.name) {
				symbols.push(symbol);
			}
		}

		return symbols;
	}

	private getCommodityDefinitionSymbol(commodityNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const commodity of commodityNodes) {
			const currencyNode = commodity.childForFieldName('currency');
			if (!currencyNode) continue;
			const commodityName = currencyNode.text;
			const date = commodity.childForFieldName('date');

			let name = `Commodity ${commodityName}`;
			if (date) {
				name = `${date.text} ${name}`;
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(commodity),
				selectionRange: asLspRange(commodity),
				children: [
					date && {
						name: date?.text ?? 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					{
						name: commodityName,
						kind: lsp.SymbolKind.Enum,
						range: asLspRange(currencyNode),
						selectionRange: asLspRange(currencyNode),
					},
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getAccountDefinitionSymbol(openNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const openDirective of openNodes) {
			const accountNode = openDirective.childForFieldName('account');
			if (!accountNode) continue;
			const accountName = accountNode.text;
			const date = openDirective.childForFieldName('date');
			let name = `Open ${accountName}`;
			if (date) {
				name = `${date.text} ${name}`;
			}

			// Check for currencies in the open directive
			const currencies: Parser.SyntaxNode[] = [];
			let firstCurrency: Parser.SyntaxNode | null = null;
			let lastCurrency: Parser.SyntaxNode | null = null;

			for (const child of openDirective.namedChildren) {
				if (child.type === 'currency') {
					currencies.push(child);
					if (!firstCurrency) firstCurrency = child;
					lastCurrency = child;
				}
			}

			// Create a currencies list symbol
			const currenciesSymbol = {
				name: 'Currencies',
				kind: lsp.SymbolKind.Array,
				range: firstCurrency && lastCurrency
					? asLspRange({
						startPosition: firstCurrency.startPosition,
						endPosition: lastCurrency.endPosition,
					})
					: asLspRange(openDirective),
				selectionRange: firstCurrency && lastCurrency
					? asLspRange({
						startPosition: firstCurrency.startPosition,
						endPosition: lastCurrency.endPosition,
					})
					: asLspRange(openDirective),
				children: currencies.map(currency => ({
					name: currency.text,
					kind: lsp.SymbolKind.Enum,
					range: asLspRange(currency),
					selectionRange: asLspRange(currency),
				})),
			};

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(openDirective),
				selectionRange: asLspRange(accountNode),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					{
						name: accountName,
						kind: lsp.SymbolKind.Interface,
						range: asLspRange(accountNode),
						selectionRange: asLspRange(accountNode),
					},
					currencies.length > 0 ? currenciesSymbol : null,
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getPriceDirectiveSymbol(priceNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const price of priceNodes) {
			const date = price.childForFieldName('date');
			const currency = price.childForFieldName('currency');
			const amount = price.childForFieldName('amount');

			let name = 'Price';
			if (date && currency && amount) {
				// Format amount text to round to 2 decimal places
				const amountText = amount.text;
				let formattedAmount = amountText;

				// Check if the amount contains a number that can be rounded
				const numberMatch = amountText.match(/(\d+\.\d+)/);
				if (numberMatch) {
					const originalNumber = parseFloat(numberMatch[0]);
					const roundedNumber = Math.round(originalNumber * 100) / 100;
					formattedAmount = amountText.replace(numberMatch[0], roundedNumber.toFixed(2));
				}

				name = `${date.text} Price ${currency.text} ${formattedAmount}`;
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(price),
				selectionRange: asLspRange(price),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					currency && {
						name: currency.text,
						kind: lsp.SymbolKind.Enum,
						range: asLspRange(currency),
						selectionRange: asLspRange(currency),
					},
					amount && {
						name: amount.text,
						kind: lsp.SymbolKind.Number,
						range: asLspRange(amount),
						selectionRange: asLspRange(amount),
					},
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getBalanceDirectiveSymbol(balanceNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const balance of balanceNodes) {
			const date = balance.childForFieldName('date');
			const account = balance.childForFieldName('account');
			const amount = balance.childForFieldName('amount');

			let name = 'Balance';
			if (date && account) {
				name = `${date.text} Balance ${account.text}`;
				if (amount) {
					name += ` ${amount.text}`;
				}
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(balance),
				selectionRange: asLspRange(balance),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					account && {
						name: account.text,
						kind: lsp.SymbolKind.Interface,
						range: asLspRange(account),
						selectionRange: asLspRange(account),
					},
					amount && {
						name: amount.text,
						kind: lsp.SymbolKind.Number,
						range: asLspRange(amount),
						selectionRange: asLspRange(amount),
					},
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getCloseDirectiveSymbol(closeNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const close of closeNodes) {
			const date = close.childForFieldName('date');
			const account = close.childForFieldName('account');

			let name = 'Close';
			if (date && account) {
				name = `${date.text} Close ${account.text}`;
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(close),
				selectionRange: asLspRange(close),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					account && {
						name: account.text,
						kind: lsp.SymbolKind.Interface,
						range: asLspRange(account),
						selectionRange: asLspRange(account),
					},
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getPadDirectiveSymbol(padNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const pad of padNodes) {
			const date = pad.childForFieldName('date');
			const account = pad.childForFieldName('account');
			const fromAccount = pad.childForFieldName('from_account');

			let name = 'Pad';
			if (date && account && fromAccount) {
				name = `${date.text} Pad ${account.text} <- ${fromAccount.text}`;
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(pad),
				selectionRange: asLspRange(pad),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					account && {
						name: account.text,
						kind: lsp.SymbolKind.Interface,
						range: asLspRange(account),
						selectionRange: asLspRange(account),
					},
					fromAccount && {
						name: fromAccount.text,
						kind: lsp.SymbolKind.Interface,
						range: asLspRange(fromAccount),
						selectionRange: asLspRange(fromAccount),
					},
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getDocumentDirectiveSymbol(documentNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const doc of documentNodes) {
			const date = doc.childForFieldName('date');
			const account = doc.childForFieldName('account');
			const filename = doc.childForFieldName('filename');
			const filenameText = getStringContent(filename);

			let name = 'Document';
			if (date && account) {
				name = `${date.text} Doc ${account.text}`;
				if (filenameText) {
					// Get just the base filename without the path
					const baseFilename = filenameText.split('/').pop() || filenameText;
					name += ` ${baseFilename}`;
				}
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(doc),
				selectionRange: asLspRange(doc),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					account && {
						name: account.text,
						kind: lsp.SymbolKind.Interface,
						range: asLspRange(account),
						selectionRange: asLspRange(account),
					},
					createStringSymbol(filename, lsp.SymbolKind.File),
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getNoteDirectiveSymbol(noteNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const note of noteNodes) {
			const date = note.childForFieldName('date');
			const account = note.childForFieldName('account');
			const noteText = note.childForFieldName('note');
			const noteContent = getStringContent(noteText);

			let name = 'Note';
			if (date && account) {
				name = `${date.text} Note ${account.text}`;
				if (noteContent) {
					// Truncate note content if it's too long
					if (noteContent.length > 30) {
						name += ` ${noteContent.substring(0, 27)}...`;
					} else {
						name += ` ${noteContent}`;
					}
				}
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(note),
				selectionRange: asLspRange(note),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					account && {
						name: account.text,
						kind: lsp.SymbolKind.Interface,
						range: asLspRange(account),
						selectionRange: asLspRange(account),
					},
					createStringSymbol(noteText, lsp.SymbolKind.String),
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getEventDirectiveSymbol(eventNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const event of eventNodes) {
			const date = event.childForFieldName('date');
			const type = event.childForFieldName('type');
			const desc = event.childForFieldName('desc');
			const typeText = getStringContent(type);
			const descText = getStringContent(desc);

			let name = 'Event';
			if (date) {
				name = `${date.text} Event`;
				if (typeText) {
					name += ` ${typeText}`;
				}
				if (descText) {
					// Truncate description if it's too long
					if (descText.length > 30) {
						name += ` ${descText.substring(0, 27)}...`;
					} else {
						name += ` ${descText}`;
					}
				}
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(event),
				selectionRange: asLspRange(event),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					createStringSymbol(type, lsp.SymbolKind.TypeParameter),
					createStringSymbol(desc, lsp.SymbolKind.String),
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getQueryDirectiveSymbol(queryNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const queryNode of queryNodes) {
			const date = queryNode.childForFieldName('date');
			const name = queryNode.childForFieldName('name');
			const queryString = queryNode.childForFieldName('query');
			const nameText = getStringContent(name);

			let symbolName = 'Query';
			if (date) {
				symbolName = `${date.text} Query`;
				if (nameText) {
					symbolName += ` ${nameText}`;
				}
			}

			const symbol: lsp.DocumentSymbol = {
				name: symbolName,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(queryNode),
				selectionRange: asLspRange(queryNode),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					createStringSymbol(name, lsp.SymbolKind.Key),
					createStringSymbol(queryString, lsp.SymbolKind.String),
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getCustomDirectiveSymbol(customNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const custom of customNodes) {
			const date = custom.childForFieldName('date');
			const name = custom.childForFieldName('name');
			const nameText = getStringContent(name);

			let symbolName = 'Custom';
			if (date) {
				symbolName = `${date.text} Custom`;
				if (nameText) {
					symbolName += ` ${nameText}`;
				}
			}

			const symbol: lsp.DocumentSymbol = {
				name: symbolName,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(custom),
				selectionRange: asLspRange(custom),
				children: [
					date && {
						name: 'Date',
						kind: lsp.SymbolKind.Property,
						range: asLspRange(date),
						selectionRange: asLspRange(date),
					},
					createStringSymbol(name, lsp.SymbolKind.Key),
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private getIncludeDirectiveSymbol(includeNodes: readonly Parser.SyntaxNode[]): lsp.DocumentSymbol[] {
		const symbols: lsp.DocumentSymbol[] = [];

		for (const include of includeNodes) {
			// Include directive has a string parameter which is the file path
			const filePath = include.namedChildren[0] ?? null;
			const filePathText = getStringContent(filePath);

			let name = 'Include';
			if (filePathText) {
				// Get just the base filename without the path
				const baseFilename = filePathText.split('/').pop() || filePathText;
				name = `Include ${baseFilename}`;
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(include),
				selectionRange: asLspRange(include),
				children: [
					createStringSymbol(filePath, lsp.SymbolKind.File),
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}
}
