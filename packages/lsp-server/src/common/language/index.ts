import { getParser } from '@bean-lsp/shared';
import type * as Parser from 'web-tree-sitter';

import account from './queries/account.scm';
import bool from './queries/bool.scm';
import comment from './queries/comment.scm';
import currency from './queries/currency.scm';
import date from './queries/date.scm';
import keyword from './queries/keyword.scm';
import kv_key from './queries/kv_key.scm';
import link from './queries/link.scm';
import narration from './queries/narration.scm';
import number from './queries/number.scm';
import payee from './queries/payee.scm';
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
	currency,
	date,
	txn,
	narration,
	number,
	payee,
	keyword,
	string,
	link,
	tag,
	kv_key,
	bool,
	comment,
	folding,
	account_definition,
	account_usage,
	currency_definition,
	transaction,
} as const;

type BeanTokenName = keyof typeof queryMap;

const map = new Map<BeanTokenName, TreeQuery>();
// Store web-tree-sitter WASM path in a module variable that can be updated
let _webTreeSitterWasmPath: string | undefined;

// Update the web-tree-sitter WASM path
export function setWasmFilePath(path: string | undefined) {
	_webTreeSitterWasmPath = path;
}

// Get the current web-tree-sitter WASM path Don't export this function
function getWasmFilePath(): string | undefined {
	return _webTreeSitterWasmPath;
}

export class TreeQuery {
	query: string | undefined;

	constructor(public name: BeanTokenName) {
		const r = map.get(name);
		if (r) {
			return r;
		}
		const query = queryMap[name];
		this.query = query;
		map.set(this.name, this);
	}

	static getQueryByTokenName(name: BeanTokenName) {
		return new TreeQuery(name);
	}

	async matches(rootNode: Parser.SyntaxNode, startPosition?: Parser.Point, endPosition?: Parser.Point) {
		// Use the module-level WASM path
		const parser = await getParser(_webTreeSitterWasmPath);
		return parser.getLanguage().query(this.query!).matches(rootNode, startPosition, endPosition);
	}

	async captures(rootNode: Parser.SyntaxNode, startPosition?: Parser.Point, endPosition?: Parser.Point) {
		// Use the module-level WASM path
		const parser = await getParser(_webTreeSitterWasmPath);
		return parser.getLanguage().query(this.query!).captures(rootNode, startPosition, endPosition);
	}

	static async matches(
		query: string,
		rootNode: Parser.SyntaxNode,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	) {
		// Use the module-level WASM path
		const parser = await getParser(_webTreeSitterWasmPath);
		return parser.getLanguage().query(query).matches(rootNode, startPosition, endPosition);
	}
	static async captures(
		query: string,
		rootNode: Parser.SyntaxNode,
		startPosition?: Parser.Point,
		endPosition?: Parser.Point,
	) {
		// Use the module-level WASM path
		const parser = await getParser(_webTreeSitterWasmPath);
		return parser.getLanguage().query(query).captures(rootNode, startPosition, endPosition);
	}
}
