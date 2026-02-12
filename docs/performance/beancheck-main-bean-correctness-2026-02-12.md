# Beancheck Correctness Diff Record (main.bean)

## Scope
- Target ledger: `/Users/fengkx/me/code/beancount-assets/main.bean`
- Baseline output: `/tmp/beancheck-perf-main-bean/before.raw.json`
- After output: `/tmp/beancheck-perf-main-bean/after.raw.json`
- Normalized baseline: `/tmp/beancheck-perf-main-bean/before.norm.json`
- Normalized after: `/tmp/beancheck-perf-main-bean/after.norm.json`
- Normalized diff: `/tmp/beancheck-perf-main-bean/output.diff`

## Normalization Rules
- Sort diagnostics (`errors`, `flags`) by stable keys.
- Sort `general` set-like arrays (`commodities`, `payees`, `narrations`, `tags`, `links`).
- Sort account-level arrays (`currencies`, `balance`, `balance_incl_subaccounts`).
- Sort `pads` by filename, line, and amount tuple.

## Result
- Semantic equality: `true`
- Diff status: `clean` (0 lines)

## Sanity Counts
- `errors`: before=1, after=1
- `flags`: before=0, after=0
- `general.accounts`: before=286, after=286

## Conclusion
- For `/Users/fengkx/me/code/beancount-assets/main.bean`, optimized implementation keeps output semantics unchanged under normalized comparison.
