import path from 'node:path';
import { createRequire } from 'node:module';
import { expect, it } from 'vitest';

function importDefault<T>(mod: T): { default: T } | T {
	return mod && typeof mod === 'object' && '__esModule' in mod
		? mod
		: { default: mod };
}

it('vsce should resolve a callable default export from minimatch', () => {
	const require = createRequire(import.meta.url);
	const vsceEntry = require.resolve('@vscode/vsce');
	const vscePackageDir = path.resolve(path.dirname(vsceEntry), '..');
	const minimatchEntry = require.resolve('minimatch', { paths: [vscePackageDir] });
	const minimatch = require(minimatchEntry);
	const imported = importDefault(minimatch);

	expect(typeof imported.default).toBe('function');
});
