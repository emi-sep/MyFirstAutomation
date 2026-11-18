---
name: pom-architect
description: Use when designing, reviewing, creating, or changing Playwright Page Objects, components, BasePage behavior, or locator and import conventions in this repository.
---

# Page Object Model architecture

## Repository fit

The existing SauceDemo Page Objects and shared `BasePage` are under `src/ui/pages/`; DemoQA UI components are site-owned under `src/sites/demoqa/ui/`. Tests live under `tests/`. The `@pages/*` TypeScript path alias maps to `src/ui/pages/*`. Preserve these boundaries and aliases unless a deliberate migration is planned with aligned paths and imports.

## Responsibilities

- A Page Object encapsulates page-specific locators and interactions and has one clear responsibility.
- Model reusable UI regions as component objects when that removes real duplication.
- Keep assertions and test expectations in test specifications, not Page Objects.
- Keep credentials and scenario-specific test data out of Page Objects.
- Use the configured Playwright `baseURL` for navigation. Use paths with `page.goto('/path')`; avoid hardcoded application origins.
- Prefer semantic locators (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`) and stable test IDs where semantics are unavailable. CSS and XPath need a clear stability reason.
- Rely on Playwright auto-waiting. Avoid `waitForTimeout()` unless a documented external technical constraint makes it necessary.
- Give public methods explicit return types and use async methods for Playwright interactions.
- Avoid duplicate locators and interaction logic. Prefer lazy locator getters where they improve consistency; do not add wrappers that merely rename Playwright APIs.
- Direct Playwright operations in a test can be appropriate for a small or exceptional workflow. Explain maintainability concerns without treating every such use as a violation.

## BasePage

`BasePage` is optional until the project adopts it. If adopted, every Page Object should extend it consistently. Keep it limited to genuinely shared page behavior such as navigation and common browser interaction utilities; do not accumulate application-specific actions there.

The repository already configures `use.baseURL` from `BASE_URL`, so a suitable initial implementation is:

```typescript
import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }
}
```

Adapt it to existing code before introducing it. A navigation method is not required if direct `page.goto` calls with relative paths remain clearer.

## Locator and page object example

Use meaningful, lazy locator getters. For the current repository, `@pages/*` is configured to resolve to `src/ui/pages/*` under TypeScript:

```typescript
import { BasePage } from '@pages/BasePage';

export class LoginPage extends BasePage {
  get usernameInput() {
    return this.page.getByLabel('Username');
  }

  get passwordInput() {
    return this.page.getByLabel('Password');
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Log in' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

This is illustrative; match actual application labels and behavior. Do not add a LoginPage until the application flow and reuse justify it.

## Imports and aliases

Existing TypeScript mappings include `@pages/*` → `src/ui/pages/*`, `@core/*` → `src/core/*`, `@sites/*` → `src/sites/*`, `@fixtures` and `@fixtures/*` → `src/fixtures/`, `@data/*` → `src/data/*`, and `@config/*` → `src/config/*`. DemoQA UI components and API code use the `@sites/*` namespace; keep API behavior out of UI components. Add mappings only when a real project area needs them. TypeScript `paths` do not rewrite emitted JavaScript. Do not claim an alias works in Playwright runtime merely because it typechecks; verify resolution in the actual Playwright/TypeScript execution path before adopting it. Root config files may use relative imports, as `playwright.config.ts` currently does.

## Review and reporting

Inspect affected code and repository conventions before proposing a change. Distinguish established project rules from recommendations. For verified findings, use:

```text
[POM-ARCHITECT] SEVERITY — RULE NAME

File: <file path>
Line: <verified line number>

Issue:
<Description>

Recommendation:
<Correction>

Action:
AUTO-APPLIED | MANUAL REVIEW | NOT MODIFIED
```

Do not invent line numbers. Do not make behavior-changing architectural corrections without explaining the impact and obtaining authorization when required.
