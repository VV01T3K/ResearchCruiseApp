# Sentry integration

Research Cruise App uses [Sentry](https://sentry.io) for errors, performance, session replay, and distributed tracing across the React frontend and ASP.NET Core backend.

## Agent skills (AI assistants)

Official Sentry skills come from **[getsentry/sentry-for-ai](https://github.com/getsentry/sentry-for-ai)**. Only **`skills-lock.json`** is committed; installed skill files are gitignored.

```bash
pnpm skills:install
# or: vp dlx skills experimental_install -y
```

| Task | Skill |
|------|--------|
| React + Vite frontend | `sentry-react-sdk` |
| ASP.NET Core backend | `sentry-dotnet-sdk` |
| Fix production issues | `sentry-fix-issues` |
| PR / code review | `sentry-pr-code-review` |

## What is instrumented

### Frontend (`frontend/`)

- **`@sentry/react`** initialized in `src/instrument.ts` (imported first from `main.tsx`)
- **React 19** `reactErrorHandler()` on `createRoot`
- **TanStack Router** navigation tracing via `tanstackRouterBrowserTracingIntegration`
- **Session Replay** with masked text/inputs and blocked media
- **HTTP client** failed-request capture and **console** warn/error breadcrumbs
- **User context** set from `/account` profile after login
- **Form breadcrumbs** via `trackFormSubmit()` in `src/modules/core/lib/sentry.ts`
- **Source maps** uploaded in CI when `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` are set (`@sentry/vite-plugin`)
- **Tunnel** optional via `SENTRY_TUNNEL=/api/sentry-tunnel` (relayed by backend)

Sentry is **disabled** when `SENTRY_DSN` is empty (safe for local dev without a project).

### Backend (`backend/ResearchCruiseApp/`)

- **`Sentry.AspNetCore`** via `AddSentryMonitoring()` / `UseSentryMonitoring()`
- Request tracing, logging breadcrumbs, and EF Core diagnostics (automatic with ASP.NET integration)
- **`SentryTunnelController`** at `POST /api/sentry-tunnel` for browser tunneling
- **Symbol upload** on Release builds when `SENTRY_AUTH_TOKEN` is set (MSBuild properties in `.csproj`)

Configuration: `appsettings.json` → `Sentry` section, overridable with `Sentry__*` env vars or `SENTRY_DSN` / `SENTRY_RELEASE` / `SENTRY_ENVIRONMENT`.

## Environment variables

See [`.env.sentry.example`](../.env.sentry.example). Never commit DSNs or auth tokens.

| Variable | Where | Purpose |
|----------|--------|---------|
| `SENTRY_DSN` | Frontend build + backend | Project DSN |
| `SENTRY_ENVIRONMENT` | Both | `local`, `staging`, `production` |
| `SENTRY_RELEASE` | Both | Git SHA or app version |
| `SENTRY_TRACES_SAMPLE_RATE` | Both | Performance sampling |
| `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | Frontend | Replay sampling |
| `SENTRY_TUNNEL` | Frontend | e.g. `/api/sentry-tunnel` |
| `SENTRY_AUTH_TOKEN` | CI only | Source maps / symbol upload |

## Legacy Grafana / OTLP stacks

`docker/docker-compose.otel.dev.yml` and related Grafana/Alloy configs remain for optional self-hosted observability but are **not** wired from application code. Staging Kubernetes overlays use Sentry env vars instead of `UseOtlpExporter`.

## References

- [Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry ASP.NET Core](https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/)
- [getsentry/sentry-for-ai](https://github.com/getsentry/sentry-for-ai)
