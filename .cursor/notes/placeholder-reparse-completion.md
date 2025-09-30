# Placeholder Reparse for Completion

## Overview

Placeholder reparse is a universal context detection technique for completions, used to infer the appropriate completion type at the cursor position even when there are no syntax errors.

## How It Works

1. **Insert Placeholder**: Temporarily insert a valid syntax fragment at the cursor position (e.g., `Assets:Bank`, `#tag`, `somekey: "value"`)
2. **Smart Trigger Handling**: Automatically remove trigger characters from placeholder if already typed (e.g., if user typed `#`, use `tag` instead of `#tag`)
3. **Incremental Parse**: Re-parse the document in memory using tree-sitter (without modifying the actual file)
4. **Error Detection**: Check if the parsed tree contains errors - if so, reject this placeholder and try the next
5. **Detect Context**: Check the ancestor node types of the placeholder node to determine the current syntax structure
6. **Provide Completions**: Call the appropriate completion function based on the detected context

## Core API

### `reparseWithPlaceholder()`

```typescript
async function reparseWithPlaceholder(
	document: TextDocument,
	position: Position,
	placeholder: string,
	ancestorTypes?: string[],
): Promise<ReparseContext | null>;
```

**Parameters**:

- `document`: The current text document
- `position`: Cursor position
- `placeholder`: The placeholder text to insert (should be valid syntax for the expected context)
- `ancestorTypes`: (Optional) Array of ancestor node types to look for. If provided, all must exist to return a result; if omitted, accepts any successful parse result

**Returns**:

- Success: `{ placeholderNode, ancestors }` containing the placeholder node and ancestor node map
- Failure: `null`

**Note**: When `ancestorTypes` is omitted, the `ancestors` Map will contain all named ancestors from the placeholder node to the root, useful for debugging and logging.

### `findNamedAncestor()`

```typescript
function findNamedAncestor(
	node: Parser.SyntaxNode | null,
	type: string,
): Parser.SyntaxNode | null;
```

Finds the nearest named ancestor node of the specified type.

## Usage Examples

### Scenario 1: Posting Account Completion

```typescript
const postingCtx = await reparseWithPlaceholder(
  document,
  position,
  'Assets:Bank',           // Placeholder: an account name
  ['posting', 'transaction'] // Required ancestors: posting and transaction
);

if (postingCtx) {
  // Detected posting position within a transaction
  // Provide account completions
  await addAccountCompletions(...);
}
```

**Use Case**:

```beancount
2025-09-26 * "Payee" "Narration"
    Expenses:Food 100.00 CNY
    Assets:Bank -100.00 CNY
    <cursor here>  ← Can continue adding posting
```

### Scenario 2: Metadata Key-Value Completion

```typescript
const kvCtx = await reparseWithPlaceholder(
	document,
	position,
	'somekey: "value"', // Placeholder: key-value pair
	['key_value', 'transaction'], // Required ancestors
);

if (kvCtx) {
	// Detected metadata key-value line
	// Can provide metadata key completions
}
```

**Use Case**:

```beancount
2025-09-26 * "Payee" "Narration"
    <cursor>  ← Can input metadata key
    Expenses:Food 100.00 CNY
```

### Scenario 3: Tags/Links Completion

```typescript
const tagsCtx = await reparseWithPlaceholder(
  document,
  position,
  '#tag',                  // Placeholder: tag
  ['tags_links', 'transaction']
);

if (tagsCtx) {
  // Detected tags/links line
  await addTagCompletions(...);
}
```

**Use Case**:

```beancount
2025-09-26 * "Payee" "Narration"
    <cursor>  ← Can input #tag or ^link
    Expenses:Food 100.00 CNY
```

### Scenario 4: Price Annotation Completion

```typescript
// First check if line ends with @ or @@
const hasAtSign = headText.trim().match(/@@?$/);
if (hasAtSign) {
  const priceCtx = await reparseWithPlaceholder(
    document,
    position,
    '100.00 CNY',          // Placeholder: amount
    ['price_annotation', 'posting']
  );
  
  if (priceCtx) {
    // Detected price annotation position
    await addCurrencyCompletions(...);
  }
}
```

**Use Case**:

```beancount
2025-09-26 * "Payee" "Narration"
    Expenses:Food 10 USD @<cursor>  ← Can input exchange rate amount
```

## Non-Indented Scenarios (Directive-level)

### Scenario 5: poptag/pushtag Directives

```typescript
const directive = headText.trim().split(/\s+/)[0]?.toLowerCase();

if (directive === 'poptag') {
  const ctx = await reparseWithPlaceholder(
    document,
    position,
    '#tag',
    ['poptag']
  );
  
  if (ctx) {
    await addTagCompletions(...);
  }
}
```

**Use Case**:

```beancount
pushtag #project-a
2025-09-26 * "Expense" "..." #project-a
poptag <cursor>  ← Complete tag, no indentation
```

### Scenario 6: note/balance/close/pad/document Directives

```typescript
const accountDirectives = ['note', 'balance', 'close', 'pad', 'document'];

if (accountDirectives.includes(directive)) {
  const ctx = await reparseWithPlaceholder(
    document,
    position,
    'Assets:Bank',
    [directive]  // Only check the directive itself
  );
  
  if (ctx) {
    await addAccountCompletions(...);
  }
}
```

**Use Case**:

```beancount
2025-09-26 note <cursor>  ← Complete account, no indentation
2025-09-26 balance <cursor> 100.00 CNY
2025-09-26 close <cursor>
```

### Scenario 7: popmeta Directive

```typescript
if (directive === 'popmeta') {
	const ctx = await reparseWithPlaceholder(
		document,
		position,
		'somekey:',
		['popmeta'],
	);

	if (ctx) {
		// Can complete metadata key
	}
}
```

**Use Case**:

```beancount
pushmeta project: "Project A"
2025-09-26 * "Expense" "..."
popmeta <cursor>  ← Complete metadata key, no indentation
```

## Extending Completion Contexts

To support new completion types, simply add a new entry to the `scenarios` array:

```typescript
const scenarios: CompletionScenario[] = [
  // ... existing scenarios ...
  
  // New: Date completion
  {
    placeholder: '2025-01-01',
    onSuccess: async () => {
      await addDateCompletions(...);
    },
    description: 'date',
  },
  
  // New: String completion (payee/narration)
  {
    placeholder: '"some text"',
    onSuccess: async () => {
      await addPayeeNarrationCompletions(...);
    },
    description: 'string',
  },
];
```

**It's that simple!** No need to:

- ❌ Determine what directive we're in
- ❌ Check for indentation
- ❌ Maintain directive-to-handler mappings

The syntax tree automatically handles all complex context detection.

### Current Scenarios in Implementation

The actual implementation includes the following scenarios (in priority order):

1. **Account completions** - `placeholder: 'Assets:Bank'`
   - Works in: posting, directives (note, balance, close, pad, document), etc.
2. **Tag completions** - `placeholder: '#tag'`
   - Works in: tags_links, pushtag, poptag, transaction lines
3. **Currency completions** - `placeholder: ' CNY'` (note the space prefix)
   - Works in: price_annotation, amount after numbers
4. **Link completions** - `placeholder: '^link'`
   - Works in: tags_links, transaction lines
5. **Metadata key-value** - `placeholder: 'somekey: "value"'`
   - Works in: key_value contexts (placeholder for future implementation)

## Implementation Architecture

### Universal Try Strategy

**Core Idea**: Instead of pre-determining specific directives or contexts, define a set of common completion scenarios and try them one by one, letting the syntax tree tell us which one fits.

```typescript
const scenarios: CompletionScenario[] = [
	{ placeholder: 'Assets:Bank', onSuccess: addAccountCompletions },
	{ placeholder: '#tag', onSuccess: addTagCompletions },
	{ placeholder: ' CNY', onSuccess: addCurrencyCompletions }, // Note: space prefix for currency
	{ placeholder: '^link', onSuccess: addLinkCompletions },
	{ placeholder: 'somekey: "value"', onSuccess: addMetadataCompletions },
];

// Try each until one succeeds
for (const scenario of scenarios) {
	// Smart trigger handling: remove trigger char from placeholder if already typed
	const actualPlaceholder = scenario.placeholder[0] === info.triggerCharacter
		? scenario.placeholder.slice(1)
		: scenario.placeholder;

	const ctx = await reparseWithPlaceholder(document, position, actualPlaceholder);
	if (ctx) {
		await scenario.onSuccess(ctx);
		if (completionItems.length > 0) break; // Success, stop
	}
}
```

### Advantages

1. **Zero Assumptions**: No need to pre-determine the current directive or context
2. **Auto-Adaptation**: The syntax tree automatically rejects invalid placeholders
3. **Easy Extension**: Adding new completion types only requires appending to the `scenarios` array
4. **Unified Handling**: Same logic handles indented/non-indented, inside/outside transactions

## Performance Considerations

- ✅ Uses in-memory parsing, doesn't modify files
- ✅ Automatic cleanup of temporary syntax tree (`vt.delete()` in `finally` block)
- ✅ Short-circuit evaluation: stops immediately after a scenario successfully adds completion items
- ✅ Only used as fallback when regular completion fails
- ✅ Scenario order optimization: most common types (like accounts) are tried first
- ✅ Error detection: immediately rejects trees with syntax errors (`vt.rootNode.hasError()`), avoiding wasted processing
- ✅ Smart trigger handling: avoids duplicate trigger characters in placeholder, reducing parse failures

## Limitations and Considerations

1. **Placeholder Selection is Critical**: Must be valid syntax for the context, or it may parse to the wrong node
2. **Ancestor Detection Order**: More specific ancestors better pinpoint the context
3. **Performance Overhead**: Each detection requires a full parse; suggest limiting detection attempts
4. **Not All Scenarios Supported**: Highly dynamic or complex syntax structures may need additional context

## Debugging Tips

Enable debug logging to see the detection process:

```typescript
logger.info(`Fallback: posting/account context, added ${count} items`);
logger.info('Fallback: key_value context detected');
logger.debug(`Placeholder reparse failed: ${e}`);
```

Check the returned `ReparseContext`:

```typescript
const ctx = await reparseWithPlaceholder(...);
if (ctx) {
  console.log('Placeholder node:', ctx.placeholderNode.type);
  console.log('Ancestors:', Array.from(ctx.ancestors.keys()));
}
```

## Real-World Implementation Details

### Smart Trigger Handling

The implementation automatically handles trigger characters to avoid duplicates:

```typescript
// In the fallback loop
const actualPlaceholder = scenario.placeholder[0] === info.triggerCharacter
	? scenario.placeholder.slice(1) // Remove trigger if already typed
	: scenario.placeholder;

const ctx = await reparseWithPlaceholder(document, position, actualPlaceholder);
```

**Example**: When user types `#` and triggers completion:

- Placeholder `#tag` becomes `tag` (avoiding `##tag`)
- Placeholder `Assets:Bank` stays unchanged

### Smart Tag/Link Prefix Insertion

The completion functions use `currentLine` to determine if they need to add the `#` or `^` prefix:

```typescript
async function addTagCompletions(..., currentLine?: string) {
  const tags = await symbolIndex.getTags();
  
  // Only add # prefix if the line doesn't already end with #
  const shouldAddPrefix = currentLine && !currentLine.endsWith('#');
  
  tags.forEach((tag: string) => {
    addCompletionItem(
      { label: tag, kind: CompletionItemKind.Property, detail: '(tag)' },
      position,
      shouldAddPrefix ? `#${tag}` : tag,  // Smart prefix insertion
      // ...
    );
  });
}
```

This ensures:

- When typing `#pro<cursor>`, completes to `#project` (no extra `#`)
- When typing `<cursor>` in a tag context, completes to `#project` (adds `#`)

### Error Tree Rejection

The reparse function immediately rejects trees with syntax errors:

```typescript
async function reparseWithPlaceholder(...) {
  // ... parse virtual text ...
  vt = parser.parse(virtualText);
  
  if (vt.rootNode.hasError()) {
    return null;  // Reject invalid parse immediately
  }
  
  // ... continue with context detection ...
}
```

This optimization prevents processing of invalid syntax trees, improving performance.
