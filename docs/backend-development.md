# Backend development and checks

Install the .NET SDK pinned in `backend/global.json`, Vite+, Python 3 and Docker (or rootless Podman), then run `vp install --frozen-lockfile` at the repository root. With rootless Podman, export `DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock` and `TESTCONTAINERS_RYUK_DISABLED=true`.

| Root command | Behavior |
| --- | --- |
| `vp run check` | Locked restore, format check, Release build, OpenAPI/client contract comparison, frontend checks and unit tests, backend unit and SQL integration tests |
| `vp run fix` | Applies formatting and generated-client changes, then runs the full check |
| `vp run lint` | Format, build and frontend checks without test containers |
| `vp run check:quick` | Backend unit tests only; skips SQL integration and contract comparison |
| `vp run test:coverage` | Backend tests with coverage reports |
| `vp run test:e2e` | Browser suite, outside the root check |

Backend tests use xUnit v3 on Microsoft Testing Platform. `ResearchCruiseApp.UnitTests` covers pure rules. `ResearchCruiseApp.IntegrationTests` runs real HTTP, Identity and SQL Server in a disposable container with synthetic accounts and a capturing email transport; no developer database or real SMTP is needed. Run a single class from `backend` after a Release build:

```sh
dotnet test --project ResearchCruiseApp.IntegrationTests/ResearchCruiseApp.IntegrationTests.csproj -c Release --no-build --filter-class '*ClassName'
```

Reports go to fresh directories under `backend/artifacts/tests/`. Missing, empty, skipped or failed backend reports fail the check. If SQL startup times out after two minutes, pull the image named in `SqlFixture.Image` first.

Hosted CI runs the same `vp run check` as the `Workspace checks` job, with a 10-minute timeout as a hang guard; image builds and deployment depend on it.
