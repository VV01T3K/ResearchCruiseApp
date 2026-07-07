# Backend v2 Polish Plan — Completed

Created and completed 2026-07-07. This is the authoritative closeout record for
the backend v2 rewrite. The retired `backend-rewrite-v2-*` documents remain in git
history.

## Final State

- The backend uses feature-oriented .NET 10 minimal APIs and vertical REPR slices
  under `Api/`. Each feature root contains only its `<Feature>Endpoints.cs`
  composition file plus slice folders.
- Sharing follows the narrowest-owner rule: slice → feature `Shared/` → `Api` →
  `Domain` / `Infrastructure`.
- `Domain/Logic`, `Domain/Common`, top-level `ApplicationForms`, and the
  repository-era `Infrastructure/Persistence/Repositories` tree are gone.
- Domain contains a small, flat shared vocabulary plus the EF entity model grouped
  by aggregate ownership under `Entities/Applications`, `Entities/Cruises`, and
  `Entities/Users`. Relational configuration is fluent and has no pending model
  changes.
- Infrastructure contains plumbing for persistence, identity, email, files,
  exports, localization, and security.
- Pure business rules are static `Rules.cs` files in their owning slices.
  Multi-slice Applications orchestration lives under `Api/Applications/Shared`.
- The exact HTTP method/route-template set is pinned by a
  `WebApplicationFactory` test. Native OpenAPI remains available at runtime in
  development.
- Frontend hooks and Playwright mocks match the frozen v2 route table. The
  resend-confirmation flow is exposed again from account settings.

## Architecture Conventions

1. **Vertical slices with REPR.** Each slice is a folder
   `Api/<Feature>/<Slice>/` containing `Endpoints.cs` plus `Contracts.cs`,
   `Validators.cs`, `Rules.cs`, or a readability-focused workflow/factory file as
   needed. Feature endpoint files only compose slices onto route groups.
2. **Narrow ownership.** Code stays in its slice until a second slice needs it,
   then moves only as far as the narrowest shared owner.
3. **No mandatory service layer.** Pure decisions are static rules; shared
   orchestration has a specific name in feature `Shared/`; single-slice
   orchestration remains co-located.
4. **One EF model.** `Domain/Entities` remains the shared persistence model and
   uses ownership folders without namespace-per-folder churn; there are no
   per-slice contexts or migrations.
5. **Infrastructure is plumbing.** It does not own endpoint contracts or feature
   workflow decisions.
6. **`Results.cs` remains top-level.** `Result` and `Error` are genuinely consumed
   by both API and Infrastructure.

## Final Route Alignment

- Anonymous credential flows use `/v2/auth`.
- Current-user publications and cruise effects use `/v2/account`.
- Authenticated password change uses `/v2/account/me/password`.
- Form initialization uses `/v2/applications/form-a/context` and
  `/v2/applications/form-b/context`.
- `POST /v2/auth/resend-confirmation-email` is retained and has a frontend caller.
- The route-table guardrail is the source of truth for the complete method/path
  set.

## Verification Evidence

Final verification on 2026-07-07:

- `vpr -F backend check` — passed.
- `dotnet build backend/ResearchCruiseApp.sln` — passed with zero warnings.
- `dotnet test backend/ResearchCruiseApp.sln` — 28 passed.
- `dotnet ef migrations has-pending-model-changes` — no changes.
- NuGet vulnerable-package audit — no vulnerable packages.
- `vpr -F frontend check` — passed with no warnings or lint errors.
- `vpr -F frontend type` — passed.
- Focused Playwright suites — 113 passed, 3 skipped, 0 failed.
- Isolated live-data smoke against Kestrel + SQL — login/refresh, Form A/B/C
  saves, publication import/read/delete, cruise effects, form context, and
  supervisor review/decision passed; disposable records were removed.
- Stale frontend route-literal sweep — empty.

## Progress Log

| Phase | Status | Notes |
| --- | --- | --- |
| 0 — Route-table guardrail | done | Exact endpoint method/template set pinned by a WebApplicationFactory test. |
| 1 — Dissolve Domain/Logic | done | Rules localized; wire status codes moved to Api. |
| 2 — REPR convergence | done | Remaining endpoint modules moved into slice folders. |
| 3 — Dissolve ApplicationForms | done | Slice code localized; shared code moved under Applications/Shared. |
| 4 — Domain/Infrastructure cleanup | done | Repository vestiges removed; Domain flattened; EF made fluent; NU1903 cleared. |
| 5 — Contract decisions | done | Final route table frozen; password change returned to account/me. |
| 6 — Frontend realignment | done | Hooks, mocks, browser suites, and isolated live smoke aligned. |
| 7 — Closeout | done | End state audited; completed plan pruned; follow-ups parked. |
| 8 — De-ceremony pass | done | Dead code and unearned interfaces removed; taxonomy folders and composition shells collapsed; single-form mappings localized. |
| 9 — Entity ownership | done | The shared EF model was organized into Applications/FormA–C/Shared, Cruises, and Users ownership folders without namespace or model changes. |

## De-ceremony Pass

Completed 2026-07-07 as seven ordered commits with the route table and EF model
held fixed throughout.

- Deleted the unused HTTP result mapper and the two unconsumed entity marker
  interfaces, removing their markers from eight entities.
- Removed eleven single-implementation infrastructure interfaces and injected the
  concrete implementations directly with their original scoped lifetimes.
- Replaced reflection-backed contract/publication category enums with application
  string constants, localized `CruiseFunction` to Form C, and removed the dead
  `StringValue` attribute/enum extension machinery and labels.
- Moved evaluation and Form A value constants to `Applications/Shared`; flattened
  shared domain vocabulary directly under `Domain/` and removed its by-kind
  folders. `Domain/Entities` remains the shared EF model.
- Made `Program.cs` the startup atlas, moved OpenTelemetry to Infrastructure,
  inlined the version endpoint, merged API composition/registration/rate-policy
  shells, collapsed the four result files into top-level `Results.cs`, and moved
  URL prefixes into their two consumers. `Configuration/`,
  `Infrastructure/Common/`, and the old `Results/` folder are gone.
- Moved Form A/B/C mapping partials into their owning slices while retaining the
  genuinely multi-form mapping partials in `Applications/Shared/Mapping`.
- Organized the shared EF entity files by aggregate ownership: form-specific
  entities live under their application form, multi-form entities under
  `Applications/Shared`, and cruise/user records under their corresponding roots.
  All entities retain the single `ResearchCruiseApp.Domain.Entities` namespace.
- Left the optional factory renames out: the existing names avoid churn, and the
  database-dedup workflow implementation was not changed.

Deviation found during required consumer re-verification: `StringExtensions.cs`
was specified as dead, but its `ToBool` and `ToEnum` methods have live production
callers in application reading, validation, mapping, factories, scoring, effects,
and database initialization. It was therefore retained unchanged in behavior and
moved from `Domain/Extensions/` to flat `Domain/StringExtensions.cs`.

The resulting backend has feature slices under `Api/`; application-wide helpers
under `Api/Applications/Shared`; a flat `Domain/` vocabulary plus
`Domain/Entities`; plumbing grouped by purpose under `Infrastructure`; startup in
`Program.cs` with OpenTelemetry as its sole extracted startup concern; and one
top-level `Results.cs`. The targeted taxonomy-by-kind and single-use composition
folders are gone.

## Parked Product Decisions

These are explicitly parked and do not block the rewrite:

- **Publications and cruise-effects lifecycle.** Current import deduplication,
  zero-point filtering, and shared-row deletion behavior remain unchanged.
- **User-management surface.** Shipowner visibility and the last-administrator
  invariant remain unchanged.
- **Form contract redesign.** The large UI-coupled Form A/B/C payloads remain as
  shipped contracts.
- **Supervisor-review token model.** The stored reusable code remains; signed,
  expiring tokens or an authenticated supervisor flow require a separate product
  and security decision.
- **Error-message localization.** Hardcoded Polish `ProblemDetails` strings remain;
  machine-readable codes with frontend-owned labels require a product-visible
  follow-up.

## Considered Follow-up

OpenAPI-to-frontend client generation (for example Orval-generated TanStack Query
hooks and Zod schemas) was considered and is deliberately out of scope. It should
be scheduled separately if the team wants to replace handwritten hooks and make
future backend/frontend contract drift structurally impossible.
