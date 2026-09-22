# Operate and take over the service

A replacement team needs control of the deployment hosts, database, domain,
sending mailbox, and GitHub automation. Cloning the repository does not recover
those services or their credentials. This guide describes what must be available;
it does not identify a verified production host.

Use [deployment](deployment.md) for production installation and upgrades,
[configuration](configuration.md) for application settings, and
[CONTRIBUTING.md](../CONTRIBUTING.md) for review, merge, and release procedures.

## Required services and access

| Resource | What the team needs to control |
| --- | --- |
| GitHub repository | Code, PRs, Actions secrets, rulesets, deploy keys, and installed apps |
| GitHub Container Registry | Publish from Actions, pull both application images on each host, and retain known working image digests |
| Production server | SSH, Docker Compose, protected environment files, proxy configuration, and persistent storage |
| SQL Server and backup storage | Application credentials plus separate administrative access for migrations, backups, and isolated restores |
| Domain, DNS, and HTTPS proxy | DNS changes, certificate renewal, proxy logs, domain renewal, and provider account recovery |
| Gmail sending account | Account recovery, two step verification, app password creation/revocation, and delivery failure inspection |
| Komodo and staging host | Deployment procedure, stack environment, Docker resources, and registry pull access |
| Staging Caddy and Cloudflare | Caddy Docker label integration, the `crowdsec` snippet, and the webhook access check |
| Sentry | Projects, DSNs, upload tokens, alerts, retention, quotas, and membership |
| Greptile | GitHub app installation, connected repository, review settings, and subscription if required |

Sentry and Greptile support diagnosis and review; the application can run without
them. SQL Server, the application host, and public routing are runtime dependencies.
Real SMTP is needed for account confirmation and password recovery.

Account recovery and subscription renewal must remain possible after an individual
leaves. Preserve recovery email and second factor access as well as service logins.
Keep credentials outside this repository.

For an existing installation, retain host addresses, checkout and environment file
paths, Compose project names, image digests, database/storage names, backup location
and schedule, public URLs, and external proxy/Komodo configuration. Paths in the
production guide are an installation convention, not a live infrastructure inventory.
The database contains application records, uploaded data, queued email, and Data
Protection keys. Rebuilding images cannot recover a lost database.

## Where configuration belongs

| Layer | Contents | Apply a change |
| --- | --- | --- |
| Repository | Workflows, Dockerfiles, Compose files, defaults, Greptile rules | Review and merge a commit |
| GitHub Actions secrets | Build upload token, webhook credentials, release SSH key | Update the secret, then run the appropriate workflow |
| Komodo stack environment | Staging database, SMTP, URLs, runtime Sentry settings, secure overrides | Redeploy and recreate affected containers |
| Production environment/override files | Database, JWT key, SMTP, URLs, ports, users file, runtime Sentry settings | Validate with `config --quiet`, then follow the server deployment procedure |
| External service settings | DNS, TLS, webhook gate, Komodo procedure, Sentry alerts/projects, Greptile installation | Change in the service and verify the integration |

Actions secrets do not automatically become container environment variables.
Compose must explicitly map values into services. Recreate containers after
environment changes; a restart keeps the old environment. Avoid sharing expanded
Compose output or `docker inspect` output, which can expose credentials.

## GitHub automation and secrets

On 2026-09-22 GitHub reported no repository deployment environments. Active jobs
do not declare `environment:`. `APP_ENVIRONMENT=staging` or `production` is an
application build setting, not a GitHub Environment or approval gate. Creating
an Environment alone does not connect it to these jobs. See GitHub's
[deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)
and [secret configuration](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).

Manage credentials under **Settings > Secrets and variables > Actions**:

| Secret | Use and replacement requirement |
| --- | --- |
| `SENTRY_AUTH_TOKEN` | Both image workflows upload frontend source maps and backend debug files. Authorize the intended organization/projects; never expose this build token in browser configuration. |
| `KOMODO_WEBHOOK_SECRET` | Signs staging webhook payloads. Replacement must match the listener configuration. |
| `CLOUDFLARE_WEBHOOK_SECRET` | Sent as `X-Cloudflare-Secret`. Replacement must match the external access check. |
| `VERSION_RELEASE_DEPLOYMENT_KEY` | SSH private key for pushing release commits/tags. Its corresponding public key must have repository write access. Replace both sides together. |
| `GITHUB_TOKEN` | GitHub supplies it per run for registry/release operations. Check workflow/package permissions on failure; do not create a permanent secret with this name. |

The first four names were present when checked. `DOCKERHUB_USERNAME` and
`DOCKERHUB_TOKEN` also existed but are unused by active workflows. Commented
Kubernetes steps do not make `KUBECONFIG`, `DB`, or `JWT_SECRET` requirements
of the current Compose deployment.

Inspect names and run results without retrieving values:

```sh
gh secret list
gh api repos/VV01T3K/ResearchCruiseApp/environments --jq '.environments[].name'
gh pr checks <pr-number>
gh run list --limit 10
```

Open the failed job before retrying. Registry authorization, Sentry upload,
compilation, and webhook delivery are separate failure points. Check the run's
commit; retrying can publish images or deploy. For a partly completed release,
inspect existing commits, tags, and the GitHub release before rerunning. Do not
delete tags or force push to make a release run pass.

## Deploy and diagnose staging

The [workflow](../.github/workflows/deploy-komodo-staging.yaml) builds PR images
without publishing. Eligible pushes to `staging` publish both mutable `:staging`
tags, then call Komodo. Documentation-only changes are excluded by path filters.
Komodo must pull and deploy through an externally configured procedure. That
procedure definition is not in this repository.

The [database stack](../docker/compose.staging-db.yaml) creates
`researchcruiseapp-network` and the `researchcruiseapp-db` volume. The
[application stack](../docker/compose.staging-app.yaml) expects that network plus
the external `proxy` network. Its labels require Caddy's Docker label integration
and an external `crowdsec` snippet; stock Caddy alone does not consume them.

For a new installation, configure those dependencies and the Komodo procedure,
start the database, wait for health, then deploy the application. Supply SMTP
credentials and review [the staging template](../docker/.env.staging.template).
`https://cruise.wsiwiec.com` is a repository default, not proof of a live deployment.

The staging files default to automatic seeding, password logging, and a sample
database password. They do not map a replacement JWT key. Supply secure overrides
before public use and disable password logging. The database file hardcodes its
initial SA password; changing the app's `DB_PASSWORD` alone does not change it.
Rotate existing credentials in SQL Server and update the app connection settings.
Preserve the database volume.

Verify deployment in this order:

1. Check both image build results and record their digests. Mutable tags can change
   while deployment is in progress.
2. Check webhook delivery, then Komodo procedure/stack logs. HTTP 200 establishes
   listener acceptance, not successful container replacement.
3. Compare deployed image digests and check container status.
4. Check the public page, `/api/health`, login, and an authenticated operation.
   `/api/version` reports a version that may span multiple commits.
5. Verify changed mail or telemetry settings with controlled accounts and data.

There is a branch mismatch to verify: the workflow calls
[trigger-komodo-webhook.sh](../scripts/trigger-komodo-webhook.sh) without an argument,
so the payload says `refs/heads/main` although the workflow deploys staging. The
listener URL ends in `__ANY__`. Confirm the external procedure's stack source and
branch; webhook success does not establish which checkout it uses.

For webhook failures, check URL, DNS/TLS, Cloudflare access, and the matching signing
secret. For success with an old application, check Komodo pull/recreate steps and
registry access. For a 502, check Caddy labels/snippet, shared networks, frontend
logs, and backend health. Never remove a database volume to repair routing.

Rollback needs retained matching frontend/backend digests and a database
compatibility check. Reapplying `:staging` does not select an older build.
Migrations run at backend startup; follow the backup and rollback precautions
in [production deployment](deployment.md#upgrade-or-roll-back).

## Maintain Greptile

Follow [the review procedure](../CONTRIBUTING.md#greptile) for findings and reruns.
The `.greptile` files do not install or authorize the GitHub app. A replacement
setup needs a connected account, app access to this repository, and any required
subscription. No Greptile Actions secret is referenced by the workflows.

For a missing review, check app access, configured triggers, usage limits, and
integration status. Compare the last reviewed commit with the current PR head.
Automatic review on every push is not configured; use the review summary's
re-trigger control when needed. GitHub rulesets separately control required
reviews/checks; see [merge policy](../CONTRIBUTING.md#merge-and-promotion).

## Respond to an incident

| Symptom | First checks |
| --- | --- |
| Public site unavailable | DNS/TLS and proxy, then container status and recent deployment |
| API fails but page loads | Backend logs, SQL connectivity/storage, migrations, runtime configuration |
| Login or recovery fails | Public URL, JWT settings, database, then [Gmail/SMTP](smtp-configuration.md) and [outbox state](email-delivery.md) |
| Missing/unreadable reports | [Sentry operations](sentry/operations.md), DSN, filters, release, build upload results |
| Deployment never reaches host | Actions build/publish result, registry access, webhook, Komodo procedure |

Record failure time, environment, deployed digests, and the last configuration
change before repairs. Keep logs private. `/health` does not test database access,
mail delivery, or backups.

Before calling takeover complete, independently deploy to staging, send a controlled
recovery email, find a Sentry event with readable frames, and restore a backup into
an isolated database. Confirm access to select a production release and follow
rollback. These exercises establish what repository inspection cannot: whether
external access, delivery, and recovery actually work.
