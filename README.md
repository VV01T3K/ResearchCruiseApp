# ResearchCruiseApp

The ResearchCruiseApp project is designed to manage research cruises aboard the research vessel Oceanograf, owned by the Institute of Oceanography at the University of Gdańsk.
The application aims to streamline processes related to the booking, management, and organization of research cruises, and enable efficient communication between various stakeholders.

## Backend testing and tooling

See [backend development and checks](docs/backend-development.md) for setup, workspace commands and the test suites.

## Configuration

See [dependency maintenance](docs/dependency-maintenance.md) for installs, audits
and Dependabot.

### Frontend

| Environment Variable                 | Description                            | Example               | Required |
| ------------------------------------ | -------------------------------------- | --------------------- | -------- |
| `API_URL`                            | The address of the backend service     | `http://backend:8080` | Yes      |
| `TRUSTED_PROXY` | Address or CIDR of the reverse proxy in front of nginx whose `X-Forwarded-For` is trusted | `172.16.0.0/12` | No |
| `SENTRY_DSN`                         | Frontend Sentry DSN; empty disables it |                       | No       |
| `SENTRY_TRACES_SAMPLE_RATE`          | Frontend trace sampling rate           | `0.1`                 | No       |
| `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | Frontend replay session sampling rate  | `0.1`                 | No       |

### Backend

| Environment Variable                    | Description                                    | Example                                                                         | Required |
| --------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- | -------- |
| `Database__SeedAccountsAutomatically`   | Create or repair configured seed accounts      | `false`                                                                         | No       |
| `Database__LogUserPasswordsWhenSeeding` | Log user passwords when seeding                | `true`                                                                          | No       |
| `ConnectionStrings__Database`           | Database connection string                     | `db,1433;Database=ResearchCruiseApp;User Id=sa;Password=p@ssw0rd;Encrypt=False` | Yes      |
| `FrontendUrl`                           | Frontend URL - for CORS and email verification | `http://localhost:3000`                                                         | Yes      |
| `Sentry__Dsn`                           | Backend Sentry DSN; empty disables it          |                                                                                 | No       |
| `Sentry__TracesSampleRate`              | Backend trace sampling rate                    | `0.1`                                                                           | No       |
| `SmtpSettings__SmtpServer`              | SMTP server address                            | `smtp.gmail.com`                                                                | Yes      |
| `SmtpSettings__SmtpPort`                | SMTP server port                               | `465`                                                                           | No       |
| `SmtpSettings__SmtpUsername`            | SMTP mailbox address                 | `example@gmail.com`                                                             | Yes      |
| `SmtpSettings__SmtpPassword`            | Gmail app password                 |                                                                                 | Yes      |
| `SmtpSettings__SenderName`              | Email sender name                              | `Biuro Armatora z jednostką r/v Oceanograf, Uniwersytet Gdański`                | No       |
| `JWT__ValidAudience`                    | JWT valid audience                             | `https://rejsy.ug.edu.pl/`                                                      | No       |
| `JWT__ValidIssuer`                      | JWT valid issuer                               | `https://rejsy.ug.edu.pl/`                                                      | No       |
| `JWT__AccessTokenLifetimeSeconds`       | JWT access token lifetime in seconds           | `3600`                                                                          | No       |
| `JWT__RefreshTokenLifetimeSeconds`      | JWT refresh token lifetime in seconds          | `7200`                                                                          | No       |
| `JWT__Secret`                           | JWT signing secret                             | `JWTp@ssw0rdTwoHundredFiftySixBitsAtLeast`                                      | Yes      |
| `ForwardedHeaders__TrustedNetworks__0` | Network of the frontend nginx, trusted for `X-Forwarded-For` | `172.16.0.0/12` | No |
| `RateLimiting__Login__PermitLimit` | Login requests allowed per client IP and window | `60` | No |
| `RateLimiting__Login__Window` | Login rate-limit window | `00:01:00` | No |
| `RateLimiting__AccountEmail__PermitLimit` | Registration, password and email-confirmation requests allowed per client IP and window | `20` | No |
| `RateLimiting__AccountEmail__Window` | Registration, password and email-confirmation rate-limit window | `00:01:00` | No |
| `Identity__Lockout__MaxFailedAccessAttempts` | Wrong passwords before an account is locked | `5` | No |
| `Identity__Lockout__DefaultLockoutTimeSpan` | Account lockout duration | `00:15:00` | No |

Authentication is protected in two layers. Identity locks an account for `Identity__Lockout__DefaultLockoutTimeSpan` after `Identity__Lockout__MaxFailedAccessAttempts` wrong passwords, independent of the client IP. Login and the registration, password and email-confirmation endpoints also have separate fixed-window limits per client IP; a rejected request gets HTTP 429 with `Retry-After` and a Problem Details body. Session restore, refresh and logout are not IP-limited because they only act on a valid refresh cookie. The frontend nginx decides the client IP: it reads `X-Forwarded-For` only from `TRUSTED_PROXY` (nothing by default, so a directly published frontend uses the socket address) and replaces the header with that single address. The backend applies only that one `X-Forwarded-For` hop, from `ForwardedHeaders__TrustedNetworks`, and ignores `X-Forwarded-Proto`. Keep the backend port unpublished or bound to loopback, because a published Docker port can reach it from a trusted address. Staging sets `TRUSTED_PROXY` to the Docker networks for Caddy; narrow it to the `caddy` network subnet where known.

Database migrations and reference data seeding run on startup. Missing roles, UG units, research areas and ship equipment are added; existing reference rows, including inactive entries, are preserved. Seeding shares Entity Framework's migration lock so application replicas do not seed simultaneously.

`Database__SeedAccountsAutomatically` controls only the accounts configured in `users.json`. It replaces `Database__SeedAutomatically`; `Database__MigrateAutomatically` has been removed. Account seeding defaults to off in the backend, staging and production Compose, and is enabled in development Compose. For staging, rename `DATABASE_SEED_AUTOMATICALLY` to `DATABASE_SEED_ACCOUNTS_AUTOMATICALLY` in the deployment environment.

## Deployment

### Docker

The application can be run using Docker compose. Multiple configuration files are provided in the [`docker` directory](./docker/).

- `docker-compose.dev.yml` - Development configuration
- `docker-compose.infra.yml` - MS SQL Database configuration
- `docker-compose.prod.yml` - Production configuration
- `compose.staging.yaml` - Staging application and database

See [the Sentry on-prem migration notes](docs/sentry/sentry-on-prem-migration.md) for the planned move to a self-hosted Sentry instance.

SMTP credentials must not be added to `appsettings*.json` or another tracked file. Local development uses the fake SMTP sender by default, including Docker development. Staging and production Compose require `SMTP_USERNAME` and `SMTP_PASSWORD` in the deployment environment and map them to the backend's `SmtpSettings` configuration. For staging, configure these in the staging deployment environment. Copy `docker/.env.staging.template` only for local deployment setup and keep the populated file untracked. See [SMTP configuration and rollout](docs/smtp-configuration.md) for setup, rotation, and verification.
