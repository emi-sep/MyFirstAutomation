# ADR-002: Add the `spec-data-standard` Skill

- Status: Accepted
- Date: 2026-11-24

## Context and problem

The repository has Skills for test implementation, API resource lifecycle, specification lifecycle, and TC-document quality, but no single owner for data robustness across data modules, fixtures, environment configuration, and specs. Current tests include both a shared mutable SauceDemo identity and per-test DemoQA identities. Review needs to distinguish classification, sourcing, uniqueness, environment portability, controlled expected values, and evidence that parallel execution is reliable.

## Decision

Introduce `.agents/skills/spec-data-standard/SKILL.md` to own test-data robustness. It classifies Reference, Environment, Transactional, Secret, and Simulated data; assesses maturity; and provides M0–M5 for assessment, parallel isolation, data sourcing, environment portability, controlled assertions, and execution evidence.

The lifecycle orchestrator remains `spec-quality-lifecycle`. The new Skill supplies Arrange guidance (M1–M3), expected-value source guidance (M4), and robustness evidence (M5). It does not own API-client implementation, credential storage, spec organization, or general scenario lifecycle rules.

Repository paths are site-oriented where applicable: shared data in `src/data/`, DemoQA data in `src/sites/demoqa/data/`, DemoQA API in `src/sites/demoqa/api/`, shared environment helpers in `src/core/config/env.ts`, fixtures in `src/fixtures/` and `src/sites/demoqa/tests/fixtures.ts`, test code in `tests/`, Playwright configuration in `playwright.config.ts`, and TC documents in `docs/test-cases/`.

## Alternatives considered

1. Expand `test-standards` to own every robustness assessment. Rejected because parallel isolation, environment portability, expected-value sourcing, and M5 execution evidence form a distinct cross-layer responsibility.
2. Put all data rules in `api-setup-teardown`. Rejected because SauceDemo has no API data layer and data quality also applies to UI-only tests, static data, mocks, and browser execution.
3. Add a separate orchestration Skill. Rejected because `spec-quality-lifecycle` already orchestrates scenario phases.

## Ownership and integration

- `automation-architect` registers the Skill, maps its data-related scan properties, and places it after API infrastructure review and before lifecycle review in the Full Pipeline.
- `spec-quality-lifecycle` invokes it for Arrange, Assert value sourcing, and Run evidence while retaining lifecycle ownership.
- `api-setup-teardown` owns provisioning controllers and API fixture mechanics; `spec-data-standard` evaluates identity and cleanup scope.
- `test-standards` retains fixture conventions and credential storage/hygiene. `spec-standards` owns any activated test tag syntax; `spec-data-standard` defines data-impact tag meaning.
- `spec-requirements-standard` owns TC-document quality and declares data classes/sources for M4 handoff.

## Consequences and trade-offs

The new Skill can identify data risks across code layers without duplicating their implementation rules. M0 is read-only. M5 runs tests and can create external test resources, so execution requires a verified target, owned resources, and a scoped scenario; it must never claim portability with fewer than two executed environments. Repository-specific prefixes, folder paths, tags, and fixture names must be resolved from current files rather than copied from generic examples.

The current project has one browser project and no demonstrated per-site environment selector. A shared mutable SauceDemo identity and single-environment configuration limit its present maturity. The DemoQA fixture has a per-test identity but its cleanup guard and orphan enumeration support must be assessed before any cleanup or orphan claim.
