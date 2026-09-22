# Application configuration

Set backend values in the process or container environment. Use double
underscores for nested keys, such as `SmtpSettings__SmtpPassword`. Keep secrets
outside tracked files. For a server installation, start with the complete
[deployment procedure](deployment.md).

## Where values take effect

| Location | What it configures | How to apply changes |
| --- | --- | --- |
| Backend environment | Overrides application JSON settings. | Recreate the container, or restart a directly hosted process with the new environment. |
| Compose `--env-file` | Supplies values for `${...}` expressions in Compose YAML. | Recreate affected containers with the same files and options. |
| Frontend build environment | Defines values in the browser bundle. | Rebuild the frontend image. |
| Frontend container environment | Sets the Nginx upstream and runtime Sentry values. | Recreate the frontend container. |

An env file does not automatically pass every variable to a container. For
example, `SMTP_USERNAME` works because Compose maps it to
`SmtpSettings__SmtpUsername`. A value in an env file cannot override a hardcoded
Compose value without a corresponding mapping. A plain container restart keeps
the old environment.

## Database and accounts

Defaults below come from
[appsettings.json](../backend/ResearchCruiseApp/appsettings.json). Development
and deployment files can override them.

| Backend setting | Default and behavior |
| --- | --- |
| `ConnectionStrings__Database` | Local SQL Server with sample credentials. Replace the entire value for production. Use `Server=HOST,1433;Database=NAME;User Id=USER;Password=SECRET;Encrypt=True;TrustServerCertificate=False` with a trusted server certificate. |
| `Database__SeedAccountsAutomatically` | `false`. Creates accounts from the `Users` configuration when enabled. Development and staging Compose enable it. |
| `Database__LogUserPasswordsWhenSeeding` | `false`. Development and staging Compose enable it. Keep it off on a server. |

Startup always applies EF migrations and adds missing reference data, including
roles, university units, research areas, and ship equipment. Existing reference
rows remain, including inactive rows. The account flag only controls user seeding.
EF's migration lock serializes migration and seeding work across replicas.

The required `users.json` file supplies the `Users` array. An existing seeded
account with the requested role is left unchanged. If it exists without that
role, seeding deletes and recreates it. Use a controlled list only for initial
administrator setup; see [first administrator access](deployment.md#first-administrator-access).

`Database__MigrateAutomatically` has been removed. The old
`Database__SeedAutomatically` name is replaced by
`Database__SeedAccountsAutomatically`. Staging's corresponding Compose input is
`DATABASE_SEED_ACCOUNTS_AUTOMATICALLY`.

## URLs and authentication

| Setting | Default and required action |
| --- | --- |
| `FrontendUrl` | Backend runtime value. `http://localhost:8080`, or `http://localhost:5173` in Development. Used for CORS and email links. Set the public HTTPS origin without a trailing slash on a server. |
| `JWT__Secret` | Backend runtime value with a sample default. Supply a new random signing key for production. The server guide generates one from 32 random bytes. |
| `JWT__ValidIssuer` | Defaults to `https://rejsy.ug.edu.pl/`. Identifies the token issuer. Set explicitly for the deployment. |
| `JWT__ValidAudience` | Defaults to `https://rejsy.ug.edu.pl/`. Identifies the token audience. Set explicitly for the deployment. |
| `JWT__AccessTokenLifetimeSeconds` | `900` seconds. |
| `JWT__RefreshTokenLifetimeSeconds` | `7200` seconds. |

Changing the signing key invalidates existing access tokens. Recreate the backend
after changing authentication settings, and verify a fresh login.

### Frontend API addresses

`API_URL` has two different consumers:

- At frontend build time, it sets the browser's API base. The Dockerfile builds
  with `/api`; source development falls back to `http://localhost:3000`.
- In the frontend container, it sets Nginx's upstream. The default is
  `http://backend:8080/`. Preserve the trailing slash so `/api/health` reaches
  the backend's `/health` route.

The container hostname `backend` is reachable by Nginx on the Compose network.
It is not an address for a user's browser. See the
[Dockerfile](../frontend/Dockerfile), [Nginx configuration](../frontend/nginx.conf),
and [frontend configuration](../frontend/src/config.ts).

## Email

Real SMTP uses `smtp.gmail.com` on port `465` by default. It requires
`SmtpSettings__SmtpUsername` and `SmtpSettings__SmtpPassword`. The transport uses
implicit TLS. `SmtpSettings__SmtpServer`, `SmtpSettings__SmtpPort`, and
`SmtpSettings__SenderName` override the defaults.

`SmtpSettings__UseFakeSmtp=true` writes HTML instead of sending mail.
`SmtpSettings__FakeSmtpDirectory` selects its directory. Source Development uses
`../../fake-emails` relative to the backend project; Docker development uses
`/tmp/fake-emails`. Credentials are unnecessary in fake mode.

See [SMTP setup](smtp-configuration.md) for validation and rotation, and
[email delivery](email-delivery.md) for queue behavior and recovery.

## Optional Sentry reporting

Empty DSNs disable reporting. The frontend runtime script exposes these values
to the browser; place no private upload tokens there.

| Consumer | Settings |
| --- | --- |
| Backend runtime | `Sentry__Dsn`, `Sentry__TracesSampleRate`. The default trace rate is `0.1`. |
| Frontend runtime | `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_REPLAYS_SESSION_SAMPLE_RATE`. Development and production Compose default both rates to `0.1`. |
| Compose inputs | `SENTRY_DSN_FRONTEND` and `SENTRY_DSN_BACKEND` map to the respective DSNs. Both fall back to `SENTRY_DSN`. Staging defaults sampling rates to `1`. |
| Image build | `APP_ENVIRONMENT`, `SENTRY_RELEASE`, `SENTRY_ORG`, and `SENTRY_PROJECT`; uploads use the BuildKit secret `sentry_auth_token`. |

Rates are fractions from `0` to `1`. Review replay and event collection for the
deployment before enabling them. A frontend release or environment change needs
a new build; changing its runtime DSN does not.

The [Sentry migration document](sentry/sentry-on-prem-migration.md) is a plan for
separate infrastructure, not a prerequisite for running this application.
