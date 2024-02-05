/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	ignorePatterns: ['dist', 'out', 'grammar.js'],
	extends: [
		'turbo',
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:@typescript-eslint/recommended',
	],

	rules: {
		'import/no-unresolved': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': 'warn',
	},
};
