# Pre-verification audit: `spec-requirements-standard` and `spec-data-standard`

## Scope and repository state

This is a read-only audit of the current implementation and prior evidence, except for this document. No Skill invocation, test run, typecheck, Git write, or implementation change was performed during this audit.

- Repository: `webauto` (absolute local profile path redacted)
- Branch: `main`
- Git status: dirty, with unstaged modifications and untracked artifacts from the prior Skill implementation. No staged changes were shown. No status entries were altered.
- Instructions: root `AGENTS.md` exists; no nested `AGENTS.md` was found under the repository scan scope.

## Test cases identified

The two cases in the prior test-case module are established by `docs/test-cases/demoqa/book-store-crud-test-cases.md` and the prior implementation evidence:

| ID and title | Test case document | Test implementation | Prior prompt usage evidenced |
|---|---|---|---|
| TC02 — Add a book to the user's collection | `docs/test-cases/demoqa/book-store-crud-test-cases.md` | `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts` | Included in `spec-requirements-standard` M0. Selected for `spec-data-standard` M5; the recorded baseline and after runs report 4/4 each. |
| TC08 — Delete one book and retain the other | `docs/test-cases/demoqa/book-store-crud-test-cases.md` | `tests/ui/smoke/books/TC08-delete-specific-book-from-collection.spec.ts` | Included in `spec-requirements-standard` M0. Not selected for the recorded `spec-data-standard` M5 run. The separate execution summary records TC08 individually and in the full suite. |

This resolves the case identity without substitution. TC02 is the data M5 target; TC02 and TC08 are the requirements M0 targets. The earlier full-suite record is corroborating test execution evidence, not proof that either Skill was independently invoked.

## Audit matrix

| Area | Expected | Observed | Status | Evidence |
|---|---|---|---|---|
| Repository instructions | Root and applicable nested instructions inspected | Root `AGENTS.md` exists; no nested `AGENTS.md` found. It routes cross-cutting work through `automation-architect` and identifies `src/core/config/env.ts` as the environment implementation. | PASS | `AGENTS.md`; repository `rg --files -g AGENTS.md` result |
| Branch and working tree | Read-only inspection of current branch/status | Branch is `main`. Worktree is dirty with prior Skill, evidence, and three test-tag changes; no staged changes shown. | PASS | `git branch --show-current`; `git status --short` |
| Target case identity | Exact prior cases evidenced, not inferred | TC02 and TC08 are both in the only TC document. M0 evidence scores both. M5 evidence selects TC02 only. | PASS | `docs/test-cases/demoqa/book-store-crud-test-cases.md`; `docs/evidence/spec-requirements-standard/implementation-and-validation.md`; `docs/evidence/spec-data-standard/implementation-and-validation.md` |
| `spec-requirements-standard` file and registration | Skill exists, registered, and documents its modes/rules | Exists at `.agents/skills/spec-requirements-standard/SKILL.md` (186 lines); `automation-architect` registry assigns `docs/test-cases/**/*.md`, Q1–Q13, M0–M4. File contains the TC template, M0–M4, Q1–Q13, assessment and violation formats. | PASS | `.agents/skills/spec-requirements-standard/SKILL.md`; `.agents/skills/automation-architect/SKILL.md` Sub-Skill Registry |
| `spec-data-standard` file and registration | Skill exists, registered, and documents its modes/rules | Exists at `.agents/skills/spec-data-standard/SKILL.md` (251 lines); registry assigns data, config, fixtures, runner, and spec scopes, R1–R15, M0–M5. File contains data classes, maturity levels, isolation table, environment readiness map, value-source strategy, scan scope, and violation format. | PASS | `.agents/skills/spec-data-standard/SKILL.md`; `.agents/skills/automation-architect/SKILL.md` Sub-Skill Registry and Scan Scope Ownership |
| Lifecycle and hub integration | One lifecycle orchestrator invokes both Skills at their phases | `spec-quality-lifecycle` names phases 1–5, calls requirements in Specify and data standards in Arrange, Assert, and Run. `automation-architect` routes the documented triggers through its Full Pipeline/lifecycle Skill; it explicitly says this repository has no numbered Modes 1/7. | PASS | `.agents/skills/spec-quality-lifecycle/SKILL.md` Lifecycle phases, Ownership, Review/Create; `.agents/skills/automation-architect/SKILL.md` Full Pipeline and Invocation Reference |
| Skill references and dependencies | References resolve to repository Skills or are explicitly declared missing | Actual local names include `spec-quality-lifecycle`, `api-setup-teardown`, `test-standards`, `spec-standards`, and `git-standards`. Exact aliases such as `spec-code-standard`, `spec-organisation-standard`, `api-setup-teardown-standard`, and `spec-quality-lifecycle-standard` do not exist. The data Skill maps several to local owners, but `spec-code-standard` R7's credential-example reinforcement remains unavailable. | PARTIAL | `.agents/skills/` listing; `.agents/skills/spec-data-standard/SKILL.md` Ownership; `docs/evidence/spec-data-standard/implementation-and-validation.md` Integration |
| `spec-requirements-standard` project compatibility | TC documents and code conventions align or conflicts are explicit | TC content is stored under `docs/test-cases/demoqa/` as expected. However, TC02/TC08 use zero-padded IDs in both filenames/titles, while `spec-standards` requires unpadded IDs. Prior evidence reports this conflict but no resolution. | FAIL | `docs/test-cases/demoqa/book-store-crud-test-cases.md`; `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts`; `tests/ui/smoke/books/TC08-delete-specific-book-from-collection.spec.ts`; `.agents/skills/spec-standards/SKILL.md` R2/R4 |
| TC data and expected-value sourcing | Data is classified/sourced and expectations are inspectable | TC02/TC08 import typed `demoQaBooks` values for book titles/ISBNs and assert API/UI outcomes against them. TC02's success alert remains a literal assertion. Both tests use a fixture-created identity. | PARTIAL | `src/sites/demoqa/data/books.ts`; both book spec files; `src/sites/demoqa/tests/fixtures.ts` |
| Fixture isolation and cleanup | Each case owns its mutable identity and cleanup is scoped | `demoQaActor` creates a random per-test user (`pw_` prefix), yields it to the test, then removes that user's books/account. Cleanup is scoped to that fixture-owned account, but bulk collection deletion has no configured `allowDestructiveCleanup` guard. | PARTIAL | `src/sites/demoqa/tests/fixtures.ts`; `src/sites/demoqa/api/abilities/UseBookStoreApi.ts`; `src/sites/demoqa/api/controllers/AccountController.ts`; `src/sites/demoqa/api/controllers/BookStoreController.ts` |
| Environment/config compatibility | Test environment values resolve through actual project config | `src/core/config/env.ts` validates `BASE_URL`, uses optional `DEMOQA_BASE_URL` with a default, and has no `TEST_ENV` selector. `playwright.config.ts` loads one `.env`, configures Chromium, and sets one worker in CI. | PARTIAL | `src/core/config/env.ts`; `src/config/Env.ts`; `playwright.config.ts`; `.env.example`; `.gitignore` |
| Prior `spec-requirements-standard` assessment | Historical M0 records results for both identified cases | Evidence records TC02 at 41.9% (Incomplete), TC08 at 61.3% (Needs refinement), average 51.6%, Ready 0/2. These are documented prior results; M0 was not re-run in this audit. | PARTIAL | `docs/evidence/spec-requirements-standard/implementation-and-validation.md` M0 assessment |
| Prior `spec-data-standard` verification | Historical M5 command and actual result are recorded | Evidence records TC02 with Chromium, 4 workers, 4 repetitions, 0 retries: 4/4 before and 4/4 after a tag-only change. It also states one environment and no account enumeration, so portability and orphan-zero are unverified. M5 was not re-run in this audit. | PARTIAL | `docs/evidence/spec-data-standard/implementation-and-validation.md` M5 verification |
| Prior execution records | Reported runs are backed by saved records/artifacts | `execution-summary.md` records TC08 individually (1 passed) and 9/9 in a full Chromium suite, with TC02 and TC08 in the report. The existing report file is present, but these historical runs do not establish a fresh run during this audit. | PASS | `docs/evidence/test-execution/execution-summary.md`; `playwright-report/index.html` exists |
| Evidence consistency | Current evidence agrees with current Skill files and dependencies | Contradictions found: requirements evidence says `spec-data-standard` is present in its compatibility section but later says it is absent; data evidence says the Skill is 250 lines while the current file is 251. | FAIL | `docs/evidence/spec-requirements-standard/implementation-and-validation.md` sections C/E; `docs/evidence/spec-data-standard/implementation-and-validation.md` C; current UTF-8 line count |
| Skill validation tooling | Automated structural validation result is established | Prior data evidence says `quick_validate.py` could not launch because Python executables were blocked. This audit did not re-run that validator; frontmatter/tool behavior is not claimed as independently validated here. | NOT VERIFIED | `docs/evidence/spec-data-standard/implementation-and-validation.md` G; validator result not reproduced in this audit |

## Relevant implementation files inspected

- TC source and specs: `docs/test-cases/demoqa/book-store-crud-test-cases.md`, `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts`, `tests/ui/smoke/books/TC08-delete-specific-book-from-collection.spec.ts`.
- Related shared-identity scenario: `tests/ui/smoke/cart/TC7-add-remove-product.spec.ts`, `src/data/users.ts`, `src/fixtures/index.ts`.
- DemoQA data and lifecycle: `src/sites/demoqa/data/books.ts`, `src/sites/demoqa/tests/fixtures.ts`, `src/sites/demoqa/api/abilities/UseBookStoreApi.ts`, `src/sites/demoqa/api/controllers/AccountController.ts`, `src/sites/demoqa/api/controllers/BookStoreController.ts`, `src/sites/demoqa/tasks/AddBookToCollection.ts`, `src/sites/demoqa/tasks/DeleteBookFromCollection.ts`.
- DemoQA UI support: `src/sites/demoqa/ui/abilities/UseDemoQaUi.ts`, `src/sites/demoqa/ui/components/BookStoreScreen.ts`, `src/sites/demoqa/ui/components/BookCatalog.ts`, `src/sites/demoqa/ui/components/BookDetails.ts`, `src/sites/demoqa/ui/components/LoginForm.ts`, `src/sites/demoqa/ui/components/ProfileCollection.ts`, `src/sites/demoqa/ui/elements/ProfileElements.ts`, `src/sites/demoqa/questions/CollectionContainsBook.ts`, `src/sites/demoqa/questions/UserCollection.ts`.
- Environment/runner: `src/core/config/env.ts`, `src/config/Env.ts`, `playwright.config.ts`, `tsconfig.json`, `.gitignore`, `.env.example`.
- Orchestration and supporting Skills: `AGENTS.md`, `.agents/skills/automation-architect/SKILL.md`, `.agents/skills/spec-quality-lifecycle/SKILL.md`, both target Skill files, `.agents/skills/api-setup-teardown/SKILL.md`, `.agents/skills/test-standards/SKILL.md`, `.agents/skills/spec-standards/SKILL.md`.
- Historical records: `docs/evidence/spec-requirements-standard/implementation-and-validation.md`, `docs/evidence/spec-data-standard/implementation-and-validation.md`, `docs/evidence/test-execution/execution-summary.md`.

## Existing implementation status

Both Skills exist and are registered. Their detailed modes and rules are present: requirements M0–M4/Q1–Q13; data M0–M5/R1–R15. The actual project uses site-oriented DemoQA paths, which the data Skill documents. The two DemoQA specs use the same fixture and reference-data module, but each test gets its own generated user. The `spec-data-standard` M5 record is specifically for TC02; it is not a TC08 M5 result. Existing execution records independently show TC02 and TC08 were included in a full suite and TC08 had a separate passing run.

No Skill was invoked and no tests were run as part of this pre-verification audit. Existing evidence was inspected, not reproduced.

## Missing/inconsistent items and blockers before Step 2

1. **Evidence corrections are needed for a reliable baseline:** resolve the contradictory `spec-requirements-standard` evidence text and change the `spec-data-standard` evidence line count to 251. Do this as documentation maintenance only; do not alter the Skill or tests during the audit.
2. **TC ID conflict remains open:** decide whether the existing padded TC02/TC08 identifiers are grandfathered or must be reconciled with `spec-standards`. Do not rename them during verification.
3. **Missing named dependency:** `spec-code-standard` does not exist, so its requested R7 example cannot be verified. `test-standards` owns credential storage but does not have that R7 example.
4. **M5 limits are structural:** only one environment is configured and the Account API cannot enumerate accounts by prefix. Step 2 must not claim cross-environment portability or zero orphans.
5. **Worktree is not clean:** verification should target this `main` worktree without staging, resetting, or discarding changes. All current modifications appear relevant to the two Skill prompts, but were not created by this audit.
6. **Skill activation is unproven:** existing files, registry entries, and past command output do not establish that Codex selected/invoked the Skills as runtime instructions. Step 2 must verify invocation separately from structural presence.

The full Skill verification is **not blocked** if these limitations are carried forward. Claims about the missing R7 reinforcement, cross-environment portability, orphan totals, and independent runtime Skill activation remain unverified until addressed or explicitly scoped out.

## Proposed verification order for Step 2

1. Preserve the current branch/worktree and treat the two identified paths as the fixed scope: TC02 and TC08.
2. Verify each Skill's frontmatter, line limit, required modes/rules, output formats, scan scope, and local references; compare actual line counts with evidence.
3. Verify `automation-architect` registration and routing, then lifecycle phase handoffs and ownership boundaries. Record missing aliases without substituting Skills silently.
4. Invoke `spec-requirements-standard` M0 on the existing TC document and compare per-rule findings for TC02/TC08 with the saved 41.9%/61.3% baseline.
5. Invoke `spec-data-standard` M0 on the resolved DemoQA and SauceDemo data/config/fixtures/spec scopes; review M1/M4 findings for TC02/TC08 without applying fixes.
6. Check current test execution evidence separately. If Step 2 calls for a new M5 run, first confirm the target remains the isolated DemoQA scenario; report the one-environment and orphan-enumeration limits, and run only with the required network authorization.
7. Resolve evidence inconsistencies in a separate documentation-only change after the audit results are accepted; leave source Skills, tests, configuration, and Git history untouched during verification.
