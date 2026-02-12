# Beancheck Benchmark Record (main.bean)

## Scope
- Target ledger: `/Users/fengkx/me/code/beancount-assets/main.bean`
- Change set:
  - `/Users/fengkx/me/code/beancount-lsp/packages/lsp-client/pythonFiles/beancheck.py`
  - `/Users/fengkx/me/code/beancount-lsp/packages/lsp-server/src/browser/beancount-worker.ts`
- Date: 2026-02-12

## Python Micro-benchmark (same ledger, same interpreter)
- Interpreter: `/Users/fengkx/.pyenv/versions/3.11.3/bin/python`
- Runs per side: 30
- Baseline output file: `/tmp/beancheck-perf-main-bean/before.perf.json`
- After output file: `/tmp/beancheck-perf-main-bean/after.perf.json`

| Metric | Before (ms) | After (ms) | Change |
| --- | ---: | ---: | ---: |
| mean | 707.572 | 695.700 | -1.68% |
| p50 | 699.903 | 692.363 | -1.08% |
| p95 | 741.259 | 724.437 | -2.27% |
| min | 672.301 | 671.440 | -0.13% |
| max | 868.208 | 732.075 | -15.68% |

## Browser Trace Baseline (provided profile)
- Trace file: `/Users/fengkx/Downloads/Trace-20260212T205739.json`
- Worker UUID: `4388dbe9-9c6c-40d9-89bb-07a1348ddfc6`
- Worker thread id: `65925916`
- Samples (`FunctionCall(wrapper)`, duration > 1s): `3073.125 / 3214.334 / 3382.187 ms`

| Metric | Value (ms) |
| --- | ---: |
| mean | 3223.215 |
| p50 | 3214.334 |
| p95 | 3365.402 |
| min | 3073.125 |
| max | 3382.187 |

## Notes
- This record includes a full before/after micro-benchmark for `run_beancheck()` using the fixed target ledger.
- Browser E2E post-change trace is not captured in this CLI run; use the same worker extraction method against a new trace to complete the E2E comparison.
