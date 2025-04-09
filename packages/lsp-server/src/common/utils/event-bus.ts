import { Emitter } from 'vscode-languageserver';

/**
 * Type definition for event handlers
 */
export type EventHandler<T = any> = (data: T) => void;

/**
 * EventBus for handling application-wide events
 * Works in both Node.js and browser environments
 * Uses vscode-languageserver Emitter for event handling
 */
export class EventBus<Events extends string> {
	private emitters: Map<Events, Emitter<any>>;

	constructor() {
		this.emitters = new Map();
	}

	/**
	 * Get or create an emitter for an event
	 * @param eventName Name of the event
	 * @returns Emitter instance for the event
	 */
	private getEmitter<T>(eventName: Events): Emitter<T> {
		if (!this.emitters.has(eventName)) {
			this.emitters.set(eventName, new Emitter<T>());
		}
		return this.emitters.get(eventName)!;
	}

	/**
	 * Subscribe to an event
	 * @param eventName Name of the event to subscribe to
	 * @param handler Function to be called when the event is emitted
	 * @returns A function that unsubscribes the handler
	 */
	on<T = any>(eventName: Events, handler: EventHandler<T>): () => void {
		const emitter = this.getEmitter<T>(eventName);
		const disposable = emitter.event(handler);

		// Return unsubscribe function
		return () => {
			disposable.dispose();
			// Clean up empty emitters
			if (this.emitters.has(eventName) && !this.hasListeners(eventName)) {
				this.emitters.delete(eventName);
			}
		};
	}

	/**
	 * Check if an event has any listeners
	 * @param eventName Name of the event to check
	 * @returns True if the event has listeners
	 */
	private hasListeners(eventName: Events): boolean {
		// This is a best-effort check as Emitter doesn't expose listener count directly
		// The implementation relies on the cleanup in the unsubscribe function
		return this.emitters.has(eventName);
	}

	/**
	 * Unsubscribe from an event
	 * Note: This is a convenience method. It's more reliable to use the
	 * disposable function returned by the 'on' method.
	 * @param eventName Name of the event to unsubscribe from
	 * @param handler The handler function to remove
	 */
	off(eventName: Events, handler: EventHandler): void {
		// This is a limited implementation as Emitter doesn't provide a direct way
		// to remove a specific listener. The recommended approach is to use
		// the disposable returned by the 'on' method.
		console.warn(
			'EventBus.off() has limited functionality with Emitter. Use the disposable returned by on() instead.',
		);
	}

	/**
	 * Emit an event
	 * @param eventName Name of the event to emit
	 * @param data Data to pass to handlers
	 */
	emit<T = any>(eventName: Events, data?: T): void {
		if (this.emitters.has(eventName)) {
			try {
				this.emitters.get(eventName)!.fire(data!);
			} catch (error) {
				console.error(`Error in event emitter for '${eventName}':`, error);
			}
		}
	}

	/**
	 * Subscribe to an event for a single emission
	 * @param eventName Name of the event to subscribe to
	 * @param handler Function to be called when the event is emitted
	 * @returns A function that unsubscribes the handler
	 */
	once<T = any>(eventName: Events, handler: EventHandler<T>): () => void {
		const emitter = this.getEmitter<T>(eventName);
		let disposable: { dispose: () => void } | null = null;

		const onceHandler = (data: T) => {
			if (disposable) {
				disposable.dispose();
				disposable = null;
				// Clean up empty emitters
				if (this.emitters.has(eventName) && !this.hasListeners(eventName)) {
					this.emitters.delete(eventName);
				}
			}
			handler(data);
		};

		disposable = emitter.event(onceHandler);

		// Return unsubscribe function
		return () => {
			if (disposable) {
				disposable.dispose();
				disposable = null;
				// Clean up empty emitters
				if (this.emitters.has(eventName) && !this.hasListeners(eventName)) {
					this.emitters.delete(eventName);
				}
			}
		};
	}

	/**
	 * Remove all event listeners
	 * @param eventName Optional event name to clear specific event handlers
	 */
	clear(eventName?: Events): void {
		if (eventName) {
			if (this.emitters.has(eventName)) {
				// Create a new emitter (effectively clearing all listeners)
				this.emitters.set(eventName, new Emitter());
			}
		} else {
			// Clear all emitters
			this.emitters.clear();
		}
	}
}

// Create a singleton instance for global event bus
export const globalEventBus = new EventBus<GlobalEvents>();

export const enum GlobalEvents {
	ConfigurationChanged = 'configuration-changed',
}
