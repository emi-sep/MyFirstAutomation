# Phase 3 and Phase 4 execution evidence

This record separates the earlier Phase 3 run from the Phase 4 remediation run. Tests were not inferred from source code or from a stale report.

## Phase 4 validation — current remediation run

| Check | Result | Evidence |
|---|---|---|
| TypeScript | Passed | `npm.cmd run typecheck` completed with exit code 0 after the Phase 4 source changes. |
| Playwright discovery | Passed | `npx.cmd playwright test --list` discovered 9 tests in 9 files, all in the Chromium project. |
| TC08 semantic locator and cleanup check | Passed | `npx.cmd playwright test tests/ui/smoke/books/TC08-delete-specific-book-from-collection.spec.ts --project=chromium --workers=1`: 1 passed. The run used the accessible dialog locator, standard TLS verification, account creation, and fixture cleanup. |
| Full Chromium suite | Passed | `npm.cmd run test:chromium -- --workers=2`: 9 passed in 36.1 seconds. Both DemoQA scenarios and all seven SauceDemo scenarios passed. |
| HTML report | Generated and inspected | `playwright-report/index.html`, generated 2026-11-17 at 19:57 local time. Embedded `report.json`: project `chromium`, 9 files, 9 expected, 0 unexpected, 0 flaky, 0 skipped, `ok: true`. TC02 and TC08 appear in the report with `outcome: expected`. |
| Whitespace check | Passed | `git diff --check` returned exit code 0. Git emitted only configured LF-to-CRLF working-copy warnings. |

The sandboxed full-suite attempt was blocked by network policy (`EACCES` to DemoQA and SauceDemo). The same command was rerun with approved network access and passed. No credentials or tokens were printed in the successful test output.

The successful TC02 and TC08 run also exercised normal API-created user cleanup through the fixture. The account-creation response-recovery limitation for a lost or identifier-free response remains documented in `../lifecycle-architect/notes.md`.

## Phase 3 historical validation

The prior implementation run recorded successful typecheck, discovery, smoke selection, and Chromium execution. Those results are historical and are superseded for current source validation by the Phase 4 results above. The current embedded HTML report was regenerated during Phase 4.

## Not run or not externally verifiable

- `npm ci` was not run because the task prohibited dependency installation. The package manifest and lockfile root dependency declarations were inspected and match; fresh installation was not executed.
- GitHub Actions was not run. Repository settings outside this workspace, including whether `vars.BASE_URL` is configured, were not inspected. The workflow now safely falls back to the public SauceDemo URL when that variable is absent; DemoQA has its own optional default.
- No commit, push, merge, or branch operation was performed.
