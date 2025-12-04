export const enum LogLevel {
	NONE = 0,
	ERROR = 1,
	WARN = 2,
	INFO = 3,
	DEBUG = 4,
	TRACE = 5,
}

// Non-enum constant object that can be safely imported with isolatedModules
export const LOG_LEVELS = {
	NONE: 0,
	ERROR: 1,
	WARN: 2,
	INFO: 3,
	DEBUG: 4,
	TRACE: 5,
} as const;

export interface ILogger {
	setLevel(level: LogLevel): void;
	getLevel(): LogLevel;
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
		case 'error':
			return LogLevel.ERROR; // Show errors
		case 'warn':
			return LogLevel.WARN; // Show warnings and errors
		case 'messages':
			return LogLevel.INFO; // Show info and below when set to messages
		case 'debug':
			return LogLevel.DEBUG; // Show debug and below
		case 'verbose':
			return LogLevel.TRACE; // Show everything when verbose
		default:
			return LogLevel.INFO; // Default to INFO
	}
}

// Global log level that affects all Logger instances
let globalLogLevel: LogLevel | null = null;

/**
 * Set global log level for all Logger instances
 * This overrides individual logger levels
 */
export function setGlobalLogLevel(level: LogLevel): void {
	globalLogLevel = level;
}

/**
 * Get global log level
 */
export function getGlobalLogLevel(): LogLevel | null {
	return globalLogLevel;
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

	getLevel(): LogLevel {
		// Global level takes precedence if set
		return globalLogLevel !== null ? globalLogLevel : this.level;
	}

	private getEffectiveLevel(): LogLevel {
		return globalLogLevel !== null ? globalLogLevel : this.level;
	}

	error(...args: unknown[]): void {
		if (this.getEffectiveLevel() >= LogLevel.ERROR) {
			console.error(this.formatMessage(...args));
		}
	}

	warn(...args: unknown[]): void {
		if (this.getEffectiveLevel() >= LogLevel.WARN) {
			console.warn(this.formatMessage(...args));
		}
	}

	info(...args: unknown[]): void {
		if (this.getEffectiveLevel() >= LogLevel.INFO) {
			console.info(this.formatMessage(...args));
		}
	}

	debug(...args: unknown[]): void {
		if (this.getEffectiveLevel() >= LogLevel.DEBUG) {
			console.log(this.formatMessage(...args));
		}
	}

	trace(...args: unknown[]): void {
		if (this.getEffectiveLevel() >= LogLevel.TRACE) {
			console.log(this.formatMessage(...args));
		}
	}

	private formatMessage(...args: unknown[]): string {
		return [this.prefix, ...args].map(arg => {
			if (typeof arg === 'string') {
				return arg;
			}
			if (arg instanceof Error) {
				return arg.stack || arg.message;
			}
			return JSON.stringify(arg);
		}).join(' ');
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
