import { compactToRange, nodeAtPosition } from 'src/common/common';
import { DocumentStore } from '../../document-store';
import { Trees } from '../../trees';
import { SymbolInfo } from '../symbol-extractors';
import { SymbolIndex } from '../symbol-index';

interface PriceDeclaration {
	name: string;
	date: string;
	price: { amount: string; currency: string };
}

export class PriceMap {
	constructor(
		private readonly symbolIndex: SymbolIndex,
		private readonly trees: Trees,
		private readonly documents: DocumentStore,
	) {
	}

	getPriceByCommodity(commodity: string, date?: string): string | undefined {
		const pricesDeclarations = this.symbolIndex.getPricesDeclarations({ name: commodity });
	}

	private async _parsePriceDeclaration(node: SymbolInfo): Promise<PriceDeclaration> {
		const { range } = node;
		const document = await this.documents.retrieve(node._uri);
		const lspRange = compactToRange(range);
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			throw new Error(`Failed to get parse tree for document: ${node._uri}`);
		}
		const priceDeclaration = nodeAtPosition(tree.rootNode, {
			line: lspRange.start.line,
			character: lspRange.start.character,
		});
		if (!priceDeclaration) {
			throw new Error(`Failed to get price declaration for commodity: ${node.name}`);
		}
		const date = priceDeclaration.childForFieldName('date');
		const price = priceDeclaration.childForFieldName('price');
		const amount = price?.childForFieldName('amount');
		const currency = price?.childForFieldName('currency');
		if (!date || !price || !amount || !currency) {
			throw new Error(`Failed to get price declaration for commodity: ${node.name}`);
		}
		return {
			name: node.name,
			date: date.text,
			price: {
				amount: amount.text,
				currency: currency.text,
			},
		};
	}
}
