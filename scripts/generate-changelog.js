#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const clientPackagePath = path.resolve(__dirname, '../packages/lsp-client');
const packageJsonPath = path.join(clientPackagePath, 'package.json');
const changelogPath = path.join(clientPackagePath, 'CHANGELOG.md');

// Ensure client directory exists
if (!fs.existsSync(clientPackagePath)) {
	console.log(`Creating directory: ${clientPackagePath}`);
	fs.mkdirSync(clientPackagePath, { recursive: true });
}

// Get current version from package.json
const packageJson = require(packageJsonPath);
const currentVersion = packageJson.version;
console.log(`Current version: ${currentVersion}`);

// Get previous tag
let previousTag = '';
try {
	previousTag = execSync('git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo ""').toString().trim();
	console.log(`Previous tag: ${previousTag || 'None found'}`);
} catch (error) {
	console.log('No previous tag found or error getting tag');
}

// Generate changelog content for current version
function generateCurrentVersionChangelog() {
	const gitLogCmd = previousTag
		? `git log --pretty=format:"- %s ([%h](https://github.com/fengkx/beancount-lsp/commit/%h))" "${previousTag}..HEAD" -- packages/lsp-client`
		: `git log --pretty=format:"- %s ([%h](https://github.com/fengkx/beancount-lsp/commit/%h))" -- packages/lsp-client`;

	let commits = '';
	try {
		commits = execSync(gitLogCmd).toString().trim();
		// If no commits, provide a placeholder message
		if (!commits) {
			commits = '- Maintenance updates and minor improvements';
		}
	} catch (error) {
		console.error('Error getting git log:', error);
		commits = '- Maintenance updates and minor improvements';
	}

	return `## v${currentVersion}\n\n${commits}`;
}

// Main function to update or create the changelog
function updateChangelog() {
	const newVersionChangelog = generateCurrentVersionChangelog();

	if (fs.existsSync(changelogPath)) {
		// If changelog exists, prepend new version changes
		const existingChangelog = fs.readFileSync(changelogPath, 'utf8');

		// Parse existing changelog to avoid duplicate headers
		const existingLines = existingChangelog.split('\n');
		let updatedChangelog = '# Changelog\n\n';
		updatedChangelog += newVersionChangelog;

		// Add two blank lines after new content
		updatedChangelog += '\n\n';

		// Add existing content, skipping the header if it exists
		const contentStartIndex = existingLines.findIndex(line => line.startsWith('## v'));
		if (contentStartIndex !== -1) {
			updatedChangelog += existingLines.slice(contentStartIndex).join('\n');
		} else {
			// If no version headers found, add all content after the main header
			const afterMainHeader = existingLines.slice(2).join('\n');
			if (afterMainHeader.trim()) {
				updatedChangelog += afterMainHeader;
			}
		}

		fs.writeFileSync(changelogPath, updatedChangelog);
	} else {
		// If changelog doesn't exist, create a new one
		const newChangelog = `# Changelog\n\n${newVersionChangelog}`;
		fs.writeFileSync(changelogPath, newChangelog);
	}

	console.log('Generated CHANGELOG.md:');
	console.log(fs.readFileSync(changelogPath, 'utf8'));
}

// Execute the changelog update
updateChangelog();
