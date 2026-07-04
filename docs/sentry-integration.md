# Sentry integration

This project uses [Sentry](https://sentry.io) for error monitoring, performance tracing, session replay, and structured logging across the React frontend and ASP.NET Core backend. Kubernetes manifests under `kubernetes/` may still reference the legacy OTLP setup until a follow-up overlay change.

## Agent skills (AI assistants)

Official Sentry skills come from **[getsentry/sentry-for-ai](https://github.com/getsentry/sentry-for-ai)**. They are **not committed** to git — only **`skills-lock.json`** is, with install paths gitignored (`.agents/skills/`, `.cursor/`).

```bash
pnpm skills:install
# or: mise run skills:install
```

| Task | Skill |
|------|--------|
| React 19 + Vite frontend | `sentry-react-sdk` |
| ASP.NET Core 10 backend | `sentry-dotnet-sdk` |
| Fix production issues from Sentry | `sentry-fix-issues` |
| PR / code review with Sentry | `sentry-pr-code-review`, `sentry-code-review` |

Docs: [Agent Skills](https://docs.sentry.io/ai/agent-skills/).

## What is implemented

### Frontend (`frontend/`)

- **`@sentry/react`** initialized in `frontend/src/instrument.ts` (imported first from `main.tsx`)
- **React 19** error hooks via `reactErrorHandler()` on `createRoot`
- **TanStack Router** navigation tracing via `tanstackRouterBrowserTracingIntegration`
- **Session Replay** with masked text/inputs and blocked media
- **Distributed tracing** to the API (`tracePropagationTargets`, `/health` excluded)
- **Console `warn` / `error`** forwarded to Sentry Logs (`consoleLoggingIntegration`)
- **User context** on login/profile load (`setSentryUser` in `UserContextProvider`)
- **Form breadcrumbs** via `trackFormSubmit` (replaces removed HyperDX hooks)
- **Class error boundary** triggers Sentry via `onCaughtError: reactErrorHandler()` registered on `createRoot` (React 19)
- **Source maps** uploaded in CI when `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT_FRONTEND` are set (`@sentry/vite-plugin`)

Key files: `frontend/src/lib/sentry.ts`, `frontend/src/instrument.ts`, `frontend/src/routerInstance.ts`, `frontend/vite.config.ts`.

### Backend (`backend/ResearchCruiseApp/`)

- **`Sentry.AspNetCore`** via `builder.AddResearchCruiseAppSentry()` in `Program.cs`
- **Request tracing** with `UseSentryTracing()`
- **JWT user enrichment** after authentication (`SentryUserMiddleware`)
- **ILogger → Sentry** breadcrumbs/events (`MinimumEventLevel: Warning`)
- **Health check transactions** filtered out
- **Environment-aware sampling** (1.0 local, 0.2 staging, 0.1 production defaults)
- **Optional profiling** sample rate (production default 0.1 when enabled)
- **Debug symbol upload** on Release builds when `SENTRY_AUTH_TOKEN` is present

Key files: `Infrastructure/Sentry/SentryConfiguration.cs`, `Infrastructure/Sentry/SentryUserMiddleware.cs`.

### CI/CD & deployment

- **GitHub Actions** (`build-and-deploy.yaml`, `deploy-komodo-staging.yaml`): frontend source maps + backend symbols when secrets are configured
- **Docker**: `frontend/Dockerfile` and `backend/Dockerfile` accept Sentry build args
- **Compose**: `docker/docker-compose.dev.yml`, `docker/compose.staging-app.yaml` pass `Sentry__*` env to backend

## Environment variables

Copy [`.env.sentry.example`](../.env.sentry.example) to `.env.sentry` for local values. **Never commit DSNs or auth tokens.**

| Variable | Where | Purpose |
|----------|--------|---------|
| `SENTRY_DSN` | Frontend build / backend runtime | Project DSN (or use split vars below) |
| `SENTRY_DSN_FRONTEND` | Frontend Docker / CI | Frontend-only DSN (GitHub secret) |
| `SENTRY_DSN_BACKEND` | Backend runtime / CI | Backend-only DSN (optional) |
| `SENTRY_ENVIRONMENT` | Both | `local`, `staging`, `production` |
| `SENTRY_RELEASE` | Both | Git SHA or app version |
| `SENTRY_TRACES_SAMPLE_RATE` | Both | Performance sampling (e.g. `0.1` in prod) |
| `SENTRY_PROFILES_SAMPLE_RATE` | Backend | Profiling sampling (e.g. `0.1` in prod) |
| `SENTRY_AUTH_TOKEN` | CI only | Source map / symbol upload |
| `SENTRY_ORG` | CI only | Organization slug |
| `SENTRY_PROJECT_FRONTEND` | CI only | Frontend project slug |
| `SENTRY_PROJECT_BACKEND` | CI only | Backend project slug |

Backend also reads `Sentry:*` keys from `appsettings.json` / `Sentry__*` environment variables.

## HyperDX parity mapping

| Removed HyperDX / OTEL | Sentry replacement |
|------------------------|-------------------|
| `initializeHyperDX()` | `Sentry.init()` in `instrument.ts` |
| `attachErrorBoundary` | `reactErrorHandler()` on `createRoot` (React 19) |
| `setHyperDXUser(user)` | `setSentryUser(user)` |
| `trackFormSubmit(...)` | `trackFormSubmit(...)` → `Sentry.addBreadcrumb` |
| `AddOpenTelemetry` + OTLP | Native `Sentry.AspNetCore` tracing + logging |

## Follow-up (not in app code)

- Replace OTLP env in `kubernetes/overlays/staging/backend/configmap-patch.yaml` with Sentry env
- Create Sentry projects and configure GitHub secrets before enabling uploads in CI

## References

- [Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry ASP.NET Core](https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/)
- [getsentry/sentry-for-ai](https://github.com/getsentry/sentry-for-ai)
