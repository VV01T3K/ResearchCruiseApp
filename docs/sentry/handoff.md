# Sentry preparation handoff

Recorded on 2026-09-25. The user explicitly requested this handoff in the repository, overriding the handoff skill's default external location.

## Objective and scope

Prepare production to use the private self hosted Sentry instance while staging remains in Sentry Cloud. First prove reporting from an isolated local app using synthetic data over the tester's VPN. Production access is unavailable. CI changes and manual source artifact uploads are deferred.

The findings, configuration contract, test sequence, and production checklist live in [sentry-on-prem-migration.md](sentry-on-prem-migration.md). Continue from that document rather than treating this draft as a completed migration.

## Current state

Only documentation has been changed. No application instrumentation, local test deployment, or successful ingestion test has been completed. No test projects were created and existing internal Sentry settings were not changed. The one attempted frontend project creation returned HTTP 403 despite `project:write`; resolve that permission issue or have an administrator create the two proposed projects. Do not use Sentry's own `internal` project.

The branch is `t3code/prepare-self-hosted-sentry`, based on staging `373812c6`. Staging was force pushed after the earlier review. Fetch and compare before further work; preserve existing history. A local safety ref, `refs/safety/sentry-staging-before-fetch-20260923`, retains the staging tip observed before that fetch.

## CLI access on the existing workstation

The user chose CLI instead of MCP. The installed npm package is `sentry@0.45.0`, invoked as `sentry`; it is distinct from the artifact upload tool `sentry-cli`. Cloud and internal credentials were entered locally and are stored outside the repository. Never print credentials or copy them into this document. Access must be rechecked when resuming.

Set these process environment variables for CLI inspection:

```powershell
$env:SENTRY_CLI_NO_TELEMETRY = '1'
$env:SENTRY_CLI_NO_UPDATE_CHECK = '1'
$env:NODE_USE_SYSTEM_CA = '1'
$env:SENTRY_CONFIG_DIR = Join-Path $env:USERPROFILE '.sentry-self-hosted'
$env:SENTRY_HOST = 'https://sentry.rejsy.ug.edu.pl'
sentry project list sentry/ --fresh --json --fields slug
```

For Cloud, use the `.sentry-cloud` configuration directory and remove `SENTRY_HOST` from the process environment. The Cloud organization and projects are recorded in the migration checklist. Prefer selected fields in CLI output; raw project API responses can contain security tokens.

## Next work

1. Recheck the test project list and permissions. If creating projects becomes possible, assign team `rejsyug` and set `default_rules=false`. Do not change organization policy or enable alerts to other people.
2. Resolve the container TLS failure described in the checklist and verify the actual backend runtime image. Windows trust succeeds; the disposable Alpine SDK probe did not. Never disable certificate validation.
3. Implement the isolated local deployment described in the checklist. Begin with errors only, no upload credentials, tracing disabled, and both replay rates zero. The fixed error replay rate needs a code change before this is true.
4. Run synthetic browser and backend errors and record event IDs and observed destinations. Then test tracing and replay deliberately. Existing mocked Playwright tests cannot establish ingestion.

The Sentry server release, production deployment method, and ordinary users' network route remain unknown. Keep production rollout and artifact uploads deferred until the user resumes those parts.

## Suggested skills

- `ponytail` for the smallest implementation that supports the local rehearsal.
- `unslop` for documentation and PR text.
- `handoff` when refreshing this continuation record.

Follow `AGENTS.md`, preserve any Greptile content already present in the PR description, and keep credentials, personal data, and synthetic account passwords out of commits.
