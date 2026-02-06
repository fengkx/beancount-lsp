import { Logger } from '@bean-lsp/shared';
import { $, execa } from 'execa';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { basename, isAbsolute, normalize } from 'path';
import {
	CancellationToken,
	CancellationTokenSource,
	Connection,
	DidSaveTextDocumentParams,
} from 'vscode-languageserver';
import {
	createMessageConnection,
	MessageConnection,
	StreamMessageReader,
	StreamMessageWriter,
} from 'vscode-languageserver/node';
import { URI } from 'vscode-uri';
import {
	Amount,
	BeancountError,
	BeancountFlag,
	BeancountManagerFactory,
	RealBeancountManager,
} from '../common/features/types';
import { globalEventBus, GlobalEvents } from '../common/utils/event-bus';

// eslint-disable-next-line import-x/no-relative-packages
import beanCheckPythonCode from './beancheck.py';

interface AccountDetails {
	open: string;
	currencies: string[];
	close: string;
	balance: string[];
	balance_incl_subaccounts: string[];
}

interface BeancheckOutput {
	errors: BeancountError[];
	flags: BeancountFlag[];
	pads?: Record<string, Record<string, Amount[]>>;
	general?: {
		accounts: Record<string, AccountDetails>;
		commodities: string[];
		payees: string[];
		narrations: string[];
		tags: string[];
		links: string[];
	};
}

function asError(error: unknown): Error {
	return error instanceof Error ? error : new Error(String(error));
}

function createCancellationError(): Error {
	const error = new Error('beancheck request cancelled');
	error.name = 'CancellationError';
	return error;
}

class BeancheckRpcClient {
	private process: ChildProcessWithoutNullStreams | null = null;
	private rpcConnection: MessageConnection | null = null;
	private startPromise: Promise<void> | null = null;
	private disposed = false;

	constructor(private readonly python3Path: string, private readonly logger: Logger) {}

	async runBeancheck(filePath: string, token: CancellationToken): Promise<BeancheckOutput> {
		await this.ensureProcess();
		if (token.isCancellationRequested) {
			throw createCancellationError();
		}
		return this.sendRequest<BeancheckOutput>('beancheck/run', {
			file: filePath,
		}, token);
	}

	dispose(): void {
		if (this.disposed) {
			return;
		}
		this.disposed = true;
		this.rpcConnection?.dispose();
		this.rpcConnection = null;
		const process = this.process;
		this.process = null;
		if (process && process.exitCode === null && !process.killed) {
			process.kill();
		}
	}

	private async ensureProcess(): Promise<void> {
		if (this.disposed) {
			throw new Error('beancheck rpc client disposed');
		}
		if (
			this.process
			&& this.process.exitCode === null
			&& !this.process.killed
			&& this.rpcConnection
		) {
			return;
		}
		if (!this.startPromise) {
			this.startPromise = this.startProcess()
				.finally(() => {
					this.startPromise = null;
				});
		}
		await this.startPromise;
	}

	private async startProcess(): Promise<void> {
		const child = spawn(
			this.python3Path,
			['-u', '-c', beanCheckPythonCode, '--rpc-stdio'],
			{ stdio: ['pipe', 'pipe', 'pipe'] },
		);
		this.process = child;
		const messageReader = new StreamMessageReader(child.stdout);
		const messageWriter = new StreamMessageWriter(child.stdin);
		const rpcConnection = createMessageConnection(messageReader, messageWriter);
		this.rpcConnection = rpcConnection;
		rpcConnection.listen();
		rpcConnection.onError(([error, message, count]) => {
			this.logger.error(
				`beancheck rpc protocol error: ${error.message}; message=${message}; count=${count}`,
			);
		});
		rpcConnection.onClose(() => {
			if (this.rpcConnection === rpcConnection) {
				this.rpcConnection = null;
			}
		});

		child.stderr.on('data', chunk => {
			const text = chunk.toString().trim();
			if (text.length > 0) {
				this.logger.warn(`[beancheck-rpc stderr] ${text}`);
			}
		});

		child.on('error', error => {
			const err = asError(error);
			this.logger.error(`beancheck rpc process error: ${err.message}`);
			if (this.process === child) {
				this.process = null;
			}
			if (this.rpcConnection === rpcConnection) {
				this.rpcConnection = null;
			}
		});

		child.on('exit', (code, signal) => {
			if (!this.disposed && (code !== 0 || signal !== null)) {
				this.logger.warn(
					`beancheck rpc process exited unexpectedly (code=${String(code)}, signal=${String(signal)})`,
				);
			}
			if (this.process === child) {
				this.process = null;
			}
			if (this.rpcConnection === rpcConnection) {
				this.rpcConnection = null;
			}
		});
	}

	private async sendRequest<T>(
		method: string,
		params: Record<string, unknown>,
		token: CancellationToken,
	): Promise<T> {
		const connection = this.rpcConnection;
		if (!connection) {
			throw new Error('beancheck rpc connection is not ready');
		}
		try {
			return await connection.sendRequest(method, params, token) as T;
		} catch (error) {
			const err = asError(error) as Error & { code?: number };
			if (err.code === -32800) {
				err.name = 'CancellationError';
			}
			throw err;
		}
	}
}

class BeancountManager implements RealBeancountManager {
	private mainFile: string | null = null;
	private result: BeancheckOutput | null = null;
	private padFileCache = new Map<string, Record<string, Amount[]> | null>();
	private logger = new Logger('BeancountManager');
	private inputGeneration = 0;
	private queuedBeancheckGeneration = 0;
	private appliedBeancheckGeneration = 0;
	private hasPendingBeancheckRun = false;
	private beancheckQueuePromise: Promise<void> | null = null;
	private activeBeancheckTokenSource: CancellationTokenSource | null = null;
	private activeBeancheckRunGeneration = 0;
	private beancheckRpcClient: BeancheckRpcClient | null = null;
	private beancheckRpcPythonPath: string | null = null;

	constructor(private connection: Connection) {
		connection.onDidSaveTextDocument(this.onDocumentSaved.bind(this));
	}

	isEnabled(): boolean {
		return true;
	}

	async setMainFile(mainFileUri: string): Promise<void> {
		this.mainFile = URI.parse(mainFileUri).fsPath;
		this.markBeancheckInputChanged('main-file-updated');
		await this.scheduleBeancheckRevalidate();
	}

	async getPython3Path(): Promise<string> {
		const config = await this.connection.workspace.getConfiguration();
		let python3Path = config?.beanLsp?.python3Path || config?.beancount?.python3Path || 'python3';

		if (python3Path !== 'python3' && !isAbsolute(python3Path)) {
			const workspaceFolders = await this.connection.workspace.getWorkspaceFolders();
			if (workspaceFolders && workspaceFolders.length > 0) {
				// @ts-expect-error already check length
				const workspacePath = URI.parse(workspaceFolders[0].uri).fsPath;
				python3Path = `${workspacePath}/${python3Path}`;
			}
		}

		return python3Path;
	}

	private async runBeanCheck(token: CancellationToken): Promise<BeancheckOutput | null> {
		if (!this.mainFile) {
			return null;
		}
		if (token.isCancellationRequested) {
			return null;
		}

		const python3Path = await this.getPython3Path();
		if (token.isCancellationRequested) {
			return null;
		}

		try {
			const client = await this.ensureBeancheckRpcClient(python3Path);
			if (token.isCancellationRequested) {
				return null;
			}
			const result = await client.runBeancheck(this.mainFile, token);
			if (token.isCancellationRequested) {
				return null;
			}
			return result;
		} catch (error) {
			if (this.isCancellationError(error)) {
				return null;
			}
			this.logger.error('Error running bean-check via rpc:', error);
			this.disposeBeancheckRpcClient();
			return null;
		}
	}

	private async ensureBeancheckRpcClient(python3Path: string): Promise<BeancheckRpcClient> {
		if (
			this.beancheckRpcClient
			&& this.beancheckRpcPythonPath === python3Path
		) {
			return this.beancheckRpcClient;
		}
		this.disposeBeancheckRpcClient();
		this.beancheckRpcClient = new BeancheckRpcClient(python3Path, this.logger);
		this.beancheckRpcPythonPath = python3Path;
		return this.beancheckRpcClient;
	}

	private disposeBeancheckRpcClient(): void {
		this.beancheckRpcClient?.dispose();
		this.beancheckRpcClient = null;
		this.beancheckRpcPythonPath = null;
	}

	private isCancellationError(error: unknown): boolean {
		return error instanceof Error && error.name === 'CancellationError';
	}

	private markBeancheckInputChanged(reason: string): void {
		this.inputGeneration += 1;

		// Previous beancheck diagnostics no longer match the current on-disk snapshot.
		if (this.result && this.appliedBeancheckGeneration < this.inputGeneration) {
			this.result = null;
			this.padFileCache.clear();
			globalEventBus.emit(GlobalEvents.BeancountUpdate);
		}

		if (
			this.activeBeancheckTokenSource
			&& this.activeBeancheckRunGeneration < this.inputGeneration
		) {
			this.logger.debug(
				`cancelling beancheck generation ${this.activeBeancheckRunGeneration} due to ${reason} (generation=${this.inputGeneration})`,
			);
			this.activeBeancheckTokenSource.cancel();
		}
	}

	private async scheduleBeancheckRevalidate(targetGeneration = this.inputGeneration): Promise<void> {
		if (!this.mainFile) {
			return;
		}

		this.queuedBeancheckGeneration = Math.max(this.queuedBeancheckGeneration, targetGeneration);
		this.hasPendingBeancheckRun = true;

		if (
			this.activeBeancheckTokenSource
			&& this.activeBeancheckRunGeneration < this.queuedBeancheckGeneration
		) {
			this.activeBeancheckTokenSource.cancel();
		}

		if (!this.beancheckQueuePromise) {
			this.beancheckQueuePromise = this.processBeancheckQueue()
				.finally(() => {
					this.beancheckQueuePromise = null;
				});
		}

		await this.beancheckQueuePromise;
	}

	private async processBeancheckQueue(): Promise<void> {
		while (this.hasPendingBeancheckRun) {
			this.hasPendingBeancheckRun = false;
			const targetGeneration = this.queuedBeancheckGeneration;
			const tokenSource = new CancellationTokenSource();
			this.activeBeancheckTokenSource = tokenSource;
			this.activeBeancheckRunGeneration = targetGeneration;
			try {
				await this.revalidateBeanCheck(targetGeneration, tokenSource.token);
			} finally {
				if (this.activeBeancheckTokenSource === tokenSource) {
					this.activeBeancheckTokenSource = null;
					this.activeBeancheckRunGeneration = 0;
				}
				tokenSource.dispose();
			}
		}
	}

	private async revalidateBeanCheck(targetGeneration: number, token: CancellationToken): Promise<void> {
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			return;
		}

		this.logger.info(`running beancheck generation=${targetGeneration}`);
		const result = await this.runBeanCheck(token);
		this.logger.info('received response for beancheck');

		if (!result) {
			return;
		}
		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			this.logger.info(
				`discarding stale beancheck result generation=${targetGeneration}; latest generation=${this.inputGeneration}`,
			);
			return;
		}

		if (token.isCancellationRequested || targetGeneration !== this.inputGeneration) {
			return;
		}

		this.result = result;
		this.padFileCache.clear();
		this.appliedBeancheckGeneration = targetGeneration;
		globalEventBus.emit(GlobalEvents.BeancountUpdate);
	}

	private onDocumentSaved(params: DidSaveTextDocumentParams): void {
		if (!this.mainFile) {
			return;
		}
		// Only check bean files
		if (!params.textDocument.uri.endsWith('.bean') && !params.textDocument.uri.endsWith('.beancount')) {
			return;
		}

		this.markBeancheckInputChanged('document-saved');
		void this.scheduleBeancheckRevalidate();
	}

	getBalance(account: string, includeSubaccountBalance: boolean): Amount[] {
		let accountDetails = this.result?.general?.accounts?.[account] as AccountDetails | null;
		if (!accountDetails) {
			return [];
		}

		const balances = includeSubaccountBalance ? accountDetails.balance_incl_subaccounts : accountDetails.balance;

		return balances.map(balanceStr => this.parseAmountString(balanceStr));
	}

	getSubaccountBalances(account: string): Map<string, Amount[]> {
		const accounts = this.result?.general?.accounts;

		const subaccounts = new Map();

		if (!accounts) {
			return subaccounts;
		}

		const prefix = account + ':';

		for (const [candidateAccount, value] of Object.entries(accounts)) {
			if (!candidateAccount.startsWith(prefix) && !(candidateAccount === account)) {
				continue;
			}

			const details = value as AccountDetails;
			const balances = details.balance.map(balanceStr => this.parseAmountString(balanceStr));
			subaccounts.set(candidateAccount, balances);
		}

		return subaccounts;
	}

	getPadAmounts(filePath: string, line: number): Amount[] {
		const pads = this.result?.pads;
		if (!pads) {
			return [];
		}

		const normalizedPath = normalize(filePath);
		let filePads: Record<string, Amount[]> | null;
		if (this.padFileCache.has(normalizedPath)) {
			filePads = this.padFileCache.get(normalizedPath) ?? null;
		} else {
			filePads = pads[normalizedPath] ?? pads[filePath] ?? pads[basename(normalizedPath)] ?? null;
			this.padFileCache.set(normalizedPath, filePads);
		}
		if (!filePads) {
			return [];
		}

		const lineKey = String(line + 1);
		return filePads[lineKey] ?? [];
	}

	private parseAmountString(balanceStr: string): Amount {
		const [number, currency] = balanceStr.trim().split(/\s+/) as [string, string];
		return { number, currency };
	}

	getErrors(): BeancountError[] {
		return this.result?.errors ?? [];
	}

	getFlagged(): BeancountFlag[] {
		return this.result?.flags ?? [];
	}

	async runQuery(query: string): Promise<string> {
		if (!this.mainFile) {
			throw new Error('No main file set. Please set a main Beancount file first.');
		}

		const python3Path = await this.getPython3Path();
		const { stdout: prefix } = await $`${python3Path} -c ${'import sys; print(sys.prefix)'}`;

		this.logger.info(`Running bean-query: ${query}`);

		const { stdout } = await execa({
			extendEnv: true,
			env: {
				PATH: `${prefix}/bin` + ':' + process.env['PATH'],
			},
		})`bean-query ${this.mainFile} ${query}`;
		return stdout;
	}

	dispose(): void {
		this.activeBeancheckTokenSource?.cancel();
		this.activeBeancheckTokenSource?.dispose();
		this.activeBeancheckTokenSource = null;
		this.activeBeancheckRunGeneration = 0;
		this.disposeBeancheckRpcClient();
	}
}

export const beananagerFactory: BeancountManagerFactory = (connection: Connection) => new BeancountManager(connection);
