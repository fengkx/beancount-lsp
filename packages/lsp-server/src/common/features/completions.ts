import { add, formatDate, sub } from "date-fns";
import { CompletionItem, CompletionParams, CompletionRequest, CompletionRegistrationOptions, Connection, CompletionItemKind } from "vscode-languageserver";
import { DocumentStore } from "../document-store";
import { Trees } from "../trees";
import { Feature } from "./types";
import { asTsPoint, nodeAtPosition } from "../common";
import { P, match } from "ts-pattern";


const Tuple = <T extends unknown[]>(xs: readonly [...T]): T => xs as T;

const triggerCharacters = Tuple(['2', '*', '"', 'y', 't'] as const)
type TriggerCharacter = (typeof triggerCharacters)[number];
//    ^?

type TriggerInfo = {
    triggerCharacter: TriggerCharacter | undefined;
    currentType: string;
    parentType: string | undefined;
    previousSiblingType: string | undefined;
    previousPreviousSiblingType: string | undefined;
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
            previousPreviousSiblingType: current.previousSibling?.previousSibling?.type,
            descendantForPositionType: tree.rootNode.descendantForPosition(asTsPoint(params.position))?.type,


        })



        return completionItems;
    }

    calcCompletionItems(info: TriggerInfo): CompletionItem[] {
        let cnt = 0;
        const set = new Set();
        const completionItems: CompletionItem[] = [];

        function addItem(item: CompletionItem) {
            if (set.has(item.label)) {
                return;
            }
            item.sortText = String.fromCharCode(95 + cnt);
            completionItems.push(item)
            console.info(`addItem ${JSON.stringify(item)}`)
            set.add(item.label);
            cnt++;
        }

        console.info(JSON.stringify(info));
        match(info)
            .with({ triggerCharacter: '2' }, () => {
                const d = new Date();
                const yesterday = sub(d, { days: 1 });
                const dayBeforeYesterday = sub(d, { days: 2 });
                const tomorrow = add(d, { days: 1 });
                [d, yesterday, tomorrow, dayBeforeYesterday,].forEach(d => {
                    addItem({ label: formatDate(d, 'yyyy-MM-dd') })
                });
            })
            .with({ triggerCharacter: 'y' }, () => {
                const yesterday = sub(new Date(), { days: 1 });
                const txt = formatDate(yesterday, 'yyyy-MM-dd')
                addItem({ label: txt })
            })
            .with({ triggerCharacter: '"', previousSiblingType: 'txn' }, () => {
                addItem({ label: '你猜' })
            })
        return completionItems;
    }

}