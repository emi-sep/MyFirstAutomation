---
name: spec-quality-lifecycle
description: Review or improve Playwright test scenarios for complete preconditions, meaningful outcomes, and deterministic execution. Use alongside test-standards and spec-standards; it does not own fixture, Page Object, or spec organization rules.
---

# Specification quality and lifecycle

Use this Skill for scenario-level quality: whether a test starts from a valid state, exercises a defined behavior, observes meaningful results, and finishes without leaking state or hiding failures. It complements the repository's implementation and organization Skills; it does not replace them.

## Ownership boundaries

- `pom-architect` owns Page Object and component structure and implementation of UI locators and actions. You may identify a fragile selector used by a scenario, but report its implementation correction to `pom-architect`; do not prescribe or edit a Page Object under this Skill.
- `test-standards` owns test implementation conventions, fixtures, fixture lifecycle, test data, credentials, and environment hygiene. Delegate those concerns instead of duplicating its findings.
- `spec-standards` owns spec folder hierarchy, filenames, TC IDs, describe titles, and functional `test.step()` conventions.
- `code-conventions` owns general TypeScript quality.
- If an `api-setup-teardown` Skill is present, it owns API clients, API fixtures, and API setup/teardown mechanics. Otherwise, do not invent API-specific conventions; assess lifecycle needs and recommend an owner or ask for project guidance.
- This Skill owns scenario preconditions, postconditions, meaningful action outcomes, and determinism of scenario behavior.

Read the relevant Skills and inspect the actual repository patterns before applying a rule. Do not create overlapping or competing findings for another Skill's property.

## Modes

### Review (default)

Keep the review read-only unless the user explicitly requests fixes. Discover all in-scope specs, then inspect the applicable fixture and Page Object implementations, test data, and Playwright configuration needed to understand test state and execution. Evaluate each rule R1–R10 below. Cite exact relative paths and line numbers. Separate confirmed violations from recommendations, and delegate findings that belong to another Skill.

### Create or improve

Use acceptance criteria supplied by the user or verified from project artifacts. Do not invent product requirements. Before editing, identify the scenario's starting state, actions, expected outcomes, shared fixtures/Page Objects, and any persistent state. Preserve existing behavior and project conventions. Make only requested changes, then run relevant validation when feasible and report exactly what ran. Keep assertions in specs as required by this repository's architecture.

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

Assertions must verify the stated requirement and be specific enough to detect its failure. Do not over-assert incidental presentation or unrelated details. Do not invent requirements that are absent from acceptance criteria or verified project behavior.

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
