# Backend v2 Polish Plan

Created 2026-07-07. This is the single authoritative document for finishing the
backend v2 rewrite. It supersedes the retired `backend-rewrite-v2-*` docs (plan,
progress log, cutover checklist, deferred-decisions ledger); their history remains
available in git. Open product decisions from the old ledger are carried over at the
bottom of this document.

## Where The Rewrite Stands

Completed and verified against the current tree:

- v1 runtime fully retired: no MVC controllers, no MediatR, no AutoMapper, no
  `Application/UseCases`, no repository/unit-of-work layers on the live path.
- Feature-oriented minimal API under `Api/` with `Auth`, `Account`, `Users`,
  `Cruises`, and `Applications` groups, TypedResults, ProblemDetails, rate limiting
  on sensitive routes, and native OpenAPI + Scalar.
- Contract cleanups landed: stable machine status codes, body-based workflow
  commands, dedicated role endpoints, bundled supervisor review.
- `dotnet build` passes; all 27 backend tests pass.

Known defects and unfinished work:

- **Frontend route drift (blocking for merge, fixed last by design).** The
  post-cutover reorganization renamed live `/v2` routes backend-side only. The
  frontend still calls the old URLs, so login, registration, password flows,
  publications, cruise effects, and form init-values would 404 against a real
  backend. Playwright did not catch this because tests mock routes with the same
  stale URLs the hooks use. See the drift table below.
- **Mixed physical patterns.** Some slices follow the REPR folder shape
  (`Contracts.cs` / `Endpoints.cs` / `Validators.cs`), others are still single
  files.
- **False-shared folders.** Most of `Domain/Logic` and about half of
  `ApplicationForms/` have exactly one consumer and belong inside their slices.
- **Persistence vestiges.** `Infrastructure/Persistence/Repositories/Extensions`
  is a leftover of the repository era; entity configuration is split between data
  annotations and three fluent configuration classes.
- **Dependency warning.** `Microsoft.OpenApi` 2.0.0 has a known high-severity
  vulnerability (NU1903, GHSA-v5pm-xwqc-g5wc).
- `POST /v2/auth/resend-confirmation-email` has no frontend caller in the current
  source; verify intent during Phase 6.

## Architecture Conventions

These rules resolve the questions the reorganization raised. Apply them in every
phase; do not re-litigate them per file.

1. **Vertical slices with REPR.** Each slice is a folder
   `Api/<Feature>/<Slice>/` containing `Endpoints.cs` plus, as needed,
   `Contracts.cs`, `Validators.cs`, and `Rules.cs`. `<Feature>Endpoints.cs` at the
   feature root only composes its slices onto the route group.
2. **The sharing rule.** Code lives in its slice until a second slice needs it.
   Then it moves to the *narrowest* folder that covers all consumers, in this
   order: slice → feature `Shared/` (for example `Api/Applications/Shared`) → `Api`
   root → `Domain` / `Infrastructure`. Top-level placement claims app-wide
   relevance; it must be earned by actual consumers.
3. **No mandatory `Service.cs`.** Three tiers instead:
   - Pure decision logic (no I/O): a static `Rules.cs` inside the slice. No DI
     registration, testable without mocks.
   - Orchestration shared by two or more slices: a named service in the owning
     feature's `Shared/` folder (`FormReader`, `FormDeletionService` already follow
     this).
   - Single-slice orchestration: stays in `Endpoints.cs`, or splits into a
     co-located file (`Factory.cs`, `Workflow.cs`) purely when file size demands —
     a readability decision, not an architecture layer.
4. **The EF model stays whole.** `Domain/Entities` is one interconnected
   persistence model and remains shared. No per-slice entities, DbContexts, or
   migrations.
5. **Infrastructure holds plumbing only.** Email, files, exports, identity,
   localization, security, persistence. No route handling, no endpoint contracts,
   no feature workflow decisions.
6. **`Results/` stays top-level.** `Result`/`Error` are consumed by both `Api` and
   `Infrastructure`; they are genuinely cross-cutting.

## Route Drift Reference

What the frontend calls today versus what the backend serves today. The fix is
deliberately deferred to Phase 6 so the frontend is updated exactly once, against
the final route table frozen in Phase 5.

| Frontend calls | Backend serves |
| --- | --- |
| `POST /v2/account/login` | `POST /v2/auth/login` |
| `POST /v2/account/refresh` | `POST /v2/auth/refresh` |
| `POST /v2/account/register` | `POST /v2/auth/register` |
| `GET /v2/account/confirm-email` | `GET /v2/auth/confirm-email` |
| `POST /v2/account/password-reset-request` | `POST /v2/auth/password-reset-request` |
| `POST /v2/account/password-reset` | `POST /v2/auth/password-reset` |
| `PATCH /v2/account/me/password` | `PATCH /v2/auth/password` |
| `GET/POST/DELETE /v2/account/me/publications…` | same paths under `/v2/account/publications…` |
| `GET /v2/account/me/cruise-effects` | `GET /v2/account/cruise-effects` |
| `GET /v2/applications/form-a/init-values` | `GET /v2/applications/form-a/context` |
| `GET /v2/applications/form-b/init-values` | `GET /v2/applications/form-b/context` |

Unchanged and working: `GET /v2/account/me`, all `/v2/users…`, `/v2/cruises…`, and
the remaining `/v2/applications…` routes.

## Verification Baseline

Every phase runs, from the repo root:

- `vpr -F backend check` (csharpier formatting, matches CI)
- `dotnet build backend/ResearchCruiseApp.sln`
- `dotnet test backend/ResearchCruiseApp.sln`

The frontend is not touched until Phase 6. Phases 1–4 are pure file moves and must
keep the Phase 0 route-table guardrail green; only Phase 5 may change it, and only
deliberately.

---

## Phase 0 — Route-Table Guardrail

The route drift happened because nothing pins the wire contract. Before moving any
files, make route changes loud.

Steps:

1. Add a `WebApplicationFactory`-based test in `ResearchCruiseApp.Tests` that
   collects every mapped endpoint (method + route template) from
   `EndpointDataSource` and asserts the exact expected set — the full v2 table plus
   `/health` and `/version`. A route rename then fails the suite instead of
   silently breaking the frontend.
2. Optional but recommended: add `Microsoft.Extensions.ApiDescription.Server` so
   the build emits `openapi/v2.json`, and commit the artifact. Contract changes
   become visible diffs in every PR.

Exit criteria: the guardrail test fails on any route add/remove/rename; Phases 1–4
must finish with it untouched and green.

## Phase 1 — Dissolve `Domain/Logic` Into Slices

Five of six rule files have exactly one consumer. Move each next to it; keep the
pure-static shape (no DI).

| Current file | Destination |
| --- | --- |
| `Domain/Logic/ApplicationDecisionRules.cs` | `Api/Applications/ApplicationDecision/Rules.cs` |
| `Domain/Logic/SupervisorDecisionRules.cs` | `Api/Applications/SupervisorReview/Rules.cs` |
| `Domain/Logic/CruiseLifecycleRules.cs` | `Api/Cruises/Lifecycle/Rules.cs` (folder created in Phase 2; create it here) |
| `Domain/Logic/CruiseBlockadeRules.cs` | `Api/Applications/FormA/Rules.cs` (sole consumer; move to `Api/Cruises` later only if a cruise slice starts using it) |
| `Domain/Logic/RolePermissionRules.cs` | `Infrastructure/Identity/Permissions/RolePermissionRules.cs` (sole consumer is `UserPermissionVerifier`) |
| `Domain/Logic/WorkflowStatusCodes.cs` | `Api/WorkflowStatusCodes.cs` — genuinely shared, but it maps domain enums to *wire* codes, which is an API concern |

Also:

- Update namespaces and `DomainLogicTests.cs` usings; the tests themselves stay.
- Delete the empty `Domain/Logic` folder.

Exit criteria: `Domain/` contains only `Entities`, `Common` (flattened in
Phase 4), and no `Logic`; build, tests, and guardrail green.

## Phase 2 — REPR Convergence In `Api`

Promote the remaining single-file endpoint modules to slice folders so one
convention holds everywhere.

| Current file | Destination slice |
| --- | --- |
| `Api/Users/Acceptance.cs` | `Api/Users/Acceptance/Endpoints.cs` |
| `Api/Users/Roles.cs` | `Api/Users/Roles/Endpoints.cs` |
| `Api/Cruises/Export.cs` | `Api/Cruises/Export/{Endpoints,Contracts}.cs` |
| `Api/Cruises/Lifecycle.cs` | `Api/Cruises/Lifecycle/Endpoints.cs` (+ `Rules.cs` from Phase 1) |
| `Api/Applications/Applications.cs` | `Api/Applications/Catalog/{Endpoints,Contracts}.cs` (list + detail) |
| `Api/Applications/ApplicationEvaluation.cs` | `Api/Applications/Evaluation/Endpoints.cs` |
| `Api/Applications/CruisePlanningApplications.cs` | `Api/Applications/CruisePlanning/Endpoints.cs` |
| `Api/Applications/FormContext.cs` | `Api/Applications/FormContext/Endpoints.cs` |

Rules for the pass:

- Split inline request/response records into `Contracts.cs` when the slice gains a
  folder; keep tiny single-record slices to `Endpoints.cs` + `Contracts.cs` anyway
  for uniformity.
- Do not rename routes in this phase (guardrail stays green). Folder names may
  differ from route segments (`Catalog` serves `GET /v2/applications`).
- Optional naming cleanup while touching files: `ApplicationCruise` →
  `LinkedCruise` is allowed since it is folder-only; skip if it churns too much.

Exit criteria: every feature folder contains only slice folders plus its
`<Feature>Endpoints.cs` composition file.

## Phase 3 — Dissolve `ApplicationForms`

The top-level `ApplicationForms/` module is Applications-specific; top-level
placement overstates its scope. Split by actual consumers (dependency map verified
2026-07-07).

Single-consumer pieces move into their slices:

| Current file | Destination |
| --- | --- |
| `ApplicationForms/Writing/FormAFactory.cs` | `Api/Applications/FormA/` |
| `ApplicationForms/Writing/ApplicationFactory.cs` | `Api/Applications/FormA/` (only FormA creates applications) |
| `ApplicationForms/Writing/FormBFactory.cs` | `Api/Applications/FormB/` |
| `ApplicationForms/Writing/FormCFactory.cs` | `Api/Applications/FormC/` |
| `ApplicationForms/Writing/CruiseEffectService.cs` | `Api/Applications/FormC/` |
| `ApplicationForms/Reading/ApplicationReader.cs` | `Api/Applications/Catalog/` (sole consumer is the catalog slice) |

Genuinely shared remainder moves to `Api/Applications/Shared/`:

- `Reading/`: `FormReader` (FormA/B/C + SupervisorReview), `FormInitValuesReader`
  (FormContext + SupervisorReview), `ContractReader`, `FileReader`,
  `PermissionReader` (internal dependencies of the readers).
- `Writing/`: `FormDeletionService` (FormA/B/C), `SupervisorInvitationService`
  (FormA + SupervisorReview), `UniqueFormFieldResolver` (all factories),
  `ApplicationScoringService`.
- `Mapping/` partials, `Payloads/`, and `Validation/` models + validators (shared
  across the three form slices).

Decisions taken here:

- `ApplicationScoringService` stays in `Api/Applications/Shared` even though
  `Cruises/Lists` also reads scores: Applications owns scoring, and one
  cross-feature reference is cheaper than promoting scoring to a global folder.
- DI registrations in `ApiDependencyInjection.cs` are updated in place; no
  registration semantics change.

Exit criteria: top-level `ApplicationForms/` deleted; no `Api` feature references
another feature's internals except `Cruises` → `Applications/Shared` scoring.

## Phase 4 — Domain And Infrastructure Cleanup

1. Move the two include-graph query extensions out of the repository-era folder
   and delete it:
   - `Infrastructure/Persistence/Repositories/Extensions/CruisesQueryableExtensions.cs`
     → `Api/Cruises/Shared/` (or the single consuming slice if only one remains —
     check at move time).
   - `…/CruiseApplicationsQueryableExtensions.cs` → `Api/Applications/Shared/`.
   - Delete `Infrastructure/Persistence/Repositories/`.
2. Flatten `Domain/Common/*` one level up (`Domain/Enums`, `Domain/Constants`,
   `Domain/Extensions`, `Domain/Interfaces`, `Domain/Attributes`); `Common` adds
   no information.
3. Entity configuration audit: pick fluent configuration in
   `Infrastructure/Persistence/Configurations` as the single style for relational
   concerns; migrate data annotations found on entities during the audit. Keep the
   scope mechanical — no schema changes, verify with `dotnet ef migrations has-pending-model-changes`
   (or an empty-diff migration that is then deleted).
4. Bump `Microsoft.OpenApi` past the vulnerable 2.0.0 (NU1903).
5. Address the two `StringValues` TODOs in `Domain` enums only if the enum-code
   work in Phase 5 touches them anyway; otherwise leave.

Exit criteria: no `Repositories` folder; one EF configuration style; clean NU1903;
guardrail green.

## Phase 5 — Contract Decisions (Backend Only)

Freeze the final route table before any frontend work. Each item is a deliberate
decision recorded by updating the Phase 0 guardrail test in the same commit.

1. **Password change placement.** Recommendation: move
   `PATCH /v2/auth/password` back to `PATCH /v2/account/me/password`.
   Authenticated self-service belongs with the account; `/auth` keeps the
   anonymous credential flows (login, refresh, register, confirm, reset). Side
   benefit: removes one row from the drift table.
2. **`/account` naming consistency.** Recommendation: keep the current shape —
   `GET /v2/account/me` for the profile read, with `publications` and
   `cruise-effects` directly under `/v2/account`. Treat `/account` as the
   current-user root; do not reintroduce the `/me/` prefix on sub-resources.
3. **`resend-confirmation-email`.** Keep the route; decide whether the frontend
   should regain a caller (it had one on v1). Feeds Phase 6 scope.
4. **Error message strategy.** Endpoint handlers currently return hardcoded Polish
   `ProblemDetails` strings. Recommendation: machine-readable error codes with
   frontend-owned labels, consistent with the status-code normalization — but this
   is a product-visible change; it stays in Open Product Decisions unless
   deliberately scheduled.

Exit criteria: guardrail test encodes the final v2 route table; this document's
drift table updated to match; backend done.

## Phase 6 — Frontend Realignment (Last)

Update the frontend exactly once, against the frozen table.

1. Update hooks under `frontend/src/api/**` per the final route table (auth split,
   publications, cruise-effects, form context, password placement).
2. Update Playwright fixtures and route mocks (`frontend/tests/**`) — they
   currently mock the stale URLs, which is why the drift was invisible.
3. Sweep for stale literals: `grep -rn "/v2/account/login\|/v2/account/register\|
   /v2/account/refresh\|/v2/account/me/publications\|/v2/account/me/cruise-effects\|
   init-values" frontend/` must come back empty.
4. Verify: `vpr -F frontend check`, `vpr -F frontend type`, focused Playwright
   suites (session, account-recovery, user-management, cruises, applications,
   forms, supervisor-review, confirm-email), plus a runtime smoke against a real
   backend: login, form A/B/C save, publications import/delete, cruise effects,
   supervisor review.
5. Resolve the `resend-confirmation-email` caller decision from Phase 5.

Exit criteria: real end-to-end flows work against the live backend; no mocked
route diverges from the guardrail table.

## Phase 7 — Closeout

- Update the progress log below and prune finished sections of this document.
- Re-review Open Product Decisions; schedule or explicitly park each.
- Consider the follow-up that prevents this class of drift permanently:
  OpenAPI-to-frontend client generation (Orval → TanStack Query hooks + Zod),
  replacing the hand-written hooks area by area. Out of scope for this plan.

---

## Open Product Decisions

Carried over from the retired deferred-decisions ledger; still open, still parked.
None block the phases above.

- **Publications and cruise-effects lifecycle.** Import dedupes, skips
  zero-ministerial-point entries, and shared-row deletion rules were preserved
  during migration; decide deliberately whether to keep or redesign.
- **User-management surface.** Shipowner visibility filtering and the
  last-administrator invariant were preserved; decide whether the privileged
  management contract should be reshaped.
- **Form contract redesign.** Form A/B/C payloads remain large and UI-coupled by
  choice; any reshaping is a product decision, not cleanup.
- **Supervisor-review token model.** Still the stored reusable code. Alternatives
  (opaque signed expiring token, authenticated supervisor flow) remain documented
  options; changing public-link semantics is a product/security decision.
- **Error message localization** (new, from Phase 5.4): hardcoded Polish strings
  in ProblemDetails versus machine-readable codes with frontend labels.

## Progress Log

Update this table as phases land; keep notes short and factual.

| Phase | Status | Notes |
| --- | --- | --- |
| 0 — Route-table guardrail | done | Exact endpoint method/template set pinned by a WebApplicationFactory test. |
| 1 — Dissolve Domain/Logic | pending | |
| 2 — REPR convergence | pending | |
| 3 — Dissolve ApplicationForms | pending | |
| 4 — Domain/Infrastructure cleanup | pending | |
| 5 — Contract decisions | pending | |
| 6 — Frontend realignment | pending | |
| 7 — Closeout | pending | |
