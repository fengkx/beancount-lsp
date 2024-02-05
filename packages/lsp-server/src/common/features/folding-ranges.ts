import {
	Connection,
	FoldingRange,
	FoldingRangeParams,
	FoldingRangeRegistrationOptions,
	FoldingRangeRequest,
} from 'vscode-languageserver';
import { DocumentStore } from '../document-store';
import { TreeQuery } from '../language';
import { Trees } from '../trees';
import { Feature } from './types';

export class FoldingRangeFeature implements Feature {
	constructor(private readonly _documents: DocumentStore, private readonly _trees: Trees) {
	}
	register(connection: Connection) {
		const registerOptions: FoldingRangeRegistrationOptions = {
			documentSelector: [{ language: 'beancount' }],
		};
		connection.client.register(FoldingRangeRequest.type, registerOptions);
		connection.onFoldingRanges(this.provideFoldingRanges);
	}

	provideFoldingRanges = async (params: FoldingRangeParams): Promise<FoldingRange[]> => {
		const document = await this._documents.retrieve(params.textDocument.uri);
		const tree = await this._trees.getParseTree(document);
		if (!tree) {
			return [];
		}
		const result: FoldingRange[] = [];
		const foldingMatches = await TreeQuery.getQueryByTokenName('folding').captures(tree.rootNode);
		foldingMatches.flat().forEach(capture => {
			result.push(
				FoldingRange.create(
					capture.node.startPosition.row,
					capture.node.endPosition.row,
					capture.node.startPosition.column,
					capture.node.endPosition.column,
					capture.name,
				),
			);
		});
		return result;
	};
}
