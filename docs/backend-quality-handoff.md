# Backend quality handoff

Updated 2026-09-29. This document stays in the repository at the user's explicit request.

## Resume here

Continue draft [PR 430](https://github.com/VV01T3K/ResearchCruiseApp/pull/430), branch `feature/backend-quality-baseline`, targeting `staging`. The baseline remains incomplete. Keep the PR draft; merging and deployment require further authorization.

The continuation checkout is `/home/wojtek/.t3/worktrees/ResearchCruiseApp/t3code-5a2f0598`, local branch `t3code/pr-430-continuation`, based on PR head `25a9b589`. The previous Ubuntu WSL checkout is a different environment. Confirm refs and the working tree before editing.

The previous next task, populated Form B/C replacement, is now covered by `Applications/FormReplacementTests.cs`. All four draft/final replacement cases reproduced lost reused permissions. Both endpoints now persist replacement references before cleanup inside their existing `DbTransactionFilter` transaction. The regression checks full HTTP content, retained SQL identities, obsolete-permission cleanup, rollback after a flushed replacement, and successful retry. See BE-ATOMIC-003 in the scenario ledger for evidence and limits.

The next integration task is resolving the PR's conflicts with `staging` while preserving both sides' behavior. On 2026-09-29, GitHub still reported `CONFLICTING` with no check results. A read-only `git merge-tree --write-tree HEAD origin/staging` preview against `373812c6` found 13 conflicts: backend Docker ignores, the application csproj, email documentation, and ten frontend files around tables, application listing and browser tests. No merge was performed. Preserve commit history, rerun the workspace gate after resolution, then inspect hosted checks. A locally green PR branch is not evidence that the merged revision passes.

After integration, continue the requirement-to-scenario audit in the ledger. Remaining examples include cross-application child sharing and equipment-category moves during form replacement, scoring beyond the funding slice, aggregate overflow, and account/file boundaries. The four new tests cover same-form draft replacement and finalization, not every cleanup or research-effect policy.

## Authoritative artifacts

- `docs/backend-testing-spec.md`: scope and acceptance requirements.
- `docs/backend-test-scenarios.md`: scenario coverage, unresolved policy, failure evidence, performance and remaining work. Implemented does not mean reviewed.
- `docs/backend-development.md`: commands and tooling.
- `docs/email-delivery.md` and `docs/permissions.md`: domain contracts.
- The PR diff: actual tooling, workflow and behavior changes. Continue these artifacts instead of creating a parallel plan.

Keep all 78 legacy cases in the gate until individual dispositions and replacements are reviewed. Repeated supervisor decisions, conflicting multi-role precedence and concurrent numbering remain unresolved. The accepted single-role ownership decision in `FormAccessTests` does not settle multi-role precedence.

## Local execution

This continuation runs on native Omarchy Linux with rootless Podman. The Docker socket at `/var/run/docker.sock` is not accessible to this user. Use the already active user Podman socket for disposable SQL test containers:

```sh
export PATH="$HOME/.dotnet:$PWD/frontend/node_modules/.bin:$PATH"
export DOTNET_ROOT="$HOME/.dotnet"
export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/podman/podman.sock"
export TESTCONTAINERS_RYUK_DISABLED=true
vp run check
```

The pinned .NET SDK 10.0.401 was installed into `~/.dotnet`. Workspace packages were restored with pnpm 10.33.0 and the frozen lockfile. This run used Node 26.10.0; hosted validation still needs to exercise `frontend/.node-version`. SQL uses the fixture's pinned SQL Server 2022 image. Disabling Ryuk is local to these commands; fixtures dispose their containers. It is not a repository configuration change.

Focused tests run from `backend` with `dotnet run --project ResearchCruiseApp.IntegrationTests -c Release -- --filter-class '*FormReplacementTests' --report-trx --results-directory artifacts/tests/<fresh-run>`. This is xUnit v3/Microsoft Testing Platform; use `--filter-class` or `--filter-method`, not VSTest `--filter`. Run CSharpier from `backend` so it finds the local tool manifest.

Ignored local evidence lives in `backend/artifacts/evidence/form-replacement-*` and `backend/artifacts/tests/`. It is not committed and must be regenerated in another checkout. Earlier Form A evidence is documented in the ledger but belonged to the previous machine. Use fresh paths when collecting new evidence.

## Latest validation

Root `vp run check` passed all 424 tests: 186 frontend, 78 legacy, 27 backend unit and 133 SQL integration, with no backend skips and zero build warnings/errors. Formatting, locked restore, temporary API comparison and frontend lint/types passed. Total duration was 158.85 seconds; integration duration was 150.935 seconds. See the final BE-ATOMIC-003 workspace evidence in the ledger for machine details and report paths. Provisional performance targets remain exceeded.

## Acceptance limits

Hosted CI, required-check configuration, negative deployment-gate evidence, performance calibration, IDE/devcontainer verification and legacy dispositions remain open. Do not infer hosted acceptance from local checks or reduce coverage to meet provisional performance targets. No agents should be spawned unless the user or applicable instructions authorize delegation.
