/**
 * This file implements autocompletion functionality for Beancount files.
 * It includes various types of completions:
 * - Account completions (Assets, Liabilities, Equity, Expenses, Income)
 * - Payee and narration completions
 * - Tag completions
 * - Currency completions
 * - Date completions
 *
 * The file also includes logic for filtering and sorting completions,
 * with special handling for Chinese text using pinyin first letters.
 */

import { Logger } from '@bean-lsp/shared/logger';
import { globalEventBus, GlobalEvents } from '../../utils/event-bus';
import {
	CompletionItem,
	CompletionItemKind,
	CompletionList,
	CompletionParams,
	Connection,
	Position,
} from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import type Parser from 'web-tree-sitter';
import { nodeAtPosition } from '../../common';
import { DocumentStore } from '../../document-store';
import { Trees } from '../../trees';
import { SymbolIndex } from '../symbol-index';
import { Feature } from '../types';
import { runCompletionEngine } from './completion-engine';
import {
	buildCompletionTextContext,
	shouldSuppressCurrencyForCurrentToken,
} from './completion-context';
import { resolveCompletionIntent } from './completion-intents';
import {
	addAccountCompletions,
	addCurrencyCompletions,
	addDateCompletions,
	addIdentifierCompletions,
	addLinkCompletions,
	addPayeesAndNarrations,
	addTagCompletions,
	type CompletionCollector,
} from './completion-providers';
import { reparseWithPlaceholder } from './completion-fallback';

const Tuple = <T extends unknown[]>(xs: readonly [...T]): T => xs as T;

/**
 * Trigger characters for autocompletion:
 * '2' - Date completions
 * '#' - Tag completions
 * '"' - Payee/narration completions
 * '^' - Link completions
 */
export const triggerCharacters = Tuple([
	'2',
	'#',
	'"',
	'^',
] as const);
type TriggerCharacter = (typeof triggerCharacters)[number];

/**
 * Information about the context where completion was triggered
 * Used to determine what kind of completions to provide
 */
export type TriggerInfo = {
	triggerCharacter: TriggerCharacter | undefined;
	currentType: string;
	parentType: string | undefined;
	previousSiblingType: string | undefined;
	previousPreviousSiblingType: string | undefined;
};

type TokenRange = {
	startChar: number;
	endChar: number;
};

type CompletionTextContext = {
	linePrefix: string;
	tokenRange: TokenRange;
	tokenText: string;
	triggerCharacter?: string;
	inOpenQuote: boolean;
	afterHash: boolean;
	afterCaret: boolean;
};

// Create a logger for the completions module
const logger = new Logger('completions');

/**
 * Completion feature implementation for Beancount language server
 *
 * This class provides completion suggestions for:
 * - Account names (Assets, Liabilities, Equity, Expenses, Income)
 * - Payees and narrations
 * - Tags
 * - Currencies
 * - Dates
 *
 * It implements context-aware matching to provide appropriate completions
 * based on the cursor position and surrounding tokens.
 */
export class CompletionFeature implements Feature {
	private connection: Connection | null = null;
	private enablePinyin: boolean = false;
	private hasFetchedCompletionConfig: boolean = false;
	private requestSeq: number = 0;
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly symbolIndex: SymbolIndex,
	) {}

	/**
	 * Registers the completion provider with the language server
	 *
	 * @param connection The language server connection
	 */
	register(connection: Connection): void {
		this.connection = connection;
		connection.onCompletion(this.provideCompletionItems);
		connection.onCompletionResolve(this.resolveCompletionItem);
		globalEventBus.on(GlobalEvents.ConfigurationChanged, () => {
			void this.refreshCompletionConfig();
		});
	}

	/**
	 * Gets the configuration for Chinese pinyin fuzzy filter
	 *
	 * @param scopeUri Optional URI to use as scope for configuration
	 * @returns Whether pinyin filter is enabled
	 */
	private async getEnablePinyinConfig(scopeUri?: string): Promise<boolean> {
		if (!this.hasFetchedCompletionConfig) {
			await this.refreshCompletionConfig(scopeUri);
		}
		return this.enablePinyin;
	}

	private async refreshCompletionConfig(scopeUri?: string): Promise<void> {
		try {
			const config = await this.connection!.workspace.getConfiguration({
				scopeUri,
				section: 'beanLsp.completion',
			});
			this.enablePinyin = config?.enableChinesePinyinFilter ?? false;
			this.hasFetchedCompletionConfig = true;
			// Update symbol index with the new pinyin setting
			this.symbolIndex.setEnablePinyin(this.enablePinyin);
			logger.debug(`Completion config refreshed: enableChinesePinyinFilter=${this.enablePinyin}`);
		} catch (e) {
			logger.debug(`Failed to refresh completion config: ${e}`);
			this.hasFetchedCompletionConfig = true; // avoid repeated fetch in error loop
		}
	}

	/**
	 * Resolves additional information for a completion item that has been selected
	 *
	 * This method is called when a user selects a completion item from the list.
	 * It can provide additional information like documentation, more details, etc.
	 *
	 * @param item The selected completion item to resolve
	 * @returns The completion item with additional information
	 */
	resolveCompletionItem = (item: CompletionItem): CompletionItem => {
		// Currently, we don't need to add any additional information
		// But the method must be implemented to handle the protocol request
		return item;
	};

	/**
	 * Provides completion items based on the context
	 *
	 * This method analyzes the token at the current position, determines
	 * what kind of completions are appropriate, and returns relevant items.
	 *
	 * @param params Completion parameters from the client
	 * @returns Array of completion items
	 */
	provideCompletionItems = async (
		params: CompletionParams,
	): Promise<CompletionItem[] | CompletionList | null> => {
		const requestId = ++this.requestSeq;
		const document = await this.documents.retrieve(params.textDocument.uri);
		const tree = await this.trees.getParseTree(document);
		if (!tree) {
			return CompletionList.create([]);
		}
		const textCtx = buildCompletionTextContext(
			document,
			params.position,
			params.context?.triggerCharacter as string | undefined,
		);
		logger.info(
			`[completion-context] requestId=${requestId} triggerKind=${params.context?.triggerKind ?? 'n/a'} triggerChar="${params.context?.triggerCharacter ?? ''}" token="${textCtx.tokenText}" range=${textCtx.tokenRange.startChar}-${textCtx.tokenRange.endChar} cursor=${params.position.character} isIncomplete=true`,
		);
		if (textCtx.tokenRange.endChar !== params.position.character) {
			logger.warn(
				`[completion-context] requestId=${requestId} stale-range tokenEnd=${textCtx.tokenRange.endChar} cursor=${params.position.character}`,
			);
		}

		// Check if this is a closing quote
		if (params.context?.triggerCharacter === '"') {
			if (!textCtx.inOpenQuote) {
				return CompletionList.create([]); // Don't trigger completion for closing quotes
			}
		}

		// Analyze the token at the current position
		const current = nodeAtPosition(tree.rootNode, params.position, true);

		// Get completion items based on the context
		const completionItems = await this.calcCompletionItems(
			{
				currentType: current.type,
				parentType: current.parent?.type,
				triggerCharacter: params.context?.triggerCharacter as TriggerCharacter,
				previousSiblingType: current.previousSibling?.type,
				previousPreviousSiblingType: current.previousSibling?.previousSibling?.type,
			},
			params.position,
			current,
			textCtx,
			document,
		);
		logger.info(
			`[completion-context] requestId=${requestId} itemsCount=${completionItems.length}`,
		);

		return CompletionList.create(completionItems, true);
	};

	/**
	 * Calculates appropriate completion items based on context
	 *
	 * This method uses pattern matching to determine what kind of completions
	 * to provide based on the trigger information and surrounding tokens.
	 *
	 * @param info Information about the trigger context
	 * @param position The current cursor position
	 * @param textCtx Unified text context around cursor
	 * @returns Array of completion items
	 */
	async calcCompletionItems(
		info: TriggerInfo,
		position: Position,
		current: Parser.SyntaxNode,
		textCtx: CompletionTextContext,
		document?: TextDocument,
	): Promise<CompletionItem[]> {
		const completionItems: CompletionItem[] = [];

		// Get pinyin configuration
		const enablePinyin = await this.getEnablePinyinConfig(document?.uri);

		// Create common completion context
		const collector: CompletionCollector = {
			symbolIndex: this.symbolIndex,
			position,
			existingCompletions: new Set<string>(),
			completions: completionItems,
			document,
			enablePinyin,
			textCtx,
		};

		return runCompletionEngine({
			info,
			position,
			current,
			textCtx,
			document,
			collector,
			deps: {
				logger,
				resolveCompletionIntent,
				shouldSuppressCurrencyForCurrentToken,
				addTagCompletions,
				addLinkCompletions,
				addCurrencyCompletions,
				addPayeesAndNarrations,
				addAccountCompletions,
				addDateCompletions,
				addIdentifierCompletions,
				reparseWithPlaceholder: (document, position, placeholder, kind, ancestorTypes) => reparseWithPlaceholder(
					logger,
					document,
					position,
					placeholder,
					kind,
					ancestorTypes,
				),
				completionItemKind: CompletionItemKind,
			},
		});
	}
}
