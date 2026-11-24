---
name: spec-quality-lifecycle
description: Review or improve Playwright scenarios and orchestrate their lifecycle, including test-data robustness handoffs. Use for scenario quality or lifecycle requests; delegate data isolation and environment portability to spec-data-standard, and fixture, Page Object, and spec organization implementation to their owners.
---

# Specification quality and lifecycle

Use this Skill for scenario-level quality: whether a test starts from a valid state, exercises a defined behavior, observes meaningful results, and finishes without leaking state or hiding failures. It complements the repository's implementation and organization Skills; it does not replace them.

## Lifecycle phases

| Phase | Responsibility and owner |
|---|---|
| 1. Specify | `spec-requirements-standard` owns TC document readiness. |
| 2. Arrange | `spec-data-standard` owns data isolation/sourcing (M1–M3); `api-setup-teardown` owns API provisioning mechanics. |
| 3. Act | `pom-architect` owns Page Objects; this Skill evaluates scenario actions, waits, and locators at the scenario level. |
| 4. Assert | This Skill owns scenario assertion specificity; `spec-data-standard` M4 supplies expected-value source guidance (R13). |
| 5. Run | `spec-data-standard` M5 gathers robustness execution evidence; CI owns reporting. |

Debugging is cross-cutting across all five phases. This Skill remains the lifecycle orchestrator; the added phase owners do not create another orchestration mode.

## Ownership boundaries

- `spec-requirements-standard` owns phase 1 (Specify) for `docs/test-cases/**/*.md`: traceability, provisioned preconditions, data declarations, exact oracles, postconditions, independence, coverage, and automation readiness. Invoke its M0 before automating a documented TC; use M1–M4 for requested writing, refinement, coverage, or handoff. Do not copy Q1–Q13 into this orchestrator.
- `spec-data-standard` owns phase 2 data Arrange (M1–M3), phase 4 expected-value sources (M4), and phase 5 robustness evidence (M5). Invoke it when the request involves data isolation, environment portability, exact data values, or parallel robustness. Do not duplicate R1–R15.
- The lifecycle orchestrator owns the complete lifecycle. Specification readiness does not replace the scenario implementation review below. In Create or improve mode, require a Ready M4 handoff before code generation; report gaps for an incomplete TC and do not silently invent missing requirements.
- `pom-architect` owns Page Object and component structure and implementation of UI locators and actions. You may identify a fragile selector used by a scenario, but report its implementation correction to `pom-architect`; do not prescribe or edit a Page Object under this Skill.
- `test-standards` owns test implementation conventions, fixtures, fixture lifecycle, test data, credentials, and environment hygiene. Delegate those concerns instead of duplicating its findings.
- `spec-standards` owns spec folder hierarchy, filenames, TC IDs, describe titles, and functional `test.step()` conventions.
- `code-conventions` owns general TypeScript quality.
- If an `api-setup-teardown` Skill is present, it owns API clients, API fixtures, and API setup/teardown mechanics. Otherwise, do not invent API-specific conventions; assess lifecycle needs and recommend an owner or ask for project guidance.
- This Skill owns scenario preconditions, postconditions, meaningful action outcomes, and determinism of scenario behavior.

Read the relevant Skills and inspect the actual repository patterns before applying a rule. Do not create overlapping or competing findings for another Skill's property.

## Modes

### Review (default)

Keep the review read-only unless the user explicitly requests fixes. Discover all in-scope specs, then inspect the applicable fixture and Page Object implementations, test data, and Playwright configuration needed to understand test state and execution. Evaluate each rule R1–R10 below; when evaluating R10 for data-bearing assertions, cross-check expected-value sources against `spec-data-standard` R13. Cite exact relative paths and line numbers. Separate confirmed violations from recommendations, and delegate findings that belong to another Skill.

### Create or improve

Start with `spec-requirements-standard` phase 1. Use its M4 handoff as the input contract; if no Ready handoff exists, report M0 gaps and do not generate automation from unresolved assumptions.

0. **Collect:** record `dataSource` (created, mock, dataset, or discovery) and `expectedValues` from the handoff or verified project requirements. Do not invent either.
1. Identify the initial state, actions, shared fixtures/Page Objects, and persistent data.
2. Preserve existing behavior and project conventions while implementing only the requested workflow.
3. **Assert:** consult `spec-data-standard` M4/R13 for data-bearing assertions. Assert the collected exact values with appropriate value matchers and their identified source; do not duplicate the complete R13 rule here.
4. Run relevant validation when feasible and report exactly what ran. Keep assertions in specs as required by repository architecture.

## Mandatory scenario-quality rules

### R1 — PRECONDITION_VERIFICATION

Establish that each scenario begins in the state required for its actions. Use existing fixtures or documented application setup where suitable. Flag assumptions that can make the scenario run against the wrong page, account, or state. Do not add redundant checks when a reliable fixture already establishes the precondition.

### R2 — POSTCONDITION_AND_CLEANUP

Verify meaningful end state and consider whether the scenario leaves persistent data or state that affects later tests. Use existing cleanup facilities when needed. Do not add a cleanup fixture when an existing fixture already handles it, and do not assume every UI interaction requires API teardown. Delegate fixture and teardown mechanics to their owner.

### R3 — NO_UNJUSTIFIED_FIXED_WAITS

Do not use fixed sleeps as synchronization when a relevant condition or Playwright auto-waiting can be used. Report a fixed wait only when it is unjustified for the observed behavior; a documented timing requirement may justify one.

### R4 — WEB_FIRST_ASSERTIONS

For UI state, prefer Playwright's retrying web-first assertions over immediate snapshots or manual polling. Do not flag legitimate non-UI or business-logic assertions solely because they are not web-first matchers. Assertion implementation conventions remain owned by `test-standards`.

### R5 — LOCATOR_RESILIENCE

Assess whether selectors used by a scenario are likely to identify the intended control reliably. Prefer, when supported by the application, accessible role/name, labels or placeholders, stable IDs or `data-test` attributes, then stable unique text. CSS may be appropriate when it is the most reliable available selector. Flag positional selectors, long structural CSS, or XPath when they are brittle in context. Never invent attributes or assume semantic alternatives are more reliable. Coordinate locator implementation findings with `pom-architect`.

### R6 — ACTION_RESULT_VERIFICATION

Verify the meaningful result of important scenario actions against the acceptance criteria. Do not add an assertion after every action or every locator interaction. An action without an observable outcome is a violation only when the intended behavior is otherwise left unverified.

### R7 — TEST_INDEPENDENCE

Scenarios should not depend on execution order or state left by another test. Identify shared mutable state, ordering dependencies, or data collisions that can affect repeatability. Respect existing fixture lifecycle and parallel-execution configuration; delegate fixture implementation fixes to `test-standards`.

### R8 — CONTROL_FLOW_AND_DETERMINISM

Evaluate actual execution paths, not syntax in isolation. Do not blanket-ban conditionals or loops. Report only demonstrated uncontrolled paths, silent success, hidden failures, order dependence, or non-deterministic data/state that can make outcomes unreliable.

### R9 — NAVIGATION_VERIFICATION

When navigation is part of the scenario, verify the intended destination or resulting page state. Avoid redundant checks when an explicit, reliable contract already verifies the destination and the relevant outcome.

### R10 — ASSERTION_SPECIFICITY

Assertions must verify the stated requirement and be specific enough to detect its failure. For data-bearing values, state the expected-value source and cross-check `.agents/skills/spec-data-standard/SKILL.md` R13; use an appropriate exact-value matcher when the requirement calls for value verification. Do not over-assert incidental presentation or unrelated details. Do not invent requirements that are absent from acceptance criteria or verified project behavior.

## Finding format

For each confirmed finding, use:

```text
[spec-quality-lifecycle] SEVERITY — RULE_NAME
File: <relative path>
Line: <line number or range>
Issue: <observed scenario-quality issue and its impact>
Recommendation: <smallest evidence-based correction>
Owner: <spec-quality-lifecycle or responsible Skill>
```

Use `ERROR` for correctness, isolation, or determinism risks; `WARNING` for resilience or maintainability risks; and `INFO` for optional improvements. Cite the rule name exactly (R1–R10 names above). Recommendations that are not mandatory violations must be listed separately. If no issue is found for a rule, report it as PASS with evidence; do not claim zero violations unless all ten rules were evaluated.

When a finding belongs to another Skill, preserve its evidence and identify that Skill as owner instead of duplicating its rule or prescribing a competing fix. Keep reports concise and distinguish observed facts from inference.
