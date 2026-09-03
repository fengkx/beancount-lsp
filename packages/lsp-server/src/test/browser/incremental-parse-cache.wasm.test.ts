import { createFileTree, installBeancount } from 'beancount-wasm/runtime';
// eslint-disable-next-line import-x/no-nodejs-modules
import { readFile } from 'node:fs/promises';
import { loadPyodide, type PyodideInterface } from 'pyodide';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

type BeancountVersion = 'v2' | 'v3';

interface BeancheckResult {
	errors: Array<{ file: string; line: number; message: string }>;
	general: {
		accounts?: Record<string, { balance: string[] }>;
		tags?: string[];
	};
}

interface CacheStats {
	entries: number;
	hits: number;
	misses: number;
}

interface PyProxy {
	toJs: (options?: { dict_converter?: typeof Object.fromEntries }) => unknown;
	destroy: () => void;
}

interface InterpolatedPostingAmount {
	number: string;
	currency: string;
}

const WORK_ROOT = '/work';
const MAIN_FILE = `${WORK_ROOT}/main.bean`;
const EXTRA_PYTHON_PACKAGES = ['fava-plugins', 'fengkx-beancount-plugins'];
const runIntegration = process.env['BEANCOUNT_WASM_PARSE_INTEGRATION'] === '1';

const initialAccounts = String.raw`2000-01-01 open Assets:Cash
  non_negative_from: 2000-01-01
2000-01-01 open Equity:Opening-Balances
`;

const accountsWithNewAccount = String.raw`2000-01-01 open Assets:Cash
  non_negative_from: 2000-01-01
2000-01-01 open Equity:Opening-Balances
2000-01-01 open Expenses:Food
2000-01-01 open Expenses:Government
2000-01-01 open Income:Salary

2001-01-02 * "Lunch"
  Expenses:Food 5 USD
  Assets:Cash -5 USD
`;

const firstTransaction = String.raw`2001-01-01 * "Opening"
  Assets:Cash 1 USD
  Equity:Opening-Balances -1 USD
`;

const secondTransaction = String.raw`2001-01-03 * "Salary"
  Income:Salary -100 USD
  Expenses:Government 20 USD
  Assets:Cash 80 USD
`;

function mainFile(plugin = false): string {
	return [
		'include "accounts.bean"',
		'include "entries/*.bean"',
		...(plugin
			? [
				"plugin \"fava_plugins.split_income\" \"{'income': 'Income:Salary', 'net_income': 'Income:Net', 'taxes': 'Expenses:Government', 'tag': 'pretax'}\"",
				'plugin "fengkx_beancount_plugins.check_non_negative"',
			]
			: []),
		'',
	].join('\n');
}

function normalize(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(normalize).sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
	}
	if (value != null && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value)
				.sort(([left], [right]) => left.localeCompare(right))
				.map(([key, nested]) => [key, normalize(nested)]),
		);
	}
	return value;
}

function convertProxy<T>(proxy: unknown): T {
	const pyProxy = proxy as PyProxy;
	try {
		return pyProxy.toJs({ dict_converter: Object.fromEntries }) as T;
	} finally {
		pyProxy.destroy();
	}
}

async function loadBeancheckRuntime(
	version: BeancountVersion,
	pythonPackages: string[] = [],
): Promise<PyodideInterface> {
	const pyodide = await loadPyodide();
	await installBeancount(pyodide, {
		version,
		inline: 'only',
		pythonPackages,
	});

	const beancheckCode = await readFile(new URL('../../node/beancheck.py', import.meta.url), 'utf8');
	pyodide.globals['set']('beancheck_code', beancheckCode);
	await pyodide.runPythonAsync(String.raw`
beancheck_namespace = {"__name__": "beancheck_wasm_test"}
exec(beancheck_code, beancheck_namespace)
beancheck_namespace["loader"].initialize(False)
beancheck_namespace["install_incremental_parse_cache"]("/work")

exec(r'''
def run_beancheck_uncached_for_test(file, mode="full"):
    cached_parse_file = beancount_parser.parse_file
    beancount_parser.parse_file = _incremental_parse_cache_original
    try:
        return run_beancheck(file, mode=mode)
    finally:
        beancount_parser.parse_file = cached_parse_file
''', beancheck_namespace)
`);
	pyodide.globals['delete']('beancheck_code');
	return pyodide;
}

async function runBeancheck(
	pyodide: PyodideInterface,
	mode: 'full' | 'diagnostics',
	uncached: boolean,
): Promise<BeancheckResult> {
	pyodide.globals['set']('beancheck_mode', mode);
	const functionName = uncached ? 'run_beancheck_uncached_for_test' : 'run_beancheck';
	const result = await pyodide.runPythonAsync(
		`beancheck_namespace["${functionName}"]("${MAIN_FILE}", mode=beancheck_mode)`,
	);
	pyodide.globals['delete']('beancheck_mode');
	return convertProxy<BeancheckResult>(result);
}

function getCacheStats(pyodide: PyodideInterface): CacheStats {
	return convertProxy<CacheStats>(
		pyodide.runPython('beancheck_namespace["get_incremental_parse_cache_stats"]()'),
	);
}

function clearCache(pyodide: PyodideInterface): void {
	pyodide.runPython('beancheck_namespace["clear_incremental_parse_cache"]()');
}

async function invalidate(pyodide: PyodideInterface, names: string[]): Promise<void> {
	pyodide.globals['set']('changed_names', names);
	await pyodide.runPythonAsync(String.raw`
beancheck_namespace["invalidate_incremental_parse_cache"](
    ["/work/" + str(name).lstrip("/") for name in changed_names]
)
`);
	pyodide.globals['delete']('changed_names');
}

async function interpolateIncompletePosting(
	pyodide: PyodideInterface,
	targetFile: string,
	transactionLine: number,
	postingLine: number,
	account: string,
): Promise<InterpolatedPostingAmount | null> {
	pyodide.globals['set']('target_file', targetFile);
	pyodide.globals['set']('transaction_line', transactionLine);
	pyodide.globals['set']('posting_line', postingLine);
	pyodide.globals['set']('posting_account', account);
	const result = await pyodide.runPythonAsync(String.raw`
beancheck_namespace["interpolate_incomplete_posting"](
    "/work/main.bean",
    target_file,
    transaction_line,
    posting_line,
    posting_account,
)
`);
	pyodide.globals['delete']('target_file');
	pyodide.globals['delete']('transaction_line');
	pyodide.globals['delete']('posting_line');
	pyodide.globals['delete']('posting_account');
	if (result == null) {
		return null;
	}
	return convertProxy<InterpolatedPostingAmount>(result);
}

describe.runIf(runIntegration)('incremental parse cache in Beancount WASM', () => {
	describe('Beancount v3', () => {
		let pyodide: PyodideInterface;
		let files: ReturnType<typeof createFileTree>;

		beforeAll(async () => {
			pyodide = await loadBeancheckRuntime('v3', EXTRA_PYTHON_PACKAGES);
			files = createFileTree(pyodide, { root: WORK_ROOT });
		}, 30_000);

		beforeEach(() => {
			files.reset([]);
			clearCache(pyodide);
		});

		it('locates synthetic check_commodity errors at the first real occurrence', async () => {
			files.reset([
				{
					name: 'main.bean',
					content: [
						'include "accounts.bean"',
						'include "entries/trade.bean"',
						'plugin "beancount.plugins.check_commodity"',
						'',
					].join('\n'),
				},
				{
					name: 'accounts.bean',
					content: [
						'2000-01-01 commodity USD',
						'2000-01-01 open Assets:Broker',
						'2000-01-01 open Assets:Cash USD',
						'',
					].join('\n'),
				},
				{
					name: 'entries/trade.bean',
					content: [
						'2001-01-01 * "Buy"',
						'  Assets:Broker 1 BRK {503.58 USD}',
						'  Assets:Cash -503.58 USD',
						'',
					].join('\n'),
				},
			]);

			const result = await runBeancheck(pyodide, 'diagnostics', false);
			const diagnostic = result.errors.find(error => error.message.includes("Commodity directive for 'BRK'"));

			expect(diagnostic).toMatchObject({
				file: '/work/entries/trade.bean',
				line: 2,
			});
		});

		it('matches a clean parse through account, include, plugin, error, and removal changes', async () => {
			files.reset([
				{ name: 'main.bean', content: mainFile() },
				{ name: 'accounts.bean', content: initialAccounts },
				{ name: 'entries/first.bean', content: firstTransaction },
			]);

			const check = async (
				label: string,
				expectedDelta: Pick<CacheStats, 'hits' | 'misses'>,
				mode: 'full' | 'diagnostics' = 'full',
			): Promise<BeancheckResult> => {
				const before = getCacheStats(pyodide);
				const incremental = await runBeancheck(pyodide, mode, false);
				const after = getCacheStats(pyodide);
				const uncached = await runBeancheck(pyodide, mode, true);

				expect(normalize(incremental), label).toEqual(normalize(uncached));
				expect({
					hits: after.hits - before.hits,
					misses: after.misses - before.misses,
				}, `${label} cache delta`).toEqual(expectedDelta);
				return incremental;
			};

			const initial = await check('initial load', { hits: 0, misses: 3 });
			expect(initial.general.accounts?.['Assets:Cash']?.balance).toEqual(['1 USD']);
			await check('diagnostics queue reuses the full queue parse', { hits: 3, misses: 0 }, 'diagnostics');
			await check('unchanged full evaluation', { hits: 3, misses: 0 });

			files.update([{ name: 'accounts.bean', content: accountsWithNewAccount }]);
			await invalidate(pyodide, ['accounts.bean']);
			const accountAdded = await check('add an account in one file', { hits: 2, misses: 1 });
			expect(accountAdded.general.accounts?.['Expenses:Food']?.balance).toEqual(['5 USD']);

			files.update([{ name: 'entries/second.bean', content: secondTransaction }]);
			await invalidate(pyodide, ['entries/second.bean']);
			const includeAdded = await check('add a file matched by a cached glob include', { hits: 3, misses: 1 });
			expect(includeAdded.general.accounts?.['Assets:Cash']?.balance).toEqual(['76 USD']);

			files.update([{ name: 'main.bean', content: mainFile(true) }]);
			await invalidate(pyodide, ['main.bean']);
			const pluginAdded = await check('add a plugin', { hits: 3, misses: 1 });
			expect(pluginAdded.general.accounts?.['Income:Net']).toBeDefined();
			expect(pluginAdded.general.tags).toContain('pretax');
			expect(pluginAdded.errors.some(error => error.message.toLowerCase().includes('negative'))).toBe(true);

			const pluginRepeated = await check('fava plugin mutations do not leak into cached parse results', {
				hits: 4,
				misses: 0,
			});
			expect(pluginRepeated.general.accounts?.['Income:Net']).toBeDefined();
			expect(pluginRepeated.general.tags).toContain('pretax');

			files.update([{ name: 'entries/first.bean', content: 'this is not valid beancount\n' }]);
			await invalidate(pyodide, ['entries/first.bean']);
			const broken = await check('introduce a syntax error in one file', { hits: 3, misses: 1 }, 'diagnostics');
			expect(broken.errors.length).toBeGreaterThan(0);

			files.update([{ name: 'entries/first.bean', content: firstTransaction }]);
			await invalidate(pyodide, ['entries/first.bean']);
			const fixed = await check('fix the syntax error', { hits: 3, misses: 1 });
			expect(fixed.errors).toHaveLength(1);
			expect(fixed.errors[0]?.message.toLowerCase()).toContain('negative');

			files.remove(['entries/second.bean']);
			await invalidate(pyodide, ['entries/second.bean']);
			const removed = await check('remove an included file', { hits: 3, misses: 0 });
			expect(removed.general.accounts?.['Income:Net']).toBeUndefined();
			expect(removed.general.tags).not.toContain('pretax');
			expect(getCacheStats(pyodide).entries).toBe(3);
		});

		it('returns isolated entries, postings, errors, and options on cache hits', async () => {
			files.reset([
				{
					name: 'valid.bean',
					content: String.raw`2000-01-01 open Assets:Cash
2000-01-01 open Equity:Opening-Balances
2001-01-01 * "Opening"
  transaction_meta: "original"
  Assets:Cash 1 USD
    posting_meta: "original"
  Equity:Opening-Balances -1 USD
`,
				},
				{ name: 'invalid.bean', content: 'this is not valid beancount\n' },
			]);

			const result = convertProxy<{
				entryFilename: string;
				entryMetadata: string;
				postingLine: number;
				postingMetadata: string;
				includesPoisoned: boolean;
				errorLine: number;
			}>(
				await pyodide.runPythonAsync(String.raw`
parse_file = beancheck_namespace["beancount_parser"].parse_file

entries, _, options = parse_file("/work/valid.bean")
transaction = next(entry for entry in entries if hasattr(entry, "postings"))
transaction.meta["filename"] = "poisoned.bean"
transaction.meta["transaction_meta"] = "poisoned"
transaction.postings[0].meta["lineno"] = 999
transaction.postings[0].meta["posting_meta"] = "poisoned"
options["include"].append("/poisoned.bean")

entries_again, _, options_again = parse_file("/work/valid.bean")
transaction_again = next(entry for entry in entries_again if hasattr(entry, "postings"))

_, errors, _ = parse_file("/work/invalid.bean")
errors[0].source["lineno"] = 999
_, errors_again, _ = parse_file("/work/invalid.bean")

{
    "entryFilename": transaction_again.meta["filename"],
    "entryMetadata": transaction_again.meta["transaction_meta"],
    "postingLine": transaction_again.postings[0].meta["lineno"],
    "postingMetadata": transaction_again.postings[0].meta["posting_meta"],
    "includesPoisoned": "/poisoned.bean" in options_again["include"],
    "errorLine": errors_again[0].source["lineno"],
}
`),
			);

			expect(result).toEqual({
				entryFilename: '/work/valid.bean',
				entryMetadata: 'original',
				postingLine: 5,
				postingMetadata: 'original',
				includesPoisoned: false,
				errorLine: 1,
			});
			expect(getCacheStats(pyodide)).toEqual({ entries: 2, hits: 2, misses: 2 });
		});

		it('limits cache keys to eligible workspace parser calls', async () => {
			files.reset([{
				name: 'main.bean',
				content: '2000-01-01 open Assets:Cash\n',
			}]);
			pyodide.FS.writeFile('/outside.bean', '2000-01-01 open Assets:Outside\n');

			const result = convertProxy<{
				beforeInvalidation: CacheStats;
				afterInvalidation: CacheStats;
				afterReparse: CacheStats;
				afterUnknownInvalidation: CacheStats;
				reportedFilename: string;
			}>(
				await pyodide.runPythonAsync(String.raw`
from pathlib import Path

parse_file = beancheck_namespace["beancount_parser"].parse_file
parse_file("/work/main.bean")
parse_file(Path("/work/main.bean"))
parse_file("/work/main.bean", encoding="utf-8")
parse_file("/work/main.bean", encoding="utf-8")

reported_entries, _, _ = parse_file(
    "/work/main.bean",
    report_filename="reported.bean",
)
with open("/work/main.bean", "rb") as file_object:
    parse_file(file_object)
parse_file("/outside.bean")
parse_file("/outside.bean")

before_invalidation = beancheck_namespace["get_incremental_parse_cache_stats"]()
beancheck_namespace["invalidate_incremental_parse_cache"](["/work/main.bean"])
after_invalidation = beancheck_namespace["get_incremental_parse_cache_stats"]()
parse_file("/work/main.bean")
after_reparse = beancheck_namespace["get_incremental_parse_cache_stats"]()
beancheck_namespace["invalidate_incremental_parse_cache"](["/work/missing.bean"])

{
    "beforeInvalidation": before_invalidation,
    "afterInvalidation": after_invalidation,
    "afterReparse": after_reparse,
    "afterUnknownInvalidation": beancheck_namespace["get_incremental_parse_cache_stats"](),
    "reportedFilename": reported_entries[0].meta["filename"],
}
`),
			);

			expect(result).toEqual({
				beforeInvalidation: { entries: 2, hits: 2, misses: 2 },
				afterInvalidation: { entries: 0, hits: 2, misses: 2 },
				afterReparse: { entries: 1, hits: 2, misses: 3 },
				afterUnknownInvalidation: { entries: 1, hits: 2, misses: 3 },
				reportedFilename: 'reported.bean',
			});
		});

		it('recomputes interpolation after edits and rebuilds every entry after clear', async () => {
			const incompleteTransaction = (amount: number) =>
				String.raw`2001-01-01 * "Opening"
  Assets:Cash
  Equity:Opening-Balances -${amount} USD
`;
			files.reset([
				{ name: 'main.bean', content: 'include "accounts.bean"\ninclude "entry.bean"\n' },
				{
					name: 'accounts.bean',
					content: String.raw`2000-01-01 open Assets:Cash
2000-01-01 open Equity:Opening-Balances
`,
				},
				{ name: 'entry.bean', content: incompleteTransaction(5) },
			]);

			expect(
				await interpolateIncompletePosting(pyodide, '/work/entry.bean', 1, 2, 'Assets:Cash'),
			).toEqual({ number: '5', currency: 'USD' });
			expect(getCacheStats(pyodide)).toEqual({ entries: 3, hits: 0, misses: 3 });

			expect(
				await interpolateIncompletePosting(pyodide, '/work/entry.bean', 1, 2, 'Assets:Cash'),
			).toEqual({ number: '5', currency: 'USD' });
			expect(getCacheStats(pyodide)).toEqual({ entries: 3, hits: 3, misses: 3 });

			files.update([{ name: 'entry.bean', content: incompleteTransaction(7) }]);
			await invalidate(pyodide, ['entry.bean']);
			expect(
				await interpolateIncompletePosting(pyodide, '/work/entry.bean', 1, 2, 'Assets:Cash'),
			).toEqual({ number: '7', currency: 'USD' });
			expect(getCacheStats(pyodide)).toEqual({ entries: 3, hits: 5, misses: 4 });

			clearCache(pyodide);
			expect(
				await interpolateIncompletePosting(pyodide, '/work/entry.bean', 1, 2, 'Assets:Cash'),
			).toEqual({ number: '7', currency: 'USD' });
			expect(getCacheStats(pyodide)).toEqual({ entries: 3, hits: 0, misses: 3 });
		});
	});

	it('supports precise invalidation and full cache clearing in Beancount v2', async () => {
		const pyodide = await loadBeancheckRuntime('v2');
		const files = createFileTree(pyodide, { root: WORK_ROOT });
		const transaction = (amount: number) =>
			String.raw`2001-01-01 * "Opening"
  Assets:Cash ${amount} USD
  Equity:Opening-Balances -${amount} USD
`;
		files.reset([
			{ name: 'main.bean', content: 'include "accounts.bean"\ninclude "entry.bean"\n' },
			{
				name: 'accounts.bean',
				content: String.raw`2000-01-01 open Assets:Cash
2000-01-01 open Equity:Opening-Balances
`,
			},
			{ name: 'entry.bean', content: transaction(1) },
		]);

		const initial = await runBeancheck(pyodide, 'full', false);
		expect(initial.general.accounts?.['Assets:Cash']?.balance).toEqual(['1 USD']);
		expect(getCacheStats(pyodide)).toEqual({ entries: 3, hits: 0, misses: 3 });

		files.update([{ name: 'entry.bean', content: transaction(2) }]);
		await invalidate(pyodide, ['entry.bean']);
		const edited = await runBeancheck(pyodide, 'full', false);
		expect(edited.general.accounts?.['Assets:Cash']?.balance).toEqual(['2 USD']);
		expect(getCacheStats(pyodide)).toEqual({ entries: 3, hits: 2, misses: 4 });

		clearCache(pyodide);
		const rebuilt = await runBeancheck(pyodide, 'full', false);
		expect(rebuilt.general.accounts?.['Assets:Cash']?.balance).toEqual(['2 USD']);
		expect(getCacheStats(pyodide)).toEqual({ entries: 3, hits: 0, misses: 3 });
	}, 30_000);
});
