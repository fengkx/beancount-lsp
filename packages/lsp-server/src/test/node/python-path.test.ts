import { homedir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { expandPythonPath } from '../../node/python-path';

describe('expandPythonPath', () => {
	it('expands leading tilde', () => {
		const result = expandPythonPath('~/bin/python3');
		expect(result).toBe(`${homedir()}/bin/python3`);
	});

	it('expands braced env vars', () => {
		const result = expandPythonPath('${HOME}/.venv/bin/python3', {
			HOME: '/tmp/home',
		});
		expect(result).toBe('/tmp/home/.venv/bin/python3');
	});

	it('expands bare env vars', () => {
		const result = expandPythonPath('$HOME/.venv/bin/python3', {
			HOME: '/tmp/home',
		});
		expect(result).toBe('/tmp/home/.venv/bin/python3');
	});

	it('expands windows style env vars', () => {
		const result = expandPythonPath('%USERPROFILE%\\venv\\python.exe', {
			USERPROFILE: 'C:\\Users\\demo',
		});
		expect(result).toBe('C:\\Users\\demo\\venv\\python.exe');
	});

	it('keeps unknown env vars untouched', () => {
		const result = expandPythonPath('${UNKNOWN}/python3', {});
		expect(result).toBe('${UNKNOWN}/python3');
	});
});
