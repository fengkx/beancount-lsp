import type * as Parser from "web-tree-sitter";
import { getParser } from "@bean-lsp/shared";

import account from "./account.scm";
import currency from "./currency.scm";
import date from "./date.scm";
import txn from "./txn.scm";
import narration from "./narration.scm";
import number from "./number.scm";
import payee from "./payee.scm";
import keyword from './keyword.scm'
import string from './string.scm'
import tag from './tag.scm';
import link from './link.scm';
import kv_key from './kv_key.scm'
import bool from './bool.scm'
import comment from './comment.scm'

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
    comment
} as const

type BeanTokenName = keyof typeof queryMap

const map = new Map<BeanTokenName, TreeQuery>();

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
        return new TreeQuery(name)
    }

    async matches(rootNode: Parser.SyntaxNode, startPosition?: Parser.Point, endPosition?: Parser.Point) {
        const parser = await getParser()
        return parser.getLanguage().query(this.query!).matches(rootNode, startPosition, endPosition)
    }

    static async matches(query: string, rootNode: Parser.SyntaxNode, startPosition?: Parser.Point, endPosition?: Parser.Point) {
        const parser = await getParser();
        return parser.getLanguage().query(query).matches(rootNode, startPosition, endPosition)
    }

}

