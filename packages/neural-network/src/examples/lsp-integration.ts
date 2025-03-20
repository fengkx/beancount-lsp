/**
 * This is an example file showing how to integrate the neural network
 * with a Language Server Protocol (LSP) implementation.
 *
 * Note: This is for illustration purposes and not intended to be used directly.
 */

import * as fs from 'fs';
import * as path from 'path';
import { CompletionNeuralNetwork, CompletionTriggerKind, CompletionType, Logger, TriggerInfo } from '../index';

// For the purpose of this example, we'll define minimal LSP interfaces
interface Position {
	line: number;
	character: number;
}

interface Range {
	start: Position;
	end: Position;
}

interface TextDocument {
	getText(range?: Range): string;
	positionAt(offset: number): Position;
	offsetAt(position: Position): number;
	lineAt(line: number): { text: string };
}

interface CompletionParams {
	position: Position;
	context?: {
		triggerKind?: number;
		triggerCharacter?: string;
	};
}

interface CompletionItem {
	label: string;
	kind?: number;
	detail?: string;
	documentation?: string;
	insertText?: string;
}

/**
 * Example integration class for the neural network with an LSP server
 */
export class NeuralCompletionIntegration {
	private network: CompletionNeuralNetwork;
	private modelPath: string;
	private logger: Logger;

	/**
	 * Creates a new instance of the neural completion integration
	 *
	 * @param storagePath Path to store the neural network model
	 */
	constructor(storagePath: string) {
		this.logger = new Logger('neural-completion-integration');
		this.modelPath = path.join(storagePath, 'neural-model.json');
		this.network = new CompletionNeuralNetwork();

		// Try to load the model if it exists
		this.loadModel();
	}

	/**
	 * Loads the neural network model from disk
	 */
	private loadModel(): void {
		try {
			if (fs.existsSync(this.modelPath)) {
				const modelData = fs.readFileSync(this.modelPath, 'utf8');
				this.network.fromJSON(modelData);
				this.logger.info('Neural network model loaded successfully');
			} else {
				this.logger.info('No existing neural network model found, starting with a fresh model');
			}
		} catch (error) {
			this.logger.error(
				`Failed to load neural network model: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	/**
	 * Saves the neural network model to disk
	 */
	private saveModel(): void {
		try {
			const modelData = this.network.toJSON();
			fs.writeFileSync(this.modelPath, modelData);
			this.logger.info('Neural network model saved successfully');
		} catch (error) {
			this.logger.error(
				`Failed to save neural network model: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	/**
	 * Predicts the completion type based on the current context
	 *
	 * @param params LSP completion parameters
	 * @param document The text document
	 * @returns The predicted completion type
	 */
	public predictCompletionType(params: CompletionParams, document: TextDocument): CompletionType {
		// Extract information from the LSP request
		const position = params.position;
		const lineText = document.lineAt(position.line).text.substring(0, position.character);

		// Create trigger info for the neural network
		const triggerInfo: TriggerInfo = {
			triggerCharacter: params.context?.triggerCharacter,
			triggerKind: (params.context?.triggerKind || 1) as CompletionTriggerKind,
			currentLine: lineText,
		};

		// Get the predicted completion type
		return this.network.predict(triggerInfo);
	}

	/**
	 * Trains the neural network based on the completion that was actually selected by the user
	 *
	 * @param params LSP completion parameters
	 * @param document The text document
	 * @param selectedCompletionType The type of completion that was selected
	 */
	public trainFromSelection(
		params: CompletionParams,
		document: TextDocument,
		selectedCompletionType: CompletionType,
	): void {
		// Extract information from the LSP request
		const position = params.position;
		const lineText = document.lineAt(position.line).text.substring(0, position.character);

		// Create trigger info for the neural network
		const triggerInfo: TriggerInfo = {
			triggerCharacter: params.context?.triggerCharacter,
			triggerKind: (params.context?.triggerKind || 1) as CompletionTriggerKind,
			currentLine: lineText,
		};

		// Train the network
		this.network.train(triggerInfo, selectedCompletionType);

		// Save the updated model
		this.saveModel();
	}

	/**
	 * Provides completion items based on the predicted type
	 *
	 * @param params LSP completion parameters
	 * @param document The text document
	 * @param items Map of completion items by type
	 * @returns Filtered completion items based on prediction
	 */
	public provideCompletions(
		params: CompletionParams,
		document: TextDocument,
		items: Map<CompletionType, CompletionItem[]>,
	): CompletionItem[] {
		// Predict the most likely completion type
		const predictedType = this.predictCompletionType(params, document);

		// Get confidence scores for all types
		const position = params.position;
		const lineText = document.lineAt(position.line).text.substring(0, position.character);

		const triggerInfo: TriggerInfo = {
			triggerCharacter: params.context?.triggerCharacter,
			triggerKind: (params.context?.triggerKind || 1) as CompletionTriggerKind,
			currentLine: lineText,
		};

		const scores = this.network.getScores(triggerInfo);

		// Log the prediction for debugging
		this.logger.debug(
			`Predicted completion type: ${CompletionType[predictedType]} with confidence: ${
				scores[predictedType].toFixed(2)
			}`,
		);

		// Return items for the predicted type if available
		if (items.has(predictedType)) {
			return items.get(predictedType) || [];
		}

		// Fallback to empty array if no items available
		return [];
	}
}
