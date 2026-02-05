import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const lspClientDir = path.join(repoRoot, 'packages', 'lsp-client');
const browserDemoDir = path.join(repoRoot, 'packages', 'browser-demo');

function run(cmd, args, cwd) {
	const result = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
	if (result.status !== 0) {
		throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);
	}
}

run('pnpm', ['-C', lspClientDir, 'run', 'vsix'], repoRoot);

const candidates = fs
	.readdirSync(lspClientDir)
	.filter((f) => f.endsWith('.vsix'))
	.map((f) => {
		const full = path.join(lspClientDir, f);
		return { full, stat: fs.statSync(full) };
	})
	.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

if (candidates.length === 0) {
	throw new Error(`No .vsix produced under ${lspClientDir}`);
}

const newest = candidates[0].full;
const dest = path.join(browserDemoDir, 'lsp-client.vsix');

fs.copyFileSync(newest, dest);
console.log(`Copied ${path.basename(newest)} -> ${path.relative(repoRoot, dest)}`);

