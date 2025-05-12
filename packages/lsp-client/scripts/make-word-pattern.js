#!/usr/bin/env node
const rewritePattern = require('regexpu-core');
const { modify, applyEdits } = require('jsonc-parser');
const { capture, atomic, either } = require('compose-regexp');

// https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4IWAA60ATsQAEwDMVpYI1CnOoYJxAK7SYGgEa1daACYbqhDNIDKMYhrBQMAczga4MAI66m1IZycLpgkAAeGjAQxIQw0qxyYNIqcgDkdJK03gC0Bm4w4RIAAgAM+ABs+KVpADpo9UJw8mi6WEbxcgC8mtp6BgAUSipqAwD0OQD8tbXmAFQz+NOzANRyc2MAlJsA3PWN9M1yGNR0ZvI9Wjr6MEPKqtTjAwPIAII5AFoAum+fGDkAL1KOQAnDMcl85psBigZhJgAAZXSsH5wxGseEAOVY4MhmxWmy2m32aCa8kyWFo5hiAE9ur1roNhg9xr9vmzgSC6rV8AB9XHAUoUABMwtYHNBkKJewapMO8mI7npV36t2ZozGAwAxMgZgB3XEE6UkslyKAQNAAa2VfRudxGjzGMwAerragbahCVsbZaaTmcGAAFWwXBmq+0ssZsn7-AGo92GxBEk3yuRoGRYDBQADqMnMNsZavuGuQsa+3u2MoOaDgtFg+CgtDcA1a7Xiu2rtfrjeb-tMDA7cprdZgDabAwpVNpxKHXdHPYGircg6aI7HzfNVpXhzXC7752Dsm3w+74-T0kzObzM878gMISgoeisXiLbaHWkGn3DCsKkp1OIGkNCXDRN0tL9Tn7YhDycNMMyzXNpHMGdV1PZt710R8Z0oEBvFgahiAgQ48AAZkQUo2A4EBMBwPB8GoOABBoehGGYHg2C+VggA
const number = capture(atomic(/-?\d*\.?\d+ */u));

const account = capture(
	atomic(
		/(([A-Z][A-Za-z0-9\-]*)(:[\p{Lu}\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{F900}-\u{FAFF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2F800}-\u{2FA1F}\u{3040}-\u{309F}\u{30A0}-\u{30FF}\u{AC00}-\u{D7AF}][\p{L}\p{N}\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{F900}-\u{FAFF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2F800}-\u{2FA1F}\u{3040}-\u{309F}\u{30A0}-\u{30FF}\u{AC00}-\u{D7AF}\-]*))+/u,
	),
);

const commodity = capture(atomic(/[A-Z][A-Z0-9'\._\-]{0,22}[A-Z0-9]*/u));

const tag = capture(atomic(/(#[\w\-]+)/u));

const link = capture(atomic(/\^[\w\-]+/u));

const accountPart = capture(atomic(/[A-Z][a-z][\w\-]+:/u));

const normalWord = capture(atomic(/[a-z]+/u));

const regex = either(number, account, commodity, tag, link, accountPart, normalWord);

const fs = require('fs');
const path = require('path');

const rewritten = rewritePattern(regex.source, 'u', { unicodeFlag: 'transform' });
console.log('[INFO] Rewritten regex for wordPattern:');
console.log(rewritten);

// Write to language-configuration.json
const configPath = path.join(__dirname, '..', 'language-configuration.json');
let configText;
try {
	configText = fs.readFileSync(configPath, 'utf8');
} catch (err) {
	console.error('[ERROR] Failed to read language-configuration.json:', err);
	process.exit(1);
}

const edits = modify(configText, ['wordPattern'], rewritten, {
	formattingOptions: { keepLines: true },
});
const newText = applyEdits(configText, edits);

try {
	fs.writeFileSync(configPath, newText);
	console.log('[SUCCESS] language-configuration.json updated successfully.');
} catch (err) {
	console.error('[ERROR] Failed to write language-configuration.json:', err);
	process.exit(1);
}
