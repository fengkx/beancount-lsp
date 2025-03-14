/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	settings: {
		'import-x/resolver': {
			typescript: true,
		},
	},
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	ignorePatterns: ['dist', 'out', 'grammar.js'],
	extends: [
		'plugin:turbo/recommended',
		'eslint:recommended',
		'plugin:import-x/recommended',
		'plugin:@typescript-eslint/recommended',
	],

	rules: {
		'import-x/no-unresolved': 'off',
		'import-x/no-relative-packages': 'error',
		'import-x/no-absolute-path': 'error',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': ['warn', {
			argsIgnorePattern: '^_',
			varsIgnorePattern: '^_',
			caughtErrorsIgnorePattern: '^_',
		}],
	},
	overrides: [
		{
			files: ['**/common/**/*.ts', '**/browser/**/*.ts', '**/node/**/*.ts'],
			rules: {
				'import-x/no-nodejs-modules': ['error'],
			},
		},
	],
};
