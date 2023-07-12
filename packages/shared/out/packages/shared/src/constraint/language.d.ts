export declare const LANGUAGE_ID = "beancount";
export declare const TOKEN_TYPES: ["keyword", "comment", "string", "number", "operator", "enum", "account", "date", "currency"];
export declare const tokenTypeToIndex: (tokenType: TokenTypes) => number;
export declare const TOKEN_MODIFIERS: ["default", "definition", "deprecated", "documentation", "declaration"];
export type TokenTypes = (typeof TOKEN_TYPES)[number];
