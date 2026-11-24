---
name: spec-data-standard
description: >
  Enforce and auto-apply test data robustness standards for Playwright + TypeScript
  projects. Classifies test data, assesses data maturity (levels 0-4), and enforces
  parallel isolation, typed data sourcing and data-driven datasets, environment
  portability, and deterministic expected values. Includes a verification mode that
  runs the suite in parallel and per environment to produce evidence. Load when
  writing tests that create or read data, enabling parallel execution, adding an
  environment, or diagnosing failures that only appear in parallel or in one environment.
---

# Test data robustness

Own hermeticity of test data: every test uses resources it controls, without depending on another test, execution order, a particular environment, or assumed seed data. Parallel safety and environment portability are parts of hermeticity.

## Ownership and project fit

- Resolve actual data, configuration, fixture, API, runner, test, and TC-document paths before applying rules. Preserve site-oriented organization; do not move files to match generic paths.
- `spec-quality-lifecycle` remains lifecycle orchestrator. This Skill owns Phase 2 Arrange (M1–M3), Phase 4 expected-value source (M4), and Phase 5 Run evidence (M5). Debugging is cross-cutting.
- `spec-requirements-standard` M4 supplies classified data items/sources for a TC. This Skill does not assess TC document content.
- `api-setup-teardown` owns API clients, controllers, API fixture mechanics, and setup/teardown symmetry. This Skill assesses identity isolation and cleanup scope. The repository calls its API mode `Implement`, not `Add`.
- `test-standards` retains test implementation conventions, credential storage and secrets hygiene. Do not re-audit credential storage here. `spec-quality-lifecycle` owns general test independence and module state; this Skill evaluates data identity and collision risk. Its R10 owns assertion specificity; R13 supplies the data expected-value source. `spec-standards` owns test tags' syntax; this Skill defines their data meaning.
- The names `ui-pom-standard`, `spec-code-standard`, `spec-organisation-standard`, `api-setup-teardown-standard`, `spec-quality-lifecycle-standard`, and `git-workflow-docs-standard` are not repository Skill names. Their verified local owners where applicable are `pom-architect`, `test-standards` (credentials), `spec-standards` (tag syntax), `api-setup-teardown`, `spec-quality-lifecycle`, and `git-standards`. Do not create aliases or replacement Skills.

## Resolve project conventions

Inspect `AGENTS.md`, registered Skills, `tsconfig.json`, folders, configuration, fixtures, data modules, tests, and Playwright configuration. Report resolved paths in M0.

| Placeholder | Meaning | Generic default |
|---|---|---|
| `<data-dir>` | Data modules, per site/app when needed | `src/data` |
| `<config-module>` | Validated environment configuration (`ENV`) | `src/config/env.ts` |
| `<fixtures-module>` | Playwright fixtures (`test.extend`) | `src/fixtures/index.ts` |
| `<api-layer>` | Provisioning clients/controllers | `src/api` |
| `<runner-config>` | Playwright runner config | `playwright.config.ts` |
| `<tc-docs-dir>` | TC specifications | `docs/test-cases` |

Specs must read environment values through the project's config module, never `process.env`. The config module itself is the designated process-environment boundary. Never replace an established config contract or introduce a second config source.

## Data classes and lifecycle

Classify data before assessing other rules. A transactional account can contain transient secret fields; classify the identity and credential distinctly when useful.

| Class | Typical example | Mutability and handling |
|---|---|---|
| Reference | Catalog item, country | Read-only; share or discover from the system |
| Environment | Base URL, seed identifier, feature flag | Per environment; typed configuration |
| Transactional | New user, order, cart item | Mutable; provision per test/worker, isolate and clean |
| Secret | Password, token | Keep outside source in environment/CI secret storage |
| Simulated | Mock response | Test-controlled; provide through `mock<Resource>` |

Lifecycle: **Define → Provision → Use → Clean**. Define a typed shape; create, discover, or mock it; scope it to test/worker/pool; clean only owned resources.

## Data maturity

Score each site independently. A level is reached only when all exit criteria through that level are met; partial completion does not advance the level.

| Level | Name | Exit criteria |
|---|---|---|
| 0 | Hardcoded | Inputs and expected data are moved out of specs into the project's data source |
| 1 | Externalised | Typed data modules/datasets, validated environment configuration, secrets outside repository |
| 2 | Per environment | Typed `TEST_ENV` configuration; no shared mutable identities; unique generated data |
| 3 | Isolated | Per-test/worker isolation; data self-provisioned through API where available; environment literals replaced with discovery |
| 4 | Self-provisioned | Hermetic data lifecycle; maintain robustness by running M5 for each new TC |

## Modes

M0 is the default. Modes assess or implement data robustness; they do not replace the lifecycle orchestrator.

### M0 — Maturity assessment (read-only)

Triggers: `assess test data`, `data maturity`, `spec data`, `data robustness`.

1. Discover actual `<data-dir>/**`, `<config-module>/**`, `<fixtures-module>/**`, `<runner-config>`, `tests/**/*.spec.ts`, and `<tc-docs-dir>/**` paths.
2. Inventory data consumed by tests and classify every item as Reference, Environment, Transactional, Secret, or Simulated.
3. Identify shared mutable identities, uniqueness and sourcing gaps, cleanup scope, uncontrolled expected values, and environment assumptions. Calculate maturity per site and map blockers to a mode and rule.
4. Do not modify files.

```text
[spec-data-standard] MATURITY ASSESSMENT
Project paths: Data <path>; Config <path>; Fixtures <path>; API <path>
Site: <site>    Level: <0-4> — <name>
Data inventory: <n> reference · <n> environment · <n> transactional · <n> secret · <n> simulated
Blockers to level <n>: <issue> → M<n> / R<n>
Recommended next mode: M<n>
```

### M1 — Parallel isolation

Triggers: `parallel safe`, `isolate data`, `fix parallel failures`, `spec data m1`.

Answer: can N workers run simultaneously without modifying or deleting each other's resources? Apply R1–R5 to fixtures, specs, data factories, and runner config. Select a strategy; use API Skill `Implement` mode for missing provisioning methods. Auto-fix only marked rules; list manual fixes separately.

| Situation | Strategy | Fixture concept |
|---|---|---|
| Test creates/mutates data; API available | Per-test identity with scoped teardown | `created<Resource>` |
| Costly mutable identity | One identity per worker | worker-scoped `worker<Resource>` |
| Identity cannot be created | Account pool indexed by `parallelIndex` | `worker<Resource>` |
| Read-only reference | Share or discover | `<resource>Controller` |
| UI behavior independent of backend | Mock | `mock<Resource>` |
| Truly unavoidable shared state | Serialize with a reason | `mode: 'serial'` and `// spec-data: serial — <reason>` |

Playwright workers are separate processes. Module variables are not shared. `testInfo.parallelIndex` (or worker fixture `workerInfo.parallelIndex`) is stable from 0 to workers−1; `workerIndex` changes after worker restart and must not partition stable data. Worker fixtures use `{ scope: 'worker' }`.

Conceptual example only; verify actual controller and fixture APIs before use:

```typescript
workerUser: [async ({ playwright }, use, workerInfo) => {
  const request = await playwright.request.newContext({ baseURL: ENV.baseUrl });
  const accounts = new AccountController(new ApiClient(request));
  const credentials = buildUser(workerInfo.parallelIndex);
  const user = await accounts.createUser(credentials);
  try {
    await use({ ...credentials, id: user.id });
  } finally {
    await accounts.deleteUser(user.id);
    await request.dispose();
  }
}, { scope: 'worker' }],
```

### M2 — Data sourcing and data-driven tests

Triggers: `data driven`, `externalise data`, `load test data`, `spec data m2`.

Apply R6–R8. Choose typed TypeScript modules for small datasets, JSON/CSV plus typed validating loader for larger maintained datasets, factories for unique values, and an environment data map for environment-bound values. Validate required fields and fail fast with useful errors. Combine cases that differ only by data when workflow is identical; distinct workflows remain separate TCs. Give every generated test title a unique row identifier. Do not add conditional branches just to combine different workflows; coordinate with `spec-quality-lifecycle` R8.

```typescript
for (const row of cases) {
  test(`${row.id}: ${row.description}`, async ({ page }) => {
    // Apply the same workflow to one typed row.
  });
}
```

Adapt import aliases and locations to `tsconfig.json`; do not duplicate an existing loader.

### M3 — Environment portability

Triggers: `multi environment`, `run on staging`, `env config`, `spec data m3`.

Apply R9–R12. Verify selector/config validation, replace environment-dependent literals with runtime discovery or an environment-keyed data map, tag data impact using the project's supported syntax, guard destructive cleanup, and ensure environment files are ignored and `.env.example` has placeholders only. Always produce the Environment Readiness Map below. If fewer than two environments exist, it replaces per-environment execution evidence; state portability was not demonstrated through execution.

| # | Reinforcement point | Evidence location | Rule |
|---|---|---|---|
| E1 | Environment selector and per-environment config | `<config-module>` | R9 |
| E2 | Fail-fast variable validation | `<config-module>` | R9 |
| E3 | Configured base URL and relative paths | runner, specs, TC docs | R10 |
| E4 | Secrets external to repository | env files / CI secrets | — |
| E5 | Self-provisioned identities | fixtures / API layer | R1, R10 |
| E6 | Reference data discovered at runtime | fixtures / specs | R10 |
| E7 | Controlled expected-value sources | specs / TC docs | R13 |
| E8 | Scoped, guarded cleanup | fixtures | R12 |
| E9 | Data-impact tags | specs | R11 |
| E10 | CI matrix with per-environment secrets | CI pipeline | — |

Statuses: `DONE`, `WOULD CHANGE` (name the file), `NOT APPLICABLE`.

```text
[spec-data-standard] ENVIRONMENT READINESS — <site>
Environments available: <n> (<names>)
E1 <status> <evidence>; ... E10 <status> <evidence>
Ready: <n>/10
Next: <first WOULD CHANGE item>
```

### M4 — Deterministic data and expected values

Triggers: `assert values`, `deterministic data`, `mock data`, `spec data m4`.

Apply R13–R14. For each assertion on data-bearing elements, name its controlled expected-value source. Presence is not correctness. Prefer:

| Source | Use | Compare |
|---|---|---|
| Test-created resource (`created<Resource>`) | Transactional data | Each expected field against created data |
| Mock payload (`mock<Resource>`) | Rendering, formatting, edge cases | Every rendered field against payload |
| Dataset row | Data-driven input/output | Against `row.expected` |
| API discovery | System-owned reference data | UI against API data for the same entity |

When tested content is not owned or predictable, use a `mock<Resource>` from project data and assert every rendered field against it; keep a non-mocked integration test when appropriate. Coordinate reusable route mocks with `api-setup-teardown`. `spec-quality-lifecycle` R10 retains assertion-specificity ownership.

### M5 — Robustness verification

Triggers: `verify robustness`, `stress parallel`, `run data verification`, `spec data m5`.

M5 executes tests and records evidence; it never edits code. Before running, confirm scope, configured browser project, environment, and that all mutations/cleanup are limited to test-owned resources. If safe execution cannot be established, do not run. Default to 4 workers, 4 repetitions, retries disabled:

```bash
npx playwright test <scope> --project=<browser> --workers=4 --repeat-each=4 --retries=0
```

Run in every configured environment. At least two accessible environments are required to demonstrate portability; otherwise attach M3's readiness map and state the limit. Check orphan records by the actual configured prefix only if the API supports enumeration; otherwise report `not verifiable`, never zero. Classify failures as collision, session invalidation, missing data, order dependency, or non-data flakiness (handoff latter to `spec-quality-lifecycle`). Compare with earlier evidence if available. Never report `HERMETIC` without actual execution evidence.

```text
[spec-data-standard] ROBUSTNESS VERIFICATION
Scope: <scope>    Project: <browser>
Parallel: workers=<n> repeat=<k> <passed>/<total> passed; <flaky> flaky
Environment <a>: <result>    Environment <b>: <result or not available>
Orphans: <count or not verifiable>
Failures: collision <n>; session <n>; missing-data <n>; order <n>; other <n>
Verdict: HERMETIC | NOT HERMETIC → M<n> / R<n> | INCOMPLETE
```

## Rules R1–R15

Severity, fix type, and owning mode are part of each rule. Auto-fix only when the correction is safe, local, and does not change test meaning or risk existing data. Never run a broad cleanup as an auto-fix.

| ID / rule | Severity · Fix · Mode | Violation and required action |
|---|---|---|
| R1 `NO_SHARED_MUTABLE_IDENTITY` | ERROR · MANUAL · M1 | Test/worker mutates or bulk-deletes an identity loaded from one static source while multiple workers are possible. Use per-test identity, worker-scoped identity, or pool. |
| R2 `UNIQUE_CREATED_DATA` | ERROR · AUTO · M1 | A created field requiring uniqueness is static. Generate with the project prefix, `parallelIndex`, timestamp, and random suffix; `Date.now()` alone is insufficient. |
| R3 `TEST_DATA_PREFIXED` | WARNING · AUTO · M1 | Generated transactional data lacks the resolved project prefix (`ENV.testDataPrefix`, or `qa_` only when no convention exists). The prefix supports orphan detection. |
| R4 `PARALLELISM_NOT_SUPPRESSED` | WARNING · MANUAL · M1 | `workers: 1`, `fullyParallel: false`, or serial mode suppresses parallelism without `// spec-data: serial — <reason>`. Do not remove intentional serialization without understanding it. |
| R5 `NO_GLOBAL_STATE_ASSERTION` | WARNING · MANUAL · M1 | Assertion checks total count/whole collection on unowned shared data. Assert owned records or own the collection. |
| R6 `TYPED_DATA_SOURCE` | ERROR · AUTO · M2 | JSON/CSV is imported/parsed in a spec or loaded without type and required-field validation. Add/reuse a typed loader under `<data-dir>`. |
| R7 `DATA_OUTSIDE_SPEC` | ERROR · AUTO · M2 | Spec contains inline datasets or literal expected values representing data rather than UI labels. Move to typed project data and import using configured alias. Credential storage remains `test-standards` scope. |
| R8 `DATA_DRIVEN_TITLES_UNIQUE` | ERROR · AUTO · M2 | Generated calls lack unique row IDs in titles, or identical workflows are copy-pasted by data. Add `${row.id}` and consolidate only identical workflows. |
| R9 `ENV_RESOLVED_FROM_CONFIG` | ERROR · AUTO · M3 | Specs read `process.env`; config loads only one fixed `.env`; or test variables are not startup-validated. Route reads through one `ENV`, add selector/validation/docs as needed, preserve contract. |
| R10 `NO_ENV_SPECIFIC_LITERALS` | ERROR · MANUAL · M3 | Spec, fixture, or data module assumes a host, ID, UUID, SKU, ISBN, or seeded user exists across environments. Prefer runtime discovery; otherwise key `<data-dir>/env.data.ts` by `ENV.name`. |
| R11 `DATA_IMPACT_TAGGED` | WARNING · AUTO · M3 | Persistence action or `created<Resource>`, `clean<Resource>`, `worker<Resource>` fixture lacks `@mutates-data`; environment-only test lacks `@env:<name>`. Add only supported native syntax. `@read-only` means no persistent mutations. |
| R12 `SCOPED_AND_GUARDED_CLEANUP` | ERROR · MANUAL · M1/M3 | Teardown bulk-deletes unowned data or bulk-deletes without checking `ENV.allowDestructiveCleanup`. Delete only created IDs; guard bulk cleanup; never delete unrelated shared data. |
| R13 `EXPECTED_VALUE_FROM_CONTROLLED_SOURCE` | WARNING · MANUAL · M4 | Data-bearing assertion checks presence only when value matters, or compares to an uncontrolled literal. Compare exact values from created fixture, mock, dataset, or API discovery. Feeds lifecycle R10. |
| R14 `MOCK_FOR_UNOWNED_CONTENT` | WARNING · MANUAL · M4 | Test checks rendering/formatting/edge cases of live or third-party content whose values it cannot predict. Use `mock<Resource>` and compare every field; retain integration coverage where useful. |
| R15 `SINGLE_SESSION_PER_IDENTITY` | ERROR · MANUAL · M1 | More than one fixture creates a token/session for one identity within a test. Let one fixture own the session; reuse it or use unauthenticated reads. |

R2 uniqueness example: `qa_${parallelIndex}_${Date.now()}_${randomSuffix}`. Resolve the actual prefix and APIs before applying. R4 serialization example: `// spec-data: serial — shared read-only service limit`. R11 tag meaning is this Skill's property; tag syntax belongs to `spec-standards`.

## Scan scope

Resolve globs to current project paths; do not move files to fit them. A file may be reviewed by multiple Skills only for distinct concerns.

| Actual scope pattern | Rules |
|---|---|
| `<fixtures-module>/**/*.ts` | R1, R2, R3, R12, R15 |
| `<data-dir>/**` | R2, R3, R6, R10 |
| `<config-module>/**/*.ts` | R9 |
| `playwright.config.ts` | R4 |
| `tests/**/*.spec.ts` | R4, R5, R6, R7, R8, R9, R10, R11, R13, R14 |

## Violation format

Report confirmed evidence only. Use relative paths and actual line numbers. Never label a manual fix auto-applied.

```text
[spec-data-standard] SEVERITY — RULE_NAME (M<n>)
File:  <relative path>
Line:  <line number>
Issue: <one sentence with observed evidence>
Fix:   <one sentence> | AUTO-APPLIED | MANUAL-FIX
```
