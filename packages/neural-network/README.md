# Beancount Neural Network Completion Predictor

This package provides a neural network model for predicting the type of completion needed in Beancount files. It's designed to be used with the Beancount Language Server, but can also be used independently.

## Features

- Predicts the type of completion (account, payee, currency, etc.) based on the current context
- Learns from usage patterns to improve suggestions over time
- Decoupled from LSP implementation, can be used in any TypeScript/JavaScript project
- Full Unicode support for international text (UTF-8)

## Neural Network Architecture

The package uses a feed-forward neural network with the following structure:

- **Input**: Features extracted from the completion context (trigger character, trigger kind, current line text)
- **Processing**: Two fully-connected hidden layers with ReLU activation
- **Output**: Classification of the most likely completion type (account, currency, payee, etc.)

The model handles Unicode text and adapts to your editing patterns over time, providing increasingly relevant suggestions.

## Installation

```bash
npm install @bean-lsp/neural-network
```

## Usage

### Basic Usage

```typescript
import { CompletionNeuralNetwork, CompletionTriggerKind, CompletionType, TriggerInfo } from '@bean-lsp/neural-network';

// Create a new neural network instance
const network = new CompletionNeuralNetwork();

// Predict completion type based on context
const triggerInfo: TriggerInfo = {
	triggerCharacter: ' ', // The character that triggered completion
	triggerKind: CompletionTriggerKind.TriggerCharacter,
	currentLine: '2023-06-15 * "Grocery Store" "Bought food" Expenses:Food:Groceries ',
};

// Get the predicted completion type
const completionType = network.predict(triggerInfo);

console.log(
	'Completion type:',
	completionType === CompletionType.ACCOUNT
		? 'Account'
		: completionType === CompletionType.CURRENCY
		? 'Currency'
		: completionType === CompletionType.PAYEE
		? 'Payee'
		: completionType === CompletionType.NARRATION
		? 'Narration'
		: completionType === CompletionType.TAG
		? 'Tag'
		: completionType === CompletionType.LINK
		? 'Link'
		: completionType === CompletionType.DATE
		? 'Date'
		: 'None',
);

// Train the network with examples
network.train(triggerInfo, CompletionType.CURRENCY);

// Unicode support example
const unicodeContext: TriggerInfo = {
	triggerCharacter: ' ',
	triggerKind: CompletionTriggerKind.TriggerCharacter,
	currentLine: '2023-06-15 * "中国银行" "购买食品" 支出:食品:杂货 ',
};
network.train(unicodeContext, CompletionType.ACCOUNT);
```

### Saving and Loading Models

The neural network state can be saved and loaded:

```typescript
// Save the model to JSON
const modelJson = network.toJSON();
fs.writeFileSync('model.json', modelJson);

// Load the model from JSON
const loadedNetwork = new CompletionNeuralNetwork();
const savedModelJson = fs.readFileSync('model.json', 'utf8');
loadedNetwork.fromJSON(savedModelJson);
```

### Integration with LSP

When used with the Beancount Language Server:

```typescript
import { CompletionNeuralNetwork, CompletionTriggerKind, CompletionType, TriggerInfo } from '@bean-lsp/neural-network';
import { CompletionItem, CompletionItemKind, CompletionParams } from 'vscode-languageserver';

export class NeuralCompletionProvider {
	private network = new CompletionNeuralNetwork();

	// Load the model during initialization
	constructor() {
		try {
			const modelData = fs.readFileSync('model.json', 'utf8');
			this.network.fromJSON(modelData);
		} catch (error) {
			// Model doesn't exist yet, that's ok
		}
	}

	public provideCompletions(params: CompletionParams, document: TextDocument): CompletionItem[] {
		// Extract the current line text
		const position = params.position;
		const lineText = document.getText({
			start: { line: position.line, character: 0 },
			end: position,
		});

		// Create trigger info for the neural network
		const triggerInfo: TriggerInfo = {
			triggerCharacter: params.context?.triggerCharacter,
			triggerKind: params.context?.triggerKind || CompletionTriggerKind.Invoked,
			currentLine: lineText,
		};

		// Get the predicted completion type
		const completionType = network.predict(triggerInfo);

		// Return appropriate completions based on the predicted type
		switch (completionType) {
			case CompletionType.ACCOUNT:
				return this.getAccountCompletions();
			case CompletionType.CURRENCY:
				return this.getCurrencyCompletions();
			// ... handle other completion types
			default:
				return [];
		}
	}

	// Example method to get account completions
	private getAccountCompletions(): CompletionItem[] {
		// Implementation would fetch accounts from Beancount file
		return [
			{ label: 'Assets:Checking', kind: CompletionItemKind.Class },
			{ label: 'Expenses:Food', kind: CompletionItemKind.Class },
			// ...more accounts
		];
	}

	// Example method to get currency completions
	private getCurrencyCompletions(): CompletionItem[] {
		// Implementation would fetch currencies from Beancount file
		return [
			{ label: 'USD', kind: CompletionItemKind.Constant },
			{ label: 'EUR', kind: CompletionItemKind.Constant },
			// ...more currencies
		];
	}
}
```

## Development

### Building the package

```bash
npm run build
```

### Running tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## License

ISC
