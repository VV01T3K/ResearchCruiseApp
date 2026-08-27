# ResearchCruiseApp

ResearchCruiseApp manages research-cruise applications for the research vessel *Oceanograf* at the University of Gdańsk. It supports the workflow from a scientific cruise request (Form A), through operational planning (Form B), to post-cruise reporting (Form C), with separate permissions for cruise managers, supervisors, and the shipowner's office.

## Stack and layout

- **Frontend:** React, TypeScript, TanStack Router/Query/Form, Vite+, Tailwind CSS, Playwright, and Vitest.
- **Backend:** ASP.NET Core on .NET 10, SQL Server, Entity Framework Core, OpenAPI, and Sentry.
- `frontend/src` — application UI, generated API client, validation schemas, and stories.
- `frontend/tests` — Playwright end-to-end tests; `frontend/TESTING.md` explains test boundaries and fixtures.
- `backend/ResearchCruiseApp` — API, application/domain logic, persistence, migrations, and email templates.
- `backend/ResearchCruiseApp.Tests` — backend integration and domain tests.
- `docker` — local, staging, and production Compose definitions.
- `kubernetes` — base and staging Kustomize manifests.

## Prerequisites

Install [mise](https://mise.jdx.dev/), Docker with Compose, and Git. The repository pins Bun, pnpm, and .NET versions in [`mise.toml`](./mise.toml).

## Local development

```sh
mise install
vp install
mise run db:up
vp run dev
```

The development stack uses SQL Server on `localhost:1433`, the API on `http://localhost:3000`, and the frontend on `http://localhost:8080`. The first start seeds the database using the defaults in [`docker/docker-compose.dev.yml`](./docker/docker-compose.dev.yml). Stop the database with `mise run db:down`.

To run the complete stack in containers instead:

```sh
docker compose -f docker/docker-compose.dev.yml up --build
```

Do not use the development credentials or secrets in a production deployment.

## Common commands

Run these from the repository root:

| Command | Purpose |
| --- | --- |
| `vp run dev` | Start the frontend and backend in development mode |
| `vp run build` | Build all workspaces |
| `vp run check` | Run frontend checks and backend formatting/build checks |
| `vp run -F frontend test:unit` | Run frontend validation unit tests |
| `vp run -F frontend test` | Run frontend Playwright tests |
| `vp run -F backend test` | Run backend tests |
| `vp run gen` | Regenerate the frontend API client after an API contract change |
| `mise run seed` | Reset the local database and capture seeded credentials in `credentials.log` |

For Playwright’s first run, install Chromium with `vp dlx playwright install --with-deps chromium`. See [`frontend/TESTING.md`](./frontend/TESTING.md) before adding or moving tests.

## Configuration

Local development defaults are defined in the Compose files. For another environment, configure the following variables through the deployment system rather than committing secrets.

| Area | Variables |
| --- | --- |
| Frontend | `API_URL`, `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` |
| Backend | `ConnectionStrings__Database`, `FrontendUrl`, `JWT__Secret`, `JWT__ValidAudience`, `JWT__ValidIssuer`, `JWT__AccessTokenLifetimeSeconds`, `JWT__RefreshTokenLifetimeSeconds` |
| Email | `SmtpSettings__SmtpServer`, `SmtpSettings__SmtpPort`, `SmtpSettings__SmtpUsername`, `SmtpSettings__SmtpPassword`, `SmtpSettings__SenderName` |
| Database/bootstrap | `Database__SeedAutomatically`, `Database__MigrateAutomatically`, `Database__LogUserPasswordsWhenSeeding` |

Sentry is optional. Use the `SENTRY_DSN_FRONTEND` and `SENTRY_DSN_BACKEND` overrides when the two services need separate projects. See [`docs/sentry`](./docs/sentry/) for observability details.

## CI and deployment

GitHub Actions run frontend unit/Playwright tests, frontend checks, and backend formatting/build checks. Container images are built by the workflows in [`.github/workflows`](./.github/workflows/). Deployment configuration lives in [`docker`](./docker/) and [`kubernetes`](./kubernetes/); review the staging and production files before changing environment defaults.

## Further documentation

- [Frontend testing guide](./frontend/TESTING.md)
- [Permission model](./docs/permissions.md)
- [Sentry integration](./docs/sentry/sentry-integration.md)
- [Changelog](./CHANGELOG.md)
