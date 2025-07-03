# Default Tolerance Algorithm Implementation

## Overview

Implementation of a default tolerance algorithm in the LSP server diagnostics feature, inspired by [Beancount's specification](https://beancount.github.io/docs/precision_tolerances.html#how-default-tolerances-are-determined) but with a more conservative approach.

## Algorithm Description

Our default tolerance algorithm implementation:

- Only considers **base amounts** of postings  
- **Ignores** all cost and price annotations
- Uses **highest precision** when multiple precisions exist for same currency (most restrictive approach)
- Calculates tolerance as **0.5 × (10^(-precision))** per currency  
- **Skips integer amounts** (no tolerance inferred for precision 0)

> **Note**: This differs from the official Beancount specification, which uses the "coarsest" (largest) tolerance. Our implementation is more conservative, using the smallest tolerance for stricter validation.
> 
> **Why more restrictive?** Using the highest precision ensures that balance checking is as strict as the most precise amounts in the transaction, catching smaller rounding errors that might otherwise be missed.


## How It Works: Examples

### Example 1: Basic Transaction
```beancount
2013-04-03 * "Buy Mutual Fund"
  Assets:US:Vanguard:RGAGX       10.22626 RGAGX {37.61 USD}
  Assets:US:Vanguard:Cash         -384.61 USD
```

**Analysis:**
- `RGAGX` amount: `10.22626` (precision 5) → Tolerance = 0.5 × 10^(-5) = **0.000005 RGAGX**
- `USD` amount: `-384.61` (precision 2) → Tolerance = 0.5 × 10^(-2) = **0.005 USD**
- **Cost ignored**: `{37.61 USD}` is not used for tolerance calculation

### Example 2: From Beancount Documentation
```beancount
1999-09-30 * "Vest ESPP - Bought at discount: 18.5980 USD"
     Assets:US:Schwab:ESPP            54 HOOL {21.8800 USD}
     Income:CA:ESPP:PayContrib  -1467.84 CAD @ 0.6842 USD
     Income:CA:ESPP:Discount     -259.03 CAD @ 0.6842 USD
```

**Analysis:**
- `HOOL` amount: `54` (integer, precision 0) → No tolerance needed for HOOL
- `CAD` amounts: `-1467.84`, `-259.03` (both precision 2) → Tolerance = 0.5 × 10^(-2) = **0.005 CAD**
- **No USD tolerance**: USD only appears in costs/prices, which are ignored

## Algorithm Behavior

### How to Test

1. **Create test transactions** with different precision levels
2. **Check diagnostic output** to see if balance checking uses correct tolerances
3. **Compare strictness** with official Beancount tool (ours will be more restrictive)

### Resolving Ambiguities

When multiple different precisions exist for the same currency, the **highest** precision is selected, which gives the most restrictive (smallest) tolerance:

```beancount
1999-08-20 * "Sell"
  Assets:US:BRS:ESPP           -81 HOOL {26.3125 USD}
  Assets:US:BRS:Cash       2141.36 USD    ; precision 2
  Expenses:Financial:Fees     0.08 USD    ; precision 2
  Income:CA:ESPP:PnL       -10.125 USD    ; precision 3
```

**Analysis**: 
- USD precisions found: 2, 2, 3
- Highest precision: `max(2, 2, 3) = 3`
- **Result**: Uses tolerance **0.0005 USD** (most restrictive)

**Special case with integers**:
```beancount
2023-01-01 * "Mixed precision"
  Assets:Cash              100 USD        ; precision 0 (integer)
  Assets:Checking       100.5 USD        ; precision 1
  Assets:Savings      100.55 USD        ; precision 2
```

**Analysis**:
- USD precisions found: 0, 1, 2  
- Highest precision: `max(0, 1, 2) = 2`
- **Result**: Uses tolerance **0.005 USD** (precision 2)

### Common Edge Cases

- **All integers**: When all amounts are integers (precision 0) → **No tolerance inferred**
- **Mixed with integers**: Integers participate in precision comparison, but if highest precision > 0, tolerance is still calculated
- **Decimal only**: Uses the highest precision found → **most restrictive tolerance**
- **Empty amounts**: Handled gracefully, precision defaults to 0

## Configuration & Integration

### Configuration Options

- `infer_tolerance_from_cost`: When `false`, uses our default algorithm
- `inferred_tolerance_multiplier`: Only affects cost-based tolerance calculation

### Integration Points

- **File**: `packages/lsp-server/src/common/features/diagnostics.ts`
- **Triggered by**: Document validation when transactions are parsed
- **Used by**: `checkTransactionBalance()` function for balance verification

## References

- [Beancount Precision & Tolerances Documentation](https://beancount.github.io/docs/precision_tolerances.html) (inspiration for algorithm)
- [How Default Tolerances are Determined](https://beancount.github.io/docs/precision_tolerances.html#how-default-tolerances-are-determined) (original specification)
- Implementation: `packages/lsp-server/src/common/features/diagnostics.ts`

---

*Documentation for internal LSP implementation* 