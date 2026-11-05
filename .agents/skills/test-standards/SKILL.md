---
name: test-standards
description: Use when creating, reviewing, organizing, or maintaining Playwright tests, fixtures, test data, assertions, or test security practices in this repository.
---

# Playwright test standards

## Repository fit

The current project uses Playwright Test with TypeScript. `playwright.config.ts` sets `testDir` to `./tests`, and the existing test is `tests/example.spec.ts`. Keep the current structure unless a feature or test volume justifies a documented expansion. A possible later structure is `tests/ui/<feature>/` and `tests/api/<feature>/`; do not create empty folders or reorganize current tests solely to match an example. Page Objects do not yet exist; when a test uses them, also consult `.agents/skills/pom-architect/SKILL.md`.

## Test conventions

- Name test files `*.spec.ts`.
- Use descriptive test and `test.describe()` titles that explain behavior. Group related scenarios where useful.
- Keep tests independent and order-independent; each test should verify a focused behavior.
- Keep assertions in test specifications, not Page Objects.
- Prefer Playwright auto-waiting and web-first assertions (`await expect(locator).toBeVisible()`, URL and response assertions as appropriate).
- Avoid fixed waits. Use fixtures for genuinely reusable setup, not one-off indirection.
- Keep setup and teardown explicit, avoid duplicated flows, hidden fixture side effects, and unnecessary complexity.
- Keep scenario data separate when reuse or clarity warrants it. Use deterministic data and avoid production-account dependencies.
- Apply tags such as `@smoke`, `@regression`, or `@critical` only when they support selection or reporting.
- Use Arrange, Act, Assert as a helpful organization, not a rigid formatting requirement.
- For small or exceptional flows, direct use of `page` can be reasonable. If POM is adopted for a feature, follow that feature's established Page Object conventions consistently.

## Example

This direct interaction is illustrative. In a feature that has adopted POM, route the actions through its Page Object instead.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login functionality', () => {
  test('allows a valid user to log in', async ({ page }) => {
    // Arrange and act
    await page.goto('/login');
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Assert
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

Use relative paths so the configured `baseURL` applies. Never copy example credentials into a real environment.

## Fixtures

Fixtures encapsulate repeatable setup, expose dependencies explicitly, and avoid hidden side effects. Provide Page Objects through fixtures only when that improves consistency; construct them with the fixture's actual `page` and keep fixture types aligned.

An authenticated fixture should verify successful authentication before yielding the authenticated `Page`, and expose the `Page` rather than a login Page Object:

```typescript
authenticatedPage: async ({ page }, use) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate('/login');
  await loginPage.login(users.appUser.username, users.appUser.password);
  // Assert the expected authenticated state before exposing the page.
  await use(page);
}
```

Adapt this shape to the existing fixture setup if one is introduced. Avoid repeating authentication flows across tests when a safe, maintainable fixture or stored state is appropriate.

## Test data and secrets

The repository's `.gitignore` excludes `.env` and `.env.*`, and `.env.example` contains placeholders. Preserve that protection. Never hardcode real credentials, commit `.env`, or place secrets in `.env.example`, test titles, logs, or reports. Read secrets from environment configuration and keep test data separate from test logic when practical. Do not depend on production user accounts.

## Quality review

Assess functional coverage, positive and negative behavior, boundary/empty values, validation, persistence, error handling, UI/API behavior, isolation, and maintainability according to feature requirements and risk. Do not require every category for every test. Report only actionable gaps supported by the code.

For verified findings, use:

```text
[TEST-STANDARDS] SEVERITY — RULE NAME

File: <file path>
Line: <verified line number>

Issue:
<Description>

Recommendation:
<Correction>

Action:
AUTO-APPLIED | MANUAL REVIEW | NOT MODIFIED
```

Use only verified line numbers. Explain uncertainty and avoid treating heuristics as proof.
