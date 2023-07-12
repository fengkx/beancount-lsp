"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParser = void 0;
const web_tree_sitter_1 = __importDefault(require("web-tree-sitter"));
const tree_sitter_beancount_wasm_1 = __importDefault(require("tree-sitter-beancount/tree-sitter-beancount.wasm"));
let parser;
const getParser = async () => {
    if (parser)
        return parser;
    await web_tree_sitter_1.default.init({
        locateFile(scriptName) {
            return require.resolve(`web-tree-sitter/${scriptName}`);
        }
    });
    parser = new web_tree_sitter_1.default();
    const Beancount = await web_tree_sitter_1.default.Language.load(tree_sitter_beancount_wasm_1.default);
    parser.setLanguage(Beancount);
    return parser;
};
exports.getParser = getParser;
//# sourceMappingURL=parser.js.map