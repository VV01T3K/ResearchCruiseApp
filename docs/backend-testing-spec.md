# Backend testing and .NET tooling specification

Status: proposed implementation baseline. Prepared 2026-09-18; refreshed against `origin/staging` at `6eb9166f` after fetching the latest changes. This document specifies future work; it does not certify the existing tests or CI. “Must” identifies an acceptance requirement; performance budgets are initial targets to measure.

## 1. Objective and scope

Build a trustworthy, maintainable backend test suite that catches broken business rules, authorization, API contracts, persistence, and deployment prerequisites. Start from requirements and observable behavior. Existing tests are unverified candidates, not the source of expected results or proof of coverage.

Keep the implementation small: one application project, two test projects, one SQL Server fixture, ordinary assertions, and one reusable validation workflow. Organize solution and tooling files using the layout below; keep application code organization unchanged. No architecture rewrite, repository layer added for mocking, mandatory test-first process, paid testing service, or coverage percentage target is required.

This spec covers backend solution/tooling layout, tests, C# tooling, unified frontend/backend commands, reproducible builds, and CI integration. Slow browser workflows must be separate from the everyday check and staging gate. Load testing, mutation testing, architecture-test libraries, API snapshot frameworks, and a Windows/Linux CI matrix are deferred until a concrete need justifies them.

## 2. Repository findings

These are observations from source inspection, not results from executing the suite.

| Area | Current state | Required response |
| --- | --- | --- |
| Runtime | Application and tests target `net10.0`; EF/Identity and `dotnet-ef` are now `10.0.12`, while some ASP.NET packages remain `10.0.5`. | Keep .NET 10; align compatible servicing versions during tooling implementation. |
| Application | Minimal API feature folders under `Api`, EF Core and Identity, SQL Server. Routes start at `/v2`. | Organize tests by feature and exercise real HTTP composition. |
| Database | Compose uses SQL Server 2022; migrations contain SQL Server-specific SQL. | Use the same engine and major version in integration tests. |
| Existing tests | One xUnit v2 project; auth factory uses SQLite and `EnsureCreatedAsync`; other tests use EF InMemory. | Independently review each scenario; these providers cannot establish SQL Server correctness. |
| Initialization | `Testing` bypasses startup database initialization; normal initialization calls `MigrateAsync`. | The fixture must explicitly migrate and seed. Add a separate normal-startup check. |
| Formatting/analysis | CSharpier and `dotnet-ef` are local tools. Built-in analyzers and warning-as-error checks exist, with application-wide suppressions. | Retain useful tooling; consolidate configuration and review suppressions. |
| Reproducibility | No tracked `global.json`, NuGet lock files, or shared MSBuild properties. SDK selection floats in mise, Actions, and Docker. | Pin and align the SDK; lock package restore. |
| CI | `format-and-lint.yaml` runs on push, uses Vite+ for .NET commands, and has no test artifact publishing. | Run a .NET-native backend gate on pull requests and publish diagnostics. |
| Deployment | Both image workflows can publish independently of backend checks; staging webhook depends only on its image build. | Require the backend gate before image publication/deployment for the same revision. |
| Permissions | `docs/permissions.md` includes older route names. | Reconcile intended permissions with current `/v2` routes before encoding assertions. |
| Recent changes | Durable email outbox and `IEmailTransport`, SMTP startup validation, keyset pagination, and migration-serialized reference/account seeding are now present. | Include their behavior in the new baseline; newly added tests remain unverified too. |

Relevant starting points: [application project](../backend/ResearchCruiseApp/ResearchCruiseApp.csproj), [existing factory](../backend/ResearchCruiseApp.Tests/AuthWebApplicationFactory.cs), [backend commands](../backend/package.json), [current checks](../.github/workflows/format-and-lint.yaml), and [staging workflow](../.github/workflows/deploy-komodo-staging.yaml).

### Recommended solution and tooling layout

This review concerns files around the C# projects: the solution, tool manifests, shared build settings, editor configuration, and workspace integration. Application folders such as `Api`, `Domain`, and `Infrastructure` remain outside this change. No feature-folder rename or application architecture refactor is proposed.

Keep `backend` as the .NET workspace and retain the current application project path. For one application and two test projects, flat sibling project directories are sufficient; adding `src/` and `tests/` layers now mostly creates path churn. Use one solution containing the application and both trusted test projects.

```text
repository/
  package.json                       # public vpr check/fix/lint interface
  pnpm-workspace.yaml                # frontend/backend workspaces
  mise.toml                          # environment installation; align with SDK pin
  .github/workflows/                 # shared workspace validation and deployment
  .vscode/                           # optional shared editor integration
  .devcontainer/                     # reproducible optional dev environment
  backend/
    ResearchCruiseApp.slnx            # one authoritative .NET solution
    global.json                      # SDK and test runner selection
    Directory.Build.props            # shared compiler/analyzer/restore policy
    .editorconfig                    # shared C# diagnostics and editor conventions
    .config/dotnet-tools.json         # pinned CSharpier and dotnet-ef tools
    package.json                     # .NET tasks exposed to the root task graph
    Dockerfile                       # one authoritative backend image definition
    .dockerignore
    ResearchCruiseApp/               # existing application path
      ResearchCruiseApp.csproj
      packages.lock.json
    ResearchCruiseApp.UnitTests/
      ResearchCruiseApp.UnitTests.csproj
      packages.lock.json
    ResearchCruiseApp.IntegrationTests/
      ResearchCruiseApp.IntegrationTests.csproj
      packages.lock.json
    artifacts/                       # ignored test reports/temporary generation
```

| File or concern | Decision and purpose |
| --- | --- |
| `.config/dotnet-tools.json` | Keep its standard location under `backend`; it is the .NET local tool manifest, not arbitrary clutter. Tool restore and commands run with `backend` as working directory so discovery is consistent. Keep `isRoot: true`. |
| `.sln` versus `.slnx` | Convert to `ResearchCruiseApp.slnx` during tooling implementation using `dotnet sln ResearchCruiseApp.sln migrate`. .NET 10 defaults to this simpler XML format. Verify CLI and supported IDE discovery, then remove the old `.sln`; do not maintain two competing solutions. |
| Shared MSBuild settings | Use one `Directory.Build.props` for settings common to app/tests. Keep app-only properties and package references in their projects. Add `Directory.Build.targets` only if a real shared target needs it, not as an empty template file. |
| Package configuration | Keep versioned references and per-project lock files initially. No `Directory.Packages.props` or extra `NuGet.Config` without a demonstrated need. Three projects do not require centralized package management. |
| SDK versus tools | `global.json` chooses the SDK/MTP runner; `.config/dotnet-tools.json` pins CLI tools. They serve different purposes. Mise and CI install the SDK selected by the former; do not introduce another independent SDK version policy. |
| `ResearchCruiseApp.sln.DotSettings` | Existing file contains a JetBrains nullable-fix preference and dictionary word. Review whether the team uses these, migrate needed settings alongside the new solution if supported, or remove the unused file. Build/format behavior belongs in portable settings, not an IDE-specific file. |
| Dockerfiles | Current workflows use `backend/Dockerfile`; a second file exists inside the application directory. Check all callers and IDE references, consolidate on the backend-root file, and remove the duplicate only after confirming it is unused. |
| Editor/generated files | Commit useful shared editor settings only. Ignore personal `.DotSettings.user`, `.vs`, `bin`, `obj`, and artifacts. Point editor solution discovery at the sole `.slnx`; do not require an IDE to run checks. |
| Root commands | Keep Vite+ as the single developer entry point; backend package tasks delegate to native .NET commands. Support Ubuntu WSL locally and Linux in CI; Bash scripts are acceptable. Native Windows/PowerShell support is outside the baseline. Avoid a second competing build orchestrator. |

Update solution references in package scripts, CI, mise, editor settings, documentation, and any Docker/devcontainer steps together. Check `dotnet sln ... list`, restore/build, test discovery, EF commands, and root command dispatch after the change. This spec uses `.slnx` in target commands; repository findings still describe the currently checked-in `.sln`.

References: Microsoft's [.NET local tools](https://learn.microsoft.com/en-us/dotnet/core/tools/global-tools), [.NET 10 solution format default](https://learn.microsoft.com/en-us/dotnet/core/compatibility/sdk/10.0/dotnet-new-sln-slnx-default), and [solution migration](https://devblogs.microsoft.com/dotnet/introducing-slnx-support-dotnet-cli/).

## 3. Testing approach and sources

Milan Jovanović's [Testing Vertical Slices in .NET](https://milanjovanovic.tech/blog/testing-vertical-slices-dotnet) is a useful fit: organize by feature, test pure rules directly, and test complete HTTP flows with `WebApplicationFactory` and Testcontainers. Use test doubles for external services. We adopt those ideas without importing a new application architecture or every library from an example.

One deliberate difference: the article also demonstrates handler tests with EF InMemory. For this application, database-dependent behavior belongs in SQL Server integration tests. Microsoft's [EF Core testing guidance](https://learn.microsoft.com/en-us/ef/core/testing/choosing-a-testing-strategy) explains why SQLite, mocked queries, and InMemory do not reproduce the production provider. Pure rule tests need no database.

### Test projects

```text
backend/
  ResearchCruiseApp/
  ResearchCruiseApp.UnitTests/
    Applications/       # validators, scoring, decision rules
    Cruises/            # lifecycle, dates, blockade rules
    Users/              # pure permission rules
    Infrastructure/     # custom file/CSV/formatting logic
  ResearchCruiseApp.IntegrationTests/
    Infrastructure/     # factory, SQL fixture, data setup, external fakes
    Auth/
    Users/
    Applications/
    Cruises/
    Persistence/        # migration and database-specific scenarios
```

Both projects reference the application and belong to the existing solution. Unit tests run without Docker. Integration tests include API and focused persistence tests; a third “functional” project is unnecessary. Update `InternalsVisibleTo` only for the new assemblies that actually need internal rule access.

### Test-writing standards

- Name tests `Behavior_WhenCondition_ExpectedOutcome`; use Arrange–Act–Assert and explicit expected values.
- Each test proves one coherent behavior. Multiple assertions can verify its response, stored state, and external effect.
- Use theories for meaningful boundary cases. Do not enumerate every field combination or duplicate the same rule at every level.
- Prefer public behavior. Do not assert private method calls, EF invocation counts, or an exact internal implementation.
- Use small explicit builders with valid defaults. Show scenario-relevant values in the test; avoid giant shared seed datasets and random fake data.
- Make requests through HTTP for routing, authorization, binding, validation filters, and serialization. Direct validator tests alone do not prove HTTP contracts.
- Assert specific statuses, relevant JSON fields, headers, and persistence. For rejected writes, also assert that no business state or email changed. Disable automatic redirects where they could hide failures.
- Read stored results through a new DI scope/DbContext to avoid assertions passing on tracked, uncommitted objects.
- Use fixed dates and independent actors/records. Introduce `TimeProvider` where time affects a rule; do not wait for token expiry or midnight. Do not replace cryptographic randomness with insecure production behavior.
- No sleeps, test ordering dependencies, automatic retries, or passing by catching setup errors. Container readiness polling is bounded infrastructure setup, not a test retry.
- A bug fix gets a regression test that fails against the faulty behavior. New tests must have an understandable failure condition; manually demonstrate this for representative critical rules without introducing a mutation-testing platform.

## 4. Tooling decisions

These are project choices. Select compatible stable package versions in the first implementation change, commit the exact versions and lock files, and record the tested SDK/package combination there. Do not copy old blog package versions or use previews.

| Concern | Decision |
| --- | --- |
| .NET/C# | Stay on .NET 10 LTS and its default C# 14 language version. No `LangVersion=latest` or preview features. .NET 10 is supported through November 2028. |
| SDK | Add `backend/global.json` with an exact serviced .NET 10 SDK, `rollForward: disable`, and `allowPrerelease: false`. Add MTP runner selection only at the section 9 cutover. Run backend commands from `backend`. Align mise, CI, devcontainer, and the Docker SDK image with this selection. |
| Test framework | xUnit.net v3 with its MTP v2 package (`xunit.v3.mtp-v2`), using executable test projects. Use a stable compatible release; the framework name “v3” does not require a NuGet major version of 3. |
| Runner | Final state: native Microsoft Testing Platform through .NET 10 `dotnet test` for both trusted projects. During migration, preserve the separate legacy invocation in section 9 and defer global MTP selection until its cutover criteria are met. Do not carry `Microsoft.NET.Test.Sdk` or the VSTest adapter into new projects unless an explicitly supported IDE proves it needs them. |
| Assertions | Built-in xUnit assertions. No additional assertion library by default. |
| HTTP tests | `Microsoft.AspNetCore.Mvc.Testing`, aligned with the application framework packages. |
| Database | `Testcontainers.MsSql`, SQL Server 2022 with a pinned image tag/digest, and `Respawn` for resetting test data. Record collation and compatibility level, and match deployment configuration. |
| External doubles | Small handwritten fakes at external boundaries. Add a mocking library only when a specific test benefits. |
| Reports | `Microsoft.Testing.Extensions.TrxReport` and `Microsoft.Testing.Extensions.CodeCoverage`, compatible with the selected MTP version. TRX plus Cobertura; no simultaneous Coverlet/VSTest collector setup. |
| Formatting | Keep CSharpier as the sole C# formatter and pin it in the existing local tool manifest. |
| Analysis | Keep SDK analyzers plus xUnit analyzers. Share nullable, implicit usings, and a fixed .NET 10 recommended analysis level in `backend/Directory.Build.props`. Keep CI warning-as-error behavior. |
| Editor policy | Add `backend/.editorconfig` for agreed naming and diagnostic severity. Avoid competing formatting enforcement against CSharpier. Scope generated-code treatment narrowly. |
| Dependencies | Keep explicit package references initially; three projects do not require central package management. Enable and commit `packages.lock.json` for all active projects; CI restores in locked mode. |
| Maintenance | Extend the existing Renovate configuration to cover the SDK, tool manifest, images, and related packages. Group compatible EF/runtime updates; review migration effects. Keep NuGet security auditing enabled. |

Review existing broad `NoWarn` entries one diagnostic at a time. Fix actionable findings or narrow and explain exceptions; do not add a large analyzer pack or suppress all warnings to make the baseline green. Audit design-time/scaffolding and direct NuGet dependencies before removing any; this is a targeted cleanup, not a prerequisite application rewrite.

The Docker restore layer must copy `global.json`, shared MSBuild files, the app project, and its lock file before locked restore. Otherwise host and container builds can silently use different settings. Keep the runtime image serviced as well. Developer IDEs must support the pinned SDK and MTP discovery; CLI execution remains the baseline, with one documented IDE smoke check.

References: [.NET support](https://dotnet.microsoft.com/en-us/platform/support/policy), [SDK selection](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json), [xUnit MTP setup](https://xunit.net/docs/getting-started/v3/microsoft-testing-platform), [NuGet locking](https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files#locking-dependencies), [MTP coverage](https://learn.microsoft.com/en-us/dotnet/core/testing/microsoft-testing-platform-code-coverage).

## 5. Integration fixture contract

Use one SQL Server container per integration test process, one uniquely named database, and one shared xUnit collection. Database tests in that collection run sequentially initially. Unit tests may run in parallel. Parallel database tests require separate databases later; they must never reset each other's state.

The fixture must:

1. Start SQL Server with a bounded readiness check, random host port, ephemeral credentials, and no shared development volume. Docker absence or startup failure fails integration execution clearly; it never skips the suite.
2. Create the test database and apply the real EF migration chain using `MigrateAsync`. Do not use `EnsureCreated`, manually mark migrations applied, or swap database providers. If historical migrations fail on an empty database, resolve that explicitly before claiming a working fixture.
3. Configure `WebApplicationFactory<Program>` with environment `Testing` and explicit test configuration. Set the container connection string before application service registration; remove/reconfigure conflicting DbContext options if necessary. Assert that the resolved provider is SQL Server and the database is the fixture-owned database before destructive reset operations.
4. Reset business and Identity data before each test with Respawn, preserving `__EFMigrationsHistory`. Recreate only the required reference rows and roles, then the scenario's users through Identity APIs. Do not call the development seed command or depend on its credentials. Reset fakes and dispose request scopes between tests. Demonstrate isolation with two scenarios run independently and in either order, including a failed-write scenario followed by a clean read.
5. Keep real routes, validation, authorization, Identity, JWT validation, EF mappings, and transaction filters. Supply test issuer/audience/signing configuration. Normal feature tests may mint signed tokens for seeded users; authentication tests must obtain tokens through the real login endpoint.
6. Replace the existing `IEmailTransport` with a capturing test adapter and keep Sentry DSN empty by default. Retain real message/template generation, outbox persistence, and payload protection. Disable automatic `EmailOutboxWorker` polling in ordinary HTTP tests and invoke the dispatcher explicitly in delivery tests, using a controlled `TimeProvider` for retries/leases. Requests are expected to queue messages durably, not synchronously deliver them. Use isolated Data Protection keys/configuration and explicit test SMTP options; add a separate normal-startup validation scenario. Do not add another email abstraction or wait for the real worker's five-second polling interval.
7. Isolate in-process state too. Use a fresh host for auth/rate-limit scenarios so one test's limiter does not cause another to return 429. Preserve production rate-limit behavior in dedicated tests. Database reset alone is insufficient.
8. Dispose clients, hosts, SQL connections, and the container on completion/failure. Capture useful container and application logs on failure, without tokens, passwords, or real user data.

Use HTTPS client addresses where cookie behavior depends on secure requests. Cookie header assertions in TestServer do not prove browser SameSite enforcement or reverse-proxy TLS behavior; retain targeted browser/deployed smoke coverage for those boundaries.

SQL Server Linux containers require a compatible Docker host. Windows developers use Linux containers; an unsupported ARM machine may run against a dedicated disposable x64 Docker host. Never silently substitute SQLite. CI uses a hosted Linux x64 runner with Docker.

Implementation references: [ASP.NET Core integration testing](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-10.0), [SQL Server Testcontainers](https://dotnet.testcontainers.org/modules/mssql/), and [Respawn](https://github.com/jbogard/Respawn).

## 6. Required behavioral coverage

Before implementing each feature's tests, record its method/route, actors, initial state, input, expected status/body, final state, and external effects. Reconcile disagreements between requirements, [permissions documentation](permissions.md), OpenAPI, and implementation. An existing implementation or test is not automatically correct; unresolved business policy must be identified rather than frozen into a regression assertion.

P0 is the trustworthy core; P1 completes the first baseline. These are requirements to implement, not claims of current coverage.

The concrete deliverable is [backend-test-scenarios.md](backend-test-scenarios.md). Give each executable scenario a stable `BE-<AREA>-NNN` ID, recorded beside its test (a comment is sufficient). Each entry must identify priority, requirement/source revision, method/route or non-HTTP operation, actor, initial state, input/action, exact observable outcomes, implementation/test location, and review evidence. Split feature-level entries before implementing them; do not mark an entire feature covered after one happy path.

Track policy separately from implementation: `needs-decision` scenarios cannot become accepted regression tests until the product owner/maintainer records the expected behavior and rationale. Observations of current code and temporary characterization tests may inform the decision, but do not resolve it. A blocked scenario prevents completion of its affected coverage milestone, not unrelated foundation work. Never encode an unresolved policy as a passing/skipped placeholder. The ledger starts with explicit open decisions for repeated supervisor decisions, multi-role precedence, and concurrent numbering/writes; foundation can proceed on independently specified behavior.

| Priority / area | Required scenarios | Main level |
| --- | --- | --- |
| P0: authentication | Accepted/confirmed login succeeds; invalid credentials and unaccepted/unconfirmed accounts fail; refresh rotates and rejects replay/expired/invalid tokens; logout revokes refresh; invalid issuer/audience/signature and expired access tokens fail; verify refresh cookie security attributes and that token storage is hashed. | HTTP + SQL |
| P0: authorization | For protected operation families: anonymous, allowed role, forbidden role, owner/deputy, and unrelated user. Verify list filtering and object access, user-role escalation limits, draft visibility, and no changes after denied writes. Include multi-role precedence where it matters. | Rule unit tests + representative HTTP matrix |
| P0: application forms | A/B/C create/update and retrieval; incomplete drafts versus final validation; missing/null keys; strict numeric/enum binding; nested validation paths; unauthorized edits; submit/refill/decision transitions. Verify persisted child collections and removed/replaced files, not only status codes. | Unit boundaries + HTTP + SQL |
| P0: supervisor review | Correct application/code succeeds; wrong, missing, or stale code and repeated decisions have explicit expected behavior; accepted/rejected decisions change only the intended application; check email effect. | HTTP + SQL |
| P0: cruise lifecycle | Planning/assignment, confirm/revert/end, valid and invalid status transitions, date/blockade boundaries, access rules, and persisted effects on associated applications. | Rule units + HTTP + SQL |
| P0: atomic writes | A failure after a write has begun leaves no partial graph; a business-error result also leaves state unchanged. Verify numbering/uniqueness on representative competing writes where required. Do not promise concurrency behavior without an agreed invariant. | SQL + HTTP |
| P0: durable email | State change and queued message commit together; queue failure rolls back; SMTP failure leaves a retryable message; claiming prevents simultaneous delivery attempts. Verify retry/lease expiry and recovery with controlled time, without implying exactly-once SMTP delivery. Sensitive payloads remain protected. | SQL + explicit dispatcher, fake transport |
| P0: email after host replacement (`BE-EMAIL-001`) | Host A queues a protected message and is fully disposed. Independently constructed host B loads persisted Data Protection keys from the same SQL database, decrypts and delivers that message, then removes the acknowledged row. No shared provider, cached key ring, or ephemeral key store may satisfy this test. | SQL + two independent hosts, fake transport |
| P0: migrations | Empty database migrates to current; applying again succeeds without changes; no pending model changes; a representative Identity/application/cruise graph can be written and read. | SQL |
| P1: account workflows | Registration, acceptance/deactivation, role changes, password reset/change, email confirmation; malformed, expired, or reused action tokens where applicable. | HTTP + SQL, captured email |
| P1: files and exports | Upload/scan size and type boundaries, invalid encoding/content, authorized retrieval/deletion, CSV escaping and Polish text/date handling. Small fixtures stored with tests. | Unit + representative HTTP |
| P1: calculations and reads | Scoring boundaries, year-based numbers, date ranges, search/filter/order behavior, duplicate names and SQL collation-sensitive queries. | Unit rules / SQL queries |
| P1: catalog pagination | Stable keyset order with ties, next-page boundaries, filters combined with permission visibility, malformed/mismatched cursors, and the cruise-planning candidate contract. | HTTP + SQL |
| P1: startup and seeding | Invalid SMTP configuration fails before migration/seeding work; reference data is always repaired, account seeding obeys `SeedAccountsAutomatically`, repeated runs are idempotent, and competing initializers serialize without duplicate rows. | Focused SQL/startup checks |
| P1: infrastructure behavior | 429 contract; stable ProblemDetails without exception leakage; health/version endpoints; Sentry disabled startup; expected telemetry using a fake transport; initializer/seeding idempotency. | HTTP / focused integration |
| P1: schema upgrade | Migrate a database at the previous supported release to current with representative synthetic existing rows; verify data preservation, including contract/file transformations when affected. | Isolated SQL database |

For migration-upgrade tests, use a separate database from the shared current-schema fixture. Record the baseline migration ID from the supported release. Do not rewrite applied migration history merely to simplify tests. Coverage of the empty-database path does not prove upgrades preserve data.

The transaction filter currently commits after receiving an endpoint result. Tests must distinguish exceptions from returned error results; neither a transaction wrapper nor an HTTP error alone proves rollback.

Use the current [email delivery contract](email-delivery.md) and [SMTP configuration notes](smtp-configuration.md) when specifying outbox/startup expectations. The new legacy tests covering these areas must undergo the same independent review as older tests.

For `BE-EMAIL-001`, use production Data Protection registration/application name and retain the database/key rows between hosts. Remove only automatic worker polling, supply valid isolated SMTP options, and replace transport. Assert a key was persisted and the queued payload is protected before disposing host A; discard every host-owned scope/provider/protector before creating B. B must retrieve the original queued recipient/subject/body using a new provider, deliver once in this controlled scenario, and leave no acknowledged message in a fresh query. This asserts recovery, not exactly-once SMTP semantics. The fixture resets once before and once after the complete scenario, never between hosts. Demonstrate the test fails when B cannot access A's persisted key material, with no fallback to user-profile keys.

## 7. Unified local command contract

The supported developer interface is the repository root using `vpr` (shorthand for `vp run`). Working across frontend/backend must not require changing directories. These are future contracts; this specification does not yet modify package scripts.

| Root command | Required behavior |
| --- | --- |
| `vpr check` | Formatting, lint/analyzers, compilation/types, generated API consistency, frontend unit tests, and **all baseline backend unit/integration tests**. No Playwright, browser installation, image builds, or coverage instrumentation. Requires Docker for SQL tests. |
| `vpr lint` | Read-only formatting/lint/analyzer/type checks for both packages. Backend compilation may be needed for analyzers. No tests, SQL container, or browser. |
| `vpr fix` | Apply supported formatting/lint fixes across both packages, regenerate OpenAPI/client output in order, then perform the same validation as `check`. Fail on remaining errors. Never cache a mutating task. |
| `vpr check:quick` | Explicit Docker-free iteration: both packages' static checks and unit tests, without generated-contract verification or backend integration tests. Label the result as partial; it is not the CI gate. |
| `vpr test:e2e` | Explicit existing frontend browser suite, separate from everyday checks and staging gating. |
| `vpr test:coverage` | Backend baseline suite with coverage enabled, for periodic inspection and CI reporting. |

`check` validates both sides at the stated levels; it does not claim browser end-to-end coverage. `lint` checks static quality only; `fix` finishes by checking the corrected workspace. Missing Docker must fail clearly, not silently omit integration tests. Point developers to the explicitly partial `check:quick` option when appropriate.

Use a small root task graph with named package tasks. Preserve `vp run -F backend ...` and `vp run -F frontend ...` for focused work. Bare `vp check` is Vite+'s built-in command, not the repository-wide contract. Root commands are first-class supported workflows, not optional wrappers.

Encode the seam explicitly: backend build/OpenAPI generation -> contract comparison or client generation -> frontend type/lint checks and unit tests. Recursive package execution cannot be assumed to discover Orval's file dependency. Backend tests can run alongside frontend validation after generation. Build once per configuration and reuse output for tests.

`check` must not overwrite a developer's generated files to inspect drift: generate into temporary output and compare with working-tree OpenAPI/client files, then clean up. Intentional regenerated but uncommitted changes must pass. `fix` writes generated files in order. Verify Orval output paths and cleanup cannot escape the temporary directory in check mode. CI also verifies the committed generated files are current.

Remove blanket `--cache` from current root `check` and `fix` orchestration. Initially rely on incremental compilation and package-download caches; execute tests on every check. Cache read-only static tasks only after .NET inputs, configuration, tool versions, and generated dependencies are tracked and invalidation is demonstrated. Do not force `--no-incremental` on every local check. No new task runner is needed.

Command reference: [Vite+ task execution](https://www.viteplus.dev/guide/run).

### Underlying .NET commands

After implementation, the following sequence must work from `backend` on a clean checkout with the pinned SDK and Docker. These are target commands, not commands supported by the current xUnit v2 setup. Install compatible TRX/coverage extensions in both projects and enable the MTP command-line runner in their configuration.

```sh
dotnet tool restore
dotnet restore ResearchCruiseApp.slnx --locked-mode -p:TreatWarningsAsErrors=true
dotnet csharpier check .
dotnet build ResearchCruiseApp.slnx -c Release --no-restore --warnaserror
dotnet test --project ResearchCruiseApp.UnitTests/ResearchCruiseApp.UnitTests.csproj -c Release --no-build --report-trx --results-directory artifacts/tests/unit
dotnet test --project ResearchCruiseApp.IntegrationTests/ResearchCruiseApp.IntegrationTests.csproj -c Release --no-build --report-trx --results-directory artifacts/tests/integration
```

Developers can run `dotnet test --project ResearchCruiseApp.UnitTests/ResearchCruiseApp.UnitTests.csproj` alone for a quick build-and-test loop without Docker. Document equivalent integration and single-test filtering commands verified with the pinned xUnit runner. Do not copy VSTest `--filter`, `--logger`, or `--collect` examples into MTP scripts without checking support.

Use these primitives inside the required root/package tasks, preserving exit codes. Direct .NET execution remains available for focused work. CI exercises the root command contract. Add `--coverage --coverage-output-format cobertura` only for the separate coverage task. `--no-build` is valid only after building the same configuration. Ignore local `artifacts`, `bin`, `obj`, and test results in Git.

Command reference: [.NET MTP CLI](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-test-mtp). Validate all options with the pinned .NET 10 toolchain; live documentation also describes later SDK features.

## 8. CI and deployment contract

Create `.github/workflows/workspace-ci.yaml` with `pull_request` targeting `main` and `staging`, and `workflow_call`. Use one stable required job/check name: **Workspace checks**, with separate frontend/backend results in its summary. The job runs root `vpr check`; it validates the command developers actually use. Do not path-filter this required PR workflow initially; documentation-only changes must still produce a terminal status. Add `merge_group` only if a merge queue is enabled.

Both image/deploy workflows call this workflow on their push events, including release tags. Image publication jobs must `need` its success; staging's webhook remains downstream of the gated image build. A success from another revision is insufficient. PR validation is owned by `workspace-ci`; push validation is owned by the image/deploy caller. Remove overlapping PR check invocations from the image workflows and do not add a standalone push check that repeats the same work. PR and merged-revision runs are expected because revisions can differ; duplicate runs for the same event are not. Avoid cross-workflow status polling.

CI must:

1. Check out the revision, install the SDK from `backend/global.json` and the existing Vite+/frontend toolchain, restore local tools, and restore locked dependencies. Cache package downloads by toolchain/lock-file inputs; do not cache test outcomes.
2. Run CSharpier and the Release solution build with warnings as errors. Keep dependency-audit warnings visible and blocking under this policy; any temporary exception must be scoped, explained, owned, and time-limited.
3. Run both backend test projects on Linux with Docker and frontend unit tests. Produce distinct backend TRX outputs without coverage instrumentation in the required gate. Fail on test/discovery/fixture errors, zero executed tests in either backend project, or unexpected skips. A minimum discovered-test count alone is insufficient because skipped tests may count; validate execution counts in reports.
4. Attempt both suites after a successful build even if the first fails, and preserve failure in the final job result. Do not use `continue-on-error` to turn a failed test gate green.
5. Upload reports and failure logs with `if: always()` and a modest retention such as 14 days. Missing expected reports after a test command ran must be surfaced as an error. Artifact publishing must not replace the actual failing exit code.
6. Preserve OpenAPI/client drift checks with the task order in section 7. Replace Debug-only OpenAPI generation with an explicit build property enabled on the check's Release build. Normal publish/test invocations must not regenerate it redundantly. Compare temporary output, including missing/untracked files. Avoid a second full backend build solely for generation.
7. Use `contents: read`, no deployment secrets, and an 8-minute workspace job timeout. PR/fork tests must need no shared SQL server, SMTP account, or Sentry credentials. Cancel superseded PR runs; do not let another workflow's concurrency group cancel a deployment's required invocation.

Replace the checks in `format-and-lint.yaml` with the shared workspace gate once equivalent coverage exists, avoiding repeated frontend/backend validation. Move frontend unit execution out of the browser workflow into this gate. Document and enable the matching required check in rules for both protected branches; YAML alone does not configure branch protection. Verify emitted check contexts because reusable calls can prefix job names. Preserve any distinct existing release checks outside this scope.

Run `vpr test:coverage` on a schedule and manual dispatch, separate from staging's critical path. Give browser E2E its own explicit/manual or scheduled execution; future release/browser smoke policy is separate. The user reports staging browser tests were disabled for speed, while the inspected `playwright.yaml` still declares staging triggers. Reconcile the effective workflow/rules during implementation instead of assuming checked-in YAML proves current enforcement. Do not re-enable a slow browser gate as part of this backend work.

### Performance is an acceptance requirement

The earlier 10-minute backend target is replaced by the provisional targets below. Foundation measurements must calibrate them before they become enforced suite budgets. Record runner/machine, cache state, suite size, and phase timings so warm reruns are not confused with cold checkouts. The job timeout remains an operational hang limit; it is not evidence that the performance target is realistic.

| Measurement | Initial budget |
| --- | --- |
| Backend unit execution after build | 5 seconds |
| Complete backend integration execution, including container startup, migrations and resets, with SQL image present | 60 seconds |
| Root `vpr check`, warm dependencies/image and incremental build, with fresh test execution | 90 seconds |
| Complete backend CI work, including restore/build/container startup | 3 minutes target; 5 minutes with cold downloads/image pull |
| Complete workspace CI check, excluding runner queue and deploy/image builds | 5 minutes target; 8-minute hard job timeout |

During foundation, benchmark a representative slice containing a real login/new auth host, an authorized form write/read and reset, outbox delivery across host replacement, concurrent startup seeding, and an upgrade from the previous supported schema. Also measure build/generation and frontend static/unit work. Measure at least five warm executions and three clean hosted runs; record commit, toolchain, machine/runner, test counts, median/slowest run, setup/reset/host costs, and slowest tests in the ledger's performance record. Separate fixed setup cost from per-scenario cost and estimate the remaining matrix with stated assumptions; a small slice's total cannot be presented as the full-suite benchmark.

Before enforcing the numbers, the maintainer records ratified budgets and rationale in that record. Until then, timings are diagnostic and an overrun is calibration evidence, not automatically an implementation defect. After the remaining P0/P1 cases exist, repeat the measurements for the full suite and confirm the ratified budgets or explicitly revise them with evidence. Investigate sustained regressions against that measured baseline. Root timings include frontend work and temporary legacy execution; report the latter separately. A timeout always fails the gate, never skips tests. Changing a budget cannot justify silently removing coverage or accepting a slow staging loop.

Keep tests fast by design: one container and migration setup per process, small resets, a shared host for stateless scenarios, fresh hosts only for process-state isolation, representative HTTP cases, and pure-rule permutations in unit tests. Keep the previous-supported-release upgrade check in the baseline; more historical paths need justification. No mandatory browser, SMTP, full Compose stack, coverage overhead, forced clean rebuild, sleeps, or retry multiplication in the everyday backend check.

If the suite exceeds budget, profile setup versus execution, remove duplicate coverage, and only then consider bounded parallelism with isolated databases. Do not move ordinary regression cases to nightly runs or disable staging tests to conceal slowness. No separate slow backend suite is introduced initially. Future stress/soak tests must be explicitly classified and must not displace baseline correctness checks.

CI acceptance evidence must include a successful clean PR run, a deliberately failing test blocking the gate, zero-test detection, failed container setup failing visibly, artifacts available after failure, and confirmation that image publishing/staging deployment cannot proceed after a failed gate. Test deployment gating without triggering a real deployment solely as an experiment.

Also verify root `check`, `lint`, and `fix` on Ubuntu WSL and Linux CI; an API contract change must reach frontend generation/type checks in the correct order. Prove failures from either package fail the root command, `fix` converges on a second run, `check` preserves working-tree files, and Docker absence cannot produce a green complete check. These are command acceptance checks, not a permanent multi-OS CI matrix.

Workflow reference: [GitHub reusable workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows).

## 9. Coverage and existing-test trust

Publish coverage as a diagnostic. Review uncovered business rules and branches; do not set an arbitrary global 80%/100% merge target. Exclude test assemblies and generated resource designers/model snapshots/migrations from percentage calculations, while testing migration behavior explicitly. Do not exclude authored infrastructure simply to improve the score. Separate project percentages must not be added together as if they were combined coverage.

During the spec phase, preserve all existing tests and CI. Their pass status does not establish the new baseline. During implementation:

1. Inventory each existing test against a requirement in section 6. Record `unreviewed`, `rewritten`, `retained after review`, or `retired`, with a reason and replacement location where relevant.
2. Build new tests from that requirement, independently of existing expected values. Useful pure-rule tests may be retained after checking their assertions and demonstrating that the relevant fault makes them fail.
3. Replace fake-provider persistence tests with SQL Server scenarios. Do not mechanically copy the current SQLite factory or production seed setup.
4. Preserve legacy execution until every removed test has a reviewed, passing replacement or an explicitly reviewed retirement reason (obsolete/incorrect assertion or duplication with identified coverage). Record this per test/theory case in the scenario ledger, with reviewer and evidence. An unfinished review is not grounds for removing a test from required execution, and “untrusted” does not mean its regression signal is disposable.
5. Default transition: defer `global.json` MTP runner selection, run the legacy v2 project explicitly through VSTest, and run the new v3 projects directly as MTP executables with `UseMicrosoftTestingPlatformRunner=true`. Do not invoke a mixed solution through `dotnet test`. Root `check` and required CI must run both invocations, keep reports/counts separate, and fail if either fails or unexpectedly discovers/executes zero tests. Label legacy results as unreviewed, not trusted coverage. Preserve the existing legacy gate until the combined gate is proven. Direct executable support is documented in the linked xUnit guidance; verify exact commands on the pinned SDK before cutover.
6. Switch the global runner, remove the legacy invocation/project from the solution, and update root/CI commands in the same change only after the complete legacy disposition ledger is reviewed and replacement execution is demonstrated on that revision. Include a deliberately failing legacy test before cutover and a failing replacement after cutover as evidence that both gates work. No intermediate revision may drop execution merely because replacement tests are scheduled for a later milestone.
7. Remove obsolete provider/runner dependencies and the legacy `InternalsVisibleTo` entry after that cutover. Git history preserves retired work. The temporary runner coexistence ends when its purpose is complete; it is not a third permanent suite.

A flaky test is a defect to diagnose. Any temporary quarantine needs an issue, owner, expiry, and a visible gap in the scenario ledger. Required P0 cases cannot be quarantined while claiming the baseline is complete.

## 10. Implementation order and completion criteria

| Step | Deliverable | Exit evidence |
| --- | --- | --- |
| 1. Requirements | Scenario ledger with stable IDs, explicit behavior, legacy inventory, and named policy decisions. | Foundation scenarios are specified; unresolved decisions block only affected scenario acceptance/milestones. |
| 2. Foundation | Solution/tooling layout, SDK pins without global runner cutover, two MTP projects, SQL fixture, existing email transport adapter, representative benchmark slice. | Real migrations/isolation and cross-host outbox recovery pass locally/Linux; foundation timings and full-suite estimate recorded; budgets ratified before enforcement. |
| 3. Commands and CI | Root check/fix/lint, combined legacy/new gate, reports, ordered generation, deployment dependencies, required-check configuration. | Positive/negative gate evidence; both runner invocations execute while review is incomplete; no zero-test green run. |
| 4. P0 coverage | Auth, permissions, forms, decisions, cruises, atomicity, durable email including host replacement, current-schema migrations. | Every P0 scenario has an accepted policy and reviewed tests; representative failures demonstrated. |
| 5. Baseline completion | P1 coverage, solution/tooling cleanup, legacy dispositions, dependency cleanup, local documentation. | All required scenarios implemented, no unexplained skips/flakes, clean checkout and repeat execution pass, root DX and timing budgets verified. |

Foundation completion is not full-suite completion. Keep changes reviewable by feature. Production changes are limited to a needed seam for testing or separately explained bug fixes; do not adjust assertions to bless a defect. Keep solution/tooling changes separate from behavior changes.

Runner cutover is a separate conditional checkpoint after all legacy dispositions/replacements are ready, even if some belong to P1. Do not force it into foundation or CI setup merely to finish the final tooling shape early.

The baseline is complete only after both test projects run reliably from a clean checkout, the CI/deployment gate is demonstrated, all P0/P1 requirements are accounted for, and the legacy review is finished. At that point, changes to business behavior must include the appropriate new or updated tests.

## 11. Validation of this specification

This document was checked against repository source/configuration and linked primary documentation. No backend tests, builds, migrations, or hosted Actions runs were executed as evidence for it. The `dotnet` installation available on PATH during preparation reported no installed SDKs. Implementation must supply actual .NET 10, Docker, and CI execution evidence; this spec does not assert that CI already passes.
