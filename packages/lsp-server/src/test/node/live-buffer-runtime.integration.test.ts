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
});
