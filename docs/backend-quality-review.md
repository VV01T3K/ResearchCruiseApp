# PR 430 acceptance review

Prepared 2026-10-03. This packet identifies the remaining maintainer decisions after implementation. It does not authorize merging, deployment or repository-rule changes.

## Legacy dispositions

The [per-case inventory](backend-test-scenarios.md#per-case-legacy-inventory) identifies every one of the 78 legacy cases, its requirement and candidate mapping. The subsequent method-level audits and [final family audit](backend-test-scenarios.md#final-requirement-to-candidate-audit-2026-10-03) explain the assertions and controlled failure evidence. The maintainer accepted all 78 dispositions on 2026-10-03 and authorized the native cutover.

Accepted disposition is to rewrite 59 cases with their HTTP/SQL or focused native replacements, and retain the nineteen generic-host SMTP cases after review in the native MTP SmtpHostTests class. No case is proposed for retirement without a replacement. The actual Program SMTP startup case uses the separate SQL-connection-blocking replacement. User-confirmed draft and single-role Shipowner policies supersede the contradictory old authorization assertion, already corrected without dropping execution.

The reviewing repository maintainer replied "Accept the dispositions and proceed with cutover" in this task conversation on 2026-10-03. That acceptance applies individually to all mappings and assertions in the linked inventory, including the nineteen retained SMTP cases. No disposition remains unreviewed.

The authorized cutover removes only the legacy project/invocation and its now-unused SQLite/InMemory test dependencies, selects the MTP runner in global.json, and updates the solution/scripts/report checks together. All current new tests remain required. Expected cutover count is 667, consisting of 189 frontend, 46 unit and 432 SQL integration cases. The pre-cutover 745-case head `659e6cc5` passes hosted run 37073428444 with downloaded fresh reports. The cutover native command rejects four deliberately failing replacement cases with 42 passing controls; the report guard also fails. Byte-identical restored source passes all 46 unit cases. The final complete 667-case root gate passes with fresh reports, no skips, in 203.794 seconds locally; SQL TRX is 197.011 seconds. All existing phase diagnostics are retained in the fresh integration timing artifact. Focused native coverage also produces valid nonempty Cobertura. The exact pushed cutover head also passes all three hosted calibration jobs linked below. Existing hosted negative legacy/new gate and deployment-dependency probes are recorded in the ledger. Do not merge an intentionally failing probe branch.

## Confirmed scope and exclusions

Production's previous release is v2.5.1, confirmed by the user. Supervisor decisions remain final with readable links. Other users' drafts stay hidden and uneditable for Administrator, including Administrator + CruiseManager. An unrelated single-role Shipowner cannot write forms.

The user explicitly keeps current behavior for concurrent cruise allocation [#438](https://github.com/VV01T3K/ResearchCruiseApp/issues/438), aggregate scoring overflow [#439](https://github.com/VV01T3K/ResearchCruiseApp/issues/439), and remaining role combinations [#440](https://github.com/VV01T3K/ResearchCruiseApp/issues/440). These exclusions do not block unrelated baseline implementation; their follow-up policies are not encoded as skipped tests.

## Performance and rollout

Final native calibration is complete on `c57958ff444493875e58831e776529aa1def4084`. All five fully warm local runs and three fresh hosted jobs execute and pass all 667 cases with no skips, no legacy invocation and unchanged tracked source. The [performance record](backend-performance-calibration.json) contains every run, environment/cache state, build/setup/reset/host costs, sampled local frequencies and ten slowest SQL cases per run.

After the 2026-10-09 staging merge, the gate runs 701 cases (220 frontend, 47 unit, 434 SQL integration). One local post-merge run took 194.372 seconds of SQL execution, below the calibrated local SQL median of 209.688 seconds. The proposals below still rest on the 667-case calibration.

| Measurement | Runs | Median | Slowest | Proposed target |
| --- | --- | --- | --- | --- |
| Local warm root | 5 | 215.536s | 224.833s | 270s |
| Local warm SQL | 5 | 209.688s | 219.953s | 240s |
| Hosted workspace | 3 | 254.000s | 270.000s | 330s |
| Hosted entire job | 3 | 280.000s | 294.000s | 360s |
| Hosted SQL | 3 | 207.121s | 227.050s | 300s |

Both unit suites remain below a proposed five-second target. The local root/SQL targets allow room above observed maxima; hosted targets account for the measured runner variation and fresh restore/build/container costs. The operational job cutoff stays eight minutes. These revised targets are proposals for maintainer review, not enforced suite budgets. The earlier 90-second root and 60-second SQL targets were not met; the historical 605-case figures do not establish acceptance of the final matrix. No required coverage was reduced.

Hosted evidence is [attempt 1](https://github.com/VV01T3K/ResearchCruiseApp/actions/runs/37076802831/attempts/1), [attempt 2](https://github.com/VV01T3K/ResearchCruiseApp/actions/runs/37076802831/attempts/2) and [attempt 3](https://github.com/VV01T3K/ResearchCruiseApp/actions/runs/37076802831/attempts/3). Reports were downloaded and verified before each rerun, including exact SHA, case counts and timestamps within the job. Fresh hosted checkouts/builds/SQL databases are measured separately from warm local execution. Dependency/action caches may restore; the frontend Vite+ cache reports no lock file because the workspace lock is at the root, while frozen root installation still runs. Local power preference remains `power`; sampled frequencies vary during these runs. No desktop or power settings were changed and no single cause is asserted for earlier slow runs.

Maintainer performance-budget ratification remains the acceptance decision specified in testing specification section 8. Implementation and native cutover verification are complete. No repository rule, merge or deployment is performed as part of this packet.

Required-check rollout can proceed only after the workflow reaches each protected branch. Require the direct GitHub Actions context `Workspace checks`; the deployment workflow's nested context is different. Current inspected staging rules have no required checks and main's rule is disabled. Rule activation and merging/deployment require separate authorization.

The [handoff](backend-quality-handoff.md) records the current head and exact validation evidence. The [testing specification](backend-testing-spec.md#9-coverage-and-existing-test-trust) requires legacy review and same-revision cutover evidence; its [completion criteria](backend-testing-spec.md#10-implementation-order-and-completion-criteria) distinguish implementation from accepted baseline completion.
