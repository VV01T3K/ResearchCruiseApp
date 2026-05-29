# Sentry integration

This project is migrating from HyperDX + self-managed OpenTelemetry (OTLP) to [Sentry](https://sentry.io). Kubernetes manifests under `kubernetes/` still reference the old OTLP setup until a follow-up change.

## Agent skills (AI assistants)

Official Sentry skills come from **[getsentry/sentry-for-ai](https://github.com/getsentry/sentry-for-ai)**. Install them with the Skills CLI (Sentry’s recommended path in [Agent Skills docs](https://docs.sentry.io/ai/agent-skills/)):

```bash
# All Sentry skills (setup + workflow)
npx skills add getsentry/sentry-for-ai

# Or a single skill, e.g. React SDK setup
npx skills add getsentry/sentry-for-ai --skill sentry-react-sdk
```

After install, skills live under `.agents/skills/` and are linked for Cursor at `.cursor/skills/`. Versions are pinned in **`skills-lock.json`** at the repo root (same mechanism as other project skills).

To restore from the lockfile without re-selecting skills:

```bash
npx skills experimental_install
```

### Skills to use for this repo

| Task | Skill |
|------|--------|
| React 19 + Vite frontend | `sentry-react-sdk` |
| ASP.NET Core 10 backend | `sentry-dotnet-sdk` |
| Fix production issues from Sentry | `sentry-fix-issues` |
| PR / code review with Sentry | `sentry-pr-code-review`, `sentry-code-review` |
| Alerts and notifications | `sentry-create-alert` |
| Optional OTLP → Sentry bridge | `sentry-otel-exporter-setup` |

Example prompts: “Add Sentry to my React app”, “Add Sentry to my .NET app”, “Fix the recent Sentry errors”.

Docs: [Agent Skills](https://docs.sentry.io/ai/agent-skills/).

> **Note:** [dotagents](https://docs.sentry.io/ai/dotagents/) is an optional package manager that can also install `getsentry/sentry-for-ai`. This repo uses **`npx skills add`** + `skills-lock.json` instead, consistent with existing project skill workflow.

## What was removed (non-Kubernetes)

- **Frontend**: `@hyperdx/browser`, `frontend/src/lib/hyperdx.ts`, form/action telemetry hooks
- **Backend**: `OpenTelemetry.cs`, OpenTelemetry NuGet packages, `UseOtlpExporter` / OTLP env vars in app docker compose
- **Dev tooling**: `.env.otel.example`, `docker/docker-compose.otel.dev.yml`, root `dev:otel` script

## Planned Sentry setup (next steps)

1. Create Sentry projects (frontend + backend) and obtain DSNs.
2. **Frontend** (`frontend/`): `@sentry/react` with Vite plugin for source maps, `Sentry.init` in app bootstrap, `Sentry.ErrorBoundary` (React 19: `reactErrorHandler`), TanStack Router tracing integration, user context on login, breadcrumbs for forms (replace removed `trackFormSubmit`).
3. **Backend** (`backend/ResearchCruiseApp/`): `Sentry.AspNetCore` via `WebApplication` / `UseSentry()`, release + environment from build, trace propagation to match frontend, optional profiling and structured logging.
4. **CI/CD**: upload debug symbols / source maps; set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.
5. **Staging/production**: wire `SENTRY_DSN` (and related env) in Docker compose and deployment configs (K8s overlay separately).

Environment variables (to be introduced):

| Variable | Where | Purpose |
|----------|--------|---------|
| `SENTRY_DSN` | Frontend build / backend runtime | Project DSN |
| `SENTRY_ENVIRONMENT` | Both | `local`, `staging`, `production` |
| `SENTRY_RELEASE` | Both | Git SHA or app version |
| `SENTRY_TRACES_SAMPLE_RATE` | Both | Performance sampling (e.g. `0.1` in prod) |

Do not commit DSN secrets to git; use env files or secret stores.

## References

- [Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry ASP.NET Core](https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/)
- [getsentry/sentry-for-ai](https://github.com/getsentry/sentry-for-ai)
