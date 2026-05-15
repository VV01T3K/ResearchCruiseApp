# Backend v2 Rewrite Progress

This document is the required progress log for the backend v2 rewrite. Every slice
should update it before handoff so intent, decisions, verification, blockers, and the
next recommended work stay easy to recover.

## Current Status

Foundation slice implemented. No business endpoints have been ported to v2 yet.

## Active Slice

Backend v2 foundation starting slice: establish v2 routing, native OpenAPI, Scalar,
shared HTTP result mapping, ProblemDetails mapping, authorization policy names,
validation filter pattern, transaction filter pattern, and progress documentation.

## Decisions Made

- Keep existing MVC controllers and v1 routes active during the foundation slice.
- Use URL-segment API versioning for `/v2`.
- Keep `/health` and existing controller-owned `/version` unversioned.
- Keep Swashbuckle for the current controller API while adding native OpenAPI for v2.
- Keep the MVC API explorer package out of this foundation slice because it changes
  legacy controller discovery/routing; the native v2 OpenAPI document is filtered to
  `/v2` paths instead.
- Use `docs/backend-rewrite-v2-progress.md` as the required progress log for future
  backend v2 slices.
- Do not port account, users, cruises, applications, or forms endpoints in this slice.

## Files Changed By Slice

- `backend/ResearchCruiseApp/ResearchCruiseApp.csproj`
- `backend/ResearchCruiseApp/Api/ApiComposition.cs`
- `backend/ResearchCruiseApp/Api/AuthorizationPolicies.cs`
- `backend/ResearchCruiseApp/Api/HttpResultMapping.cs`
- `backend/ResearchCruiseApp/Api/ProblemDetailsMapping.cs`
- `backend/ResearchCruiseApp/Api/TransactionFilters.cs`
- `backend/ResearchCruiseApp/Api/ValidationFilters.cs`
- `backend/ResearchCruiseApp/Web/Configuration/DependencyInjection.cs`
- `backend/ResearchCruiseApp/Web/Configuration/WebApplicationExtensions.cs`
- `docs/backend-rewrite-v2-progress.md`

## Verification Run

- `dotnet csharpier check .` passed from `backend/`, matching the backend formatting
  step used by CI.
- `vp check` passed from `frontend/`, matching the frontend formatting/lint job that
  still runs for backend pushes.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- Build reported existing NuGet vulnerability warnings for current dependencies:
  AutoMapper, MailKit, MimeKit, NuGet.Packaging, NuGet.Protocol, and OpenTelemetry
  packages.
- Runtime smoke verification passed locally with `ASPNETCORE_ENVIRONMENT=Development`
  on `http://127.0.0.1:51363`:
  - `GET /health` returned `200`.
  - `GET /version` returned `200`, confirming existing controller routing still works.
  - `GET /Account` returned `401`, confirming an existing authorized controller route
    is still mapped.
  - `GET /openapi/v2.json` returned `200` with no legacy controller paths.
  - `GET /scalar` redirected and then returned `200`, pointing at `openapi/v2.json`.
  - `GET /swagger/v1/swagger.json` returned `200` and still includes legacy
    controller paths.

## Known Blockers And Risks

- Local backend startup requires reachable SQL Server because database initialization
  runs during application startup.
- The v2 OpenAPI document is expected to be mostly empty until the first real v2
  endpoint slice is implemented.

## Next Recommended Slice

Port account authentication and current-user endpoints to `/v2/account`, using the
foundation patterns from this slice before moving into larger resource workflows.
