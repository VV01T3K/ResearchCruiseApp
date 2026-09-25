# Documentation continuation handoff

Prepared on 2026-09-25 for a fresh agent. The user explicitly requested this
handoff in the repository, overriding the handoff skill's default external location.

## Current state

The documentation rewrite is implemented on
`docs/rewrite-readme-and-deployment-guides` in
[PR #423](https://github.com/VV01T3K/ResearchCruiseApp/pull/423), targeting `staging`.
The PR was open and the working tree clean before adding this note. Latest local
commit was `4545150a`. Frontend checks, backend checks, and the test job all passed
when inspected today. Check the current head and results before taking further action.

Read the [PR diff](https://github.com/VV01T3K/ResearchCruiseApp/pull/423/files)
for implemented changes rather than repeating the original rewrite. The earlier
[handoff](handoff.md) is historical preparation, not the current task list.

## User intent and settled choices

- Make documentation useful to humans and agents with only necessary content.
  Human guides need explanations, setup, production configuration, and recovery.
  Agent guidance should stay short with conditional task references.
- Production's main path is Docker Compose on a server. Staging uses Komodo/Caddy.
- A replacement team should understand which services, accounts, permissions,
  and settings are required. The user does not want a named owner or password
  manager inventory as a prerequisite to finishing these guides.
- The user disliked the first README structure and requested inspiration from
  the local CAISE examples. The current README incorporates that request; its
  revised structure has not yet received explicit user feedback.
- Branch rename, commits, pushes, and creation/update of this PR were authorized.
  Merging, deployment, credential rotation, and changes to external services were not.

## Read the existing artifacts

Start with [README](../../README.md), [repository instructions](../../AGENTS.md),
and [contribution process](../../CONTRIBUTING.md). Follow their links for development,
tests, configuration, production, operations, SMTP, and Sentry. Those guides contain
the service mappings and known configuration hazards; do not duplicate them here.

[Research](research.md) records the sources, repository audit, and earlier
verification. [Templates](templates.md) records the original proposed structure.
The current README supersedes that template where they differ.

The user's reference material was under `~/Desktop/specs/README (Templatka)/`
and `~/Projects/CAISE/NLP-LEX/`, specifically `pdf-2-json`, `codec-normalization`,
`currenda/s1-file-loan-labels`, and `currenda/s3-record-disposal-labels`.
The strongest examples used a concise description, contents, installation, usage,
testing, project structure, and API reference. Their Python/GitLab assumptions and
mandatory badges are not requirements for this repository. Do not modify those projects.

Earlier requested writing references included ISO 24495-1:2023, ASD-STE100, BLUF,
Cursor's unslop skill, AI Hero's writing for agents guidance, and TanStack Intent.
The research document holds the findings. Do not claim formal standards compliance
or that Intent is installed/configured.

## Useful next work

No additional rewrite is required merely to complete this handoff. If asked to
continue the documentation review:

1. Inspect the current diff and user feedback on the revised README. Preserve
   its working quick start and existing incoming anchors.
2. Audit `docs/permissions.md` against current authorization code before presenting
   its older endpoint matrix as reliable. It was identified as a gap but not repaired.
3. Check overlapping frontend form `WARNING.md` notes for obsolete or duplicate
   guidance. They have not been fully audited.
4. Review PR feedback and current checks. Verify findings against code before
   changing documentation. Do not invent a required Greptile confidence threshold.
5. If removing historical preparation files after acceptance, preserve relevant
   evidence and fix incoming links. No removal has been requested yet.

The operations guides already flag the staging webhook branch mismatch, unsafe
staging defaults, Sentry upload destination defaults, and telemetry capture behavior.
These are documented implementation issues, not fixed code. Treat remediation as
separate work rather than silently changing deployment behavior during prose edits.

## Verification boundaries

Prior checks included an isolated Docker startup, seeded login and fake email
password recovery, production Compose example validation, and frontend unit tests.
See the research record and PR description for details. The latest README revision
passed 24 local link/anchor checks and `git diff --check`; CI subsequently passed.

Live production/staging deployment, actual Gmail delivery, Sentry ingestion,
external account recovery, and backup restoration have not been exercised.
Do not describe them as tested. Local Lefthook was unavailable; commits printed
that warning. Use appropriate direct checks and report their scope.

## Suggested skills

- `unslop`: required for prose; preserve exact identifiers and commands.
- `handoff`: when updating this continuation record for another session.
- `ponytail`: if subsequent work involves code or configuration implementation.
  Keep documentation-only work free of unnecessary tooling or dependencies.

Apply current `AGENTS.md` instructions and Conventional Commits. Keep credentials,
private mailbox details, and sensitive logs out of documentation and PR messages.
