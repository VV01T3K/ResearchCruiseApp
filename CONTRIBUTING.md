# Contribute through GitHub

Open routine changes against `staging`. Recent development PRs use that branch,
and eligible pushes to it trigger deployment to the staging server. Coordinate
promotion to `main` with a maintainer; it is the release branch.

## Prepare a pull request

1. Create a descriptive topic branch from the intended base. For a dependent PR,
   target its parent branch and state the dependency in the description.
2. Follow the [commit and code conventions](AGENTS.md). Use Conventional Commits
   for commits you write. If you squash a PR, use a Conventional Commit message
   for the resulting commit too.
3. Run the relevant [validation commands](frontend/README.md#check-a-change).
   For contract changes, commit both outputs from
   [API regeneration](frontend/README.md#regenerate-the-api-client).
4. Describe the problem, resulting behavior, and checks performed. State what
   remains untested. Include a screenshot for a visible change when it helps
   a reviewer assess the result.

[Lefthook](.lefthook.yaml) configures formatting before commits and stages its
fixes. Inspect the staged diff after it runs. If the hook cannot run, execute the
relevant checks directly and record any checks you could not complete.

## Work through review

Use the PR's current diff, check results, and review threads together. Fix verified
defects. When a finding does not apply, explain the relevant code path or evidence
in the thread. After pushing a fix, check results for the new commit before merging.

### Greptile

The repository controls review behavior through these files:

- [.greptile/config.json](.greptile/config.json) configures review triggers and output.
- [.greptile/rules.md](.greptile/rules.md) defines review priorities and evidence requirements.
- [.greptile/files.json](.greptile/files.json) supplies context files for specific change areas.

The configuration enables automatic review on PR opening, excludes Renovate,
and enables status checks and comments. It allows Greptile to update the PR
description. Automatic approval is off. Generated API files and the generated
route tree are excluded from review, so generation checks still matter.

Automatic review on every new push is not configured. After addressing findings,
check the last reviewed commit. If another review is needed, use the
**Re-trigger Greptile** control in its review summary. See
[Greptile's review updates](https://www.greptile.com/changelog) for that control.

Treat the confidence score as review evidence, not merge authorization. The
repository does not define a minimum score. When TREX runs, the review rules
require the command, exit status, and execution artifact, with skipped checks
and conclusions from code inspection identified separately.

## Checks and deployment triggers

| Workflow | Trigger and result |
| --- | --- |
| [Format and lint](.github/workflows/format-and-lint.yaml) | Runs on pushes subject to its path filter. Checks frontend code and generated client output; builds and tests the backend and checks OpenAPI output. |
| [Playwright](.github/workflows/playwright.yaml) | Runs on PRs targeting `main` or `staging`, and pushes to those branches. Runs frontend unit and browser tests. |
| [Komodo staging](.github/workflows/deploy-komodo-staging.yaml) | Builds images for eligible PRs to `staging`. On eligible pushes, publishes the staging images and then triggers Komodo. |
| [Main images](.github/workflows/build-and-deploy.yaml) | Builds images for eligible PRs to `main`. Publishes images on eligible pushes to `main` and version tags. The deployment jobs in this file are commented out. |

Both image workflows exclude changes limited to documentation, Markdown, or
`.gitignore` through their path filters. A PR image build does not publish images
or deploy the application. A merge to `staging` can deploy through the resulting
push, so check staging configuration before merging a change that requires new
settings or credentials.

## Merge and promotion

Check the PR base, the latest commit's validation, and outstanding review findings
before merging. For `staging`, use squash or rebase merge to preserve linear
history. Check the resulting commit message when squashing. Preserve existing
branch history unless rewriting it has been explicitly authorized.

GitHub settings checked on 2026-09-22:

- The active `staging` ruleset requires linear history and restricts branch
  creation and deletion. It does not require approvals or passing status checks.
- The `main` ruleset is disabled. Its configured review requirements are therefore
  not enforced by that ruleset.
- The repository enables squash, rebase, and merge commits globally, and automatic
  deletion of merged topic branches. Branch rules can narrow those options.

These are a settings snapshot, not a promise that checks or reviews are enforced.
Consult [the live rulesets](https://github.com/VV01T3K/ResearchCruiseApp/settings/rules)
before relying on enforcement. Required approvers, a preferred squash-versus-rebase
policy, and the exact promotion procedure from `staging` to `main` are not yet
defined in the repository. A maintainer must settle those decisions for a release.

## Release a version

After the intended changes reach `main`, a maintainer can run
[Release version](.github/workflows/release-version.yaml) from GitHub Actions on
`main` and choose a major, minor, or patch increment.

The workflow updates `.version`, the frontend package version, and the backend
project version. It generates changelog entries from commit subjects, commits
the changes, creates an annotated version tag, and publishes a GitHub release.
It requires the configured release deployment key for the push.

The version tag triggers image publication. Publishing a release does not install
it on the production server. Follow [the server upgrade procedure](docs/deployment.md#upgrade-or-roll-back)
to deploy the selected matching images, including the backup and verification steps.
