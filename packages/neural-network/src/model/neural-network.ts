import * as fs from 'fs';
import * as path from 'path';
import * as toygrad from 'toygrad';
import { Logger } from '../utils/logger';

// Create a logger for the neural network module
const logger = new Logger('neural-network');

/**
 * Completion trigger kinds
 * Based on LSP specification but decoupled from it
 */
export enum CompletionTriggerKind {
	/**
	 * Completion was triggered by typing an identifier or manually invoking completion
	 */
	Invoked = 1,

	/**
	 * Completion was triggered by a trigger character
	 */
	TriggerCharacter = 2,

	/**
	 * Completion was re-triggered as the current completion list is incomplete
	 */
	TriggerForIncompleteCompletions = 3,
}

/**
 * Information about the context where completion was triggered
 * Used to determine what kind of completions to provide
 */
export interface TriggerInfo {
	/**
	 * The character that triggered the completion request
	 */
	triggerCharacter: string | undefined;

	/**
	 * The kind of trigger that caused the completion request
	 */
	triggerKind: CompletionTriggerKind;

	/**
	 * The current line text where completion was triggered
	 */
	currentLine: string;
}

/**
 * Completion types that can be suggested by the neural network
 */
export enum CompletionType {
	NONE = 0, // No completion
	ACCOUNT = 1, // Account completion
	CURRENCY = 2, // Currency/commodity completion
	PAYEE = 3, // Payee completion
	NARRATION = 4, // Narration completion
	TAG = 5, // Tag completion
	LINK = 6, // Link completion
	DATE = 7, // Date completion
}

/**
 * Training stats returned after training the model
 */
export interface TrainingStats {
	/**
	 * The loss value after training
	 */
	loss: number;

	/**
	 * The cost (cross-entropy loss) value
	 */
	cost: number;

	/**
	 * Forward pass execution time in milliseconds
	 */
	fwd_time: number;

	/**
	 * Backward pass execution time in milliseconds
	 */
	bwd_time: number;
}

/**
 * Training data example format for storing and loading training examples
 */
export interface TrainingExample {
	/**
	 * The trigger character that triggered completion
	 */
	triggerChar: string | null;

	/**
	 * The trigger kind (1 = Invoked, 2 = TriggerCharacter, 3 = TriggerForIncompleteCompletions)
	 */
	triggerKind: number;

	/**
	 * The current line text
	 */
	line: string;

	/**
	 * The expected completion type
	 */
	completionType: CompletionType;
}

/**
 * Model serialization options
 */
export interface ModelOptions {
	/**
	 * Model layers configuration
	 */
	layers: any[];

	/**
	 * Precision for saving models (reduces size)
	 */
	precision?: string;
}

/**
 * Neural network model for predicting completion types
 */
export class CompletionNeuralNetwork {
	private net: any = null; // Toygrad network
	private trainer: any = null; // Toygrad trainer
	private isInitialized = false;

	// Input dimensions
	private readonly triggerCharsCount = 9; // Number of possible trigger characters
	private readonly triggerKindCount = 3; // Number of possible trigger kinds
	private readonly textInputLength = 100; // Length of text input (last 100 chars)
	private readonly charsetSize = 65536; // Unicode Basic Multilingual Plane (supports most languages)
	private readonly inputDimension: number; // Total input dimension

	// List of possible trigger characters
	private readonly triggerChars = ['2', '#', '"', '^', ' ', 'A', 'L', 'E', 'I'];

	// Default model directory for persistence
	private readonly defaultModelDir = path.join(process.cwd(), 'models');

	/**
	 * Creates a new instance of the completion neural network
	 *
	 * @param modelPath Optional path to a saved model file to load
	 */
	constructor(modelPath?: string) {
		// Calculate total input dimension:
		// - One-hot encoding for trigger characters
		// - One-hot encoding for trigger kinds
		// - Character-level encoding for text (each position can be one of charsetSize characters)
		this.inputDimension = this.triggerCharsCount + this.triggerKindCount + this.textInputLength;

		// Initialize network
		this.initializeNetwork();

		// Load model if path provided
		if (modelPath && this.isInitialized) {
			this.loadModel(modelPath);
		}
	}

	/**
	 * Initialize the Toygrad neural network
	 */
	private initializeNetwork(): void {
		try {
			// Define the network layers according to the Toygrad API
			const layers = [
				// Input layer: features from completion context
				// Using 1D input for our feature vector (1x1xN tensor)
				{
					type: 'input',
					sx: 1,
					sy: 1,
					sz: this.inputDimension,
				},

				// 增加网络宽度和深度，使用更复杂的结构
				// 第一层：256个神经元
				{ type: 'dense', filters: 256 },
				{ type: 'relu' },
				{ type: 'dropout', drop_prob: 0.2 }, // 增加Dropout防止过拟合

				// 第二层：128个神经元
				{ type: 'dense', filters: 128 },
				{ type: 'relu' },
				{ type: 'dropout', drop_prob: 0.1 },

				// 第三层：64个神经元
				{ type: 'dense', filters: 64 },
				{ type: 'relu' },

				// 输出层：使用softmax激活函数，输出每种补全类型的概率
				{ type: 'dense', filters: Object.keys(CompletionType).length / 2 },
				{ type: 'softmax' },
			];

			// Create the network
			this.net = new toygrad.NeuralNetwork({ layers });

			// Create a trainer with reasonable defaults
			this.trainer = new toygrad.Trainers.Adadelta(this.net, {
				batchSize: 4, // 增加批处理大小，提高训练效率
				l2decay: 0.0005, // 降低L2正则化强度，减少过拟合
				learningRate: 0.01, // 基础学习率
				momentum: 0.95, // 增加动量，帮助跳出局部最优解
			});

			this.isInitialized = true;
			logger.info('Neural network initialized successfully with Toygrad');
		} catch (error) {
			logger.error(
				`Failed to initialize neural network: ${error instanceof Error ? error.message : String(error)}`,
			);
			this.isInitialized = false;
		}
	}

	/**
	 * Convert a TriggerInfo object to a feature vector
	 *
	 * @param triggerInfo Information about the completion trigger context
	 * @returns A feature vector for the neural network
	 */
	private extractFeatures(triggerInfo: TriggerInfo): number[] {
		const features: number[] = new Array(this.inputDimension).fill(0);
		let featureIndex = 0;

		// 1. One-hot encode the trigger character
		const triggerCharIndex = this.triggerChars.indexOf(triggerInfo.triggerCharacter || '');
		if (triggerCharIndex >= 0) {
			features[featureIndex + triggerCharIndex] = 1;
		}
		featureIndex += this.triggerCharsCount;

		// 2. One-hot encode the trigger kind
		const triggerKindValue = triggerInfo.triggerKind || CompletionTriggerKind.Invoked;
		// Adjust index because enum starts at 1 but array index starts at 0
		const triggerKindIndex = triggerKindValue - 1;
		if (triggerKindIndex >= 0 && triggerKindIndex < this.triggerKindCount) {
			features[featureIndex + triggerKindIndex] = 1;
		}
		featureIndex += this.triggerKindCount;

		// 3. Encode the text characters (last 100 characters)
		const line = triggerInfo.currentLine || '';
		// Get the last textInputLength characters (or pad with null characters if shorter)
		const textToEncode = line.slice(-this.textInputLength).padStart(this.textInputLength, '\0');

		// Unicode character encoding - for each position, set the value to the normalized code point
		for (let i = 0; i < this.textInputLength; i++) {
			const codePoint = textToEncode.codePointAt(i) || 0;

			// Normalize to [0, 1] range
			// Cap at charsetSize to handle characters outside the Basic Multilingual Plane
			const normalizedValue = Math.min(codePoint, this.charsetSize - 1) / this.charsetSize;
			features[featureIndex + i] = normalizedValue;
		}

		return features;
	}

	/**
	 * Creates a Toygrad Tensor from a feature vector
	 *
	 * @param features The feature vector
	 * @returns Toygrad Tensor instance
	 */
	private createTensorFromFeatures(features: number[]): any {
		// Toygrad's Tensor constructor takes sx, sy, sz and values
		return new toygrad.Tensor(1, 1, features.length, features);
	}

	/**
	 * Trains the neural network with a given example
	 *
	 * @param triggerInfo Information about the completion trigger context
	 * @param expectedType The expected completion type
	 * @returns Training statistics
	 */
	public train(
		triggerInfo: TriggerInfo,
		expectedType: CompletionType,
	): TrainingStats {
		if (!this.isInitialized || !this.net || !this.trainer) {
			this.initializeNetwork();
			if (!this.net || !this.trainer) {
				return { loss: 0, cost: 0, fwd_time: 0, bwd_time: 0 };
			}
		}

		// Extract features from the context
		const features = this.extractFeatures(triggerInfo);

		// Create input tensor
		const x = this.createTensorFromFeatures(features);

		// Train on this example
		const stats = this.trainer.train(x, expectedType);

		// Convert Toygrad's stats to our interface
		return {
			loss: stats.loss,
			cost: stats.cost,
			fwd_time: stats.forwardTime || 0,
			bwd_time: stats.backwardTime || 0,
		};
	}

	/**
	 * Predicts the completion type for a given trigger context
	 *
	 * @param triggerInfo Information about the completion trigger context
	 * @returns The predicted completion type
	 */
	public predict(triggerInfo: TriggerInfo): CompletionType {
		if (!this.isInitialized || !this.net) {
			this.initializeNetwork();
			// Return a default if network is not available
			if (!this.net) {
				return CompletionType.NONE;
			}
		}

		// Extract features from the context
		const features = this.extractFeatures(triggerInfo);

		// Forward pass through the network
		const x = this.createTensorFromFeatures(features);
		const output = this.net.forward(x, false); // isTraining = false

		// Find the index of the highest score
		let maxIndex = 0;
		let maxScore = output.w[0];

		for (let i = 1; i < output.w.length; i++) {
			if (output.w[i] > maxScore) {
				maxScore = output.w[i];
				maxIndex = i;
			}
		}

		return maxIndex as CompletionType;
	}

	/**
	 * Gets confidence scores for each completion type
	 *
	 * @param triggerInfo Information about the completion trigger context
	 * @returns Array of scores for each completion type
	 */
	public getScores(triggerInfo: TriggerInfo): number[] {
		if (!this.isInitialized || !this.net) {
			this.initializeNetwork();
			// Return empty array if network is not available
			if (!this.net) {
				return [];
			}
		}

		// Extract features from the context
		const features = this.extractFeatures(triggerInfo);

		// Forward pass through the network
		const x = this.createTensorFromFeatures(features);
		const output = this.net.forward(x, false); // isTraining = false

		// Return a copy of the scores array
		return Array.from(output.w);
	}

	/**
	 * Saves the model to a JSON string
	 *
	 * @param precision Precision for model weights (reduces file size)
	 * @returns JSON representation of the model
	 */
	public toJSON(precision = 'f16'): string {
		if (!this.isInitialized || !this.net) {
			return '{}';
		}

		try {
			// Get model options using Toygrad serialization
			const layers = this.net.getAsOptions
				? this.net.getAsOptions(precision)
				: this.net.toJSON
				? this.net.toJSON(precision)
				: {};

			// Create a model representation
			const modelOptions = {
				// Include all layer definitions
				layers,
				// Include precision for reference
				precision,
			};

			return JSON.stringify(modelOptions);
		} catch (error) {
			logger.error(`Error serializing model: ${error instanceof Error ? error.message : String(error)}`);
			return '{}';
		}
	}

	/**
	 * Loads the model from a JSON string
	 *
	 * @param json JSON representation of the model
	 */
	public fromJSON(json: string): void {
		try {
			const modelOptions = JSON.parse(json) as ModelOptions;

			if (!this.isInitialized || !this.net) {
				this.initializeNetwork();
				if (!this.net) {
					throw new Error('Failed to initialize neural network');
				}
			}

			// Apply the saved options to the network
			if (this.net.fromOptions && typeof this.net.fromOptions === 'function') {
				this.net.fromOptions(modelOptions.layers);
			} else if (this.net.fromJSON && typeof this.net.fromJSON === 'function') {
				this.net.fromJSON(modelOptions.layers);
			} else {
				// Fallback: recreate the network with the saved options
				logger.warn('Cannot find fromOptions or fromJSON method, reinitializing network');
				this.net = new toygrad.NeuralNetwork({ layers: modelOptions.layers });
				// Reinitialize trainer after net changes
				this.trainer = new toygrad.Trainers.Adadelta(this.net, {
					batchSize: 1,
					l2decay: 0.001,
					learningRate: 0.01,
					momentum: 0.9,
				});
			}

			logger.info('Neural network model loaded successfully from JSON');
		} catch (error) {
			logger.error(
				`Failed to load neural network model from JSON: ${
					error instanceof Error ? error.message : String(error)
				}`,
			);
		}
	}

	/**
	 * Saves the model to a file
	 *
	 * @param filePath Path to save the model to
	 * @param precision Precision for model weights (reduces file size)
	 * @returns True if successful, false otherwise
	 */
	public saveModel(filePath?: string, precision = 'f16'): boolean {
		try {
			if (!this.isInitialized || !this.net) {
				logger.error('Cannot save model: Neural network not initialized');
				return false;
			}

			// Create the models directory if it doesn't exist
			const modelPath = filePath || path.join(this.defaultModelDir, 'model.json');
			const modelDir = path.dirname(modelPath);

			if (!fs.existsSync(modelDir)) {
				fs.mkdirSync(modelDir, { recursive: true });
			}

			// Save the model as JSON
			const modelJSON = this.toJSON(precision);
			fs.writeFileSync(modelPath, modelJSON, 'utf8');

			logger.info(`Neural network model saved to ${modelPath}`);
			return true;
		} catch (error) {
			logger.error(`Failed to save model: ${error instanceof Error ? error.message : String(error)}`);
			return false;
		}
	}

	/**
	 * Loads the model from a file
	 *
	 * @param filePath Path to load the model from
	 * @returns True if successful, false otherwise
	 */
	public loadModel(filePath?: string): boolean {
		try {
			const modelPath = filePath || path.join(this.defaultModelDir, 'model.json');

			if (!fs.existsSync(modelPath)) {
				logger.warn(`Model file not found: ${modelPath}`);
				return false;
			}

			// Load the model JSON
			const modelJSON = fs.readFileSync(modelPath, 'utf8');
			this.fromJSON(modelJSON);

			logger.info(`Neural network model loaded from ${modelPath}`);
			return true;
		} catch (error) {
			logger.error(`Failed to load model: ${error instanceof Error ? error.message : String(error)}`);
			return false;
		}
	}

	/**
	 * Batch train the model on a set of examples
	 *
	 * @param examples Array of training examples
	 * @param epochs Number of times to run through all examples
	 * @returns Average loss across all examples in the last epoch
	 */
	public batchTrain(examples: TrainingExample[], epochs = 1): number {
		if (!this.isInitialized || !this.net || !this.trainer) {
			this.initializeNetwork();
			if (!this.net || !this.trainer) {
				return 0;
			}
		}

		let totalLoss = 0;

		for (let epoch = 0; epoch < epochs; epoch++) {
			totalLoss = 0;

			for (const example of examples) {
				const triggerInfo: TriggerInfo = {
					triggerCharacter: example.triggerChar || undefined,
					triggerKind: example.triggerKind as CompletionTriggerKind,
					currentLine: example.line,
				};

				const stats = this.train(triggerInfo, example.completionType);
				totalLoss += stats.loss;
			}

			const avgLoss = totalLoss / examples.length;
			logger.info(`Epoch ${epoch + 1}/${epochs}, Average Loss: ${avgLoss.toFixed(4)}`);
		}

		return totalLoss / examples.length;
	}

	/**
	 * Load training examples from a JSONL file and train the model
	 *
	 * @param filePath Path to the JSONL file containing training examples
	 * @param epochs Number of epochs to train for
	 * @returns True if training was successful, false otherwise
	 */
	public trainFromFile(filePath: string, epochs = 1): boolean {
		try {
			if (!fs.existsSync(filePath)) {
				logger.error(`Training file not found: ${filePath}`);
				return false;
			}

			// Read the JSONL file
			const content = fs.readFileSync(filePath, 'utf8');
			const lines = content.split('\n').filter(line => line.trim().length > 0);

			// Parse each line as a JSON object
			const examples: TrainingExample[] = lines.map(line => JSON.parse(line));

			if (examples.length === 0) {
				logger.warn('No training examples found in file');
				return false;
			}

			logger.info(`Loading ${examples.length} training examples from ${filePath}`);

			// Train the model on the examples
			const avgLoss = this.batchTrain(examples, epochs);

			logger.info(`Training completed with average loss: ${avgLoss.toFixed(4)}`);

			return true;
		} catch (error) {
			logger.error(`Failed to train from file: ${error instanceof Error ? error.message : String(error)}`);
			return false;
		}
	}
}
