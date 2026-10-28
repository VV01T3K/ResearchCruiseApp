# Backend development and checks

Install a .NET 10 SDK (10.0.401 or newer, see `backend/global.json`), Vite+ and Docker (or rootless Podman), then run `vp install --frozen-lockfile` at the repository root and `dotnet tool restore && dotnet restore ResearchCruiseApp.slnx` in `backend`. With rootless Podman, export `DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock` and `TESTCONTAINERS_RYUK_DISABLED=true`.

| Command                                          | Behavior                                                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `vp run check`                                   | Format and lint checks for both packages; the backend Release build also regenerates the OpenAPI document |
| `vp fmt --check -c frontend/vite.tool.config.ts` | Formatting check for root, docs, CI, Docker and backend JSON files; also part of `vp run check`           |
| `vp run fix`                                     | Applies formatting fixes                                                                                  |
| `vp run gen`                                     | Regenerates the frontend API client from the OpenAPI document                                             |
| `vp run -F backend test`                         | Backend unit and SQL integration tests, after `vp run check`                                              |
| `vp run -F frontend test:unit`                   | Frontend unit tests                                                                                       |

Backend tests use xUnit v3 on Microsoft Testing Platform. `ResearchCruiseApp.UnitTests` covers pure rules. `ResearchCruiseApp.IntegrationTests` runs real HTTP, Identity and SQL Server in a disposable container with synthetic accounts and a capturing email transport; no developer database or real SMTP is needed. Run a single class from `backend` after a Release build:

```sh
dotnet test --project ResearchCruiseApp.IntegrationTests/ResearchCruiseApp.IntegrationTests.csproj -c Release --no-build --filter-class '*ClassName'
```

Failed, skipped or missing tests fail the run. If SQL startup times out after two minutes, pull the image named in `SqlFixture.Image` first.

The "Format & lint checks" workflow runs frontend unit tests and backend tests; the backend job times out after 10 minutes. Pushes to `staging` and `main` run it inside their deploy workflows, and images build only after it passes.
