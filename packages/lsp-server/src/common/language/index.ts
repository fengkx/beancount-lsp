import type * as Parser from "web-tree-sitter";
import { getParser } from "@bean-lsp/shared";

import account from "./queries/account.scm";
import currency from "./queries/currency.scm";
import date from "./queries/date.scm";
import txn from "./queries/txn.scm";
import narration from "./queries/narration.scm";
import number from "./queries/number.scm";
import payee from "./queries/payee.scm";
import keyword from './queries/keyword.scm'
import string from './queries/string.scm'
import tag from './queries/tag.scm';
import link from './queries/link.scm';
import kv_key from './queries/kv_key.scm'
import bool from './queries/bool.scm'
import comment from './queries/comment.scm'

import folding from "./queries/folding.scm";

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
    folding
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


    async captures(rootNode: Parser.SyntaxNode, startPosition?: Parser.Point, endPosition?: Parser.Point) {
        const parser = await getParser()
        return parser.getLanguage().query(this.query!).captures(rootNode, startPosition, endPosition)
    }


    static async matches(query: string, rootNode: Parser.SyntaxNode, startPosition?: Parser.Point, endPosition?: Parser.Point) {
        const parser = await getParser();
        return parser.getLanguage().query(query).matches(rootNode, startPosition, endPosition)
    }

}

