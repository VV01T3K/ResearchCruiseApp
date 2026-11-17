# Staging deploy check

The staging deploy job (`.github/scripts/deploy-staging.sh`, #653, #678) asks Arcane, not
the public site, whether the deploy worked:

1. It reads Arcane's `up` stream (activity id, then log lines, then `done` or `error`).
2. It polls the project's `runtime` endpoint (the deploy URL with `/up` replaced by
   `/runtime`) until every service is running and healthy.

The deploy API key needs only `projects:deploy` and `projects:read`.

Don't add checks that load the public site from GitHub runners: Cloudflare challenges
the runners, so such a check fails even when staging is fine, and a red deploy blocks
releases. Keep changes to the deploy check small and avoid new variables or keys.

Each Arcane endpoint the job calls is allow-listed in several places in front of
Arcane, so a new endpoint needs the owner to open it there first. An empty 404 means
the request was stopped before it reached Arcane.
