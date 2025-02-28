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
    // Original text in lowercase
    const originalText = text.toLowerCase();
    
    // Get full pinyin representation
    const fullPinyin = pinyin(text, { toneType: 'none', type: 'array' })
        .map(p => p.toLowerCase())
        .join(' ');
    
    // Get first letters of pinyin (existing functionality)
    const pinyinFirstLetters = getPinyinFirstLetters(text);
    
    // Create additional fuzzy variations:
    
    // 1. Get words/characters as separate units for filtering
    const pinyinWords = pinyin(text, { toneType: 'none', type: 'array' });
    
    // 2. Generate first letters of each word (for filtering like "dc" for "Dan Che")
    const wordFirstLetters = pinyinWords.map(p => p[0].toLowerCase()).join('');
    
    // 3. Generate all possible subsequences of first letters
    // This allows matching "hlc" for "Ha Lou Dan Che" by skipping "d"
    const subsequences = [];
    const letters = pinyinWords.map(p => p[0].toLowerCase());
    
    // Generate all possible subsequences (maintaining order)
    for (let i = 0; i < letters.length; i++) {
        for (let j = i + 1; j <= letters.length; j++) {
            const subsequence = letters.slice(i, j).join('');
            if (subsequence.length > 1) {
                subsequences.push(subsequence);
            }
        }
    }
    
    // Combine all filter variations
    return [
        originalText,
        pinyinFirstLetters,
        fullPinyin,
        wordFirstLetters,
        ...subsequences
    ].join(' ');
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
        // console.info(`current ${current.type}: ${current}`);
        // console.info(`parent ${current.parent?.type}: ${current.parent?.toString()}`);
        // console.info(
        //     `previousNamedSibling: ${current.previousNamedSibling?.type} previousSibling: ${current.previousSibling?.type}`,
        // );
        // console.info(
        //     `namedDescendantForPosition: ${tree.rootNode.namedDescendantForPosition(asTsPoint(params.position)).type}`,
        // );

        // console.info(`descendantForPosition: ${tree.rootNode.descendantForPosition(asTsPoint(params.position)).type}`);

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

        console.info(`Starting completion with info: ${JSON.stringify(info)}`);
        const p: Promise<void> = match(info)
            .with({ triggerCharacter: '2' }, async () => {
                console.info('Branch: triggerCharacter 2');
                const d = new Date();
                const yesterday = sub(d, { days: 1 });
                const dayBeforeYesterday = sub(d, { days: 2 });
                const tomorrow = add(d, { days: 1 });
                [d, yesterday, tomorrow, dayBeforeYesterday].forEach(d => {
                    addItem({ label: formatDate(d, 'yyyy-MM-dd') });
                });
                console.info(`Date completions added, items: ${completionItems.length}`);
            })
            .with({ triggerCharacter: '"', previousSiblingType: 'txn' }, async () => {
                console.info('Branch: triggerCharacter " with txn sibling');
                const initialCount = completionItems.length;
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, true, 'end', set, completionItems, cnt);
                console.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
            })
            .with({
                triggerCharacter: '"',
                previousSiblingType: 'txn',
                previousPreviousSiblingType: 'date'
            }, async () => {
                console.info('Branch: triggerCharacter " with txn sibling and date previous');
                const initialCount = completionItems.length;
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, true, 'end', set, completionItems, cnt);
                console.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
            })
            .with({ triggerCharacter: '"', previousSiblingType: 'payee' }, async () => {
                console.info('Branch: triggerCharacter " with payee sibling');
                const initialCount = completionItems.length;
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, false, 'end', set, completionItems, cnt);
                console.info(`Narrations added, items: ${completionItems.length - initialCount}`);
            })
            .with({ triggerCharacter: '"', currentType: 'narration' }, async () => {
                console.info('Branch: triggerCharacter " with narration current');
                const initialCount = completionItems.length;
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, true, 'end', set, completionItems, cnt);
                console.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
            })
            .with({ triggerCharacter: '"', previousSiblingType: 'string' }, async () => {
                console.info('Branch: triggerCharacter " with string sibling');
                const initialCount = completionItems.length;
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, false, 'end', set, completionItems, cnt);
                console.info(`Narrations added, items: ${completionItems.length - initialCount}`);
            })
            .with({ 
                triggerCharacter: '"', 
                currentType: 'ERROR',
                previousSiblingType: 'string',
                previousPreviousSiblingType: 'txn'
            }, async () => {
                console.info('Branch: triggerCharacter " with ERROR current, string sibling, txn previous');
                const initialCount = completionItems.length;
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, false, 'end', set, completionItems, cnt);
                console.info(`Narrations added, items: ${completionItems.length - initialCount}`);
            })
            .with({ 
                triggerCharacter: '"', 
                currentType: 'ERROR',
                previousSiblingType: 'txn',
                previousPreviousSiblingType: 'date'
            }, async () => {
                console.info('Branch: triggerCharacter " with ERROR current, txn sibling, date previous');
                const initialCount = completionItems.length;
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, true, 'end', set, completionItems, cnt);
                console.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
            })
            .with({ currentType: 'narration' }, async () => {
                console.info('Branch: narration current');
                const initialCount = completionItems.length;
                cnt = await addPayeesAndNarrations(this.symbolIndex, position, true, 'both', set, completionItems, cnt);
                console.info(`Payees and narrations added, items: ${completionItems.length - initialCount}`);
            })
            .with({
                previousPreviousSiblingType: '\n',
                previousSiblingType: 'transaction',
                parentType: 'file',
            }, async () => {
                console.info('Branch: transaction sibling with newline previous');
                const initialCount = completionItems.length;
                const accounts = await this.symbolIndex.getAccountDefinitions();
                accounts.forEach((account: { name: string }) => {
                    addItem({ label: account.name });
                });
                console.info(`Accounts added, items: ${completionItems.length - initialCount}`);
            })
            .with({ lastChildType: 'narration' }, async () => {
                console.info('Branch: narration last child');
                const initialCount = completionItems.length;
                const accounts = await this.symbolIndex.getAccountDefinitions();
                accounts.forEach((account: { name: string }) => {
                    addItem({ label: account.name });
                });
                console.info(`Accounts added, items: ${completionItems.length - initialCount}`);
            })
            .otherwise(() => {
                console.info('No matching branch found');
                return Promise.resolve();
            });
        await p;

        console.log(`Final completion items: ${completionItems.length}`);
        return completionItems;
    }
}
