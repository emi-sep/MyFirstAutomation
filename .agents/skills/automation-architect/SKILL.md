---
name: automation-architect
description: Use for repository-wide Playwright automation architecture decisions, cross-cutting test and POM changes, framework governance, or migration planning in this project.
---

# Automation architecture guide

## Repository baseline

This repository is a Node.js, TypeScript, Playwright Test project. The current configuration uses `tests/`, a single Chromium project, `baseURL` from `src/config/Env.ts`, and TypeScript aliases for `@pages/*`, `@fixtures/*`, `@data/*`, and `@config/*`. There is one direct-interaction spec and no existing Page Objects, fixtures, helpers, API layer, or project `AGENTS.md` at the time this guide was created. The proposal's `src/ui/` tree is a possible future direction, not the current architecture. Preserve the current structure unless a planned change has a concrete reason and migration path.

## Coordinate the focused skills

Skills are instructions for Codex, not executable functions or independent agents. When relevant, explicitly inspect and apply the repository files below; do not assume they are automatically invoked:

- For Page Object, component, BasePage, locator, or alias work, read and apply `.agents/skills/pom-architect/SKILL.md`.
- For test creation, modification, organization, fixtures, assertions, or data practices, read and apply `.agents/skills/test-standards/SKILL.md`.
- When work affects both architecture and tests, apply both. Review dependencies, choose a safe implementation order, and keep their recommendations consistent.

After reading a focused skill, inspect the affected source and existing conventions. Report verified issues with the reporting format defined in the applicable skill. Keep recommendations distinct from current project rules.

## Governance

Before adding a pattern, check whether existing code solves the need. Prefer consistency and the smallest useful abstraction. Explain tradeoffs for significant architectural changes and justify new dependencies. Do not introduce new architectural modes casually: document the reason for each, maintain at most ten active modes, and retire obsolete modes with a reason. Do not create more Skills for minor conventions.

The proposed architecture (`src/ui/pages`, components, config, fixtures, data, helpers, and API) is not a mandate to restructure this repository. Keep `src/config`, `tests`, existing aliases, and current behavior intact unless the task explicitly includes an approved migration. Do not move or rename existing folders automatically.

## Change workflow

Before a change, inspect affected files, state the intended changes and material risks, and preserve existing behavior. Do not rewrite the framework or overwrite project configuration as a shortcut. Protect `.env` and credentials; preserve the existing `.gitignore` rules.

After a change, review the diff and run the relevant TypeScript validation and Playwright tests when authorized and feasible. In this repository the available scripts are `npm run typecheck`, `npm test`, and `npm run test:smoke`. Report exactly what ran and any failures; never claim validation that was not executed. If validation is blocked by environment constraints, say so clearly.

When reviewing rather than changing code, do not modify files. Distinguish confirmed violations from maintainability recommendations and exceptions.
