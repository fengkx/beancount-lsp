import { add, formatDate, sub } from 'date-fns';
import { match, P } from 'ts-pattern';
import { pinyin } from 'pinyin-pro';
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

function getPinyinFirstLetters(text: string): string {
    // Get pinyin with tone marks removed and convert to first letters
    return pinyin(text, { toneType: 'none', type: 'array' })
        .map(p => p[0].toLowerCase())
        .join('');
}

function createFilterString(text: string): string {
    // Create a filter string that includes both the original text and pinyin first letters
    const pinyinLetters = getPinyinFirstLetters(text);
    return `${text.toLowerCase()} ${pinyinLetters}`;
}

function addCompletionItem(
    item: { label: string; kind?: CompletionItemKind; detail?: string },
    position: Position,
    textEdit: string,
    set: Set<string>,
    items: CompletionItem[],
    cnt: number
) {
    if (set.has(item.label)) {
        return cnt;
    }

    const filterText = createFilterString(item.label);
    items.push({
        ...item,
        kind: item.kind || CompletionItemKind.Text,
        filterText,
        textEdit: TextEdit.insert(position, textEdit),
        sortText: String.fromCharCode(95 + cnt)
    });
    set.add(item.label);
    return cnt + 1;
}

async function addPayeesAndNarrations(
    symbolIndex: SymbolIndex,
    position: Position,
    addPayees: boolean,
    quoteStyle: 'none' | 'end' | 'both',
    set: Set<string>,
    items: CompletionItem[],
    cnt: number
): Promise<number> {
    const [payees, narrations] = await Promise.all([
        addPayees ? symbolIndex.getPayees() : Promise.resolve([]),
        symbolIndex.getNarrations()
    ]);

    if (addPayees) {
        payees.forEach((payee: string) => {
            const quote = quoteStyle === 'both' ? '"' : quoteStyle === 'end' ? '"' : '';
            const startQuote = quoteStyle === 'both' ? '"' : '';
            cnt = addCompletionItem(
                { label: payee, kind: CompletionItemKind.Text, detail: '(payee)' },
                position,
                `${startQuote}${payee}${quote} `, // Add space after having quick editing between payee and narration
                set,
                items,
                cnt
            );
        });
    }

    narrations.forEach((narration: string) => {
        const quote = quoteStyle === 'both' ? '"' : quoteStyle === 'end' ? '"' : '';
        const startQuote = quoteStyle === 'both' ? '"' : '';
        cnt = addCompletionItem(
            { label: narration, kind: CompletionItemKind.Text, detail: '(narration)' },
            position,
            `${startQuote}${narration}${quote}`,
            set,
            items,
            cnt
        );
    });

    return cnt;
}

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
        const set = new Set<string>();
        const completionItems: CompletionItem[] = [];

        function addItem(item: CompletionItem) {
            if (set.has(item.label as string)) {
                return;
            }
            item.sortText = String.fromCharCode(95 + cnt);
            if (typeof item.label === 'string') {
                item.filterText = createFilterString(item.label);
            }
            completionItems.push(item);
            set.add(item.label as string);
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
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, true, 'end', set, completionItems, cnt);
            })
            .with({
                triggerCharacter: '"',
                previousSiblingType: 'txn',
                previousPreviousSiblingType: 'date'
            }, async () => {
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, true, 'end', set, completionItems, cnt);
            })
            .with({ triggerCharacter: '"', previousSiblingType: 'payee' }, async () => {
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, false, 'end', set, completionItems, cnt);
            })
            .with({ triggerCharacter: '"', currentType: 'narration' }, async () => {
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, true, 'end', set, completionItems, cnt);
            })
            .with({ currentType: 'narration' }, async () => {
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, true, 'both', set, completionItems, cnt);
            })
            .with({
                previousPreviousSiblingType: '\n',
                previousSiblingType: 'transaction',
                parentType: 'file',
            }, async () => {
                const accounts = await this.symbolIndex.getAccountDefinitions();
                accounts.forEach((account: { name: string }) => {
                    addItem({ label: account.name });
                    console.info(`${account.name} added`);
                });
            })
            .with({ lastChildType: 'narration' }, async () => {
                const accounts = await this.symbolIndex.getAccountDefinitions();
                accounts.forEach((account: { name: string }) => {
                    addItem({ label: account.name });
                    console.info(`${account.name} added`);
                });
            })
            .otherwise(() => Promise.resolve());
        await p;

        console.log(JSON.stringify(completionItems));
        return completionItems;
    }
}
