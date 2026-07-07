# Sentry integration

This project uses [Sentry](https://sentry.io) for error monitoring and performance tracing across the React frontend and ASP.NET Core backend, with session replay in the frontend. Kubernetes manifests under `kubernetes/` may still reference the legacy OTLP setup until a follow-up overlay change.

## Agent skills (AI assistants)

Official Sentry skills come from **[getsentry/sentry-for-ai](https://github.com/getsentry/sentry-for-ai)**. They are **not committed** to git — only **`skills-lock.json`** is, with install paths gitignored (`.agents/skills/`, `.cursor/`).

```bash
pnpm skills:install
# or: mise run skills:install
```

| Task                              | Skill                                         |
| --------------------------------- | --------------------------------------------- |
| React 19 + Vite frontend          | `sentry-react-sdk`                            |
| ASP.NET Core 10 backend           | `sentry-dotnet-sdk`                           |
| Fix production issues from Sentry | `sentry-fix-issues`                           |
| PR / code review with Sentry      | `sentry-pr-code-review`, `sentry-code-review` |

Docs: [Agent Skills](https://docs.sentry.io/ai/agent-skills/).

## What is implemented

### Frontend (`frontend/`)

- **`@sentry/react`** initialized from `main.tsx` through `frontend/src/lib/sentry.ts`
- **React 19** error hooks via `reactErrorHandler()` on `createRoot`
- **TanStack Router** navigation tracing via `tanstackRouterBrowserTracingIntegration`
- **Session Replay** with masked text/inputs and blocked media
- **Distributed tracing** to the configured API
- **User context** on login/profile load (`setSentryUser` in `UserContextProvider`)
- **Form breadcrumbs** via `trackFormSubmit` (replaces removed HyperDX hooks); this is diagnostic context rather than
  standalone outcome tracking. See the [TanStack Form observability design](tanstack-form-observability.md) for the
  proposed replacement.
- **TanStack root error component** handles route and loader recovery, while a minimal **fatal error boundary** covers
  provider and pre-router render failures
- **Centralized React error reporting** via all three `createRoot` hooks (React 19): Sentry handles uncaught, caught,
  and recoverable errors when configured; otherwise React retains its default console reporting
- **Source maps** uploaded in CI when `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` are set (`@sentry/vite-plugin`)
- **Runtime configuration**: `frontend/docker-entrypoint.d/90-runtime-config.sh` exposes `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE`, and `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` to the browser when the container starts. The environment and release come from the environment-specific build; leave the DSN unset to disable Sentry.

Key files: `frontend/src/lib/sentry.ts`, `frontend/src/router.tsx`, `frontend/vite.config.ts`.

### Backend (`backend/ResearchCruiseApp/`)

- **`Sentry.AspNetCore`** via `builder.AddResearchCruiseAppSentry()` in `Program.cs`
- **Automatic ASP.NET Core request tracing**
- **JWT user enrichment** after authentication (`SentryUserMiddleware`)
- **ILogger → Sentry** breadcrumbs/events using SDK defaults
- **Health check transactions** filtered out
- **Runtime-configurable trace sampling**, defaulting to 10% in every environment
- **Debug symbol upload** on Release builds when `SENTRY_AUTH_TOKEN` is present

Key files: `Infrastructure/Sentry/SentryConfiguration.cs`, `Infrastructure/Sentry/SentryUserMiddleware.cs`.

### CI/CD & deployment

- **GitHub Actions** (`build-and-deploy.yaml`, `deploy-komodo-staging.yaml`): frontend source maps + backend symbols when secrets are configured
- **Docker**: both images bake in `APP_ENVIRONMENT`; release identifiers are also set at build time
- **Compose**: `docker/docker-compose.dev.yml`, `docker/compose.staging-app.yaml` pass `Sentry__*` env to backend

## Environment variables

Copy [`.env.sentry.example`](../.env.sentry.example) to `.env.sentry` for local values. **Never commit DSNs or auth tokens.**

| Variable                    | Where                                                   | Purpose                                   |
| --------------------------- | ------------------------------------------------------- | ----------------------------------------- |
| `SENTRY_DSN`                | Frontend container runtime / backend runtime            | Project DSN (or use split vars below)     |
| `SENTRY_DSN_FRONTEND`       | Compose env (mapped to frontend `SENTRY_DSN`)           | Frontend-only DSN                         |
| `SENTRY_DSN_BACKEND`        | Compose env (mapped to backend `Sentry__Dsn`)           | Backend-only DSN (optional)               |
| `SENTRY_TRACES_SAMPLE_RATE` | Frontend and backend runtime                            | Trace sampling; defaults to `0.1`         |
| `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | Frontend container runtime                     | Session Replay sampling; defaults to `0.1` (staging compose defaults to `1`) |
| `APP_ENVIRONMENT`           | Frontend and backend image build                        | `local`, `staging`, `production`          |
| `SENTRY_RELEASE`            | Frontend and backend image build                        | Git SHA or app version                    |
| `SENTRY_AUTH_TOKEN`         | CI only (GitHub secret)                                 | Source map / symbol upload                |
| `SENTRY_ORG`                | Dockerfile ARG default (`cruiseteam`)                   | Organization slug; override via build arg |
| `SENTRY_PROJECT`            | Dockerfile ARG (`frontend-staging` / `backend-staging`) | Project slug; override per image build    |

The backend image exposes `APP_ENVIRONMENT` to the SDK as `SENTRY_ENVIRONMENT`. Backend runtime options also read `Sentry:*` keys from `appsettings.json` / `Sentry__*` environment variables.

## HyperDX parity mapping

| Removed HyperDX / OTEL    | Sentry replacement                                           |
| ------------------------- | ------------------------------------------------------------ |
| `initializeHyperDX()`     | `initializeSentry()` in `lib/sentry.ts`                      |
| `attachErrorBoundary`     | Conditional `reactErrorHandler()` on `createRoot` (React 19) |
| `setHyperDXUser(user)`    | `setSentryUser(user)`                                        |
| `trackFormSubmit(...)`    | `trackFormSubmit(...)` → `Sentry.addBreadcrumb`              |
| `AddOpenTelemetry` + OTLP | Native `Sentry.AspNetCore` tracing + logging                 |

## Follow-up (not in app code)

- Replace OTLP env in `kubernetes/overlays/staging/backend/configmap-patch.yaml` with Sentry env
- Production will run on a **self-hosted Sentry instance** — see the
  [on-prem migration plan](sentry-on-prem-migration.md) for the handoff steps

## References

- [Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry ASP.NET Core](https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/)
- [getsentry/sentry-for-ai](https://github.com/getsentry/sentry-for-ai)
