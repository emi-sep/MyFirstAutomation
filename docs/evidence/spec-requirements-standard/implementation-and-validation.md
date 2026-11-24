# `spec-requirements-standard` implementation and validation

## A. Objective

The repository had scenario-quality rules for implemented Playwright specs, but no owner for the requirements, data, oracle, and readiness quality of the test case documents that precede code. This Skill defines that phase and hands a validated specification to the lifecycle orchestrator.

## B. Implementation

Created `.agents/skills/spec-requirements-standard/SKILL.md`. Modified `.agents/skills/automation-architect/SKILL.md`, `.agents/skills/spec-quality-lifecycle/SKILL.md`, and `docs/ai-automation-sdlc.md`. This evidence document records the implementation and read-only validation.

The new Skill owns `docs/test-cases/**/*.md`, a complete TC section template, Q1–Q13 content checks, and M0–M4 (Assess, Write, Refine, Coverage, Automation Readiness). M0 is read-only except explicitly authorized Q13 formatting/numbering. M4 requires at least 90%, Ready grade, no TBD, and no ERROR before producing a conceptual YAML handoff.

`automation-architect` registers the Skill, assigns document-content scan ownership, runs M0 before code generation in the Full Pipeline, reports Incomplete TCs as manual items, routes TC requests through the lifecycle Skill, and limits documentation synchronization to row existence. New rows use the complete template and mark unknowns TBD.

`spec-quality-lifecycle` invokes the new Skill as phase 1. It remains the full lifecycle owner, requires an M4 handoff for Create mode, and does not duplicate Q1–Q13.

## C. Compatibility analysis

| Existing rule or convention | Evidence and resolution |
|---|---|
| Scenario preconditions, outcomes, postconditions, independence, determinism | `spec-quality-lifecycle` R1–R10 apply to implemented specs. The new Skill applies corresponding requirements to the source TC document; fixture and cleanup mechanics remain delegated. This separates document content from code behavior. |
| TC IDs | `spec-standards` requires unpadded `TC{N}` IDs in code. Existing documentation uses `TC02` and `TC08`. Step 4 approved and documented a narrow exception preserving these identifiers for this delivery; longer-term document/code mapping remains to be reconciled. No ID was changed. |
| File organization | `spec-standards` governs `tests/ui/{suite}/{feature}/...`; this Skill governs `docs/test-cases/` feature Markdown. No folder or naming rule was added for implementation specs. |
| Setup and teardown | `spec-quality-lifecycle` assesses scenario lifecycle; `api-setup-teardown` owns API mechanics, and `test-standards` owns fixtures/data in code. The new Skill requires provisioning and scoped cleanup to be specified but does not prescribe implementation. |
| Automation handoff | The current lifecycle Skill had no M4 contract. It now consumes the new Skill's M4 handoff as Create-mode input; actual fixtures must be verified before claiming they exist. |
| Referenced Skill names | `spec-data-standard` is now present and consumes M4 data classes/sources. Exact aliases `api-setup-teardown-standard` and `spec-quality-lifecycle-standard` are absent; the actual owners are `api-setup-teardown` and `spec-quality-lifecycle`. No alias Skills were created. |
| Orchestration modes | `automation-architect` has a Full Pipeline and no numbered Modes 1/5/7. Integration was adapted to its Full Pipeline, documentation synchronization section, and invocation reference; no duplicate mode was created. |

Additional overlap: Q3/Q9/Q10 align with lifecycle precondition, cleanup, and independence concerns. The lifecycle Skill owns implementation review; this Skill owns the source document's completeness. Q6–Q8 define document oracle quality, not assertion implementation.

## D. Validation

### Structural and integration checks

- New Skill path and YAML frontmatter: verified in repository.
- Skill size: 186 lines, below the 400-line limit.
- Required Q1–Q13 and M0–M4, all mandatory template fields, and assessment/violation formats: structural string checks passed.
- Architect registry and scan ownership: added. M0-before-codegen, documentation row-only boundary, TC routing triggers, and invocation reference: added.
- Lifecycle integration: phase 1 ownership and Create-mode M4 gate added; Q1–Q13 are not copied into the orchestrator.
- No duplicate orchestrator or numbered modes were added.
- Cross-Skill conflict check: performed against automation-architect, spec-quality-lifecycle, spec-standards, test-standards, api-setup-teardown, and pom-architect.
- No test cases were modified. No test suite or typecheck was run; these documentation-only changes do not alter application/test code.
- `git diff --check` completed without whitespace errors. Git displayed line-ending conversion warnings for existing working-tree settings; these were not validation failures.

### M0 assessment of existing documents

Scope discovered: `docs/test-cases/demoqa/book-store-crud-test-cases.md`, containing TC02 and TC08. M0 evaluated all 13 rules for both. Scores use ERROR weight 3 and WARNING weight 1 (31 possible points per TC).

| TC | Passed rules | Score | Grade | Gaps |
|---|---:|---:|---|---|
| TC02 | 13/31 weighted points | 41.9% | Incomplete | Q1 metadata absent; Q2 objective absent; Q3 provisioning scope not explicit; Q4 no data table; Q5 compound actions and no per-step oracles; Q6 exact expected ISBN is not stated; Q8 selected ISBN is not declared as a data reference; Q12 automation decision absent. |
| TC08 | 19/31 weighted points | 61.3% | Needs refinement | Q1 metadata absent; Q2 objective absent; Q3 provisioning scope not explicit; Q4 no data table; Q5 compound actions and no per-step oracles; Q12 automation decision absent. |

Average: 51.6%. Ready: 0/2. Needs refinement: 1. Incomplete: 1. Most frequent gaps: Q1, Q2, Q3, Q4, Q5, Q12 (each in 2 TCs).

No literal `TBD:` values occur in the two existing TCs. Missing mandatory values are unresolved information, not invented as facts. Q3 fails because the fixture/API provisioning method is described but its scope (test, worker, shared read-only) is not. TC02's selected book is named, but its exact ISBN is not stated or declared in a test-data table; that makes its exact oracle and reference unverifiable. TC08 explicitly names both books and states API verification for absence/retention, so its Q6/Q8 pass. Both cases describe fixture cleanup scoped to the owned account and claim independence; these statements satisfy Q9/Q10 at document level. Steps contain no absolute URL or hostname. Both have numbered steps and no broken captured-value references.

These scores are M0 rule application to the current text, not product-behavior validation. Recommended next mode: M2 on TC02, then TC08. Refinement needs the actual requirement/AC, explicit provisioning scope, verified data values/rules, exact per-step oracles, and automation decisions; do not infer them.

## E. Prompt iteration

- Adapted requested “Mode 1” pipeline integration to the repository's single Full Pipeline, preserving the requested M0 gate before code generation.
- Adapted requested “Mode 5” and “Mode 7” to existing documentation synchronization guidance and Skill Invocation Reference. The repository has no corresponding numbered modes.
- Used actual `spec-quality-lifecycle` name and kept it as orchestrator; the requested `spec-quality-lifecycle-standard` alias does not exist.
- `spec-data-standard` is present and registered as a local Skill. The exact alias `api-setup-teardown-standard` is absent; the current API Skill is named `api-setup-teardown`.
- Did not modify source TCs, because M0 is read-only and their substantive corrections require unresolved requirement/data information.

Step 4 approved the padded TC02/TC08 identifiers for this delivery only; longer-term document/code mapping remains to be reconciled. Actual requirement IDs/ACs and priorities remain unavailable, so the two TCs retain `TBD:` and are not Ready.

## F. Final status

**READY WITH WARNINGS** for the Skill implementation and integration: the new Skill, lifecycle boundaries, M0 assessment, and evidence are present. The existing TCs are not Ready (0/2); the delivery-only padded-ID exception is documented, while longer-term mapping and missing dependency limitations remain. This status does not claim the test cases are suitable for automation.
