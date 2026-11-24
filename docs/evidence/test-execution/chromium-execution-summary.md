# Chromium execution summary

## Execution overview

- Repository: `webauto` (absolute local profile path redacted)
- Branch: `main`
- Execution date: 2026-11-24 (timestamps below are UTC)
- Playwright: 1.64.1
- Browser project: `chromium` (Desktop Chrome profile; installed Chromium revision recorded by preflight as `chromium-1248`)
- Worker/retry settings: exactly 1 worker, 0 retries
- Verified target configuration: the preflight-validated configured targets were used without URL overrides. Credentials and target values are intentionally omitted.

## Final approved execution

The first sandboxed attempt was blocked at the network boundary. After the elevated command was approved, the same full suite completed against the configured targets.

- Start: `2026-11-24T19:10:59.0066505Z`
- End: `2026-11-24T19:12:04.4076785Z`
- Exit code: `0`
- Result: **9 passed, 0 failed, 0 skipped**
- Playwright embedded HTML report summary: total 9, expected 9, unexpected 0, flaky 0, skipped 0, `ok: true`.

Process-local settings for this run:

- `ALLOW_DESTRUCTIVE_CLEANUP=true`
- `PLAYWRIGHT_HTML_OUTPUT_DIR=test-results/chromium-step5-2-report-elevated-20261124T190510Z`
- Both variables were restored/removed after the command; the cleanup opt-in was not persisted.

Exact Playwright command:

```powershell
.\node_modules\.bin\playwright.cmd test --project=chromium --workers=1 --retries=0 --output=test-results/chromium-step5-2-output-elevated-20261124T190510Z --reporter=list,html
```

The process-local HTML output override routes this run to a fresh directory. The configured historical `playwright-report` directory was preserved.

## Individual results

| Result | Test |
|---|---|
| Passed | `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts` — TC02: Add a book to the user collection |
| Passed | `tests/ui/smoke/books/TC08-delete-specific-book-from-collection.spec.ts` — TC08: Delete one book and retain the other |
| Passed | `tests/ui/smoke/cart/TC7-add-remove-product.spec.ts` — TC7: Product can be added to and removed from cart |
| Passed | `tests/ui/smoke/inventory/TC2-authenticated-inventory.spec.ts` — TC2: Authenticated user reaches inventory |
| Passed | `tests/ui/smoke/inventory/TC3-display-products.spec.ts` — TC3: Inventory products are displayed |
| Passed | `tests/ui/smoke/inventory/TC4-display-product-names.spec.ts` — TC4: Every product has a visible name |
| Passed | `tests/ui/smoke/inventory/TC5-display-product-prices.spec.ts` — TC5: Every product has a visible price |
| Passed | `tests/ui/smoke/inventory/TC6-sort-products-by-price.spec.ts` — TC6: Products sort by ascending price |
| Passed | `tests/ui/smoke/login/TC1-login-inventory.spec.ts` — TC1: Standard user logs in and views inventory |

## HTML report freshness

- Fresh report: `test-results/chromium-step5-2-report-elevated-20261124T190510Z/index.html`
- Report file timestamp: `2026-11-24T19:12:04.2705710Z`, matching the completed run.
- Inspected the report's embedded ZIP payload and `report.json`; it reports 9 expected results, 0 unexpected, 0 flaky, 0 skipped, and `ok: true`.
- Per-test output path: `test-results/chromium-step5-2-output-elevated-20261124T190510Z`.
- The pre-existing `playwright-report/index.html` remained at its pre-run timestamp (`2026-11-24T18:48:11.0947799Z`). No historical report was cleaned or overwritten.

## Initial sandboxed attempt

For completeness, the first attempt used the same project, worker, retry, and reporter options, with process-local paths `test-results/chromium-step5-2-output-20261124T190510Z` and `test-results/chromium-step5-2-report-20261124T190510Z`.

- Start: `2026-11-24T19:05:32.7068191Z`
- End: `2026-11-24T19:05:52.2031180Z`
- Exit code: `1`; 9 failed, 0 passed, 0 skipped.
- Failure cause: sandbox network denial before assertions: DemoQA API setup returned `connect EACCES`; SauceDemo navigation returned `net::ERR_NETWORK_ACCESS_DENIED`.
- Its report is preserved at `test-results/chromium-step5-2-report-20261124T190510Z/index.html` with per-test failure artifacts in the corresponding output directory. It is superseded by the approved elevated run for the final execution result, not deleted.

## Warnings, limitations, and safety

- The run emitted a Node warning that `NO_COLOR` is ignored when `FORCE_COLOR` is set. This did not affect results.
- The initial sandbox attempt could not reach either configured target; the approved elevated execution subsequently completed all 9 tests successfully.
- `ALLOW_DESTRUCTIVE_CLEANUP=true` was enabled only in the Playwright process environment for each attempt and restored afterward. Test cleanup remained fixture-scoped; no broad cleanup was run.
- No `.env`, `.env.example`, credentials, application code, tests, or repository configuration were changed for execution. The configured target URLs and secret values are not included here.
- The suite performed its intended remote operations: TC02/TC08 fixture-owned DemoQA account and collection operations, and TC7 reversible cart add/remove on the shared public sample identity.
- Post-run `git status --short` showed the pre-existing dirty worktree preserved. `git diff --check` exited 0; Git printed existing LF-to-CRLF conversion warnings and no whitespace errors. No staging, commit, push, reset, discard, or report cleanup occurred.

## Requirement outcome

- Chromium suite execution occurred: **Yes**.
- Final approved Chromium execution passed: **Yes, 9/9**.
- Assignment's Chromium execution requirement: **Satisfied**.
