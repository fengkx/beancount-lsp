import { getParser } from '@bean-lsp/shared';
import type * as Parser from 'web-tree-sitter';

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
import transaction_detail from './queries/transaction_detail.scm';
import txn from './queries/txn.scm';

import folding from './queries/folding.scm';

import account_definition from './queries/account_definition.scm';
import account_usage from './queries/account_usage.scm';
import currency_definition from './queries/currency_definition.scm';

import semantic_tokens from './queries/semantic_tokens.scm';
import symbols from './queries/symbols.scm';

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
	transaction_detail,
	account_definition,
	account_usage,
	currency_definition,
	symbols,
	semantic_tokens,
} as const;

type BeanTokenName = keyof typeof queryMap;

const map = new Map<BeanTokenName, TreeQuery>();

export class TreeQuery {
	query: string | undefined;
	private _compiledQuery: Parser.Query | undefined;
	private readonly _matchesCacheByTree = new WeakMap<Parser.Tree, Map<string, Parser.QueryMatch[]>>();
	private readonly _capturesCacheByTree = new WeakMap<Parser.Tree, Map<string, Parser.QueryCapture[]>>();

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

	private async getCompiledQuery(): Promise<Parser.Query> {
		if (this._compiledQuery) {
			return this._compiledQuery;
		}
		const parser = await getParser();
		this._compiledQuery = parser.getLanguage().query(this.query!);
		return this._compiledQuery;
	}

	private static makeRangeKey(startPosition?: Parser.Point, endPosition?: Parser.Point): string {
		const start = startPosition ? `${startPosition.row}:${startPosition.column}` : 'none';
		const end = endPosition ? `${endPosition.row}:${endPosition.column}` : 'none';
		return `${start}:${end}`;
	}

	async matches(
		tree: Parser.Tree,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	): Promise<Parser.QueryMatch[]> {
		const key = TreeQuery.makeRangeKey(startPosition, endPosition);
		let inner = this._matchesCacheByTree.get(tree);
		if (!inner) {
			inner = new Map();
			this._matchesCacheByTree.set(tree, inner);
		}
		const cached = inner.get(key);
		if (cached) {
			return cached;
		}
		const q = await this.getCompiledQuery();
		const result = q.matches(tree.rootNode, startPosition, endPosition);
		inner.set(key, result);
		return result;
	}

	async captures(
		tree: Parser.Tree,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	): Promise<Parser.QueryCapture[]> {
		const key = TreeQuery.makeRangeKey(startPosition, endPosition);
		let inner = this._capturesCacheByTree.get(tree);
		if (!inner) {
			inner = new Map();
			this._capturesCacheByTree.set(tree, inner);
		}
		const cached = inner.get(key);
		if (cached) {
			return cached;
		}
		const q = await this.getCompiledQuery();
		const result = q.captures(tree.rootNode, startPosition, endPosition);
		inner.set(key, result);
		return result;
	}

	static async matches(
		query: string,
		tree: Parser.Tree,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	): Promise<Parser.QueryMatch[]> {
		const parser = await getParser();
		return parser.getLanguage().query(query).matches(tree.rootNode, startPosition, endPosition);
	}

	static async captures(
		query: string,
		tree: Parser.Tree,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	): Promise<Parser.QueryCapture[]> {
		const parser = await getParser();
		return parser.getLanguage().query(query).captures(tree.rootNode, startPosition, endPosition);
	}
}
