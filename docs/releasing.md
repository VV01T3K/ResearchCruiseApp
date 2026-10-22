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

1. In **Actions → Release → Run workflow**, keep the branch `staging`, pick the bump (`major`, `minor`
   or `patch`) and the commit (`staging`, or the SHA of a `staging` commit). The run waits for that
   commit's CI and lists the version, its commits and the bump suggested by their Conventional
   Commits in the run summary.
2. Approve the `production` deployment. The workflow tags the commit `vX.Y.Z`, fast-forwards `main`
   to it and publishes the GitHub Release. The tag push runs **Build production images**.

Then deploy on the production server: set `APP_VERSION=vX.Y.Z` in `docker/.env` and run
`docker compose -f compose.production.yaml --env-file .env up -d` (see
[Deployment](../README.md#deployment) for database migrations).

## Hotfix

If `staging` can ship as it is, merge the fix into `staging` as usual and release a `patch`.

Otherwise, fix the release itself:

1. Branch `hotfix/<name>` from the latest tag (`git switch -c hotfix/<name> vX.Y.Z`), commit the fix and
   open a pull request into `staging` for CI and review. Do not merge it.
2. Run **Release** with bump `patch` and commit `hotfix/<name>`, then approve it. The workflow releases
   the hotfix commit and merges it into `staging` in the same push, which marks the pull request
   merged.

The workflow refuses a hotfix that conflicts with `staging`; resolve the conflict on the hotfix branch
first.

## Repository settings

- The `production` environment requires a reviewer and allows deployments from `staging`.
- The `Release` deploy key (secret `VERSION_RELEASE_DEPLOYMENT_KEY`) is a bypass actor on the `main`
  ruleset, for the fast-forward and tag, and on the `staging` ruleset, whose linear history rule
  would otherwise reject the hotfix merge.
