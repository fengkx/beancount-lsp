#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const rewritePattern = require('regexpu-core');
const { applyEdits, modify, parse } = require('jsonc-parser');

// Keep the alternatives broad enough for interactive input. Parser validation
// and completion intent remain server responsibilities.
const date = /[12]\d{3}[-/]\d{0,2}(?:[-/]\d{0,2})?/u;
const number = /[+-]?(?:\d[\d,]*(?:\.\d*)?|\.\d+)/u;
const tagOrLink = /[#^][A-Za-z0-9_./-]+/u;
const symbol = /\p{L}[\p{L}\p{N}'._/:：-]*/u;

// The order is part of the word model: date and number prefixes must win over
// their shorter delimiter-free matches.
const tokenPatterns = Object.freeze([date, number, tagOrLink, symbol]);

const configPath = path.join(__dirname, '..', 'language-configuration.json');

function buildSourcePattern() {
	return tokenPatterns.map((pattern) => `(?:${pattern.source})`).join('|');
}

function buildWordPattern() {
	return rewritePattern(buildSourcePattern(), 'u', {
		unicodeFlag: 'transform',
	});
}

function readConfig() {
	try {
		return fs.readFileSync(configPath, 'utf8');
	} catch (error) {
		throw new Error(`Failed to read ${configPath}: ${error.message}`);
	}
}

function getConfiguredWordPattern(configText) {
	const config = parse(configText);
	if (typeof config.wordPattern !== 'string') {
		throw new Error(`Missing string property "wordPattern" in ${configPath}`);
	}
	return config.wordPattern;
}

function updateConfig(configText, wordPattern) {
	const edits = modify(configText, ['wordPattern'], wordPattern, {
		formattingOptions: { keepLines: true },
	});
	return applyEdits(configText, edits);
}

function generate() {
	const configText = readConfig();
	const newText = updateConfig(configText, buildWordPattern());

	if (newText !== configText) {
		fs.writeFileSync(configPath, newText);
	}

	console.log('[SUCCESS] language-configuration.json is synchronized.');
}

function check() {
	const configText = readConfig();
	const configuredWordPattern = getConfiguredWordPattern(configText);
	const generatedWordPattern = buildWordPattern();

	if (configuredWordPattern !== generatedWordPattern) {
		console.error(
			'[ERROR] language-configuration.json is out of sync with make-word-pattern.js. Run the generator to update it.',
		);
		process.exitCode = 1;
		return;
	}

	console.log('[SUCCESS] language-configuration.json matches the wordPattern source.');
}

function main(args = process.argv.slice(2)) {
	if (args.length === 0) {
		generate();
		return;
	}

	if (args.length === 1 && args[0] === '--check') {
		check();
		return;
	}

	console.error('Usage: node scripts/make-word-pattern.js [--check]');
	process.exitCode = 1;
}

if (require.main === module) {
	try {
		main();
	} catch (error) {
		console.error(`[ERROR] ${error.message}`);
		process.exitCode = 1;
	}
}

module.exports = {
	buildSourcePattern,
	buildWordPattern,
	tokenPatterns,
};
