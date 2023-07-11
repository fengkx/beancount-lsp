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
    "currency"
] as const);

export type TokenTypes = (typeof TOKEN_TYPES)[number]