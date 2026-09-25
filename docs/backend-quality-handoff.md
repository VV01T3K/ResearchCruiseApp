# Backend quality handoff

Prepared 2026-09-25. This document is intentionally in the repository at the user's explicit request, overriding the handoff skill's default external location.

## Resume here

Continue the backend testing and tooling work on branch `feature/backend-quality-baseline`, targeting `staging`. This is an incomplete implementation submitted as a draft PR, not an accepted testing baseline. Do not merge or deploy without further authorization.

The working checkout for this session is `/home/wojtek/projects/ResearchCruiseApp-backend-quality` inside Ubuntu WSL. The Windows T3 checkout shown by the session environment is a different, older checkout. Confirm the branch and files before editing. Use the PR branch in a fresh session if this WSL checkout is unavailable.

Start with `docs/backend-test-scenarios.md`, especially **Remaining acceptance work** and the last BE-ATOMIC-002 evidence. The next concrete task is auditing populated Form B/C replacement: `Api/Applications/FormB/Endpoints.cs` and `FormC/Endpoints.cs` call `Shared/Writing/FormDeletionService.cs` before replacement references are persisted. Form A had the same ordering and lost a reused research task when submitting a populated draft. Its fix persists replacement references within the existing transaction before cleanup. Do not blindly copy that save into B/C: inspect their transaction ownership and prove rollback and shared child preservation through HTTP and SQL first.

All API paths above are relative to `backend/ResearchCruiseApp/`. Reuse `backend/ResearchCruiseApp.IntegrationTests/Applications/FormAAtomicityTests.cs` and existing B/C workflow fixtures. The Form A test proves rollback under an injected SQL outbox constraint, unchanged draft identity/content, and a successful retry with one invitation. It exposed the task loss during recovery; failure and passing evidence are recorded in the ledger.

## Authoritative artifacts

- `docs/backend-testing-spec.md`: scope, requirements, acceptance gates.
- `docs/backend-test-scenarios.md`: scenario coverage, explicit unresolved policy, failure demonstrations, local execution evidence, remaining work. Implemented does not mean maintainer reviewed.
- `docs/backend-development.md`: commands and tooling.
- `docs/email-delivery.md`: durable invitation/email contract.
- `docs/permissions.md`: permission requirements.
- The PR diff: actual implementation, infrastructure, dependency locks, workflow changes and regression fixes. Do not duplicate or replace those artifacts with a new plan.

## Validation and limits

Latest root `vp run check` passed all 420 tests with zero build warnings/errors: 186 frontend, 78 retained legacy, 27 unit, 129 SQL integration. Root duration 148.96 seconds; integration setup/execution 131.068 seconds. Formatting, locked restore, generated API comparison and `git diff --check` passed. Performance remains above provisional targets; do not drop coverage to meet them.

Local ignored evidence: `backend/artifacts/evidence/form-a-atomic-workspace.{log,seconds,exit}`, `backend/artifacts/tests/run-dkxPCI/`, and `form-a-atomicity` / `form-a-atomicity-green` focused logs and reports. These artifacts are not in Git and will need regeneration in another checkout. Hosted CI, branch protection and deployment blocking behavior are not yet verified. Inspect draft PR checks next; do not describe local evidence as hosted acceptance.

Keep all 78 legacy tests in the gate until individual dispositions and replacements are reviewed. Do not invent outcomes for repeated supervisor decisions, conflicting role precedence or concurrent numbering; unresolved decisions are recorded in the ledger. Existing authorization includes tests at HTTP and real SQL seams. No additional approval is needed for routine tests or reversible fixes.

## Operational notes

Windows PowerShell launches tools in Ubuntu with `wsl -d Ubuntu --cd <checkout> --exec ...`. Docker Desktop must be available to WSL for SQL Testcontainers. Ubuntu was restarted with user permission earlier after even `/bin/true` failed; it is currently working. Do not restart it routinely.

For multiline shell scripts, write LF text without a BOM to a local ignored evidence file, then execute that file with WSL bash. Piping PowerShell here-strings into bash previously produced encoding problems. Run focused tests from `backend` using `dotnet run --project ResearchCruiseApp.IntegrationTests -c Release -- --filter-class '*ClassName' --report-trx --results-directory artifacts/tests/<run>`. Follow `docs/backend-development.md` for complete checks.

The user expects action and frequent concise updates, and has repeatedly had to ask whether work was continuing. Report findings and continue authorized work. Avoid invented hyphenated compounds in prose. No agents should be spawned unless the user or applicable instructions explicitly authorize delegation.

## Suggested skills

- `ponytail`: reuse existing fixtures and make the smallest correct fix after tracing callers.
- `tdd`: write a failing regression at the already authorized HTTP/SQL seams before changing behavior.
- `unslop`: keep progress updates and documentation plain and concise.
- `handoff`: refresh this document when transferring the work again, referencing the ledger instead of duplicating it.
