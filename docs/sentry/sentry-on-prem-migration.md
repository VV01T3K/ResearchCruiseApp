# Proposed migration to self-hosted Sentry

This is pending work, not a description of a deployed production service. The
repository does not establish an operating self-hosted instance or completed
migration. Use [Sentry operations](operations.md) for current wiring.

Before choosing self-hosting, establish maintenance, capacity, updates, TLS,
backups and restores, retention, alerts, and account recovery. Use the current
[official installation instructions](https://develop.sentry.dev/self-hosted/)
for requirements rather than treating this repository as an installation manual.

Implementation must cover ingestion and build uploads:

1. Provision the instance and create frontend/backend projects.
2. Add and verify the upload endpoint configuration in both Docker builds, the
   frontend Sentry plugin, and backend upload configuration. Changing DSNs alone
   does not redirect uploads. Current workflows inherit staging project defaults
   and use a shared upload secret.
3. Supply an upload token and explicit organization/project settings for the target
   instance. Confirm GitHub runners can reach it.
4. Build matching images with the intended environment and release, set runtime
   DSNs, and recreate containers. Route related frontend/backend telemetry to the
   intended instance so investigations can follow requests across them.
5. Verify synthetic errors, readable frames, release labels, permitted data capture,
   and alerts before switching production traffic.

Keep previous configuration and images for rollback. Decide separately whether
historical cloud data must be retained, exported, or deleted. Changing ingestion
neither moves nor removes existing events and does not establish data residency
compliance on its own.
