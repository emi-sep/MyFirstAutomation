# Project guidance

## Project

This repository is a Node.js, TypeScript, Playwright Test automation project. Tests are under `tests/`; shared environment configuration is under `src/config/Env.ts`. Read the existing implementation before changing it.

## Architecture

- Preserve current structure and behavior; do not move or rename folders as part of routine work.
- Use the configured Playwright `baseURL` and existing conventions. Avoid hardcoded application origins.
- Keep test assertions in test specifications. Introduce Page Objects and shared abstractions only where they improve a real workflow.
- Consult `.agents/skills/automation-architect/SKILL.md` for cross-cutting architecture, `.agents/skills/pom-architect/SKILL.md` for POM work, and `.agents/skills/test-standards/SKILL.md` for test work. Read the relevant Skills explicitly when needed.
- Never commit `.env` or real credentials; keep `.env.example` placeholder-only.

## Validation

Available commands: `npm run typecheck`, `npm test`, `npm run test:smoke`. Run relevant validation before reporting completion and state what was actually run.
