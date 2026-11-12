# MyFirstAutomation

An educational UI automation project using Playwright Test and TypeScript. Learners can practice browser-based testing, Page Objects, fixtures, environment configuration, and test design against the configured application.

## Learning Path

The previous Learning Path module table was not available in this checkout: the tracked lowercase `readme` file is empty, and repository history contains no `README.md` or course table. No module names or course scope have been reconstructed. Restore the original course table from its source when it is available.

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

Set `BASE_URL` in `.env` to the application URL before running Playwright. The example file supplies the SauceDemo URL. `TEST_USERNAME` and `TEST_PASSWORD` are only required by code that calls `getTestCredentials()`; the current fixture uses the public demo account data in `src/data/users.ts` instead. Keep private credentials in `.env` or the execution environment, never in source files. The `.gitignore` excludes `.env` and `.env.*` while allowing `.env.example`.

The repository's package manifest and lockfile root metadata currently differ for TypeScript and `@types/node`. CI is configured to run `npm ci`, but resolve that metadata discrepancy if a clean install reports a lockfile consistency error.

`npm run test:smoke` is available, but the current specifications do not contain an `@smoke` tag, so it may select no tests. `npm test` runs the configured suite.

## Available Commands

Commands are taken from `package.json`:

| Command | Description |
|---------|-------------|
| `npm test` | Run the Playwright test suite. |
| `npm run test:smoke` | Run tests matching `@smoke`; current specs have no such tag. |
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
├── .agents/skills/
│   ├── automation-architect/   Framework orchestration and architecture guidance
│   ├── git-standards/          Git validation and controlled workflow guidance
│   ├── pom-architect/          Page Object architecture guidance
│   ├── spec-standards/         Specification organization and lifecycle guidance
│   └── test-standards/         Test implementation and data quality guidance
├── .github/workflows/
│   └── playwright.yml          GitHub Actions test workflow
├── .env.example                Placeholder environment configuration
├── .gitignore                  Excludes dependencies, secrets, and test output
├── AGENTS.md                   Repository-specific Codex guidance
├── src/
│   ├── config/Env.ts           Environment variable validation
│   ├── data/users.ts           Shared sample test account data
│   ├── fixtures/index.ts       Playwright fixtures
│   └── ui/pages/               BasePage, LoginPage, InventoryPage
├── tests/
│   ├── example.spec.ts         Login and inventory access scenario
│   └── inventory.spec.ts       Inventory display, sorting, and cart scenarios
├── .env.example                Placeholder environment configuration
├── package.json                Dependencies and npm scripts
├── package-lock.json           Locked dependency metadata
├── playwright.config.ts        Playwright Test configuration
└── tsconfig.json               TypeScript compiler and path settings
```

There are currently no `src/ui/components/`, `src/helpers/`, `src/api/`, or `docs/` directories. Playwright writes its HTML report to `playwright-report/` and test output to `test-results/`; these generated paths are ignored by Git.

## Framework Architecture

### Page Object Model

Page Objects are implemented in `src/ui/pages/`. `BasePage` holds a protected, readonly Playwright `Page` and provides `navigate(path = '/')`, which calls `page.goto(path)`. The configured Playwright `baseURL` allows navigation by relative path.

`LoginPage` and `InventoryPage` extend `BasePage`. They expose locators through getters and provide reusable interactions such as `login()`, `sortBy()`, and `addProductToCart()`. The implementation uses semantic locators where available and CSS selectors for some inventory elements. Tests retain their assertions; Page Objects perform UI interactions and expose locators or data.

### TypeScript Path Aliases

`tsconfig.json` defines these aliases:

| Alias | Target |
|-------|--------|
| `@pages/*` | `src/ui/pages/*` |
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

Specs import `test` and `expect` from `@fixtures` and request fixtures by name:

```typescript
test('allows an authenticated user to access the inventory page', async ({ authenticatedPage }) => {
  // Test assertions use the authenticated Page.
});
```

### Test Organization

Playwright discovers tests under `tests/`. The current files are `tests/example.spec.ts` and `tests/inventory.spec.ts`; both use `*.spec.ts` filenames, descriptive `test.describe()` groups, and fixture-based setup. Tests are grouped by login and inventory behavior. The current specifications do not use `test.step()` and do not include TC IDs in their test titles.

The `spec-standards` Skill defines the target path and naming standard `tests/ui/{suite}/{feature}/TC{N}-{short-name}.spec.ts`, with TC-prefixed test titles and meaningful `test.step()` phases. The existing files have not been reorganized to that target. Do not interpret the target as the current directory layout.

## Environment Setup

`playwright.config.ts` loads `.env` with `dotenv` and calls `getEnvironment()` before tests run. `src/config/Env.ts` requires `BASE_URL`, trims it, and accepts only valid HTTP or HTTPS URLs. Missing or invalid values cause a clear configuration error before the test run.

| Variable | Required when | Handling |
|----------|---------------|----------|
| `BASE_URL` | Every configured Playwright run | Required during config loading; must be a valid HTTP or HTTPS URL. |
| `TEST_USERNAME` | Code calls `getTestCredentials()` | Required and trimmed by `src/config/Env.ts`; not used by the current fixtures. |
| `TEST_PASSWORD` | Code calls `getTestCredentials()` | Required and trimmed by `src/config/Env.ts`; do not expose private values. |

Create `.env` from `.env.example` and replace placeholders only with values appropriate to your environment. Do not commit `.env`, credentials, or tokens. CI obtains `BASE_URL` from a repository variable and the optional test credentials from GitHub Secrets.

## Codex AI Skills

The Skills in `.agents/skills/` provide reusable instructions and review conventions. Codex applies them when explicitly invoked or when the task makes a Skill relevant; they are not independent agents and do not automatically edit files or synchronize this README.

| Skill | Purpose | When to use |
|-------|---------|-------------|
| `automation-architect` | Coordinates framework architecture, Skill ownership, and documentation governance. | Cross-cutting architecture review or `update readme`. |
| `pom-architect` | Guides Page Objects, components, locators, BasePage, and imports. | Creating or reviewing Page Object architecture. |
| `test-standards` | Guides test implementation, fixtures, assertions, data, and secret hygiene. | Creating or reviewing test quality and fixtures. |
| `spec-standards` | Defines spec hierarchy, filenames, TC IDs, describe naming, and `test.step()` use. | Reviewing or correcting specification organization. |
| `git-standards` | Provides read-only Git validation and controlled branch, commit, push, and PR workflows. | `check git` or a Git workflow request. |

Invoke a Skill by name in a Codex request, for example `$automation-architect`, `$pom-architect`, `$test-standards`, `$spec-standards`, or `$git-standards`. The README is updated only through an explicit maintenance request such as `$automation-architect update readme`.

## Git Workflow

The `git-standards` Skill documents these conventions:

- Working branches use `test/<kebab-case-scope>` for new test cases or `fix/<kebab-case-scope>` for defect corrections.
- Commit subjects use `feat`, `fix`, `refactor`, `chore`, or `docs`, optionally followed by a lowercase kebab-case scope and a lowercase description; for example, `feat(tc8): add products page verification`.
- Feature branches need at least one `feat` or `fix` commit before merging. The Skill expects the verified development base to be `main`.
- Do not push directly to `main` or `master`. Stage specific files, protect secrets, and follow the Skill's explicit confirmation rules for commits, pushes, and pull requests.

Its read-only `Validate` capability checks branch names, commit subjects, substantive commit coverage, and README synchronization. Its `Execute` capability covers branch creation, commits, pushes, and pull requests. It requires validation before writes, does not stage all files, and prohibits bypassing hooks. Rewriting published history requires explicit authorization; force pushes require explicit confirmation.

These are documented Skill conventions; the GitHub Actions workflow does not validate branch names or commit subjects. Git validation is a local, read-only Skill capability when requested. Git writes are controlled actions requiring confirmation.

GitHub Actions runs on pushes and pull requests targeting `main` or `master`. The workflow checks out the repository, sets up the current Node LTS, runs `npm ci`, installs Playwright browsers and dependencies, then runs `npx playwright test`. It provides the application URL and optional test credentials through GitHub configuration and uploads the Playwright report. This workflow does not run `npm run typecheck` or the Git convention validator.

## Contribution Guidelines

- Keep documentation and code examples in English, and describe behavior clearly.
- Follow the implemented Page Object pattern under `src/ui/pages/`; use the configured `baseURL` and relative paths for navigation.
- Keep test assertions in specification files. Use Page Objects for reusable UI locators and interactions.
- Keep tests independent and order-independent. Prefer Playwright auto-waiting and web-first assertions; avoid fixed waits.
- Use fixtures for reusable setup and keep test data separate where that improves clarity. Do not put private credentials in test code or Page Objects.
- Follow the `spec-standards` target for TC organization and `test.step()` when creating or correcting specs. Existing specs still use the root `tests/` layout and have not been migrated.
- Keep `.env` private and `.env.example` placeholder-only.
- Run `npm run typecheck` and the relevant Playwright command before submitting changes. GitHub Actions runs Playwright tests but does not currently run TypeScript validation.
- Apply the relevant Codex Skill explicitly for architecture, test, spec, or Git work. Git operations must follow the confirmation and safety requirements in `git-standards`.
