/**
 * Simple logger implementation for the neural network package
 */
export class Logger {
	private name: string;

	/**
	 * Creates a new logger instance
	 *
	 * @param name The name of the logger, usually the module name
	 */
	constructor(name: string) {
		this.name = name;
	}

	/**
	 * Logs an informational message
	 *
	 * @param message The message to log
	 */
	info(message: string): void {
		console.log(`[INFO] [${this.name}] ${message}`);
	}

	/**
	 * Logs an error message
	 *
	 * @param message The error message to log
	 */
	error(message: string): void {
		console.error(`[ERROR] [${this.name}] ${message}`);
	}

	/**
	 * Logs a warning message
	 *
	 * @param message The warning message to log
	 */
	warn(message: string): void {
		console.warn(`[WARN] [${this.name}] ${message}`);
	}

	/**
	 * Logs a debug message
	 *
	 * @param message The debug message to log
	 */
	debug(message: string): void {
		console.debug(`[DEBUG] [${this.name}] ${message}`);
	}
}
