import untildify from 'untildify';

const BRACED_ENV_VAR_RE = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g;
const BARE_ENV_VAR_RE = /\$([A-Za-z_][A-Za-z0-9_]*)/g;
const WINDOWS_ENV_VAR_RE = /%([A-Za-z_][A-Za-z0-9_]*)%/g;

function replaceEnvVar(
	input: string,
	regexp: RegExp,
	env: NodeJS.ProcessEnv,
): string {
	return input.replace(regexp, (match, name: string) => env[name] ?? match);
}

export function expandPythonPath(
	input: string,
	env: NodeJS.ProcessEnv = process.env,
): string {
	// Expand env placeholders in a deterministic order:
	// 1) ${VAR} (template style), 2) $VAR (POSIX style), 3) %VAR% (Windows style).
	// Unknown variables are preserved as-is to avoid silently producing broken paths.
	const withBracedEnv = replaceEnvVar(input, BRACED_ENV_VAR_RE, env);
	const withBareEnv = replaceEnvVar(withBracedEnv, BARE_ENV_VAR_RE, env);
	const withWindowsEnv = replaceEnvVar(withBareEnv, WINDOWS_ENV_VAR_RE, env);
	// Use a battle-tested implementation for tilde expansion.
	return untildify(withWindowsEnv);
}
