# DemoQA Book Store test cases

### TC02 — Add a book to the user's collection

| Field | Value |
|---|---|
| Requirement / AC | `TBD: No authoritative requirement ID or acceptance criteria were supplied.` |
| Objective | Verify that adding Git Pocket Guide through the UI persists its ISBN in the fixture-owned user's collection. |
| Priority | `TBD: No authoritative priority was supplied.` |
| Suite | smoke |
| Type | positive |
| Tags | `@smoke`, `@mutates-data` |
| Automation | Automatable — implemented by `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts`. |

**Preconditions**

| # | State | Provisioned by | Scope |
|---|---|---|---|
| P1 | A unique DemoQA account exists, is authorized, and has an empty collection. | API through the `demoQaActor` fixture | This test only (per-test fixture). |

**Test data**

| Item | Value or generation rule | Class | Source |
|---|---|---|---|
| DemoQA account username | `pw_` + 8 random bytes encoded as hexadecimal | Transactional | Factory in `src/sites/demoqa/tests/fixtures.ts` |
| DemoQA account password | `Aa1!` + the same random suffix + `x`; not stored as a fixed credential | Secret | Factory in `src/sites/demoqa/tests/fixtures.ts` |
| Git Pocket Guide | Title `Git Pocket Guide`; ISBN `9781449325862` | Reference | Typed dataset `demoQaBooks.gitPocketGuide` in `src/sites/demoqa/data/books.ts` |
| DemoQA base URL | Configured `DEMOQA_BASE_URL` (defaults to `https://demoqa.com` when unset) | Environment | `getEnvironment()` in `src/core/config/env.ts` |

**Steps**

| # | Action | Expected result (oracle) |
|---|---|---|
| 1 | Log in to the Book Store UI with the fixture-owned account. | The browser reaches `/profile` and the Logout control is visible. |
| 2 | Open the Book Store catalog. | The catalog heading is visible. |
| 3 | Open Git Pocket Guide from the catalog. | The displayed book title equals `Git Pocket Guide` from `demoQaBooks.gitPocketGuide`. |
| 4 | Add Git Pocket Guide to the collection. | The UI alert text is exactly `Book added to your collection.` |
| 5 | Query the fixture-owned user's profile through the API. | The collection contains ISBN `9781449325862` from `demoQaBooks.gitPocketGuide`. |

**Postconditions**

| State after the test | Cleanup | Scope |
|---|---|---|
| Before teardown, the fixture-owned collection contains ISBN `9781449325862`; after teardown, the fixture-created account is deleted. | If the collection is non-empty, clear it only when `allowDestructiveCleanup` is enabled; then delete only the user created by this fixture. A blocked collection cleanup is reported as an error. | This test's fixture-created account only. |

**Risks / notes** — Collection cleanup requires `ALLOW_DESTRUCTIVE_CLEANUP=true`; it defaults to false. Only one DemoQA environment is configured, so cross-environment availability of the reference book is not established.

### TC08 — Delete one book and retain the other

| Field | Value |
|---|---|
| Requirement / AC | `TBD: No authoritative requirement ID or acceptance criteria were supplied.` |
| Objective | Verify that deleting Git Pocket Guide removes its ISBN while retaining Learning JavaScript Design Patterns in the fixture-owned user's collection. |
| Priority | `TBD: No authoritative priority was supplied.` |
| Suite | smoke |
| Type | positive |
| Tags | `@smoke`, `@mutates-data` |
| Automation | Automatable — implemented by `tests/ui/smoke/books/TC08-delete-specific-book-from-collection.spec.ts`. |

**Preconditions**

| # | State | Provisioned by | Scope |
|---|---|---|---|
| P1 | A unique DemoQA account exists, is authorized, and has an empty collection. | API through the `demoQaActor` fixture | This test only (per-test fixture). |
| P2 | Git Pocket Guide and Learning JavaScript Design Patterns are both in that account's collection. | API through `UseBookStoreApi.addBooks()` | This test-owned account only. |

**Test data**

| Item | Value or generation rule | Class | Source |
|---|---|---|---|
| DemoQA account username | `pw_` + 8 random bytes encoded as hexadecimal | Transactional | Factory in `src/sites/demoqa/tests/fixtures.ts` |
| DemoQA account password | `Aa1!` + the same random suffix + `x`; not stored as a fixed credential | Secret | Factory in `src/sites/demoqa/tests/fixtures.ts` |
| Git Pocket Guide | Title `Git Pocket Guide`; ISBN `9781449325862` | Reference | Typed dataset `demoQaBooks.gitPocketGuide` in `src/sites/demoqa/data/books.ts` |
| Learning JavaScript Design Patterns | Title `Learning JavaScript Design Patterns`; ISBN `9781449331818` | Reference | Typed dataset `demoQaBooks.learningJavaScriptDesignPatterns` in `src/sites/demoqa/data/books.ts` |
| DemoQA base URL | Configured `DEMOQA_BASE_URL` (defaults to `https://demoqa.com` when unset) | Environment | `getEnvironment()` in `src/core/config/env.ts` |

**Steps**

| # | Action | Expected result (oracle) |
|---|---|---|
| 1 | Add both listed books to the fixture-owned account through the API. | The profile contains exactly ISBNs `9781449325862` and `9781449331818`, sourced from the two `demoQaBooks` records. |
| 2 | Log in to the Book Store UI with the fixture-owned account. | The browser reaches `/profile` and the Logout control is visible. |
| 3 | Open the profile collection. | The displayed username equals `{username}` generated for this test by the `demoQaActor` fixture. |
| 4 | Select Delete for the Git Pocket Guide row. | The confirmation dialog text contains `Do you want to delete this book?`. |
| 5 | Confirm deletion in the dialog. | The Git Pocket Guide row is detached from the profile page. |
| 6 | Query the fixture-owned user's profile through the API. | ISBN `9781449325862` is absent and ISBN `9781449331818` remains present. |

**Postconditions**

| State after the test | Cleanup | Scope |
|---|---|---|
| Before teardown, Git Pocket Guide is absent and Learning JavaScript Design Patterns remains; after teardown, the fixture-created account is deleted. | If the collection is non-empty, clear it only when `allowDestructiveCleanup` is enabled; then delete only the user created by this fixture. A blocked collection cleanup is reported as an error. | This test's fixture-created account only. |

**Risks / notes** — Collection cleanup requires `ALLOW_DESTRUCTIVE_CLEANUP=true`; it defaults to false. Only one DemoQA environment is configured, so cross-environment availability of the reference books is not established.

## Change log

- Q1/Q2/Q3/Q4/Q5/Q6/Q8/Q12 — Added the required metadata, derived objectives, explicit per-test provisioning scope, classified data sources, one-action steps with exact outcomes, and an automation decision supported by the existing automated specs. Requirement IDs, acceptance criteria, and priorities remain `TBD:` because no authoritative values were supplied.
- Q9/Q10 — Specified fixture cleanup scope and retained each case's independent, fixture-owned account.
- Q11/Q13 — Kept relative application navigation and valid numbered steps without introducing captured-value references.
