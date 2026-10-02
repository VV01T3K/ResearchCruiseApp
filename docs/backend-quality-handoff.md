# Backend quality handoff

Updated 2026-10-03. Kept in the repository at the user's request.

## Resume here

Continue draft [PR 430](https://github.com/VV01T3K/ResearchCruiseApp/pull/430), remote branch `feature/backend-quality-baseline`, base `staging`. Local branch `t3code/pr-430-continuation` is in `/home/wojtek/.t3/worktrees/ResearchCruiseApp/t3code-5a2f0598`. Verify refs and the working tree. The PR is linked to this T3 thread. Do not merge or deploy without authorization. The user explicitly requires terminal/CI-only continuation: do not launch, control or use their VS Code session, and do not repeat IDE automation.

The last pushed head is `bcfc2dfdf4d28fe44e76a26ac92bd16d5dd78a66`. Its hosted [workspace run 37033970581](https://github.com/VV01T3K/ResearchCruiseApp/actions/runs/37033970581) passes 682 cases: 189 frontend, 78 legacy, 27 unit, 388 SQL integration, no skips. Downloaded reports are verified under `backend/artifacts/evidence/hosted-bcfc2dfd/`. This is evidence for that head only.

The continuation adds eighteen infrastructure/telemetry/email/startup cases, twenty-six account/cruise storage-boundary cases and nineteen native SMTP retention candidates. All 745 combined cases pass: 189 frontend, 78 legacy, 46 unit, 432 integration, no skips. The full gate takes 535.971s, SQL TRX 484.468s; fresh reports are in artifacts/tests/run-ZphkHS, with final-matrix-workspace.{log,json} and final-matrix-frontend.xml. Strengthened native SMTP bound-value assertions then pass all 46 unit cases independently; Release/Debug strict builds have zero warnings/errors. Commit/push and exact-head hosted verification are still required. All 78 legacy cases remain enabled until maintainer review accepts their individual dispositions.

## Confirmed scope

- Production runs v2.5.1, confirmed by the user on 2026-10-02. BE-UPGRADE-001 uses that previous-release migration baseline with a separate synthetic account/application/cruise/file graph and actual Polish Unicode. Production data was not inspected.
- Supervisor's first decision remains final. Repeats/reversals are rejected and the link remains readable.
- Other users' drafts are hidden and uneditable for Administrator, including Administrator + CruiseManager. An assigned single-role Shipowner may write forms; an unrelated Shipowner may not.
- Cruise-number allocation remains unchanged, deferred to [#438](https://github.com/VV01T3K/ResearchCruiseApp/issues/438).
- Aggregate scoring overflow remains unchanged, deferred to [#439](https://github.com/VV01T3K/ResearchCruiseApp/issues/439).
- Remaining combined-role behavior remains unchanged, deferred to [#440](https://github.com/VV01T3K/ResearchCruiseApp/issues/440).

Do not ask these policy questions again or infer a broader role/date/email policy from the storage guards.

## Current verification

The infrastructure continuation's earlier full gate passes all 700 cases, with zero skips and clean formatting/build/analyzers/restore/audit/contracts/frontend checks. Root 547.308s, SQL TRX 505.055s. Reports: `artifacts/tests/run-X1k3F8/`; evidence: `infra-final-workspace.{log,json}` and `infra-final-frontend.xml`. This unusually slow local run overlapped IDE probes. Do not present it as meeting a budget. SDK isolation probes show SentrySdk.IsEnabled is already false after factory disposal in all three cases; a sticky SDK is not the cause. Telemetry teardown now asserts this and the SQL host collection excludes parallel host collections because the SDK is process-wide.

The account/cruise baseline executes 26 cases and reproduces thirteen SQL-backed 500s on one-character overflow, with all thirteen exact-limit controls passing. Added MaximumLength guards use existing SQL limits only. Corrected focused execution passes all 26 plus three existing managed-account validation cases, no skips, strict build zero warnings/errors. Evidence: `account-cruise-storage-{baseline,green}.log`, their build logs and matching TRX directories. Native SMTP paired proof fails thirteen cases with six controls under a validator bypass, restores production source byte-for-byte, then passes all nineteen. Strengthened final unit execution passes all 46 cases. Evidence: smtp-native-validator-{fault,green}.log and hashes; smtp-native-final.log.

The infrastructure fault disables production status serialization, fake-email idempotence, event scrubbing, health filtering and eager SMTP validation. All eighteen cases fail; byte-identically restored source passes nineteen selected cases including the upgrade control. Transaction privacy then reproduces two additional failures: non-health SDK transactions retained IP/cookies/sensitive headers. Both callbacks now share scrubbing, with all three SDK cases passing. All transport is synthetic; no live telemetry/SMTP is sent. Logs/hashes and scenario IDs are in the ledger.

Tooling audit removes application-wide legacy NoWarn, fixes neutral resource metadata and the private concrete EF return type, and records exact-file exceptions for established culture/SQL/naming/DI/logging/historical-migration contracts. Strict solution build is warning-free. `dotnet ef migrations list --no-connect --no-build --configuration Release` works with synthetic Testing configuration. Existing scaffolding and NuGet override packages are audited and retained.

The complete devcontainer image builds, including its Docker-in-Docker feature. The corrected Vite+ path and default Node pin yield SDK 10.0.401, Node 25.8.2, Bun 1.3.11 and Vite+ 1.0.0 in container smoke. Full onCreate/browser dependency installation and nested Docker runtime have not been exercised. Isolated VS Code classic test discovery finds four unit port cases and both login environments after a Debug build. Experimental Next Test source association fails on this toolchain; workspace configuration selects classic and the devcontainer includes C# Dev Kit. A subsequent bounded repeat with an explicitly waiting CLI verifies the actual workspace setting and discovers the same four unit/two login source cases. Initial refresh timeouts are retained as diagnostics. The user then prohibited using/opening VS Code; stop IDE automation permanently for this task and use the already captured evidence only.

## Finish the authorized work

1. Native SMTP paired proof and the finite requirement/legacy mapping audit are complete. Keep every legacy case required. docs/backend-quality-review.md is the concrete acceptance packet; individual dispositions still need maintainer acceptance.
2. The complete 745-case gate and fresh-report verification pass. Finish separately reviewable infrastructure/storage/docs commits, push with hooks and update PR description. Verify the exact pushed SHA's hosted reports and timestamps.
3. Recalibrate the completed matrix with five warm local runs and three clean hosted jobs. The 605-case figures in `backend-performance-calibration.json` are historical. Record counts, source SHA, environment, cache/setup/reset/host costs, median/max and slowest tests. Propose budgets for review; do not reduce coverage to hit provisional targets.
4. Prepare the concrete legacy/cutover and performance acceptance packet. Required-check activation remains rollout work: the reusable workflow must reach protected branches first. Rules inspection found staging with no required checks and main's rule disabled; no repository rule was changed. Merge/deploy/rules changes are not authorized.

The implementation baseline can be ready for review while maintainer acceptance remains open. Do not call the testing specification fully complete before those acceptance requirements are met.

## Commands and artifacts

This is native Omarchy Linux with rootless Podman. Use the user socket, not inaccessible `/var/run/docker.sock`:

```sh
export PATH="$PWD/node_modules/.bin:$PWD/frontend/node_modules/.bin:/home/wojtek/.local/share/mise/installs/node/25.8.2/bin:/home/wojtek/.dotnet:$PATH"
export DOTNET_ROOT=/home/wojtek/.dotnet
export DOCKER_HOST=unix:///run/user/1000/podman/podman.sock
export TESTCONTAINERS_RYUK_DISABLED=true
export TESTINGPLATFORM_TELEMETRY_OPTOUT=1
vp run check
```

From backend, focused MTP tests use `dotnet run --project ResearchCruiseApp.IntegrationTests -c Release --no-build --no-restore -- --filter-class '*ClassName' --report-trx --results-directory artifacts/tests/<fresh>`. Use --filter-class/--filter-method, not VSTest --filter. Run CSharpier from backend. Avoid simultaneous builds/fault probes/IDE discovery. SQL fixtures clean up their own containers.

Push through gh credentials with hooks enabled: `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push origin HEAD:feature/backend-quality-baseline`. Conventional Commits; preserve history. No subagents unless the user or applicable instructions authorize delegation.

`docs/backend-testing-spec.md` defines acceptance; `docs/backend-test-scenarios.md` records requirements, per-case legacy mappings, policies, paired faults and historical validation; `docs/backend-development.md` documents tooling. Ignored `backend/artifacts/evidence/` and `backend/artifacts/tests/` hold local reports/scripts and must be regenerated in another checkout. This handoff replaces chronological repetition; earlier results remain in the ledger and Git history.
