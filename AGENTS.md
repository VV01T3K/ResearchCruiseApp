# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview

ResearchCruiseApp is a monorepo with two main services:
- **Backend**: ASP.NET Core Web API (.NET 10) at `backend/`
- **Frontend**: React 19 + Vite 7 SPA at `frontend/`

### Prerequisites (installed in VM environment)

- Docker (for SQL Server 2022 container)
- .NET SDK 10.0
- Bun (frontend package manager; lockfile: `bun.lock`)
- Node.js 22

### Starting services

1. **Database**: `docker compose -f docker/docker-compose.infra.yml up -d db` — starts SQL Server on port 1433. Wait for it to be healthy before starting backend.
2. **Backend**: `cd backend && ASPNETCORE_ENVIRONMENT=Development dotnet run --project ResearchCruiseApp` — runs on port 3000. On first run with a fresh DB, it auto-migrates and seeds test users (admin@gmail.com, kierownik@o2.com) with random passwords logged as warnings.
3. **Frontend**: `cd frontend && API_URL=http://localhost:3000 bun run dev` — runs Vite dev server on port 5173.

### Important caveats

- The backend listens on **port 3000** in development mode (configured via `appsettings.Development.json`), not the default 5000/5001.
- `appsettings.Development.json` sets `Database.SeedAutomatically=true`, `MigrateAutomatically=true`, and `LogUserPasswordsWhenSeeding=true`. Seeded user passwords are random and printed as warning-level log lines (`Seed User Created: <email> - <password>`).
- The frontend needs `API_URL` env var set to the backend URL (e.g. `http://localhost:3000`).
- Docker daemon must be running before starting the DB. In the cloud VM, start it with: `sudo dockerd &>/tmp/dockerd.log &` then `sudo chmod 666 /var/run/docker.sock`.
- To reset the database: `docker compose -f docker/docker-compose.infra.yml down && docker volume rm researchcruiseapp_researchcruiseapp-db`.

### Lint / Format / Test commands

| Service  | Command | Description |
|----------|---------|-------------|
| Frontend | `cd frontend && bun run eslint` | ESLint |
| Frontend | `cd frontend && bun run prettier` | Prettier check |
| Frontend | `cd frontend && bun run linters` | Both ESLint + Prettier |
| Frontend | `cd frontend && bun run build` | TypeScript check + production build |
| Frontend | `cd frontend && bun run test` | Playwright E2E tests |
| Backend  | `cd backend && dotnet csharpier check .` | CSharpier format check |
| Backend  | `cd backend && dotnet build` | Build/compile check |
