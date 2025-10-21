import BeancountLang from 'tree-sitter-beancount/tree-sitter-beancount.wasm';
import { Language, Parser } from 'web-tree-sitter';
import TreeSitterWasm from 'web-tree-sitter/tree-sitter.wasm';

let parser: Parser | undefined;
let isInitialized = false;

export async function initializeParser() {
	if (isInitialized) return;

	await Parser.init({
		wasmBinary: TreeSitterWasm,
	});

	isInitialized = true;
}

export const getParser = async (): Promise<Parser> => {
	// Initialize the parser with the provided web-tree-sitter WASM path
	await initializeParser();

	// Return existing parser instance if available
	if (parser) return parser;

	// Create a new parser instance
	const _parser = new Parser();

	// Load the beancount language (this uses tree-sitter-beancount.wasm which is separate)
	const Beancount = await Language.load(BeancountLang);
	_parser.setLanguage(Beancount);

	parser = _parser;
	return parser;
};
