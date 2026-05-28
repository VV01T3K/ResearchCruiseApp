# AGENTS.md

## Cursor Cloud specific instructions

### Overview

ResearchCruiseApp is a pnpm workspace monorepo with two packages: `frontend/` (React 19 + Vite) and `backend/` (ASP.NET Core 10 / .NET 10). The database is MS SQL Server 2022 running in Docker.

### Prerequisites (installed by update script)

- **mise** manages tool versions: `bun@1.3.11`, `pnpm@10.33.0`, `dotnet@10.0`
- **vite-plus** (`vp`) manages Node.js (v25.8.2 per `frontend/.node-version`) and runs frontend tooling
- **Docker** is required for the MSSQL database container

### Key commands

See `package.json` scripts and `mise.toml` tasks for the full list. Summary:

| Task | Command |
|---|---|
| Install dependencies | `mise trust && rm -f .mise-setup-done && mise install` |
| Start database | `docker compose -f docker/docker-compose.infra.yml up -d db` |
| Wait for database | Wait until `docker inspect --format='{{.State.Health.Status}}' researchcruiseapp-db` equals `healthy` |
| Start both dev servers | `pnpm dev` (or start them individually, see below) |
| Start backend only | `cd backend && dotnet watch run --project ResearchCruiseApp --launch-profile Development` |
| Start frontend only | `cd frontend && API_URL=http://localhost:3000 vp dev --host` |
| Lint/check | `pnpm check` |
| Auto-fix | `pnpm fix` |
| Build | `pnpm build` |
| Seed DB + capture creds | `pnpm seed` (drops DB, re-creates, saves passwords to `credentials.log`) |
| Run EF migrations | `pnpm ef:update` |

### Gotchas

- **PATH ordering**: The VM has nvm-installed Node (v22) that shadows vp-managed Node (v25.8.2). Ensure `$HOME/.vite-plus/js_runtime/node/25.8.2/bin` is at the front of `PATH`, or use `vp env use 25.8.2` from within the `frontend/` directory.
- **Frontend `API_URL`**: The frontend reads `API_URL` at build/dev time via `process.env.API_URL`. For local dev, set `API_URL=http://localhost:3000` when running the frontend. The root `pnpm dev` script (via `vp run -r dev`) handles this automatically.
- **Backend Development profile**: Uses `appsettings.Development.json` which auto-migrates and auto-seeds the database. Seed user passwords are random and logged to stdout (look for `Seed User Created:` lines). Use `pnpm seed` to capture them to `credentials.log`.
- **Backend port**: Runs on `http://localhost:3000` (defined in `launchSettings.json`).
- **Frontend port**: Vite dev server runs on `http://localhost:5173`.
- **Docker daemon**: Must be started before the database container. Run `sudo dockerd &>/tmp/dockerd.log &` if not already running, then `sudo chmod 666 /var/run/docker.sock`.
- **`pnpm approve-builds` is interactive**: Do not run it. The `esbuild` and `protobufjs` build script warnings are non-blocking.
- **`pnpm build` may hang**: The .NET `VBCSCompiler` process can keep the `vp run` process alive after build completes. If stuck, kill the VBCSCompiler process.
