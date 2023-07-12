import Parser from 'web-tree-sitter';

declare const LANGUAGE_ID = "beancount";
declare const TOKEN_TYPES: ["keyword", "comment", "string", "number", "operator", "enum", "account", "date", "currency"];
declare const tokenTypeToIndex: (tokenType: TokenTypes) => number;
declare const TOKEN_MODIFIERS: ["default", "definition", "deprecated", "documentation", "declaration"];
type TokenTypes = (typeof TOKEN_TYPES)[number];

declare const getParser: () => Promise<Parser>;

export { LANGUAGE_ID, TOKEN_MODIFIERS, TOKEN_TYPES, TokenTypes, getParser, tokenTypeToIndex };
