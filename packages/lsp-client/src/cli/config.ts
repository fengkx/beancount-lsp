import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Configuration interface matching the beanLsp.* settings from package.json
 */
export interface BeanLspConfig {
	maxNumberOfProblems: number;
	trace: {
		server: 'off' | 'error' | 'warn' | 'messages' | 'debug' | 'verbose';
	};
	mainBeanFile: string;
	python3Path: string;
	diagnostics: {
		tolerance: number;
		warnOnIncompleteTransaction: boolean;
	};
	inlayHints: {
		enable: boolean;
	};
	mainCurrency: string;
	currencys: string[];
	formatter: {
		enabled: boolean;
		alignCurrency: boolean;
	};
	hover: {
		includeSubaccountBalance: boolean;
	};
	completion: {
		enableChinesePinyinFilter: boolean;
	};
}

/**
 * CLI options that can be passed via command line
 */
export interface CliOptions {
	workspace?: string;
	config?: string;
	mainBeanFile?: string;
	logLevel?: string;
}

/**
 * Default configuration values extracted from package.json
 */
export const DEFAULT_CONFIG: BeanLspConfig = {
	maxNumberOfProblems: 100,
	trace: {
		server: 'messages',
	},
	mainBeanFile: 'main.bean',
	python3Path: '',
	diagnostics: {
		tolerance: 0.005,
		warnOnIncompleteTransaction: true,
	},
	inlayHints: {
		enable: true,
	},
	mainCurrency: '',
	currencys: [],
	formatter: {
		enabled: true,
		alignCurrency: false,
	},
	hover: {
		includeSubaccountBalance: false,
	},
	completion: {
		enableChinesePinyinFilter: false,
	},
};

/**
 * Config file names to search for (in order of priority)
 */
const CONFIG_FILE_NAMES = ['.beanlsp.json', '.beanlsprc', '.beanlsprc.json'];

/**
 * Load user configuration from file
 */
export function loadUserConfig(workspaceDir: string, configPath?: string): Partial<BeanLspConfig> {
	// If explicit config path is provided, use it
	if (configPath) {
		const fullPath = path.isAbsolute(configPath) ? configPath : path.join(workspaceDir, configPath);
		if (fs.existsSync(fullPath)) {
			try {
				const content = fs.readFileSync(fullPath, 'utf-8');
				return parseConfigFile(content);
			} catch (err) {
				console.error(`Failed to load config from ${fullPath}:`, err);
			}
		}
		return {};
	}

	// Search for config files in workspace directory
	for (const fileName of CONFIG_FILE_NAMES) {
		const filePath = path.join(workspaceDir, fileName);
		if (fs.existsSync(filePath)) {
			try {
				const content = fs.readFileSync(filePath, 'utf-8');
				return parseConfigFile(content);
			} catch (err) {
				console.error(`Failed to load config from ${filePath}:`, err);
			}
		}
	}

	return {};
}

/**
 * Parse config file content (JSON format)
 */
function parseConfigFile(content: string): Partial<BeanLspConfig> {
	try {
		const parsed = JSON.parse(content);
		return normalizeConfig(parsed);
	} catch (err) {
		console.error('Failed to parse config file:', err);
		return {};
	}
}

/**
 * Normalize config object to handle both flat and nested formats
 * Supports formats like:
 * - { "mainBeanFile": "..." } (flat)
 * - { "beanLsp.mainBeanFile": "..." } (dotted keys)
 * - { "beanLsp": { "mainBeanFile": "..." } } (nested)
 */
function normalizeConfig(raw: Record<string, unknown>): Partial<BeanLspConfig> {
	const result: Record<string, unknown> = {};

	// Handle nested beanLsp object
	const beanLspValue = raw['beanLsp'];
	if (beanLspValue && typeof beanLspValue === 'object') {
		Object.assign(result, normalizeConfig(beanLspValue as Record<string, unknown>));
	}

	// Handle dotted keys (beanLsp.*)
	for (const [key, value] of Object.entries(raw)) {
		if (key.startsWith('beanLsp.')) {
			const keyPath = key.slice('beanLsp.'.length).split('.');
			setNestedValue(result, keyPath, value);
		} else if (!key.includes('.') && key !== 'beanLsp') {
			// Handle flat keys
			const keyPath = key.split('.');
			setNestedValue(result, keyPath, value);
		}
	}

	return result as Partial<BeanLspConfig>;
}

/**
 * Set a nested value in an object using a path array
 */
function setNestedValue(obj: Record<string, unknown>, keyPath: string[], value: unknown): void {
	if (keyPath.length === 0) return;

	let current = obj;
	for (let i = 0; i < keyPath.length - 1; i++) {
		const key = keyPath[i]!;
		if (!(key in current) || typeof current[key] !== 'object') {
			current[key] = {};
		}
		current = current[key] as Record<string, unknown>;
	}
	const lastKey = keyPath[keyPath.length - 1];
	if (lastKey !== undefined) {
		current[lastKey] = value;
	}
}

/**
 * Deep merge two objects
 */
function deepMerge(target: BeanLspConfig, source: Partial<BeanLspConfig>): BeanLspConfig {
	const result: Record<string, unknown> = { ...target };

	for (const key of Object.keys(source) as (keyof BeanLspConfig)[]) {
		const sourceValue = source[key];
		const targetValue = result[key];

		if (
			sourceValue !== undefined
			&& typeof sourceValue === 'object'
			&& sourceValue !== null
			&& !Array.isArray(sourceValue)
			&& typeof targetValue === 'object'
			&& targetValue !== null
			&& !Array.isArray(targetValue)
		) {
			result[key] = deepMergeObjects(
				targetValue as Record<string, unknown>,
				sourceValue as Record<string, unknown>,
			);
		} else if (sourceValue !== undefined) {
			result[key] = sourceValue;
		}
	}

	return result as unknown as BeanLspConfig;
}

/**
 * Deep merge helper for generic objects
 */
function deepMergeObjects(
	target: Record<string, unknown>,
	source: Record<string, unknown>,
): Record<string, unknown> {
	const result = { ...target };

	for (const key of Object.keys(source)) {
		const sourceValue = source[key];
		const targetValue = result[key];

		if (
			sourceValue !== undefined
			&& typeof sourceValue === 'object'
			&& sourceValue !== null
			&& !Array.isArray(sourceValue)
			&& typeof targetValue === 'object'
			&& targetValue !== null
			&& !Array.isArray(targetValue)
		) {
			result[key] = deepMergeObjects(
				targetValue as Record<string, unknown>,
				sourceValue as Record<string, unknown>,
			);
		} else if (sourceValue !== undefined) {
			result[key] = sourceValue;
		}
	}

	return result;
}

/**
 * Apply CLI options to config
 */
function applyCliOptions(config: BeanLspConfig, options: CliOptions): BeanLspConfig {
	const result = { ...config };

	if (options.mainBeanFile) {
		result.mainBeanFile = options.mainBeanFile;
	}

	if (options.logLevel) {
		const level = options.logLevel.toLowerCase();
		if (['off', 'error', 'warn', 'messages', 'debug', 'verbose'].includes(level)) {
			result.trace = { server: level as BeanLspConfig['trace']['server'] };
		}
	}

	return result;
}

/**
 * Load and merge configuration from all sources
 * Priority: CLI Args > User Config > Defaults
 */
export function loadConfig(options: CliOptions): BeanLspConfig {
	const workspaceDir = options.workspace || process.cwd();

	// Load user config from file
	const userConfig = loadUserConfig(workspaceDir, options.config);

	// Merge: Defaults <- User Config <- CLI Args
	let config = deepMerge(DEFAULT_CONFIG, userConfig);
	config = applyCliOptions(config, options);

	return config;
}

/**
 * Resolve workspace directory to absolute path
 */
export function resolveWorkspace(workspace?: string): string {
	const dir = workspace || process.cwd();
	return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
}
