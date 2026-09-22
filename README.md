# ResearchCruiseApp

ResearchCruiseApp manages applications, scheduling, and reports for research
cruises aboard the University of Gdańsk's vessel Oceanograf.

Cruise managers prepare applications; reviewers and the shipowner handle review
and cruise planning. The application brings these stages together in a browser
interface, with access determined by the user's role.

The repository contains a React and TanStack frontend and an ASP.NET Core backend
using Entity Framework Core and SQL Server. Docker Compose can run the whole
application locally with fake email. Production uses a server, SQL Server, HTTPS,
and real SMTP delivery.

## Contents

- [Install](#install)
- [Usage](#usage)
- [Testing](#testing)
- [Project structure](#project-structure)
- [API](#api)
- [Deployment and operations](#deployment-and-operations)
- [Contributing](#contributing)
- [License](#license)

## Install

### Run locally

Install Git and [Docker with Compose](https://docs.docker.com/compose/install/).
Use Linux containers on an x86-64 machine. The SQL Server image requires this
architecture. Compose must support `include`, available from version 2.20.0.

The development stack publishes ports 8080, 3000, and 1433 on the host. It uses
sample credentials and logs generated account passwords. Run it only on a trusted
development machine. Use the server guide for a public deployment.

In Bash or PowerShell:

```sh
git clone https://github.com/VV01T3K/ResearchCruiseApp.git
cd ResearchCruiseApp
docker compose -f docker/docker-compose.dev.yml up -d --build --wait
```

Open [http://localhost:8080](http://localhost:8080). The frontend sends `/api/`
requests through Nginx to the backend. SQL Server stores the application data in
a Docker volume. The backend applies database migrations on startup.

### Develop from source

Follow [source development](frontend/README.md) to install tools, start the
database, and run the frontend and backend with live reload. That workflow uses
Linux or WSL and opens the application at `http://localhost:5173`.

## Usage

### Sign in

On a new database, startup creates the accounts in
[users.json](backend/ResearchCruiseApp/users.json). To get the generated password
for the local administrator, inspect the backend log:

```sh
docker compose -f docker/docker-compose.dev.yml logs backend
```

Find the `Seed User Created:` entry for `admin@gmail.com` and sign in with that
password. Keep this log private. Existing accounts with the configured role keep
their passwords; a restart does not print a new password for them.

If you need to reset the local password, use **Zapomniałeś hasła?** on the login
page. Fake SMTP saves the message inside the backend container. Allow a few
seconds for delivery, then copy the messages to your machine:

```sh
docker cp researchcruiseapp-backend:/tmp/fake-emails ./fake-emails
```

Open the matching HTML file and follow its reset link. The files contain private
account information. They disappear from the container when it is replaced.

### Explore the application

Use the accounts and roles listed in [users.json](backend/ResearchCruiseApp/users.json)
to try the local application from different users' perspectives. Obtain their
generated passwords from the same startup log.

Start with cruise applications, then explore review, cruise planning, and reports.
Available actions depend on the signed-in account and the record's current state.
Use synthetic data in the local stack. Confirmation and recovery messages go to
fake email files instead of a real mailbox.

### Stop and start again

Run these commands from the repository root:

```sh
docker compose -f docker/docker-compose.dev.yml down
docker compose -f docker/docker-compose.dev.yml up -d --wait
```

`down` preserves database data. Adding `--volumes` deletes the stack's volumes.
The `seed` and `db:del` mise tasks delete the source development database volume;
neither is needed for normal setup or restart.

### If startup fails

```sh
docker compose -f docker/docker-compose.dev.yml ps -a
docker compose -f docker/docker-compose.dev.yml logs --tail 100 db backend
```

If a port is occupied, stop the conflicting local service or use a separate Docker
host. The Compose files use fixed container names, so they also conflict with
another checkout running the same stack. Do not delete an existing database to
solve a port or container name conflict.

## Testing

After completing [development setup](frontend/README.md#install-tools-and-dependencies),
run frontend unit tests from `frontend/`:

```sh
vp run test:unit
```

Run backend checks and tests from `backend/`:

```sh
vp run check
vp run test
```

The backend test command requires the preceding build and restored dependencies.
See [all validation commands](frontend/README.md#check-a-change) for browser tests,
formatting, and production builds. Frontend browser tests mock the API; passing
them does not verify a real backend or email delivery.

## Project structure

```text
ResearchCruiseApp/
├── frontend/
│   ├── src/routes/              # Pages and routing
│   ├── src/integrations/        # Library integrations, including TanStack and Sentry
│   ├── src/api/                 # API client and generated contracts
│   └── TESTING.md               # Frontend test and fixture guidance
├── backend/
│   ├── ResearchCruiseApp/       # HTTP API, business logic, persistence, migrations
│   └── ResearchCruiseApp.Tests/ # Backend tests
├── docker/                     # Local, staging, and production Compose definitions
├── .github/workflows/          # Checks, image builds, staging deployment, releases
├── .greptile/                  # Automated review configuration and rules
├── docs/                       # Configuration, deployment, and operations guides
├── AGENTS.md                   # Repository conventions and agent task references
└── CONTRIBUTING.md             # PR, review, merge, and release procedures
```

## API

The frontend calls the backend over HTTP. The Docker frontend proxies `/api/`
through Nginx; source development connects directly to the backend.

With the backend Development profile running, open
[Scalar API documentation](http://localhost:3000/scalar). The versioned contract
is [ResearchCruiseApp_v2.json](backend/ResearchCruiseApp/openapi/ResearchCruiseApp_v2.json).
The frontend generates its client from that file. Follow
[API regeneration](frontend/README.md#regenerate-the-api-client) after changing
the contract and commit both outputs.

## Deployment and operations

Follow [the Docker Compose server guide](docs/deployment.md). It covers an
existing SQL Server, HTTPS, required overrides, first administrator access,
backups, and upgrades.

The checked-in `docker-compose.prod.yml` needs those overrides. It contains
sample database settings and a localhost URL, and it inherits a sample JWT key.
Starting that file alone is not a complete production setup.

For configuration and ongoing operation:

| Task | Instructions |
| --- | --- |
| Set URLs, database, authentication, and telemetry | [Configuration](docs/configuration.md) |
| Take over services or diagnose staging and automation | [Operations](docs/operations.md) |
| Configure SMTP or diagnose missing mail | [SMTP setup](docs/smtp-configuration.md) and [email delivery](docs/email-delivery.md) |
| Investigate Sentry reports and build uploads | [Sentry operations](docs/sentry/operations.md) |

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for PR targets, validation, Greptile review,
merging, and releases. [AGENTS.md](AGENTS.md) contains commit and code conventions
and directs agents to the relevant task guides.

## License

See [LICENSE](LICENSE) for the MIT license and copyright notices.
