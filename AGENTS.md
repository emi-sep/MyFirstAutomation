# Project guidance

## Project

This repository is a Node.js, TypeScript, Playwright Test automation project. Tests are under `tests/`. Environment configuration is implemented in `src/core/config/env.ts`; `src/config/Env.ts` is a compatibility re-export. Read the existing implementation before changing it.

## Architecture

- Preserve current structure and behavior; do not move or rename folders as part of routine work.
- Use the configured Playwright `baseURL` and existing conventions. Avoid hardcoded application origins.
- Keep test assertions in test specifications. Introduce Page Objects and shared abstractions only where they improve a real workflow.
- Use `.agents/skills/automation-architect/SKILL.md` to route cross-cutting work, then read the focused Skill for the task: POM, test implementation, spec organization, TypeScript quality, test lifecycle, API lifecycle, or Git/documentation governance. Activate Skills through the recognized Codex Skill mention and select its suggestion when available; a plain text Skill name alone does not guarantee activation.
- Never commit `.env` or real credentials; keep `.env.example` placeholder-only.

## Validation

Available commands: `npm run typecheck`, `npm test`, `npm run test:smoke`. Run relevant validation before reporting completion and state what was actually run.
