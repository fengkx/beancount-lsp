import type Parser from 'web-tree-sitter';
import { TreeQuery } from '../language';

export interface TagDirective {
	type: 'pushtag' | 'poptag';
	node: Parser.SyntaxNode;
	tagNode: Parser.SyntaxNode;
	name: string;
}

export interface TagDirectiveIndex {
	get(node: Parser.SyntaxNode): TagDirective | undefined;
	getPair(node: Parser.SyntaxNode): TagDirective | undefined;
}

const indexByTree = new WeakMap<Parser.Tree, TagDirectiveIndex>();

export async function getTagDirectiveIndex(tree: Parser.Tree): Promise<TagDirectiveIndex> {
	const cached = indexByTree.get(tree);
	if (cached) {
		return cached;
	}

	const matches = await TreeQuery.getQueryByTokenName('tag_directives').matches(tree);
	const directives: TagDirective[] = [];

	for (const match of matches) {
		let type: TagDirective['type'] | undefined;
		let node: Parser.SyntaxNode | undefined;
		let tagNode: Parser.SyntaxNode | undefined;

		for (const capture of match.captures) {
			if (capture.name === 'pushtag' || capture.name === 'poptag') {
				type = capture.name;
				node = capture.node;
			} else if (capture.name === 'tag') {
				tagNode = capture.node;
			}
		}

		if (type && node && tagNode) {
			directives.push({
				type,
				node,
				tagNode,
				name: tagNode.text.startsWith('#') ? tagNode.text.substring(1) : tagNode.text,
			});
		}
	}

	directives.sort((left, right) => left.node.startIndex - right.node.startIndex);

	const directiveByStartIndex = new Map<number, TagDirective>();
	const pairByStartIndex = new Map<number, TagDirective>();
	const openByName = new Map<string, TagDirective[]>();

	for (const directive of directives) {
		directiveByStartIndex.set(directive.node.startIndex, directive);
		if (directive.type === 'pushtag') {
			const stack = openByName.get(directive.name) ?? [];
			stack.push(directive);
			openByName.set(directive.name, stack);
			continue;
		}

		const stack = openByName.get(directive.name);
		const pushtag = stack?.pop();
		if (!pushtag) {
			continue;
		}
		pairByStartIndex.set(pushtag.node.startIndex, directive);
		pairByStartIndex.set(directive.node.startIndex, pushtag);
	}

	const index: TagDirectiveIndex = {
		get: node => directiveByStartIndex.get(node.startIndex),
		getPair: node => pairByStartIndex.get(node.startIndex),
	};
	indexByTree.set(tree, index);
	return index;
}
