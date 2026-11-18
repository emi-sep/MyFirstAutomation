---
name: automation-architect
description: Use for repository-wide Playwright automation architecture decisions, cross-cutting test and POM changes, framework governance, or migration planning in this project.
---

# Automation architecture guide

## Project Context

The facts below were checked against repository files during the last hub review. Recheck them when package manifests, configuration, or the folder tree changes. Governance recommendations are identified separately from verified implementation details.

### Tech Stack

| Dependency | Declared version | Lockfile resolution | Impact on framework rules |
|------------|------------------|----------------------|---------------------------|
| `@playwright/test` | `^1.64.1` | `1.64.1` | Provides Playwright Test, fixtures, assertions, projects, steps, and reporters. Installed package metadata requires Node `>=20`. |
| `typescript` | `^7.0.2` | `7.0.2` | Used by the `typecheck` script. Manifest and lockfile root metadata align. |
| `dotenv` | `^18.0.9` | `18.0.9` | Loads `.env` in `playwright.config.ts`; environment validation is implemented in `src/core/config/env.ts` and re-exported by `src/config/Env.ts` for compatibility. |
| `@types/node` | `^26.6.6` | `26.6.6` | Types Node APIs; manifest and lockfile root ranges align. |
| Node.js runtime | No `engines` field in `package.json`; current runtime observed as `v24.22.0` | Not applicable | The locked Playwright package requires Node `>=20`; the observed runtime meets that requirement. Recheck the runtime in other environments. |

The package manifest and lockfile root metadata currently agree for direct dependencies. Recheck both when dependency declarations change; do not infer fresh-install success without running the package manager in an authorized validation task.

### TypeScript compiler settings

Values are from `tsconfig.json`; “not configured” means this file does not set that option.

| Setting | Actual value | Why it matters for Skills |
|---------|--------------|---------------------------|
| `target` | `ES2022` | POM examples and class syntax should remain compatible with the configured JavaScript target. |
| `module` | `NodeNext` | Imports follow Node's modern module conventions. |
| `moduleResolution` | `NodeNext` | Alias and module examples must be checked against this resolver and runtime. |
| `strict` | `true` | Page Objects, fixtures, and test data should preserve strict typing. |
| `noUncheckedIndexedAccess` | Not configured | Do not claim indexed access is additionally checked. |
| `noImplicitOverride` | Not configured | Do not require explicit `override` based on this setting. |
| `noEmit` | `true` | TypeScript validation checks types without emitting compiled files. |
| `useDefineForClassFields` | Not configured | Do not assume a project-specific class field setting. |
| `paths` | Seven mappings listed below | These are TypeScript path mappings; they do not by themselves prove Playwright runtime resolution. |
| `types` | `["node"]` | Node declarations are included in the configured type environment. |
| `resolveJsonModule` | `true` | JSON imports are permitted by TypeScript. |

### Path aliases

Aliases below are copied from `tsconfig.json`. Ownership follows the registry and focused Skill rules; an alias mapping alone does not establish runtime behavior.

| Alias | Resolves to | Used by |
|-------|-------------|---------|
| `@pages/*` | `./src/ui/pages/*` | `pom-architect` owns Page Object imports; currently used by fixtures and specs. |
| `@core/*` | `./src/core/*` | Shared technical and Screenplay contracts. |
| `@sites/*` | `./src/sites/*` | Site-specific application and test infrastructure, including DemoQA. |
| `@fixtures` | `./src/fixtures/index` | `test-standards` owns fixture definitions and test fixture usage. |
| `@fixtures/*` | `./src/fixtures/*` | `test-standards` owns fixture modules. |
| `@data/*` | `./src/data/*` | `test-standards` owns test data and credential hygiene. |
| `@config/*` | `./src/config/*` | `test-standards` owns environment and test configuration hygiene; retained for compatibility. |

`pom-architect` documents the verified `@pages/*` destination (`src/ui/pages/*`). Verify runtime import resolution when changing alias or module settings.

### Project folder structure

Relevant current repository tree (generated output, `.git`, and `node_modules` omitted):

```text
src/
  core/config/            Shared environment implementation
  core/actors/            Shared Screenplay contracts and actor factory
  config/                 Compatibility re-export for environment helpers
  data/                   SauceDemo data (users.ts)
  fixtures/               SauceDemo Playwright fixtures
  sites/demoqa/           DemoQA API, UI, tasks, questions, fixture, and data
  ui/pages/               BasePage, LoginPage, InventoryPage
tests/ui/smoke/           Feature-organized SauceDemo and DemoQA TC specs
.agents/skills/           This orchestrator and focused Skills
.github/workflows/        playwright.yml
docs/                     Governance, test cases, lifecycle, and execution evidence
```

The existing SauceDemo Page Objects remain under `src/ui/pages/`. DemoQA API code is under `src/sites/demoqa/api/`, not a root `src/api/` directory. Its cases are documented under `docs/test-cases/demoqa/`, with implementation and execution notes under `docs/evidence/`. No shared `src/common/` UI implementation currently exists. Treat this as a current snapshot and recheck it when the structure changes.

| Directory | Responsibility | Owner |
|-----------|----------------|-------|
| `src/ui/pages/` | Page Objects and shared `BasePage` | `pom-architect` |
| `src/fixtures/` | Test fixture registration and setup | `test-standards` |
| `src/data/` | Test data | `test-standards` |
| `src/config/` | Environment configuration used by test execution | `test-standards` for secrets/config quality; orchestrator for cross-cutting changes |
| `tests/` | Playwright test specifications | `test-standards` for implementation quality; `spec-standards` for organization and lifecycle properties |
| `docs/` | Detailed technical and governance references | `automation-architect` coordinates documentation updates; focused Skills remain authoritative for their rules |
| `.agents/skills/` | Codex Skill instructions | `automation-architect` coordinates; each Skill owns its registered domain |
| `.github/workflows/` | CI workflow | `automation-architect` coordinates cross-cutting framework changes |

### Playwright configuration

Verified from `playwright.config.ts`:

| Setting | Actual value | Notes |
|---------|--------------|-------|
| `testDir` | `./tests` | Discovers the current specs under `tests/ui/smoke/`. |
| `baseURL` | `env.BASE_URL` from `getEnvironment()` | `.env` is loaded via `dotenv`; URL must be HTTP or HTTPS. DemoQA specs override it with `DEMOQA_BASE_URL`, which defaults to the public DemoQA URL. |
| `fullyParallel` | `true` | Tests may execute concurrently. |
| `forbidOnly` | `!!process.env.CI` | Enabled when `CI` is truthy. |
| `retries` | `2` in CI, otherwise `0` | Trace is set for the first retry. |
| `workers` | `1` in CI, otherwise default | Configured conditionally. |
| `timeout` / expect timeout | `30_000` / `5_000` ms | Test and assertion limits. |
| `reporter` | `list` and `html` | HTML output directory is `playwright-report`; automatic open is disabled. |
| `projects` | `chromium` only | Firefox and WebKit blocks are commented out, not active projects. |
| `use.headless` | `true` | Browser runs headless. |
| `trace` | `on-first-retry` | Trace recorded on first retry. |
| `screenshot` / `video` | `only-on-failure` / `retain-on-failure` | Failure artifacts. |

`package.json` has `test:firefox` and `test:webkit` scripts, but matching projects are not active in this configuration. Do not describe those browsers as configured projects.

### npm scripts

Commands come directly from `package.json`:

| Script | Actual command | Purpose |
|--------|---------------|---------|
| `test` | `playwright test` | Full configured test run. |
| `test:smoke` | `playwright test --grep @smoke` | Selects specs tagged `@smoke`; derive the current count from discovery rather than hardcoding it here. |
| `test:headed` | `playwright test --headed` | Headed browser execution. |
| `test:debug` | `playwright test --debug` | Playwright debug mode. |
| `test:ui` | `playwright test --ui` | Playwright UI mode. |
| `test:chromium` | `playwright test --project=chromium` | Run the configured Chromium project. |
| `test:firefox` | `playwright test --project=firefox` | Script exists; no active Firefox project is configured. |
| `test:webkit` | `playwright test --project=webkit` | Script exists; no active WebKit project is configured. |
| `typecheck` | `tsc --noEmit` | TypeScript validation. |
| `report` | `playwright show-report` | Display the HTML Playwright report. |

### BasePage contract

Verified implementation in `src/ui/pages/BasePage.ts`:

- `BasePage` stores a protected, readonly Playwright `Page` reference.
- Constructor: `constructor(protected readonly page: Page)`.
- Navigation: `async navigate(path: string = '/'): Promise<void>`, which calls `page.goto(path)`.
- Existing `LoginPage` and `InventoryPage` extend it. Subclasses may use the protected `page` and may specialize navigation; no broader override prohibition is established here.

```typescript
import type { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }
}
```

## Sub-Skill Registry

This registry is the single source of truth for focused Skills recognized by the framework. Skill instructions are read and applied explicitly; they are not executable functions or automatically running agents. The orchestrator is not counted as a sub-skill.

| Skill | Domain | File scope | Rules / checks | Status |
|-------|--------|------------|----------------|--------|
| `pom-architect` | Page Object and UI component architecture | `src/ui/pages/**/*.ts`, `src/sites/*/ui/{components,elements}/**/*.ts` | Responsibilities and review rules in its `SKILL.md` | Active |
| `test-standards` | Test implementation quality, fixtures, data, and secrets | `tests/**/*.spec.ts`, `src/fixtures/**/*.ts`, `src/sites/*/tests/**/*.ts`, `src/data/**/*.ts`, site data, and applicable environment/framework usage | Conventions and quality review in its `SKILL.md` | Active |
| `spec-standards` | Specification organization and lifecycle conventions | `tests/ui/**/*.spec.ts`, `tests/*.spec.ts` | R1–R5 | Active |
| `spec-quality-lifecycle` | Scenario preconditions, meaningful outcomes, postconditions, and deterministic execution | `tests/**/*.spec.ts` — scenario behavior and state lifecycle only | R1–R10 in its `SKILL.md`; delegates implementation concerns to their owners | Active |
| `api-setup-teardown` | API architecture, API test infrastructure, resource lifecycle, and API/UI workflows | `src/api/**/*.ts`, `src/sites/*/api/**/*.ts`, API-specific fixtures, route mocks, and API-backed tests | R1–R11 in its `SKILL.md` | Active |
| `git-standards` | Git workflow conventions and controlled operations | Branch names, commit history, remote state, and Git write workflows | C1–C4 and E1–E5 | Active |
| `code-conventions` | General TypeScript language and code quality | Code concerns not otherwise owned by a focused Skill; distinct language-level concerns in owned files | Type safety, naming, imports, errors, duplication, maintainability, and dependencies | Active |

### Scan Scope Ownership

A file may be reviewed by more than one Skill only for different properties. Do not emit duplicate findings or competing fixes for the same property.

| File / scope | Owner Skill | Concern |
|--------------|-------------|---------|
| `src/ui/pages/**/*.ts` | `pom-architect` | Page Object structure, locators, navigation and actions |
| `src/ui/components/**/*.ts` | `pom-architect` | UI component structure when such files exist |
| `src/sites/*/ui/components/**/*.ts`, `src/sites/*/ui/elements/**/*.ts` | `pom-architect` | Site-owned UI composition, locators, and interactions |
| `src/fixtures/**/*.ts` | `test-standards` | Fixture definitions, setup, typing, and quality |
| `src/sites/*/tests/**/*.ts` | `test-standards` | Site-specific fixture definitions, setup, test data, and credential hygiene |
| `src/data/**/*.ts`, site data, `src/core/config/env.ts`, `src/config/Env.ts` | `test-standards` | Test data, environment values, credential hygiene; the legacy Env module re-exports core helpers |
| `tests/**/*.spec.ts` — imports, fixtures, credentials, data hygiene, assertions, framework use | `test-standards` | Test implementation quality |
| `tests/**/*.spec.ts` — folder levels, filenames, TC IDs, describe-to-feature names, functional `test.step()` use | `spec-standards` | Specification organization and lifecycle |
| `tests/**/*.spec.ts` — scenario preconditions, postconditions, action outcomes, independence, and deterministic behavior | `spec-quality-lifecycle` | Scenario quality; delegate fixture, selector implementation, and spec structure findings to their owners |
| `src/api/**/*.ts`, `src/sites/*/api/**/*.ts`, API-specific fixture definitions, route mocks, and API-backed tests | `api-setup-teardown` | API clients, endpoints, models, controllers, API resource lifecycle, and API/UI infrastructure; use only when API code or tests exist |
| Non-POM `src/**/*.ts` | `test-standards` | Only its explicit environment, fixture, test data, and secret-hygiene checks; no blanket source scan is implied |
| `playwright.config.ts` | `test-standards` | Test execution and framework usage covered by its rules |
| `tsconfig.json` path aliases | `pom-architect`; `api-setup-teardown` for any future API alias | Page Object/API import conventions; verify runtime resolution separately |
| `package.json`, lockfile, and cross-cutting configuration changes | `automation-architect` | Coordinate architectural decisions and delegate each focused property to its registered owner |
| Git branch, commit, and remote state | `git-standards` | Git workflow validation and controlled operations |
| General TypeScript source code without a focused owner | `code-conventions` | Language-level type safety, naming, imports, errors, and maintainability |

There is limited wording overlap: `test-standards` asks for descriptive test and `test.describe()` titles, while `spec-standards` enforces structural TC title and describe-to-feature conventions. `spec-standards` owns those exact formats; `test-standards` owns whether the behavior description is clear and useful.

### Skill ownership principles

- `pom-architect` owns Page Object and UI component architecture.
- `test-standards` owns test implementation quality, fixtures, and test data hygiene.
- `spec-standards` owns specification organization and lifecycle conventions.
- `spec-quality-lifecycle` owns scenario-level preconditions, postconditions, action outcomes, and deterministic behavior; it delegates implementation and organization concerns to focused Skills.
- `api-setup-teardown` owns API architecture and API-specific resource setup/teardown. It can be registered before `src/api/` or API tests exist; its registration does not imply implementation.
- `git-standards` owns Git validation and controlled Git operations.
- `code-conventions` owns general TypeScript language and maintainability concerns outside focused Skill ownership.
- `automation-architect` coordinates the focused Skills and governs framework evolution.

## Framework Growth Considerations

These are governance recommendations, not hard execution limits. Preserve current behavior and structure unless a task has a concrete reason and migration path.

### 1. Context budget

| File | Target size | Action when exceeded |
|------|-------------|----------------------|
| `automation-architect/SKILL.md` | Under 500 lines | Consolidate obsolete or duplicated orchestration text. |
| Any sub-skill `SKILL.md` | Under 400 lines | Remove duplication; split only for a genuinely independent domain. |

Prefer concise rules and examples. Do not split Skills merely to meet a line target.

### 2. Scan scope discipline

Before adding a rule, inspect Scan Scope Ownership, confirm no Skill owns the same file/property concern, extend the current owner when appropriate, and update the registry if ownership changes. Avoid duplicate findings and competing automatic fixes.

### 3. New Skill onboarding checklist

- [ ] Identify a genuine domain gap and confirm no current Skill owns it.
- [ ] Create an ADR in `docs/decisions/` only if established architecture governance requires one.
- [ ] Create a Codex Skill with valid YAML frontmatter (`name`, `description`).
- [ ] Add it to the Sub-Skill Registry and assign its scan scope.
- [ ] Integrate it into relevant orchestration and the Skill Invocation Reference.
- [ ] Check for overlapping ownership and document minimum versions for version-dependent rules.

No `docs/decisions/` directory or ADR policy was found during this review, so an ADR is not a blanket onboarding requirement. Do not create one solely to satisfy this checklist unless governance is established.

### 4. Playwright version compatibility

Version floors below are from the official Playwright Test API documentation. The lockfile currently resolves `@playwright/test` to `1.64.1`.

| API / feature | Minimum version | Used by |
|---------------|-----------------|---------|
| `test.step()` | `1.10` | `spec-standards` meaningful step rule R5 |
| Structured test tags (`details.tag`) | `1.42` | No active rule; future `spec-standards` tagging only after explicitly implemented |
| Tag filtering with `--grep` | `1.42` for the structured-tag workflow | Existing `test:smoke` script and current `@smoke` TC specs |
| `trace: 'on-first-retry'` and trace recording | `1.10` | Current Playwright configuration; diagnostic capability, not an additional focused-Skill rule |

Official references: [Playwright `test.step()` API](https://playwright.dev/docs/api/class-test#test-step), [test tags and annotations](https://playwright.dev/docs/test-annotations), and [trace option](https://playwright.dev/docs/api/class-testoptions#test-options-trace). Recheck minimum versions when upgrading Playwright. Do not activate tag rules just because the installed version supports them.

### 5. TypeScript configuration impact

| `tsconfig` change | Skills affected | Action required |
|-------------------|-----------------|-----------------|
| `target` changes | `pom-architect` | Review class field, syntax, and locator initialization examples. |
| `strict` changes | `test-standards`, `pom-architect`, `api-setup-teardown` when API code exists | Reassess test, fixture, data, Page Object, and API typing expectations. |
| New or removed path alias | `pom-architect`, `test-standards`, `api-setup-teardown` when API code exists | Update verified alias references and recheck runtime import resolution. |
| `module` / `moduleResolution` changes | `pom-architect`, `test-standards`, `api-setup-teardown` when API code exists | Re-verify imports and actual execution resolution. |
| `noEmit` changes | `automation-architect` | Review the `typecheck` workflow and its side effects. |

Only revisit rules that depend on the changed setting; do not infer compiler options from defaults.

### 6. Breaking change propagation

| Changed component | Skills potentially affected | What to check |
|-------------------|-----------------------------|---------------|
| `BasePage` API | `pom-architect` | Constructor visibility, inheritance, navigation, and locator patterns |
| Fixture implementation | `test-standards` | Fixture registration, typing, setup, and consumption |
| Test data structure | `test-standards`, potentially `pom-architect` | Data access and credential hygiene; POM only if its boundary changes |
| Environment configuration | `test-standards` | Environment variable handling and secret safety |
| API client, controller, API fixture, or API resource lifecycle | `api-setup-teardown`, and `test-standards` for shared fixture conventions | API contracts, dependency injection, cleanup safety, and fixture convention impacts |
| Playwright `testDir` | `spec-standards` | Whether its declared scan scope still covers discovered specs |
| TypeScript aliases | `pom-architect`, `test-standards` | Import examples and actual runtime resolution |
| Git conventions | `git-standards` | Branch, commit, base, and operation rules |

Do not change a Skill when its actual rules are unaffected. Review the registry when ownership changes.

### 7. Rule and Skill deprecation

When a rule or Skill is no longer applicable, mark it deprecated with reason and date; do not apply it during validation or auto-fix; retain its history for the governance period agreed by maintainers; remove it through an explicit maintenance change; and update the registry and related documentation. No retention period is currently defined, so do not automatically delete historical rules.

### 8. Inter-Skill execution order

For a requested full SDLC review, first inspect repository state and `AGENTS.md`. `automation-architect` coordinates the review; apply the focused Skills in this order. Use only the relevant focused Skills for smaller tasks:

1. Inspect repository state, project instructions, and current implementation.
2. `pom-architect` — Page Object and component architecture.
3. `test-standards` — test implementation, fixtures, test data, and credential hygiene.
4. `spec-standards` — spec organization, TC conventions, and functional steps.
5. `code-conventions` — distinct general TypeScript quality concerns across changed files.
6. `spec-quality-lifecycle` — scenario preconditions, outcomes, independence, and deterministic behavior.
7. `api-setup-teardown` — only when API code or API-backed tests exist; otherwise report API review as not applicable.
8. `git-standards` — read-only documentation drift and Git convention validation; never perform Git writes as part of the review pipeline.

Git validation is not mandatory for ordinary code review. Git writes must follow `git-standards` confirmation requirements. Preserve every executed Skill's findings; do not hide downstream findings because an earlier check found issues. Do not claim a check is clean unless it ran.

## Coordinate the focused Skills

Skills are instructions for Codex, not executable functions or independent agents. Explicitly inspect and apply the relevant files; do not assume they activate automatically:

- For Page Object, component, BasePage, locator, or alias work, apply `.agents/skills/pom-architect/SKILL.md`.
- For test implementation, fixtures, assertions, environment, and data hygiene, apply `.agents/skills/test-standards/SKILL.md`.
- For spec hierarchy, file naming, TC IDs, describe names, and `test.step()`, apply `.agents/skills/spec-standards/SKILL.md`.
- For scenario preconditions, expected outcomes, postconditions, independence, and deterministic behavior, apply `.agents/skills/spec-quality-lifecycle/SKILL.md` after reading the implementation, fixtures, and spec structure. Delegate fixture/data conventions to `test-standards`, locator implementation to `pom-architect`, and spec organization to `spec-standards`.
- For API clients, endpoint organization, API fixtures, resource setup/teardown, route mocks, authentication lifecycle, or API/UI workflows, apply `.agents/skills/api-setup-teardown/SKILL.md`. Run API-specific checks only when API code or API-backed tests exist. Shared fixture conventions and credentials remain coordinated with `test-standards`.
- For Git validation or Git workflow operations, apply `.agents/skills/git-standards/SKILL.md`.

Inspect affected source after reading a Skill. Use its own finding format. Keep verified issues, recommendations, and auto-applied changes distinct.

## Full Pipeline

Do not force the full pipeline for a narrowly scoped change. When the user requests a full SDLC review, inspect repository state first, then use the eight-stage order above, mark API review not applicable when no API code or tests exist, and run `git-standards` in read-only validation mode. Its documentation check can be incomplete when the correct base cannot be verified. Collect findings only from Skills that actually ran, distinguish corrections from recommendations, and report unresolved work. Do not claim zero violations without executing the relevant checks.

```text
[automation-architect] PIPELINE COMPLETE
-----------------------------------------
Repository and instructions: <verified context>
pom-architect:              <findings / not run>
test-standards:             <findings / not run>
spec-standards:             <findings / not run>
code-conventions:           <findings / not run>
spec-quality-lifecycle:     <findings / not run>
api-setup-teardown:         <findings / NOT APPLICABLE / not run>
git-standards:              <DOCS_SYNC and Git validation result>
Remaining work:             <list or none>
-----------------------------------------
Overall result: <PASS / ISSUES FOUND / INCOMPLETE>
```

## Git workflow orchestration

For Git conventions or workflow requests, invoke `.agents/skills/git-standards/SKILL.md`, preserve its findings, and follow its confirmation and safety requirements. A general workflow request does not bypass confirmations. Keep Git execution conditional; do not add it to ordinary code audits.

## Documentation maintenance governance

Architecture changes trigger a review of whether README information for repository users is affected; they do not automatically require a README edit.

| Event | Documentation sections potentially affected |
|-------|--------------------------------------|
| Skill added, retired, or materially changed | Codex Skills, Repository Structure |
| Detailed documentation added or retired | README links or overview when the document is intended for repository users |
| Orchestration workflow added | Codex Skills |
| `AGENTS.md` project instructions changed | Project guidance, Environment Setup, or commands as applicable |
| Project folder added | Repository Structure |
| npm script added | Available Commands |
| Playwright configuration or browser project changed | Configuration, Available Commands, Prerequisites |
| TypeScript alias changed | Framework Architecture or Environment Setup |
| Public environment setting changed | Environment Setup |
| `BasePage` or shared fixture contract changed | Framework Architecture |
| API implementation added | API documentation only if it exists or is required |
| New test cases added | Test case catalog only if the project maintains one |
| New supported application or test suite | Project overview, Repository Structure, or test organization as applicable |
| New supported application or test suite | Project overview, Repository Structure, or test organization as applicable |
| Git conventions changed | Git Workflow |
| Framework pattern introduced | Framework Architecture |
| Course module completed | Learning Path |

### Documentation update and drift checks

Invoke this explicit Codex Skill workflow with `update docs`, `sync documentation`, or the existing phrase `update readme`. The phrase `check documentation drift` runs a read-only check and must not modify files. These are explicit Skill invocations, not background services or automatic commit-time synchronization.

| Documentation section | Source of truth |
|-----------------------|-----------------|
| Prerequisites | `package.json`, lockfile, actual tooling requirements |
| Available Commands | `package.json` scripts |
| Repository Structure | Actual repository tree and `.agents/skills/` |
| Framework Architecture | Actual Page Objects, `BasePage`, and fixtures |
| Codex Skills | `.agents/skills/*/SKILL.md` frontmatter and instructions |
| Git Workflow | `.agents/skills/git-standards/SKILL.md` |
| General TypeScript code quality | `.agents/skills/code-conventions/SKILL.md` |
| API architecture | `.agents/skills/api-setup-teardown/SKILL.md` when API code is in scope |
| Test Organization | `tests/**/*.spec.ts` and `.agents/skills/spec-standards/SKILL.md` |
| AI Automation SDLC | `docs/ai-automation-sdlc.md` and the current Skill registry |
| Environment Setup | `.env.example`, `src/core/config/env.ts`, compatibility exports in `src/config/Env.ts`, and actual configuration |

For `check documentation drift`:

1. Inspect the current branch, verified comparison base, and branch/worktree changes using read-only Git commands.
2. Compare changed public interfaces and conventions with the applicable documentation destinations below.
3. Report potential drift and recommended section updates; do not edit files.

For `update docs`, `sync documentation`, or `update readme`:

1. Read the root `README.md` and verify its actual headings before mapping sections.
2. Inspect relevant sources of truth and compare their actual behavior with existing documentation.
3. Identify affected destinations and update only sections made inaccurate or incomplete.
4. Preserve accurate manual content. Do not rewrite course scope, learning path, or educational descriptions unless explicitly requested.
5. Do not invent a wiki, docs site, API reference, ADR collection, or test case catalog. Update optional destinations only when they exist or are explicitly required.
6. Check links, commands, examples, and Markdown formatting.
7. Report files modified and sections updated or left unchanged.

Modify only the affected existing documentation during an explicit update. If `README.md` is absent, report `INCOMPLETE` rather than creating it or treating another file as canonical without authorization. Do not copy full Skill rules into the README; link or summarize each Skill's purpose and invocation. Documentation synchronization relies on explicit invocation and Git review, not automatic hooks.

```text
[automation-architect] DOCUMENTATION SYNC
-----------------------------------------
Prerequisites:          IN SYNC | UPDATED | INCOMPLETE
Available Commands:     IN SYNC | UPDATED | INCOMPLETE
Repository Structure:   IN SYNC | UPDATED | INCOMPLETE
Framework Architecture: IN SYNC | UPDATED | INCOMPLETE
Codex Skills:           IN SYNC | UPDATED | INCOMPLETE
Git Workflow:           IN SYNC | UPDATED | INCOMPLETE
Environment Setup:      IN SYNC | UPDATED | INCOMPLETE
-----------------------------------------
Result: <UP TO DATE / UPDATED / INCOMPLETE>
```

## Skill Invocation Reference

| Goal | Skill to load | Trigger phrase example |
|------|---------------|------------------------|
| Create or review Page Objects | `pom-architect` | `review Page Object` |
| Review test implementation quality | `test-standards` | `review test quality` |
| Review TC organization and naming | `spec-standards` | `check spec structure` |
| Review scenario preconditions, outcomes, cleanup needs, and determinism | `spec-quality-lifecycle` | `review scenario quality` |
| Design or review API infrastructure and resource lifecycle | `api-setup-teardown` | `review API setup and teardown` |
| Validate or execute Git workflow | `git-standards` | `check git` / `git workflow` |
| General TypeScript code conventions | `code-conventions` | `review TypeScript conventions` |
| Full framework architecture review | `automation-architect` | `full architecture review` |
| Update documentation or check drift | `automation-architect` | `update docs` / `sync documentation` / `check documentation drift` |

## Governance

Before adding a pattern, check whether existing code solves the need. Prefer consistency and the smallest useful abstraction. Explain tradeoffs for significant architectural changes and justify new dependencies. Do not introduce architectural modes casually: document their purpose and retire obsolete modes with a reason. Do not create more Skills for minor conventions or impose a fixed maximum number of Skills or modes. Use Framework Growth Considerations for future ownership, compatibility, onboarding, and deprecation decisions.

The current structure is the source of truth, not a mandate to restructure. Preserve current behavior, aliases, and folders unless a task includes an approved migration. Do not move or rename existing folders automatically.

## Change workflow

Before a change, inspect affected files, state intended changes and material risks, and preserve existing behavior. Do not rewrite the framework or overwrite project configuration as a shortcut. Protect `.env` and credentials; preserve `.gitignore` rules.

After changes, review the diff and run relevant TypeScript validation and Playwright tests when authorized and feasible. Available scripts are listed in Project Context; report exactly what ran and any failures. Never claim validation that was not executed. If blocked by environment constraints, say so clearly.

When reviewing rather than changing code, do not modify files. Distinguish confirmed violations from maintainability recommendations and exceptions.
