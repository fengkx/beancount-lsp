import { execa } from 'execa';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { SourceSnapshot } from '../../common/ledger/snapshots';
import { ShadowWorkspace } from '../../node/shadow-workspace';

const runIntegration = process.env['BEANCOUNT_RUNTIME_INTEGRATION'] === '1';

describe.runIf(runIntegration)('Node live-buffer runtime integration', () => {
	it('evaluates unsaved included-file content from the shadow workspace', async () => {
		const rootPath = await mkdtemp(join(tmpdir(), 'bean-runtime-integration-'));
		const mainPath = join(rootPath, 'main.bean');
		const accountsPath = join(rootPath, 'accounts.bean');
		const mainUri = pathToFileURL(mainPath).toString();
		const accountsUri = pathToFileURL(accountsPath).toString();
		const balanced = [
			'2000-01-01 open Assets:Cash',
			'2000-01-01 open Equity:Opening-Balances',
			'2001-01-01 * "Opening"',
			'  Assets:Cash 1 USD',
			'  Equity:Opening-Balances -1 USD',
			'',
		].join('\n');
		const unbalanced = balanced.replace('-1 USD', '-2 USD');
		await writeFile(mainPath, 'include "accounts.bean"\n');
		await writeFile(accountsPath, balanced);
		const snapshot: SourceSnapshot = {
			contextId: 'runtime-integration',
			workspaceUri: pathToFileURL(rootPath).toString(),
			mainFileUri: mainUri,
			revision: 1,
			files: new Map([
				[mainUri, { uri: mainUri, text: 'include "accounts.bean"\n', origin: 'disk' }],
				[accountsUri, {
					uri: accountsUri,
					text: unbalanced,
					documentVersion: 2,
					origin: 'open-buffer',
				}],
			]),
			reachableUris: new Set([mainUri, accountsUri]),
			includeGraph: { edges: new Map(), unresolved: new Map() },
		};
		const shadow = new ShadowWorkspace();
		try {
			await shadow.reset(snapshot);
			const script = fileURLToPath(new URL('../../node/beancheck.py', import.meta.url));
			const { stdout } = await execa(process.env['BEANCOUNT_PYTHON'] ?? 'python3', [
				script,
				shadow.mainFilePath,
			]);
			const result = JSON.parse(stdout) as { errors: Array<{ file: string }> };
			expect(result.errors.length).toBeGreaterThan(0);
			expect(shadow.mapRuntimePath(result.errors[0]!.file)).toBe(accountsPath);
		} finally {
			await shadow.dispose();
			await rm(rootPath, { recursive: true, force: true });
		}
	});

	it('reuses unchanged parser output and invalidates only the edited file', async () => {
		const rootPath = await mkdtemp(join(tmpdir(), 'bean-parse-cache-integration-'));
		const mainPath = join(rootPath, 'main.bean');
		const accountsPath = join(rootPath, 'accounts.bean');
		const initial = [
			'2000-01-01 open Assets:Cash',
			'2000-01-01 open Equity:Opening-Balances',
			'2001-01-01 * "Opening"',
			'  Assets:Cash 1 USD',
			'  Equity:Opening-Balances -1 USD',
			'',
		].join('\n');
		const edited = initial.replace('1 USD', '2 USD').replace('-1 USD', '-2 USD');
		await writeFile(mainPath, 'include "accounts.bean"\n');
		await writeFile(accountsPath, initial);

		const probe = String.raw`
import json
from pathlib import Path
import sys

namespace = {"__name__": "beancheck_cache_probe"}
exec(Path(sys.argv[1]).read_text(encoding="utf-8"), namespace)
namespace["loader"].initialize(False)
namespace["install_incremental_parse_cache"](sys.argv[2])

first = namespace["run_beancheck"](sys.argv[3])
first_stats = namespace["get_incremental_parse_cache_stats"]()
second = namespace["run_beancheck"](sys.argv[3])
second_stats = namespace["get_incremental_parse_cache_stats"]()

Path(sys.argv[4]).write_text(sys.argv[5], encoding="utf-8")
namespace["invalidate_incremental_parse_cache"]([sys.argv[4]])
third = namespace["run_beancheck"](sys.argv[3])
third_stats = namespace["get_incremental_parse_cache_stats"]()

namespace["clear_incremental_parse_cache"]()
fourth = namespace["run_beancheck"](sys.argv[3])
fourth_stats = namespace["get_incremental_parse_cache_stats"]()

print(json.dumps({
    "first": first["general"]["accounts"]["Assets:Cash"]["balance"],
    "second": second["general"]["accounts"]["Assets:Cash"]["balance"],
    "third": third["general"]["accounts"]["Assets:Cash"]["balance"],
    "fourth": fourth["general"]["accounts"]["Assets:Cash"]["balance"],
    "firstStats": first_stats,
    "secondStats": second_stats,
    "thirdStats": third_stats,
    "fourthStats": fourth_stats,
}))
`;

		try {
			const script = fileURLToPath(new URL('../../node/beancheck.py', import.meta.url));
			const { stdout } = await execa(process.env['BEANCOUNT_PYTHON'] ?? 'python3', [
				'-c',
				probe,
				script,
				rootPath,
				mainPath,
				accountsPath,
				edited,
			]);
			const result = JSON.parse(stdout) as {
				first: string[];
				second: string[];
				third: string[];
				fourth: string[];
				firstStats: { entries: number; hits: number; misses: number };
				secondStats: { entries: number; hits: number; misses: number };
				thirdStats: { entries: number; hits: number; misses: number };
				fourthStats: { entries: number; hits: number; misses: number };
			};

			expect(result.first).toEqual(['1 USD']);
			expect(result.second).toEqual(result.first);
			expect(result.third).toEqual(['2 USD']);
			expect(result.fourth).toEqual(result.third);
			expect(result.firstStats).toEqual({ entries: 2, hits: 0, misses: 2 });
			expect(result.secondStats).toEqual({ entries: 2, hits: 2, misses: 2 });
			expect(result.thirdStats).toEqual({ entries: 2, hits: 3, misses: 3 });
			expect(result.fourthStats).toEqual({ entries: 2, hits: 0, misses: 2 });
		} finally {
			await rm(rootPath, { recursive: true, force: true });
		}
	});
});
