---
name: code-conventions
description: Use for general TypeScript code quality reviews or changes in this Playwright automation repository when the focused test, Page Object, spec, and Git Skills do not own the concern.
---

# TypeScript and code quality conventions

## Scope and ownership

This Skill covers general TypeScript language and maintainability concerns in repository code. It is not an audit of the repository and does not run automatically.

- Use `pom-architect` for Page Object and UI component design, locators, navigation, and Page Object imports.
- Use `test-standards` for test behavior, fixtures, assertions, test data, environment configuration, and secret hygiene.
- Use `spec-standards` for spec paths, filenames, TC IDs, describe naming, and `test.step()`.
- Use `git-standards` for branches, commits, remotes, and Git workflows.
- Use this Skill for general language-level type safety, naming, imports, error clarity, duplication, and maintainability. In files owned by another Skill, apply those domain rules first and use this Skill only for a distinct general code-quality concern.
- Do not turn recommendations into project requirements unless marked **MUST** below.

## Repository TypeScript baseline

The current `tsconfig.json` sets `target` to `ES2022`, `module` and `moduleResolution` to `NodeNext`, `strict` to `true`, `esModuleInterop` to `true`, `forceConsistentCasingInFileNames` to `true`, and `noEmit` to `true`. It includes Node types and JSON module resolution. It does not enable `noUncheckedIndexedAccess`, `noImplicitOverride`, or a project-specific unused-symbol check. Do not claim these additional checks are active.

The current package manifest declares `@playwright/test` `^1.64.1` and TypeScript `^7.0.2`; the lockfile resolves Playwright `1.64.1` and TypeScript `7.0.2`. Treat these as observed dependency versions, not a convention or guarantee for a fresh install. Follow the installed toolchain and compiler diagnostics. Do not assume APIs, syntax, or compiler options beyond the versions and configuration actually in use.

## Mandatory rules

### Type safety

- **MUST** preserve strict typing and make types explicit where inference would obscure a public API, data contract, or nullable/optional value.
- **MUST** handle values that may be absent or invalid according to their actual type and runtime source. Do not silence a type error with a cast when narrowing, validation, or a corrected type models the value more accurately.
- **MUST NOT** use `any` by default. A narrowly scoped `any` is allowed only when an external boundary cannot be represented accurately with available types; document why it is needed and contain it at that boundary. Prefer `unknown` plus validation for untrusted values.
- **MUST NOT** add compiler flags or type-system requirements by documenting them as if they were enabled. Propose configuration changes separately when a concrete need exists.

### Naming

- **MUST** use names that communicate a value's purpose and use the casing already established by the surrounding code: `camelCase` for variables and functions, `PascalCase` for classes, interfaces, and type aliases.
- **MUST** keep names consistent with TypeScript and the existing project vocabulary. Do not rename public symbols or files as incidental cleanup.
- **MUST** reserve `UPPER_SNAKE_CASE` for environment variable names or established constant conventions; ordinary local constants in this repository use `camelCase`.

### Imports and aliases

- **MUST** use the existing aliases when importing from a mapped project area: `@pages/*`, `@core/*`, `@sites/*`, `@fixtures`, `@fixtures/*`, `@data/*`, and `@config/*`.
- **MUST** use `import type` for imports used only as types when that form is appropriate for the active TypeScript module configuration.
- **MUST NOT** add, remove, or repoint a TypeScript alias as a local convenience. Alias changes require checking TypeScript and Playwright runtime resolution and coordinating with the Skill that owns the affected area.
- **MUST** keep imports limited to used symbols. Organize imports consistently with the nearby file; do not impose a new ordering or lint rule absent from project configuration.

### Errors, configuration, and dependencies

- **MUST** provide actionable error messages for errors the code creates: identify the failed operation or invalid setting and the safe next step. Do not include secret values in messages.
- **MUST** validate external or environment-provided values at the boundary where the application consumes them, using the existing configuration approach when applicable.
- **MUST NOT** hardcode credentials, tokens, or private environment-specific values in source. Keep `.env.example` placeholder-only and do not expose secret values in logs or errors.
- **MUST NOT** add a dependency for functionality already available in the installed platform, TypeScript, or Playwright packages without a concrete need.
- **MUST NOT** leave unused imports, variables, unreachable branches, abandoned implementations, or dead code in code changed for a task. The configured compiler does not enable a dedicated unused-symbol check, so inspect changed code directly.

## Recommendations

- Prefer small functions and types with one clear responsibility. Split code when doing so makes a real behavior or ownership boundary clearer; avoid one-line wrappers and generic frameworks that only rename existing APIs.
- Reuse existing logic when behavior is genuinely shared. Keep distinct workflows separate when abstraction would hide important differences or make callers harder to understand.
- Prefer straightforward control flow, descriptive names, and types that explain the data shape. Avoid cleverness, speculative generality, and comments that merely restate the code.
- Follow the formatting and style of the surrounding file. No formatter or linter configuration is declared as the authoritative style source, so do not claim a formatting tool has enforced these recommendations unless it was run.
- Keep changes focused. Do not reorganize folders or rename files as routine cleanup; follow repository guidance and the owning Skill for the affected area.

## Compatibility and validation

- Check `tsconfig.json`, `package.json`, and the lockfile when a change depends on compiler or library behavior. The current project uses `ES2022` and `NodeNext`; preserve these settings unless a separately justified configuration change is authorized.
- Use APIs supported by the installed TypeScript and Playwright versions. Do not copy examples that depend on a newer API without verifying its availability in the installed package.
- For a relevant code change, `npm run typecheck` is the repository's configured TypeScript check. Report whether it was actually run; do not claim type safety solely because this Skill was read.
- This Skill does not prescribe Playwright assertion style, fixture lifecycle, test organization, Page Object structure, or Git procedures. Consult the owner Skills for those topics.
