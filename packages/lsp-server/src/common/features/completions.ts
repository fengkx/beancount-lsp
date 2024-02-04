import { add, formatDate, sub } from "date-fns";
import { CompletionItem, CompletionParams, CompletionRequest, CompletionRegistrationOptions, Connection, CompletionItemKind } from "vscode-languageserver";
import { DocumentStore } from "../document-store";
import { Trees } from "../trees";
import { Feature } from "./types";
import { asTsPoint, nodeAtPosition } from "../common";
import { P, match } from "ts-pattern";


const Tuple = <T extends unknown[]>(xs: readonly [...T]): T => xs as T;

const triggerCharacters = Tuple(['2', '*', '"', 'yt', 'td', 'tm'] as const)
type TriggerCharacter = (typeof triggerCharacters)[number];
//    ^?

type TriggerInfo = {
    triggerCharacter: TriggerCharacter | undefined;
    currentType: string;
    parentType: string | undefined;
    previousSiblingType: string | undefined;
    descendantForPositionType: string | undefined;
}

export class CompletionFeature implements Feature {
    constructor(
        private readonly documents: DocumentStore,
        private readonly trees: Trees
    ) { }
    register(connection: Connection) {
        const registerOptions: CompletionRegistrationOptions = {
            documentSelector: [{ language: 'beancount' }],
            triggerCharacters,

        }
        connection.client.register(CompletionRequest.type, registerOptions)
        connection.onCompletion(this.provideCompletionItems)
    }

    provideCompletionItems = async (params: CompletionParams): Promise<CompletionItem[]> => {
        const document = await this.documents.retrieve(params.textDocument.uri);
        const tree = await this.trees.getParseTree(document);
        if (!tree) {
            return []
        }
        const current = nodeAtPosition(tree.rootNode, params.position, true);
        console.info(`current ${current.type}: ${current}`);
        console.info(`parent ${current.parent?.type}: ${current.parent?.toString()}`);
        console.info(`previousNamedSibling: ${current.previousNamedSibling?.type} previousSibling: ${current.previousSibling?.type}`);
        console.info(`namedDescendantForPosition: ${tree.rootNode.namedDescendantForPosition(asTsPoint(params.position)).type}`);
        console.info(`descendantForPosition: ${tree.rootNode.descendantForPosition(asTsPoint(params.position)).type}`)

        const completionItems: CompletionItem[] = this.calcCompletionItems({
            currentType: current.type,
            parentType: current.parent?.type,
            triggerCharacter: params.context?.triggerCharacter as TriggerCharacter,
            previousSiblingType: current.previousSibling?.type,


        })



        return completionItems.map((item, index) => {

            item.sortText = String.fromCharCode(97 + index);
            return item;
        })
    }

    async calcCompletionItems(info: TriggerInfo) {
        let cnt = 0;
        const set = new Set();
        const completionItems: CompletionItem[] = [];

        function addItem(item: CompletionItem) {
            if (set.has(item.label)) {
                return;
            }
            item.sortText = String.fromCharCode(95 + cnt);
            completionItems.push(item)
            set.add(item.label);
        }
        // switch (params.context?.triggerCharacter) {
        //     case '2': {
        //         const d = new Date();
        //         const yesterday = sub(d, { days: 1 });
        //         const dayBeforeYesterday = sub(d, { days: 2 });
        //         const tomorrow = add(d, { days: 1 });
        //         [d, yesterday, tomorrow, dayBeforeYesterday,].forEach(d => {
        //             completionItems.push({ label: formatDate(d, 'yyyy-MM-dd') });
        //         })
        //         break;
        //     }

        // }
        // switch (current?.type) {
        //     case '\n':
        //         if (current.parent?.type === 'file') {
        //             completionItems.push(CompletionItem.create(formatDate(Date.now(), 'yyyy-MM-dd')))
        //         }
        //         break;
        // }
        match(info)
            .with({ triggerCharacter: '2' }, () => {
                const d = new Date();
                const yesterday = sub(d, { days: 1 });
                const dayBeforeYesterday = sub(d, { days: 2 });
                const tomorrow = add(d, { days: 1 });
                [d, yesterday, tomorrow, dayBeforeYesterday,].forEach(d => {
                    const label = formatDate(d, 'yyyy-MM-dd');
                    set.add(label);
                    if ()
                        completionItems.push({ label: formatDate(d, 'yyyy-MM-dd') });
                })
            })
    }

}