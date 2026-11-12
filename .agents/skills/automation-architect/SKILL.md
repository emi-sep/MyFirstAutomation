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
| `typescript` | Not declared in `package.json`; lockfile root metadata says `^7.0.2` | `7.0.2` | Used by `typecheck`; direct dependency declaration is missing from the manifest. Resolve manifest/lockfile drift before relying on clean installs. |
| `dotenv` | `^18.0.9` | `18.0.9` | Loads `.env` in `playwright.config.ts`; environment validation is implemented in `src/config/Env.ts`. |
| `@types/node` | `^26.6.5` | `26.6.6` (lockfile root metadata says `^26.6.6`) | Types Node APIs; manifest and lockfile root ranges differ. |
| Node.js runtime | No `engines` field in `package.json`; current runtime observed as `v24.22.0` | Not applicable | The locked Playwright package requires Node `>=20`; the observed runtime meets that requirement. Recheck the runtime in other environments. |

The `package.json` and lockfile root metadata disagree: the lockfile declares TypeScript and has a different `@types/node` range. This is a verified repository discrepancy, not a Skill rule. Do not silently repair it while updating documentation.

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
| `paths` | Five mappings listed below | These are TypeScript path mappings; they do not by themselves prove Playwright runtime resolution. |
| `types` | `["node"]` | Node declarations are included in the configured type environment. |
| `resolveJsonModule` | `true` | JSON imports are permitted by TypeScript. |

### Path aliases

Aliases below are copied from `tsconfig.json`. Ownership follows the registry and focused Skill rules; an alias mapping alone does not establish runtime behavior.

| Alias | Resolves to | Used by |
|-------|-------------|---------|
| `@pages/*` | `./src/ui/pages/*` | `pom-architect` owns Page Object imports; currently used by fixtures and specs. |
| `@fixtures` | `./src/fixtures/index` | `test-standards` owns fixture definitions and test fixture usage. |
| `@fixtures/*` | `./src/fixtures/*` | `test-standards` owns fixture modules. |
| `@data/*` | `./src/data/*` | `test-standards` owns test data and credential hygiene. |
| `@config/*` | `./src/config/*` | `test-standards` owns environment and test configuration hygiene; no current use was found in `src/` or `tests/`. |

`pom-architect` currently documents an older `@pages/*` destination (`src/pages/*`). The actual alias is `src/ui/pages/*`; treat the mismatch as unresolved sub-skill documentation drift until that skill is separately updated. Verify runtime import resolution when changing alias or module settings.

### Project folder structure

Relevant current repository tree (generated output, `.git`, and `node_modules` omitted):

```text
src/
  config/                 Environment validation (Env.ts)
  data/                   Test data (users.ts)
  fixtures/               Playwright fixtures (index.ts)
  ui/pages/               BasePage, LoginPage, InventoryPage
tests/                    example.spec.ts, inventory.spec.ts
.agents/skills/           This orchestrator and four focused Skills
.github/workflows/        playwright.yml
```

`src/ui/components/`, `src/helpers/`, `src/api/`, and `docs/` are absent. There is no root `README.md`; a lowercase, empty `readme` file exists. Do not describe absent folders or documentation as implemented. The `tests/` specs currently sit directly under `tests/`; `spec-standards` defines the target hierarchy and owns those organizational findings.

| Directory | Responsibility | Owner |
|-----------|----------------|-------|
| `src/ui/pages/` | Page Objects and shared `BasePage` | `pom-architect` |
| `src/fixtures/` | Test fixture registration and setup | `test-standards` |
| `src/data/` | Test data | `test-standards` |
| `src/config/` | Environment configuration used by test execution | `test-standards` for secrets/config quality; orchestrator for cross-cutting changes |
| `tests/` | Playwright test specifications | `test-standards` for implementation quality; `spec-standards` for organization and lifecycle properties |
| `.agents/skills/` | Codex Skill instructions | `automation-architect` coordinates; each Skill owns its registered domain |
| `.github/workflows/` | CI workflow | `automation-architect` coordinates cross-cutting framework changes |

### Playwright configuration

Verified from `playwright.config.ts`:

| Setting | Actual value | Notes |
|---------|--------------|-------|
| `testDir` | `./tests` | Includes the existing root-level specs. |
| `baseURL` | `env.BASE_URL` from `getEnvironment()` | `.env` is loaded via `dotenv`; URL must be HTTP or HTTPS. |
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
| `test:smoke` | `playwright test --grep @smoke` | Filter titles/tags by `@smoke`; no such tag was found in current `tests/`. |
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
| `pom-architect` | Page Object and UI component architecture | `src/ui/pages/**/*.ts`; `src/ui/components/**/*.ts` when introduced | Responsibilities and review rules in its `SKILL.md` | Active |
| `test-standards` | Test implementation quality, fixtures, data, and secrets | `tests/**/*.spec.ts`, `src/fixtures/**/*.ts`, `src/data/**/*.ts`, and applicable environment/framework usage | Conventions and quality review in its `SKILL.md` | Active |
| `spec-standards` | Specification organization and lifecycle conventions | `tests/ui/**/*.spec.ts`, `tests/*.spec.ts` | R1–R5 | Active |
| `git-standards` | Git workflow conventions and controlled operations | Branch names, commit history, remote state, and Git write workflows | C1–C4 and E1–E5 | Active |
| `code-conventions` | General TypeScript language and code quality | Code concerns not otherwise owned by a focused Skill; distinct language-level concerns in owned files | Type safety, naming, imports, errors, duplication, maintainability, and dependencies | Active |

### Scan Scope Ownership

A file may be reviewed by more than one Skill only for different properties. Do not emit duplicate findings or competing fixes for the same property.

| File / scope | Owner Skill | Concern |
|--------------|-------------|---------|
| `src/ui/pages/**/*.ts` | `pom-architect` | Page Object structure, locators, navigation and actions |
| `src/ui/components/**/*.ts` | `pom-architect` | UI component structure when such files exist |
| `src/fixtures/**/*.ts` | `test-standards` | Fixture definitions, setup, typing, and quality |
| `src/data/**/*.ts`, `src/config/Env.ts` | `test-standards` | Test data, environment values, credential hygiene |
| `tests/**/*.spec.ts` — imports, fixtures, credentials, data hygiene, assertions, framework use | `test-standards` | Test implementation quality |
| `tests/**/*.spec.ts` — folder levels, filenames, TC IDs, describe-to-feature names, functional `test.step()` use | `spec-standards` | Specification organization and lifecycle |
| Non-POM `src/**/*.ts` | `test-standards` | Only its explicit environment, fixture, test data, and secret-hygiene checks; no blanket source scan is implied |
| `playwright.config.ts` | `test-standards` | Test execution and framework usage covered by its rules |
| `tsconfig.json` path aliases | `pom-architect` | Page Object import and alias conventions; verify runtime resolution separately |
| `package.json`, lockfile, and cross-cutting configuration changes | `automation-architect` | Coordinate architectural decisions and delegate each focused property to its registered owner |
| Git branch, commit, and remote state | `git-standards` | Git workflow validation and controlled operations |
| General TypeScript source code without a focused owner | `code-conventions` | Language-level type safety, naming, imports, errors, and maintainability |

There is limited wording overlap: `test-standards` asks for descriptive test and `test.describe()` titles, while `spec-standards` enforces structural TC title and describe-to-feature conventions. `spec-standards` owns those exact formats; `test-standards` owns whether the behavior description is clear and useful. The current `test-standards` and `pom-architect` repository-fit text also predates the present source tree. In particular, `pom-architect` says no Page Objects or `BasePage` exist and points `@pages/*` to `src/pages/*`, which conflicts with the verified implementation. Keep that as a reported documentation conflict; do not silently rewrite a sub-skill during unrelated work.

### Skill ownership principles

- `pom-architect` owns Page Object and UI component architecture.
- `test-standards` owns test implementation quality, fixtures, and test data hygiene.
- `spec-standards` owns specification organization and lifecycle conventions.
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
| Tag filtering with `--grep` | `1.42` for the structured-tag workflow | Existing `test:smoke` script; current specs contain no `@smoke` tag |
| `trace: 'on-first-retry'` and trace recording | `1.10` | Current Playwright configuration; diagnostic capability, not an additional focused-Skill rule |

Official references: [Playwright `test.step()` API](https://playwright.dev/docs/api/class-test#test-step), [test tags and annotations](https://playwright.dev/docs/test-annotations), and [trace option](https://playwright.dev/docs/api/class-testoptions#test-options-trace). Recheck minimum versions when upgrading Playwright. Do not activate tag rules just because the installed version supports them.

### 5. TypeScript configuration impact

| `tsconfig` change | Skills affected | Action required |
|-------------------|-----------------|-----------------|
| `target` changes | `pom-architect` | Review class field, syntax, and locator initialization examples. |
| `strict` changes | `test-standards`, `pom-architect` | Reassess test, fixture, data, and Page Object typing expectations. |
| New or removed path alias | `pom-architect`, `test-standards` as applicable | Update verified alias references and recheck runtime import resolution. |
| `module` / `moduleResolution` changes | `pom-architect`, `test-standards` | Re-verify imports and actual execution resolution. |
| `noEmit` changes | `automation-architect` | Review the `typecheck` workflow and its side effects. |

Only revisit rules that depend on the changed setting; do not infer compiler options from defaults.

### 6. Breaking change propagation

| Changed component | Skills potentially affected | What to check |
|-------------------|-----------------------------|---------------|
| `BasePage` API | `pom-architect` | Constructor visibility, inheritance, navigation, and locator patterns |
| Fixture implementation | `test-standards` | Fixture registration, typing, setup, and consumption |
| Test data structure | `test-standards`, potentially `pom-architect` | Data access and credential hygiene; POM only if its boundary changes |
| Environment configuration | `test-standards` | Environment variable handling and secret safety |
| Playwright `testDir` | `spec-standards` | Whether its declared scan scope still covers discovered specs |
| TypeScript aliases | `pom-architect`, `test-standards` | Import examples and actual runtime resolution |
| Git conventions | `git-standards` | Branch, commit, base, and operation rules |

Do not change a Skill when its actual rules are unaffected. Review the registry when ownership changes.

### 7. Rule and Skill deprecation

When a rule or Skill is no longer applicable, mark it deprecated with reason and date; do not apply it during validation or auto-fix; retain its history for the governance period agreed by maintainers; remove it through an explicit maintenance change; and update the registry and related documentation. No retention period is currently defined, so do not automatically delete historical rules.

### 8. Inter-Skill execution order

For a full code-quality review:

1. `pom-architect` — Page Object and component architecture.
2. `test-standards` — test implementation quality, imports, fixtures, and data hygiene.
3. `spec-standards` — specification organization and TC conventions.
4. `git-standards` — only when Git validation or submission is part of the request.
5. `code-conventions` — for general TypeScript quality concerns not already owned by focused Skills; apply only distinct language-level checks in their files.

Git validation is not mandatory for ordinary code review. Git writes must follow `git-standards` confirmation requirements. Preserve every executed Skill's findings; do not hide downstream findings because an earlier check found issues. Do not claim a check is clean unless it ran.

## Coordinate the focused Skills

Skills are instructions for Codex, not executable functions or independent agents. Explicitly inspect and apply the relevant files; do not assume they activate automatically:

- For Page Object, component, BasePage, locator, or alias work, apply `.agents/skills/pom-architect/SKILL.md`.
- For test implementation, fixtures, assertions, environment, and data hygiene, apply `.agents/skills/test-standards/SKILL.md`.
- For spec hierarchy, file naming, TC IDs, describe names, and `test.step()`, apply `.agents/skills/spec-standards/SKILL.md`.
- For Git validation or Git workflow operations, apply `.agents/skills/git-standards/SKILL.md`.

Inspect affected source after reading a Skill. Use its own finding format. Keep verified issues, recommendations, and auto-applied changes distinct.

## Full Pipeline

For a full code-quality pipeline, run the focused Skills in the order `pom-architect`, `test-standards`, then `spec-standards`. Collect findings from every Skill that actually ran, distinguish auto-applied changes from manual recommendations, and report unresolved work. Run `git-standards` only when Git validation or submission is requested. Never claim zero violations without executing the relevant checks.

```text
[automation-architect] PIPELINE COMPLETE
-----------------------------------------
pom-architect:    <findings and corrections>
test-standards:   <findings and corrections>
spec-standards:   <findings and corrections>
Remaining manual fixes: <list or none>
-----------------------------------------
Overall result: <PASS / ISSUES FOUND / INCOMPLETE>
```

## Git workflow orchestration

For Git conventions or workflow requests, invoke `.agents/skills/git-standards/SKILL.md`, preserve its findings, and follow its confirmation and safety requirements. A general workflow request does not bypass confirmations. Keep Git execution conditional; do not add it to ordinary code audits.

## README maintenance governance

Architecture changes trigger a review of whether README information for repository users is affected; they do not automatically require a README edit.

| Event | README sections potentially affected |
|-------|--------------------------------------|
| Skill added or retired | Codex Skills, Repository Structure |
| Orchestration workflow added | Codex Skills |
| Project folder added | Repository Structure |
| npm script added | Available Commands |
| Git conventions changed | Git Workflow |
| Framework pattern introduced | Framework Architecture |
| Course module completed | Learning Path |

### README synchronization: `update readme`

This is an explicit Codex Skill workflow invoked through `$automation-architect` with the request `update readme`; it is not a background service.

| README section | Source of truth |
|----------------|-----------------|
| Prerequisites | `package.json`, lockfile, actual tooling requirements |
| Available Commands | `package.json` scripts |
| Repository Structure | Actual repository tree and `.agents/skills/` |
| Framework Architecture | Actual Page Objects, `BasePage`, and fixtures |
| Codex Skills | `.agents/skills/*/SKILL.md` frontmatter and instructions |
| Git Workflow | `.agents/skills/git-standards/SKILL.md` |
| General TypeScript code quality | `.agents/skills/code-conventions/SKILL.md` |
| Environment Setup | `.env.example`, `src/config/Env.ts`, and actual configuration |

When invoked:

1. Read the root `README.md` and verify its actual headings before mapping sections.
2. Inspect the sources of truth above and compare tracked information with implementation.
3. Identify discrepancies and update only sections with verified differences.
4. Preserve accurate manual content. Do not rewrite course scope, learning path, or educational descriptions unless explicitly requested.
5. Check links, commands, examples, and Markdown formatting.
6. Report updated and unchanged sections.

Modify only `README.md` during a standalone sync unless the user explicitly authorizes more. If `README.md` is absent, report `INCOMPLETE` and ask before creating it or treating another file as the canonical README. This repository currently has no `README.md`, so no headings or section numbers can yet be verified. README synchronization does not happen automatically when a Skill or Git operation changes.

```text
[automation-architect] README SYNC
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
| Validate or execute Git workflow | `git-standards` | `check git` / `git workflow` |
| General TypeScript code conventions | `code-conventions` | `review TypeScript conventions` |
| Full framework architecture review | `automation-architect` | `full architecture review` |
| Synchronize README documentation | `automation-architect` | `update readme` |

## Governance

Before adding a pattern, check whether existing code solves the need. Prefer consistency and the smallest useful abstraction. Explain tradeoffs for significant architectural changes and justify new dependencies. Do not introduce architectural modes casually: document the reason, maintain at most ten active modes, and retire obsolete modes with a reason. Do not create more Skills for minor conventions. Use Framework Growth Considerations for future ownership, compatibility, onboarding, and deprecation decisions.

The current structure is the source of truth, not a mandate to restructure. Preserve current behavior, aliases, and folders unless a task includes an approved migration. Do not move or rename existing folders automatically.

## Change workflow

Before a change, inspect affected files, state intended changes and material risks, and preserve existing behavior. Do not rewrite the framework or overwrite project configuration as a shortcut. Protect `.env` and credentials; preserve `.gitignore` rules.

After changes, review the diff and run relevant TypeScript validation and Playwright tests when authorized and feasible. Available scripts are listed in Project Context; report exactly what ran and any failures. Never claim validation that was not executed. If blocked by environment constraints, say so clearly.

When reviewing rather than changing code, do not modify files. Distinguish confirmed violations from maintainability recommendations and exceptions.
