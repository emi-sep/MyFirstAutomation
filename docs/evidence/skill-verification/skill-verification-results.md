# Skill verification results: TC02 and TC08

## 1. Purpose and scope

This is a controlled, read-only application of the repository Skills to the two cases named in the pre-verification audit. The only file created or updated for this step is this report. No code, test, Skill, configuration, or Git history was changed. No Playwright test, M5, typecheck, account creation, or destructive operation was run.

## 2. Repository and branch

- Repository: `webauto` (absolute local profile path redacted)
- Branch: `main`
- Worktree: already dirty before this step, with unstaged modifications and untracked artifacts from the prior Skill work and the Step 1 audit. No staging, reset, commit, push, or discard was performed.
- Scope source: `docs/evidence/skill-verification/pre-verification-audit.md`.

## 3. Test cases evaluated

| Case | Source document | Exact implementation | Evaluation scope |
|---|---|---|---|
| TC02 — Add a book to the user's collection | `docs/test-cases/demoqa/book-store-crud-test-cases.md` | `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts` | Requirements M0; data M0/M1/M4. It was also the target of historical data M5 evidence, which was not rerun. |
| TC08 — Delete one book and retain the other | `docs/test-cases/demoqa/book-store-crud-test-cases.md` | `tests/ui/smoke/books/TC08-delete-specific-book-from-collection.spec.ts` | Requirements M0; data M0/M1/M4. It was not included in the historical data M5 run. |

No case was renamed or substituted.

## 4. Skill invocation method

I read and explicitly applied the instructions from the repository Skill files listed below as this verification procedure. This records procedural application of their rules, not an independently observable Codex runtime activation event. No evidence available in this repository establishes automatic Skill activation for this conversation.

## 5. Skill structure verification

| Skill | Path and actual length | Metadata, modes, rules and formats | Scope/compatibility result |
|---|---|---|---|
| `spec-requirements-standard` | `.agents/skills/spec-requirements-standard/SKILL.md` — 186 lines | YAML frontmatter has `name` and `description`; documents M0–M4 and Q1–Q13; provides the TC template, weighted M0 assessment format, M4 YAML handoff, and violation format. | Owns `docs/test-cases/**/*.md`; its template and read-only M0 instructions fit the current feature Markdown location. It explicitly delegates data robustness and code organization. |
| `spec-data-standard` | `.agents/skills/spec-data-standard/SKILL.md` — 251 lines | YAML frontmatter has `name` and `description`; documents M0–M5 and R1–R15; defines five data classes, maturity levels 0–4, isolation strategies, Environment Readiness Map, expected-value sources, and violation formats. | Its scan rules resolve to this repository's `src/sites/demoqa/data/`, `src/sites/demoqa/tests/`, `src/sites/demoqa/api/`, `src/core/config/env.ts`, `playwright.config.ts`, and `tests/` paths without moving files. |

The current `spec-data-standard` length is 251 lines; the prior implementation evidence says 250. This is a stale evidence count, not a missing Skill rule.

## 6. Orchestration and dependency verification

| Component | Applied instructions and observation | Status |
|---|---|---|
| `automation-architect` — `.agents/skills/automation-architect/SKILL.md` | Registry lists both target Skills as Active with the correct scopes and rule/mode ranges. TC requests route to `spec-quality-lifecycle` phase 1; data robustness routes through lifecycle phases 2, 4 and 5. It explicitly describes one Full Pipeline, not duplicate numbered Modes 1/7. | PASS |
| `spec-quality-lifecycle` — `.agents/skills/spec-quality-lifecycle/SKILL.md` | Remains lifecycle owner; invokes requirements M0/specification in Specify and data M0–M3 in Arrange, M4 in Assert, M5 in Run. It cross-references assertion specificity and data value sourcing without replacing the data Skill. | PASS |
| Supporting ownership | `spec-standards` owns test TC ID and tag syntax; `test-standards` owns credentials/general implementation conventions; `api-setup-teardown` owns API lifecycle mechanics; `pom-architect` owns POM structure. The current source uses these local Skill names. | PASS |
| Missing aliases/dependencies | `spec-code-standard`, `api-setup-teardown-standard`, `spec-quality-lifecycle-standard`, and other `*-standard` aliases named by integration text are not local Skills. The registry maps applicable concerns to existing owners, but `test-standards` does not establish the missing `spec-code-standard` R7 credential-example reinforcement. | PARTIAL |
| Padded TC IDs | `spec-standards` requires `TC{N}` and code titles match filenames; current TC02/TC08 are zero-padded. The document and specs agree with each other, but the conflict with that Skill remains unresolved. No ID was changed. | FAIL |

## 7. `spec-requirements-standard` M0 results

**Skill applied:** `.agents/skills/spec-requirements-standard/SKILL.md`, mode M0, rules Q1–Q13. I assessed the document text only, as M0 requires; implementation details were not used to fill missing specification evidence. A passing rule earns its configured weight (ERROR 3, WARNING 1); failed rules earn zero. Total possible is 31 points per case.

### TC02

| Rule | Requirement and severity | Evidence in the TC document | Compliance | Score | Missing/ambiguous information and recommended correction |
|---|---|---|---|---:|---|
| Q1 `TC_METADATA_COMPLETE` | Requirement/AC, priority, suite, type, automation; ERROR | No metadata table or these fields appears in the TC section. | FAIL | 0/3 | Add verified metadata; use `TBD:` for unknown requirement/AC rather than inventing it. |
| Q2 `OBJECTIVE_STATED` | Objective states behavior and value; WARNING | Heading names the action; no objective sentence is provided. | FAIL | 0/1 | Add one behavior-and-value sentence. |
| Q3 `PRECONDITIONS_PROVISIONED` | Each precondition has provisioning method and scope; ERROR | “fixture creates a unique DemoQA account through the API” identifies fixture/API, but not test, worker, or shared scope. | FAIL | 0/3 | State the verified ownership scope, expected to be per-test only if confirmed. |
| Q4 `TEST_DATA_DECLARED` | Data value/rule, class and source declared; ERROR | The step names Git Pocket Guide but no test-data table, ISBN, data class, or source is declared. | FAIL | 0/3 | Add a classified data row and exact value/source after verifying them. |
| Q5 `ONE_ACTION_PER_STEP` | One action and an expected result per step; WARNING | Step 2 both opens the book and adds it; expected results are global rather than per step. | FAIL | 0/1 | Split compound actions and provide one result per step. |
| Q6 `EXACT_ORACLE` | Exact oracle where value is knowable; ERROR | UI only “confirms” the action; selected ISBN is not stated as an exact document oracle. | FAIL | 0/3 | State exact UI/API outcomes using a declared data reference. |
| Q7 `DETERMINISTIC_ORACLE` | One deterministic outcome; ERROR | No alternative or uncertain wording is used in the expected result. | PASS | 3/3 | — |
| Q8 `VERIFIABLE_ORACLE` | Oracle has a defined reference; ERROR | “selected ISBN” is not declared in the TC data; a reader cannot resolve the API comparison from this document. | FAIL | 0/3 | Declare the exact ISBN or a deterministic data-source rule. |
| Q9 `POSTCONDITIONS_DEFINED` | Mutations have final state/cleanup scope; ERROR | Cleanup removes books owned by this test account and deletes that account. | PASS | 3/3 | — |
| Q10 `INDEPENDENT_TC` | No dependence on or destructive impact to another TC; ERROR | The document says each case owns an isolated account and does not depend on another test. | PASS | 3/3 | — |
| Q11 `ENV_AGNOSTIC_STEPS` | No absolute URL/host/environment ID in steps; WARNING | Steps use no absolute URL or host. | PASS | 1/1 | — |
| Q12 `AUTOMATION_DECISION` | Automation decision and any reason/workaround; WARNING | No Automatable/Partial/Manual decision is present. | FAIL | 0/1 | Add a verified automation decision; include reason/workaround if partial or manual. |
| Q13 `STEP_REFERENCES_VALID` | Numbering and captured references valid; ERROR | Steps are numbered 1–2; no broken reference or “step N” captured-value reference occurs. | PASS | 3/3 | — |

**Score: 13/31 = 41.9% — Incomplete.**

### TC08

| Rule | Requirement and severity | Evidence in the TC document | Compliance | Score | Missing/ambiguous information and recommended correction |
|---|---|---|---|---:|---|
| Q1 `TC_METADATA_COMPLETE` | Requirement/AC, priority, suite, type, automation; ERROR | No metadata table or these fields appears in the TC section. | FAIL | 0/3 | Add verified metadata; do not infer requirement IDs or automation facts. |
| Q2 `OBJECTIVE_STATED` | Objective states behavior and value; WARNING | Heading names the behavior; no objective sentence is provided. | FAIL | 0/1 | Add one behavior-and-value sentence. |
| Q3 `PRECONDITIONS_PROVISIONED` | Each precondition has provisioning method and scope; ERROR | Fixture and API provisioning are stated, but test/worker/shared scope is not explicit. | FAIL | 0/3 | State verified provisioning scope. |
| Q4 `TEST_DATA_DECLARED` | Data value/rule, class and source declared; ERROR | Two book names appear in preconditions; no data table, ISBNs, classes, or sources are declared. | FAIL | 0/3 | Declare both items, their classes, values/rules, and source. |
| Q5 `ONE_ACTION_PER_STEP` | One action and expected result per step; WARNING | Step 1 combines login and profile navigation; step 2 combines delete and dialog confirmation; expected results are global. | FAIL | 0/1 | Split compound actions and provide one result per step. |
| Q6 `EXACT_ORACLE` | Exact oracle where value is knowable; ERROR | The document names both books and specifies API absence of the deleted book and retention of the other. | PASS | 3/3 | — |
| Q7 `DETERMINISTIC_ORACLE` | One deterministic outcome; ERROR | Expected absent/retained states are stated without alternatives. | PASS | 3/3 | — |
| Q8 `VERIFIABLE_ORACLE` | Oracle has a defined reference; ERROR | Both books are named and the API verification outcome is specified. | PASS | 3/3 | — |
| Q9 `POSTCONDITIONS_DEFINED` | Mutations have final state/cleanup scope; ERROR | Cleanup removes the test account's books and deletes that account. | PASS | 3/3 | — |
| Q10 `INDEPENDENT_TC` | No dependence on or destructive impact to another TC; ERROR | Explicit statement says each case owns an isolated account and does not depend on another test. | PASS | 3/3 | — |
| Q11 `ENV_AGNOSTIC_STEPS` | No absolute URL/host/environment ID in steps; WARNING | Steps use no absolute URL or host. | PASS | 1/1 | — |
| Q12 `AUTOMATION_DECISION` | Automation decision and any reason/workaround; WARNING | No automation decision appears. | FAIL | 0/1 | Add a verified automation decision. |
| Q13 `STEP_REFERENCES_VALID` | Numbering and captured references valid; ERROR | Steps are numbered 1–2; no broken captured-value reference occurs. | PASS | 3/3 | — |

**Score: 19/31 = 61.3% — Needs refinement.**

The scores reproduce the historical baseline because the current TC text and scoring weights match the recorded M0 assessment. They are newly applied during this verification, not inferred from historical test runs.

```text
[spec-requirements-standard] ASSESSMENT
File: docs/test-cases/demoqa/book-store-crud-test-cases.md
TC02  41.9%  Incomplete          top gaps: Q1, Q2, Q3, Q4, Q5, Q6, Q8, Q12
TC08  61.3%  Needs refinement    top gaps: Q1, Q2, Q3, Q4, Q5, Q12
Average: 51.6%
Ready: 0/2
Most frequent gaps: Q1 (2) · Q2 (2) · Q3 (2) · Q4 (2) · Q5 (2) · Q12 (2)
Recommended next mode: M2 on TC02
```

## 8. `spec-data-standard` M0/M1/M4 results

**Skill applied:** `.agents/skills/spec-data-standard/SKILL.md`. M0 assessed DemoQA paths and maturity; M1 applied R1–R5, R12 and R15 to the two tests and their shared fixture/runner; M4 applied R13–R14 to data-bearing assertions. No M5 was run.

### M0 maturity assessment

```text
[spec-data-standard] MATURITY ASSESSMENT
Project paths: Data src/sites/demoqa/data/books.ts; Config src/core/config/env.ts; Fixtures src/sites/demoqa/tests/fixtures.ts; API src/sites/demoqa/api/abilities/UseBookStoreApi.ts and src/sites/demoqa/api/controllers/{AccountController,BookStoreController}.ts
Site: DemoQA    Level: 1 — Externalised
Data inventory: 2 reference · 2 environment (BASE_URL, DEMOQA_BASE_URL) · 1 transactional (per-test account and collection) · 1 secret (generated account password) · 0 simulated
Blockers to level 2: no TEST_ENV selector/per-environment map → M3 / R9; level 3 portability is not demonstrated because book ISBNs are fixed and only one environment is configured → M3 / R10
Recommended next mode: M1 for the two target TCs; M3 only after supported environments and cleanup policy are decided
```

The DemoQA fixture creates a unique account per test using 8 random bytes in the username suffix (`pw_` prefix), verifies identity and empty collection, and cleans the fixture-owned account. This supports parallel identity isolation for TC02 and TC08. Data classes are based on values consumed by these cases; no `.env` values were read. `.env.example` contains placeholders and `.gitignore` excludes `.env` and `.env.*`.

### M1 parallel isolation

N workers can provision separate identities for these two flows, since `demoQaActor` creates its own random account per test. The tested records are reference books; each account's mutable collection is isolated. The runner is `fullyParallel: true`; CI sets `workers: 1` without a documented `// spec-data: serial — <reason>` explanation. The fixture's cleanup is restricted to its owned account, but bulk collection deletion has no `ENV.allowDestructiveCleanup` guard.

| Rule | Severity · fix type · mode | File:line | Observation and expected behavior | Status |
|---|---|---|---|---|
| R1 `NO_SHARED_MUTABLE_IDENTITY` | ERROR · MANUAL · M1 | `src/sites/demoqa/tests/fixtures.ts:64-75` | Each test creates a fresh account; neither target imports a shared mutable account. Expected: isolate each mutating test identity. | PASS |
| R2 `UNIQUE_CREATED_DATA` | ERROR · AUTO · M1 | `src/sites/demoqa/tests/fixtures.ts:64-68` | Username suffix uses `randomBytes(8)`; it is not static. Expected: unique value for each created account. | PASS |
| R3 `TEST_DATA_PREFIXED` | WARNING · AUTO · M1 | `src/sites/demoqa/tests/fixtures.ts:65` | Generated usernames use the existing `pw_` prefix. Expected: use the resolved project prefix for orphan tracking. | PASS |
| R4 `PARALLELISM_NOT_SUPPRESSED` | WARNING · MANUAL · M1 | `playwright.config.ts:20-23` | CI fixes `workers: 1` with no documented serialization reason. Expected: document intentional suppression or permit parallel workers after the reason is understood. | FAIL |
| R5 `NO_GLOBAL_STATE_ASSERTION` | WARNING · MANUAL · M1 | `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts:17-22`; `TC08-delete-specific-book-from-collection.spec.ts:18-25` | Assertions inspect the current fixture-owned user's collection, not a global/shared collection. Expected: assert owned records or own the collection. | PASS |
| R12 `SCOPED_AND_GUARDED_CLEANUP` | ERROR · MANUAL · M1 | `src/sites/demoqa/tests/fixtures.ts:23-33,99-102` | Cleanup calls `deleteAllBooks()` for the fixture-owned user, but does not check `ENV.allowDestructiveCleanup`. Expected: delete known created IDs or guard bulk cleanup. | FAIL |
| R15 `SINGLE_SESSION_PER_IDENTITY` | ERROR · MANUAL · M1 | `src/sites/demoqa/tests/fixtures.ts:71-95`; target specs lines 24-32 / 27-35 | One `demoQaActor` fixture owns account setup, API ability, and browser ability; no second fixture for the same identity is evidenced. API auth refresh and UI login both use that identity, but the rule's multi-fixture condition is not met by inspected code. Expected: one fixture owns identity session lifecycle. | PASS |

M1 failure blocks: CI worker suppression needs an operational decision (R4); cleanup guard policy/config contract needs a manual decision (R12). Neither was changed.

### M4 deterministic values and expected values

| Rule | Severity · fix type · mode | File:line | Observation and expected behavior | Status |
|---|---|---|---|---|
| R13 `EXPECTED_VALUE_FROM_CONTROLLED_SOURCE` | WARNING · MANUAL · M4 | `src/sites/demoqa/data/books.ts:1-9`; TC02 spec `15-32`; TC08 spec `15-36` | Expected titles and ISBNs come from typed `demoQaBooks`; API membership checks use those ISBNs. UI labels/messages are literal UI text rather than data values. Expected: compare data-bearing values to a controlled dataset/created resource/API-discovered entity. | PASS |
| R14 `MOCK_FOR_UNOWNED_CONTENT` | WARNING · MANUAL · M4 | TC02 spec `24-27`; TC08 spec `27-30` | The cases exercise known seeded books in UI integration flows; they do not test formatting/edge cases for content the test cannot predict. Expected: mock only unowned unpredictable content under test, retaining integration coverage where appropriate. | NOT APPLICABLE |

M4 conclusion: the assertions have controlled book-value sources. This does not establish that those ISBNs exist in any second environment. No R14 mocking change is recommended for these end-to-end integration cases absent a requirement to test variable/unowned content presentation.

### Other M0 findings relevant to the requested checks

- **Typed sources:** `demoQaBooks` is a TypeScript constant module; no JSON/CSV data parsing occurs in either target spec. R6–R8 are not triggered for these two cases.
- **Environment configuration:** specs use `getEnvironment()` for DemoQA `baseURL`; config validates `BASE_URL` and `DEMOQA_BASE_URL`, but loads one fixed `.env` and has no `TEST_ENV` selection. This is an M0 blocker mapped to M3/R9, not an M3 execution in this report.
- **Fixed reference data:** book ISBNs/titles are literal values in a typed dataset. Whether that catalogue is stable across environments is not verified; one configured environment means no cross-environment claim is made.
- **Impact tags:** both target specs currently carry the native structured `@mutates-data` tag. This observation is not evidence of a new test execution.
- **Fixture authentication:** one fixture provisions the account and supplies API/UI abilities. The API ability refreshes tokens and the UI logs in as the same identity. Inspected code does not establish a session invalidation defect; no M5/session robustness claim is made.

## 9. Historical baseline comparison

| Evidence item | Historical record | Current Step 2 result |
|---|---|---|
| Requirements M0 TC02 | 41.9%, Incomplete | 41.9%, Incomplete; same per-rule gaps recorded. |
| Requirements M0 TC08 | 61.3%, Needs refinement | 61.3%, Needs refinement; same per-rule gaps recorded. |
| Requirements M0 average/readiness | 51.6%, Ready 0/2 | 51.6%, Ready 0/2. |
| Data M5 TC02 | Historical 4/4 before and 4/4 after tag-only change | Not rerun; this report is not fresh M5 evidence. |
| Data M5 TC08 | No independently documented M5 result | Still no independent M5 result; TC08 was not substituted into the historical run. |

The historical data M5 record is not used as proof that either Skill was invoked in this conversation.

## 10. Expected output format compliance

| Skill | Expected format | Actual format | Compliant? | Evidence |
|---|---|---|---|---|
| `spec-requirements-standard` M0 | `[spec-requirements-standard] ASSESSMENT`, per-TC weighted score/grade/top gaps, average/readiness/frequent gaps/recommended mode; violations identify rule/severity, file, TC, issue and fix. | This report provides weighted per-rule tables for each TC, exact reproduced score/grade, average/readiness and per-failure rule/severity/file/TC/issue/recommendation; see Section 7. | PASS | Section 7, TC02/TC08 tables and scores. |
| `spec-data-standard` M0 | `[spec-data-standard] MATURITY ASSESSMENT` with resolved paths, site/level, data counts, blockers/mode and next mode. | The prescribed labeled block is included with resolved DemoQA paths, maturity and inventory. | PASS | Section 8, M0 block. |
| `spec-data-standard` M1/M4 findings | Confirmed findings use `[spec-data-standard] SEVERITY — RULE_NAME (M<n>)`, relative file and actual line, issue and fix type; manual items remain manual. | Finding tables include exact R IDs, severity/fix owner/mode, relative file and line, observation, expected behavior and status; no auto-fix is claimed. | PASS | Section 8 M1 and M4 tables. |
| Consolidated output required by Step 2 | `ID | Skill | Mode | Rule | Severity | File:Line | Finding | Expected result | Status`; only approved status values. | Section 12 uses the requested columns and status vocabulary. | PASS | Section 12. |

## 11. Missing dependencies and limitations

1. Only one DemoQA environment is configured; cross-environment portability is not demonstrated.
2. `AccountController` supports known-user create/get/delete operations but cannot enumerate accounts by prefix. Orphan-account count is **not verifiable**, not zero.
3. `spec-code-standard` is absent. The specific R7 credential-example reinforcement cannot be verified; `test-standards` ownership of credential hygiene does not prove that example exists.
4. Historical M5 evidence is for TC02 only and is not a fresh execution. TC08 has no independently documented data M5 result.
5. The prior requirements evidence has a contradictory dependency statement, and data evidence says 250 lines while the current Skill is 251. Neither historical record was corrected during this step.
6. Current TC identifiers are padded (`TC02`, `TC08`) while `spec-standards` requires unpadded identifiers. Team decision remains open.
7. Runtime automatic Skill activation is not independently observable from repository evidence. This report records explicit procedural application only.
8. Current dirty `main` worktree was preserved. No source changes were made, and this report does not claim test success.

## 12. Consolidated findings

This table contains all failed/limited findings and notable evaluated passes for the requested M0/M1/M4 scope. Status vocabulary is limited to the values specified by Step 2.

| ID | Skill | Mode | Rule | Severity | File:Line | Finding | Expected result | Status |
|---|---|---|---|---|---|---|---|---|
| REQ-02 | spec-requirements-standard | M0 | Q1 `TC_METADATA_COMPLETE` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:3-14` | TC02 lacks requirement/AC, priority, suite, type and automation metadata. | Provide verified metadata; mark unknowns `TBD:`. | FAIL |
| REQ-03 | spec-requirements-standard | M0 | Q2 `OBJECTIVE_STATED` | WARNING | `docs/test-cases/demoqa/book-store-crud-test-cases.md:3` | TC02 has no objective sentence. | State behavior and value in one sentence. | FAIL |
| REQ-04 | spec-requirements-standard | M0 | Q3 `PRECONDITIONS_PROVISIONED` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:5` | TC02 names fixture/API but omits provisioning scope. | State verified test/worker/shared scope. | FAIL |
| REQ-05 | spec-requirements-standard | M0 | Q4 `TEST_DATA_DECLARED` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:9-12` | TC02 has no classified data/source table or declared ISBN. | Declare verified book value/rule, class and source. | FAIL |
| REQ-06 | spec-requirements-standard | M0 | Q5 `ONE_ACTION_PER_STEP` | WARNING | `docs/test-cases/demoqa/book-store-crud-test-cases.md:9-12` | TC02 step 2 combines opening and adding; there are no per-step oracles. | One action and exact result per step. | FAIL |
| REQ-07 | spec-requirements-standard | M0 | Q6 `EXACT_ORACLE` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:12` | TC02 says UI “confirms” and does not state the exact selected ISBN as a TC oracle. | State exact known outcomes against declared data. | FAIL |
| REQ-08 | spec-requirements-standard | M0 | Q8 `VERIFIABLE_ORACLE` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:12` | TC02's “selected ISBN” lacks a document data reference. | Define the ISBN or deterministic source. | FAIL |
| REQ-09 | spec-requirements-standard | M0 | Q12 `AUTOMATION_DECISION` | WARNING | `docs/test-cases/demoqa/book-store-crud-test-cases.md:3-14` | TC02 has no automation decision. | State Automatable/Partial/Manual and any required reason/workaround. | FAIL |
| REQ-10 | spec-requirements-standard | M0 | Q1 `TC_METADATA_COMPLETE` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:16-27` | TC08 lacks requirement/AC, priority, suite, type and automation metadata. | Provide verified metadata; mark unknowns `TBD:`. | FAIL |
| REQ-11 | spec-requirements-standard | M0 | Q2 `OBJECTIVE_STATED` | WARNING | `docs/test-cases/demoqa/book-store-crud-test-cases.md:16` | TC08 has no objective sentence. | State behavior and value in one sentence. | FAIL |
| REQ-12 | spec-requirements-standard | M0 | Q3 `PRECONDITIONS_PROVISIONED` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:18` | TC08 names fixture/API but omits provisioning scope. | State verified test/worker/shared scope. | FAIL |
| REQ-13 | spec-requirements-standard | M0 | Q4 `TEST_DATA_DECLARED` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:18-25` | TC08 names books without a classified source table or ISBNs. | Declare both verified values, classes and sources. | FAIL |
| REQ-14 | spec-requirements-standard | M0 | Q5 `ONE_ACTION_PER_STEP` | WARNING | `docs/test-cases/demoqa/book-store-crud-test-cases.md:22-25` | TC08 steps combine actions and give only a global expected result. | Split actions and add one oracle per step. | FAIL |
| REQ-15 | spec-requirements-standard | M0 | Q12 `AUTOMATION_DECISION` | WARNING | `docs/test-cases/demoqa/book-store-crud-test-cases.md:16-27` | TC08 has no automation decision. | State verified automation decision. | FAIL |
| REQ-PASS-01 | spec-requirements-standard | M0 | Q7 `DETERMINISTIC_ORACLE` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:12,25` | Both cases state one outcome without alternatives or ambiguous wording. | Use one deterministic expected outcome. | PASS |
| REQ-PASS-02 | spec-requirements-standard | M0 | Q9 `POSTCONDITIONS_DEFINED` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:14,27` | Both cases specify cleanup of books/account owned by the test. | State final state and scoped cleanup. | PASS |
| REQ-PASS-03 | spec-requirements-standard | M0 | Q10 `INDEPENDENT_TC` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:29` | The source says each case owns an isolated account and does not depend on another test. | Provision own state and isolate destructive actions. | PASS |
| REQ-PASS-04 | spec-requirements-standard | M0 | Q11 `ENV_AGNOSTIC_STEPS` | WARNING | `docs/test-cases/demoqa/book-store-crud-test-cases.md:9-10,22-23` | Neither case uses an absolute URL, hostname, or environment ID. | Use relative paths and environment-classified data. | PASS |
| REQ-PASS-05 | spec-requirements-standard | M0 | Q13 `STEP_REFERENCES_VALID` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:7-10,20-23` | Numbering is valid and no broken captured-value reference occurs in either case. | Keep numbering and named captured-value references valid. | PASS |
| REQ-PASS-06 | spec-requirements-standard | M0 | Q6 `EXACT_ORACLE` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:25` | TC08 specifies the deleted book absent and the other book retained. | State exact knowable outcomes. | PASS |
| REQ-PASS-07 | spec-requirements-standard | M0 | Q8 `VERIFIABLE_ORACLE` | ERROR | `docs/test-cases/demoqa/book-store-crud-test-cases.md:18,25` | TC08 names both books and identifies API verification for their final states. | Define the dataset/reference for each oracle. | PASS |
| DATA-PASS-01 | spec-data-standard | M1 | R1 `NO_SHARED_MUTABLE_IDENTITY` | ERROR · MANUAL | `src/sites/demoqa/tests/fixtures.ts:64-75` | Each test creates and owns a fresh account. | Isolate mutable identity per test/worker. | PASS |
| DATA-PASS-02 | spec-data-standard | M1 | R2 `UNIQUE_CREATED_DATA` | ERROR · AUTO | `src/sites/demoqa/tests/fixtures.ts:64-68` | Username uses a random suffix rather than a static value. | Generate unique values for created fields. | PASS |
| DATA-PASS-03 | spec-data-standard | M1 | R3 `TEST_DATA_PREFIXED` | WARNING · AUTO | `src/sites/demoqa/tests/fixtures.ts:65` | Generated account name uses the existing `pw_` project prefix. | Use the resolved project prefix. | PASS |
| DATA-PASS-04 | spec-data-standard | M1 | R5 `NO_GLOBAL_STATE_ASSERTION` | WARNING · MANUAL | Both target specs, TC02 lines 17-22 and TC08 lines 18-25 | Assertions concern only the current fixture-owned user's collection. | Assert owned records or own the collection. | PASS |
| DATA-PASS-05 | spec-data-standard | M1 | R15 `SINGLE_SESSION_PER_IDENTITY` | ERROR · MANUAL | `src/sites/demoqa/tests/fixtures.ts:71-95` | One fixture owns account and abilities; no second identity/session fixture is evidenced. | Let one fixture own identity session lifecycle. | PASS |
| DATA-PASS-06 | spec-data-standard | M4 | R13 `EXPECTED_VALUE_FROM_CONTROLLED_SOURCE` | WARNING · MANUAL | `src/sites/demoqa/data/books.ts:1-9`; both target specs | Data-bearing book expectations use the typed dataset's title/ISBN values. | Compare against a controlled data source. | PASS |
| DATA-01 | spec-data-standard | M1 | R4 `PARALLELISM_NOT_SUPPRESSED` | WARNING · MANUAL | `playwright.config.ts:20-23` | CI fixes workers to 1 with no documented reason. | Document the understood reason or make a deliberate parallelism decision. | FAIL |
| DATA-02 | spec-data-standard | M1 | R12 `SCOPED_AND_GUARDED_CLEANUP` | ERROR · MANUAL | `src/sites/demoqa/tests/fixtures.ts:23-33,99-102` | Cleanup is account-scoped but bulk-deletes without `ENV.allowDestructiveCleanup`. | Delete known created IDs or guard bulk cleanup under an agreed policy. | FAIL |
| DATA-03 | spec-data-standard | M0 → M3 | R9 `ENV_RESOLVED_FROM_CONFIG` | ERROR · AUTO candidate | `src/core/config/env.ts:34-41`; `playwright.config.ts:7-13` | One fixed `.env` and no `TEST_ENV` selector; URL validation exists. | Define supported environment selection/config before claiming portability. | PARTIAL |
| DATA-04 | spec-data-standard | M0 → M3 | R10 `NO_ENV_SPECIFIC_LITERALS` | ERROR · MANUAL | `src/sites/demoqa/data/books.ts:1-9` | Two fixed ISBNs identify seeded reference books; behavior outside the single configured environment cannot be established. | Verify runtime discovery or environment-keyed data if environments may differ. | NOT VERIFIED |
| DATA-05 | spec-data-standard | M4 | R14 `MOCK_FOR_UNOWNED_CONTENT` | WARNING · MANUAL | `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts:24-27`; `TC08-delete-specific-book-from-collection.spec.ts:27-30` | Current cases exercise live integration with the known seeded books; no unpredictable rendering scenario is shown. | Mock only if the tested content is unowned and unpredictable; retain integration case as appropriate. | NOT APPLICABLE |
| DATA-06 | spec-data-standard | M0 | Dependency `spec-code-standard` R7 reinforcement | — | `.agents/skills/spec-data-standard/SKILL.md` Ownership; `.agents/skills/test-standards/SKILL.md` credential boundary | The exact named Skill is absent; its example cannot be verified. | Resolve only with the actual owner or an explicit dependency decision. | BLOCKED |
| DATA-07 | spec-data-standard | M0 | Maturity / orphan evidence | — | `src/sites/demoqa/api/controllers/AccountController.ts:49-100` | Account API cannot enumerate accounts by prefix; only one environment is configured. | Report orphan count not verifiable and portability not demonstrated. | NOT VERIFIED |
| ORCH-01 | automation-architect / spec-standards | M0 | TC ID convention | — | `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts:13`; `TC08-delete-specific-book-from-collection.spec.ts:13`; `.agents/skills/spec-standards/SKILL.md:54` | Zero-padded IDs conflict with the unpadded code convention; no team mapping decision is documented here. | Obtain a team decision before any ID changes. | BLOCKED |
| EVID-01 | Verification evidence | M0 | Historical evidence consistency | — | `docs/evidence/spec-data-standard/implementation-and-validation.md:27`; current Skill file | Prior count says 250; current file is 251 lines. Requirements evidence also has contradictory dependency statements. | Correct evidence in a separately authorized documentation update. | PARTIAL |

## 13. Overall verification result

The two Skills exist, are registered, and their instructions were explicitly applied to the fixed TC02/TC08 scope. Requirements results are **TC02 41.9% Incomplete**, **TC08 61.3% Needs refinement**, average **51.6%**, **Ready 0/2**. Data verification found per-test identity isolation and typed expected book values, with unresolved CI worker suppression and unguarded bulk cleanup; environment portability and orphan totals are not verified. R14 is not applicable to these cases. Automatic runtime activation is not confirmed. No tests passed or failed during this step because no tests were run.

## 14. Recommended next actions

1. Before final Chromium execution, resolve the TC ID convention decision; no rename should be inferred from this report.
2. For data readiness, decide the CI one-worker rationale and define the cleanup guard policy/config contract. Keep cleanup scoped to fixture-owned data.
3. Supply the missing TC requirement/AC, objective, explicit provisioning scope, classified data, step-level oracles, and automation decision before treating either TC as Ready. Do not invent missing product facts.
4. If Step 3 claims environment portability or orphan-zero, first add a supported second environment and a way to enumerate only project-owned accounts; current evidence cannot establish either claim.
5. The unresolved `spec-code-standard` R7 reinforcement requires a dependency/owner decision. The local credential Skill is not a substitute for that exact missing example.
6. Reconcile stale historical evidence counts/dependency statements separately from this read-only verification.
7. After those decisions and any separately authorized fixes, a final Chromium run can be considered. This report does not authorize or start Step 3.

### Finding counts

Counts from the consolidated table: **PASS 13 · FAIL 16 · PARTIAL 2 · BLOCKED 2 · NOT VERIFIED 2 · NOT APPLICABLE 1**. Each grouped requirements PASS row covers the two stated cases where noted; counts are table rows, not individual rule/case pairs. R14 is recorded as not applicable in its mode assessment.
