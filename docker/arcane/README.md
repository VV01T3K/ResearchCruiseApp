# Arcane staging

One Compose project contains SQL Server, backend and frontend. Restore the external
`researchcruiseapp-db` volume before the initial startup. Infrastructure supplies
project variables from SOPS. CloudBeaver remains stopped and outside this project.

## Application releases

A push to `staging` builds and publishes both application images tagged `staging`.
After both builds succeed, the workflow calls Arcane's `update-services` API with
only `backend` and `frontend`. Pull requests build without publishing or deploying.
The workflow never writes commits to the repository.

The selected-service API in Arcane v2.15.0 pulls images and recreates the selected
services. Do not substitute a whole-project restart or an unscoped update request.
The database service and its external volume are excluded from application updates.
Application startup can still apply database migrations, so backups remain necessary.

## Before enabling deployment

This change is a draft until the infrastructure and live checks below are complete.

1. Disable automatic Git deployment for this project. Compose configuration changes
   require an explicit reviewed sync; image builds use the API trigger instead.
2. Sync this Compose file during an approved maintenance operation so the project
   uses `staging` tags instead of the migration's fixed image digests.
3. Configure repository variables `ARCANE_URL` (HTTPS base URL),
   `ARCANE_ENVIRONMENT_ID`, and `ARCANE_PROJECT_ID`, plus secret `ARCANE_API_KEY`.
   Use a deployment credential with the minimum required permissions. Verify that
   the GitHub runner can reach the API without bypassing access controls.
4. Test a release and compare the database container ID and start time before and
   after. Check application health and authenticated workflows. Do not declare the
   database-preservation requirement verified from HTTP success alone.
5. Enable the replacement workflow and set `ARCANE_STAGING_READY=true` only after
   approval and successful testing. Keep the retired Komodo workflow disabled.

The readiness variable gates deployment, not image publication on staging pushes.
Do not merge until the prerequisites are satisfied. Test-only commits and temporary
configuration must be removed from the PR before merge.

## Database backups

Native SQL backups are managed in the infrastructure repository through
`mise run research-cruise-backup`, including copies on both backup disks and an
isolated restore check. They are not Arcane volume backups. Scheduled execution,
retention and failure reporting still need to be completed in that repository;
this app change does not install a backup schedule.

Required project variables: `DB_PASSWORD`, `DB_CONNECTION_STRING`, `SMTP_USERNAME`,
`SMTP_PASSWORD`, and `JWT_SECRET`. Optional Sentry variables preserve the current
telemetry configuration. Account seeding and password logging remain disabled.
