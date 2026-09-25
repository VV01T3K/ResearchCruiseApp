# Forms redesign handoff

Prepared on 2026-09-25 for another model to continue review and address manual testing feedback. The user explicitly requested this handoff in the repository, overriding the handoff skill's default external location.

## Start here

- Read [the implementation and recording guide](README.md) for the architecture, original thread identifier, branch history and official documentation links. Do not recreate that work from this handoff.
- [PR #424](https://github.com/VV01T3K/ResearchCruiseApp/pull/424) is open against `staging`. Work on `codex/forms-redesign-staging`.
- The latest implementation commit is `68a5d4b4`, `fix(forms): preserve partial drafts and explain API failures`. Read that commit for the latest backend contract and frontend error handling changes.
- Follow the root [AGENTS.md](../../AGENTS.md). Preserve existing commits and check upstream history before integrating changes. Staging previously required force pushes; the recording guide explains the safe base and recovery branch.

## User decisions that still apply

Every editable form is in scope, with a prototype first. Keep the current appearance and business workflows. Use registered TanStack `AppField` adapters and independent UI components. Keep Polish validation, validation on blur, correction on change, full validation on submit, and immediate numeric coercion and clamping.

Drafts must accept incomplete nested rows. The user previously removed required input properties because partial drafts could not be saved. Do not reintroduce blanket `JsonRequired` annotations or C# `required` properties. Response documentation must remain separate from request validation. Targeted backend and OpenAPI fixes are allowed; avoid substantial database changes.

Removing `api/client/` meant eliminating response translation wrappers, not moving those wrappers elsewhere. Consume the generated API directly. Keep necessary editable form conversions at the form boundary.

The user dislikes slow, outdated tests. Use focused checks and preserve existing test setup shortcuts; do not rewrite the suite or repeatedly run it without a concrete reason.

The main application, cruise, auth, password, account and admin data entry forms were migrated. Do not claim every editable control has been migrated: export selectors, filters and import controls were not all converted. Check any disputed form against the actual PR diff.

## Next actions

1. Check new PR comments and the latest Greptile review. A [rereview request with TREX runtime verification](https://github.com/VV01T3K/ResearchCruiseApp/pull/424#issuecomment-5833792280) was posted after `68a5d4b4`. Runtime verification by Greptile is not yet confirmed.
2. Support the user's manual testing on the local instance. Address concrete regressions and useful review findings, especially partial draft preservation and visible failure reasons.
3. Keep the PR updated. Do not merge or deploy to staging without the user's instruction.

The previous turn finished implementation, checks, commit and push. No known failing check or unfinished source edit remains from that turn. Broad claims that every possible server failure has been exercised would be inaccurate. The shared error handling has fallbacks, with targeted regression coverage.

## Verification evidence

See PR validation notes and commit `68a5d4b4` for test changes. Local ignored evidence is under `artifacts/`:

| Evidence | File |
| --- | --- |
| Backend build, zero warnings or errors; OpenAPI snapshot unchanged | `draft-contract-backend.log` |
| Eight backend contract tests, including partial nested drafts | `draft-errors-backend-tests.log` |
| Frontend unit suite and focused error handling checks | `draft-errors-unit.log`, `draft-errors-focused-unit.log` |
| Type checking, formatting, lint and production build | `draft-errors-type.log`, `draft-errors-check.log`, `draft-errors-build.log` |
| Browser draft rejection, preserved partial row and successful retry | `draft-errors-browser.log` |
| Auth, account, cruise and user management regression checks | `draft-errors-regression.log` |
| Partial permission saved and reopened using real backend and SQL | `draft-errors-real-instance.log` |

The browser regression run had 19 immediate passes and two page load timeouts that passed on retry. These were navigation timeouts, not failed form assertions. The production build still reports a large chunk warning.

## Local testing instance

At handoff, the frontend responds at <http://localhost:5185> and the backend runs on port `3104`. This is a dedicated local SQL instance, not staging and not mocked API responses. Confirm service health after machine restarts.

Local credentials and setup instructions are in the ignored `artifacts/FORMS-INSTANCE.md`. Do not copy its credentials into tracked files, PR comments or this document. Those local artifacts may be absent in another checkout.

- Docker container and dedicated volume: `researchcruise-forms-review-db`, SQL host port `14334`.
- WSL user systemd services: `researchcruise-forms-backend`, `researchcruise-forms-frontend`.
- Local helper scripts: `artifacts/forms-instance-env.sh`, `artifacts/run-forms-instance.sh`, `artifacts/start-forms-instance.sh`.
- The real database save and reopen check is `artifacts/check-forms-instance.cjs`.

Use the existing local guide to start the instance. The backend can need a restart if it starts before SQL is ready. Avoid launching duplicate services.

## Environment notes

Windows Git handles this worktree. WSL Git cannot parse its Windows worktree metadata, so run Git and `gh` from PowerShell. Frontend tooling and .NET checks have worked in WSL.

- WSL tooling paths: `$HOME/.local/share/vite-plus/bin` and `$HOME/.dotnet`.
- Browser checks require `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64` in this environment.
- Run backend tests against `backend/ResearchCruiseApp.Tests/ResearchCruiseApp.Tests.csproj` explicitly. A directory argument previously returned without running the intended tests.
- For complex WSL commands, write an ignored shell script under `artifacts/` and execute it. PowerShell quoting can alter nested quotes and pipes.
- Use UTF-8 file writes or `apply_patch` for Polish text. Piping PowerShell here-strings into Node previously corrupted non-ASCII literals.
- The Windows commit hook could not use the WSL dependencies. Previous commits used a per-command `core.hooksPath=NUL` override after explicit checks. Do not disable hooks globally.

## PR content and recordings

Preserve the `<!-- greptile_comment -->` block when editing the description. It was accidentally overwritten earlier and restored. Fetch the current body immediately before editing and change only the intended text.

Videos are embedded as GitHub user attachments in the PR. Do not add video binaries to the repository. The current clips use mocked API responses and must remain labeled accordingly. The later real database check is separate evidence, not a replacement description for those clips. Recording instructions are in [README.md](README.md).

## Suggested skills

- `ponytail` for implementation and review fixes. Prefer existing library mechanisms and small changes.
- `unslop` for prose, PR updates and user messages.
- `codebase-design` if a new boundary or adapter design needs reconsideration.
- `handoff` when updating this document for another session.
- `grilling` only if a new product decision needs the user's input. The choices above have already been answered.

Keep progress updates concise and regular. The user repeatedly asked for status during long silent stretches. Continue authorized work without asking the same permissions again.
