import { beforeEach, describe, expect, it } from 'vitest';
import { CompletionNeuralNetwork, CompletionTriggerKind, CompletionType, TriggerInfo } from '../model/neural-network';

// Let Jest globals be implicitly available
// No need to import them explicitly as Jest will inject them

describe('CompletionNeuralNetwork', () => {
	let network: CompletionNeuralNetwork;

	beforeEach(() => {
		network = new CompletionNeuralNetwork();
	});

	it('should be able to create a neural network instance', () => {
		expect(network).toBeInstanceOf(CompletionNeuralNetwork);
	});

	it('should predict a completion type', () => {
		const triggerInfo: TriggerInfo = {
			triggerCharacter: ' ',
			triggerKind: CompletionTriggerKind.TriggerCharacter,
			currentLine: '2023-06-15 * "Some Payee" "Some narration" Expenses:Food',
		};

		const completionType = network.predict(triggerInfo);
		// New model will default to something, but we don't care what exactly
		expect(Object.values(CompletionType).includes(completionType)).toBe(true);
	});

	it('should be able to train the network', () => {
		const triggerInfo: TriggerInfo = {
			triggerCharacter: ' ',
			triggerKind: CompletionTriggerKind.TriggerCharacter,
			currentLine: '2023-06-15 * "Some Payee" "Some narration" Expenses:Food',
		};

		// Train the network with a specific expected outcome
		const stats = network.train(triggerInfo, CompletionType.CURRENCY);

		// Ensure training stats were returned
		expect(stats).toBeDefined();
		expect(typeof stats.loss).toBe('number');
		expect(typeof stats.cost).toBe('number');
		expect(typeof stats.fwd_time).toBe('number');
		expect(typeof stats.bwd_time).toBe('number');
	});

	it('should predict the expected completion type after training', () => {
		const triggerInfo: TriggerInfo = {
			triggerCharacter: ' ',
			triggerKind: CompletionTriggerKind.TriggerCharacter,
			currentLine: '2023-06-15 * "Some Payee" "Some narration" Expenses:Food',
		};

		// Train the network multiple times with a specific expected outcome
		for (let i = 0; i < 10; i++) {
			network.train(triggerInfo, CompletionType.CURRENCY);
		}

		// After training, the prediction should match what we trained
		const prediction = network.predict(triggerInfo);
		expect(prediction).toBe(CompletionType.CURRENCY);
	});

	it('should be able to serialize and deserialize the model', () => {
		const triggerInfo: TriggerInfo = {
			triggerCharacter: ' ',
			triggerKind: CompletionTriggerKind.TriggerCharacter,
			currentLine: '2023-06-15 * "Some Payee" "Some narration" Expenses:Food',
		};

		// Train the network
		network.train(triggerInfo, CompletionType.CURRENCY);

		// Serialize to JSON
		const json = network.toJSON();
		expect(json).toBeTruthy();
		expect(typeof json).toBe('string');

		// Deserialize into a new network
		const newNetwork = new CompletionNeuralNetwork();
		newNetwork.fromJSON(json);

		// Both networks should predict the same
		const originalPrediction = network.predict(triggerInfo);
		const newPrediction = newNetwork.predict(triggerInfo);
		expect(newPrediction).toBe(originalPrediction);
	});

	it('should return scores for each completion type', () => {
		const triggerInfo: TriggerInfo = {
			triggerCharacter: ' ',
			triggerKind: CompletionTriggerKind.TriggerCharacter,
			currentLine: '2023-06-15 * "Some Payee" "Some narration" Expenses:Food',
		};

		const scores = network.getScores(triggerInfo);

		// We should have one score per completion type
		const expectedLength = Object.keys(CompletionType).length / 2; // Divide by 2 because TS enums have value->key mappings
		expect(scores.length).toBe(expectedLength);

		// All scores should be numbers between 0 and 1
		for (const score of scores) {
			expect(typeof score).toBe('number');
			expect(score).toBeGreaterThanOrEqual(0);
			expect(score).toBeLessThanOrEqual(1);
		}

		// Sum of all scores should be close to 1 (softmax output)
		const sum = scores.reduce((total, score) => total + score, 0);
		expect(sum).toBeCloseTo(1, 1); // Close to 1 with 1 decimal precision
	});

	it('should handle non-ASCII characters in input', () => {
		const triggerInfo: TriggerInfo = {
			triggerCharacter: ' ',
			triggerKind: CompletionTriggerKind.TriggerCharacter,
			currentLine: '2023-06-15 * "中国银行" "购买食品" 支出:食品:杂货',
		};

		// Should not throw any errors
		expect(() => network.predict(triggerInfo)).not.toThrow();

		// Train the network
		const stats = network.train(triggerInfo, CompletionType.ACCOUNT);
		expect(stats).toBeDefined();

		// Should learn the pattern
		for (let i = 0; i < 10; i++) {
			network.train(triggerInfo, CompletionType.ACCOUNT);
		}

		const prediction = network.predict(triggerInfo);
		expect(prediction).toBe(CompletionType.ACCOUNT);
	});
});
