import * as fs from 'fs';
import * as path from 'path';
import {
	CompletionNeuralNetwork,
	CompletionTriggerKind,
	CompletionType,
	TrainingExample,
	TriggerInfo,
} from '../src/model/neural-network';

/**
 * Train the neural network model using generated training data
 */
function trainModel() {
	console.log('Starting neural network training for Beancount completion...');

	// Initialize the neural network
	const model = new CompletionNeuralNetwork();

	// Path to training data
	const trainingDataPath = path.join(__dirname, '../train/training-data.jsonl');

	// Check if training data exists
	if (!fs.existsSync(trainingDataPath)) {
		console.error(`Training data not found at ${trainingDataPath}`);
		console.error('Please run the generate-training-data script first.');
		process.exit(1);
	}

	// Load training data
	const data = fs.readFileSync(trainingDataPath, 'utf8');
	const lines = data.split('\n').filter(line => line.trim().length > 0);

	// Parse JSON lines into training examples
	const examples: TrainingExample[] = lines.map(line => JSON.parse(line));

	console.log(`Loaded ${examples.length} training examples.`);

	// Count examples by type
	const typeCounter = new Map<number, number>();
	for (const example of examples) {
		typeCounter.set(
			example.completionType,
			(typeCounter.get(example.completionType) || 0) + 1,
		);
	}

	// Display distribution of training examples
	console.log('Training data distribution:');
	for (const [type, count] of typeCounter.entries()) {
		const percentage = Math.round((count / examples.length) * 100);
		console.log(`- ${CompletionType[type]}: ${count} examples (${percentage}%)`);
	}

	// Configure training parameters
	const NUM_EPOCHS = 200; // 增加训练轮次至200轮
	const VALIDATION_SPLIT = 0.15; // 15% of data for validation
	const LEARNING_RATE = 0.005; // 降低初始学习率
	const LEARNING_RATE_DECAY = 0.97; // 每10轮学习率衰减3%
	const EARLY_STOPPING_PATIENCE = 15; // 提高早停耐心值

	// Create validation and training sets
	const validationSize = Math.floor(examples.length * VALIDATION_SPLIT);
	const validationExamples = examples.slice(0, validationSize);
	const trainingExamples = examples.slice(validationSize);

	console.log(
		`Training with ${trainingExamples.length} examples, validating with ${validationExamples.length} examples.`,
	);
	console.log(`Training for ${NUM_EPOCHS} epochs...`);

	// Initialize tracking variables
	let bestValidationAccuracy = 0;
	let bestEpoch = 0;
	let noImprovementCount = 0;
	const earlyStoppingThreshold = EARLY_STOPPING_PATIENCE; // 使用新的早停耐心值
	let currentLearningRate = LEARNING_RATE;

	// Train for multiple epochs
	for (let epoch = 1; epoch <= NUM_EPOCHS; epoch++) {
		// 每10轮调整一次学习率
		if (epoch % 10 === 0) {
			currentLearningRate *= LEARNING_RATE_DECAY;
			console.log(`Adjusting learning rate to ${currentLearningRate.toFixed(6)}`);

			// 可以在此处动态调整Toygrad的学习率，但由于API限制，暂不实现
		}

		// 动态调整批处理大小
		const batchSize = Math.min(32, Math.max(1, Math.floor(trainingExamples.length / 10)));

		// Shuffle training examples to prevent overfitting to data order
		shuffleArray(trainingExamples);

		// Train on all examples
		const startTime = Date.now();
		const avgLoss = model.batchTrain(trainingExamples, 1);
		const endTime = Date.now();

		// Calculate training metrics
		const trainAccuracy = evaluateModel(model, trainingExamples);
		const validationAccuracy = evaluateModel(model, validationExamples);

		// Log detailed epoch information
		console.log(`Epoch ${epoch}/${NUM_EPOCHS}:`);
		console.log(`  Training time: ${(endTime - startTime) / 1000}s`);
		console.log(`  Avg Loss: ${avgLoss.toFixed(4)}`);
		console.log(`  Training accuracy: ${(trainAccuracy * 100).toFixed(2)}%`);
		console.log(`  Validation accuracy: ${(validationAccuracy * 100).toFixed(2)}%`);

		// Early stopping check
		if (validationAccuracy > bestValidationAccuracy) {
			bestValidationAccuracy = validationAccuracy;
			bestEpoch = epoch;
			noImprovementCount = 0;

			// Save best model
			model.saveModel(path.join(__dirname, '../models/best-model.json'), 'f32');
			console.log(`  New best model saved! Validation accuracy: ${(bestValidationAccuracy * 100).toFixed(2)}%`);
		} else {
			noImprovementCount++;
			console.log(
				`  No improvement for ${noImprovementCount} epochs. Best: ${
					(bestValidationAccuracy * 100).toFixed(2)
				}% at epoch ${bestEpoch}`,
			);

			if (noImprovementCount >= earlyStoppingThreshold) {
				console.log(`Early stopping after ${epoch} epochs due to no improvement in validation accuracy.`);
				break;
			}
		}

		// Per-type accuracy breakdown every 10 epochs
		if (epoch % 10 === 0 || epoch === NUM_EPOCHS) {
			const typeAccuracy = evaluateModelByType(model, validationExamples);
			console.log('  Accuracy by completion type:');
			for (const [type, accuracy] of Object.entries(typeAccuracy)) {
				const count = typeCounter.get(Number(type)) || 0;
				if (count > 0) {
					console.log(
						`    - ${CompletionType[Number(type)]}: ${(accuracy * 100).toFixed(2)}% (${count} examples)`,
					);
				}
			}
		}
	}

	// Load the best model for final evaluation
	console.log(`Loading best model from epoch ${bestEpoch}...`);
	model.loadModel(path.join(__dirname, '../models/best-model.json'));

	// Evaluate on the entire dataset
	const finalAccuracy = evaluateModel(model, examples);
	console.log(`Final model accuracy: ${(finalAccuracy * 100).toFixed(2)}%`);

	// Save the final model
	model.saveModel(path.join(__dirname, '../models/model.json'), 'f32');
	console.log('Final model saved to models/model.json');

	// Test some examples
	console.log('\nTesting model with a few examples:');
	testModelWithExamples(model);
}

/**
 * Evaluate the model on a set of examples
 */
function evaluateModel(model: CompletionNeuralNetwork, examples: TrainingExample[]): number {
	let correct = 0;

	for (const example of examples) {
		const triggerInfo: TriggerInfo = {
			triggerCharacter: example.triggerChar || undefined,
			triggerKind: example.triggerKind as CompletionTriggerKind,
			currentLine: example.line,
		};

		const prediction = model.predict(triggerInfo);
		if (prediction === example.completionType) {
			correct++;
		}
	}

	return correct / examples.length;
}

/**
 * Evaluate the model on a set of examples and return accuracy by type
 */
function evaluateModelByType(model: CompletionNeuralNetwork, examples: TrainingExample[]): Record<string, number> {
	const correct: Record<string, number> = {};
	const total: Record<string, number> = {};

	// Initialize counters
	for (const type in CompletionType) {
		if (!isNaN(Number(type))) {
			correct[type] = 0;
			total[type] = 0;
		}
	}

	// Evaluate examples
	for (const example of examples) {
		const triggerInfo: TriggerInfo = {
			triggerCharacter: example.triggerChar || undefined,
			triggerKind: example.triggerKind as CompletionTriggerKind,
			currentLine: example.line,
		};

		const prediction = model.predict(triggerInfo);
		const type = example.completionType.toString();

		total[type] = (total[type] || 0) + 1;

		if (prediction === example.completionType) {
			correct[type] = (correct[type] || 0) + 1;
		}
	}

	// Calculate accuracy by type
	const accuracy: Record<string, number> = {};
	for (const type in total) {
		if (total[type]! > 0) {
			accuracy[type] = correct[type]! / total[type]!;
		} else {
			accuracy[type] = 0;
		}
	}

	return accuracy;
}

/**
 * Test the model with a few hand-crafted examples and log results
 */
function testModelWithExamples(model: CompletionNeuralNetwork) {
	const testExamples = [
		{
			description: 'Account completion after transaction',
			triggerInfo: {
				triggerCharacter: ' ',
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				currentLine: '2023-05-15 * "Grocery Store" "Weekly shopping"',
			},
			expectedType: CompletionType.ACCOUNT,
		},
		{
			description: 'Currency completion after amount',
			triggerInfo: {
				triggerCharacter: ' ',
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				currentLine: '2023-05-15 * "Coffee Shop" "Morning coffee"\n    Expenses:Food:Coffee 4.50',
			},
			expectedType: CompletionType.CURRENCY,
		},
		{
			description: 'Tag completion at end of transaction',
			triggerInfo: {
				triggerCharacter: '#',
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				currentLine: '2023-05-15 * "Restaurant" "Dinner with friends" #',
			},
			expectedType: CompletionType.TAG,
		},
		{
			description: 'Partial account name',
			triggerInfo: {
				triggerCharacter: undefined,
				triggerKind: CompletionTriggerKind.Invoked,
				currentLine: '2023-05-15 * "Employer" "Monthly salary"\n    Assets:Che',
			},
			expectedType: CompletionType.ACCOUNT,
		},
		{
			description: 'No completion in a comment',
			triggerInfo: {
				triggerCharacter: undefined,
				triggerKind: CompletionTriggerKind.Invoked,
				currentLine: '; This is a comment',
			},
			expectedType: CompletionType.NONE,
		},
	];

	for (const example of testExamples) {
		const prediction = model.predict(example.triggerInfo);
		const scores = model.getScores(example.triggerInfo);

		console.log(`\nTest: ${example.description}`);
		console.log(`Input: ${example.triggerInfo.currentLine}`);
		console.log(
			`Trigger: ${example.triggerInfo.triggerCharacter || 'None'}, Kind: ${
				CompletionTriggerKind[example.triggerInfo.triggerKind]
			}`,
		);
		console.log(`Predicted: ${CompletionType[prediction]} (Expected: ${CompletionType[example.expectedType]})`);

		// Print top 3 prediction scores
		const scoreEntries = Object.entries(CompletionType)
			.filter(([key]) => !isNaN(Number(key)))
			.map(([key, value]) => ({
				type: value,
				score: scores[Number(key)] || 0,
			}))
			.sort((a, b) => (b.score || 0) - (a.score || 0))
			.slice(0, 3);

		console.log('Top predictions:');
		for (const entry of scoreEntries) {
			console.log(`  - ${entry.type}: ${((entry.score || 0) * 100).toFixed(1)}%`);
		}
	}
}

/**
 * Shuffle an array in place (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): void {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j]!, array[i]!] as [T, T];
	}
}

// Execute the training process
trainModel();
