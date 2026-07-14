import type Parser from 'web-tree-sitter';

type NodesByType = ReadonlyMap<string, readonly Parser.SyntaxNode[]>;

const nodesByTree = new WeakMap<Parser.Tree, NodesByType>();
const emptyNodes: readonly Parser.SyntaxNode[] = [];

function buildNodesByType(tree: Parser.Tree): NodesByType {
	const nodesByType = new Map<string, Parser.SyntaxNode[]>();
	function add(node: Parser.SyntaxNode) {
		const nodes = nodesByType.get(node.type);
		if (nodes) nodes.push(node);
		else nodesByType.set(node.type, [node]);

		// Complete directives are direct children of the file. Tree-sitter queries
		// can also find recovered directives nested below ERROR nodes, so only walk
		// that exceptional path.
		if (node.type === 'ERROR') {
			for (const child of node.namedChildren) add(child);
		}
	}

	for (const node of tree.rootNode.namedChildren) add(node);
	return nodesByType;
}

export function getRecoverableTopLevelNodes(
	tree: Parser.Tree,
	type: string,
): readonly Parser.SyntaxNode[] {
	let nodesByType = nodesByTree.get(tree);
	if (!nodesByType) {
		nodesByType = buildNodesByType(tree);
		nodesByTree.set(tree, nodesByType);
	}
	return nodesByType.get(type) ?? emptyNodes;
}
