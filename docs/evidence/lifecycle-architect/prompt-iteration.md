# Specification Quality Lifecycle — Prompt Iteration History

## Purpose

This document preserves the Phase 2 lifecycle-review history and records how the current `webauto` workspace progressed to the Phase 3 DemoQA implementation. Historical observations are labeled as such and are not presented as current findings.

## Phase 2 — initial review context

The Phase 2 prompt asked for a read-only evaluation of `spec-quality-lifecycle` R1–R10 and prohibited implementation changes and test execution. The review context supplied at that time reported possible TC02 concerns involving a shared account, collection-wide cleanup, an incompletely verified precondition, title specificity, and locator resilience. Those were prior reported observations, not independently verified facts in this document. Locator implementation belongs to `pom-architect`; API resource lifecycle belongs to `api-setup-teardown`.

At the start of the later Phase 3 task, this workspace contained the seven SauceDemo specifications and no DemoQA source implementation. That is the historical starting state for Phase 3, not the current repository state. The earlier Phase 2 snapshot's statements that DemoQA files were absent are retained here only as history and must not be reused as current status.

## Phase 3 — implementation transition

The Phase 3 assignment requested API setup and teardown with UI actions for two independent DemoQA Book Store scenarios. The implementation added shared actor contracts in `src/core/` and site-owned API, UI components, tasks, questions, data, and fixtures in `src/sites/demoqa/`. Specifications remain in the established `tests/ui/smoke/` tree.

| Case | Implemented lifecycle |
|---|---|
| TC02 — add a book | Fixture creates and authenticates a unique API user, verifies the empty collection, UI adds Git Pocket Guide, and API verifies its ISBN. |
| TC08 — delete one book | Test seeds two books for its own API user, UI deletes Git Pocket Guide, and API verifies its absence and the other ISBN's presence. |

Each scenario uses fixture-owned account state and cleanup. The test cases are independent and do not share account data. Assignment-required padded identifiers `TC02` and `TC08` are intentional exceptions to the general unpadded identifier convention in `spec-standards`.

The API contract and live behavior were checked during implementation, as recorded in the Phase 3 notes. The earlier Phase 2 statements that the DemoQA source and lifecycle evidence were absent no longer describe the repository. See `notes.md`, `skill-verification.md`, and `../test-execution/execution-summary.md` for implementation and validation records.

## Phase 4 — audit remediation

The independent audit identified stale repository context, a task-level title check, uncertain account cleanup after a partial create response, unneeded TLS verification bypass, a CSS modal locator, CI typecheck/browser setup, and an unused `@common/*` alias. Remediation moved the title result into the TC02 assertion, retained the returned UUID before later response validation, documented the unrecoverable lost/no-UUID response case, enabled the accessible dialog locator, removed `ignoreHTTPSErrors`, aligned project-specific Skill context, removed the unused alias, and updated CI with typecheck, Chromium-only installation, and a safe `BASE_URL` fallback.

The current Phase 4 execution record reports typecheck and discovery passing, the TC08 locator/cleanup check passing, and all nine Chromium tests passing. These are actual Phase 4 results recorded in `../test-execution/execution-summary.md`, not historical Phase 2 claims.

## Skills applied

The Phase 3 implementation work consulted and applied the responsibilities of `automation-architect`, `api-setup-teardown`, `pom-architect`, `test-standards`, `spec-standards`, `code-conventions`, `spec-quality-lifecycle`, and `git-standards` (read-only; no Git writes). This records Skill guidance used during implementation; it does not claim that each Skill ran an independent audit. The lifecycle R1–R10 check is documented separately in `skill-verification.md`.

## Validation history and status

The Phase 2 review did not run tests. During Phase 3, typecheck, Playwright discovery, the Chromium tests, and the HTML report were run and recorded in `execution-summary.md`. Phase 4 remediation results are added to that execution record after their actual validation. Do not infer a pass from the existence of a specification or a report file.

## Evidence policy

- Historical Phase 2 reports and hypotheses remain attributed to that earlier review context.
- Current implementation statements are checked against files in this workspace.
- A prior live API or browser probe is described as historical evidence unless its result is independently repeated.
- Skill consultation, a Skill-specific audit, typecheck, discovery, browser execution, and report inspection are distinct activities; this document does not conflate them.
- No evidence from another repository or checkout is used to establish current implementation state.
