# ResearchCruiseApp

ResearchCruiseApp manages research cruise applications, scheduling, and reports
for the University of Gdańsk's research vessel Oceanograf. Cruise managers submit
applications; reviewers and the shipowner manage approval and cruise planning.

- [Run locally](#run-locally) to try the application with a local database and fake email.
- [Develop from source](frontend/README.md) to edit the frontend or backend.
- [Deploy on a server](docs/deployment.md) with Docker Compose.
- [Configure the application](docs/configuration.md) to set URLs, authentication, and email.
- [Operate or take over the service](docs/operations.md) for required services, GitHub secrets, staging, and incident handling.

## Run locally

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

## Deploy on a server

Follow [the Docker Compose server guide](docs/deployment.md). It covers an
existing SQL Server, HTTPS, required overrides, first administrator access,
backups, and upgrades.

The checked-in `docker-compose.prod.yml` needs those overrides. It contains
sample database settings and a localhost URL, and it inherits a sample JWT key.
Starting that file alone is not a complete production setup.

## Work on the code

The frontend uses React and TanStack. The backend uses ASP.NET Core and Entity
Framework Core with SQL Server. Start with the task you need:

| Task | Instructions |
| --- | --- |
| Install tools and run with live reload | [Source development](frontend/README.md) |
| Check or test a change | [Validation commands](frontend/README.md#check-a-change) |
| Change an API contract | [Regenerate the API client](frontend/README.md#regenerate-the-api-client) |
| Add frontend tests | [Frontend test guide](frontend/TESTING.md) |
| Configure SMTP or diagnose missing mail | [SMTP setup](docs/smtp-configuration.md) and [email delivery](docs/email-delivery.md) |
| Follow repository conventions | [AGENTS.md](AGENTS.md) |
| Open, review, merge, or release a PR | [GitHub contribution process](CONTRIBUTING.md) |

## License

See [LICENSE](LICENSE) for the MIT license and copyright notices.
