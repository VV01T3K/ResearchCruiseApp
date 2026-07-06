# Plan: production Sentry on-prem

Target setup: **staging keeps reporting to Sentry Cloud** (org `cruiseteam`, EU region, projects
`frontend-staging` / `backend-staging`), while **production reports to a self-hosted Sentry
instance** run on our own infrastructure. This document is the handoff plan for standing that up.

## What already works in our favor

The app code is instance-agnostic — nothing needs to change in `frontend/src/` or
`backend/ResearchCruiseApp/` to switch instances:

- Both SDKs send to whatever DSN they are given; an on-prem DSN
  (`https://<key>@sentry.<our-domain>/<project-id>`) is handled identically to a cloud one.
- The frontend Docker image does **not** bake the DSN: `docker-entrypoint.d/90-runtime-config.sh`
  injects `SENTRY_DSN` / `SENTRY_ENVIRONMENT` / `SENTRY_RELEASE` / `SENTRY_TRACES_SAMPLE_RATE`
  from container env at startup. The backend reads `Sentry__*` env at runtime.
- Deploying with those env vars unset ships both apps with Sentry present but disabled, so the
  cutover is: set env vars, restart containers.

**Hard rule:** the frontend and backend of one environment must point at the **same** Sentry
instance. Distributed traces and replay→backend links are stitched inside a single instance —
never mix cloud and on-prem DSNs within an environment.

## Step 1 — stand up self-hosted Sentry

- Use [getsentry/self-hosted](https://github.com/getsentry/self-hosted) (Docker Compose based;
  `./install.sh`, then `docker compose up -d`).
- Sizing: Sentry recommends ≥16 GB RAM and ≥4 CPU cores; the stack includes Postgres, Kafka,
  ClickHouse, Redis, Snuba, Relay.
- Put it behind TLS on a stable hostname, e.g. `https://sentry.<our-domain>` — this URL becomes
  `SENTRY_URL` everywhere below.
- Configure email (for alerts/invites) in `sentry/config.yml` and set up backups for the
  Postgres and ClickHouse volumes. Decide event retention (`SENTRY_EVENT_RETENTION_DAYS`,
  default 90).
- Feature notes: errors, tracing, session replay and dashboards all work self-hosted. Seer (AI),
  spike protection, and the hosted MCP integration are cloud-only — production debugging via MCP
  would need the self-hosted MCP server or plain API access.

## Step 2 — create org and projects on the on-prem instance

1. Create an organization (suggestion: keep the slug `cruiseteam` for symmetry).
2. Create two projects, mirroring staging:
   - `frontend-production` — platform **React**
   - `backend-production` — platform **ASP.NET Core**
3. Note both DSNs.
4. Create an **organization auth token** (Settings → Auth Tokens) for CI uploads. This token is
   specific to the on-prem instance — cloud tokens do not work there.

## Step 3 — wire CI uploads to the on-prem instance (small repo change)

sentry-cli, `@sentry/vite-plugin`, and the Sentry MSBuild tasks all honor the `SENTRY_URL`
env var but default to `https://sentry.io`. This is the **only missing plumbing** in the repo:

- `frontend/Dockerfile` and `backend/Dockerfile`: add `ARG SENTRY_URL=""` + export it as env in
  the build stage (empty default keeps current cloud behavior).
- `frontend/vite.config.ts`: pass `url: process.env.SENTRY_URL || undefined` to
  `sentryVitePlugin` (optional — the env var alone is honored — but explicit is clearer).
- `backend/ResearchCruiseApp/ResearchCruiseApp.csproj`: add
  `<SentryUrl Condition="'$(SENTRY_URL)' != ''">$(SENTRY_URL)</SentryUrl>` next to `SentryOrg`.
- `.github/workflows/build-and-deploy.yaml` (production pipeline): in the frontend/backend build
  args, override the slug defaults and add the URL:
  `SENTRY_URL=https://sentry.<our-domain>`, `SENTRY_PROJECT_FRONTEND=frontend-production`,
  `SENTRY_PROJECT_BACKEND=backend-production` (and `SENTRY_ORG` if the on-prem slug differs).
  Add a second GitHub secret (e.g. `SENTRY_AUTH_TOKEN_PROD`) holding the on-prem token and pass
  it as the `sentry_auth_token` build secret in that workflow.
  The staging workflow (`deploy-komodo-staging.yaml`) stays untouched — it keeps uploading to
  cloud with the existing `SENTRY_AUTH_TOKEN`.
- The GitHub runner must be able to reach `SENTRY_URL`; if the instance is not public, use a
  self-hosted runner or expose the upload endpoint.

## Step 4 — connect production at deploy time

In the production compose/host environment set:

```
SENTRY_DSN_FRONTEND=<frontend-production DSN>
SENTRY_DSN_BACKEND=<backend-production DSN>
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1   # keep low; on-prem disk is ours
```

then restart the containers. No image rebuild needed for event reporting — only readable stack
traces depend on Step 3 having run for the deployed release.

## Step 5 — verification checklist (mirror of how staging was verified)

- [ ] Frontend error appears in `frontend-production` with `environment: production` and a
      readable (source-mapped) stack trace.
- [ ] Backend warning/error appears in `backend-production` with resolved .NET frames.
- [ ] A login attempt produces one trace containing browser spans **and** the backend
      `http.server` + EF Core spans (proves `sentry-trace`/`baggage` propagation).
- [ ] A session replay exists and links to that trace.
- [ ] `/health` transactions are absent (filter works).
- [ ] No `Seed User Created` events (scrubbing works; seeding should be off in production anyway).

## Ongoing operations

- Upgrade the self-hosted stack regularly (monthly releases; upgrades run `install.sh` again).
- Monitor disk usage of ClickHouse/Kafka volumes; tune retention if needed.
- The cloud org keeps only staging data; on-prem holds all production data (data-sovereignty
  requirement satisfied).
