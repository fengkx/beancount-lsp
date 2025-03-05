export const enum LogLevel {
	NONE = 0,
	ERROR = 1,
	WARN = 2,
	INFO = 3,
	DEBUG = 4,
	TRACE = 5,
}

export interface ILogger {
	setLevel(level: LogLevel): void;
	error(...args: unknown[]): void;
	warn(...args: unknown[]): void;
	info(...args: unknown[]): void;
	debug(...args: unknown[]): void;
	trace(...args: unknown[]): void;
}

// Map LSP trace server settings to our LogLevel enum
export function mapTraceServerToLogLevel(traceServer: string): LogLevel {
	switch (traceServer.toLowerCase()) {
		case 'off':
			return LogLevel.ERROR; // Only show errors when off
		case 'messages':
			return LogLevel.INFO; // Show info and errors when set to messages
		case 'verbose':
			return LogLevel.TRACE; // Show everything when verbose
		default:
			return LogLevel.INFO; // Default to INFO
	}
}

export class Logger implements ILogger {
	private level: LogLevel = LogLevel.INFO;
	private prefix: string = '';

	constructor(prefix: string = '') {
		this.prefix = prefix ? `[${prefix}] ` : '';
	}

	setLevel(level: LogLevel): void {
		this.level = level;
	}

	error(...args: unknown[]): void {
		if (this.level >= LogLevel.ERROR) {
			console.error(this.formatMessage(...args));
		}
	}

	warn(...args: unknown[]): void {
		if (this.level >= LogLevel.WARN) {
			console.warn(this.formatMessage(...args));
		}
	}

	info(...args: unknown[]): void {
		if (this.level >= LogLevel.INFO) {
			console.info(this.formatMessage(...args));
		}
	}

	debug(...args: unknown[]): void {
		// if (this.level >= LogLevel.DEBUG) {
		console.log(this.formatMessage(...args));
		// }
	}

	trace(...args: unknown[]): void {
		// if (this.level >= LogLevel.TRACE) {
		console.log(this.formatMessage(...args));
		// }
	}

	private formatMessage(...args: unknown[]): string {
		return [this.prefix, ...args].map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
	}
}

// Global logger instance
export const logger = new Logger();

// Convert string level to enum
export function parseLogLevel(level: string): LogLevel {
	switch (level.toUpperCase()) {
		case 'NONE':
			return LogLevel.NONE;
		case 'ERROR':
			return LogLevel.ERROR;
		case 'WARN':
			return LogLevel.WARN;
		case 'INFO':
			return LogLevel.INFO;
		case 'DEBUG':
			return LogLevel.DEBUG;
		case 'TRACE':
			return LogLevel.TRACE;
		default:
			return LogLevel.INFO;
	}
}

// Convert LogLevel enum value to string representation
// This is needed because `LogLevel[value]` doesn't work with isolatedModules
export function logLevelToString(level: LogLevel): string {
	switch (level) {
		case LogLevel.NONE:
			return 'NONE';
		case LogLevel.ERROR:
			return 'ERROR';
		case LogLevel.WARN:
			return 'WARN';
		case LogLevel.INFO:
			return 'INFO';
		case LogLevel.DEBUG:
			return 'DEBUG';
		case LogLevel.TRACE:
			return 'TRACE';
		default:
			return `UNKNOWN(${level})`;
	}
}
