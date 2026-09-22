# Source development

Use this workflow to edit the frontend or backend with live reload. To run both
applications without installing development tools, use the
[Docker quick start](../README.md#run-locally).

## Install tools and dependencies

The commands below use Bash on Linux or WSL. Use Docker with Linux containers.
The mise setup and reset tasks contain POSIX commands and are not native
PowerShell scripts.

Install [Vite+](https://www.viteplus.dev/guide/) to get the `vp` command, and
[mise](https://mise.jdx.dev/getting-started.html) to install repository tools.
Open a new terminal and check that both commands work. The repository pins
Node.js in [.node-version](.node-version), and .NET 10, pnpm, and Bun in
[mise.toml](../mise.toml). Install JavaScript dependencies from the root, where
the pnpm lockfile and workspace configuration live.

From the repository root:

```sh
mise trust
mise install
vp install --frozen-lockfile
cd backend
dotnet restore ResearchCruiseApp.sln
dotnet tool restore
cd ..
```

The first `mise install` also runs setup hooks to install dependencies and
Playwright Chromium. Those hooks use `.mise-setup-done` to skip repeat setup.
The explicit restore commands above also work after that marker exists.

The [.devcontainer](../.devcontainer/devcontainer.json) configuration supplies
Vite+ and mise and runs these hooks when created. Its setup installs additional
agent tools. It is optional for source development.

## Start the database and applications

Run these commands from the repository root. Stop the full Docker application
stack first if it is running; its backend uses the same port as the source
backend. This preserves its database volume:

```sh
docker compose -f docker/docker-compose.dev.yml down
docker compose -f docker/docker-compose.infra.yml up -d --wait db
```

The two Compose entry points use different database volumes. The full stack uses
`docker_researchcruiseapp-db`; the infrastructure file uses
`researchcruiseapp_researchcruiseapp-db`. Switching workflows can therefore show a
fresh database. It does not transfer or delete the other workflow's data.

In one terminal, from `backend/`:

```sh
dotnet watch run --project ResearchCruiseApp --launch-profile Development
```

In another terminal, from `frontend/`:

```sh
vp run dev
```

Open [http://localhost:5173](http://localhost:5173). This server sends requests
directly to the backend at `http://localhost:3000`. Keep port 5173 available;
the development backend allows that frontend origin. The backend serves API
documentation at [http://localhost:3000/scalar](http://localhost:3000/scalar)
when the Development profile is active.

Startup applies migrations and seeds local accounts. Follow the
[local sign-in instructions](../README.md#sign-in), using the backend terminal
for the password. Fake email files appear in the repository's `fake-emails/`
directory. An existing database keeps its accounts and passwords.

Press Ctrl+C in each application terminal to stop it. From the root,
`docker compose -f docker/docker-compose.infra.yml down` stops the database
without deleting its data.

## Check a change

Run the checks for the component you changed. These match the scripts and
[CI workflows](../.github/workflows/). Frontend browser tests mock the API;
they do not prove that a real backend or SMTP server works.

| Directory   | Command                                           | Purpose                                              |
| ----------- | ------------------------------------------------- | ---------------------------------------------------- |
| `frontend/` | `vp run check`                                    | Frontend checks configured in Vite+.                 |
| `frontend/` | `vp run build`                                    | Type check and production bundle.                    |
| `frontend/` | `vp run test:unit`                                | Schema and other unit tests.                         |
| `frontend/` | `vp exec playwright install --with-deps chromium` | Install the browser needed by Playwright.            |
| `frontend/` | `vp run test`                                     | Browser tests; starts its own frontend on port 5174. |
| `backend/`  | `dotnet restore ResearchCruiseApp.sln`            | Restore application and test dependencies.           |
| `backend/`  | `dotnet tool restore`                             | Restore the formatter and EF tooling.                |
| `backend/`  | `vp run check`                                    | Format check and build with warnings as errors.      |
| `backend/`  | `vp run test`                                     | Run backend tests after the build above.             |

The backend test script uses `--no-restore --no-build`; it needs those preceding
steps. Its email outbox tests use isolated SQLite databases by default. See
[email delivery](../docs/email-delivery.md) for the optional SQL Server test mode.

See [TESTING.md](TESTING.md) for frontend fixtures and test design.

## Regenerate the API client

From the repository root, after an API contract change:

```sh
dotnet build backend/ResearchCruiseApp/ResearchCruiseApp.csproj -c Debug
cd frontend
vp run gen
vp run build
```

The backend Debug build writes
[`ResearchCruiseApp_v2.json`](../backend/ResearchCruiseApp/openapi/ResearchCruiseApp_v2.json).
Orval reads it and writes fetch functions, TanStack Query hooks, and Zod schemas
under [`src/api/generated`](src/api/generated). Commit both the OpenAPI document
and generated client changes. Edit the API contract or
[Orval configuration](orval.config.ts), then regenerate; generated files are outputs.

## Optional agent skills

From the repository root, `vp run skills:install` installs the GitHub skills listed
in [skills-lock.json](../skills-lock.json) into the ignored `.agents/skills/`
directory. These skills are optional for development.

[TanStack Intent](https://tanstack.com/intent/latest/docs/overview) can provide
library guidance from installed dependency versions. It is not configured here.
The current locked `@tanstack/react-table` package ships guidance in its `skills/`
directory, including migration from v8 to v9. Check coverage again when dependencies
change and select explicit sources before enabling Intent loading. Keep application conventions in
[AGENTS.md](../AGENTS.md).
