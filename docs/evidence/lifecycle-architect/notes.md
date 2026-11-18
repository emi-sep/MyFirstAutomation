# DemoQA implementation notes

## Architecture and decisions

- Shared Screenplay contracts and environment parsing live under `src/core/`; the legacy `src/config/Env.ts` file re-exports the environment helpers for existing callers.
- DemoQA-specific API clients, endpoint definitions, controllers, abilities, UI components/elements, tasks, questions, data, and fixture live under `src/sites/demoqa/`.
- `BookStoreScreen` composes the login, catalog, detail, and profile components. Tasks perform user actions, Questions query API state, and scenario expectations stay in TC02/TC08 specs.
- Existing SauceDemo Page Objects, fixtures, data, and specifications remain in their established paths. No `src/common/` component is needed; the unused `@common/*` alias was removed.
- The assignment explicitly requires the padded identifiers `TC02` and `TC08`; those filenames and titles intentionally override the general unpadded-ID rule.

## Skills consulted and applied

During the Phase 3 implementation, the following Skills were explicitly consulted for their distinct responsibilities:

| Skill | Applied responsibility |
|---|---|
| `automation-architect` | Cross-cutting architecture, Skill ownership, and documentation alignment |
| `api-setup-teardown` | API contract, client/controller structure, test-owned resources, and cleanup |
| `pom-architect` | UI components, locators, relative navigation, and assertion separation |
| `test-standards` | Fixtures, test data, isolation, credentials, and Playwright behavior |
| `spec-standards` | TC hierarchy, names, titles, and functional steps |
| `code-conventions` | Type safety and maintainability |
| `spec-quality-lifecycle` | Scenario preconditions, outcomes, independence, and determinism |
| `git-standards` | Read-only Git constraints; no Git writes were performed |

Phase 4 uses these same owners for the specific remediation concerns. This list records Skills consulted and applied; it does not claim each Skill performed an independent audit. The R1–R10 lifecycle review is documented in `skill-verification.md`.

## API and cleanup lifecycle

- Each test generates its username and password before the account creation request.
- DemoQA's create-user response includes the account UUID. The fixture now retains that UUID immediately, before validating the remaining response fields, so later setup failures can still clean up the owned account.
- The verified account profile lookup requires the UUID. The configured account API has no username-to-UUID recovery operation. If account creation succeeds remotely but the response is lost or contains no usable UUID, safe recovery is impossible; the fixture cannot guarantee deletion in that residual case.
- The fixture cleans the user's collection and deletes that user in `finally`. It consults Playwright `testInfo` so cleanup errors are logged when the test already failed and raised when cleanup is the only failure.
- API authentication is refreshed for collection operations after UI login because that behavior was observed during the prior live implementation verification.

## UI synchronization and transport

- Login waits for the `/profile` URL and visible Logout control. Profile opening waits for the user's profile identity to become visible. Deleting a book waits for the selected row to detach.
- The profile component does **not** wait for network idle. The earlier note claiming that it did was inaccurate and is corrected here.
- The confirmation modal is located by accessible dialog role. TC08 was run against DemoQA with this locator and passed; no fixed sleep is used.
- Certificate verification remains enabled. `ignoreHTTPSErrors` was removed because neither the local setup nor the CI workflow requires bypassing certificate checks.

## Validation evidence

Current Phase 4 command outcomes and report inspection are recorded in `../test-execution/execution-summary.md`. Earlier Phase 3 execution results remain historical; the execution summary distinguishes them from the Phase 4 rerun. No result is inferred merely from source code or a prior report.
