# Backend v2 Cutover Plan

This document records the retirement path after the live backend v2 migration. The
frontend is the only expected API consumer, the live frontend business flows have
moved to `/v2`, and the planned v1 cutover cleanup is now complete.

## Current State

### Legacy backend runtime retired

- The old v1 MVC business controllers have been removed.
- `/version` remains a live unversioned operations endpoint used by the frontend help
  page, but it now lives outside MVC.
- MVC controller registration and mapping have been removed from startup.
- The legacy Swagger v1 surface has been removed with the controller runtime; native
  v2 OpenAPI remains the documentation source.
- The legacy MediatR registration, package reference, and `Application/UseCases`
  request path have been removed.
- The old repository-per-entity and unit-of-work layers have been removed from the
  live backend; focused services and mapping helpers remain only where they still
  encode real behavior.

### Legacy frontend cleanup completed

- The old application-hook modules had no live imports and were removed in cutover
  slice 1:
  - `frontend/src/api/hooks/applications/CruiseApplicationsApiHooks.tsx`
  - `frontend/src/api/hooks/applications/FormAApiHooks.tsx`
  - `frontend/src/api/hooks/applications/FormBApiHooks.tsx`
  - `frontend/src/api/hooks/applications/FormCApiHooks.tsx`
- Current live application, cruise, account, and user-management screens use
  `frontend/src/api-v2` hooks instead.

### Intentionally unversioned endpoints

- `/health` remains live outside MVC through `MapHealthChecks("/health")`.
- `/version` remains live and unversioned outside MVC.

## Ordered Cleanup

1. Remove the dead legacy frontend application-hook modules and any legacy-only test
   helpers that become unused with them. Completed in cutover slice 1.
2. Move `/version` off MVC while preserving its current unversioned route and response
   behavior. Completed in the combined cutover cleanup commit.
3. Remove the v1 business controllers and `MapControllers()` once the frontend-only
   compatibility assumption is still valid at cleanup time. Completed in the
   accelerated cutover runtime cleanup.
4. Remove controller-only MediatR commands, queries, handlers, registration, and
   package references after no runtime path uses them. Completed in the accelerated
   MediatR cleanup.
5. Run the final cutover verification pass and update the rewrite docs to mark v1
   retirement complete. Completed in the accelerated cutover cleanup.

## Verification Basis

- Source inspection found no live imports from `frontend/src/api/hooks/applications`
  before cutover slice 1, and those dead modules have now been removed.
- Current frontend business screens import migrated hooks from `frontend/src/api-v2`.
- `/version` still serves the frontend help page through an unversioned minimal
  endpoint instead of MVC.
- `/health` already bypasses MVC and is mapped directly as a health check endpoint.
- The live codebase no longer references `MediatR`, `IMediator`, or
  `Application.UseCases`.

## Assumptions

- There are no non-frontend consumers that require continued v1 compatibility.
- Focused factories and shared services remain only where they encode real behavior;
  the generic repository and unit-of-work layers are no longer part of the live tree.
- Deferred product redesigns remain separate from the cutover cleanup sequence.
