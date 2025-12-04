import { type CLIContext, createCLIContext } from 'beancount-lsp-server/cli';
import cac from 'cac';
import * as readline from 'node:readline';
import { type CliOptions, loadConfig, resolveWorkspace } from './config';

// Get version from package.json
const version = '0.0.1';

const cli = cac('beancount-lsp');

// Global options
cli.option('-w, --workspace <path>', 'Path to workspace directory', { default: process.cwd() });
cli.option('-c, --config <path>', 'Path to config file');
cli.option('--verbose', 'Enable verbose logging (show indexing progress)');
cli.option('--log-level <level>', 'Log level (off, error, warn, info, debug)', { default: 'off' });
cli.option('--main-bean-file <file>', 'Main beancount file path');

/**
 * Create CLI context from options
 */
async function createContext(options: CliOptions & { verbose?: boolean }): Promise<CLIContext> {
	const workspacePath = resolveWorkspace(options.workspace);
	const config = loadConfig(options);

	// --verbose is a shortcut for --log-level info
	const logLevel = options.verbose ? 'info' : (options.logLevel || 'off');

	return createCLIContext({
		workspacePath,
		mainBeanFile: config.mainBeanFile,
		logLevel: logLevel as 'off' | 'error' | 'warn' | 'info' | 'debug',
	});
}

// Default command: REPL mode
cli
	.command('[workspace]', 'Start interactive REPL mode (default)')
	.action(async (workspace: string | undefined, options) => {
		try {
			console.log('Initializing beancount-lsp...');
			const ctx = await createContext({
				workspace: workspace || options.workspace,
				config: options.config,
				mainBeanFile: options.mainBeanFile,
				logLevel: options.logLevel,
				verbose: options.verbose,
			});
			console.log(`Loaded ${ctx.getFileCount()} files from ${ctx.getWorkspacePath()}`);

			await startRepl(ctx);
		} catch (err) {
			console.error(`Failed to start REPL: ${err}`);
			process.exit(1);
		}
	});

// Accounts command
cli
	.command('accounts [filter]', 'Get list of accounts')
	.action(async (filter: string | undefined, options) => {
		try {
			const ctx = await createContext({
				workspace: options.workspace,
				config: options.config,
				mainBeanFile: options.mainBeanFile,
				logLevel: options.logLevel,
				verbose: options.verbose,
			});

			const accounts = await ctx.getAccounts(filter);
			accounts.forEach((account) => console.log(account));
		} catch (err) {
			console.error(`Failed to get accounts: ${err}`);
			process.exit(1);
		}
	});

// Payees command
cli
	.command('payees [filter]', 'Get list of payees')
	.action(async (filter: string | undefined, options) => {
		try {
			const ctx = await createContext({
				workspace: options.workspace,
				config: options.config,
				mainBeanFile: options.mainBeanFile,
				logLevel: options.logLevel,
				verbose: options.verbose,
			});

			const payees = await ctx.getPayees(filter);
			payees.forEach((payee) => console.log(payee));
		} catch (err) {
			console.error(`Failed to get payees: ${err}`);
			process.exit(1);
		}
	});

// Narrations command
cli
	.command('narrations [filter]', 'Get list of narrations')
	.action(async (filter: string | undefined, options) => {
		try {
			const ctx = await createContext({
				workspace: options.workspace,
				config: options.config,
				mainBeanFile: options.mainBeanFile,
				logLevel: options.logLevel,
				verbose: options.verbose,
			});

			const narrations = await ctx.getNarrations(filter);
			narrations.forEach((narration) => console.log(narration));
		} catch (err) {
			console.error(`Failed to get narrations: ${err}`);
			process.exit(1);
		}
	});

// Tags command
cli
	.command('tags [filter]', 'Get list of tags')
	.action(async (filter: string | undefined, options) => {
		try {
			const ctx = await createContext({
				workspace: options.workspace,
				config: options.config,
				mainBeanFile: options.mainBeanFile,
				logLevel: options.logLevel,
				verbose: options.verbose,
			});

			const tags = await ctx.getTags(filter);
			tags.forEach((tag) => console.log(tag));
		} catch (err) {
			console.error(`Failed to get tags: ${err}`);
			process.exit(1);
		}
	});

// Links command
cli
	.command('links [filter]', 'Get list of links')
	.action(async (filter: string | undefined, options) => {
		try {
			const ctx = await createContext({
				workspace: options.workspace,
				config: options.config,
				mainBeanFile: options.mainBeanFile,
				logLevel: options.logLevel,
				verbose: options.verbose,
			});

			const links = await ctx.getLinks(filter);
			links.forEach((link) => console.log(link));
		} catch (err) {
			console.error(`Failed to get links: ${err}`);
			process.exit(1);
		}
	});

// Commodities command
cli
	.command('commodities [filter]', 'Get list of commodities/currencies')
	.action(async (filter: string | undefined, options) => {
		try {
			const ctx = await createContext({
				workspace: options.workspace,
				config: options.config,
				mainBeanFile: options.mainBeanFile,
				logLevel: options.logLevel,
				verbose: options.verbose,
			});

			const commodities = await ctx.getCommodities(filter);
			commodities.forEach((commodity) => console.log(commodity));
		} catch (err) {
			console.error(`Failed to get commodities: ${err}`);
			process.exit(1);
		}
	});

cli.help();
cli.version(version);

cli.parse();

/**
 * Start interactive REPL mode
 */
async function startRepl(ctx: CLIContext): Promise<void> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: 'beancount-lsp> ',
	});

	console.log('\nBeancount LSP REPL');
	console.log('Type "help" for available commands, "exit" to quit.\n');

	rl.prompt();

	rl.on('line', async (line) => {
		const input = line.trim();

		if (!input) {
			rl.prompt();
			return;
		}

		try {
			await handleReplCommand(ctx, input);
		} catch (err) {
			console.error(`Error: ${err}`);
		}

		rl.prompt();
	});

	rl.on('close', () => {
		console.log('\nGoodbye!');
		process.exit(0);
	});
}

/**
 * Handle REPL command
 */
async function handleReplCommand(ctx: CLIContext, input: string): Promise<void> {
	const parts = input.split(/\s+/);
	const command = parts[0] ?? '';
	const args = parts.slice(1);

	switch (command.toLowerCase()) {
		case 'help':
			printReplHelp();
			break;

		case 'exit':
		case 'quit':
			process.exit(0);

		case 'status':
			console.log(`Workspace: ${ctx.getWorkspacePath()}`);
			console.log(`Files indexed: ${ctx.getFileCount()}`);
			break;

		case 'accounts': {
			const filter = args.join(' ') || undefined;
			const accounts = await ctx.getAccounts(filter);
			console.log(`Found ${accounts.length} accounts:`);
			accounts.forEach((a) => console.log(`  ${a}`));
			break;
		}

		case 'payees': {
			const filter = args.join(' ') || undefined;
			const payees = await ctx.getPayees(filter);
			console.log(`Found ${payees.length} payees:`);
			payees.forEach((p) => console.log(`  ${p}`));
			break;
		}

		case 'narrations': {
			const filter = args.join(' ') || undefined;
			const narrations = await ctx.getNarrations(filter);
			console.log(`Found ${narrations.length} narrations:`);
			narrations.forEach((n) => console.log(`  ${n}`));
			break;
		}

		case 'tags': {
			const filter = args.join(' ') || undefined;
			const tags = await ctx.getTags(filter);
			console.log(`Found ${tags.length} tags:`);
			tags.forEach((t) => console.log(`  ${t}`));
			break;
		}

		case 'links': {
			const filter = args.join(' ') || undefined;
			const links = await ctx.getLinks(filter);
			console.log(`Found ${links.length} links:`);
			links.forEach((l) => console.log(`  ${l}`));
			break;
		}

		case 'commodities': {
			const filter = args.join(' ') || undefined;
			const commodities = await ctx.getCommodities(filter);
			console.log(`Found ${commodities.length} commodities:`);
			commodities.forEach((c) => console.log(`  ${c}`));
			break;
		}

		default:
			console.log(`Unknown command: ${command}. Type "help" for available commands.`);
	}
}

/**
 * Print REPL help
 */
function printReplHelp(): void {
	console.log(`
Available commands:
  help                  - Show this help message
  exit, quit            - Exit the REPL
  status                - Show workspace status

Data queries:
  accounts [filter]     - Get accounts (optional filter)
  payees [filter]       - Get payees (optional filter)
  narrations [filter]   - Get narrations (optional filter)
  tags [filter]         - Get tags (optional filter)
  links [filter]        - Get links (optional filter)
  commodities [filter]  - Get commodities/currencies (optional filter)

Examples:
  accounts Assets
  payees Amazon
  tags vacation
`);
}
