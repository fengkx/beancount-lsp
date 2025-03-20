# Neural Network Development Guide

This document provides information about the development of the neural network package for Beancount LSP.

## Project Structure

```
packages/neural-network/
├── dist/               # Compiled output (generated)
├── src/                # Source code
│   ├── __tests__/      # Test files
│   ├── examples/       # Example usage
│   ├── model/          # Neural network model
│   ├── utils/          # Utility functions
│   └── index.ts        # Main entry point
├── scripts/            # Build scripts
├── package.json        # Package configuration
├── tsconfig.json       # TypeScript configuration
├── vitest.config.ts    # Vitest test configuration
├── README.md           # User documentation
└── DEVELOPMENT.md      # This file
```

## Development Workflow

1. **Setup**: Run `npm install` to install dependencies.
2. **Development**: Make changes to the code in the `src` directory.
3. **Testing**: Run `npm test` to run the test suite or `npm run test:watch` for watch mode.
4. **Building**: Run `npm run build` to compile the TypeScript code.
5. **Packaging**: Run `npm run build:pack` to create a distributable package.

## Neural Network Design

The neural network is designed to predict the type of completion needed in Beancount files. It takes into account:

1. **Trigger Character**: The character that triggered the completion request (e.g., space, quote, etc.).
2. **Trigger Kind**: The kind of trigger (invoked, trigger character, incomplete completions).
3. **Current Line**: The text of the current line up to the cursor position.

### Input Features

The network uses the following features:

- One-hot encoding of the trigger character
- One-hot encoding of the trigger kind
- Character-level encoding of the last 100 characters of the current line

### Neural Network Architecture

The network architecture is built using the ConvNetJS library, which provides a flexible framework for defining neural networks:

#### Network Structure

1. **Input Layer**:
   ```javascript
   { type: 'input', out_sx: 1, out_sy: 1, out_depth: inputDimension }
   ```
   - The parameters `out_sx: 1, out_sy: 1` define a 1x1 "image" for each feature
   - `out_depth: inputDimension` specifies the total number of features (trigger chars + trigger kinds + text encoding)
   - This structure is used because ConvNetJS was originally designed for image processing with 2D inputs plus depth, but we're adapting it for our 1D feature vector by setting width and height to 1
   - All our features are effectively stacked in the depth dimension, making it a 1D vector with length equal to `inputDimension`

2. **Hidden Layers**:
   ```javascript
   { type: 'fc', num_neurons: 128, activation: 'relu' }
   { type: 'fc', num_neurons: 64, activation: 'relu' }
   ```
   - Two fully connected (`fc`) layers with decreasing neuron counts (128 → 64)
   - ReLU activation functions provide non-linearity and avoid the vanishing gradient problem
   - This multi-layer design allows the network to learn increasingly abstract representations

3. **Output Layer**:
   ```javascript
   { type: 'softmax', num_classes: CompletionType count }
   ```
   - Softmax layer outputs probabilities across all possible completion types
   - Each output neuron corresponds to one CompletionType
   - The class with the highest probability is selected as the prediction

#### Design Rationale

- **Flattened Input Representation**: Although language is sequential, we use a flattened representation (1x1xD) because:
  1. It simplifies the model architecture
  2. The context window (100 chars) is small enough to be processed effectively without recurrence
  3. The position information is implicitly preserved in the order of the features

- **Fully Connected Layers**: We use fully connected layers rather than convolutional layers because:
  1. Our input is not truly spatial like images
  2. We want the network to learn associations between any features regardless of position
  3. The feature space is relatively small, making fully connected layers computationally feasible

- **Training Method**: We use the 'adadelta' optimizer which:
  1. Adapts the learning rate automatically
  2. Works well for online learning scenarios (learning from user interactions)
  3. Requires minimal hyperparameter tuning

This architecture strikes a balance between simplicity (making it fast enough for real-time use) and expressiveness (allowing it to learn complex patterns in Beancount syntax).

### Unicode Support

The neural network supports Unicode text input, including:

- Full UTF-8 character encoding
- Support for non-ASCII characters (e.g., Chinese, Japanese, Korean, etc.)
- Uses null character (`\0`) for padding instead of spaces to avoid confusion with space characters in training data

### Training

The network is trained on-the-fly as the user works with Beancount files. When a user selects a completion item, the network learns the association between the context and the completion type.

## Integration with LSP

The neural network package is designed to be used with the Beancount Language Server, but can also be used independently. See the example in `src/examples/lsp-integration.ts` for how to integrate it with an LSP server.

## Future Improvements

1. **Better Feature Extraction**: More sophisticated features could be extracted from the context, such as the position in the line, the previous line, etc.
2. **Model Persistence**: Implement better model persistence with versioning and migration.
3. **Training Data Collection**: Add tools to collect and analyze training data.
4. **Performance Optimizations**: Optimize the network for better performance.
5. **Alternative Models**: Experiment with different architectures or approaches.
6. **Advanced Architectures**: Consider recurrent or transformer-based models for better understanding of the sequence nature of the data.

## Release Process

1. Update the version in `package.json`.
2. Run `npm run build:pack` to create a distributable package.
3. Publish the package with `npm publish ./dist/bean-lsp-neural-network-[version].tgz`.

## Contributing

When contributing to this package, please:

1. Add tests for any new functionality.
2. Update documentation to reflect changes.
3. Ensure all tests pass before submitting a pull request.
4. Follow the existing code style.
5. Make sure to test with different character sets, including non-ASCII text.
