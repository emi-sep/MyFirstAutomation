---
name: api-setup-teardown
description: Govern API clients, API test infrastructure, resource lifecycle, and API/UI workflows in this Playwright project. Use when designing, reviewing, or implementing API utilities, API fixtures, route mocks, or API-backed test data.
---

# API architecture and setup/teardown

This Skill governs API architecture and API test lifecycle when the repository introduces API code or API-backed tests. It may be registered before an API layer exists. Its presence does not imply that `src/api/`, an API alias, API dependencies, or API tests exist. Inspect the actual project before applying its guidance.

## Preferred architecture when justified

Use this structure as a starting point when a real API layer is needed:

```text
src/api/
  client/ApiClient.ts
  endpoints/<resource>.endpoints.ts
  models/<resource>.model.ts
  controllers/<resource>.controller.ts
  mocks/<resource>.mock.ts
```

| Layer | Responsibility |
|---|---|
| `client/ApiClient.ts` | Shared direct HTTP operations and request behavior |
| `endpoints/` | Endpoint constants and path builders |
| `models/` | Request and response TypeScript types |
| `controllers/` | Resource operations and meaningful business workflows |
| `mocks/` | Reusable route interception and mock responses |

Adapt the structure to established repository conventions if API code already exists. Add only layers justified by real usage; do not create empty folders or placeholder modules. Do not add API dependencies or implement an API layer unless requested.

## Ownership boundaries

- `test-standards` owns general Playwright fixture conventions, test data, credentials, and environment hygiene. This Skill owns API-specific client/controller injection and lifecycle semantics; coordinate changes to shared fixture conventions rather than duplicating them.
- `spec-quality-lifecycle` owns scenario-level internal test quality and independence. This Skill owns API resource setup/teardown mechanics and API/UI hybrid infrastructure.
- `spec-standards` owns spec names, IDs, hierarchy, and `test.step()` conventions.
- `pom-architect` owns Page Object and component architecture. API code must not be placed in Page Objects.
- `code-conventions` owns general TypeScript language and maintainability rules.
- `automation-architect` coordinates cross-cutting architecture and invokes this Skill for API concerns.

Read applicable owner Skills and inspect existing fixtures, environment configuration, authentication, and module resolution before proposing changes. Do not assume `@api/*` or any API alias exists. Add or change an alias only when required, with explicit review of TypeScript and runtime resolution.

## Rules

### R1 - CENTRALIZED_HTTP_CLIENT

Use a shared `ApiClient` as the central abstraction for direct API requests when shared behavior exists. Inject it into controllers. Avoid scattering direct HTTP calls across controllers, Page Objects, and specs. Do not wrap every Playwright request API method unnecessarily; preserve useful Playwright capabilities and response metadata.

### R2 - CENTRALIZED_ENDPOINTS

Keep endpoint paths and URL construction in an endpoint layer when multiple consumers or meaningful endpoint groups justify it. Avoid duplicating endpoint strings across tests and controllers. A single constant does not automatically justify a new module.

### R3 - CONTROLLER_DEPENDENCY

Controllers receive the API client through dependency injection. They must not independently instantiate browser contexts, request contexts, or authentication infrastructure. Keep controllers focused on resource operations and meaningful workflows.

### R4 - FIXTURE_OWNERSHIP

Inject shared API clients, controllers, and test resources through Playwright fixtures. Specs should not instantiate complex API infrastructure directly. Follow current `src/fixtures/` patterns and avoid fixture abstractions for trivial one-off operations without a clear benefit.

### R5 - SETUP_TEARDOWN_SYMMETRY

Fixtures that create or mutate persistent test data need an appropriate cleanup strategy. Use Playwright fixture lifecycle so cleanup runs after the test:

```typescript
resource: async ({ dependencies }, use) => {
  const resource = await createResource();

  await use(resource);

  await deleteResource(resource.id);
},
```

Account for setup failures and partially created resources. Use `try/finally` when needed to guarantee cleanup. Cleanup errors must not silently hide the original test failure. Do not add cleanup if an existing owner fixture already handles the lifecycle.

### R6 - TEST_DATA_ISOLATION

Use unique or isolated data where parallel execution could cause collisions. Avoid shared mutable resources unless a test explicitly validates shared behavior. Never rely on cleanup from another test.

### R7 - RESPONSE_VALIDATION

Make response handling explicit. Validate expected status codes or successful response states at the appropriate layer. Do not treat every non-2xx response as unexpected; negative-response tests may expect 4xx or other statuses. Preserve status, headers, and useful error or response-body information needed for diagnostics.

### R8 - MOCK_CENTRALIZATION

Use reusable mock factories when route interception is shared across tests. Use `page.route()` through the established fixture or mock architecture. Do not centralize one trivial mock without a reuse or consistency benefit. Mocks must represent the expected response contract.

### R9 - AUTHENTICATION_LIFECYCLE

Understand the application's authentication model before implementing token handling. Refresh a token during teardown only when the provider invalidates the earlier token after UI login or another relevant operation. Do not assume single-active-token behavior. Never hardcode tokens, credentials, or secrets; follow existing environment and credential conventions.

### R10 - API_UI_HYBRID_TESTS

For an API setup plus UI verification workflow, prepare data through the API when appropriate, inject required resources through fixtures, perform UI behavior through Page Objects, verify the result through assertions in the spec, and clean up persistent data through the applicable lifecycle. Keep API setup and teardown implementation out of the spec body.

### R11 - SAFE_CLEANUP

Limit cleanup to resources created or explicitly owned by the test. Never delete unrelated user or shared environment data. Do not run destructive cleanup against staging or production without explicit authorization and a verified environment policy.

## Fixture names

Prefer names that communicate resource or lifecycle intent, adapted to repository conventions:

| Purpose | Example |
|---|---|
| Resource controller | `bookController` |
| Resource created for test | `createdBook` |
| Clean initial state with cleanup | `cleanBookshelf` |
| Reusable route mock | `mockBooks` |

## Invocation modes

### Review (default, read-only)

Inspect existing API architecture, fixture wiring, resource lifecycle, endpoint management, authentication, mocks, and applicable API/UI workflows. Report confirmed findings with exact relative paths and line numbers, plus a recommendation and the owning Skill. Separate mandatory violations from recommendations. Do not modify files in Review mode.

### Implement

Implement API infrastructure only when explicitly requested. Before changing API modules, confirm the target API and contract, inspect environment and authentication, identify resources and operations, establish setup/teardown needs, and determine whether an alias or dependency is actually required. Preserve existing UI automation behavior. Validate changes with the relevant typecheck and tests when feasible, and report exactly what ran.

## Finding format

```text
[api-setup-teardown] SEVERITY - RULE_NAME
File: <relative path>
Line: <line number or N/A>
Issue: <observed issue and impact>
Recommendation: <smallest evidence-based correction>
Owner: <api-setup-teardown or responsible Skill>
```

Use `ERROR` for correctness, isolation, or unsafe cleanup risks; `WARNING` for resilience or maintainability concerns; and `INFO` for optional improvements. Do not claim a clean audit unless every applicable rule was evaluated. If no API code or API tests exist, report that the API-specific implementation audit is not applicable rather than treating the absence as a violation.
