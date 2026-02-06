import { Emitter } from 'vscode-languageserver';

/**
 * Type definition for event handlers
 */
export type EventHandler<T = unknown> = (data: T) => void;

/**
 * EventBus for handling application-wide events
 * Works in both Node.js and browser environments
 * Uses vscode-languageserver Emitter for event handling
 */
export class EventBus<Events extends string> {
	private emitters: Map<Events, Emitter<unknown>>;

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
		return this.emitters.get(eventName)! as Emitter<T>;
	}

	/**
	 * Subscribe to an event
	 * @param eventName Name of the event to subscribe to
	 * @param handler Function to be called when the event is emitted
	 * @returns A function that unsubscribes the handler
	 */
	on<T = unknown>(eventName: Events, handler: EventHandler<T>): () => void {
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
	 * Emit an event
	 * @param eventName Name of the event to emit
	 * @param data Data to pass to handlers
	 */
	emit<T = unknown>(eventName: Events, data?: T): void {
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
	once<T = unknown>(eventName: Events, handler: EventHandler<T>): () => void {
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
				// Dispose the existing emitter to clean up all listeners
				const emitter = this.emitters.get(eventName);
				if (emitter) {
					emitter.dispose();
				}
				// Create a new emitter (effectively clearing all listeners)
				this.emitters.set(eventName, new Emitter());
			}
		} else {
			// Dispose all emitters before clearing
			for (const emitter of this.emitters.values()) {
				emitter.dispose();
			}
			// Clear all emitters
			this.emitters.clear();
		}
	}

	/**
	 * Dispose all resources and clean up all event listeners
	 * This method should be called when the EventBus is no longer needed
	 */
	dispose(): void {
		this.clear();
	}
}

// Create a singleton instance for global event bus
export const globalEventBus = new EventBus<GlobalEvents>();

export const enum GlobalEvents {
	ConfigurationChanged = 'configuration-changed',
	BeancountUpdate = 'beancount-update',
	IndexTimeConsumed = 'index-time-consumed',
	/** Emitted when the beancount runtime mode changes (e.g. off -> wasm v2). */
	BeancountModeChanged = 'beancount-mode-changed',
}
