"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_MODIFIERS = exports.tokenTypeToIndex = exports.TOKEN_TYPES = exports.LANGUAGE_ID = void 0;
exports.LANGUAGE_ID = 'beancount';
const Tuple = (arr) => arr;
exports.TOKEN_TYPES = Tuple([
    "keyword",
    "comment",
    "string",
    "number",
    "operator",
    "enum",
    "account",
    "date",
    "currency"
]);
const tokenTypeToIndex = (tokenType) => {
    return exports.TOKEN_TYPES.findIndex(item => item === tokenType);
};
exports.tokenTypeToIndex = tokenTypeToIndex;
exports.TOKEN_MODIFIERS = Tuple(["default", "definition", "deprecated", "documentation", "declaration"]);
//# sourceMappingURL=language.js.map