# Handoff to the documentation rewrite agent

Historical preparation. The user chose to continue the rewrite in this session.
Use the root README for current instructions and `research.md` for verification.

## Task

Rewrite ResearchCruiseApp's README and the directly related documentation so a
new contributor can start locally without deleting data and an operator can
configure production without relying on hidden knowledge. Keep root agent
instructions small and useful. Read [the research and audit](research.md) and
[the templates](templates.md) first. These are a starting point, not evidence
that a procedure has been tested.

This task concerns documentation. Preserve unrelated changes and existing
AGENTS.md rules. Do not deploy, contact external services, reset databases,
rotate credentials, or alter application behavior to make documentation claims
true. Record implementation defects separately. If a safe production path needs
code or deployment configuration changes, explain the blocker and the smallest
follow-up needed rather than publishing an unsafe workaround as supported.

## Work sequence

1. Inspect the current commit and working tree. Recheck the audit against current
   code. Read package scripts, mise tasks, Dockerfiles, Compose, Kubernetes, CI,
   backend startup/configuration, and frontend configuration consumers before
   writing commands. Preserve the distinction between intended and actual behavior.
2. Resolve the supported local bootstrap. Trace how `vp` is installed, select
   the package workflow supported by the repository, and identify shell limitations.
   Check launch URLs, non-destructive DB startup, first account access, and fake
   SMTP output. Do not silently resolve conflicting metadata through prose.
3. Identify the maintained production path. Verify configuration injection,
   database/TLS/network assumptions, image selection, administrator bootstrap,
   persistent data, and upgrade/restore procedures. A filename containing `prod`
   is not evidence that the file is production ready. Ask the maintainer only for
   operational choices or facts the repository cannot establish; continue other work.
4. Use the README template to write the short entry point. Create one deployment
   guide; split configuration into another file only if this improves lookup.
   Reuse SMTP and email delivery guides as their canonical topics.
5. Repair conflicting linked documentation in the same change. Verify the testing
   guide and permissions matrix before retaining claims. Clearly label unverified
   or historical content; do not erase useful domain knowledge because it is long.
   Keep the Sentry migration plan distinct from current setup.
6. Extend AGENTS.md only with verified commands, regeneration requirements,
   destructive task caveats, and conditional links that prevent actual mistakes.
   Preserve existing Conventional Commits and frontend organization requirements.
7. Check the documentation as a user would. Record command, directory, shell,
   prerequisites, observed outcome, and anything not run. Report remaining blockers
   explicitly. Archive or remove this temporary preparation directory after its
   findings have been incorporated and accepted.

## Questions to settle through evidence

Evaluate [TanStack Intent](https://tanstack.com/intent/latest/docs/overview) as the
consumer of dependency skills, using the research addendum. Inspect exact installed
versions for available skills, review their contents, and account for the existing
`skills-lock.json` installation workflow. Propose a minimal explicit allowlist and
task-based loading if useful coverage exists. Keep this evaluation separate from
the documentation rewrite: do not install hooks, upgrade dependencies, or claim
Intent is configured merely because the handoff recommends evaluating it. If no
matching skills exist, use official documentation matching the dependency version.

- Which production deployment route is maintained today? Repository files prove
  available configurations, not the actual live host, TLS setup, or backup policy.
- What is the supported clean-machine installation route, including `vp`, and
  which OS/shell combinations have been tested?
- How is the first production administrator created when automatic account
  seeding is off? Can this be done without logging passwords?
- What data outside SQL Server, if any, must be backed up? What restore procedure
  has actually been exercised?
- Are Kubernetes deployment and the Sentry migration current, planned, or retired?

Document unresolved answers as limitations. Do not invent domains, resource
requirements, support contacts, secrets, or successful recovery tests.

## Acceptance checks

- The opening explains purpose and intended users in plain language. Production
  setup and local development are reachable without searching through settings.
- A fresh contributor can follow one complete local sequence. Every command has
  a directory and shell; success includes URLs and first access. Repeating setup
  does not reset an existing database. Destructive recovery commands are separate.
- Production instructions identify prerequisites and required overrides. Sample
  passwords and JWT keys are never recommended for live use. There is no claim
  that env-file values override hardcoded settings without a verified mechanism.
- Configuration differentiates defaults, examples, conditional requirements,
  secret inputs, build-time values, and runtime values. Each setting can be traced
  to a consumer or deployment mapping.
- Deployment checks distinguish a responding process from working authentication,
  database access, and mail delivery. Startup migrations and persistent keys have
  documented operational consequences. Untested backup/rollback claims are absent.
- Agent guidance preserves existing rules, avoids an inventory of discoverable
  files, and routes to detail by task. Important facts have one canonical home.
- Local Markdown links and anchors resolve. No template placeholders, misleading
  commands, stale test counts, or conflicting current/planned instructions remain.
- Documentation commands are tested in an isolated local environment where
  available. No real deployment or reset is needed for this review. Static checks
  are explicitly distinguished from successful execution. If execution is blocked,
  report the exact missing prerequisite and mark the affected instructions unverified.

For a small check of agent usefulness, give a fresh agent one bounded task, such
as locating the API generation procedure or choosing validation for a schema
change. Check whether it selects the right files and commands without reading
the whole documentation set. This is a practical smoke check, not a research
benchmark or a requirement to build an evaluation framework.

## Deliverable report

List the files changed, the unsafe or misleading instructions corrected, the
commands actually exercised, and the unresolved operational decisions. Separate
documentation completion from production readiness. Do not claim application
tests passed when only links and prose were checked.
