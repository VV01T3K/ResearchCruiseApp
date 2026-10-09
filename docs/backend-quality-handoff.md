# Backend quality handoff

Updated 2026-10-03. Kept in the repository at the user's request.

## Resume here

Continue draft [PR 430](https://github.com/VV01T3K/ResearchCruiseApp/pull/430), remote branch `feature/backend-quality-baseline`, base `staging`. Local branch `t3code/pr-430-continuation` is in `/home/wojtek/.t3/worktrees/ResearchCruiseApp/t3code-5a2f0598`. Verify refs and the working tree. The PR is linked to this T3 thread. Do not merge or deploy without authorization. The user explicitly requires terminal/CI-only continuation: do not launch, control or use their VS Code session, and do not repeat IDE automation.

The final runtime/runner cutover commit is `c57958ff444493875e58831e776529aa1def4084`, pushed to PR 430. All 78 legacy dispositions were accepted by the maintainer on 2026-10-03 with "Accept the dispositions and proceed with cutover": 59 rewritten and nineteen retained after review in native MTP. The legacy project/invocation/provider/runner dependencies and friend assembly are removed together; global.json selects native MTP and both suites use explicit .NET 10 dotnet test commands. Do not ask for legacy acceptance again.

The complete gate runs 667 cases: 189 frontend, 46 unit and 432 SQL integration, no skips. Local final cutover gate passes in 203.794 seconds, SQL TRX 197.011 seconds. The required native command rejects four deliberately failing replacements with 42 passing controls; its TRX verifier also fails, byte-identically restored source passes all 46 unit cases, and a focused native coverage smoke emits nonempty Cobertura. Setup/reset/host timings are preserved in every fresh Integration/timings.log.

Final calibration is complete on c57958ff with unchanged clean source: five fully warm local checks, root median 215.536 seconds/max 224.833; three fresh hosted jobs, median 280 seconds/max 294. All eight pass the full 667-case matrix. Hosted [run 37076802831](https://github.com/VV01T3K/ResearchCruiseApp/actions/runs/37076802831) has three successful attempts with downloaded reports, exact SHA/count and within-job timestamp verification. The committed performance record contains phases, slowest tests and cache/environment details. The historical 605/745-case results remain in Git history and the ledger.

Documentation/evidence commits follow the tested runtime revision without changing the runner/application. Inspect Git refs for the latest documentation head and verify its hosted check. No implementation gap remains identified within the accepted PR scope. Protected-branch rollout is the remaining maintainer decision; performance budgets were declined on 2026-10-09.

Staging integration (2026-10-09): staging commits `c43a0bc8` and `10e687dc` (#424) are merged normally, preserving the cleaned ancestry. The gate now runs 701 cases: 220 frontend, 47 unit and 434 SQL integration, no skips. #424's contract changes, the two ported test families (BE-INFRA-007, BE-FORM-VALIDATION-002) and the maintainer-confirmed draft omitted-key policy are recorded at the end of the scenario ledger. The 667-case figures below describe the calibrated revision.

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

## Remaining decisions and rollout

The authorized implementation, per-case legacy review, native cutover, positive/negative runner evidence and final calibration are complete. docs/backend-quality-review.md is the concrete final packet; docs/backend-performance-calibration.json contains all five local/three hosted measurements. Proposed targets are local root 270s, local SQL 240s, hosted workspace 330s, entire hosted job 360s, hosted SQL 300s and either unit suite 5s. On 2026-10-09 the maintainer declined hard performance budgets: no suite or job time limit is enforced in CI. A hosted Workspace CI job under five minutes is a goal, not a gate. The numbers in the proposal table stay as calibration context only. The operational 480s CI timeout is a hang guard, not a performance budget. Do not ask again.

Required-check activation needs the workflow on each protected branch first. Require the direct GitHub Actions context Workspace checks; deployment's nested context differs. Rules inspection found staging with no required checks and main's rule disabled. No rules were changed. Merging, deployment and repository-rule changes require separate authorization. The PR remains a draft for these review decisions.

Do not rerun completed calibration without a relevant source/tooling change, a failure or a new performance concern. Retain the user prohibition on VS Code; all cutover/calibration work used terminal/hosted CI. Final documentation-head CI and T3 PR linkage checks complete delivery. Do not call the testing specification's accepted baseline fully complete before outstanding acceptance/rollout requirements are satisfied.

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

From backend, focused MTP tests use `dotnet test --project ResearchCruiseApp.IntegrationTests/ResearchCruiseApp.IntegrationTests.csproj -c Release --no-build --no-restore --filter-class '*ClassName' --report-trx --results-directory artifacts/tests/<fresh>`. Use --filter-class/--filter-method, not VSTest --filter. Run CSharpier from backend. Avoid simultaneous builds/fault probes/IDE discovery. SQL fixtures clean up their own containers.

Push through gh credentials with hooks enabled: `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push origin HEAD:feature/backend-quality-baseline`. Conventional Commits; preserve history. No subagents unless the user or applicable instructions authorize delegation.

`docs/backend-testing-spec.md` defines acceptance; `docs/backend-test-scenarios.md` records requirements, per-case legacy mappings, policies, paired faults and historical validation; `docs/backend-development.md` documents tooling. Ignored `backend/artifacts/evidence/` and `backend/artifacts/tests/` hold local reports/scripts and must be regenerated in another checkout. This handoff replaces chronological repetition; earlier results remain in the ledger and Git history.
