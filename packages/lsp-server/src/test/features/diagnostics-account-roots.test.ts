import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { CancellationToken, type Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import Parser, { type Tree } from 'web-tree-sitter';

vi.mock('@bean-lsp/shared', () => ({
	Logger: class {
		debug() {}
		info() {}
		warn() {}
		error() {}
	},
}));

vi.mock('../../common/language', () => ({
	TreeQuery: {},
}));

import { asLspRange } from '../../common/common';
import { DiagnosticsFeature } from '../../common/features/diagnostics';
import { BeancountOptionsManager } from '../../common/utils/beancount-options';

let parser: Parser;
let language: Parser.Language;

beforeAll(async () => {
	await Parser.init({
		wasmBinary: readFileSync(
			fileURLToPath(new URL('../../../node_modules/web-tree-sitter/tree-sitter.wasm', import.meta.url)),
		),
	});
	language = await Parser.Language.load(
		fileURLToPath(new URL('../../../../tree-sitter-beancount/tree-sitter-beancount.wasm', import.meta.url)),
	);
	parser = new Parser();
	parser.setLanguage(language);
});

type DiagnosticsInternals = {
	validateAccountRoots(
		tree: Tree,
		diagnostics: Diagnostic[],
		token: CancellationToken,
		scopeUri: string,
	): Promise<void>;
};

function legacyDiagnostics(tree: Tree): Diagnostic[] {
	const query = language.query('(account) @account');
	try {
		const seenAccounts = new Set<string>();
		const diagnostics: Diagnostic[] = [];
		for (const { node } of query.captures(tree.rootNode)) {
			const accountName = node.text;
			if (seenAccounts.has(accountName)) continue;
			seenAccounts.add(accountName);
			const root = accountName.split(':')[0];
			if (root && !['Assets', 'Liabilities', 'Equity', 'Income', 'Expenses'].includes(root)) {
				diagnostics.push({
					severity: DiagnosticSeverity.Error,
					range: asLspRange(node),
					message:
						`Invalid root account name "${root}". Valid root account names: Assets, Equity, Expenses, Income, Liabilities`,
					source: 'beancount-lsp (lsp)',
					code: 'invalid-root-account',
				});
			}
		}
		return diagnostics;
	} finally {
		query.delete();
	}
}

const baseText = [
	'2000-01-01 open Assets:Cash USD',
	'2000-01-01 open Wallet:Cash USD',
	'2000-01-02 * "午餐 🥟"',
	'  Wallet:Cash  -1 USD',
	'  Budget:Food  1 USD',
	'2000-01-03 pad Wallet:Cash Equity:Opening-Balances',
].join('\n');

describe('account root diagnostic traversal equivalence', () => {
	it('matches query capture behavior across incomplete editing states', async () => {
		const states = [
			baseText,
			baseText.replaceAll('\n', '\r\n'),
			baseText.replace('Wallet:Cash USD', 'Wallet:'),
			baseText.replace('Budget:Food  1 USD', 'Budget:Fo'),
			`${baseText.slice(0, 115)}x${baseText.slice(115)}`,
		];

		for (const [version, text] of states.entries()) {
			const tree = parser.parse(text);
			const feature = new DiagnosticsFeature(
				{} as never,
				{} as never,
				new BeancountOptionsManager(),
				undefined,
			) as unknown as DiagnosticsInternals;
			const actual: Diagnostic[] = [];

			await feature.validateAccountRoots(
				tree,
				actual,
				CancellationToken.None,
				`file:///accounts-${version}.bean`,
			);

			expect(actual, `editing state ${version}`).toEqual(legacyDiagnostics(tree));
			tree.delete();
		}
	});
});
