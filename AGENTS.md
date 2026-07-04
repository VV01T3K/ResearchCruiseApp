# AGENTS.md

## Cursor Cloud specific instructions

### Architecture Overview

This is a full-stack monorepo for a research cruise management application (R/V Oceanograf):
- **Frontend**: React 19 + TypeScript + Vite (via `vite-plus`) at `frontend/`
- **Backend**: .NET 10 ASP.NET Core Web API at `backend/`
- **Database**: SQL Server 2022 (Docker container)

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 25.8.2 | Frontend runtime (managed via nvm, read from `frontend/.node-version`) |
| pnpm | 10.33.0 | Workspace package manager |
| bun | 1.3.11 | Frontend-level package manager |
| .NET SDK | 10.0 | Backend build/run |
| Docker | 28+ | SQL Server container |
| vite-plus (`vp`) | 0.1.16+ | Unified dev CLI for frontend lint/fmt/dev |

### Starting Services

Services must be started manually — they are NOT started by the update script.

1. **Docker daemon** (must start first, required for DB):
   ```bash
   sudo mkdir -p /etc/docker
   printf '{\n  "storage-driver": "fuse-overlayfs"\n}' | sudo tee /etc/docker/daemon.json > /dev/null
   sudo update-alternatives --set iptables /usr/sbin/iptables-legacy 2>/dev/null
   sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy 2>/dev/null
   sudo dockerd &>/tmp/dockerd.log &
   sleep 3
   ```
2. **Database**: `sudo docker compose -f docker/docker-compose.infra.yml up -d db` — wait until `sudo docker inspect --format='{{.State.Health.Status}}' researchcruiseapp-db` returns `healthy`
3. **Backend**: `cd backend && dotnet watch run --project ResearchCruiseApp --launch-profile Development` (port 3000)
4. **Frontend**: `cd frontend && vp dev --host` (port 5173)

The frontend defaults API_URL to `http://localhost:3000` when unset.

### Lint / Check / Build

- **Frontend lint+fmt**: `cd frontend && vp check` (runs oxlint + formatter)
- **Frontend fix**: `cd frontend && vp check --fix`
- **Backend build**: `cd backend && dotnet build ResearchCruiseApp.sln`
- **Backend format** (currently disabled in lefthook): `cd backend && dotnet csharpier check .`

### Testing

- **Frontend E2E** (Playwright): `cd frontend && vp exec playwright test` — requires chromium (`vp exec playwright install --with-deps chromium`)
- **Backend**: no automated test suite currently; manual API testing via Swagger at `http://localhost:3000/swagger`

### Important Gotchas

- **User registration requires email confirmation + admin acceptance**: After registering via `/Account/register`, the user's `EmailConfirmed` and `Accepted` fields in `AspNetUsers` must both be `1` before login works. In dev, confirm directly via SQL:
  ```sql
  SET QUOTED_IDENTIFIER ON;
  UPDATE AspNetUsers SET EmailConfirmed = 1, Accepted = 1 WHERE Email = '...';
  ```
- **Seed users**: The `Database__SeedAutomatically=true` config seeds roles, units, research areas, and equipment. User seeding requires a `Users` config section (typically via user secrets or env). Seeded users get random passwords logged at startup with `Database__LogUserPasswordsWhenSeeding=true`.
- **Docker in nested containers**: Requires `fuse-overlayfs` storage driver and `iptables-legacy`. You must start Docker daemon manually before using `docker compose` — see "Starting Services" above.
- **PATH ordering**: `/exec-daemon/node` may shadow nvm's node. Ensure nvm's node path comes first: `$NVM_DIR/versions/node/v25.8.2/bin` must precede `/exec-daemon/`.
- **pnpm build scripts warning**: `esbuild` and `protobufjs` build scripts are not in `onlyBuiltDependencies`. This is intentional — the core dev workflow (vp dev/check) does not require them. Storybook may need them.

### Sentry integration

Native Sentry SDKs are wired in frontend and backend — see `docs/sentry-integration.md`. HyperDX and app-level OpenTelemetry were removed from application code (K8s OTLP overlays are a separate follow-up).

- **Skills source**: [getsentry/sentry-for-ai](https://github.com/getsentry/sentry-for-ai) — pinned in `skills-lock.json`. Install manually: `pnpm skills:install` or `mise run skills:install`.
- **Relevant skills**: `sentry-react-sdk` (frontend), `sentry-dotnet-sdk` (backend), `sentry-fix-issues`, `sentry-pr-code-review`.
- **Do not** reintroduce HyperDX or standalone OTLP exporters in app code unless explicitly requested.
- **Secrets**: `SENTRY_DSN` and auth tokens via env/secrets only — never commit. Set `SENTRY_DSN` locally (or in `.env.sentry`) to enable telemetry; SDKs stay disabled when DSN is empty.
