export type LogLevel = 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

// Log level priorities (higher number = more verbose)
const LOG_LEVELS: Record<LogLevel, number> = {
    'off': 0,
    'error': 1,
    'warn': 2,
    'info': 3,
    'debug': 4,
    'trace': 5
};

class Logger {
    private _level: LogLevel = 'info';

    setLevel(level: LogLevel): void {
        this._level = level;
    }

    getLevel(): LogLevel {
        return this._level;
    }

    shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] <= LOG_LEVELS[this._level];
    }

    error(message: string, ...args: any[]): void {
        if (this.shouldLog('error')) {
            console.error(message, ...args);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.shouldLog('warn')) {
            console.warn(message, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.shouldLog('info')) {
            console.info(message, ...args);
        }
    }

    debug(message: string, ...args: any[]): void {
        if (this.shouldLog('debug')) {
            console.debug(message, ...args);
        }
    }

    trace(message: string, ...args: any[]): void {
        if (this.shouldLog('trace')) {
            console.trace(message, ...args);
        }
    }

    log(message: string, ...args: any[]): void {
        if (this.shouldLog('info')) {
            console.log(message, ...args);
        }
    }
}

export const logger = new Logger(); 