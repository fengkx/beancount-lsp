import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importXPlugin from 'eslint-plugin-import-x';
import oxlint from 'eslint-plugin-oxlint';
import turboPlugin from 'eslint-plugin-turbo';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import fs from 'node:fs';
const gitIgnore = fs.readFileSync('.gitignore', 'utf8');
const gitIgnoreLines = gitIgnore.split('\n').filter(line => line.trim() !== '').map(line => {
	if (!line.startsWith('/') && !line.startsWith('**/')) {
		return `**/${line}`;
	}
	return line;
});

const importResolver = createTypeScriptImportResolver({
	project: ['./tsconfig.json', './packages/*/tsconfig.json'],
});

export default defineConfig([
	// Global ignores
	globalIgnores([
		...gitIgnoreLines,
		'eslint.config.mjs',
		'packages/tree-sitter-beancount/bindings/**/*',
		'packages/**/dist',
		'packages/**/out',
		'**/grammar.js',
		'**/t.js',
		'packages/lsp-client/server/**',
		'**/.vscode-test-web/**',
		'**/scripts/**',
	]),

	// Base configuration for all files
	{
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},

		plugins: {
			'@typescript-eslint': tsPlugin,
			'turbo': turboPlugin,
			'unused-imports': unusedImportsPlugin,
			'import-x': importXPlugin,
		},

		settings: {
			'import-x/resolver-next': importResolver,
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
		},

		rules: {
			// Base rules from eslint:recommended
			...js.configs.recommended.rules,
			...tsPlugin.configs.recommended.rules,

			// Rules from custom config
			'import-x/no-unresolved': 'off',
			'import-x/no-relative-packages': 'error',
			'import-x/no-absolute-path': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': ['warn', {
				'args': 'all',
				'argsIgnorePattern': '^_',
				'caughtErrors': 'all',
				'caughtErrorsIgnorePattern': '^_',
				'destructuredArrayIgnorePattern': '^_',
				'varsIgnorePattern': '^_',
				'ignoreRestSiblings': true,
			}],
			'@typescript-eslint/no-require-imports': 'error',
			'no-undef': 'off',
			...oxlint.configs.recommended.rules,
		},
	},

	{
		files: ['**/*.ts', '**/*.mts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: ['./tsconfig.json', './packages/*/tsconfig.json'],
			},
		},
	},

	// Specific configuration for common/browser/node TypeScript files
	{
		files: ['**/common/**/*.ts', '**/browser/**/*.ts'],
		rules: {
			'import-x/no-nodejs-modules': ['error'],
		},
	},

	// Configuration for JavaScript files
	{
		files: ['**/*.js', '**/*.mjs'],
		languageOptions: {
			parser: undefined, // Use default ESLint parser for JS files
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
	// Specific configuration for grammar.js
	{
		files: ['./packages/tree-sitter-beancount/grammar.js'],
		languageOptions: {
			globals: {
				grammar: 'readonly',
				seq: 'readonly',
				repeat: 'readonly',
				repeat1: 'readonly',
				optional: 'readonly',
				token: 'readonly',
				choice: 'readonly',
				field: 'readonly',
				alias: 'readonly',
				prec: 'readonly',
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '$',
			}],
			'no-useless-escape': 'off',
			'no-control-regex': 'off',
			'no-dupe-keys': 'warn',
		},
	},
	{
		files: ['packages/lsp-client/src/test/suite/**/*.{js,ts,mjs,mts}'],
		languageOptions: {
			globals: {
				suite: 'readonly',
				test: 'readonly',
				assert: 'readonly',
			},
		},
	},
	...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
]);
