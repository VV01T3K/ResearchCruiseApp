# Deploy with Docker Compose

Use this guide for a Linux server with an existing SQL Server and a reverse
proxy that serves HTTPS. The application Compose file starts the frontend and
backend. It does not provision the database, TLS certificates, or backups.

The production file contains sample settings. Apply the override below before
starting it. The examples use `/etc/researchcruiseapp` for server configuration
outside the checkout and Bash for commands.

## Prepare the server

1. Install Docker Engine and Compose 2.24.4 or later. The override uses
   [`!override`](https://docs.docker.com/reference/compose-file/merge/) to replace
   published ports rather than append to them.
2. Check out the application release you intend to deploy. Select frontend and
   backend images from that same release in the
   [container registry](https://github.com/VV01T3K/ResearchCruiseApp/pkgs/container/researchcruiseapp%2Fbackend).
   Record both full image references, preferably with immutable digests. Authenticate
   to GHCR if the selected packages require it.
3. Provision the application database on SQL Server. Use a dedicated login scoped
   to that database, with permissions for application writes and startup schema
   migrations. Arrange database backups and test a restore before accepting users.
   Allow the backend host to reach SQL Server and configure a trusted TLS certificate.
4. Assign a public DNS name. Configure the host reverse proxy to terminate HTTPS
   and forward requests to `http://127.0.0.1:8080`. The frontend's Nginx serves
   the browser application and forwards `/api/` to the backend on the private
   Compose network. Publish only the reverse proxy's HTTP/HTTPS ports to users.
5. Prepare a sending mailbox and credentials using [SMTP setup](smtp-configuration.md).
   Allow outbound SMTP on port 465 and access to the image registry. Select a
   mailbox you control for the first administrator.

The proxy must preserve request paths. Set its upload limit for the files your
users submit; a proxy rejection happens before application validation. The backend
currently does not process forwarded client headers, so its IP-based rate limiter
can group users behind the proxy. Check this behavior under expected traffic.

## Create server configuration

Create `/etc/researchcruiseapp` with access limited to the deployment administrator.
Create the following three files. Keep `production.env` readable only by that
administrator. The bind-mounted `users.json` must be readable by the backend's
non-root container user. For example, use mode `0600` for `production.env` and
`0644` for `users.json` inside the protected directory. The account list contains
names and email addresses, not passwords.

### Environment file

Save this as `/etc/researchcruiseapp/production.env`. Replace every `REPLACE_...`
value before deployment. Single quotes keep dollar signs in values literal for
Compose's env-file parser. A password containing a quote or connection-string
delimiter needs appropriate escaping for both formats.

```dotenv
BACKEND_IMAGE=ghcr.io/vv01t3k/researchcruiseapp/backend:REPLACE_RELEASE_TAG
FRONTEND_IMAGE=ghcr.io/vv01t3k/researchcruiseapp/frontend:REPLACE_RELEASE_TAG
FRONTEND_URL=https://REPLACE_PUBLIC_HOST
DATABASE_CONNECTION='Server=REPLACE_DB_HOST,1433;Database=ResearchCruiseApp;User Id=REPLACE_DB_USER;Password=REPLACE_DB_PASSWORD;Encrypt=True;TrustServerCertificate=False'
JWT_SECRET=REPLACE_RANDOM_KEY
SMTP_USERNAME=REPLACE_SENDING_MAILBOX
SMTP_PASSWORD='REPLACE_SMTP_APP_PASSWORD'
SEED_ACCOUNTS=false
SENTRY_DSN_FRONTEND=
SENTRY_DSN_BACKEND=
```

Generate `JWT_SECRET` with `openssl rand -hex 32` and save the result in this file.
Use the public origin without a trailing slash for `FRONTEND_URL`.

### Compose override

Save this as `/etc/researchcruiseapp/server.override.yaml`:

```yaml
services:
  backend:
    image: ${BACKEND_IMAGE:?Set BACKEND_IMAGE}
    restart: unless-stopped
    environment:
      ASPNETCORE_ENVIRONMENT: Production
      ConnectionStrings__Database: ${DATABASE_CONNECTION:?Set DATABASE_CONNECTION}
      FrontendUrl: ${FRONTEND_URL:?Set FRONTEND_URL}
      JWT__Secret: ${JWT_SECRET:?Set JWT_SECRET}
      JWT__ValidIssuer: ${FRONTEND_URL:?Set FRONTEND_URL}
      JWT__ValidAudience: ${FRONTEND_URL:?Set FRONTEND_URL}
      Database__SeedAccountsAutomatically: ${SEED_ACCOUNTS:-false}
      Database__LogUserPasswordsWhenSeeding: "false"
      SmtpSettings__UseFakeSmtp: "false"
    ports: !override []
    volumes:
      - type: bind
        source: /etc/researchcruiseapp/users.json
        target: /app/users.json
        read_only: true
        bind:
          create_host_path: false
  frontend:
    image: ${FRONTEND_IMAGE:?Set FRONTEND_IMAGE}
    restart: unless-stopped
    environment:
      API_URL: http://backend:8080/
    ports: !override
      - "127.0.0.1:8080:8080"
    depends_on:
      backend:
        condition: service_healthy
```

The base file supplies the SMTP and Sentry mappings. The override replaces the
hardcoded connection string, public URL, signing key, and published ports.
See [configuration](configuration.md) for other settings and when changes apply.

### Account list

For an existing installation, save this as `/etc/researchcruiseapp/users.json`:

```json
{"Users": []}
```

The file must exist even when seeding is off. For a new installation, use the
administrator setup below before the first launch. Do not enable seeding with
the sample account list baked into the image.

## First administrator access

For a new database only, put the intended administrator in `users.json`:

```json
{
  "Users": [
    {
      "FirstName": "REPLACE_FIRST_NAME",
      "LastName": "REPLACE_LAST_NAME",
      "Email": "REPLACE_ADMIN_MAILBOX",
      "Role": "Administrator"
    }
  ]
}
```

Set `SEED_ACCOUNTS=true` for the first launch. Startup creates an accepted,
confirmed account with a generated password and queues an account email. Password
logging stays off. After launch, sign in using that email, then use the password
recovery flow to choose your own password.

Once access works, set `SEED_ACCOUNTS=false`, replace the list with `{"Users": []}`,
and recreate the backend using the commands below. Seed accounts with the expected
role are left unchanged. An existing account without the configured role is
deleted and recreated by seeding, so do not use seeding to manage existing users.

## Validate and launch

From the repository root, define this Bash function. Use it for all subsequent
commands so the project name, env file, and override order stay consistent:

```sh
rca() {
  docker compose --project-name researchcruiseapp-production \
    --env-file /etc/researchcruiseapp/production.env \
    -f docker/docker-compose.prod.yml \
    -f /etc/researchcruiseapp/server.override.yaml "$@"
}
```

Validate and pull the selected images:

```sh
rca config --quiet
rca pull
```

Configuration validation checks syntax and required interpolation values. It
does not reject nonempty placeholders or prove database or SMTP access. Check
the file values before launch. Avoid printing resolved configuration containing
credentials in shared logs.

For an upgrade, complete the backup steps below first. Starting the backend
applies database migrations before it accepts requests. The application login
therefore needs migration permissions at startup.

```sh
rca up -d --wait --wait-timeout 180
rca ps
```

If startup fails, inspect `rca logs --tail 100 backend`. SMTP validation occurs
before database initialization. Fix the reported configuration or connectivity
issue and retry without deleting the database.

### Verify the deployment

1. Open the public HTTPS URL and confirm that the login page loads without browser
   certificate or mixed-content errors.
2. Request `/api/health` through the public URL. It should return HTTP 200.
   This confirms routing and a responding process, not email delivery or a live
   database query.
3. Sign in and open an application page that reads data. Confirm that the account
   has its expected permissions.
4. Request password recovery for an account you control. Check delivery, the
   public hostname in the link, and successful password reset and login.

After disabling initial seeding, or changing backend credentials:

```sh
rca up -d --force-recreate --wait --wait-timeout 180 backend
rca up -d --force-recreate frontend
```

Recreating the frontend refreshes its Nginx connection to a replaced backend.
Repeat the public health and login checks. A plain `restart` does not update
container environment variables.

## Back up and restore

Back up the whole application database, including `EmailOutboxMessages` and
`DataProtectionKeys`. Uploaded contract files and permission scans are stored in
the database. Keep the server configuration, image references, and proxy
configuration in protected backup storage too.

Use your SQL Server backup system. For a manual full backup, follow
[Microsoft's backup procedure](https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/create-a-full-database-backup-sql-server).
The destination is on the database server and must be writable by SQL Server.
Copy backups to protected storage outside that server. Record the backup time
and the application image references it belongs to.

Test recovery by restoring to a separate database using
[Microsoft's restore procedure](https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/restore-a-database-to-a-new-location-sql-server).
Start an isolated application instance with the recorded images and fake SMTP.
Verify login, application records, and uploaded file downloads. Isolate its
network so restored queued messages cannot reach real recipients. A backup file
alone is not proof of a working restore.

Keep the Data Protection keys with the restored data. Losing them can make queued
messages unreadable and invalidate confirmation or recovery tokens. Restoring an
older backup can also restore mail that was already sent. See
[email delivery and recovery](email-delivery.md) before restarting a restored queue.

The repository does not schedule production backups or define retention and
recovery targets. The operator must set these for the server and test them there.

## Upgrade or roll back

1. Review [CHANGELOG.md](../CHANGELOG.md), migrations, and release instructions.
2. Record the current image references and configuration. Pull the new matching
   frontend and backend images before the maintenance window.
3. Stop both services with `rca stop`. Take a database backup before the new
   backend can apply migrations.
4. Set the new image references, check out the matching release files, and run
   `rca config --quiet`, then `rca up -d --wait --wait-timeout 180`.
5. Repeat the deployment checks before allowing normal use.

An older image may not work with a migrated schema. If rollback needs the old
schema, stop both services and restore the pre-upgrade backup and matching images
as a planned recovery operation. That discards changes made after the backup.
Do not use database reset tasks or remove migration, outbox, or key tables as a
rollback procedure.

## Other deployment files

Staging's `compose.staging-app.yaml` expects external Docker networks and
Komodo/Caddy configuration. It has different defaults for seeding and logging.
The Kubernetes manifests also enable seeding and password logging and expect
external secrets. Neither is part of this server procedure.

The [Sentry infrastructure migration](sentry/sentry-on-prem-migration.md) remains
a separate plan. Empty DSNs let the application run without Sentry.
