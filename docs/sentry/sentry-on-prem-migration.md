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
  exposes `SENTRY_DSN` and `SENTRY_TRACES_SAMPLE_RATE` when the container starts. Its environment
  and release remain tied to the build. The backend reads `Sentry__*` env at runtime.
- Deploying without a DSN ships both apps with Sentry present but disabled, so the cutover is:
  set the DSNs and restart the containers.

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
  spike protection, and the hosted MCP integration are cloud-only — see
  [MCP access](#mcp-access) for the self-hosted MCP server.

## Step 2 — create org and projects on the on-prem instance

1. Create an organization (suggestion: keep the slug `cruiseteam` for symmetry).
2. Create two projects, mirroring staging:
   - `frontend-production` — platform **React**
   - `backend-production` — platform **ASP.NET Core**
3. Note both DSNs.
4. Create a **user auth token** (User Settings → Personal Tokens) for the MCP server. This token is specific to the on-prem instance — cloud tokens do not work
   there.

Before creating the real projects, rehearse on throwaway ones (e.g. `tmp-frontend` /
`tmp-backend`): mirror the staging projects' settings (inbound filters, allowed domains, client
key rate limits, data scrubbing, alert rules, ownership) through the MCP server or the UI, point a local
`docker/docker-compose.dev.yml` run at their DSNs, and walk the Step 5 checklist. Delete them
once the production projects are configured the same way.

## Step 3 — no source maps in production (for now)

GitHub-hosted runners cannot reach the on-prem instance, so the production pipeline
(`build-and-deploy.yaml`) uploads nothing to Sentry and builds no source maps. Staging keeps
uploading to cloud.

- **Backend:** little is lost. The published image ships `ResearchCruiseApp.pdb`, so the SDK
  resolves file names and line numbers on its own; only the inline source-context snippets
  (from `SentryUploadSources`) are missing.
- **Frontend:** production stack traces stay minified. Reproduce on staging, where the same
  code is source-mapped, when a production trace is unreadable.

Restoring them is tracked in [#433](https://github.com/VV01T3K/ResearchCruiseApp/issues/433). Options: run the upload from a self-hosted GitHub runner inside the
network, or let Sentry fetch maps from the app (Project Settings → Security Token plus an nginx
rule serving `*.map` only with that header). Sentry has no web UI for uploading maps, and uploads
never apply retroactively to already-captured events.

## Step 3b — browser access through the frontend Sentry proxy

The backend reaches the internal instance directly, but browsers cannot. The frontend container
therefore proxies browser events to Sentry (Sentry's docs call this the
[`tunnel` option](https://docs.sentry.io/platforms/javascript/troubleshooting/#using-the-tunnel-option)):

- On start, `docker-entrypoint.d/90-runtime-config.sh` derives the envelope URL from
  `SENTRY_DSN` and adds `POST /monitoring` to nginx, which forwards only to that project.
  The SDK sends to `/monitoring` instead of the DSN host. Staging uses the same path to cloud,
  which also keeps ad blockers from dropping events.
- nginx strips cookies, `Authorization`, and `X-Forwarded-For` before forwarding, so Sentry sees
  the server's address rather than the user's.
- The frontend container must be able to resolve and reach the Sentry hostname. If the DSN is
  malformed the proxy is skipped and a warning is logged at startup.
- nginx verifies Sentry's TLS certificate against the image's CA bundle. The instance must serve
  its full chain: as of 2026-09-30 it sends the leaf without its issuer, `GEANT TLS RSA 1`
  (HARICA). Browsers, Windows and .NET (also on Linux) download the missing issuer themselves,
  so the backend is unaffected, but nginx, curl and Node do not: the proxy answers `502` with
  `upstream SSL certificate verify error: (21:unable to verify the first certificate)`. Fix the
  chain on the server rather than disabling verification.

The endpoint is public, like any browser DSN: anyone can post events to that one project, but
nothing can be read through it. It is deliberately not behind login, since errors on the login,
registration and password-reset pages matter most. Abuse is contained instead:

- nginx allows `POST` only, 20 MB per request, and 10 requests/s per client (burst 50), answering
  `429` so the SDK backs off. The limit is generous because campus NAT can put many users behind
  one address.
- Behind a reverse proxy, set `TRUSTED_PROXIES` (space-separated CIDRs) on the frontend container
  so nginx rate-limits by the real client from `X-Forwarded-For`; otherwise every user shares the
  proxy's limit. Staging trusts the private ranges, since only Caddy can reach the container;
  production leaves it empty while port 8080 is exposed directly. Never trust addresses that
  clients can connect from, or they can spoof their way past the limit.
- On the Sentry side, set a rate limit on the project's client key (Project Settings → Client
  Keys) to cap total intake, and restrict Allowed Domains (Project Settings → Security & Privacy)
  to the app's domain.

## Step 4 — connect production at deploy time

In the production compose/host environment set:

```
SENTRY_DSN_FRONTEND=<frontend-production DSN>
SENTRY_DSN_BACKEND=<backend-production DSN>
SENTRY_TRACES_SAMPLE_RATE=0.1
```

then restart the containers. Both application environments are already set by their production
builds. No image rebuild is needed.

## Step 5 — verification checklist (mirror of how staging was verified)

- [ ] Frontend error appears in `frontend-production` with `environment: production`, sent via
      `/monitoring` (browser network tab). Stack traces are minified (see Step 3).
- [ ] Backend warning/error appears in `backend-production` with resolved .NET frames.
- [ ] A login attempt produces one trace containing browser spans **and** the backend
      `http.server` + EF Core spans (proves `sentry-trace`/`baggage` propagation).
- [ ] A session replay exists and links to that trace.
- [ ] `/health` transactions are absent (filter works).
- [ ] No `Seed User Created` events (scrubbing works; seeding should be off in production anyway).

## MCP access

Claude Code can query both instances side by side:

- **Cloud (staging):** the hosted server at `https://mcp.sentry.dev/mcp`, authorized with OAuth.
- **On-prem (production):** the stdio server, registered per user so the token stays local:

  ```sh
  claude mcp add sentry-onprem -s user -e SENTRY_ACCESS_TOKEN=<on-prem user token> \
    -- npx @sentry/mcp-server@latest --host=sentry.<our-domain>
  ```

  The token needs `org:read`, `project:read`, `project:write`, `team:read`, `team:write`, and
  `event:write`. Seer is unavailable, and the natural-language search tools only work when an
  LLM provider is configured (e.g. `EMBEDDED_AGENT_PROVIDER=anthropic` plus `ANTHROPIC_API_KEY`).
  The machine running Claude Code must reach the instance (VPN).

## Ongoing operations

- Upgrade the self-hosted stack regularly (monthly releases; upgrades run `install.sh` again).
- Monitor disk usage of ClickHouse/Kafka volumes; tune retention if needed.
- The cloud org keeps only staging data; on-prem holds all production data (data-sovereignty
  requirement satisfied).
