# Backend v2 Rewrite Progress

This document is the required progress log for the backend v2 rewrite. Every slice
should update it before handoff so intent, decisions, verification, blockers, and the
next recommended work stay easy to recover.

## Current Status

Cutover cleanup in progress. The full live account surface, recovery, current-user
data, live privileged user management, the live cruise workflow, the application
catalog/decision surface, authenticated Form A/B/C workflows, and the anonymous
supervisor-review flow now exist under `/v2`; the dead legacy frontend application
hooks have been removed, `/version` now lives outside MVC, and the remaining work is
retiring the old v1 request path in a controlled order.

## Active Slice

Backend v2 combined cutover cleanup: remove the dead legacy frontend
application-hook modules and move `/version` off MVC before deleting v1 business
controllers.

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
- Keep password-reset request and resend-confirmation email non-enumerating on v2 by
  returning `204` even when the email is unknown.
- Use one shared built-in fixed-window rate limit for sensitive public account routes:
  10 requests per minute per remote IP.
- Keep risky behavior changes that are discovered during the port in
  `docs/backend-rewrite-v2-deferred-decisions.md` so they can be handled in focused
  follow-up PRs after migration work is complete.
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
- Port the full live cruise-management workflow together so the cruise screens do not
  remain split between v1 and v2.
- Move the eligible cruise-planning application read to
  `/v2/applications/for-cruise-planning` during the cruise slice because the
  create-cruise workflow depends on it.
- Clean up the v2 cruise wire shape by grouping manager data and attached applications
  while keeping current status values and lifecycle semantics unchanged.
- Split the remaining application migration into catalog/decision, authenticated form,
  and supervisor-review slices so the broader area stays reviewable.
- Group v2 application read managers as `mainManager` and `deputyManager`, while
  keeping current status values and evaluation behavior unchanged for this slice.
- Keep application form endpoints on v1 for now, but move the linked-cruise read used
  by Form B and Form C to `/v2/applications/{applicationId}/cruise`.
- Port the authenticated Form A/B/C workflow together so the signed-in application
  pages no longer straddle v1 and v2.
- Keep anonymous supervisor review on v1 for one final application slice because it
  has distinct anonymous authorization and token/code semantics.
- Preserve existing authenticated form DTOs and workflow semantics during the port;
  record broader form cleanup in the deferred-decisions ledger.
- Bundle the anonymous supervisor-review read into one v2 response containing Form A
  plus reduced init values, instead of preserving the old two-request frontend shape.
- Keep the existing supervisor-code and lifecycle semantics intact during migration;
  defer any broader public-review redesign to the follow-up ledger.
- Port `GET /v2/account/confirm-email` after the main migration stream while
  intentionally preserving optional `changedEmail` and applying the shared
  auth-sensitive limiter.
- Remove the dormant `changedEmail` confirmation branch in the first post-port
  follow-up after repo evidence showed no live caller or generated link depended on
  it.
- Preserve the newly merged legacy partial-update semantics for managed users in v2:
  update fields may be omitted, and role permission checks only run when a role is
  actually supplied.
- Drop the six remaining original-plan-only endpoints from v2 scope because their
  matching v1 behaviors had already been removed as dead code before the migration.
- Use `docs/backend-rewrite-v2-cutover.md` as the cutover checklist before deleting
  v1 runtime surfaces.
- Preserve `/version` as an unversioned live endpoint during cutover, but move it off
  MVC before removing controller mapping globally.
- Remove the unused legacy frontend application-hook modules once source inspection
  confirms all live consumers have moved to `frontend/src/api-v2`.
- Keep `/version` unversioned while moving it to a minimal endpoint so controller
  mapping is no longer required for operations routes.

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
- `frontend/src/routes/(auth)/register.tsx`
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
- `frontend/src/routes/(auth)/forgot-password.tsx`
- `frontend/src/routes/(auth)/reset-password.tsx`
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

### Cruise Management Slice

- `backend/ResearchCruiseApp/Api/ApiComposition.cs`
- `backend/ResearchCruiseApp/Api/Applications/CruisePlanningCandidates.cs`
- `backend/ResearchCruiseApp/Api/Cruises`
- `frontend/src/api-v2/applications/CruisePlanningApiHooks.tsx`
- `frontend/src/api-v2/cruises`
- `frontend/src/api/hooks/cruises/CruisesApiHooks.tsx`
- `frontend/src/contexts/cruises/CruiseFormContext.tsx`
- `frontend/src/routes/applications/new.tsx`
- `frontend/src/routes/applications/$applicationId/formA.tsx`
- `frontend/src/routes/cruises`
- `frontend/tests/cruises.spec.ts`
- `frontend/tests/user-management.spec.ts`
- `docs/backend-rewrite-v2-deferred-decisions.md`
- `docs/backend-rewrite-v2-progress.md`

### Application Catalog And Decisions Slice

- `backend/ResearchCruiseApp/Api/ApiComposition.cs`
- `backend/ResearchCruiseApp/Api/Applications`
- `frontend/src/api-v2/applications/ApplicationCatalogApiHooks.tsx`
- `frontend/src/api-v2/applications/contracts.ts`
- `frontend/src/contexts/applications`
- `frontend/src/lib/applications/periodUtils.ts`
- `frontend/src/routes/applications`
- `frontend/src/routes/cruises/$cruiseId/index.tsx`
- `frontend/tests/applications.spec.ts`
- `frontend/tests/assets/api-mocks/api_CruiseApplications_id_cruise.json`
- `frontend/tests/fixtures/pages/formB/formBPage.ts`
- `frontend/tests/fixtures/pages/formC/formCPage.ts`
- `docs/backend-rewrite-v2-deferred-decisions.md`
- `docs/backend-rewrite-v2-progress.md`

### Authenticated Application Forms Slice

- `backend/ResearchCruiseApp/Api/ApiComposition.cs`
- `backend/ResearchCruiseApp/Api/AuthorizationPolicies.cs`
- `backend/ResearchCruiseApp/Api/Applications/ApplicationFormA.cs`
- `backend/ResearchCruiseApp/Api/Applications/ApplicationFormB.cs`
- `backend/ResearchCruiseApp/Api/Applications/ApplicationFormC.cs`
- `backend/ResearchCruiseApp/Api/Applications/ApplicationFormContext.cs`
- `frontend/src/api-v2/applications/ApplicationFormsApiHooks.tsx`
- `frontend/src/routes/applications/new.tsx`
- `frontend/src/routes/applications/$applicationId/formA.tsx`
- `frontend/src/routes/applications/$applicationId/formB.tsx`
- `frontend/src/routes/applications/$applicationId/formC.tsx`
- `frontend/tests/cruises.spec.ts`
- `frontend/tests/fixtures/pages/formA/formAPage.ts`
- `frontend/tests/fixtures/pages/formB/formBPage.ts`
- `frontend/tests/fixtures/pages/formC/formCPage.ts`
- `docs/backend-rewrite-v2-deferred-decisions.md`
- `docs/backend-rewrite-v2-progress.md`

### Supervisor Review Slice

- `backend/ResearchCruiseApp/Api/ApiComposition.cs`
- `backend/ResearchCruiseApp/Api/Applications/SupervisorReview.cs`
- `frontend/src/api-v2/applications/SupervisorReviewApiHooks.tsx`
- `frontend/src/api-v2/applications/contracts.ts`
- `frontend/src/routes/cruise-approval.tsx`
- `frontend/tests/supervisor-review.spec.ts`
- `docs/backend-rewrite-v2-deferred-decisions.md`
- `docs/backend-rewrite-v2-progress.md`

### Confirm Email Completion Slice

- `backend/ResearchCruiseApp/Api/Account/EmailConfirmation.cs`
- `frontend/src/api-v2/account/AccountRecoveryApiHooks.tsx`
- `frontend/src/api-v2/account/contracts.ts`
- `frontend/src/routes/(auth)/confirm-email.tsx`
- `frontend/src/api/hooks/user/UserApiHooks.tsx`
- `frontend/tests/confirm-email.spec.ts`
- `docs/backend-rewrite-v2-deferred-decisions.md`
- `docs/backend-rewrite-v2-progress.md`

### Remove Dormant Changed Email Slice

- `backend/ResearchCruiseApp/Application/ExternalServices/IIdentityService.cs`
- `backend/ResearchCruiseApp/Application/UseCases/Account/ConfirmEmail/ConfirmEmailCommand.cs`
- `backend/ResearchCruiseApp/Application/UseCases/Account/ConfirmEmail/ConfirmEmailHandler.cs`
- `backend/ResearchCruiseApp/Infrastructure/Services/Identity/IdentityService.cs`
- `backend/ResearchCruiseApp/Api/Account/EmailConfirmation.cs`
- `backend/ResearchCruiseApp/Web/Controllers/AccountController.cs`
- `frontend/src/api-v2/account/contracts.ts`
- `docs/backend-rewrite-v2-deferred-decisions.md`
- `docs/backend-rewrite-v2-progress.md`

### Post-Merge User Update Compatibility Follow-up

- `backend/ResearchCruiseApp/Api/Users/UserProfile.cs`
- `docs/backend-rewrite-v2-progress.md`

### Dropped Plan-Only Endpoint Scope Follow-up

- `docs/backend-rewrite-v2-deferred-decisions.md`
- `docs/backend-rewrite-v2-progress.md`

### Cutover Readiness Slice

- `docs/backend-rewrite-v2-cutover.md`
- `docs/backend-rewrite-v2-progress.md`

### Cutover Slice 1: Remove Dead Legacy Frontend Hooks

- `frontend/src/api/hooks/applications/CruiseApplicationsApiHooks.tsx`
- `frontend/src/api/hooks/applications/FormAApiHooks.tsx`
- `frontend/src/api/hooks/applications/FormBApiHooks.tsx`
- `frontend/src/api/hooks/applications/FormCApiHooks.tsx`
- `frontend/tests/cruises.spec.ts`
- `docs/backend-rewrite-v2-cutover.md`
- `docs/backend-rewrite-v2-progress.md`

### Cutover Slice 2: Move Version Off MVC

- `backend/ResearchCruiseApp/Api/Operations/VersionEndpoint.cs`
- `backend/ResearchCruiseApp/Web/Controllers/VersionController.cs`
- `backend/ResearchCruiseApp/Web/Configuration/WebApplicationExtensions.cs`
- `docs/backend-rewrite-v2-cutover.md`
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

### Cruise Management Slice

- `vpr -F backend check` passed, matching the backend formatting step used by CI.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/cruises.spec.ts tests/user-management.spec.ts tests/session.spec.ts tests/login.spec.ts`
  passed with 19 focused Playwright tests for the migrated cruise workflow plus
  existing user-management and auth/session coverage.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://127.0.0.1:51366`:
  - `GET /v2/cruises` returned `401` without credentials.
  - A guest-token request to `POST /v2/cruises/auto-plan` returned `403`.
  - Existing v1 cruise and cruise-planning routes still mapped through controllers.
  - `GET /openapi/v2.json` exposed the live cruise surface and
    `/v{version}/applications/for-cruise-planning`.

### Application Catalog And Decisions Slice

- `vpr -F backend check` passed, matching the backend formatting step used by CI.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/applications.spec.ts tests/formB.spec.ts:7 tests/formC.spec.ts:7 tests/session.spec.ts tests/login.spec.ts`
  passed with 17 focused Playwright tests for migrated application reads/decisions,
  linked-cruise form dependencies, and existing auth/session coverage.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://localhost:3000`:
  - `GET /v2/applications` returned `401` without credentials.
  - A guest-token request to
    `PUT /v2/applications/{applicationId}/decision?accept=true` returned `403`.
  - Existing v1 `GET /api/CruiseApplications` still mapped through controllers and
    returned `401` without credentials.
  - `GET /openapi/v2.json` exposed list, detail, linked-cruise, evaluation, and
    decision application routes plus the earlier `for-cruise-planning` route.

### Authenticated Application Forms Slice

- `vpr -F backend check` passed.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/cruises.spec.ts:150 tests/formA.spec.ts:7 tests/formB.spec.ts:7 tests/formC.spec.ts:7 tests/session.spec.ts tests/login.spec.ts`
  passed with 16 focused Playwright tests.
- Build reported the same existing NuGet vulnerability warnings for current
  dependencies as prior slices.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://localhost:3000`:
  - unauthenticated `GET` requests to Form A, Form B, and Form C v2 routes returned
    `401`.
  - existing v1 `GET /forms/InitValues/A` still returned `401` without credentials,
    confirming the legacy controller route remains mapped.
  - `GET /openapi/v2.json` exposed authenticated Form A/B/C routes plus the two
    authenticated form init-values routes.

### Supervisor Review Slice

- `vpr -F backend check` passed.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/supervisor-review.spec.ts tests/session.spec.ts tests/login.spec.ts`
  passed with 14 focused Playwright tests.
- Build reported the same existing NuGet vulnerability warnings for current
  dependencies as prior slices.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://localhost:3000`:
  - anonymous requests to the new supervisor-review read and decision routes with an
    invalid code returned `404`, confirming the public routes do not challenge for
    authentication and still mask invalid links.
  - existing v1 supervisor-review read still mapped through controllers and returned
    `404` for an invalid link.
  - `GET /openapi/v2.json` exposed both new supervisor-review routes.

### Confirm Email Completion Slice

- `vpr -F backend check` passed.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/confirm-email.spec.ts tests/session.spec.ts tests/login.spec.ts`
  passed with 14 focused Playwright tests.
- Build reported the same existing NuGet vulnerability warnings for current
  dependencies as prior slices.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://localhost:3000`:
  - invalid `GET /v2/account/confirm-email` input returned `401`.
  - repeated invalid confirmation requests eventually returned `429` under the shared
    auth-sensitive limiter.
  - existing v1 `GET /account/emailConfirmation` still mapped through controllers and
    returned `401` for invalid input.
  - `GET /openapi/v2.json` exposed `GET /v2/account/confirm-email`.

### Remove Dormant Changed Email Slice

- `vpr -F backend check` passed.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/confirm-email.spec.ts tests/session.spec.ts tests/login.spec.ts`
  passed with 14 focused Playwright tests.
- Build reported the same existing NuGet vulnerability warnings for current
  dependencies as prior slices.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://127.0.0.1:51367`:
  - `GET /openapi/v2.json` documents only `userId` and `code` for
    `GET /v2/account/confirm-email`.
  - invalid normal confirmation input still returned `401` on both v2 and existing
    v1 routes.
  - requests carrying removed `changedEmail` returned `400` on both v2 and v1 routes
    instead of silently using the dead branch.

### Post-Merge User Update Compatibility Follow-up

- `vpr -F backend check` passed.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/user-management.spec.ts tests/session.spec.ts tests/login.spec.ts`
  passed with 15 focused Playwright tests.
- Build reported the same existing NuGet vulnerability warnings for current
  dependencies as prior slices.
- Runtime OpenAPI verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development` on `http://127.0.0.1:51368`:
  - `UpdateUserRequest` no longer marks `email`, `firstName`, `lastName`, or `role`
    as required, matching the merged partial-update behavior.

### Dropped Plan-Only Endpoint Scope Follow-up

- Documentation review confirmed both rewrite docs now treat the six remaining
  aspirational routes as intentionally out of scope rather than unfinished migration
  work.
- `git diff --check` passed.
- No build, formatter, or runtime verification was run because this slice changed
  documentation only.

### Cutover Readiness Slice

- Source inspection confirmed:
  - no live imports remain from `frontend/src/api/hooks/applications`
  - current live frontend business flows import migrated hooks from
    `frontend/src/api-v2`
  - `/version` is still served by `VersionController` and remains used by the frontend
  - `/health` already remains outside MVC through direct health-check mapping
- `git diff --check` passed.
- No build, formatter, or runtime verification was run because this slice changed
  documentation only.

### Cutover Slice 1: Remove Dead Legacy Frontend Hooks

- Removed the four legacy frontend application-hook modules after confirming no live
  imports remained.
- Updated the remaining cruise test mock from `/api/CruiseApplications` to
  `/v2/applications`.
- Relaxed the cruise-create Playwright assertion to validate the selected start day
  instead of assuming a midnight timestamp from the datetime picker.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- `vpr -F frontend test -- tests/cruises.spec.ts tests/session.spec.ts tests/login.spec.ts`
  passed with 16 focused Playwright tests.
- Search verification confirmed:
  - no files remain under `frontend/src/api/hooks/applications`
  - no frontend source or tests still reference `/api/CruiseApplications`
  - live application/form screens still import from `frontend/src/api-v2`

### Cutover Slice 2: Move Version Off MVC

- Replaced `VersionController` with an unversioned minimal `/version` endpoint.
- `vpr -F backend check` passed.
- `dotnet build backend/ResearchCruiseApp.sln` passed.
- `vpr -F frontend check` passed.
- `vpr -F frontend type` passed.
- Build reported the same existing NuGet vulnerability warnings for current
  dependencies as prior slices.
- Runtime smoke verification passed locally with
  `ASPNETCORE_ENVIRONMENT=Development`:
  - `GET /version` returned `200` with the existing version payload.
  - `GET /health` returned `200`.
  - `GET /openapi/v2.json` returned `200`, confirming the v2 document remains
    available after moving `/version` off MVC.

## Known Blockers And Risks

- Local backend startup requires reachable SQL Server because database initialization
  runs during application startup.
- Registration still depends on the legacy identity service error text to detect the
  existing "username taken" case on the frontend.
- Cruise status normalization and broader lifecycle redesign remain intentionally
  deferred after the targeted v2 contract cleanup.
- Application status normalization and broader form-workflow redesign remain
  intentionally deferred after the targeted v2 contract cleanup.
- Supervisor-review token, payload, and lifecycle cleanup remain intentionally
  deferred after the behavior-preserving v2 move.

## Next Recommended Slice

Remove the v1 business controllers and `MapControllers()` now that frontend-only
compatibility remains the only expected usage and `/version` no longer depends on
MVC.
