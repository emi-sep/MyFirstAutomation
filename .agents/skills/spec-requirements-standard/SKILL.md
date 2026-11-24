---
name: spec-requirements-standard
description: >
  Write, assess, and refine high-quality test case specifications for Playwright +
  TypeScript projects. Governs docs/test-cases/**: traceability, provisioned
  preconditions, classified test data, one action with an exact and deterministic
  expected result per step, postconditions, independence, coverage variants, and
  automation readiness. Produces a data handoff for spec-data-standard and a steps
  handoff for spec-quality-lifecycle Create mode. Load before automating a TC,
  writing TCs from requirements, or reviewing TC documents.
---

# Test case requirements and readiness

Own the specification document that states what a TC verifies, its starting state and data, exact expected results, actions, and final state. Specify and validate it before writing automation. A TC is Ready only if another engineer or agent can implement it without clarification.

## Scope and ownership

- Own specification content in `docs/test-cases/**/*.md` and rules Q1–Q13 below. Each feature has a Markdown document; each TC is a separate `###` section.
- The lifecycle orchestrator remains `spec-quality-lifecycle`; it invokes this Skill as phase 1 (Specify). This Skill does not orchestrate the full lifecycle.
- `spec-data-standard` consumes M4's classified data and source block. `api-setup-teardown` owns API setup and teardown mechanics; the exact alias `api-setup-teardown-standard` is absent. Do not claim nonexistent implementation conventions.
- `spec-quality-lifecycle` Create mode consumes M4's steps block. It owns lifecycle implementation after specification and does not duplicate Q1–Q13.
- `spec-standards` owns code spec organization and TC IDs in code. Preserve its conventions; the same TC ID must identify the document and code. It does not own this document's content quality.
- `automation-architect` Mode 5 equivalent (documentation synchronization) owns TC row existence/synchronization only, never content assessment. New rows use this Skill's template and include every mandatory field; unknown values are `TBD:`.
- Do not assess locators, API clients, test implementation, or execution reporting here. Coordinate distinct properties with their owning Skills.

## Terms and constraints

- An **oracle** is the exact expected result compared with a test step. Every step has one action and an exact, deterministic, verifiable oracle; otherwise it is not a valid test step.
- A **captured value** is read during the test and reused later. Write it as `{itemTitle}`; never say “the value from step N.”
- Use relative paths such as `/items`; the configured environment supplies the base URL.
- Data classes: Reference, Environment, Transactional, Secret, Simulated. Sources may be dataset, factory, discovery, mock, or environment.
- Never invent requirements, business rules, expected results, preconditions, data, APIs, or application behavior. Mark unknowns `TBD: <question>` and keep unresolved items visible.
- The rules/examples are generic. Project-specific values come only from its TC documents and data files.

## TC section template

Use this complete template for every new or rewritten TC. `*` fields are mandatory.

```markdown
### TC{N}: <Imperative title> *

| Field | Value |
|---|---|
| Requirement / AC * | <REQ-ID> · <acceptance criterion it verifies> |
| Objective * | <one sentence describing behavior verified and why it matters> |
| Priority * | High · Medium · Low |
| Suite * | smoke · regression |
| Type * | positive · negative · boundary · data-driven |
| Tags | `@mutates-data` · `@read-only` · `@env:<name>` |
| Automation * | Automatable · Partial (<reason + workaround>) · Manual (<reason>) |

**Preconditions** *

| # | State | Provisioned by | Scope |
|---|---|---|---|
| P1 | <exact initial state> | API · fixture · mock · UI | test · worker · shared read-only |

**Test data** *

| Item | Value or generation rule | Class | Source |
|---|---|---|---|
| <name> | <exact value / `qa_` + unique suffix / first entry from API> | Reference · Transactional · ... | dataset · factory · discovery · mock · env |

**Steps** *

| # | Action | Expected result (oracle) |
|---|---|---|
| 1 | <one user action> | <exact, deterministic, verifiable result> |

**Postconditions** *

| State after the test | Cleanup | Scope |
|---|---|---|
| <final state> | <what is removed and how> | only data created by this TC |

**Risks / notes** — parallel, environment, or product constraints (optional).
```

## Modes

M0 is the default.

### M0 — Assess (read-only)

Triggers: `assess test cases`, `tc spec review`, `spec requirements`.

1. Discover every Markdown file under `docs/test-cases/**/*.md`; split on individual `###` TC sections. Report documents with no TC sections.
2. Evaluate Q1–Q13 for each TC. A rule passes only when document evidence satisfies it. Missing evidence is a failure, not proof of compliance.
3. Score `100 × passed weight / total weight`; ERROR weighs 3, WARNING weighs 1; failed rules earn zero. Grade Ready ≥90, Needs refinement 60–89, Incomplete <60. Any unresolved `TBD` prevents Ready, regardless of score.
4. Report each TC, average, Ready count, most frequent gaps, unresolved TBDs and conflicts. Recommend M2 for the lowest score. Do not edit files. Only Q13 formatting/numbering may be fixed during M0 when the user explicitly authorizes it.

```text
[spec-requirements-standard] ASSESSMENT
File: docs/test-cases/<site>/<feature>-test-cases.md
TC01  <score>%  <grade>   top gaps: Q4, Q6, Q12
Average: <score>%
Ready: <n>/<total>
Most frequent gaps: Q6 (<n>) · Q9 (<n>) · Q3 (<n>)
Recommended next mode: M2 on <lowest-score TC>
```

### M1 — Write

Triggers: `write test case`, `new tc spec`, `spec from requirement`.

Infer available context; request only essential missing information: requirement/story, acceptance criteria, feature, site, and known business rules. Write one TC per AC; M3 may propose variants. Complete the template, use `TBD:` for unknowns, never invent an oracle, apply Q1–Q13, and do not grade unresolved TCs Ready. Add it to the appropriate feature document using the next available ID without duplication.

### M2 — Refine

Triggers: `refine test case`, `improve tc`, `make tc robust`.

Run M0 and record baseline. Rewrite with the complete template, address failed rules, preserve ID and intent, and explain a proposed split if intent is not testable. Never silently change scope. Append a Change log with `Qn — <what changed and why>`, rerun M0, and report scores before/after plus open questions.

### M3 — Coverage

Triggers: `tc coverage`, `derive negative cases`, `traceability matrix`.

Map requirement/AC × TC. Look for equivalence partitions, boundaries, state transitions (create/read/update/delete), anonymous/owner/different-user roles, error guessing, and data-driven rows. Explain the technique behind each gap. Combine variants differing only in data into one data-driven TC with a dataset table. Write distinct cases through M1; do not invent coverage expectations beyond supplied requirements.

### M4 — Automation readiness

Triggers: `automation readiness`, `handoff tc`, `ready to automate`.

Require M0 ≥90, Ready, no unresolved TBD, and no ERROR. Confirm Q12 decision and any Partial workaround; map preconditions to fixture/controller strategies and data to the `spec-data-standard` handoff. Generate and append the following conceptual contract. Fixture names are examples, not claims that implementations exist; adapt only to verified project fixtures.

```yaml
tc: TC{N}
title: <title>
suite: smoke
tags: ['@mutates-data']
automation: automatable
fixtures:
  identity: worker<Resource>
  state: clean<Resource>
data:
  - name: item
    class: reference
    source: discovery
captured: [itemTitle]
steps:
  - action: open /items
    oracle: heading = "<exact text>"; first row title = item.title
postconditions:
  - only items created by this TC are removed
```

## Q1–Q13 quality rules

ERROR blocks Ready; WARNING reduces score but does not alone block Ready.

| ID | Rule | Severity | Fail when | Required correction |
|---|---|---|---|---|
| Q1 | `TC_METADATA_COMPLETE` | ERROR | Requirement/AC, priority, suite, type, or automation missing | Fill it; unknown is `TBD:` |
| Q2 | `OBJECTIVE_STATED` | WARNING | Objective missing or repeats title | State behavior and value in one sentence |
| Q3 | `PRECONDITIONS_PROVISIONED` | ERROR | Any precondition lacks provisioning method or scope | Specify API, fixture, mock, or UI and scope |
| Q4 | `TEST_DATA_DECLARED` | ERROR | Data is embedded in steps, introduced as “e.g.”, unique fields are static, secrets are clear text, or data table is missing | Declare value/rule, class, and source; generate unique values; reference secrets via environment |
| Q5 | `ONE_ACTION_PER_STEP` | WARNING | Step has multiple actions or no expected result | Split into action/result steps |
| Q6 | `EXACT_ORACLE` | ERROR | Oracle only checks presence, visibility, non-emptiness, or “at least one” when exact value is knowable | State exact value or declared data reference |
| Q7 | `DETERMINISTIC_ORACLE` | ERROR | Oracle uses ambiguous alternatives such as “or”, “e.g.”, “should”, “some”, or “any” | Specify one outcome; otherwise mark `TBD:` |
| Q8 | `VERIFIABLE_ORACLE` | ERROR | Oracle has undefined reference (e.g. “no unrelated results” without known dataset) | Define dataset, mock, or API-discovered reference |
| Q9 | `POSTCONDITIONS_DEFINED` | ERROR | TC mutates data without final state or cleanup scope | Define final state and scoped cleanup |
| Q10 | `INDEPENDENT_TC` | ERROR | TC uses state from, or destroys state needed by, another TC | Provision own state and isolate destructive actions |
| Q11 | `ENV_AGNOSTIC_STEPS` | WARNING | Steps contain absolute URLs, hostnames, or environment IDs | Use relative paths and environment-classified data |
| Q12 | `AUTOMATION_DECISION` | WARNING | Decision absent or Partial/Manual reason or workaround undefined | State Automatable, Partial with workaround, or Manual with reason |
| Q13 | `STEP_REFERENCES_VALID` | ERROR | Step numbering, formatting, or captured-value references are broken | Renumber and use named values such as `{itemTitle}` |

M0 is otherwise read-only. All other corrections require M2 and a Change log. Never invent an oracle, requirement, precondition, business rule, or data value.

## Violation format

Report only evidence in the document; do not speculate.

```text
[spec-requirements-standard] SEVERITY — RULE_NAME
File:  docs/test-cases/<site>/<feature>-test-cases.md
TC:    TC{N} · step <n> (if applicable)
Issue: <one sentence describing the problem>
Fix:   <one sentence describing the fix> | AUTO-APPLIED | MANUAL-FIX
```

## Generic example

Bad: “Enter a unique username (e.g., `sample01`). Assert the button is not visible or disabled.”

Better: declare `username | qa_ + unique suffix | Transactional | factory`; use one step to enter `{username}` with oracle `Username field value equals {username}`. A separate step checks one exact state, e.g. `"Delete All" button is not rendered` when that oracle is supported by the requirement.
