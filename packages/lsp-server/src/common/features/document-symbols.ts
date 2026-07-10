import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Tree } from 'web-tree-sitter';
import * as Parser from 'web-tree-sitter';
import { asLspRange } from '../common';
import { DocumentStore } from '../document-store';
import { TreeQuery } from '../language';
import { Trees } from '../trees';

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

		const symbols = (await Promise.all([
			this.getTransactionSymbol(tree),
			this.getCommodityDefinitionSymbol(tree),
			this.getAccountDefinitionSymbol(tree),
			this.getPriceDirectiveSymbol(tree),
			this.getBalanceDirectiveSymbol(tree),
			this.getCloseDirectiveSymbol(tree),
			this.getPadDirectiveSymbol(tree),
			this.getDocumentDirectiveSymbol(tree),
			this.getNoteDirectiveSymbol(tree),
			this.getEventDirectiveSymbol(tree),
			this.getQueryDirectiveSymbol(tree),
			this.getCustomDirectiveSymbol(tree),
			this.getIncludeDirectiveSymbol(tree),
		])).flat();

		return filterEmptyDocumentSymbols(symbols);
	}

	private async getTransactionSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const transactionQuery = TreeQuery.getQueryByTokenName('transaction');
		const transactionCaptures = await transactionQuery.captures(tree);

		for (const capture of transactionCaptures) {
			const date = capture.node.childForFieldName('date');
			let name = 'Txn';
			const children: lsp.DocumentSymbol[] = [];

			if (date && capture.node.namedChild(0)?.type === 'date') {
				const payee = capture.node.namedChild(2);
				const narration = capture.node.namedChild(3);

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

				if (capture.node.namedChildCount > 4) {
					for (let i = 4; i < capture.node.namedChildCount; i++) {
						const posting = capture.node.namedChild(i);
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
				range: asLspRange(capture.node),
				selectionRange: asLspRange(capture.node),
				children,
			};
			if (symbol.name) {
				symbols.push(symbol);
			}
		}

		return symbols;
	}

	private async getCommodityDefinitionSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const commodityDefinitionQuery = TreeQuery.getQueryByTokenName('currency_definition');
		const commodityDefinitionCaptures = await commodityDefinitionQuery.captures(tree);

		for (const capture of commodityDefinitionCaptures) {
			const commodity = capture.node.parent;
			if (!commodity || commodity.type !== 'commodity') {
				continue;
			}
			const commodityName = capture.node.text;
			const date = commodity.childForFieldName('date');

			let name = `Commodity ${commodityName}`;
			if (date) {
				name = `${date.text} ${name}`;
			}

			const symbol: lsp.DocumentSymbol = {
				name,
				kind: lsp.SymbolKind.Class,
				range: asLspRange(commodity!),
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
						range: asLspRange(capture.node),
						selectionRange: asLspRange(capture.node),
					},
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private async getAccountDefinitionSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const accountDefinitionQuery = TreeQuery.getQueryByTokenName('account_definition');
		const accountDefinitionCaptures = await accountDefinitionQuery.captures(tree);

		for (const capture of accountDefinitionCaptures) {
			const openDirective = capture.node.parent;
			if (!openDirective || openDirective.type !== 'open') {
				continue;
			}
			const accountName = capture.node.text;
			const date = openDirective.childForFieldName('date');
			let name = `Open ${accountName}`;
			if (date) {
				name = `${date.text} ${name}`;
			}

			// Check for currencies in the open directive
			const currencies: Parser.SyntaxNode[] = [];
			let firstCurrency: Parser.SyntaxNode | null = null;
			let lastCurrency: Parser.SyntaxNode | null = null;

			for (let i = 0; i < openDirective.namedChildCount; i++) {
				const child = openDirective.namedChild(i);
				if (child && child.type === 'currency') {
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
				selectionRange: asLspRange(capture.node),
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
						range: asLspRange(capture.node),
						selectionRange: asLspRange(capture.node),
					},
					currencies.length > 0 ? currenciesSymbol : null,
				].filter(Boolean) as lsp.DocumentSymbol[],
			};
			symbols.push(symbol);
		}

		return symbols;
	}

	private async getPriceDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const priceDirectiveQuery = TreeQuery.getQueryByTokenName('price');
		const priceDirectiveCaptures = await priceDirectiveQuery.captures(tree);

		for (const capture of priceDirectiveCaptures) {
			const price = capture.node;
			if (!price || price.type !== 'price') {
				continue;
			}
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

	private async getBalanceDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const balanceQuery = TreeQuery.getQueryByTokenName('balance');
		const balanceCaptures = await balanceQuery.captures(tree);

		for (const capture of balanceCaptures) {
			const balance = capture.node;
			if (!balance || balance.type !== 'balance') {
				continue;
			}
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

	private async getCloseDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const closeQuery = TreeQuery.getQueryByTokenName('close');
		const closeCaptures = await closeQuery.captures(tree);

		for (const capture of closeCaptures) {
			const close = capture.node;
			if (!close || close.type !== 'close') {
				continue;
			}
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

	private async getPadDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const padQuery = TreeQuery.getQueryByTokenName('pad');
		const padCaptures = await padQuery.captures(tree);

		for (const capture of padCaptures) {
			const pad = capture.node;
			if (!pad || pad.type !== 'pad') {
				continue;
			}
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

	private async getDocumentDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const documentQuery = TreeQuery.getQueryByTokenName('document');
		const documentCaptures = await documentQuery.captures(tree);

		for (const capture of documentCaptures) {
			const doc = capture.node;
			if (!doc || doc.type !== 'document') {
				continue;
			}
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

	private async getNoteDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const noteQuery = TreeQuery.getQueryByTokenName('note');
		const noteCaptures = await noteQuery.captures(tree);

		for (const capture of noteCaptures) {
			const note = capture.node;
			if (!note || note.type !== 'note') {
				continue;
			}
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

	private async getEventDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const eventQuery = TreeQuery.getQueryByTokenName('event');
		const eventCaptures = await eventQuery.captures(tree);

		for (const capture of eventCaptures) {
			const event = capture.node;
			if (!event || event.type !== 'event') {
				continue;
			}
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

	private async getQueryDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const queryQuery = TreeQuery.getQueryByTokenName('query');
		const queryCaptures = await queryQuery.captures(tree);

		for (const capture of queryCaptures) {
			const queryNode = capture.node;
			if (!queryNode || queryNode.type !== 'query') {
				continue;
			}
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

	private async getCustomDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const customQuery = TreeQuery.getQueryByTokenName('custom');
		const customCaptures = await customQuery.captures(tree);

		for (const capture of customCaptures) {
			const custom = capture.node;
			if (!custom || custom.type !== 'custom') {
				continue;
			}
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

	private async getIncludeDirectiveSymbol(tree: Tree): Promise<lsp.DocumentSymbol[]> {
		const symbols: lsp.DocumentSymbol[] = [];
		const includeQuery = TreeQuery.getQueryByTokenName('include');
		const includeCaptures = await includeQuery.captures(tree);

		for (const capture of includeCaptures) {
			const include = capture.node;
			if (!include || include.type !== 'include') {
				continue;
			}

			// Include directive has a string parameter which is the file path
			const filePath = include.namedChild(0);
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
