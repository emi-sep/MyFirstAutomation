# AI Automation SDLC

This document explains how Codex Skills support automation work in `webauto`. It summarizes the governance model; each Skill's `SKILL.md` remains the source of its detailed rules.

## Current project and Skill inventory

The repository is a Node.js, TypeScript, Playwright Test project. The checked-in configuration uses strict TypeScript, `NodeNext` module resolution, and Playwright's Chromium project. Specs are under `tests/ui/smoke/`. DemoQA API/UI implementation is under `src/sites/demoqa/`, with test case documentation under `docs/test-cases/demoqa/` and execution evidence under `docs/evidence/`.

These Skill directories currently exist:

| Skill | Responsibility | Use condition | Status |
|---|---|---|---|
| `automation-architect` | Routes cross-cutting work, coordinates ownership, and maintains architecture governance. | Use for full SDLC work or cross-cutting decisions. | Active |
| `pom-architect` | Page Objects, UI components, locators, and navigation architecture. | Use when creating, reviewing, or changing UI abstractions. | Active |
| `test-standards` | Test implementation, fixtures, test data, and credential hygiene. | Use for spec implementation and shared test infrastructure. | Active |
| `spec-standards` | Spec hierarchy, filenames, TC IDs, describe names, and functional `test.step()` use. | Use when organizing, reviewing, or changing specs. | Active |
| `code-conventions` | General TypeScript safety and maintainability. | Use for distinct language-level quality concerns. | Active |
| `spec-quality-lifecycle` | Scenario preconditions, outcomes, postconditions, independence, and determinism. | Use for scenario-quality reviews; it complements implementation and structure Skills. | Active |
| `api-setup-teardown` | API clients, API fixtures, resource lifecycle, mocks, and API/UI workflows. | Use when API code or API-backed tests are in scope. | Active |
| `git-standards` | Read-only Git and documentation-drift validation plus controlled Git workflows. | Use for documentation drift checks, Git validation, or explicitly requested Git workflows. | Active |

All listed Skills are present. The API Skill applies to the DemoQA implementation and its API-backed scenarios.

### Planned Skills

None are currently planned. Propose a new Skill only after verifying an actual responsibility gap and agreeing on boundaries with existing owners.

## Governance architecture

`AGENTS.md` supplies persistent project instructions. `automation-architect` routes requests and owns the Skill registry and pipeline. Focused Skills own their domains:

```text
AGENTS.md
  |
  v
automation-architect
  |-- pom-architect
  |-- test-standards
  |-- spec-standards
  |-- code-conventions
  |-- spec-quality-lifecycle
  |-- api-setup-teardown       (apply only when API code or tests exist)
  `-- git-standards
```

The registry and scan-scope table in `.agents/skills/automation-architect/SKILL.md` are the source of truth when ownership needs clarification. A file may be reviewed by more than one Skill only for distinct properties. Delegate a finding to its owning Skill instead of duplicating rules or recommending competing fixes.

| Layer | Owner | Boundary |
|---|---|---|
| Persistent project context | `AGENTS.md` | Stable repository instructions and constraints |
| Skill selection and orchestration | `automation-architect` | Routing, registry, ownership, pipeline, and framework governance |
| UI architecture | `pom-architect` | Page Objects, UI components, locators, and navigation |
| Test implementation | `test-standards` | Fixtures, test data, credentials, and implementation conventions |
| Spec organization | `spec-standards` | Hierarchy, file/title IDs, describe names, and steps |
| General code quality | `code-conventions` | TypeScript language and maintainability concerns not owned elsewhere |
| Scenario quality | `spec-quality-lifecycle` | Scenario-level correctness, lifecycle, isolation, and determinism |
| API infrastructure | `api-setup-teardown` | API clients, endpoints, controllers, API-specific fixtures, and resource cleanup |
| Git and docs validation | `git-standards` | Branch/commit conventions and read-only drift checks; writes require its controlled workflow |

## Activating Skills in Codex

Use the recognized Skill mention, such as `$pom-architect`, in the Codex request. When the interface presents a Skill suggestion, select it to activate the Skill. Typing a Skill's name as ordinary text does not guarantee activation. Read the relevant `SKILL.md` and inspect the current implementation before making changes; a Skill is guidance, not an automatic auditor or background agent.

The repository uses explicit Skill invocation and review workflows; it does not synchronize documentation automatically after commits.

## Select Skills by task

Use the smallest set that covers the requested work:

| Task | Skills |
|---|---|
| Create or review a Page Object | `$pom-architect`, `$code-conventions` |
| Create a test case | `$spec-standards`, `$test-standards`, and `$pom-architect` when using Page Objects |
| Review scenario quality | `$spec-quality-lifecycle`; add `$test-standards` or `$spec-standards` only for their properties |
| Review or change fixtures | `$test-standards`, `$code-conventions`; add `$api-setup-teardown` for API-specific fixture lifecycle |
| Refactor TypeScript | `$code-conventions` plus the owning Skill for affected files |
| Create or review API setup and teardown | `$api-setup-teardown`, when API code or tests are in scope |
| Check Git or documentation drift before a PR | `$git-standards` |
| Update architecture documentation | `$automation-architect`; use `$git-standards` for a read-only drift check |
| Full SDLC review | `$automation-architect` and the pipeline below |

## Full SDLC review pipeline

For a full review, inspect working-tree state and `AGENTS.md` first. `automation-architect` coordinates the process; then follow the dependency and ownership order:

1. Inspect repository state, project instructions, and current implementation.
2. `pom-architect` reviews UI architecture on which specs may depend.
3. `test-standards` reviews test implementation, fixtures, test data, and credentials.
4. `spec-standards` reviews specification structure and naming.
5. `code-conventions` checks distinct TypeScript concerns in changed code.
6. `spec-quality-lifecycle` reviews scenario preconditions, outcomes, cleanup needs, independence, and deterministic behavior.
7. `api-setup-teardown` reviews API architecture and lifecycle only if API code or API-backed tests exist; otherwise mark it not applicable.
8. `git-standards` checks documentation drift and requested Git conventions in read-only mode. If the comparison base cannot be verified, report the check as incomplete. Do not perform Git writes as part of the review.

Do not run the full pipeline for a narrow task that needs only one domain. Report checks that did not run; never imply that reading a Skill means its audit ran. Keep findings, recommendations, corrections, and incomplete checks distinct.

## Safe change and validation practices

- Inspect before modifying and preserve existing project structure and user changes.
- Keep assertions in specs; use fixtures and Page Objects according to their owner Skills.
- Do not invent files, scripts, dependencies, browser projects, aliases, fixtures, product requirements, or external test IDs.
- Keep credentials and tokens out of source, logs, and documentation. `.env.example` must remain placeholder-only.
- Prefer read-only review. Only implement changes requested by the user; do not make destructive Git changes, commit, or push unless separately authorized.
- Derive commands and technical claims from `package.json`, configuration, and current code. Run relevant validation and report exactly what ran.
- Treat documentation as living when public interfaces or a developer's mental model changes. Update only affected sections, describe implemented behavior, and avoid duplicating detailed Skill rules.

## Adding a Skill

Before adding a Skill:

1. Identify a real responsibility gap and verify no current Skill owns it.
2. Define the new Skill's scope, exclusions, and boundaries with existing owners.
3. Create `.agents/skills/<skill-name>/SKILL.md` with valid Skill frontmatter and focused instructions.
4. Register it in `automation-architect`'s registry, scan ownership, pipeline, and invocation references.
5. Validate that all referenced Skills exist, ownership is non-overlapping, and any version-dependent guidance matches the installed toolchain.
6. Update README or this document only when the public architecture, Skill inventory, or developer guidance changes.

Do not create a Skill for a minor convention, duplicate an existing Skill, or impose a fixed maximum number of Skills or modes.

## Documentation maintenance

Use `$automation-architect update docs` or `sync documentation` to apply verified documentation updates. Use `$automation-architect check documentation drift` for a read-only review. `git-standards` owns the `DOCS_SYNC` warning and must inspect the correct base branch and actual changes; it must not edit files during validation.

The documentation destinations are:

| File | Purpose |
|---|---|
| `AGENTS.md` | Persistent project instructions |
| `.agents/skills/**/SKILL.md` | Detailed domain operating standards |
| `README.md` | Onboarding, project overview, current Skill inventory, and developer setup |
| `docs/` | Detailed technical references and decisions when needed |

Check whether optional destinations such as API documentation or a test case catalog actually exist before updating them. Do not create a wiki, catalog, ADR set, or API reference just because it appears in a possible trigger map. Keep one source of truth for each detailed rule and summarize or link to it elsewhere.
