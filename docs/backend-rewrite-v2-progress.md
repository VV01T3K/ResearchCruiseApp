# Backend v2 Rewrite Progress

This document is the required progress log for the backend v2 rewrite. Every slice
should update it before handoff so intent, decisions, verification, blockers, and the
next recommended work stay easy to recover.

## Current Status

User-management slice implemented. Core account, recovery, current-user data, and the
live privileged user-management surface now exist under `/v2`; email confirmation
remains on v1 while the legacy `changedEmail` decision is deferred to a later
follow-up PR outside the main port.

## Active Slice

Backend v2 user-management slice: move the live privileged `/users` surface under
`/v2/users`, migrate the matching frontend callers, and keep unused planned user
resources out of this migration pass.

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
- Treat `changedEmail` as likely legacy residue based on current repo evidence, but do
  not resolve it inside the main port.
- Keep risky behavior changes that are discovered during the port in
  `docs/backend-rewrite-v2-deferred-decisions.md` so they can be handled in focused
  follow-up PRs after migration work is complete.
- Keep `GET /v2/account/confirm-email` out of v2 until the deferred decision is
  handled so the new contract does not preserve or delete behavior accidentally.
- Put current-user publications and cruise effects under `/v2/account/me` instead of
  preserving their legacy placement under `CruiseApplications`.
- Flatten the v2 current-publications read response to publications only because the
  frontend never uses the legacy `UserPublication` wrapper.
- Preserve current publication import/delete rules and current cruise-effects shape
  during migration; defer broader cleanup decisions to the follow-up ledger.
- Port only live privileged user-management behavior in this slice rather than adding
  currently unused planned `/v2/users` resources ahead of demand.
- Use `/v2/users/available-cruise-managers` for the live cruise-manager option query
  while preserving the current accepted-user selection behavior.
- Preserve the existing user-management permission and last-administrator rules during
  migration; defer broader cleanup decisions to the follow-up ledger.

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

### Email Confirmation Audit Slice

- `docs/backend-rewrite-v2-deferred-decisions.md`
- `docs/backend-rewrite-v2-progress.md`

### Current User Data Slice

- `backend/ResearchCruiseApp/Api/ApiComposition.cs`
- `backend/ResearchCruiseApp/Api/AuthorizationPolicies.cs`
- `backend/ResearchCruiseApp/Api/Account/CurrentCruiseEffects.cs`
- `backend/ResearchCruiseApp/Api/Account/CurrentPublications.cs`
- `frontend/src/api-v2/account/AccountCurrentDataApiHooks.tsx`
- `frontend/src/api-v2/account/contracts.ts`
- `frontend/src/api/hooks/applications/CruiseApplicationsApiHooks.tsx`
- `frontend/src/api/hooks/publications/MyPublicationsApiHooks.tsx`
- `frontend/src/routes/cruise-effects.tsx`
- `frontend/src/routes/my-publications/-components/UploadButton.tsx`
- `frontend/src/routes/my-publications/index.tsx`
- `frontend/tests/current-user-data.spec.ts`
- `docs/backend-rewrite-v2-deferred-decisions.md`
- `docs/backend-rewrite-v2-progress.md`

### User Management Slice

- `backend/ResearchCruiseApp/Api/ApiComposition.cs`
- `backend/ResearchCruiseApp/Api/Users/UserAcceptance.cs`
- `backend/ResearchCruiseApp/Api/Users/UserDirectory.cs`
- `backend/ResearchCruiseApp/Api/Users/UserProfile.cs`
- `frontend/src/api-v2/users/UserManagementApiHooks.tsx`
- `frontend/src/api-v2/users/contracts.ts`
- `frontend/src/api/hooks/user-management/UserManagementApiHooks.tsx`
- `frontend/src/routes/cruises/-components/ManagerSelectionSection.tsx`
- `frontend/src/routes/user-management/-components/EditForm.tsx`
- `frontend/src/routes/user-management/-components/GroupActionsSection.tsx`
- `frontend/src/routes/user-management/index.tsx`
- `frontend/tests/session.spec.ts`
- `frontend/tests/user-management.spec.ts`
- `docs/backend-rewrite-v2-deferred-decisions.md`
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

### Email Confirmation Audit Slice

- Source inspection confirmed the current repo-visible shape:
  - v1 still accepts `changedEmail` in `AccountController` and
    `IdentityService.ConfirmEmail`.
  - The current frontend confirm-email caller sends only `userId` and `code`.
  - Confirmation links emitted by the backend include only `userId` and `code`.
  - The admin user-edit flow can change email, but it updates the stored email
    directly and does not mint or send a change-email confirmation token.
  - No live source path currently calls the change-email token generation branch.
  - `fix/roles-access-control` changes user-update validation and removes unrelated
    role helpers, but does not resolve or rely on `changedEmail`.
- No build, formatter, or runtime verification was run because this slice changed
  documentation only.

### Current User Data Slice

- `vpr -F backend check` passed, matching the backend formatting step used by CI.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/current-user-data.spec.ts tests/account-recovery.spec.ts tests/session.spec.ts tests/login.spec.ts`
  passed with 19 focused Playwright tests.
- Build reported the same existing NuGet vulnerability warnings for current
  dependencies: AutoMapper, MailKit, MimeKit, NuGet.Packaging, NuGet.Protocol, and
  OpenTelemetry packages.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://localhost:3000`:
  - `GET /health` returned `200`.
  - `GET /version` returned `200`.
  - Existing v1 current-publication and cruise-effect controller routes returned
    `401` without credentials, confirming they still map.
  - `GET /v2/account/me/publications` returned `401` without credentials.
  - `GET /v2/account/me/cruise-effects` returned `401` without credentials.
  - `GET /openapi/v2.json` returned `200` and exposes the four current-publication
    routes plus current-user cruise effects.

### User Management Slice

- `vpr -F backend check` passed, matching the backend formatting step used by CI.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/user-management.spec.ts tests/current-user-data.spec.ts tests/account-recovery.spec.ts tests/session.spec.ts tests/login.spec.ts`
  passed with 22 focused Playwright tests for migrated users plus existing
  auth/account flows.
- Build reported the same existing NuGet vulnerability warnings for current
  dependencies: AutoMapper, MailKit, MimeKit, NuGet.Packaging, NuGet.Protocol, and
  OpenTelemetry packages.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://127.0.0.1:51365`:
  - `GET /health` returned `200`.
  - `GET /version` returned `200`.
  - Existing v1 `GET /Users` returned `401` without credentials, confirming controller
    routing still works.
  - `GET /v2/users` returned `401` without credentials.
  - A guest JWT on `GET /v2/users` returned `403`.
  - `GET /openapi/v2.json` returned `200` and exposes the seven live v2 user routes.

## Known Blockers And Risks

- Local backend startup requires reachable SQL Server because database initialization
  runs during application startup.
- Registration still depends on the legacy identity service error text to detect the
  existing "username taken" case on the frontend.
- Email confirmation still has an unresolved legacy `changedEmail` branch. Current
  repo evidence suggests it is dormant, but the decision is intentionally deferred to
  a separate post-port PR.
- The long-term rewrite plan names additional `/v2/users` resources that the current
  app does not use yet; they remain intentionally unported until a later slice needs
  them.

## Next Recommended Slice

Continue with the next v2 resource area, likely cruises under `/v2/cruises`, while
keeping deferred behavior changes outside the main migration stream.
