export const LANGUAGE_ID = 'beancount'

const Tuple = <T extends unknown[]>(arr: readonly [...T]): T => arr as T

export const TOKEN_TYPES = Tuple([
    "keyword",
    "comment",
    "string",
    "number",
    "operator",
    "enum",
    "account",
    "date",
    "currency",
    "tag",
    "link",
    "kv_key",
    "bool"
] as const);
// aaa
export const tokenTypeToIndex = (tokenType: TokenTypes): number => {
    return TOKEN_TYPES.findIndex(item => item === tokenType);
}


export const TOKEN_MODIFIERS = Tuple(["default", "definition", "deprecated", "documentation", "declaration"] as const)

export type TokenTypes = (typeof TOKEN_TYPES)[number]