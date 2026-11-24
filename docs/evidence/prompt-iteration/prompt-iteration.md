# Prompt iteration: `spec-requirements-standard` and `spec-data-standard`

## 1. Objective

Record how the two Skill prompts were adapted to the `webauto` project, how the Skills were applied to TC02 and TC08 in Step 2, and what should change in a later iteration. This document is based on repository evidence. The original versions of the two prompts are not present in this repository, so this is not a direct line-by-line prompt comparison and does not invent original wording.

## 2. Repository and execution context

- Repository: `webauto` (absolute local profile path redacted)
- Branch: `main`
- Worktree: dirty before this step with prior Skill, test metadata, and evidence changes. No existing changes were staged, discarded, or rewritten.
- This step only creates this prompt-iteration record. No Skills, implementation code, tests, configuration, or Git history were changed.
- The repository includes `docs/evidence/lifecycle-architect/prompt-iteration.md` and implementation evidence for both target Skills. It does not contain archived original prompt versions for `spec-requirements-standard` or `spec-data-standard`.
- Fixed verification scope: TC02 and TC08 in `docs/test-cases/demoqa/book-store-crud-test-cases.md`, implemented at `tests/ui/smoke/books/TC02-add-book-to-collection.spec.ts` and `tests/ui/smoke/books/TC08-delete-specific-book-from-collection.spec.ts`.

## 3. Original prompt adaptations — `spec-requirements-standard`

The implementation record describes the prompt adaptations; without original prompt files, exact wording changes cannot be independently diffed.

- **Project TC structure:** The Skill was scoped to `docs/test-cases/**/*.md`, with one TC per `###` section. Its template now makes requirement/AC, objective, priority, suite/type, automation, provisioned preconditions, classified data, one-action steps with an oracle, postconditions, and optional risks explicit. The actual project case source is one DemoQA Markdown document with TC02 and TC08 sections.
- **Ownership and routing:** Document content belongs to this Skill; `spec-quality-lifecycle` remains orchestrator and invokes it in phase 1. `automation-architect` registers the Skill and routes TC requests through the Full Pipeline. `spec-standards` continues to own code-side file/title/TC ID conventions; API mechanics and test implementation remain with their existing owners.
- **Repository mode alignment:** Implementation evidence records adapting requests for numbered hub modes to the repository's existing Full Pipeline and lifecycle phases instead of introducing a duplicate orchestration mode. M0–M4 are the Skill's modes, not newly invented orchestrator modes.
- **Output and validation:** The Skill defines weighted M0 scoring (ERROR 3, WARNING 1), grades, average/readiness reporting, a M4 YAML handoff, and a rule-based violation format. The direct Step 2 prompt made the exact TC paths, per-rule evidence, historical score comparison, read-only scope, and no-test/no-M5 boundary explicit. Step 2 applied M0 and reproduced the recorded baseline.
- **Limitations:** TC02 and TC08 lack requirement/AC and other required metadata, data declarations, per-step oracles, and automation decisions. The padded document/code identifiers conflict with `spec-standards`; no decision was made. These are specification findings, not Playwright failures.

## 4. Original prompt adaptations — `spec-data-standard`

As with the requirements Skill, the prompt history is summarized from implementation records and current Skill instructions rather than compared to unavailable original prompt text.

- **Project paths:** Generic locations were resolved to site-oriented data, API, and fixture paths: `src/sites/demoqa/data/`, `src/sites/demoqa/api/`, and `src/sites/demoqa/tests/fixtures.ts`. Shared configuration remains `src/core/config/env.ts` (with `src/config/Env.ts` as compatibility re-export); runner and specs remain `playwright.config.ts` and `tests/`. No folder migration was introduced.
- **Existing contracts:** The Skill uses the current environment helper, API controllers, fixture, `demoQaBooks` typed data, and Chromium project. It does not create another environment source or replace the existing config contract. It leaves API lifecycle mechanics to `api-setup-teardown` and credentials hygiene to `test-standards`.
- **Modes and rules:** The Skill documents M0–M5 and R1–R15, with data classes, maturity levels, isolation strategies, environment readiness, controlled expected-value sources, and repeated-run evidence. Requested orchestration/API aliases and mode names were mapped only where implementation evidence identifies an actual local owner; `spec-code-standard` remains missing.
- **Safety boundaries:** M0 is read-only; M5 must establish scope, browser/environment, test-owned mutation and cleanup safety before running and must not claim orphan-zero when enumeration is unavailable. Step 2 added explicit prohibitions on M5, tests, account creation/deletion, source edits, and Git changes. It also required that existing M5 evidence remain clearly historical.
- **Verification results:** M0 found DemoQA at Level 1 Externalised; M1 found per-test identity isolation but reported R4 CI worker suppression and R12 missing cleanup guard; M4 found typed expected book values. R9 environment selection remains partial, and cross-environment portability is not demonstrated.
- **Why M5 was not rerun:** Step 2 explicitly prohibited M5 and all Playwright execution. The fixture performs persistent account/collection operations and the current bulk cleanup has no configured destructive-cleanup guard. In addition, only one environment is configured and the Account API cannot enumerate accounts by prefix. Historical TC02 M5 results therefore remained historical evidence; TC08 received no new M5 result.

## 5. Step 2 verification feedback

| Item | Verified result | Interpretation |
|---|---|---|
| Requirements M0 | TC02 41.9% Incomplete; TC08 61.3% Needs refinement; average 51.6%; Ready 0/2. | These are document-quality scores, not test outcomes. They match the prior M0 evidence. |
| Data scope | M0, M1 and M4 were applied to DemoQA and the two named TCs. | No M5 or test execution occurred. |
| Isolation/cleanup | Per-test accounts and scoped ownership were found. R4 identifies CI `workers: 1` without documented rationale; R12 identifies unguarded bulk cleanup of the fixture-owned collection. | Both findings need operational/policy decisions; neither was fixed in Step 2. |
| Environment | R9 is partial: URL validation exists, but there is one fixed `.env` setup and no `TEST_ENV` selector. | Cross-environment portability is not demonstrated. |
| Orphans | Account API can address known users but cannot enumerate accounts by prefix. | Orphan-account totals are not verifiable, not zero. |
| Dependencies and conventions | `spec-code-standard` is absent; padded TC02/TC08 identifiers conflict with the `spec-standards` code convention. | Do not invent a dependency or silently rename IDs. Both remain unresolved. |
| Skill activation | Instructions were explicitly applied as a verification procedure. | Automatic Codex Skill activation could not be independently confirmed. |
| Output formats | Step 2 marked both Skills' expected formats compliant and supplied per-rule scores/findings and M0 maturity output. | This is evidence-format compliance, not execution evidence. |
| Tests | No tests and no M5 were executed during Step 2. | No test passed or failed during that step. |

**Evidence consistency note:** The Step 2 report initially had inconsistent R14 wording. Step 4 remediation corrected the overall paragraph to agree with the M4 and consolidated findings (`NOT APPLICABLE`). The independent environment-portability and orphan-account limitations remain unverified.

## 6. Implemented improvements

The following adaptations are supported by the current Skill files and their implementation evidence. “Implemented” refers to the earlier Skill/prompt integration, not a change made in this step.

| Improvement | Why it matters | Prompt/Skill | Evidence | Implemented? |
|---|---|---|---|---|
| Resolve TC document scope and use a complete one-TC section template. | Makes the source of requirements, setup, data, oracles and cleanup explicit and reviewable. | `spec-requirements-standard` | `.agents/skills/spec-requirements-standard/SKILL.md`; `docs/evidence/spec-requirements-standard/implementation-and-validation.md` | Yes |
| Define weighted M0 scoring, grades, findings and M4 handoff. | Makes assessment and automation readiness repeatable and prevents inventing missing requirements. | `spec-requirements-standard` | Skill M0/M4 sections; implementation evidence M0 results | Yes |
| Resolve generic data/config/fixture/API paths to the actual site-oriented layout. | Keeps current project organization and avoids fictitious root-level modules. | `spec-data-standard` | `.agents/skills/spec-data-standard/SKILL.md`; `docs/evidence/spec-data-standard/implementation-and-validation.md` | Yes |
| Integrate data ownership into existing lifecycle phases and registry. | Prevents a second orchestrator and separates requirements, API, test, data and scenario responsibilities. | Both; `automation-architect`; `spec-quality-lifecycle` | Registry and ownership tables; lifecycle phase table | Yes |
| Add read-only M0 and M5 safety preconditions, including scoped mutation/cleanup and honest orphan reporting. | Avoids unapproved changes and unsupported robustness claims. | `spec-data-standard` | Skill M0/M5 rules and historical M5 evidence limitations | Yes |
| Require exact paths, modes, rules, evidence, statuses, historical comparison and no-execution constraints in Step 2. | Makes the verification auditable and keeps Skill findings distinct from Playwright results. | Step 2 verification prompt | `docs/evidence/skill-verification/skill-verification-results.md` | Yes |

## 7. Recommended next iterations

These are proposals only; none were implemented in this step.

| Proposed improvement | Why it matters | Affected prompt/Skill | Evidence | Implemented? |
|---|---|---|---|---|
| Add a required consistency check between detailed findings and the overall verdict/status counts. | Step 2's R14 detail and overall wording initially disagreed. | Both Skill verification prompts and evidence template | Step 2 report Sections 8, 12 and 13; Step 4 corrected the R14 wording. | The report correction is implemented; retain a consistency check in future prompt iterations. |
| Require literal actual line counts and reconcile them against prior implementation evidence. | Current data Skill has 251 lines while its implementation record says 250. | Skill structure verification | Current `.agents/skills/spec-data-standard/SKILL.md`; implementation evidence | No — recommended |
| Require cross-checking dependency statements across the full historical implementation report. | Requirements evidence had said `spec-data-standard` was both present and absent. | Requirements prompt/evidence validation | Step 4 corrected Section E to agree with current Skill registration; `docs/evidence/spec-requirements-standard/implementation-and-validation.md` | Correction implemented; retain the check in future iterations. |
| Keep automatic Skill activation separate from explicit application in every verification report. | A registry entry or file does not prove runtime activation. | Both verification prompts | Step 2 invocation method; `automation-architect` registry note | Yes in Step 2; retain in future prompts |
| Keep M5 as a separate authorized execution stage after cleanup safety and scope are resolved. | M5 has persistent effects and the fixture's bulk cleanup lacks the configured guard. | `spec-data-standard` verification prompt | Step 2 R12 finding and explicit no-M5 boundary | No — recommended for later phase |
| Refine TCs only after actual requirement/AC and data source details are supplied. | Current M0 gaps cannot be filled without risking invented behavior or oracle values. | `spec-requirements-standard` M2 prompt | TC02/TC08 M0 results, Ready 0/2 | No — recommended |
| Keep environment portability and orphan claims explicitly limited until capabilities exist. | One environment and no account-prefix enumeration cannot substantiate those results. | `spec-data-standard` M3/M5 prompts | Step 2 limitations and Account API scope | Yes as a reporting limitation; further environment/API work not implemented |

## 8. Pending decisions

No decisions below were implemented or approved by this documentation step.

| Decision | Finding | Recommended approach | Approval status |
|---|---|---|---|
| Cleanup guard | R12 | Preserve cleanup restricted to fixture-owned data and explicitly protect destructive bulk operations. Define the guard/config contract before modifying cleanup. | Pending |
| CI workers | R4 | Keep one worker temporarily and document the operational rationale; revisit parallelism only after the reason is understood. | Pending |
| TC identifiers | `spec-standards` conflict | Preserve current IDs for this delivery only if an explicit exception is approved; do not rename TC02/TC08 without the team decision. | Pending |
| Requirements/AC and TC content | M0 Ready 0/2 | Provide authoritative requirements, acceptance criteria, and verified data/oracles before M2 refinement. Unknowns remain `TBD:` until supplied. | Pending |
| Missing `spec-code-standard` dependency | R7 credential-example reinforcement unavailable | Identify the real owner or explicitly accept that the specific reinforcement cannot be checked; do not create an alias by assumption. | Pending |

## 9. Before-and-after comparison

“Original limitation” below describes only what the implementation records say was adapted. Since original prompt versions are unavailable, it must not be read as a verbatim assessment of unseen prompt text.

| Prompt | Original limitation | Adaptation | Verification evidence | Further improvement | Status |
|---|---|---|---|---|---|
| `spec-requirements-standard` | Implementation record describes generic numbered pipeline requests that did not match this repository's Full Pipeline and lifecycle owner. | Integrated M0–M4 into the registered Skill and lifecycle phase 1; used `docs/test-cases/**/*.md` and the project TC template; made scoring and M4 handoff explicit. | Both TCs assessed individually; 41.9% and 61.3%, average 51.6%, Ready 0/2. | Supply verified requirement/AC and resolve padded-ID convention before refinement. | IMPLEMENTED |
| `spec-requirements-standard` | Missing metadata and per-step data/oracle requirements were not evidenced in the existing short-form TC document. | Skill now defines required fields and exact rule-based M0 checks without inventing missing facts. | Step 2 identifies Q1–Q8/Q12 gaps individually; TC02/TC08 remain not Ready. | M2 refinement after requirement and data facts are supplied. | RECOMMENDED |
| `spec-data-standard` | Implementation record describes generic root paths and requested mode/API names that do not match project structure. | Resolved per-site paths, existing config and fixtures; aligned data work with lifecycle phases and API `Implement` ownership; retained M0–M5/R1–R15. | Step 2 applied M0/M1/M4 to DemoQA; R4/R12 findings and partial R9 recorded. | Add evidence self-consistency checks and resolve cleanup/CI decisions before M5. | IMPLEMENTED |
| `spec-data-standard` | Environment and orphan verification cannot be inferred from one configured environment or known-user-only API operations. | Prompt and Skill require explicit environment/orphan limitations and do not claim portability or orphan-zero. | Step 2 reports both as unverified and did not run M5. | Add a second supported environment and safe project-account enumeration before making those claims. | IMPLEMENTED |
| Both verification prompts | Skill files and registry presence alone could be confused with runtime activation or test execution. | Step 2 separately recorded explicit instruction application, unconfirmed automatic activation, and no tests/M5. | Step 2 invocation, historical comparison and execution boundary sections. | Preserve this distinction and reconcile contradictory R14 wording in the report. | IMPLEMENTED |
| Both verification prompts | Original prompt archives are unavailable in this repository. | Document adaptations from current Skills and implementation records, without a line-by-line reconstruction. | Repository prompt search found only `docs/evidence/lifecycle-architect/prompt-iteration.md`. | Archive approved prompt versions if future line-by-line history is required. | NOT REQUIRED |
| `spec-data-standard` integration | Exact local `spec-code-standard` is absent. | Kept the dependency limitation visible and did not pretend `test-standards` implements its specific example. | Registry/ownership and Step 2 dependency finding. | Resolve dependency ownership if that example is required. | PENDING APPROVAL |
| `spec-standards` integration | Assignment-required padded IDs differ from the current unpadded code convention. | Preserved TC02/TC08 without renaming and reported the conflict. | Step 1 audit and Step 2 consolidated finding. | Approve a delivery exception or determine a mapping before future renames. | PENDING APPROVAL |

**Step 4 follow-up:** The approval statuses above describe the position when this Step 3 record was written. The subsequent Step 4 instruction explicitly approved the cleanup guard, CI worker rationale, TC02/TC08 delivery exception, and use of `TBD:` for unavailable requirement/acceptance data. Implementation and remaining limitations are recorded in `docs/evidence/skill-verification/implementation-remediation.md`.

## 10. Final assessment

The prompt adaptations are documented from repository implementation evidence, not reconstructed original prompt files. Step 2 explicitly applied both target Skills and respected their expected output formats. It found requirements-document gaps and data robustness policy gaps; it did not report Playwright failures because it ran no tests and no M5.

The repository is **not ready for the next mutating implementation/execution phase without decisions first**. In particular, decide the R12 cleanup guard and R4 CI worker rationale before a final mutating Chromium run, and resolve the TC identifier exception. Requirements refinement also needs authoritative requirement/AC and data/oracle facts. Cross-environment portability, orphan totals, and automatic Skill activation remain unverified. This assessment does not authorize code changes or start Step 4.
