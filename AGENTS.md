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

1. **Database**: `sudo docker compose -f docker/docker-compose.infra.yml up -d db` — wait for health check to pass
2. **Backend**: `cd backend && dotnet watch run --project ResearchCruiseApp --launch-profile Development` (port 3000)
3. **Frontend**: `cd frontend && vp dev --host` (port 5173)

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
- **Docker in nested containers**: Requires `fuse-overlayfs` storage driver and `iptables-legacy`. The update script handles Docker daemon startup.
- **PATH ordering**: `/exec-daemon/node` may shadow nvm's node. Ensure nvm's node path comes first: `$NVM_DIR/versions/node/v25.8.2/bin` must precede `/exec-daemon/`.
- **pnpm build scripts warning**: `esbuild` and `protobufjs` build scripts are not in `onlyBuiltDependencies`. This is intentional — the core dev workflow (vp dev/check) does not require them. Storybook may need them.

### Sentry integration (in progress)

HyperDX and app-level OpenTelemetry were removed from application code (not from `kubernetes/` overlays yet). Use Sentry agent skills and `docs/sentry-integration.md` for the migration.

- **Skills**: `npx @sentry/dotagents install` — skills in `.agents/skills/`, Cursor symlink `.cursor/skills/`. Config: `agents.toml`, lock: `agents.lock`.
- **Relevant skills**: `sentry-react-sdk` (frontend), `sentry-dotnet-sdk` (backend), `sentry-fix-issues`, `sentry-pr-code-review`.
- **Do not** reintroduce HyperDX or standalone OTLP exporters in app code unless explicitly requested; prefer native Sentry SDKs.
- **Secrets**: `SENTRY_DSN` and auth tokens via env/secrets only — never commit.
