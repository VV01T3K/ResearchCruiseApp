# Backend v2 Rewrite Plan

## Purpose

The backend rewrite is not only an API rename. The goal is to make the backend easier
to understand, easier to change, and smaller where the current code does not pull its
weight.

The current backend already uses the modern ASP.NET hosting model, but the request
path is still heavy:

```text
Controller -> MediatR command/query -> handler -> service/factory/repository -> EF Core/Identity
```

The v2 rewrite should move to:

```text
Minimal API endpoint -> use-case slice -> EF Core/Identity/infrastructure
```

## Finalized Post-Cutover Direction

The post-cutover cleanup keeps `/v2` as the live contract while completing the
internal rewrite:

- stable machine status codes replace localized workflow strings on the wire
- draft/decision flags live in request bodies instead of query strings
- role changes use dedicated role endpoints while the current frontend keeps its
  single-role editor behavior
- simple use cases read and write through `ApplicationDbContext` directly
- pure workflow rules live under `Domain/Logic`
- direct EF Core now owns the full live request path, including shared form
  creation/replacement workflows
- the anonymous supervisor-review code model remains in place for now; alternative
  token models stay a documented later decision

That means:

- build a new `/v2` API contract instead of preserving the current mixed route surface
- keep the number of top-level API groups small
- remove controller and MediatR ceremony from the request path
- remove repository-per-entity abstractions where direct EF Core is clearer
- keep business concepts visible in the code structure
- delete dead or unused endpoints instead of mechanically porting everything
- reduce file count where files are only forwarding calls or wrapping trivial behavior
- avoid replacing many handlers with a few oversized feature services
- make cross-cutting concerns explicit before removing MediatR from the request path
- keep `ASP.NET Identity + JWT` because the current product rules depend on it
- keep the app as one deployable backend and one SQL Server database

## Current Backend Shape

The current backend lives in a single ASP.NET Core project:

```text
backend/ResearchCruiseApp
├── Program.cs
├── Web
│   ├── Controllers
│   └── Configuration
├── Application
│   ├── UseCases
│   ├── Services
│   ├── Models
│   └── ExternalServices
├── Domain
│   └── Entities
└── Infrastructure
    ├── Persistence
    └── Services
```

Current strengths:

- business use cases are separated from controllers
- Identity is already integrated with EF Core
- domain entities and DTOs are already explicit
- OpenTelemetry, health checks, OpenAPI/Swagger-era documentation, CORS,
  migrations, and seeding already exist

Current pain points:

- controllers mostly forward to MediatR
- many handlers mostly forward to services or repositories
- many repositories wrap simple EF Core operations
- factories and DTO mappers are spread across many small files
- route naming is inconsistent: `/account`, `/users`, `/forms`, `/version`,
  `/api/Cruises`, `/api/CruiseApplications`
- the `/api` prefix is mixed into backend routes even though proxy/front-door routing
  should own external prefixes
- some endpoint names leak implementation wording, for example `autoAdded`,
  `effectsEvaluations`, `InitValues`, `answer`, and `Refill`
- some endpoints are placed under the wrong concept, for example current-user
  publications under `CruiseApplications`

## Target Codebase Shape

The rewrite should keep a single project unless there is a strong reason to split it.
The main improvement should come from feature-oriented folders and fewer indirection
layers.

## Reference: Vitask

The `VV01T3K/vitask` repo is a useful small-app reference for the direction of this
rewrite, but not a complete template for ResearchCruiseApp.

Useful patterns to borrow:

- Minimal API endpoint groups with route names, summaries, tags, and explicit
  response metadata.
- Direct EF Core access in endpoint/use-case code for simple reads and writes.
- `AsNoTracking()` plus projection to response DTOs for read endpoints.
- Validation connected to endpoint metadata so OpenAPI and runtime behavior stay in
  sync.
- Generated OpenAPI documents committed/produced by the backend build.
- A later OpenAPI-to-frontend client pipeline, likely Orval-generated TanStack Query
  hooks and Zod schemas.
- Runtime frontend response validation during development once generated schemas are
  introduced.

Patterns to adapt carefully:

- Vitask keeps each resource in one endpoint file because it has only two tiny
  resources. ResearchCruiseApp should use one use-case file or small use-case cluster
  per workflow instead of one giant `Applications` or `Cruises` file.
- Vitask uses in-memory SQLite and `EnsureCreated`; ResearchCruiseApp must keep SQL
  Server, EF migrations, and explicit seeding.
- Vitask has no Identity, authorization model, file uploads, long business workflows,
  or legacy API migration. Those concerns must remain explicit in our plan.

The OpenAPI-to-frontend pipeline is still a strong future direction, but it is not a
phase-one dependency. The first backend rewrite should not be constrained by the
current frontend DTOs or response shapes when the v2 contract is clearer with changes.
Keep the frontend work bounded by updating the existing hand-written hooks and DTO
files manually. Generated hooks and schemas can be added after the v2 backend patterns
settle.

Recommended shape:

```text
backend/ResearchCruiseApp
├── Program.cs
├── Api
│   ├── ApiComposition.cs
│   ├── Account
│   │   ├── Authentication.cs
│   │   ├── Registration.cs
│   │   ├── PasswordRecovery.cs
│   │   ├── CurrentUser.cs
│   │   ├── CurrentPublications.cs
│   │   ├── CurrentCruiseEffects.cs
│   │   └── Contracts
│   ├── Users
│   │   ├── UserDirectory.cs
│   │   ├── UserProfile.cs
│   │   ├── UserAcceptance.cs
│   │   ├── UserRoles.cs
│   │   ├── UserCruiseEffects.cs
│   │   └── Contracts
│   ├── Cruises
│   │   ├── CruiseCatalog.cs
│   │   ├── CruiseDetails.cs
│   │   ├── CruiseLifecycle.cs
│   │   ├── CruisePlanning.cs
│   │   ├── CruiseExport.cs
│   │   ├── Contracts
│   │   ├── Mapping
│   │   └── Workflows
│   ├── Applications
│   │   ├── ApplicationCatalog.cs
│   │   ├── ApplicationCruise.cs
│   │   ├── ApplicationEvaluation.cs
│   │   ├── ApplicationDecision.cs
│   │   ├── ApplicationFormContext.cs
│   │   ├── ApplicationFormA.cs
│   │   ├── ApplicationFormB.cs
│   │   ├── ApplicationFormC.cs
│   │   ├── SupervisorReview.cs
│   │   ├── Contracts
│   │   ├── Validation
│   │   ├── Mapping
│   │   ├── Factories
│   │   └── Workflows
│   ├── HttpResultMapping.cs
│   ├── ProblemDetailsMapping.cs
│   ├── AuthorizationPolicies.cs
│   ├── ValidationFilters.cs
│   ├── TransactionFilters.cs
│   └── IdempotencyFilters.cs
├── Domain
│   ├── Entities
│   ├── Enums
│   └── Logic
├── Infrastructure
│   ├── Persistence
│   │   ├── ApplicationDbContext.cs
│   │   ├── Configurations
│   │   ├── Migrations
│   │   └── Seed
│   ├── Identity
│   ├── Email
│   ├── Files
│   ├── Exports
│   ├── Localization
│   ├── Security
│   └── Observability
└── Configuration
    ├── JwtOptions.cs
    ├── DatabaseOptions.cs
    ├── SmtpOptions.cs
    ├── FrontendOptions.cs
    └── OtelOptions.cs
```

This is a target shape, not a rigid rule. The important rule is that each file should
own one use case or one small cluster of tightly related use cases. Avoid both
extremes: many files that only forward calls, and one `ApplicationsService` or
`CruisesService` that accumulates every operation in the area.

`Api/ApiComposition.cs` should be the one place where a reader can see the rough shape of
the whole HTTP surface. It should create the versioned root, create the top-level
groups such as `/account`, `/users`, `/cruises`, and `/applications`, and apply only
shared route metadata there.

The actual handlers should live in the feature files next to their request/response
contracts, validation, authorization checks, and mapping. Avoid area-level
`AccountApi.cs`, `UsersApi.cs`, and similar composition files unless a feature truly
grows enough to justify a second composition layer later.

Avoid a `Shared` folder for miscellaneous code. Truly cross-cutting API pieces can
live directly under `Api`; if they start collecting feature-specific helpers, move
those helpers back into the feature folder.

`Domain` should contain business concepts independent of HTTP, EF Core, Identity,
email, files, or JSON. `Domain/Enums` is for business states such as
`CruiseStatus`, `CruiseApplicationStatus`, and `ResearchTaskType`. `Domain/Logic`
is for pure business logic such as scoring, status transitions, blockade overlap
rules, or form workflow rules. Infrastructure must not contain route handling,
endpoint contracts, or API-specific workflow decisions.

## What To Remove Or Collapse

Remove from the v2 request path:

- MVC controllers for v2 endpoints
- MediatR commands, queries, and handlers
- MediatR-style pipeline behavior that is not deliberately replaced
- handler classes that only forward to another service
- repository classes that only expose basic `GetById`, `GetAll`, `Add`, or `Delete`
- DTO factories that only copy properties without hiding meaningful mapping complexity
- route-specific extension methods that only wrap `Ok`, `NoContent`, or `Created`
- custom API result wrappers that erase typed HTTP result metadata

Keep or rewrite as focused services:

- Identity and token handling
- current-user access
- application visibility and permission checks
- cruise application scoring/evaluation
- cruise effects calculation
- Form A/B/C creation and replacement workflows
- email sending and template reading
- CSV/file helpers
- database seeding
- OpenTelemetry and infrastructure configuration

After the final convergence cleanup pass, the live request path uses direct EF Core
throughout. Catalog, detail, export, lifecycle, supervisor-review, current-publication,
role-management, and shared Form A/B/C workflows all use focused slices/services with
query extensions kept only for reusable include graphs.

## Use-Case File Shape

Each use-case file should contain the pieces that change together:

- endpoint handler method
- request contract, if the endpoint accepts a body
- response contract, if the endpoint returns data
- validator, if validation is specific to that endpoint
- mapping call or small mapper function
- workflow logic, unless it is shared by several use cases

`*Endpoints.cs` files should be boring. They should map route groups, attach
authorization, attach filters, set tags/OpenAPI metadata, and reference use-case
handlers.

Prefer this direction:

```text
Api/Cruises/GetCruise.cs
Api/Cruises/ListCruises.cs
Api/Cruises/CreateCruise.cs
```

Avoid this as the default:

```text
Api/Cruises/CruisesService.cs   // every cruise operation grows here forever
```

It is still fine to extract a local service when several use cases share a real
workflow, for example `CruisePlanningService` or `ApplicationScoringService`.

## Results, Mapping, And Validation

Endpoints should return `TypedResults` or `Results<T1, T2, ...>` so OpenAPI metadata
stays accurate and return types stay explicit. Do not introduce a custom
`ApiResult<T>` that every endpoint must translate.

Use `ProblemDetails` through the platform error pipeline for failures. Expected
business failures can be represented with a small internal domain/application result
type, but the endpoint should convert them to typed HTTP results at the boundary.

Use source-generated mapping where mapping becomes repetitive. Mapperly is the
preferred direction for v2 because it keeps mapping explicit at compile time without
runtime reflection. Hand-written mapping is still acceptable for very small or
unusual mappings.

Use .NET validation for simple request rules and endpoint-level validators for
cross-field or business-adjacent validation. Validation failures should produce the
same `ProblemDetails` shape across the API.

## Cross-Cutting Concerns

Removing MediatR means these concerns must have an explicit replacement:

| Concern | v2 strategy |
| --- | --- |
| Validation | Built-in validation and/or endpoint filters per route group |
| Errors | Global exception handler plus `ProblemDetails` mapping |
| Authorization | Named policies plus resource/business authorization services |
| Transactions | Endpoint filter or explicit EF Core transaction helper for multi-step writes |
| Logging | ASP.NET request logging plus structured logs inside use-case handlers |
| Caching | Output caching only for safe GET endpoints that benefit from it |
| Rate limiting | Built-in rate limiting for auth and public/sensitive endpoints |
| Idempotency | `Idempotency-Key` filter for risky repeatable writes where duplicate submission matters |
| OpenAPI | .NET native OpenAPI generation, typed results, route names, summaries, and one OpenAPI document per API version |

Do not add every filter to every endpoint by default. Add the concern where the
workflow needs it and make that visible in the endpoint registration.

Each cross-cutting concern needs a small implementation decision before it is used.
That does not mean designing a large framework up front. It means writing down the
rule that prevents every endpoint from solving the same problem differently:

- Validation: which request types use endpoint filters, which use built-in
  validation, and what the validation `ProblemDetails` payload looks like.
- Authorization: which checks are simple role policies and which checks require a
  resource-aware service that hides unauthorized resources as `404`.
- Transactions: which multi-step writes use an explicit EF transaction helper and
  which simple writes rely on one `SaveChangesAsync`.
- Idempotency: which operations accept `Idempotency-Key`, where completed operation
  keys are stored, how long they live, and whether the stored response is replayed.
- Rate limiting: which routes are limited first, especially login, refresh, password
  reset, registration, email confirmation resend, and anonymous supervisor routes.
- Optimistic concurrency: which mutable resources get `ETag`/`If-Match`, what entity
  row version backs the token, and what response is returned for stale writes.

## Dependency Registration

Keep startup small and readable:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddConfigurationOptions(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApi();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi("v2", options =>
{
    options.ShouldInclude = description => description.GroupName == "v2";
});
builder.Services
    .AddApiVersioning(options =>
    {
        options.DefaultApiVersion = new ApiVersion(2, 0);
        options.AssumeDefaultVersionWhenUnspecified = false;
        options.ReportApiVersions = true;
        options.ApiVersionReader = new UrlSegmentApiVersionReader();
    })
    .AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'V";
        options.SubstituteApiVersionInUrl = true;
    });
builder.Services.AddValidation();
builder.Services.AddOpenTelemetry(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi("/openapi/{documentName}.json");
    app.MapScalarApiReference(options =>
    {
        options
            .WithTitle("ResearchCruiseApp API")
            .WithOpenApiRoutePattern("/openapi/{documentName}.json")
            .AddDocument("v2", "ResearchCruiseApp API v2");
    });
}

app.MapApi();
app.MapHealthChecks("/health");
app.MapGet("/version", VersionEndpoint.Handle);

await app.InitializeDatabase();
await app.RunAsync();
```

Use .NET's native OpenAPI support for v2 (`Microsoft.AspNetCore.OpenApi` with
`AddOpenApi`/`MapOpenApi`). Do not carry Swashbuckle into the v2 rewrite unless a
specific missing feature forces it. Use Scalar as the development API reference UI.
If build-time OpenAPI output becomes part of CI or later generated frontend clients,
add `Microsoft.Extensions.ApiDescription.Server` and emit the v2 document from the
backend build.

`MapApi` should be the atlas of the versioned API surface:

```csharp
public static IEndpointRouteBuilder MapApi(this IEndpointRouteBuilder app)
{
    var api = app.NewVersionedApi("ResearchCruiseApp");

    var v2 = api
        .MapGroup("/v{version:apiVersion}")
        .HasApiVersion(2.0)
        .WithGroupName("v2");

    var account = v2.MapGroup("/account").WithTags("Account");
    Authentication.Map(account);
    Registration.Map(account);
    PasswordRecovery.Map(account);
    CurrentUser.Map(account);
    CurrentPublications.Map(account);
    CurrentCruiseEffects.Map(account);

    var users = v2.MapGroup("/users").WithTags("Users");
    UserDirectory.Map(users);
    UserProfile.Map(users);
    UserAcceptance.Map(users);
    UserRoles.Map(users);
    UserCruiseEffects.Map(users);

    var cruises = v2.MapGroup("/cruises").WithTags("Cruises");
    CruiseCatalog.Map(cruises);
    CruiseDetails.Map(cruises);
    CruiseLifecycle.Map(cruises);
    CruisePlanning.Map(cruises);
    CruiseExport.Map(cruises);

    var applications = v2.MapGroup("/applications").WithTags("Applications");
    ApplicationCatalog.Map(applications);
    ApplicationCruise.Map(applications);
    ApplicationEvaluation.Map(applications);
    ApplicationDecision.Map(applications);
    ApplicationFormContext.Map(applications);
    ApplicationFormA.Map(applications);
    ApplicationFormB.Map(applications);
    ApplicationFormC.Map(applications);
    SupervisorReview.Map(applications);

    return app;
}
```

## API Principles

- Use `/v2` for the rewritten public contract.
- Use `Asp.Versioning.Http` with `UrlSegmentApiVersionReader` rather than
  hard-coding version behavior into unrelated route code.
- Do not include `/api` in backend route definitions.
- Keep `/health` and `/version` unversioned.
- Keep top-level groups small: `/v2/account`, `/v2/users`, `/v2/cruises`,
  `/v2/applications`.
- Use lowercase kebab-case route segments.
- Put current-user resources under `/v2/account/me`.
- Put privileged management of other users under `/v2/users`.
- Put actual ship cruises under `/v2/cruises`.
- Put cruise application workflow and forms under `/v2/applications`.
- Keep Form A/B/C under the application; forms are not independent top-level
  resources.
- Keep `form-a-context` and `form-b-context` bundled to avoid oversplitting.
- Move mutating flags such as `isDraft` and `accept` from query strings into request
  bodies.
- Use stable machine values for workflow statuses and map localized display labels in
  the frontend.
- Keep email confirmation as `GET /v2/account/confirm-email` even though it changes
  state, because confirmation links are clicked directly from email clients. Treat this
  as a deliberate exception for link-driven account confirmation.
- Email confirmation tokens must be single-use, short-lived, and safe to retry after
  success by showing an already-confirmed result.
- Return `ProblemDetails` for errors.
- Prefer explicit request and response contracts per feature.
- Use pagination on list endpoints that can grow beyond UI-friendly sizes.
- Use optimistic concurrency for mutable resources where lost updates are plausible.

## Contract Policies

List endpoints should not return unbounded collections once data can grow beyond what
the UI can reasonably render. Use a simple response envelope when pagination is
needed:

```json
{
  "items": [],
  "nextCursor": null
}
```

Use cursor pagination for large or frequently changing collections. Offset/page
pagination is acceptable for small admin screens where stable ordering and scale are
not a concern.

For mutable resources where two users can plausibly edit the same record, use
optimistic concurrency. The preferred contract is `ETag` on reads and `If-Match` on
updates, backed by an EF Core row version where the entity warrants it. Return `412
Precondition Failed` for stale updates.

For mutating endpoints that can be accidentally retried by the frontend or browser,
support an `Idempotency-Key` header. This matters most for create/import/workflow
actions such as application creation, publication import, and automatic cruise
planning.

## Frontend Update Strategy For The First Rewrite

Do not make generated frontend clients part of the first backend rewrite. The first
rewrite should keep the existing Axios client, hand-written TanStack Query hooks, and
manual DTO files, but those DTO files may change to match a better v2 contract. The
minimum frontend work should be:

- change hook URLs from v1 routes to v2 routes
- move mutation flags such as `isDraft` and `accept` from query strings into request
  bodies
- update request/response DTO types and UI adapters where the v2 contract changes
- update supervisor review hooks to consume one bundled response instead of two
  separate calls
- update Playwright route mocks to match v2 routes

This means the v2 backend may use better endpoint names, better request bodies, better
response contracts, and better internal code structure. Frontend DTO changes are
allowed when they make the system easier to understand or remove legacy awkwardness.
Avoid gratuitous frontend churn that does not improve the v2 contract.

If a contract change creates a large frontend rewrite, prefer one of these small
bridges while keeping the v2 contract honest:

- add a thin frontend hook adapter that maps the new v2 shape back to the existing UI
  model
- update one screen-level context/provider at a time instead of threading raw API
  objects through many components
- temporarily keep a local frontend mapper for a high-risk screen and remove it after
  the UI model catches up

After the backend patterns settle, add a second phase for OpenAPI-to-frontend code
generation. That phase can remove the hand-written hooks and DTOs area by area.

## Full v2 API

### Account

Session, account lifecycle, recovery, current user profile, current user publications,
and current user cruise effects.

```http
POST /v2/account/login
POST /v2/account/refresh

POST /v2/account/register
GET /v2/account/confirm-email
POST /v2/account/resend-confirmation-email
POST /v2/account/password-reset-request
POST /v2/account/password-reset

GET /v2/account/me
PATCH /v2/account/me/password

GET /v2/account/me/publications
POST /v2/account/me/publications/import
DELETE /v2/account/me/publications/{publicationId}
DELETE /v2/account/me/publications

GET /v2/account/me/cruise-effects
```

### Users

Privileged user management for administrators and shipowners.

```http
GET /v2/users
POST /v2/users
GET /v2/users/{userId}
PUT /v2/users/{userId}
DELETE /v2/users/{userId}

PUT /v2/users/{userId}/acceptance
DELETE /v2/users/{userId}/acceptance

PUT /v2/users/{userId}/roles/{roleName}
DELETE /v2/users/{userId}/roles/{roleName}

GET /v2/users/{userId}/cruise-effects
```

### Cruises

Actual ship cruises, schedule management, lifecycle actions, exports, automatic
planning, and blockade periods.

```http
GET /v2/cruises
POST /v2/cruises
GET /v2/cruises/{cruiseId}
PATCH /v2/cruises/{cruiseId}
DELETE /v2/cruises/{cruiseId}

PUT /v2/cruises/{cruiseId}/confirmation
DELETE /v2/cruises/{cruiseId}/confirmation
PUT /v2/cruises/{cruiseId}/completion

POST /v2/cruises/auto-plan
GET /v2/cruises/export?year=2026
GET /v2/cruises/blockades?year=2026
```

### Applications

Cruise applications, application forms, form context, evaluation, decisions,
supervisor review, and links from applications to planned cruises.

```http
GET /v2/applications
POST /v2/applications
GET /v2/applications/{applicationId}

GET /v2/applications/for-cruise-planning
GET /v2/applications/{applicationId}/cruise

GET /v2/applications/{applicationId}/evaluation
PATCH /v2/applications/{applicationId}/evaluation

PUT /v2/applications/{applicationId}/decision

GET /v2/applications/form-a-context
GET /v2/applications/form-b-context

GET /v2/applications/{applicationId}/form-a
PUT /v2/applications/{applicationId}/form-a

GET /v2/applications/{applicationId}/form-b
PUT /v2/applications/{applicationId}/form-b
PUT /v2/applications/{applicationId}/form-b/refill

GET /v2/applications/{applicationId}/form-c
PUT /v2/applications/{applicationId}/form-c
PUT /v2/applications/{applicationId}/form-c/refill
PATCH /v2/applications/{applicationId}/form-c/effects

GET /v2/applications/{applicationId}/supervisor-review?code=...
PUT /v2/applications/{applicationId}/supervisor-review/decision
```

### Operations

```http
GET /health
GET /version
```

## Context Endpoints

The current `InitValues` endpoints are not just simple dropdown options. They return
screen context used for rendering, validation, autocomplete, and printing.

`GET /v2/applications/form-a-context` should include:

- cruise managers
- deputy managers
- valid years
- ship usage values
- standard SPUB task names
- active research areas
- cruise goals
- active UG units
- current user's historical research tasks
- current user's historical contracts
- current user's historical guest institutions
- current user's historical SPUB tasks
- current user's saved publications

`GET /v2/applications/form-b-context` should include:

- active ship equipment

The context endpoints are screen aggregators. They are intentionally bundled for the
first v2 pass to avoid oversplitting, but the implementation should not hide the
underlying queries in a way that prevents later extraction. If payload size, caching,
or partial UI loading becomes a problem, split the reusable pieces into focused
read endpoints without changing the form workflow endpoints.

Supervisor review should stay bundled:

```http
GET /v2/applications/{applicationId}/supervisor-review?code=...
```

That response should contain the Form A data plus the reduced context needed to render
the supervisor review page, rather than introducing a separate supervisor context route.

## Current API Comparison

### Account and Current User

| Current route | Current use | v2 route |
| --- | --- | --- |
| `POST /account/login` | Login | `POST /v2/account/login` |
| `POST /account/refresh` | Refresh tokens | `POST /v2/account/refresh` |
| `POST /account/register` | Register account | `POST /v2/account/register` |
| `GET /account/emailConfirmation` | Confirm email | `GET /v2/account/confirm-email` |
| `POST /account/emailConfirmationRequest` | Resend confirmation email | `POST /v2/account/resend-confirmation-email` |
| `POST /account/forgotPassword` | Request password reset | `POST /v2/account/password-reset-request` |
| `POST /account/passwordReset` | Reset password | `POST /v2/account/password-reset` |
| `GET /account` | Current user | `GET /v2/account/me` |
| `PATCH /account/password` | Change own password | `PATCH /v2/account/me/password` |

### Current User Publications and Cruise Effects

| Current route | Current use | v2 route |
| --- | --- | --- |
| `GET /api/cruiseApplications/ownPublications` | Current user's publications | `GET /v2/account/me/publications` |
| `POST /api/cruiseApplications/ownPublications` | Import current user's publications | `POST /v2/account/me/publications/import` |
| `DELETE /api/cruiseApplications/ownPublications/{publicationId}` | Delete one current-user publication | `DELETE /v2/account/me/publications/{publicationId}` |
| `DELETE /api/cruiseApplications/ownPublications` | Delete all current-user publications | `DELETE /v2/account/me/publications` |
| `GET /api/CruiseApplications/effectsEvaluations` | Current user's cruise effects | `GET /v2/account/me/cruise-effects` |

### Users

| Current route | Current use | v2 route |
| --- | --- | --- |
| `GET /users` | List users | `GET /v2/users` |
| `POST /users` | Create user | `POST /v2/users` |
| `GET /users/{id}` | Get user | `GET /v2/users/{userId}` |
| `PUT /users/{id}` | Update user | `PUT /v2/users/{userId}` |
| `DELETE /users/{id}` | Delete user | `DELETE /v2/users/{userId}` |
| `PATCH /users/unaccepted/{id}` | Accept user | `PUT /v2/users/{userId}/acceptance` |
| `PATCH /users/{id}/deactivate` | Deactivate/unaccept user | `DELETE /v2/users/{userId}/acceptance` |
| `PATCH /users/{id}/roles` | Toggle user role | `PUT /v2/users/{userId}/roles/{roleName}` and `DELETE /v2/users/{userId}/roles/{roleName}` |
| `GET /api/CruiseApplications/{userId}/effectsEvaluations` | User's cruise effects | `GET /v2/users/{userId}/cruise-effects` |

### Cruises

| Current route | Current use | v2 route |
| --- | --- | --- |
| `GET /api/Cruises` | List cruises | `GET /v2/cruises` |
| `POST /api/Cruises` | Create cruise | `POST /v2/cruises` |
| `GET /api/Cruises/{id}` | Get cruise | `GET /v2/cruises/{cruiseId}` |
| `PATCH /api/Cruises/{id}` | Update cruise | `PATCH /v2/cruises/{cruiseId}` |
| `DELETE /api/Cruises/{id}` | Delete cruise | `DELETE /v2/cruises/{cruiseId}` |
| `PUT /api/Cruises/{id}/confirm` | Confirm cruise | `PUT /v2/cruises/{cruiseId}/confirmation` |
| `PUT /api/Cruises/{id}/revert` | Revert confirmation/status | `DELETE /v2/cruises/{cruiseId}/confirmation` |
| `PUT /api/Cruises/{id}/end` | Mark cruise completed | `PUT /v2/cruises/{cruiseId}/completion` |
| `PUT /api/Cruises/autoAdded` | Auto-plan cruises | `POST /v2/cruises/auto-plan` |
| `GET /api/Cruises/csv?year=2026` | Export cruises | `GET /v2/cruises/export?year=2026` |
| `GET /api/Cruises/blockades/{year}` | Get blockade periods | `GET /v2/cruises/blockades?year=2026` |

### Applications

| Current route | Current use | v2 route |
| --- | --- | --- |
| `GET /api/CruiseApplications` | List applications | `GET /v2/applications` |
| `POST /api/CruiseApplications?isDraft=...` | Create application/Form A | `POST /v2/applications` |
| `GET /api/CruiseApplications/{id}` | Get application | `GET /v2/applications/{applicationId}` |
| `GET /api/CruiseApplications/forCruise` | Applications eligible for cruise planning | `GET /v2/applications/for-cruise-planning` |
| `GET /api/CruiseApplications/{id}/cruise` | Get cruise linked to application | `GET /v2/applications/{applicationId}/cruise` |
| `GET /api/CruiseApplications/{id}/evaluation` | Get application evaluation | `GET /v2/applications/{applicationId}/evaluation` |
| `PATCH /api/CruiseApplications/{id}/evaluation` | Update application evaluation | `PATCH /v2/applications/{applicationId}/evaluation` |
| `PATCH /api/CruiseApplications/{id}/answer?accept=...` | Accept/reject application | `PUT /v2/applications/{applicationId}/decision` |

### Application Forms

| Current route | Current use | v2 route |
| --- | --- | --- |
| `GET /forms/InitValues/A` | Form A context | `GET /v2/applications/form-a-context` |
| `GET /forms/InitValues/B` | Form B context | `GET /v2/applications/form-b-context` |
| `GET /api/CruiseApplications/{id}/formA` | Get Form A | `GET /v2/applications/{applicationId}/form-a` |
| `PUT /api/CruiseApplications/{id}/FormA?isDraft=...` | Save Form A | `PUT /v2/applications/{applicationId}/form-a` |
| `GET /api/CruiseApplications/{id}/formB` | Get Form B | `GET /v2/applications/{applicationId}/form-b` |
| `PUT /api/CruiseApplications/{id}/FormB?isDraft=...` | Save Form B | `PUT /v2/applications/{applicationId}/form-b` |
| `PUT /api/CruiseApplications/{id}/FormB/Refill` | Send Form B back for editing | `PUT /v2/applications/{applicationId}/form-b/refill` |
| `GET /api/CruiseApplications/{id}/FormC` | Get Form C | `GET /v2/applications/{applicationId}/form-c` |
| `PUT /api/CruiseApplications/{id}/FormC?isDraft=...` | Save Form C | `PUT /v2/applications/{applicationId}/form-c` |
| `PUT /api/CruiseApplications/{id}/FormC/Refill` | Send Form C back for editing | `PUT /v2/applications/{applicationId}/form-c/refill` |
| `PATCH /api/CruiseApplications/{id}/FormC/Effects` | Update Form C cruise effects | `PATCH /v2/applications/{applicationId}/form-c/effects` |

### Supervisor Review

| Current route | Current use | v2 route |
| --- | --- | --- |
| `GET /forms/InitValuesForSupervisor/A?cruiseApplicationId=...&supervisorCode=...` | Reduced supervisor Form A context | Bundled into `GET /v2/applications/{applicationId}/supervisor-review?code=...` |
| `GET /api/CruiseApplications/{id}/formAForSupervisor?supervisorCode=...` | Supervisor Form A view | `GET /v2/applications/{applicationId}/supervisor-review?code=...` |
| `PATCH /api/CruiseApplications/{id}/supervisorAnswer?accept=...&supervisorCode=...` | Supervisor decision | `PUT /v2/applications/{applicationId}/supervisor-review/decision` |

### Operations

| Current route | Current use | v2 route |
| --- | --- | --- |
| `GET /health` | Health check | `GET /health` |
| `GET /version` | Backend version | `GET /version` |

## Endpoint Migration Example

This example shows the desired migration shape for:

```http
GET /api/Cruises/{id}
```

to:

```http
GET /v2/cruises/{cruiseId}
```

### Current Shape

The controller only receives the request, sends a MediatR query, and maps a custom
result type to an HTTP response:

```csharp
[Authorize(
    Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}, {RoleName.ShipCrew}"
)]
[HttpGet("{id:guid}")]
public async Task<IActionResult> GetCruise([FromRoute] Guid id)
{
    var result = await mediator.Send(new GetCruiseQuery(id));
    return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
}
```

The handler then loads the cruise, checks visibility, and maps to a DTO:

```csharp
public class GetCruiseHandler(
    ICruiseDtosFactory cruiseDtosFactory,
    ICruisesRepository cruisesRepository,
    IUserPermissionVerifier userPermissionVerifier
) : IRequestHandler<GetCruiseQuery, Result<CruiseDto>>
{
    public async Task<Result<CruiseDto>> Handle(
        GetCruiseQuery request,
        CancellationToken cancellationToken
    )
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplicationsWithFormAContent(
            request.Id,
            cancellationToken
        );
        if (cruise is null)
            return Error.ResourceNotFound();

        if (await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
            return await cruiseDtosFactory.Create(cruise);

        return Error.ResourceNotFound();
    }
}
```

This creates at least four moving pieces for a simple read endpoint:

- controller action
- query record
- handler class
- repository method
- factory method

Some of those may still represent useful logic, but the request path is too indirect.

### Target Shape

Endpoint registration should stay close to the use case, while `ApiComposition` only
assembles the versioned root and top-level route groups:

```csharp
public static class ApiComposition
{
    public static IEndpointRouteBuilder MapApi(this IEndpointRouteBuilder app)
    {
        var api = app.NewVersionedApi("ResearchCruiseApp");

        var cruises = api
            .MapGroup("/v{version:apiVersion}/cruises")
            .HasApiVersion(2.0)
            .WithTags("Cruises")
            .RequireAuthorization(Policies.AnyKnownUser);

        GetCruise.Map(cruises);

        return app;
    }
}
```

The use-case file owns the handler, response contract, query, authorization check,
and HTTP result type:

```csharp
internal static class GetCruise
{
    public static void Map(RouteGroupBuilder cruises)
    {
        cruises
            .MapGet("/{cruiseId:guid}", Handle)
            .WithName("GetCruise")
            .WithSummary("Gets one cruise.")
            .Produces<CruiseResponse>()
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static async Task<Results<Ok<CruiseResponse>, NotFound>> Handle(
        Guid cruiseId,
        ApplicationDbContext dbContext,
        CruiseAuthorizationService authorization,
        CruiseMapper mapper,
        CancellationToken cancellationToken
    )
    {
        var cruise = await dbContext
            .Cruises
            .Include(cruise => cruise.CruiseApplications)
                .ThenInclude(application => application.FormA)
            .AsSplitQuery()
            .SingleOrDefaultAsync(cruise => cruise.Id == cruiseId, cancellationToken);

        if (cruise is null)
        {
            return TypedResults.NotFound();
        }

        if (!await authorization.CanView(cruise, cancellationToken))
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(mapper.ToResponse(cruise));
    }
}
```

Keep `ApiComposition.cs` composition-only. Do not put EF Core queries, validators,
request DTOs, or business rules there.

Mapping should be explicit at compile time. Prefer Mapperly for repetitive mappings;
small unusual mappings can stay hand-written:

```csharp
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class CruiseMapper
{
    public partial CruiseResponse ToResponse(Cruise cruise);
}
```

Use this migration shape as the default:

- endpoint module owns routing, OpenAPI metadata, authorization policy, and HTTP mapping
- use-case file owns the use case
- EF Core query is local unless it is reused in multiple meaningful workflows
- mapper is explicit at compile time for response contracts
- no controller, MediatR query, MediatR handler, or generic repository is needed
- no custom `ApiResult<T>` wrapper is needed for endpoint responses

## Big-Swing Rewrite Workflow

The preferred implementation approach is one large backend rewrite branch rather than
a long-running feature-by-feature production cutover. That fits this codebase because
the current API appears to be consumed by the local frontend rather than a broad
external client ecosystem, and because keeping both v1 and v2 fully polished for a
long time would preserve much of the ceremony this rewrite is trying to remove.

Use this workflow:

1. Inventory frontend usage and current backend routes before deleting anything.
2. Create the v2 API composition, native OpenAPI, Scalar UI, error mapping,
   validation pattern, authorization policies, and transaction helper early.
3. Port all backend endpoint groups to v2 in one branch: account, users, cruises, and
   applications.
4. Define cleaner v2 request and response contracts, even where that requires
   frontend DTO changes.
5. Update the existing frontend hooks, DTOs, and screen adapters after the backend
   route surface is in place.
6. Remove controllers, MediatR command/query handlers, trivial repositories, and
   trivial factories once the v2 path owns the behavior.
7. Run build checks, OpenAPI review, focused smoke tests, and manual UI smoke flows.
8. Polish naming, DTO boundaries, and extracted services after the main behavior is
   working end to end.

Avoid a second schema or duplicated persistence model unless there is a concrete data
migration requirement. The rewrite should continue to use the same SQL Server
database, EF Core model, migrations, and Identity tables.

Keep v1 routes only if a real compatibility need appears during implementation. If
there are no external consumers, deleting v1 during the big-swing branch is acceptable
once the frontend has moved to v2. If a temporary compatibility route is needed, make
it a small wrapper around the v2 use case and mark it for deletion.

## Cutover

Cut over by merging the branch when the backend and frontend are both using v2. Do
not rely on feature flags or proxy routing as the primary strategy unless deployment
constraints require it. The cutover checklist should be:

- `dotnet build`
- frontend type/build check
- native OpenAPI document review at `/openapi/v2.json`
- Scalar review at `/scalar`
- focused smoke tests for the established endpoint pattern
- manual smoke flow through the main screens
- no remaining frontend calls to old routes

## Deletion Rules

Delete code when all of these are true:

- it is not referenced by v2
- it is not needed by the still-running v1 compatibility surface
- it has no distinct business rule
- it only forwards, wraps simple EF Core, or maps one object mechanically

Keep code when any of these are true:

- it encodes business policy
- it protects sensitive access rules
- it handles Identity, tokens, email, files, or infrastructure concerns
- it avoids real duplication across multiple feature workflows
- removing it would make a feature service harder to read

## Verification And Tests

Do not add backend automated tests as part of this planning/documentation step.

For v2 implementation work, do not try to build the full backend test suite before
the new endpoint patterns exist. First establish the API composition, error mapping,
validation, authorization, and one or two representative endpoint styles. Then add a
small test harness that exercises those patterns through the real ASP.NET pipeline.
The baseline during the big-swing rewrite should be:

- `dotnet build`
- OpenAPI output review
- frontend API usage review
- WebApplicationFactory-based smoke tests for representative endpoint groups once the
  pattern is stable
- SQL Server-backed integration tests only for workflows where EF behavior is central
  or risky
- manual smoke flow through the affected screens

Important smoke flows:

- login and token refresh
- current user profile
- user management
- cruise list/detail/create/update
- application list/detail
- Form A create/edit
- Form B and Form C save/read/refill
- supervisor review and decision
- publication import/delete
- cruise effects list

Do not block the first rewrite on a full test suite. After the new backend shape is
working end to end, expand tests around the patterns that survived contact with the
real implementation.

## Notes

- The old `/api` prefix is not included in backend route definitions. External proxy
  routing can add that prefix if needed.
- `effectsEvaluations` should be renamed to `cruise-effects`; it represents
  post-cruise research effects and points, not the same thing as application
  evaluation.
- `form-a-context` and `form-b-context` are intentionally bundled to avoid
  oversplitting the API.
- Draft/submission flags such as `isDraft` should move from query strings into request
  bodies where the endpoint mutates state.
- Boolean decisions such as `accept=true` should move into request bodies.
- The rewrite should prefer fewer files with real responsibility over many tiny files
  that only pass data to the next layer.
