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
import { Logger } from '@bean-lsp/shared';

const logger = new Logger('FoldingRangeFeature');

export class FoldingRangeFeature implements Feature {
	constructor(private readonly _documents: DocumentStore, private readonly _trees: Trees) {
	}
	register(connection: Connection): void {
		const registerOptions: FoldingRangeRegistrationOptions = {
			documentSelector: [{ language: 'beancount' }],
		};
		connection.client.register(FoldingRangeRequest.type, registerOptions);
		connection.onFoldingRanges(this.provideFoldingRanges.bind(this));
	}

	provideFoldingRanges = async (params: FoldingRangeParams): Promise<FoldingRange[]> => {
		const document = await this._documents.retrieve(params.textDocument.uri);
		const tree = await this._trees.getParseTree(document);
		if (!tree) {
			return [];
		}
		const result: FoldingRange[] = [];
		const foldingMatches = await TreeQuery.getQueryByTokenName('folding').captures(tree.rootNode);
		try {
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
		} catch (e) {
			logger.error('Error getting folding ranges', e);
		}
		return result;
	};
}
