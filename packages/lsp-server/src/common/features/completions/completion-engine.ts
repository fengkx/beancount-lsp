import { match, P } from 'ts-pattern';
import type { CompletionItem, CompletionItemKind, Position } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type Parser from 'web-tree-sitter';
import type { CompletionTextContextLike } from './completion-context';
import type { CompletionIntentLike, IntentCompletionTextContextLike, TriggerInfoLike } from './completion-intents';
import type { AddPayeesAndNarrationsParams, CompletionCollector } from './completion-providers';
import type { PlaceholderKind, ReparseContext } from './completion-fallback';

type CompletionScenario = {
	placeholder: string;
	kind: PlaceholderKind;
	ancestorTypes?: string[];
	onSuccess: (ctx: ReparseContext) => Promise<void>;
	description: string;
};

type EngineDeps = {
	logger: { info: (msg: string) => void };
	resolveCompletionIntent: (info: TriggerInfoLike, textCtx: IntentCompletionTextContextLike) => CompletionIntentLike[];
	shouldSuppressCurrencyForCurrentToken: (linePrefix: string) => boolean;
	addTagCompletions: (collector: CompletionCollector) => Promise<void>;
	addLinkCompletions: (collector: CompletionCollector) => Promise<void>;
	addCurrencyCompletions: (collector: CompletionCollector) => Promise<void>;
	addPayeesAndNarrations: (collector: CompletionCollector, params: AddPayeesAndNarrationsParams) => Promise<void>;
	addAccountCompletions: (collector: CompletionCollector) => Promise<void>;
	addDateCompletions: (collector: CompletionCollector, position: Position, document?: TextDocument) => void;
	addIdentifierCompletions: (collector: CompletionCollector) => void;
	reparseWithPlaceholder: (
		document: TextDocument,
		position: Position,
		placeholder: string,
		kind: PlaceholderKind,
		ancestorTypes?: string[],
	) => Promise<ReparseContext | null>;
	completionItemKind: typeof CompletionItemKind;
};

type RunCompletionEngineArgs = {
	info: TriggerInfoLike;
	position: Position;
	current: Parser.SyntaxNode;
	textCtx: CompletionTextContextLike;
	document?: TextDocument;
	collector: CompletionCollector;
	deps: EngineDeps;
};

export async function runCompletionEngine(args: RunCompletionEngineArgs): Promise<CompletionItem[]> {
	const { info, position, current, textCtx, document, collector, deps } = args;
	const { logger } = deps;
	const completionItems = collector.completions;

	logger.info(`Starting completion with info: ${JSON.stringify(info)}`);
	const intents = deps.resolveCompletionIntent(info, textCtx);
	for (const intent of intents) {
		const initialCount = completionItems.length;
		switch (intent.type) {
			case 'date':
				deps.addDateCompletions(collector, position, document);
				break;
			case 'identifier':
				deps.addIdentifierCompletions(collector);
				break;
			case 'tag':
				await deps.addTagCompletions(collector);
				break;
			case 'link':
				await deps.addLinkCompletions(collector);
				break;
			case 'currency':
				await deps.addCurrencyCompletions(collector);
				break;
			case 'payeeNarration':
				await deps.addPayeesAndNarrations(collector, intent.params);
				break;
			case 'account':
				await deps.addAccountCompletions(collector);
				break;
		}
		if (completionItems.length > initialCount) {
			break;
		}
	}

	if (current.type === 'ERROR') {
		let n = current.parent;
		while (completionItems.length <= 0 && n) {
			let childCount = n?.childCount ?? 0;
			if (childCount === 1 && n!.child(0)?.type === 'ERROR') {
				n = n!.previousNamedSibling;
				childCount = n?.childCount ?? 0;
			}
			if (childCount > 0) {
				const childrenType = n!.children.map(c => c.type);
				const validTypes = childrenType.filter(t => t !== 'ERROR' && t.length > 1);
				const pp = match(
					{
						validTypes,
						head4ValidTypes: validTypes.slice(0, 4),
						triggerCharacter: info.triggerCharacter,
						tokenText: textCtx.tokenText,
					},
				)
					.with({ head4ValidTypes: ['account', 'binary_number_expr'] }, async () => {
						if (deps.shouldSuppressCurrencyForCurrentToken(textCtx.linePrefix)) {
							return;
						}
						const initialCount = completionItems.length;
						await deps.addCurrencyCompletions(collector);
						logger.info(`Currencies added, items: ${completionItems.length - initialCount}`);
					})
					.with(
						{
							validTypes: [
								'date',
								'txn',
								'payee',
								'narration',
								'posting',
							],
						},
						{
							head4ValidTypes: ['date', 'txn', 'payee', 'narration'],
						},
						{
							head4ValidTypes: ['date', 'txn', 'payee', 'posting'],
						},
						{
							head4ValidTypes: ['date', 'txn', 'narration', 'posting'],
						},
						{
							head4ValidTypes: [
								'date',
								P.union('balance', 'open', 'close', 'pad', 'document', 'note'),
							],
						},
						{ head4ValidTypes: ['date', 'txn', 'narration'] },
						{ head4ValidTypes: ['date', 'txn', 'narration', 'tags_links'] },
						{ head4ValidTypes: ['date', 'txn', 'narration', 'key_value'] },
						{ head4ValidTypes: ['date', P.union('pad', 'balance'), P.union('account', 'identifier')] },
						{ head4ValidTypes: ['date', 'pad', 'identifier', 'identifier'] },
						{
							head4ValidTypes: [P._, P._, P.union('atat', 'at'), 'number'],
							tokenText: P.string.regex(/^[AEIL]+$/),
						},
						async () => {
							const initialCount = completionItems.length;
							await deps.addAccountCompletions(collector);
							logger.info(`Accounts added, items: ${completionItems.length - initialCount}`);
						},
					)
					.otherwise(() => {
						logger.info(`No matching branch found ${JSON.stringify(validTypes)}`);
					});
				await pp;
			}
			if (completionItems.length > 0) {
				break;
			}
			n = n?.children.filter(q => q.type !== 'ERROR')?.at?.(-1) ?? null;
		}
	}

	if (completionItems.length === 0 && document) {
		try {
			const initial = completionItems.length;
			const scenarios: CompletionScenario[] = [
				{
					placeholder: 'Assets:Bank',
					kind: 'account',
					onSuccess: async () => {
						await deps.addAccountCompletions(collector);
					},
					description: 'account',
				},
				{
					placeholder: '#tag',
					kind: 'tag',
					onSuccess: async () => {
						await deps.addTagCompletions(collector);
					},
					description: 'tag',
				},
				{
					placeholder: ' CNY',
					kind: 'currency',
					onSuccess: async () => {
						await deps.addCurrencyCompletions(collector);
					},
					description: 'currency',
				},
				{
					placeholder: '^link',
					kind: 'link',
					onSuccess: async () => {
						await deps.addLinkCompletions(collector);
					},
					description: 'link',
				},
				{
					placeholder: 'somekey: "value"',
					kind: 'meta',
					onSuccess: async () => {
						logger.info('Fallback: metadata key_value context detected');
					},
					description: 'metadata_key_value',
				},
			];

			for (const scenario of scenarios) {
				if (completionItems.length > initial) {
					break;
				}

				const ctx = await deps.reparseWithPlaceholder(
					document,
					position,
					scenario.placeholder[0] === info.triggerCharacter
						? scenario.placeholder.slice(1)
						: scenario.placeholder,
					scenario.kind,
					scenario.ancestorTypes,
				);

				if (ctx) {
					await scenario.onSuccess(ctx);
					if (completionItems.length > initial) {
						const ancestorTypes = Array.from(ctx.ancestors.keys()).join(' > ');
						logger.info(
							`Fallback: ${scenario.description} (${ancestorTypes}), added ${
								completionItems.length - initial
							} items`,
						);
						break;
					}
				}
			}
		} catch (e) {
			logger.info(`Fallback (placeholder reparse) failed: ${e}`);
		}
	}

	logger.info(`Final completion items: ${completionItems.length}`);
	return completionItems;
}
