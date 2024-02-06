import { add, formatDate, sub } from 'date-fns';
import { match, P } from 'ts-pattern';
import {
    CompletionItem,
    CompletionItemKind,
    CompletionParams,
    CompletionRegistrationOptions,
    CompletionRequest,
    Connection,
    Position,
    TextEdit,
} from 'vscode-languageserver';
import { asTsPoint, nodeAtPosition } from '../common';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import { SymbolIndex } from './symbol-index';
import { Feature } from './types';

const Tuple = <T extends unknown[]>(xs: readonly [...T]): T => xs as T;

const triggerCharacters = Tuple(['2', '#', '"', '^'] as const);
type TriggerCharacter = (typeof triggerCharacters)[number];
//    ^?

type TriggerInfo = {
    triggerCharacter: TriggerCharacter | undefined;
    currentType: string;
    parentType: string | undefined;
    previousSiblingType: string | undefined;
    previousPreviousSiblingType: string | undefined;
    descendantForPositionType: string | undefined;
    lastChildType: string | undefined;
};

export class CompletionFeature implements Feature {
    constructor(
        private readonly documents: DocumentStore,
        private readonly trees: Trees,
        private readonly symbolIndex: SymbolIndex,
    ) { }
    register(connection: Connection) {
        const registerOptions: CompletionRegistrationOptions = {
            documentSelector: [{ language: 'beancount' }],
            triggerCharacters,
        };
        connection.client.register(CompletionRequest.type, registerOptions);
        connection.onCompletion(this.provideCompletionItems);
    }

    provideCompletionItems = async (params: CompletionParams): Promise<CompletionItem[]> => {
        const document = await this.documents.retrieve(params.textDocument.uri);
        const tree = await this.trees.getParseTree(document);
        if (!tree) {
            return [];
        }
        const current = nodeAtPosition(tree.rootNode, params.position, true);
        console.info(`current ${current.type}: ${current}`);
        console.info(`parent ${current.parent?.type}: ${current.parent?.toString()}`);
        console.info(
            `previousNamedSibling: ${current.previousNamedSibling?.type} previousSibling: ${current.previousSibling?.type}`,
        );
        console.info(
            `namedDescendantForPosition: ${tree.rootNode.namedDescendantForPosition(asTsPoint(params.position)).type}`,
        );

        console.info(`descendantForPosition: ${tree.rootNode.descendantForPosition(asTsPoint(params.position)).type}`);

        const descendantForCurPos = tree.rootNode.descendantForPosition(asTsPoint(params.position));
        let lastChildNode = descendantForCurPos.child(descendantForCurPos.childCount - 1);

        if (!lastChildNode || lastChildNode.type === 'ERROR') {
            // find up
            let parent = lastChildNode?.parent;
            console.info(`pp ${parent?.type} AAAA`)
            while (
                typeof parent == 'object' && parent !== null
                && parent.type === 'ERROR') {
                console.info(`pp ${parent?.type}`)
                parent = parent?.parent
            }
            lastChildNode = parent ?? null;
            console.info(`pp ${parent?.type}`)

            // find sibling
            if ((parent?.childCount ?? 0) > 0) {
                let n = parent?.children[parent.childCount - 1];
                while (n && n.type === 'ERROR') {
                    n = n.previousNamedSibling ?? undefined;
                }
                lastChildNode = n ?? null;
            }

            // find last child
            if (lastChildNode) {
                let n = lastChildNode
                while (n.childCount > 0) {
                    n = n.children[n.childCount - 1]
                }
                lastChildNode = n;
            }

        }
        const completionItems: CompletionItem[] = await this.calcCompletionItems({
            currentType: current.type,
            parentType: current.parent?.type,
            triggerCharacter: params.context?.triggerCharacter as TriggerCharacter,
            previousSiblingType: current.previousSibling?.type,
            previousPreviousSiblingType: current.previousSibling?.previousSibling?.type,
            descendantForPositionType: descendantForCurPos?.type,
            lastChildType: lastChildNode?.type,
        }, params.position);

        return completionItems;
    };

    async calcCompletionItems(info: TriggerInfo, position: Position): Promise<CompletionItem[]> {
        let cnt = 0;
        const set = new Set();
        const completionItems: CompletionItem[] = [];

        function addItem(item: CompletionItem) {
            if (set.has(item.label)) {
                return;
            }
            item.sortText = String.fromCharCode(95 + cnt);
            completionItems.push(item);
            // console.info(`addItem ${JSON.stringify(item)}`);
            set.add(item.label);
            cnt++;
        }

        console.info(JSON.stringify(info));
        const p: Promise<void> = match(info)
            .with({ triggerCharacter: '2' }, async () => {
                const d = new Date();
                const yesterday = sub(d, { days: 1 });
                const dayBeforeYesterday = sub(d, { days: 2 });
                const tomorrow = add(d, { days: 1 });
                [d, yesterday, tomorrow, dayBeforeYesterday].forEach(d => {
                    addItem({ label: formatDate(d, 'yyyy-MM-dd') });
                });
            })
            .with({ triggerCharacter: '"', previousSiblingType: 'txn' }, async () => {
                const text = '你猜';
                addItem({ label: text, textEdit: TextEdit.insert(position, `${text}"`) });
            })
            .with({
                previousPreviousSiblingType: '\n',
                previousSiblingType: 'transaction',
                parentType: 'file',
            }, async () => {
                const accounts = await this.symbolIndex.getAccountDefinitions();
                accounts.forEach(account => {
                    addItem({ label: account.name });
                    console.info(`${account.name} added`);
                });
            })
            .with({ lastChildType: 'narration' }, async () => {
                const accounts = await this.symbolIndex.getAccountDefinitions();
                accounts.forEach(account => {
                    addItem({ label: account.name });
                    console.info(`${account.name} added`);
                });
            })
            .otherwise(() => Promise.resolve());
        await p;

        console.info(JSON.stringify(completionItems));
        return completionItems;
    }
}
