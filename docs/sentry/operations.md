# Operate Sentry

The team needs project access to investigate reports and administrative access
to manage tokens, alerts, retention, quotas, and members. Source code cannot
recover event history or project settings.

## Configure ingestion and build uploads

Runtime DSNs route events. Build authentication uploads source maps and debug
files. Never put `SENTRY_AUTH_TOKEN` in browser runtime configuration.

| Setting | Where it takes effect |
| --- | --- |
| `SENTRY_DSN_FRONTEND`, `SENTRY_DSN_BACKEND` | Compose maps runtime settings. Recreate containers after changing them; see [configuration](../configuration.md). |
| Trace/replay sample rates | Runtime settings. Staging defaults to 1; review volume and cost. |
| `SENTRY_AUTH_TOKEN` | Actions passes a BuildKit secret for uploads during image builds. |
| `SENTRY_ORG`, `SENTRY_PROJECT` | Build arguments. Dockerfiles default to `cruiseteam` and `frontend-staging`/`backend-staging`. |
| `APP_ENVIRONMENT`, `SENTRY_RELEASE` | Image build settings. Workflows use component names plus the Git SHA for releases. Rebuild to change baked values. |

Both active image workflows inherit those project defaults and use the same
upload secret. A production build does not automatically select a production
project. Align upload destinations with runtime DSNs. An empty frontend DSN
skips SDK initialization.

Prefer an organization upload token so builds do not depend on a departing user's
account. Grant permissions required by the tools and intended projects, replace
the Actions secret, verify uploads and readable frames, then revoke the old token.
See Sentry's [token guide](https://docs.sentry.io/api/guides/create-auth-token/)
and [permissions](https://docs.sentry.io/api/permissions/).

## Investigate reports

1. Select the project, environment, and time window. Compare the event release
   with the deployed image's commit, not only the application version.
2. Inspect the exception, stack, operation, and frequency. Reproduce in staging
   with controlled data when more evidence is needed.
3. For missing events, check runtime DSN, browser ingestion requests, filters,
   quotas, and network/SDK failures. Sampling does not guarantee every trace.
   Backend health transactions are excluded.
4. For unreadable frames, inspect that release's build upload logs, token access,
   and destination project. Changing runtime DSN cannot repair failed uploads.
5. After deploying a fix, monitor recurrence in the new release. Configure alerts
   to a monitored destination; project membership alone does not establish alerts.

## Check captured data

Current frontend initialization sets `maskAllText`, `maskAllInputs`, and
`blockAllMedia` to false. Error replay sampling is 1 even if the normal replay
session rate is 0. Setting only the session rate to zero does not disable all replay.
The backend enables default PII and request bodies. It removes selected sensitive
headers, cookies, server name, and user IP from error events. This is not blanket
redaction of request bodies or all telemetry.

Inspect [frontend initialization](../../frontend/src/integrations/sentry/client.ts)
and [backend scrubbing](../../backend/ResearchCruiseApp/Infrastructure/Sentry/SentryConfiguration.cs)
before changing collection. Decide permitted production data, masking, retention,
and access; verify with synthetic staging data. Do not test capture with real reset
links or private form contents. Treat exported reports as sensitive application data.

Self-hosted production Sentry is a [pending migration](sentry-on-prem-migration.md),
not evidence of an existing service or current data residency.
