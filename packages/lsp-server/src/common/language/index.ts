import { getParser } from '@bean-lsp/shared';
import type * as Parser from 'web-tree-sitter';
import { LRUCache } from 'mnemonist';

import account from './queries/account.scm';
import balance from './queries/balance.scm';
import bool from './queries/bool.scm';
import close from './queries/close.scm';
import comment from './queries/comment.scm';
import currency from './queries/currency.scm';
import custom from './queries/custom.scm';
import date from './queries/date.scm';
import document from './queries/document.scm';
import event from './queries/event.scm';
import include from './queries/include.scm';
import keyword from './queries/keyword.scm';
import kv_key from './queries/kv_key.scm';
import link from './queries/link.scm';
import narration from './queries/narration.scm';
import note from './queries/note.scm';
import number from './queries/number.scm';
import option from './queries/option.scm';
import pad from './queries/pad.scm';
import payee from './queries/payee.scm';
import poptag from './queries/poptag.scm';
import price from './queries/price.scm';
import pushtag from './queries/pushtag.scm';
import query from './queries/query.scm';
import string from './queries/string.scm';
import tag from './queries/tag.scm';
import transaction from './queries/transaction.scm';
import txn from './queries/txn.scm';

import folding from './queries/folding.scm';

import account_definition from './queries/account_definition.scm';
import account_usage from './queries/account_usage.scm';
import currency_definition from './queries/currency_definition.scm';

const queryMap = {
	account,
	balance,
	bool,
	close,
	comment,
	currency,
	custom,
	date,
	document,
	event,
	folding,
	include,
	keyword,
	kv_key,
	link,
	narration,
	note,
	number,
	option,
	pad,
	payee,
	poptag,
	price,
	pushtag,
	query,
	string,
	tag,
	transaction,
	txn,
	account_definition,
	account_usage,
	currency_definition,
} as const;

type BeanTokenName = keyof typeof queryMap;

const map = new Map<BeanTokenName, TreeQuery>();

// Helper function to create a cache key for captures
function createCapturesKey(
	nodeId: number,
	startPosition?: Parser.Point,
	endPosition?: Parser.Point
): string {
	const start = startPosition ? `${startPosition.row}:${startPosition.column}` : 'none';
	const end = endPosition ? `${endPosition.row}:${endPosition.column}` : 'none';
	return `${nodeId}:${start}:${end}`;
}

export class TreeQuery {
	query: string | undefined;
	private readonly _capturesCache = new LRUCache<string, Parser.QueryCapture[]>(50);

	constructor(public name: BeanTokenName) {
		const r = map.get(name);
		if (r) {
			return r;
		}
		const query = queryMap[name];
		this.query = query;
		map.set(this.name, this);
	}

	static getQueryByTokenName(name: BeanTokenName): TreeQuery {
		return new TreeQuery(name);
	}

	async matches(
		rootNode: Parser.SyntaxNode,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	): Promise<Parser.QueryMatch[]> {
		// Use the module-level WASM path
		const parser = await getParser();
		return parser.getLanguage().query(this.query!).matches(rootNode, startPosition, endPosition);
	}

	async captures(
		rootNode: Parser.SyntaxNode,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	): Promise<Parser.QueryCapture[]> {
		// Create cache key using node ID
		const cacheKey = createCapturesKey(rootNode.id, startPosition, endPosition);

		// Check cache first
		const cached = this._capturesCache.get(cacheKey);
		if (cached) {
			return cached;
		}

		// Use the module-level WASM path
		const parser = await getParser();
		const result = parser.getLanguage().query(this.query!).captures(rootNode, startPosition, endPosition);

		// Cache the result
		this._capturesCache.set(cacheKey, result);

		return result;
	}

	static async matches(
		query: string,
		rootNode: Parser.SyntaxNode,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	): Promise<Parser.QueryMatch[]> {
		// Use the module-level WASM path
		const parser = await getParser();
		return parser.getLanguage().query(query).matches(rootNode, startPosition, endPosition);
	}

	static async captures(
		query: string,
		rootNode: Parser.SyntaxNode,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	): Promise<Parser.QueryCapture[]> {
		// Static method doesn't have instance cache, so we execute directly
		const parser = await getParser();
		return parser.getLanguage().query(query).captures(rootNode, startPosition, endPosition);
	}
}
