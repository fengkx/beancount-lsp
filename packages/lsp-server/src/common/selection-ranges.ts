// Modified from https://github.com/microsoft/vscode-anycode/blob/26947588357c6256d50d0c59155ad16e4783c7a7/anycode/server/src/common/features/selectionRanges.ts

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Connection, SelectionRangeRequest, SelectionRangeRegistrationOptions, SelectionRangeParams, SelectionRange } from "vscode-languageserver";
import { DocumentStore } from "./document-store";
import { Feature } from "./features/types";
import { Trees } from "./trees";
import type Parser from "web-tree-sitter";
import { asLspRange } from "./common";

export class SelectionRangesFeature implements Feature {

    constructor(private _documents: DocumentStore, private _trees: Trees) { }

    register(connection: Connection) {
        const registerOptions: SelectionRangeRegistrationOptions = {
            documentSelector: [{ language: 'beancount' }]
        }
        connection.client.register(SelectionRangeRequest.type, registerOptions);
        connection.onSelectionRanges(this.provideSelectionRanges)

    }

    provideSelectionRanges = async (params: SelectionRangeParams): Promise<SelectionRange[]> => {

        const document = await this._documents.retrieve(params.textDocument.uri);
        const tree = await this._trees.getParseTree(document);
        if (!tree) {
            return [];
        }

        const result: SelectionRange[] = [];

        for (const position of params.positions) {
            const stack: Parser.SyntaxNode[] = [];
            const offset = document.offsetAt(position);

            let node = tree.rootNode;
            stack.push(node);

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const child = node.namedChildren.find(candidate => {
                    return candidate.startIndex <= offset && candidate.endIndex > offset;
                });

                if (child) {
                    stack.push(child);
                    node = child;
                    continue;
                }
                break;
            }

            let parent: SelectionRange | undefined;
            for (const node of stack) {
                const range = SelectionRange.create(asLspRange(node), parent);
                parent = range;
            }
            if (parent) {
                result.push(parent);
            }
        }

        return result;
    }

}
