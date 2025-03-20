// Re-export all public types and classes from the neural network model
export {
	CompletionNeuralNetwork,
	CompletionTriggerKind,
	CompletionType,
	type TrainingStats,
	type TriggerInfo,
} from './model/neural-network';

// Re-export logger for external use
export { Logger } from './utils/logger';

// Export the version
export const version = '1.0.0';
