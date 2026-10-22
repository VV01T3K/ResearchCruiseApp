# Releasing

Production runs the images built from `vX.Y.Z` tags. The version lives only in that tag; no file in
the repository stores it, so releases never commit to `main`.

`main` always points at the latest release and stays an ancestor of `staging`. Never merge pull
requests into `main`.

## Versions

[`.github/scripts/version.sh`](../.github/scripts/version.sh) computes the version of the checked-out
commit, and the image builds pass it to both applications as `APP_VERSION`:

| Build            | Version                                                                   |
| ---------------- | ------------------------------------------------------------------------- |
| Release tag      | `3.1.0`                                                                   |
| `staging` and PR | `3.1.0-staging.4+a1b2c3d` (last release, commits since it, short SHA)     |
| Local            | `0.0.0`                                                                   |

The navbar, the Help page (frontend and backend `/version`) and the Sentry releases
(`research-cruise-app-frontend@<version>`, `research-cruise-app-backend@<version>`) show this value.
Release images are tagged `vX.Y.Z`, matching the GitHub Release.

Release notes are generated from the merged pull requests between two tags and published as
[GitHub Releases](https://github.com/VV01T3K/ResearchCruiseApp/releases). `CHANGELOG.md` is kept only
as history up to 3.0.0.

## Release

A release takes two steps:

1. In **Actions → Release → Run workflow**, keep the branch `staging`, pick the bump (`major`, `minor`
   or `patch`) and the commit (`staging`, or the SHA of a `staging` commit). The run waits for that
   commit's CI and lists the version, its commits and the bump suggested by their Conventional
   Commits in the run summary.
2. Approve the `production` deployment. The workflow checks the commit again, tags it `vX.Y.Z`,
   fast-forwards `main` to it and publishes the GitHub Release. The tag push runs **Build production
   images**.

The commit must be on `staging` (or head a [hotfix](#hotfix) branch), and the latest CI run of each
workflow on that exact commit must pass, including the frontend, backend and dependency checks, both
image builds and the Playwright tests. A commit that only changes paths the image builds ignore
(`docs/`, `*.md`, `.gitignore`) takes its checks and image builds from its parents, back to the last
commit that changed anything else, but its own Playwright run must pass. A commit whose CI failed or
was cancelled cannot be released, and neither can one from before this release process (without
`build-production.yaml`).

If publishing the GitHub Release fails after the push, use **Re-run failed jobs** on the same run and
approve it again. It finds the tag and `main` already in place and only creates the Release.

## Deploying to production

Deploying is a separate operations step on the production server, outside the release procedure:
set `APP_VERSION=vX.Y.Z` in `docker/.env` and run
`docker compose -f compose.production.yaml --env-file .env up -d` (see
[Deployment](../README.md#deployment) for database migrations).

## Hotfix

A fix usually ships like any change: a pull request into `staging`, then a `patch` release. To ship
it without the unreleased work on `staging`:

1. Create `hotfix/<name>` from the latest release tag (`git switch -c hotfix/<name> vX.Y.Z`), commit
   the fix and push it. The push runs the same CI as `staging`.
2. Run **Release** as above with the bump `patch` and the commit `hotfix/<name>`.
3. Approve the `production` deployment. In one push, the workflow tags the hotfix commit,
   fast-forwards `main` to it and merges it into `staging`. Delete the branch afterwards.

The run refuses a hotfix that does not branch from the latest release tag or that conflicts with
`staging`; ship such a fix as a pull request into `staging` instead. The push fails as a whole if
`staging` changed since planning, if `main` no longer fast-forwards to the hotfix, or if the hotfix
branch changed before the push started; run the release again. A later change to the hotfix branch
is not caught, but only the approved commit is released.

## Repository settings

- The `production` environment requires a reviewer and allows deployments from `staging`.
- The `Release` deploy key (secret `VERSION_RELEASE_DEPLOYMENT_KEY`) is a bypass actor on the `main`
  ruleset, so it can fast-forward `main` and push the tag. It is also a bypass actor on the `staging`
  ruleset, whose linear-history rule would otherwise reject the hotfix merge commit.
