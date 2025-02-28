import BeancountLang from 'tree-sitter-beancount/tree-sitter-beancount.wasm';
import Parser from 'web-tree-sitter';

let parser: Parser | undefined;
let isInitialized = false;

// This initializes web-tree-sitter with the provided WASM file
export async function initializeParser(webTreeSitterWasmPath?: string) {
	if (isInitialized) return;

	await Parser.init({
		locateFile(scriptName: string) {
			if (webTreeSitterWasmPath && scriptName === 'tree-sitter.wasm') {
				return webTreeSitterWasmPath;
			}
			return require.resolve(`web-tree-sitter/${scriptName}`);
		},
	});

	isInitialized = true;
}

export const getParser = async (webTreeSitterWasmPath?: string) => {
	// Initialize the parser with the provided web-tree-sitter WASM path
	await initializeParser(webTreeSitterWasmPath);

	// Return existing parser instance if available
	if (parser) return parser;

	// Create a new parser instance
	parser = new Parser();

	// Load the beancount language (this uses tree-sitter-beancount.wasm which is separate)
	const Beancount = await Parser.Language.load(BeancountLang);
	parser.setLanguage(Beancount);

	return parser;
};
