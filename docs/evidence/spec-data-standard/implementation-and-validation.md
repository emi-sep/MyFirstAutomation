# `spec-data-standard` implementation and validation

## A. Objective

The Skill fills the cross-layer gap between having data/fixtures and proving tests use isolated, typed, environment-aware inputs and controlled expected values. It defines hermetic test data, parallel robustness, environment readiness, and execution evidence without taking ownership of API mechanics, secrets, or the full test lifecycle.

## B. Project conventions

| Area | Resolved repository location | Notes |
|---|---|---|
| Shared data | `src/data/` | SauceDemo sample identity in `users.ts` |
| Site data | `src/sites/demoqa/data/` | DemoQA reference book records in `books.ts` |
| Configuration | `src/core/config/env.ts`; compatibility re-export `src/config/Env.ts` | `getEnvironment()` validates URLs; no `TEST_ENV` selector |
| Shared fixtures | `src/fixtures/index.ts` | Authenticates the static SauceDemo sample identity |
| Site fixtures | `src/sites/demoqa/tests/fixtures.ts` | Creates a unique user per test and cleans up its collection/account |
| API layer | `src/sites/demoqa/api/` | Account and book controllers; no root `src/api/` |
| Runner | `playwright.config.ts` | Chromium project; fully parallel locally; CI sets one worker |
| Tests | `tests/ui/smoke/{books,cart,inventory,login}/` | Nine Playwright specs across two sites |
| TC documents | `docs/test-cases/demoqa/` | DemoQA feature document |

Adaptations: shared and site data coexist, so `<data-dir>` is resolved per site. The API owner is `api-setup-teardown`, whose current mode is `Implement` rather than the referenced `Add`. The only configured browser project is Chromium. `DEMOQA_BASE_URL` is optional and defaults to `demoqa.com`; the repository demonstrates one environment per site, not a per-environment selector.

## C. Implementation

Created:

- `.agents/skills/spec-data-standard/SKILL.md` — 251 lines, below the 400-line limit.
- `docs/decisions/ADR-002-spec-data-standard.md` — decision record created before Skill registration.
- This evidence document.

Modified:

- `.agents/skills/automation-architect/SKILL.md`
- `.agents/skills/spec-quality-lifecycle/SKILL.md`
- `.agents/skills/api-setup-teardown/SKILL.md`
- `.agents/skills/spec-standards/SKILL.md`
- `.agents/skills/test-standards/SKILL.md`
- `.agents/skills/spec-requirements-standard/SKILL.md`
- `AGENTS.md`, `docs/ai-automation-sdlc.md`
- Three mutating spec tag declarations: TC02, TC08, and TC7. Only metadata changed; test actions/assertions are unchanged.

The Skill defines all five data classes (Reference, Environment, Transactional, Secret, Simulated), the Define → Provision → Use → Clean lifecycle, site-level maturity levels 0–4, M0–M5, the M1 isolation decision table, M3 Environment Readiness Map, M4 expected-value sources, M5 repeated parallel runs, and R1–R15 with severity, owner mode, and fix type. M0 is read-only; M5 never edits code. R2, R3, R6–R9, and R11 are auto-fix candidates only when safe and meaning-preserving. R1, R4, R5, R10, R12–R14, and R15 require manual handling.

## D. Integration

- **ADR-002:** Created and marked Accepted before registering the Skill. It records context, decision, alternatives, boundaries, lifecycle, and trade-offs.
- **`automation-architect`:** Registered M0–M5 and the resolved scan scopes. Added data M1–M4 after API review and before lifecycle review in the Full Pipeline, routed requested triggers through the lifecycle orchestrator, added invocation references and the data output slot, and annotated current data/config folders.
- **`spec-quality-lifecycle`:** Added the five lifecycle phases, with data ownership assigned to `spec-data-standard` in Arrange, Assert value-source guidance, and Run evidence. Added `dataSource` and `expectedValues` collection and an R13 cross-check to Create/Review. The repository has Review/Create modes, not an Enforce mode, so the requested step was integrated into those existing modes.
- **`api-setup-teardown`:** R4 now covers worker-scoped fixtures; the fixture table includes `worker<Resource>`/`workerUser`; Implement mode can add verified `create<Identity>` and `delete<Identity>` operations when the API contract supports them.
- **`spec-standards`:** Its existing future extension point explicitly anticipated tags. Added syntax and vocabulary for `@mutates-data`, `@read-only`, and `@env:<name>` using installed Playwright's structured `tag` option. `spec-data-standard` owns tag meaning.
- **`test-standards`:** Clarified that it retains credential storage/hygiene while `spec-data-standard` owns isolation and environment robustness. The requested `spec-code-standard` R7 example could not be changed because that Skill is absent.
- **`AGENTS.md`:** Added the worker-scoped fixture naming table and data robustness Skill routing.
- **`spec-requirements-standard`:** Its M4 data handoff now points to the existing `spec-data-standard`; the prior evidence no longer describes that Skill as missing.

Missing exact aliases were not created: `ui-pom-standard`, `spec-quality-lifecycle-standard`, `api-setup-teardown-standard`, `spec-code-standard`, `spec-organisation-standard`, and `git-workflow-docs-standard`. Existing verified owners are respectively `pom-architect`, `spec-quality-lifecycle`, `api-setup-teardown`, `test-standards` (credential hygiene only), `spec-standards` (tag syntax extension), and `git-standards`. The missing `spec-code-standard` R7 identity example remains a dependency limitation.

## E. Conflict analysis

- **Lifecycle names/modes:** The request refers to numbered Hub Modes 1/7 and an Enforce mode, but this repository has a Full Pipeline and lifecycle Review/Create modes. Integration uses those existing entry points; no orchestration hub or mode was added.
- **API mode:** The requested API `Add` mode is absent; identity controller guidance is integrated into the existing `Implement` mode.
- **Fixture naming:** Existing DemoQA fixture is named `demoQaActor`; the generic `worker<Resource>`/`created<Resource>` names are strategy examples, not a forced rename. API Skill now documents `workerUser` as a worker-scoped example.
- **Data folders:** Site-oriented `src/sites/demoqa/data/` and `src/sites/demoqa/api/` are preserved; no migration to generic root defaults.
- **Environment configuration:** `getEnvironment()` validates values, but there is no `TEST_ENV` selector and only one environment per site. No environment variable or second target was invented.
- **Parallelism:** Local Playwright is fully parallel. `workers: 1` is configured for CI without a `spec-data: serial` explanation; it remains a manual issue because its operational reason is not established.
- **Cleanup:** DemoQA teardown cleans the collection and account created by the same test, but bulk collection cleanup lacks an `ENV.allowDestructiveCleanup` guard. Adding one would require a defined config contract; it remains a manual issue.
- **Credential examples:** SauceDemo's `standard_user` is explicitly documented in source as a public demo account, not a private credential. It is nevertheless a shared mutable identity because TC7 changes its cart.
- **Expected values:** DemoQA book expectations come from `demoQaBooks`. SauceDemo inventory tests discover values from the live UI and mostly assert presence/count/order. Whether exact catalogue values are acceptance criteria is not documented, so the Skill does not prescribe new product expectations.
- **Circular references:** `spec-quality-lifecycle` calls `spec-data-standard`; data R13 points back to lifecycle R10 as a rule cross-check. This is a reference, not a second orchestration or runtime cycle.

## F. Baseline M0 assessment

Scope: all nine specs under `tests/`, source data, both fixture modules, environment helpers, runner configuration, and the existing TC document. M0 inspected configuration without recording or exposing `.env` values.

| Site | Reference | Environment | Transactional | Secret | Simulated | Maturity |
|---|---:|---:|---:|---:|---:|---|
| SauceDemo | 1 live catalogue | 1 base URL | 1 shared sample identity/cart | 0 private credentials consumed by specs | 0 | Level 1 — Externalised |
| DemoQA | 2 book records | 1 base URL | 1 per-test user identity | 1 generated account-password field | 0 | Level 1 — Externalised |

Level 2 is blocked for both sites by the absence of typed `TEST_ENV` selection. SauceDemo additionally reuses one static mutable account across fully parallel tests. DemoQA already provisions unique identities per test. Level 3 is not met because DemoQA reference ISBNs remain fixed rather than discovered at runtime, and multiple environments are unavailable.

Confirmed blockers and findings:

| Site | Rule | Evidence and status |
|---|---|---|
| SauceDemo | R1 ERROR | `src/fixtures/index.ts` authenticates `users.sauceDemo` for tests; `TC7-add-remove-product.spec.ts` mutates that account's cart. Multiple local workers may share the identity. |
| SauceDemo | R4 WARNING | `playwright.config.ts` sets `workers: 1` when `CI` is set; no justification comment exists. |
| SauceDemo | R5 WARNING | TC7 asserts the whole cart badge count on the shared account; a parallel test can change the same cart. |
| Both | R9 ERROR | `playwright.config.ts` loads a single `.env`; no `TEST_ENV` selector or per-environment map exists. URL validation is present. |
| DemoQA | R12 ERROR | `src/sites/demoqa/tests/fixtures.ts` bulk-cleans the collection on its test-owned account but has no destructive-cleanup guard. Scope is account-owned; guard policy is undefined. |
| TC02, TC08, TC7 | R11 WARNING, baseline | These persistence-mutating tests initially had only `@smoke`. Added `@mutates-data` with the project's native structured tag syntax; this was the only source-test change. |

The DemoQA identity uses `randomBytes(8)` and a `pw_` prefix, so generated usernames are non-static and already carry an identifiable project prefix. No worker index is needed for test-scoped unique identities. The API exposes create/delete/get for a known user but no account enumeration, so orphan totals cannot be verified. No JSON/CSV loaders or generated data-driven loops were found; TS data modules are used. The TC document names per-test DemoQA accounts and scoped fixture cleanup. No speculative environment-specific ISBN violation is counted because only one DemoQA environment is available.

Environment Readiness Map for DemoQA (one environment available; portability not demonstrated):

| ID | Status | Evidence / action |
|---|---|---|
| E1 | WOULD CHANGE | Add a `TEST_ENV`/per-environment selection contract in `src/core/config/env.ts` after environments are specified. |
| E2 | DONE | `getEnvironment()` validates required/optional URLs. |
| E3 | DONE | Tests use configured `baseURL`/relative navigation; DemoQA specs resolve their URL through configuration. |
| E4 | DONE | `.gitignore` excludes `.env*`; `.env.example` contains placeholders. |
| E5 | DONE | DemoQA fixture creates a unique per-test account through its API. |
| E6 | WOULD CHANGE | Resolve the two fixed book ISBNs at runtime if another environment can differ. |
| E7 | DONE | TC02/TC08 compare against `demoQaBooks` data. |
| E8 | WOULD CHANGE | Define a destructive-cleanup policy and guard bulk cleanup in `src/sites/demoqa/tests/fixtures.ts`. |
| E9 | DONE | Mutating book specs now carry `@mutates-data`. |
| E10 | WOULD CHANGE | Add a CI environment matrix only after a second supported environment is defined. |

Ready: 6/10. Recommended next work: M1 for the SauceDemo shared mutable identity; M3 after supported environments and cleanup policy are defined; M4 for catalogue values only if their exact values are part of the verified requirement.

## G. M5 verification

Selected scenario: `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts`; browser project: Chromium; one configured environment (`demoqa.com`); command used `--workers=4 --repeat-each=4 --retries=0`.

Command: `node_modules/.bin/playwright.cmd test tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts --project=chromium --workers=4 --repeat-each=4 --retries=0`.

| Run | State | Result |
|---|---|---|
| Baseline | Before R11 tag correction | 4/4 passed; 0 flaky |
| After | After adding only `@mutates-data` metadata | 4/4 passed; 0 flaky |

No test behavior changed. All fixture-owned accounts completed creation, use, and fixture teardown without a reported cleanup failure. Failures by cause: collision 0, session 0, missing data 0, order 0, other 0. The initial sandbox-only `EACCES` was resolved by an approved network-enabled run and is not counted as a test failure.

Orphans: **not verifiable**. `AccountController` cannot enumerate accounts by prefix; do not interpret successful teardown as an independent zero-orphan audit. Only one environment is configured, so cross-environment execution was not performed. Verdict: **INCOMPLETE** for full hermeticity/portability proof; parallel evidence for the selected TC is 4/4 in both baseline and after runs.

Other validation: `npm run typecheck` passed; structural checks confirmed all M0–M5 modes, R1–R15, frontmatter presence, scan scope, and the readiness map; `git diff --check` passed. The Skill Creator `quick_validate.py` could not be launched because the available Windows Python executables were blocked. Frontmatter and the required fields were inspected directly.

## H. Prompt iteration

- Resolved generic locations to the repository's shared and site-oriented data/API paths; preserved those paths.
- Adapted Mode 1/7 references to the existing Full Pipeline and lifecycle routing; no second orchestration mode was added.
- Adapted requested lifecycle/API `standard` names to verified current Skills and used API `Implement` mode.
- Added data tag syntax to `spec-standards` because its inspected Future Extension section explicitly anticipated tagging; tag meaning remains with the new Skill.
- Could not update `spec-code-standard` R7 because that Skill is absent. `test-standards` retains credential storage and hygiene; identity isolation is owned by the new Skill.
- M5 ran only against the isolated DemoQA TC02 flow; it did not run against SauceDemo, a second environment, or the full suite.

## I. Final status

**READY WITH WARNINGS.** The Skill, ADR-002, integrations, M0 assessment, and scoped M5 evidence are present. The selected scenario passed four parallel repetitions before and after the tag-only correction. Full portability and orphan-zero evidence are unavailable; SauceDemo still has a shared mutable identity; DemoQA bulk cleanup lacks a defined guard; `TEST_ENV` is absent; and the requested `spec-code-standard` R7 reinforcement is blocked by that missing Skill. These remain explicit follow-up items rather than claimed successes.
