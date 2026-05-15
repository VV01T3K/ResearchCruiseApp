# Backend v2 Rewrite Progress

This document is the required progress log for the backend v2 rewrite. Every slice
should update it before handoff so intent, decisions, verification, blockers, and the
next recommended work stay easy to recover.

## Current Status

Account recovery and security slice implemented. Most account flows now exist under
`/v2`; email confirmation remains on v1 pending resolution of its legacy
`changedEmail` branch, and larger resource areas still use v1 routes.

## Active Slice

Backend v2 account recovery and security slice: move resend-confirmation email,
password-reset request, password reset, and current-user password change onto the new
minimal API request path, migrate the matching frontend callers, and add the first
shared auth rate limit.

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
- Keep v1 account controllers and MediatR handlers active while the v2 endpoints are
  introduced in parallel.
- Use v2-local contracts for the new account endpoints instead of exposing legacy DTOs
  directly.
- Use `frontend/src/api-v2` as the frontend migration boundary while v1 and v2
  coexist.
- Keep this slice to account auth core only; password and email-confirmation flows
  stay on v1 until the next account slice.
- Keep email confirmation itself on v1 for now because the legacy `changedEmail`
  branch has no current caller but has not yet been deliberately removed or justified.
- Keep password-reset request and resend-confirmation email non-enumerating on v2 by
  returning `204` even when the email is unknown.
- Use one shared built-in fixed-window rate limit for sensitive public account routes:
  10 requests per minute per remote IP.

## Files Changed By Slice

### Foundation Starting Slice

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

### Auth Core Slice

- `backend/ResearchCruiseApp/Api/ApiComposition.cs`
- `backend/ResearchCruiseApp/Api/Account/Authentication.cs`
- `backend/ResearchCruiseApp/Api/Account/CurrentUser.cs`
- `backend/ResearchCruiseApp/Api/Account/Registration.cs`
- `backend/ResearchCruiseApp/Api/ProblemDetailsMapping.cs`
- `frontend/src/api-v2/account/AccountAuthApiHooks.tsx`
- `frontend/src/api-v2/account/contracts.ts`
- `frontend/src/api/hooks/user/UserApiHooks.tsx`
- `frontend/src/api/hooks/user/UserContextApiHooks.tsx`
- `frontend/src/lib/guards.ts`
- `frontend/src/providers/UserContextProvider.tsx`
- `frontend/src/routes/register.tsx`
- `frontend/tests/fixtures/pages/loginPage.ts`
- `frontend/tests/session.spec.ts`
- `docs/backend-rewrite-v2-progress.md`

### Account Recovery And Security Slice

- `backend/ResearchCruiseApp/Api/ApiComposition.cs`
- `backend/ResearchCruiseApp/Api/RateLimitingPolicies.cs`
- `backend/ResearchCruiseApp/Api/Account/Authentication.cs`
- `backend/ResearchCruiseApp/Api/Account/CurrentUser.cs`
- `backend/ResearchCruiseApp/Api/Account/EmailConfirmation.cs`
- `backend/ResearchCruiseApp/Api/Account/PasswordRecovery.cs`
- `backend/ResearchCruiseApp/Api/Account/Registration.cs`
- `backend/ResearchCruiseApp/Web/Configuration/DependencyInjection.cs`
- `backend/ResearchCruiseApp/Web/Configuration/WebApplicationExtensions.cs`
- `frontend/src/api-v2/account/AccountRecoveryApiHooks.tsx`
- `frontend/src/api-v2/account/contracts.ts`
- `frontend/src/api/hooks/user/UserApiHooks.tsx`
- `frontend/src/api/hooks/user-management/UserManagementApiHooks.tsx`
- `frontend/src/routes/account-settings/-components/ChangePasswordForm.tsx`
- `frontend/src/routes/forgot-password.tsx`
- `frontend/src/routes/reset-password.tsx`
- `frontend/tests/account-recovery.spec.ts`
- `docs/backend-rewrite-v2-progress.md`

## Verification Run

### Foundation Starting Slice

- `dotnet csharpier check .` passed from `backend/`, matching the backend formatting
  step used by CI.
- `vp check` passed from `frontend/`, matching the frontend formatting/lint job that
  still runs for backend pushes.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
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

### Auth Core Slice

- `vpr -F backend check` passed, matching the backend formatting step used by CI.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/session.spec.ts tests/login.spec.ts` passed with 12
  focused Playwright tests.
- Build reported existing NuGet vulnerability warnings for current dependencies:
  AutoMapper, MailKit, MimeKit, NuGet.Packaging, NuGet.Protocol, and OpenTelemetry
  packages.
- Runtime smoke verification passed locally with `ASPNETCORE_ENVIRONMENT=Development`
  on `http://127.0.0.1:3000`:
  - `GET /health` returned `200`.
  - `GET /version` returned `200`, confirming existing controller routing still works.
  - `GET /Account` returned `401`, confirming an existing authorized controller route
    is still mapped.
  - `GET /v2/account/me` returned `401` without credentials.
  - `GET /openapi/v2.json` returned `200` and exposes the new login, refresh,
    register, and current-user routes.

### Account Recovery And Security Slice

- `vpr -F backend check` passed, matching the backend formatting step used by CI.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/account-recovery.spec.ts tests/session.spec.ts tests/login.spec.ts`
  passed with 15 focused Playwright tests.
- Build reported the same existing NuGet vulnerability warnings for current
  dependencies: AutoMapper, MailKit, MimeKit, NuGet.Packaging, NuGet.Protocol, and
  OpenTelemetry packages.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://127.0.0.1:51364`:
  - `GET /health` returned `200`.
  - `GET /version` returned `200`.
  - `GET /Account` returned `401`, confirming existing controller routing still works.
  - `PATCH /v2/account/me/password` returned `401` without credentials.
  - `POST /v2/account/password-reset-request` returned `204` for an unknown email.
  - Repeated `POST /v2/account/login` requests returned ten `401` responses followed
    by `429` on the eleventh request.
  - `GET /openapi/v2.json` returned `200` and exposes resend-confirmation email,
    password-reset request, password reset, and current-user password change routes.
  - The v2 OpenAPI document does not expose `confirm-email`; that endpoint remains on
    v1 in this slice.

## Known Blockers And Risks

- Local backend startup requires reachable SQL Server because database initialization
  runs during application startup.
- Registration still depends on the legacy identity service error text to detect the
  existing "username taken" case on the frontend.
- Email confirmation still has an unresolved legacy `changedEmail` branch, so only the
  resend flow was ported in this slice.

## Next Recommended Slice

Resolve the legacy `changedEmail` confirmation branch and then either port or remove
it intentionally before moving on to the next account-adjacent v2 area, likely
current-user publications and cruise effects.
