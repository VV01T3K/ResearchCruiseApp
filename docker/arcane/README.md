# Arcane staging

`compose.yaml` is synced from this repository's `staging` branch into Arcane on
zoltan. Infrastructure declares the anonymous repository connection and injects
SOPS-backed project variables. No deployment credentials belong in this directory.

The external `researchcruiseapp-db` volume must be restored before startup.
SQL Server is isolated on an internal network with no published port. The frontend
joins the infrastructure Caddy network and imports its `protected` snippet.
CloudBeaver is intentionally outside this deployment and remains stopped.

The staging workflow builds both images, then commits their immutable digests to
this Compose file. Arcane polling observes that change and redeploys the running
project. Publishing is gated by the repository variable `ARCANE_STAGING_READY=true`,
which is enabled only after migration and rollback checks. Komodo is no longer
triggered by staging builds. A workflow dispatch can exercise a subsequent release.

Required project variables: `DB_PASSWORD`, `DB_CONNECTION_STRING`, `SMTP_USERNAME`,
`SMTP_PASSWORD`, and `JWT_SECRET`. Optional Sentry variables preserve the current
telemetry configuration. Account seeding and password logging are disabled for the
restored database.
