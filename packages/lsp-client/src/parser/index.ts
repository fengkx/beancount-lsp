// @ts-nocheck
import WebTreeSitter from "web-tree-sitter";
import Bean from "tree-sitter-beancount/tree-sitter-beancount.wasm";


let parser: WebTreeSitter;

export const getParser = async () => {
    if (parser) return parser;
    await WebTreeSitter.init({
        locateFile(scriptName) {
            return require.resolve(`web-tree-sitter/${scriptName}`)
        }
    })
    parser = new WebTreeSitter();
    const Beancount = await WebTreeSitter.Language.load(
        Bean
    );
    parser.setLanguage(Beancount);
    return parser;

}