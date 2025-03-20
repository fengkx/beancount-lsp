#!/usr/bin/env node

/**
 * Build script for the neural-network package
 *
 * This script:
 * 1. Cleans the dist directory
 * 2. Runs TypeScript compiler
 * 3. Copies package.json and README.md to dist
 * 4. Creates a distributable package
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the package root directory
const packageRoot = path.resolve(__dirname, '..');
const distDir = path.join(packageRoot, 'dist');

// Ensure the script executes from the package root
process.chdir(packageRoot);

// ANSI color codes for console output
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	blue: '\x1b[34m',
};

/**
 * Execute a command and return its output
 * @param {string} command Command to execute
 * @param {boolean} silent Whether to suppress console output
 * @returns {string} Command output
 */
function exec(command, silent = false) {
	try {
		if (!silent) {
			console.log(`${colors.blue}> ${command}${colors.reset}`);
		}
		return execSync(command, { encoding: 'utf8' });
	} catch (error) {
		console.error(`${colors.red}Error executing command: ${command}${colors.reset}`);
		console.error(error.stdout || error.message);
		process.exit(1);
	}
}

/**
 * Main build function
 */
function build() {
	console.log(`${colors.green}Building @bean-lsp/neural-network package...${colors.reset}`);

	// Clean dist directory
	console.log(`\n${colors.yellow}Cleaning dist directory...${colors.reset}`);
	exec('npm run clean');

	// Run tests to ensure everything works
	console.log(`\n${colors.yellow}Running tests...${colors.reset}`);
	exec('npm test');

	// Run TypeScript compiler
	console.log(`\n${colors.yellow}Compiling TypeScript...${colors.reset}`);
	exec('npx tsc');

	// Copy package.json to dist with modifications
	console.log(`\n${colors.yellow}Preparing package.json...${colors.reset}`);
	const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));

	// Remove dev dependencies and scripts for distribution
	const distPackageJson = {
		...packageJson,
		devDependencies: undefined,
		scripts: {
			test: 'echo "Error: no test specified" && exit 1',
		},
		main: 'index.js',
		types: 'index.d.ts',
	};

	fs.writeFileSync(
		path.join(distDir, 'package.json'),
		JSON.stringify(distPackageJson, null, 2),
	);

	// Copy README.md to dist
	console.log(`\n${colors.yellow}Copying README.md...${colors.reset}`);
	fs.copyFileSync(
		path.join(packageRoot, 'README.md'),
		path.join(distDir, 'README.md'),
	);

	// Create a tarball package
	console.log(`\n${colors.yellow}Creating distributable package...${colors.reset}`);
	const packageVersion = packageJson.version;
	exec(`cd dist && npm pack`);

	console.log(`\n${colors.green}Build complete!${colors.reset}`);
	console.log(`\nPackage created: ${colors.blue}dist/bean-lsp-neural-network-${packageVersion}.tgz${colors.reset}`);
}

// Execute build
build();
