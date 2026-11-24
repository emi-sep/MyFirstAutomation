---
name: spec-standards
description: >
  Enforce and apply organizational and lifecycle standards for Playwright + TypeScript
  specification files. Covers folder hierarchy, file naming, TC ID format,
  describe-block naming, and meaningful test step definition using test.step().
  Load when creating, reviewing, validating, or reorganizing spec files.
---

# Playwright specification organization standards

## Ownership and boundaries

This skill owns specification organization and lifecycle conventions. Apply `.agents/skills/test-standards/SKILL.md` for test code quality, imports, fixtures, credentials, test data, assertions, and framework usage. Apply `.agents/skills/pom-architect/SKILL.md` for Page Object layer structure and implementation. Do not duplicate or override those skills' responsibilities.

## Project context

- The target specification path is `tests/ui/{suite}/{feature}/TC{N}-{short-name}.spec.ts`.
- Valid suite categories are `smoke` for critical-path scenarios and `regression` for edge cases and negative scenarios.
- The feature folder names the functionality under test; it does not have to match a Page Object name. Examples include `login/`, `register/`, `products/`, `cart/`, `checkout/`, `contact/`, and `subscription/`.
- TC IDs are assigned by the team or sourced from a test management tool. Validate format and consistency only; do not claim to verify external test management records. `TC0` is reserved for exercises or examples outside the main test case suite.
- Use one spec file per TC. Data-driven variants of the same TC may stay in one file.
- Use `test.step()` to report meaningful functional test steps. Inline `// Step N:` comments and JSDoc `@steps` sections do not replace `test.step()`.
- This hierarchy is the target standard, not an assumption about existing files. Report existing deviations as findings when reviewing. Do not move existing files while creating this skill or during a read-only audit.

## Rules

### R1 — FOLDER_STRUCTURE (ERROR)

A spec file must be located at `tests/ui/{suite}/{feature}/TC{N}-{short-name}.spec.ts`, where `{suite}` is `smoke` or `regression`, and `{feature}` represents the functionality under test. Files directly under `tests/` or `tests/ui/`, or missing either suite or feature level, violate this rule.

For an existing file, report its current path, recommend the expected destination, and identify import paths that could be affected. In a read-only audit, do not move it. Resolve an uncertain suite or feature with the user before correction.

### R2 — FILE_NAMING_CONVENTION (ERROR)

The filename must match `TC{N}-{short-kebab-description}.spec.ts`.

- `N` is a non-negative integer without zero padding: `TC0`, `TC1`, `TC10`.
- Use 1–5 meaningful words in the description, written in kebab-case.
- Do not use underscores, PascalCase, or a hyphen between `TC` and its number.
- The filename TC number must match the number in every corresponding `test()` title.
- If one file contains different TC IDs, report the violation and recommend one file per TC. Do not split files during a read-only audit.

Valid examples: `TC0-valid-login.spec.ts`, `TC1-register-user.spec.ts`, `TC8-verify-all-products-and-detail.spec.ts`, `TC9-search-product.spec.ts`, `TC10-subscription-home-page.spec.ts`.

Invalid examples: `products.spec.ts`, `example.spec.ts`, `TC8_VerifyAllProducts.spec.ts`, `TC-8-verify-products.spec.ts`.

### R3 — DESCRIBE_MATCHES_FEATURE_FOLDER (ERROR)

The `test.describe()` name must match the PascalCase conversion of its parent feature folder: split the folder name on hyphens, capitalize each word, then join the words. Examples: `login` → `Login`, `user-registration` → `UserRegistration`, `shopping-cart` → `ShoppingCart`. Report the expected name on mismatch. When correction is explicitly authorized, update the describe name only after confirming the correct folder.

### R4 — TC_ID_NAMING_CONVENTION (ERROR)

Each `test()` title must start with `TC{N}: ` using uppercase `TC`, a non-negative integer, a colon, and exactly one following space. The number must match the filename. For data-driven variants of one TC, all titles must start with that same TC ID and include a distinguishing description. Do not invent TC numbers; report uncertain numbers for human decision.

Valid: `test('TC0: Valid login redirects to inventory page', ...)` and `test('TC8: Verify all products are displayed', ...)`.

Invalid: `TC8 Verify All Products` (missing colon), `TC8 - Verify Products` (wrong separator), and `Verify all products` (missing TC ID).

### R5 — USE_TEST_STEP (ERROR)

For meaningful functional phases, use `test.step()` instead of inline `// Step N:` comments or JSDoc `@steps`. Group related actions and assertions; do not require a separate step for every locator interaction or assertion. Use clear descriptions, return callback values when later steps need them, avoid unnecessary nesting, and keep assertions in the test specification rather than moving them into Page Objects.

```typescript
test('TC{N}: Verify inventory products', async ({ inventoryPage }) => {
  await test.step('Verify inventory page is displayed', async () => {
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  const products = await test.step('Retrieve inventory products', async () => {
    const result = await inventoryPage.getProductNames();
    expect(result.length).toBeGreaterThan(0);
    return result;
  });

  await test.step('Verify products were retrieved', async () => {
    expect(products.length).toBeGreaterThan(0);
  });
});
```

## Violation reporting

Report each finding using this exact structure. Use a path relative to the project root and `N/A` when a line does not apply.

```text
[spec-standards] SEVERITY — RULE_NAME
File:  <relative path from project root>
Line:  <line number or N/A>
Issue: <one sentence describing the problem>
Fix:   <one sentence describing the recommended correction>
Status: <REPORTED | AUTO-APPLIED>
```

Example:

```text
[spec-standards] ERROR — FOLDER_STRUCTURE
File: tests/inventory.spec.ts
Line: N/A
Issue: Spec file is not inside the required tests/ui/{suite}/{feature}/ hierarchy.
Fix: Move to the appropriate suite and feature directory after reviewing imports.
Status: REPORTED
```

## Data-impact tag syntax

Use Playwright's structured test details `tag` option for data-impact labels. This Skill owns syntax; `spec-data-standard` owns the meaning and when a tag is required.

| Tag | Use |
|---|---|
| `@mutates-data` | Test or fixture creates, changes, or deletes persistent data |
| `@read-only` | Test performs no persistent mutation |
| `@env:<name>` | Test is supported only in the named environment |

Combine tags with the installed Playwright syntax, for example:

```typescript
test('TC<N>: Create an item', { tag: ['@mutates-data', '@smoke'] }, async ({ page }) => {
  // Test body
});
```

Do not infer environment names or mark a mutating test `@read-only`. Existing tag policy for `@smoke` and `@regression` remains unchanged.

## Scan scope

Apply R1–R5 to every matching file in both `tests/ui/**/*.spec.ts` and `tests/*.spec.ts`. Do not silently exclude files because they are outside the target hierarchy. If no files match, report that the scan scope was empty.

## Operating modes and auto-fix policy

### Read-only audit (default)

Inspect files, report violations, and recommend corrections. Do not modify, rename, split, or move files.

### Correction mode (only when explicitly requested)

Apply safe, unambiguous corrections; inspect affected imports and references; preserve test behavior; do not invent TC IDs; and ask for clarification when suite, feature, or TC number is uncertain. Re-run applicable validation after changes and report every change made.

Do not perform repository-wide restructuring merely because this skill was loaded.

## Future extension points

These remain possible future capabilities: lifecycle policies for `beforeAll` and `afterAll`; setup and teardown conventions; and restrictions on `test.only` and `test.skip`. The data-impact tag syntax above is active; tag meaning and data-impact classification remain owned by `spec-data-standard`.
