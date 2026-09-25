# Design system handoff

## Purpose and authorization

The user requested installation of `@shadcn/lint`, followed by a project
assessment. That work is complete. They then requested this repository handoff,
a descriptive branch name, and a draft PR. The explicit repository location
overrides the handoff skill's usual external storage location.

The next session can review the setup and plan adoption of the findings.
Bulk UI fixes, mandatory design rules, and a build toolchain migration have
not been requested. Treat the assessment's recommendations as proposals.

## Read first

- [Assessment](./design-system-assessment.md): scope, measured findings,
  examples, limitations, validation results, and recommended priorities.
- [Frontend README](../frontend/README.md#design-system-lint): commands,
  compatibility rationale, discovery settings, and upstream documentation.
- [Base configuration](../frontend/.oxlintrc.design.json) and
  [audit configuration](../frontend/.oxlintrc.design.audit.json): actual policies.
- [Package scripts](../frontend/package.json) and [lockfile](../pnpm-lock.yaml):
  dependency versions and execution paths.

## Context not captured in the setup

- The audit configurations intentionally repeat discovery settings and ignores.
  An attempted Oxlint `extends` configuration lost effective component
  recognition and exclusions during verification. It reduced the findings and
  scanned additional files. Do not consolidate them without comparing file
  counts and findings against the assessment.
- CLI `-W shadcn/...` flags did not enable the JavaScript rules in the initial
  probe. Use the checked-in audit configuration to reproduce the assessment.
- PowerShell 5 `Set-Content -Encoding utf8` writes a BOM that caused Oxlint to
  reject a temporary JSON configuration. Preserve UTF-8 without a BOM.
- This environment had Node available but no global `pnpm` or `vp` command.
  `npx --yes pnpm@10.33.0` provided the workspace's pinned package manager.
- The handoff is for source review. No browser validation or backend assessment
  was performed. Lint findings alone do not establish visual correctness.

## Suggested next steps

Review the draft PR on branch `chore/shadcn-lint-assessment`. Use
`gh pr view chore/shadcn-lint-assessment` to find its current URL and status.
Read the assessment before proposing a rule policy or changing components.
If asked to implement fixes, begin with the invalid classes and verify the
intended visual behavior. Preserve functional runtime positioning.

## Suggested skills

- `ponytail`: keep any follow-up configuration or code changes minimal.
- `unslop`: keep assessment updates and PR descriptions direct.
- `codebase-design`: use only if the next task includes designing component
  interfaces or styling contracts.
- `handoff`: update continuation context when transferring the work again;
  reference existing artifacts rather than copying their contents.

Write prose with separate words rather than invented hyphenated compounds.
Preserve exact code identifiers, filenames, and commands.
