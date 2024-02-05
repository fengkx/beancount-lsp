import BeancountLang from 'tree-sitter-beancount/tree-sitter-beancount.wasm';
import Parser from 'web-tree-sitter';

let parser: Parser;
export const getParser = async () => {
	if (parser) return parser;
	await Parser.init({
		locateFile(scriptName: string) {
			return require.resolve(`web-tree-sitter/${scriptName}`);
		},
	});
	parser = new Parser();
	const Beancount = await Parser.Language.load(
		BeancountLang,
	);
	parser.setLanguage(Beancount);
	return parser;
};
