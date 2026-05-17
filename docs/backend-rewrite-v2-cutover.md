# Backend v2 Cutover Plan

This document records the retirement path after the live backend v2 migration. The
frontend is the only expected API consumer, and the live frontend business flows have
already moved to `/v2`. The remaining work is cleanup and cutover, not additional
endpoint parity.

## Current State

### Legacy backend runtime still present

- Business MVC controllers still map the old v1 surface:
  - `AccountController`
  - `UsersController`
  - `CruisesController`
  - `CruiseApplicationsController`
  - `FormsController`
- `VersionController` is still MVC-backed, but `/version` remains a live unversioned
  operations endpoint used by the frontend help page.
- `AddControllers()` and `MapControllers()` stay in startup only because those MVC
  routes are still present.
- MediatR registration, package references, and command/query handlers under the
  legacy `Application/UseCases` request path remain for the old controller surface.
  Shared repositories, factories, and domain/application services are not blanket
  deletion targets.

### Legacy frontend code still present

- The old application-hook modules remain on disk but have no live imports:
  - `frontend/src/api/hooks/applications/CruiseApplicationsApiHooks.tsx`
  - `frontend/src/api/hooks/applications/FormAApiHooks.tsx`
  - `frontend/src/api/hooks/applications/FormBApiHooks.tsx`
  - `frontend/src/api/hooks/applications/FormCApiHooks.tsx`
- Current live application, cruise, account, and user-management screens use
  `frontend/src/api-v2` hooks instead.

### Intentionally unversioned endpoints

- `/health` remains live outside MVC through `MapHealthChecks("/health")`.
- `/version` remains live and unversioned, but it must move off MVC before controller
  mapping can be removed.

## Ordered Cleanup

1. Remove the dead legacy frontend application-hook modules and any legacy-only test
   helpers that become unused with them.
2. Move `/version` off MVC while preserving its current unversioned route and response
   behavior.
3. Remove the v1 business controllers and `MapControllers()` once the frontend-only
   compatibility assumption is still valid at cleanup time.
4. Remove controller-only MediatR commands, queries, handlers, registration, and
   package references after no runtime path uses them.
5. Run the final cutover verification pass and update the rewrite docs to mark v1
   retirement complete.

## Verification Basis

- Source inspection found no live imports from `frontend/src/api/hooks/applications`.
- Current frontend business screens import migrated hooks from `frontend/src/api-v2`.
- `VersionController` still serves `/version`, and the frontend still calls that
  endpoint from the help page.
- `/health` already bypasses MVC and is mapped directly as a health check endpoint.

## Assumptions

- There are no non-frontend consumers that require continued v1 compatibility.
- Repositories, factories, and shared services stay until later review proves they are
  unused; cutover deletes the legacy request path first.
- Deferred product redesigns remain separate from the cutover cleanup sequence.
