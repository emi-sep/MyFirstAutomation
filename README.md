# MyFirstAutomation

An educational UI automation project using Playwright Test and TypeScript. Learners can practice browser-based testing, Page Objects, fixtures, environment configuration, and test design against the configured application.

## Learning Path

The previous Learning Path module table was not available in this checkout. The tracked lowercase `readme` file is empty, and no verified module list or course scope is available. No module names or course scope have been reconstructed. Restore the original course table from its source when it is available.

## Prerequisites

**Required:**

- Node.js 20 or newer. The locked Playwright package declares Node `>=20`; this repository does not declare its own `engines` field.
- npm, included with Node.js.
- Git to clone the repository.
- A supported Playwright browser installation. This project currently configures Chromium.

**Recommended:**

- Visual Studio Code and Codex for the repository's explicit Skill instructions.
- Basic TypeScript and software testing knowledge.
- GitHub CLI (`gh`) only if you want to use the optional CLI-based pull request workflow. It is not required to run tests.

## Quick Start

```bash
git clone https://github.com/emi-sep/MyFirstAutomation.git
cd MyFirstAutomation
npm ci
npx playwright install chromium
cp .env.example .env
npm run typecheck
npm test
npm run report
```

Set `BASE_URL` in `.env` for SauceDemo. `DEMOQA_BASE_URL` selects the Book Store application and defaults to the public DemoQA origin shown in `.env.example`. DemoQA tests generate a unique account per test; no static DemoQA credentials or user ID are required. `TEST_USERNAME` and `TEST_PASSWORD` are only required by code that calls `getTestCredentials()`. Keep private credentials in `.env` or the execution environment, never in source files. The `.gitignore` excludes `.env` and `.env.*` while allowing `.env.example`.

`npm run test:smoke` selects TC specifications tagged `@smoke`. `npm test` runs the configured suite.

## Available Commands

Commands are taken from `package.json`:

| Command | Description |
|---------|-------------|
| `npm test` | Run the Playwright test suite. |
| `npm run test:smoke` | Run smoke specifications tagged `@smoke`. |
| `npm run test:headed` | Run tests with a visible browser. |
| `npm run test:debug` | Start Playwright debug mode. |
| `npm run test:ui` | Open Playwright UI mode. |
| `npm run test:chromium` | Run the configured Chromium project. |
| `npm run test:firefox` | Script exists, but no Firefox project is currently configured. |
| `npm run test:webkit` | Script exists, but no WebKit project is currently configured. |
| `npm run typecheck` | Run `tsc --noEmit`. |
| `npm run report` | Display the HTML report in `playwright-report/`. |

## Repository Structure

```text
.
|-- .agents/skills/
|   |-- api-setup-teardown/      API architecture and lifecycle guidance
|   |-- automation-architect/    Framework orchestration and architecture guidance
|   |-- code-conventions/       TypeScript quality guidance
|   |-- git-standards/          Git and documentation-drift validation guidance
|   |-- pom-architect/          Page Object architecture guidance
|   |-- spec-quality-lifecycle/ Scenario quality and deterministic execution guidance
|   |-- spec-standards/         Specification organization and lifecycle guidance
|   `-- test-standards/         Test implementation and data quality guidance
|-- .github/workflows/playwright.yml
|-- docs/ai-automation-sdlc.md
|-- src/
|   |-- core/                    Environment config and Screenplay actors
|   |-- data/users.ts            SauceDemo sample data
|   |-- fixtures/index.ts        Shared SauceDemo fixtures
|   |-- sites/demoqa/            DemoQA API, UI components, tasks, questions, data, fixture
|   |-- config/Env.ts            Compatibility re-export for core environment helpers
|   `-- ui/pages/                SauceDemo BasePage, LoginPage, InventoryPage
|-- tests/ui/smoke/
|   |-- books/                   DemoQA TC02 add and TC08 delete scenarios
|   |-- cart/                    TC7 add/remove product
|   |-- inventory/               TC2 through TC6 inventory scenarios
|   `-- login/                   TC1 login and inventory access
|-- docs/test-cases/demoqa/      Book Store TC02 and TC08 requirements
|-- docs/evidence/               API verification and test execution evidence
|-- .env.example
|-- AGENTS.md
|-- package.json
|-- package-lock.json
|-- playwright.config.ts
|-- README.md
`-- tsconfig.json
```

The framework retains Layer-First organization for the existing SauceDemo suite and mirrors DemoQA implementation under `src/sites/demoqa/`. DemoQA uses shared core actor/task/question contracts, site-specific UI components and API capabilities, and a per-test account fixture. There is no cross-site UI component yet because no shared visual component has been identified. Playwright writes its HTML report to `playwright-report/` and test output to `test-results/`; these generated paths are ignored by Git.

## Framework Architecture

### Page Object Model

Page Objects are implemented in `src/ui/pages/`. `BasePage` holds a protected, readonly Playwright `Page` and provides `navigate(path = '/')`, which calls `page.goto(path)`. The configured Playwright `baseURL` allows navigation by relative path.

`LoginPage` and `InventoryPage` extend `BasePage`. They expose locators through getters and provide reusable interactions such as `login()`, `sortBy()`, and `addProductToCart()`. The implementation uses semantic locators where available and CSS selectors for some inventory elements. Tests retain their assertions; Page Objects perform UI interactions and expose locators or data.

DemoQA uses a Screenplay layer at `src/sites/demoqa/`: core `Actor`, `Task`, and `Question` contracts are global, while DemoQA-specific abilities and tasks use a composed `BookStoreScreen` made from login, catalog, detail, and profile components. API access remains in the site's API client/controllers and is exposed through an actor ability. The existing SauceDemo Page Objects remain unchanged.

### TypeScript Path Aliases

`tsconfig.json` defines these aliases:

| Alias | Target |
|-------|--------|
| `@pages/*` | `src/ui/pages/*` |
| `@core/*` | `src/core/*` |
| `@sites/*` | `src/sites/*` |
| `@fixtures` | `src/fixtures/index` |
| `@fixtures/*` | `src/fixtures/*` |
| `@data/*` | `src/data/*` |
| `@config/*` | `src/config/*` |

The aliases are configured for TypeScript. When adding or changing aliases, verify resolution in the Playwright execution path as well.

```typescript
get usernameInput(): Locator {
  return this.page.getByPlaceholder('Username');
}

async login(username: string, password: string): Promise<void> {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}
```

### Fixtures

`src/fixtures/index.ts` exports `test` and `expect`. Its `loginPage` fixture provides a `LoginPage` for the current page. Its `authenticatedPage` fixture logs in with the sample account, verifies the inventory container, then provides the authenticated `Page`.

DemoQA scenarios import their site fixture from `src/sites/demoqa/tests/fixtures.ts`. It creates an isolated user through API, verifies identity and the empty-collection precondition, provides UI/API abilities to a Screenplay actor, then removes only that user's books and account during fixture teardown.

Specs import `test` and `expect` from `@fixtures` and request fixtures by name:

```typescript
test('allows an authenticated user to access the inventory page', async ({ authenticatedPage }) => {
  // Test assertions use the authenticated Page.
});
```

### Test Organization

Playwright discovers tests under `tests/`. Smoke specifications are organized under `tests/ui/smoke/{feature}/`, with one TC spec per scenario across the `login`, `inventory`, `cart`, and `books` features. Filenames and test titles carry matching TC IDs, and functional phases use `test.step()`.

The `spec-standards` Skill owns the required path and naming standard `tests/ui/{suite}/{feature}/TC{N}-{short-name}.spec.ts`, TC-prefixed titles, feature-matching describe names, and meaningful `test.step()` phases. The two DemoQA filenames retain the assignment's explicitly requested zero-padded `TC02` and `TC08` identifiers.

## Environment Setup

`playwright.config.ts` loads `.env` with `dotenv` and calls `getEnvironment()` before tests run. `src/core/config/env.ts` requires `BASE_URL`, trims and validates it, and resolves `DEMOQA_BASE_URL` from the environment or its public DemoQA default. `src/config/Env.ts` remains as a compatibility re-export.

| Variable | Required when | Handling |
|----------|---------------|----------|
| `BASE_URL` | Every configured Playwright run | Required during config loading; must be a valid HTTP or HTTPS URL. |
| `DEMOQA_BASE_URL` | DemoQA Book Store tests | Optional; defaults to the public DemoQA origin and must be a valid HTTP or HTTPS URL. |
| `TEST_USERNAME` | Code calls `getTestCredentials()` | Required and trimmed by `src/config/Env.ts`; not used by the current fixtures. |
| `TEST_PASSWORD` | Code calls `getTestCredentials()` | Required and trimmed by `src/config/Env.ts`; do not expose private values. |

Create `.env` from `.env.example` and replace placeholders only with values appropriate to your environment. Do not commit `.env`, credentials, or tokens. CI accepts `BASE_URL` as a repository variable and falls back to the public SauceDemo URL from `.env.example` when the variable is absent. The optional test credentials are passed from GitHub Secrets only for code that calls `getTestCredentials()`.

## Codex AI Skills

The Skills in `.agents/skills/` provide reusable instructions and review conventions; they are not independent agents and do not automatically edit files or synchronize this README. To activate one, enter its `$skill-name` mention in Codex and select the recognized Skill suggestion when available. Typing a Skill name as ordinary text does not guarantee activation.

| Skill | Purpose | When to use |
|-------|---------|-------------|
| `automation-architect` | Coordinates framework architecture, Skill ownership, and documentation governance. | Cross-cutting architecture review, `update docs`, `sync documentation`, or `check documentation drift`. |
| `pom-architect` | Guides Page Objects, components, locators, BasePage, and imports. | Creating or reviewing Page Object architecture. |
| `test-standards` | Guides test implementation, fixtures, assertions, data, and secret hygiene. | Creating or reviewing test quality and fixtures. |
| `spec-standards` | Defines spec hierarchy, filenames, TC IDs, describe naming, and `test.step()` use. | Reviewing or correcting specification organization. |
| `spec-quality-lifecycle` | Reviews scenario preconditions, outcomes, postconditions, independence, and determinism. | Reviewing scenario quality and lifecycle. |
| `api-setup-teardown` | Governs API clients, API fixtures, resource lifecycle, mocks, and API/UI workflows when API code or API-backed tests exist. | Designing or reviewing API setup and teardown. |
| `code-conventions` | Defines general TypeScript type safety and maintainability conventions. | Reviewing general TypeScript code quality. |
| `git-standards` | Provides read-only Git validation and controlled branch, commit, push, and PR workflows. | `check git` or a Git workflow request. |

Invoke a Skill with its recognized mention, for example `$automation-architect`, `$api-setup-teardown`, `$code-conventions`, `$git-standards`, `$pom-architect`, `$spec-quality-lifecycle`, `$spec-standards`, or `$test-standards`, and select the suggestion when the Codex interface offers it. Skills provide instructions; they do not automatically edit files or synchronize documentation.

See [AI Automation SDLC](docs/ai-automation-sdlc.md) for the ownership model, task-based Skill selection, pipeline, and governance process.

## Git Workflow

The `git-standards` Skill documents these conventions:

- Working branches use `test/<kebab-case-scope>` for new test cases or `fix/<kebab-case-scope>` for defect corrections.
- Commit subjects use `feat`, `fix`, `refactor`, `chore`, or `docs`, optionally followed by a lowercase kebab-case scope and a lowercase description; for example, `feat(tc8): add products page verification`.
- Feature branches need at least one `feat` or `fix` commit before merging. The Skill expects the verified development base to be `main`.
- Do not push directly to `main` or `master`. Stage specific files, protect secrets, and follow the Skill's explicit confirmation rules for commits, pushes, and pull requests.

Its read-only `Validate` capability checks branch names, commit subjects, substantive commit coverage, and documentation drift against verified repository changes. Its `Execute` capability covers branch creation, commits, pushes, and pull requests. It requires validation before writes, does not stage all files, and prohibits bypassing hooks. Rewriting published history requires explicit authorization; force pushes require explicit confirmation.

These are documented Skill conventions; the GitHub Actions workflow does not validate branch names or commit subjects. Git validation is a local, read-only Skill capability when requested. Git writes are controlled actions requiring confirmation.

GitHub Actions runs on pushes and pull requests targeting `main` or `master`. The workflow checks out the repository, sets up the current Node LTS, runs `npm ci` and `npm run typecheck`, installs Chromium and its system dependencies, then runs `npx playwright test`. It uses the repository `BASE_URL` variable when set and otherwise falls back to the public SauceDemo URL; DemoQA uses its configured default. Optional test credentials come from GitHub Secrets. The workflow uploads the Playwright HTML report but does not run the Git convention validator.

## Contribution Guidelines

- Keep documentation and code examples in English, and describe behavior clearly.
- Follow the implemented Page Object pattern under `src/ui/pages/`; use the configured `baseURL` and relative paths for navigation.
- Keep test assertions in specification files. Use Page Objects for reusable UI locators and interactions.
- Keep tests independent and order-independent. Prefer Playwright auto-waiting and web-first assertions; avoid fixed waits.
- Use fixtures for reusable setup and keep test data separate where that improves clarity. Do not put private credentials in test code or Page Objects.
- Follow `spec-standards` for TC organization and `test.step()` when creating or correcting specs. Existing TC specs are under `tests/ui/smoke/`.
- Keep `.env` private and `.env.example` placeholder-only.
- Run `npm run typecheck` and the relevant Playwright command before submitting changes. GitHub Actions runs both TypeScript validation and Playwright tests.
- Apply the relevant Codex Skill explicitly for architecture, test, spec, documentation, or Git work. Use `$automation-architect check documentation drift` for a read-only drift check and `update docs` or `sync documentation` for an explicit documentation update. Git operations must follow the confirmation and safety requirements in `git-standards`.
