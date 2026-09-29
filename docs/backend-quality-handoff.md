# Backend quality handoff

Updated 2026-09-29. This document stays in the repository at the user's explicit request.

## Resume here

Continue draft [PR 430](https://github.com/VV01T3K/ResearchCruiseApp/pull/430), branch `feature/backend-quality-baseline`, targeting `staging`. The baseline remains incomplete. Keep the PR draft; merging and deployment require further authorization.

The continuation checkout is `/home/wojtek/.t3/worktrees/ResearchCruiseApp/t3code-5a2f0598`, local branch `t3code/pr-430-continuation`, based on integrated PR head `d7538491` plus the managed-account email batch below. The previous Ubuntu WSL checkout is a different environment. Confirm refs and the working tree before editing.

The previous next task, populated Form B/C replacement, is now covered by `Applications/FormReplacementTests.cs`. All four draft/final replacement cases reproduced lost reused permissions. Both endpoints now persist replacement references before cleanup inside their existing `DbTransactionFilter` transaction. The regression checks full HTTP content, retained SQL identities, obsolete-permission cleanup, rollback after a flushed replacement, and successful retry. See BE-ATOMIC-003 in the scenario ledger for evidence and limits.

The first staging integration resolved `373812c6`, preserving history with a merge. A second integration now incorporates `4b740c20`, including Bun and dependency security checks. Its nine conflicts retain Bun workspace metadata, SDK/compiler/test settings, pinned Docker images and the PR’s matching NuGet lockfiles. JavaScript push auditing is retained; the shared gate also audits before running checks. Frontend/backend validation stays in the reusable workflow. The ten frontend conflicts retain staging's TanStack Table v9, React Compiler, virtualization and expanded browser scenarios. The three backend/documentation conflicts retain this PR's package pins, artifact exclusions and SQL baseline instructions. All 19 affected application, cruise and user-management browser tests passed with two workers and retries disabled, including desktop/mobile scrolling, filtering, sorting and selection.

Cross-application child sharing and all six directed equipment-category moves are now covered for both Form B and C, including cleanup after the final reference disappears. Continue the requirement-to-scenario audit for scoring beyond funding, aggregate overflow, and account/file boundaries. All 78 legacy cases now have individual proposed replacements or explicit remaining assertion gaps, with method-level comparisons in the ledger. All dispositions still need maintainer review. Added SQL reference-data repair tests and same-named-manager/combined-filter coverage; 18 focused startup/catalog cases pass. Seed-account repair, caller commit/rollback, failed-repair savepoints and explicit caller-owned enqueue rollback now have SQL replacement candidates in BE-STARTUP-003/004/005 and BE-EMAIL-006. Seven focused cases pass; disabling savepoint rollback makes both repair-failure cases fail, with production source restored afterward. Managed-account email validation now has HTTP/SQL replacement candidates in BE-ACCOUNT-007/008; removing the create/update request-validation filters makes both invalid-email cases fail, and the original endpoint source was restored. All 445 combined workspace cases pass. The next independent coverage work is scoring beyond funding, then remaining file/account boundaries; keep concurrent cruise numbering unchanged until its invariant is decided.

GitHub rules were inspected on 2026-09-29. The active staging ruleset only requires linear history and restricts branch creation/deletion. It has no required status checks. The main ruleset is disabled. Required workspace-check enforcement remains rollout work; the workflow must first be present on each protected branch. Hosted negative deployment-gate evidence is now recorded in the ledger; no repository rules were changed.

## Authoritative artifacts

- `docs/backend-testing-spec.md`: scope and acceptance requirements.
- `docs/backend-test-scenarios.md`: scenario coverage, unresolved policy, failure evidence, performance and remaining work. Implemented does not mean reviewed.
- `docs/backend-development.md`: commands and tooling.
- `docs/email-delivery.md` and `docs/permissions.md`: domain contracts.
- The PR diff: actual tooling, workflow and behavior changes. Continue these artifacts instead of creating a parallel plan.

Keep all 78 legacy cases in the gate until individual dispositions and replacements are reviewed. The user confirmed final supervisor decisions with readable links and rejected repeats/reversals. The user also required other users’ drafts to be hidden and uneditable for Administrator, including Administrator + CruiseManager; the verifier now enforces ownership before administrator privileges for drafts. Concurrent cruise numbering remains undecided; applications instead use SQL identity integers. See the ledger’s maintainer policy decisions.

## Local execution

This continuation runs on native Omarchy Linux with rootless Podman. The Docker socket at `/var/run/docker.sock` is not accessible to this user. Use the already active user Podman socket for disposable SQL test containers:

```sh
export PATH="$HOME/.dotnet:$PWD/node_modules/.bin:$PWD/frontend/node_modules/.bin:$PATH"
export DOTNET_ROOT="$HOME/.dotnet"
export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/podman/podman.sock"
export TESTCONTAINERS_RYUK_DISABLED=true
vp run check
```

The pinned .NET SDK 10.0.401 was installed into `~/.dotnet`. The latest staging integration uses Bun 1.3.11 and its frozen lockfile, including Socket installation scanning; pnpm is no longer the workspace package manager. The staging integration run uses the pinned Node 25.8.2, installed through mise; put that installation on PATH before running the commands. SQL uses the fixture's pinned SQL Server 2022 image. Disabling Ryuk is local to these commands; fixtures dispose their containers. It is not a repository configuration change.

Focused tests run from `backend` with `dotnet run --project ResearchCruiseApp.IntegrationTests -c Release -- --filter-class '*FormReplacementTests' --report-trx --results-directory artifacts/tests/<fresh-run>`. This is xUnit v3/Microsoft Testing Platform; use `--filter-class` or `--filter-method`, not VSTest `--filter`. Run CSharpier from `backend` so it finds the local tool manifest.

Ignored local evidence lives in `backend/artifacts/evidence/form-replacement-*` and `backend/artifacts/tests/`. It is not committed and must be regenerated in another checkout. Earlier Form A evidence is documented in the ledger but belonged to the previous machine. Use fresh paths when collecting new evidence.

## Latest validation

The managed-account email batch passes all 445 cases (189 frontend, 78 legacy, 27 unit, 151 SQL integration), with no backend skips, zero .NET build warnings/errors and no frontend lint warnings. Root took 191.195 seconds; integration took 183.354 seconds. Formatting, locked restore, generated API comparison and JavaScript/NuGet audits passed. Evidence: `backend/artifacts/evidence/managed-account-workspace.{log,seconds}` and `backend/artifacts/tests/run-EGUDvN/`. The two invalid-email fault cases failed with request validation removed; production filters were restored. Hosted validation of this batch is pending.

The latest staging integration incorporates `8d9c84e7` (dependency/TanStack Query updates and source-dependent NuGet image auditing) on top of seed-account coverage commit `01d8a927`. Four conflicts retained the PR’s compiler, API-generation and audit settings with staging’s updated package versions; all four NuGet lockfiles were restored consistently. Local `vp run check` passed 442 cases: 189 frontend, 78 legacy, 27 unit and 148 SQL integration, with no backend skips and zero build warnings/errors. Frontend lint is now warning-free. SQL integration took 181.659 seconds. Frozen Bun install, JavaScript/NuGet audits, formatting, locked restore and generated API comparison passed. All 19 affected Chromium application, cruise and user-management cases passed without retries in 40.6 seconds. Evidence: `backend/artifacts/evidence/dependency-integration-{install,restore,js-audit,first-check,browser}.log` and `backend/artifacts/tests/run-5ineyS/`. Hosted [run 36619360748](https://github.com/VV01T3K/ResearchCruiseApp/actions/runs/36619360748) passed; downloaded TRX and frontend JUnit reports confirm all 442 cases executed and passed. Evidence: `backend/artifacts/evidence/hosted-d7538491/`.

Previous validation:

Root `vp run check` after the Bun/security merge passed all 436 tests: 189 frontend, 78 legacy, 27 backend unit and 142 SQL integration, with no backend skips and zero .NET build warnings/errors. Frozen Bun install with Socket scanning, JavaScript/NuGet audits, formatting, locked restore, temporary API comparison and frontend types passed. One non-blocking frontend lint warning remains in existing `AppAccordion.tsx`. Root took 185.926 seconds; integration took 171.673 seconds. Evidence: `backend/artifacts/evidence/bun-merge-{install,audit,workspace}.log` and `backend/artifacts/tests/run-HwCYyy/`. The earlier table staging integration passed 19 browser cases without retries. Provisional performance targets remain exceeded. Hosted CI on `32d90493` passed all 436 cases; downloaded TRX and frontend JUnit counters verified. Run: [36581757188](https://github.com/VV01T3K/ResearchCruiseApp/actions/runs/36581757188).

## Acceptance limits

The hosted workspace check passed on `df350a20`: [run 36502579494](https://github.com/VV01T3K/ResearchCruiseApp/actions/runs/36502579494), all 430 cases with downloaded TRX counters verified. Duration: 4m19s. An isolated failure probe exposed masked pipeline exit status in the workflow. Explicit Bash now preserves the failure. Hosted probes 36580107873 and 36580107654 verified intentional test failure, skipped image/webhook jobs, artifact upload and continued execution of the other suites. The audit branch contains intentional failures and must not be merged.

Required-check activation after workflow rollout, performance calibration, IDE/devcontainer verification and legacy dispositions remain open. Do not infer hosted acceptance from local checks or reduce coverage to meet provisional performance targets. No agents should be spawned unless the user or applicable instructions authorize delegation.
