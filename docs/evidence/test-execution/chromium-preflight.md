# Chromium preflight

## 1. Environment and browser

- Repository: `webauto` (absolute local profile path redacted)
- Shell/platform: Windows PowerShell
- Playwright: 1.64.1
- Enabled browser project: `chromium` (Desktop Chrome device profile)
- No Playwright test, remote API call, account creation/deletion, or cleanup was run during this preflight.

## 2. Chromium installation status

**PASS** — `node_modules/.bin/playwright.cmd install --list` reports Chromium revision `chromium-1248` and `chromium_headless_shell-1248`. Both corresponding browser directories exist under the Playwright browser cache. No browser installation was performed.

## 3. Playwright project configuration

| Check | Observed | Status |
|---|---|---|
| Test discovery root | `testDir: './tests'`; no explicit `testMatch` or `testIgnore` narrows the default scope. | PASS |
| Browser project | One enabled project, `chromium`, using `Desktop Chrome`. | PASS |
| HTML reporter | Configured alongside the list reporter; `outputFolder: 'playwright-report'`, `open: 'never'`. | PASS |
| Global timeout | 30,000 ms; both DemoQA book specs override it to 60,000 ms. | PASS |
| Retries | 0 when `CI` is unset locally; 2 when `CI` is set. | PASS |
| CI workers | Workflow sets `CI: 'true'`; config selects `workers: 1`. | PASS |
| Local workers | `CI` was unset in the current local process, so `workers` remains `undefined` and Playwright uses its local default. No local worker config was changed. | PASS |
| Parallel mode | `fullyParallel: true`; single-worker CI policy is documented at the worker setting. | PASS |

## 4. Environment variable validation

Names and status only; values were not printed, copied, or included in this report.

| Variable | Observed status | Configuration behavior |
|---|---|---|
| `BASE_URL` | PRESENT, valid HTTP(S) URL | Required by `getEnvironment()` and the Playwright config. |
| `DEMOQA_BASE_URL` | Not set; valid configured default is used | Optional in config; default is validated as an HTTP(S) URL. |
| `TEST_USERNAME` | PRESENT | Required only by flows calling `getTestCredentials()`. Presence was checked; authentication was not attempted. |
| `TEST_PASSWORD` | PRESENT | Required only by flows calling `getTestCredentials()`. Presence was checked; authentication was not attempted. |
| `ALLOW_DESTRUCTIVE_CLEANUP` | UNSET in the local environment; defaults to false | The local fixture cleanup path requires an explicit true opt-in if a non-empty collection is to be bulk-cleared. |
| `CI` | UNSET in the local process | Local worker configuration remains unchanged. |

For `playwright test --project=chromium --list`, `ALLOW_DESTRUCTIVE_CLEANUP=true` was set only in that command's temporary process environment and restored immediately afterward. This was a discovery command, not test execution. No `.env` file was edited. The later Chromium execution must use a temporary process-level opt-in (and a single worker for the local full-suite run); do not rely on the unset default.

## 5. Cleanup guard readiness

**PASS** — The fixture reads `allowDestructiveCleanup` from the validated environment configuration. It checks the flag before collection bulk deletion and records a cleanup error when disabled. Its API ability is bound to the user created by that fixture; the collection request is scoped to that user's ID, and account deletion targets that same created ID. The cleanup guard was not bypassed to contact the application. Step 4's local mock check established both helper branches without remote operations; this preflight did not repeat that check.

The full suite contains intended mutations: TC02 adds a book and removes fixture-owned data during teardown; TC08 seeds/deletes books in its fixture-owned collection and then deletes that fixture-created account; TC7 adds and removes one cart item using the shared public SauceDemo sample identity. No global account enumeration, broad account cleanup, or unrelated destructive operation was found in the inspected suite. TC7's shared cart is a data-isolation constraint; the one-worker execution policy reduces in-suite overlap, but does not prove isolation from other external runs.

## 6. Test discovery results

Command: `node_modules/.bin/playwright.cmd test --project=chromium --list`

The command completed successfully and listed **9 tests in 9 files**. It did not execute tests.

| Discovered spec | Test |
|---|---|
| `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts` | TC02: Add a book to the user collection |
| `tests/ui/smoke/books/TC08-delete-specific-book-from-collection.spec.ts` | TC08: Delete one book and retain the other |
| `tests/ui/smoke/cart/TC7-add-remove-product.spec.ts` | TC7: Product can be added to and removed from cart |
| `tests/ui/smoke/inventory/TC2-authenticated-inventory.spec.ts` | TC2: Authenticated user reaches inventory |
| `tests/ui/smoke/inventory/TC3-display-products.spec.ts` | TC3: Inventory products are displayed |
| `tests/ui/smoke/inventory/TC4-display-product-names.spec.ts` | TC4: Every product has a visible name |
| `tests/ui/smoke/inventory/TC5-display-product-prices.spec.ts` | TC5: Every product has a visible price |
| `tests/ui/smoke/inventory/TC6-sort-products-by-price.spec.ts` | TC6: Products sort by ascending price |
| `tests/ui/smoke/login/TC1-login-inventory.spec.ts` | TC1: Standard user logs in and views inventory |

**PASS** — TC02 and TC08 are present. No `test.only`, `test.skip`, `describe.only`, `describe.skip`, or config-level `grep`/`testIgnore` exclusion was found. The `test:smoke` package script has a `--grep @smoke` filter, but it was not used; the preflight listed the full `./tests` scope.

## 7. HTML report configuration

**PASS** — HTML output is configured at `playwright-report` and is set not to open automatically. `--list` does not execute tests or generate a new HTML test report. Existing report directories/files were not cleaned, removed, or modified by this preflight.

## 8. Git worktree status

**PASS** — The worktree was already dirty before this preflight, with existing modified and untracked Skill, test-tag, configuration, and evidence files. Those changes were preserved. No staging, commit, push, reset, discard, or report cleanup occurred. `git diff --check` completed with exit code 0; Git printed existing LF-to-CRLF conversion warnings and no whitespace errors. This preflight adds only this evidence document.

## 9. Blockers and limits

- No browser installation, environment-presence, or test-discovery blocker was found.
- `TEST_USERNAME`/`TEST_PASSWORD` variable presence is verified, but remote authentication was intentionally not attempted.
- Local cleanup guard is unset and safely defaults false. The eventual local test command must explicitly enable it for fixture-owned collection cleanup, using a temporary process-level setting.
- Local workers remain at Playwright's default because `CI` is unset. Use a one-worker command setting for the eventual local full-suite execution to match the approved remote-service policy; do not change repository local worker configuration.
- TC7 uses the shared public SauceDemo sample identity for reversible cart add/remove actions. The one-worker policy limits overlap within that run; external concurrent runs are outside this preflight's verification.
- Remote application availability and behavior were not tested.

## 10. Final execution readiness

The Chromium browser is installed, the Chromium project and report configuration are valid, required environment variable names are present, and the full test discovery list contains the expected nine specs. The cleanup guard must be enabled only for the later execution through a temporary process-level setting. For a local full-suite run, use one worker at the command level to match the approved CI policy while keeping local configuration unchanged. This preflight did not run tests or verify remote behavior.

**READY FOR CHROMIUM EXECUTION**
