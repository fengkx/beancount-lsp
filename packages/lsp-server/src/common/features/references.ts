import { Logger } from '@bean-lsp/shared';
import * as lsp from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DocumentStore } from '../document-store';
import { Trees } from '../trees';
import * as positionUtils from './position-utils';
import { getRange, SymbolInfo } from './symbol-extractors';
import { SymbolIndex } from './symbol-index';

// Create a logger for the references module
const logger = new Logger('references');

/**
 * Provides references functionality for the Beancount Language Server.
 * This feature handles finding all references to a symbol in the codebase.
 */
export class ReferencesFeature {
	constructor(
		private readonly documents: DocumentStore,
		private readonly trees: Trees,
		private readonly symbolIndex: SymbolIndex,
	) {}

	/**
	 * Registers the references handler with the language server connection
	 */
	register(connection: lsp.Connection): void {
		connection.onReferences((params) => this.onReferences(params));
		console.log('ReferencesFeature registered');
	}

	/**
	 * Handles references requests from the client
	 */
	public async onReferences(
		params: lsp.ReferenceParams,
	): Promise<lsp.Location[] | null> {
		logger.debug(`References requested at position: ${JSON.stringify(params.position)}`);

		const document = await this.documents.retrieve(params.textDocument.uri);
		if (!document) {
			logger.warn(`Document not found: ${params.textDocument.uri}`);
			return null;
		}

		let references: lsp.Location[] = [];

		// Try to find an account at the position
		const accountAtPosition = await positionUtils.getAccountAtPosition(this.trees, document, params.position);
		if (accountAtPosition) {
			logger.debug(`Found account at position: ${accountAtPosition}`);
			// Find all references to this account (both usage and definition)
			references = await this.findAccountReferences(accountAtPosition);
		}

		// Try to find a commodity at the position
		const commodityAtPosition = await positionUtils.getCommodityAtPosition(this.trees, document, params.position);
		if (commodityAtPosition && references.length === 0) {
			logger.debug(`Found commodity at position: ${commodityAtPosition}`);
			// Find all references to this commodity
			references = await this.findCommodityReferences(commodityAtPosition);
		}

		// Try to find a tag at the position
		const tagAtPosition = await positionUtils.getTagAtPosition(this.trees, document, params.position);
		if (tagAtPosition && references.length === 0) {
			logger.debug(`Found tag at position: ${tagAtPosition}`);
			// Find all references to this tag
			references = await this.findTagReferences(tagAtPosition);
		}

		// Try to find a pushtag at the position
		const pushtagAtPosition = await positionUtils.getPushTagAtPosition(this.trees, document, params.position);
		if (pushtagAtPosition && references.length === 0) {
			logger.debug(`Found pushtag at position: ${pushtagAtPosition}`);
			// For pushtag, find all poptag references with the same name
			references = await this.findPushTagReferences(pushtagAtPosition);
		}

		// Try to find a poptag at the position
		const poptagAtPosition = await positionUtils.getPopTagAtPosition(this.trees, document, params.position);
		if (poptagAtPosition && references.length === 0) {
			logger.debug(`Found poptag at position: ${poptagAtPosition}`);
			// For poptag, find all pushtag references with the same name
			references = await this.findPopTagReferences(poptagAtPosition);
		}

		// Try to find a payee at the position
		const payeeAtPosition = await positionUtils.getPayeeAtPosition(this.trees, document, params.position);
		if (payeeAtPosition && references.length === 0) {
			logger.debug(`Found payee at position: ${payeeAtPosition}`);
			// Find all references to this payee
			references = await this.findPayeeReferences(payeeAtPosition);
		}

		// Try to find a narration at the position
		const narrationAtPosition = await positionUtils.getNarrationAtPosition(this.trees, document, params.position);
		if (narrationAtPosition && references.length === 0) {
			logger.debug(`Found narration at position: ${narrationAtPosition}`);
			// We don't have references function for narrations yet,
			// but could be added in the future
		}

		logger.debug(`Found ${references.length} references at the current position`);
		return references;
	}

	/**
	 * 移除重复的引用位置
	 * 通过URI和范围（起始行列和结束行列）进行去重
	 */
	private removeDuplicateReferences(references: lsp.Location[]): lsp.Location[] {
		// TODO: 移除重复的引用位置
		return references;
		// 使用一个Set来跟踪已经添加的引用的唯一标识符
		const uniqueRefSet = new Set<string>();
		const uniqueReferences: lsp.Location[] = [];

		for (const ref of references) {
			// 创建引用的唯一标识符：URI + 起始位置 + 结束位置
			const refKey =
				`${ref.uri}|${ref.range.start.line},${ref.range.start.character}|${ref.range.end.line},${ref.range.end.character}`;

			// 只有当这个标识符之前没见过时才添加
			if (!uniqueRefSet.has(refKey)) {
				uniqueRefSet.add(refKey);
				uniqueReferences.push(ref);
			}
		}

		return uniqueReferences;
	}

	/**
	 * Find all references to a specific account
	 */
	private async findAccountReferences(accountName: string): Promise<lsp.Location[]> {
		const references: lsp.Location[] = [];

		// Find all account usages
		const accountUsages = await this.symbolIndex.findAsync({
			_symType: 'account_usage',
			name: accountName,
		}) as SymbolInfo[];

		// Convert to LSP Locations
		accountUsages.forEach(ref => {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		});

		logger.debug(`Found ${references.length} references to account: ${accountName}`);
		return references;
	}

	/**
	 * Find all references to a specific commodity
	 */
	private async findCommodityReferences(commodityName: string): Promise<lsp.Location[]> {
		const references: lsp.Location[] = [];

		// Find all commodity usages
		const commodityUsages = await this.symbolIndex.findAsync({
			_symType: 'commodity',
			name: commodityName,
		}) as SymbolInfo[];

		// Convert to LSP Locations
		commodityUsages.forEach(ref => {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		});

		logger.debug(`Found ${references.length} references to commodity: ${commodityName}`);
		return references;
	}

	/**
	 * Find all references to a specific tag
	 */
	private async findTagReferences(tagName: string): Promise<lsp.Location[]> {
		const references: lsp.Location[] = [];

		// Find all tag usages
		const tagReferences = await this.symbolIndex.findAsync({
			_symType: 'tag',
			name: tagName,
		}) as SymbolInfo[];

		// Convert to LSP Locations
		tagReferences.forEach(ref => {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		});

		logger.debug(`Found ${references.length} references to tag: ${tagName}`);
		return references;
	}

	/**
	 * Find all references to a specific payee
	 */
	private async findPayeeReferences(payeeName: string): Promise<lsp.Location[]> {
		const references: lsp.Location[] = [];

		// Find all payee usages
		const payeeReferences = await this.symbolIndex.findAsync({
			_symType: 'payee',
			name: payeeName,
		}) as SymbolInfo[];

		// Convert to LSP Locations
		payeeReferences.forEach(ref => {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		});

		logger.debug(`Found ${references.length} references to payee: ${payeeName}`);
		return references;
	}

	/**
	 * Find all poptag references to a specific pushtag
	 */
	private async findPushTagReferences(tagName: string): Promise<lsp.Location[]> {
		const references: lsp.Location[] = [];

		// Find all poptag usages for this tag
		const tagReferences = await this.symbolIndex.findAsync({
			_symType: 'poptag',
			name: tagName,
		}) as SymbolInfo[];

		// Convert to LSP Locations
		tagReferences.forEach(ref => {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		});

		logger.debug(`Found ${references.length} poptag references to pushtag: ${tagName}`);
		return references;
	}

	/**
	 * Find all pushtag references to a specific poptag
	 */
	private async findPopTagReferences(tagName: string): Promise<lsp.Location[]> {
		const references: lsp.Location[] = [];

		// Find all pushtag usages for this tag
		const tagReferences = await this.symbolIndex.findAsync({
			_symType: 'pushtag',
			name: tagName,
		}) as SymbolInfo[];

		// Convert to LSP Locations
		tagReferences.forEach(ref => {
			references.push({
				uri: ref._uri,
				range: getRange(ref),
			});
		});

		logger.debug(`Found ${references.length} pushtag references to poptag: ${tagName}`);
		return references;
	}
}
