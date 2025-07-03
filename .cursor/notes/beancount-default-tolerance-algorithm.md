# Beancount Default Tolerance Algorithm Implementation

## Overview

Implementation of Beancount's default tolerance algorithm in the LSP server diagnostics feature, following the [official specification](https://beancount.github.io/docs/precision_tolerances.html#how-default-tolerances-are-determined).

## What We Fixed

Fixed incorrect default tolerance calculation that was including cost/price annotations. The correct algorithm:

- Only considers **base amounts** of postings  
- **Ignores** all cost and price annotations
- Calculates tolerance as **0.5 × (10^(-precision))** per currency

## Implementation Details

### Key Changes Made

#### 1. Modified `getTolerance()` method
Located in `packages/lsp-server/src/common/features/diagnostics.ts`

```typescript
private getTolerance(postings: Posting[]) {
    if (this.optionsManager.getOption('infer_tolerance_from_cost').asBoolean()) {
        // ... existing cost-based tolerance logic
    } else {
        // NEW: Implement Beancount's default tolerance algorithm
        return this.inferDefaultTolerances(postings);
    }
}
```

#### 2. Added `inferDefaultTolerances()` method

This is the core implementation:

```typescript
private inferDefaultTolerances(postings: Posting[]): Record<string, Big> {
    const tolerances: Record<string, Big> = {};
    const currencyPrecisions: Record<string, number> = {};

    for (const posting of postings) {
        // IMPORTANT: Only process the main amount field
        // Prices and costs are ignored per Beancount documentation
        if (posting.amount) {
            const currency = posting.amount.currency;
            const precision = this.getNumberPrecision(posting.amount.number);
            currencyPrecisions[currency] = Math.max(currencyPrecisions[currency] || 0, precision);
        }
    }

    // Calculate tolerance for each currency
    for (const [currency, precision] of Object.entries(currencyPrecisions)) {
        // Tolerance = 0.5 * (10^(-precision))
        const tolerance = new Big(0.5).mul(new Big(10).pow(-precision));
        tolerances[currency] = tolerance;
    }

    return tolerances;
}
```

#### 3. Added `getNumberPrecision()` helper method

```typescript
private getNumberPrecision(numberStr: string): number {
    if (!numberStr || numberStr.trim() === '') {
        return 0;
    }

    const cleanStr = numberStr.trim();
    const dotIndex = cleanStr.indexOf('.');
    if (dotIndex === -1) {
        return 0; // No decimal point, precision is 0
    }

    // Calculate digits after decimal point
    return cleanStr.length - dotIndex - 1;
}
```

## How It Works: Examples

### Example 1: Basic Transaction
```beancount
2013-04-03 * "Buy Mutual Fund"
  Assets:US:Vanguard:RGAGX       10.22626 RGAGX {37.61 USD}
  Assets:US:Vanguard:Cash         -384.61 USD
```

**Analysis:**
- `RGAGX` amount: `10.22626` (5 decimal places) → Tolerance = 0.5 × 10^(-5) = **0.000005**
- `USD` amount: `-384.61` (2 decimal places) → Tolerance = 0.5 × 10^(-2) = **0.005**
- **Cost ignored**: `{37.61 USD}` is not used for tolerance calculation

### Example 2: From Beancount Documentation
```beancount
1999-09-30 * "Vest ESPP - Bought at discount: 18.5980 USD"
     Assets:US:Schwab:ESPP            54 HOOL {21.8800 USD}
     Income:CA:ESPP:PayContrib  -1467.84 CAD @ 0.6842 USD
     Income:CA:ESPP:Discount     -259.03 CAD @ 0.6842 USD
```

**Analysis:**
- `HOOL` amount: `54` (0 decimal places) → Tolerance = 0.5 × 10^0 = **0.5**
- `CAD` amount: `-1467.84`, `-259.03` (2 decimal places) → Tolerance = 0.5 × 10^(-2) = **0.005**
- **No USD tolerance**: USD only appears in costs/prices, which are ignored

## Testing and Validation

### How to Test

1. **Create test transactions** with different precision levels
2. **Check diagnostic output** to see if balance checking uses correct tolerances
3. **Verify behavior** matches official Beancount tool

### Common Edge Cases

- **Integral numbers**: No decimal point → precision 0 → tolerance 0.5
- **Mixed precision**: Same currency with different precisions → use maximum precision
- **Empty amounts**: Handled gracefully, precision defaults to 0

## Integration Points

### Where This Code Runs

- **File**: `packages/lsp-server/src/common/features/diagnostics.ts`
- **Triggered by**: Document validation when transactions are parsed
- **Used by**: `checkTransactionBalance()` function for balance verification

### Configuration Options

This implementation is controlled by the Beancount option:
- `infer_tolerance_from_cost`: When `false`, uses our default algorithm
- `inferred_tolerance_multiplier`: Only affects cost-based tolerance calculation

## Best Practices for Contributors

### When Modifying This Code

1. **Always test with real Beancount files** to ensure compatibility
2. **Reference the official documentation** for any changes
3. **Consider edge cases** like scientific notation, very long decimals
4. **Test with multiple currencies** to ensure proper isolation

### Code Style Guidelines

- Use **English comments** throughout
- Follow the **existing error handling patterns**
- Keep **tolerance calculations separate** from balance checking logic
- **Document any deviations** from official Beancount behavior

## References

- [Beancount Precision & Tolerances Documentation](https://beancount.github.io/docs/precision_tolerances.html)
- [How Default Tolerances are Determined](https://beancount.github.io/docs/precision_tolerances.html#how-default-tolerances-are-determined)
- Original implementation: `packages/lsp-server/src/common/features/diagnostics.ts`

---

*Last updated: [Current Date]*  
*Contributors: [Your Name]* 