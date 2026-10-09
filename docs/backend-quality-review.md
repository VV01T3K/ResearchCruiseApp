# PR 430 acceptance review

Prepared 2026-10-03. This packet identifies the remaining maintainer decisions after implementation. It does not authorize merging, deployment or repository-rule changes.

## Legacy dispositions

The [legacy test mapping](backend-test-scenarios.md#legacy-test-mapping) identifies every one of the 78 legacy cases, its requirement and replacement. The method-level audits and controlled failure evidence are in the ledger's Git history. The maintainer accepted all 78 dispositions on 2026-10-03 and authorized the native cutover.

Accepted disposition is to rewrite 59 cases with their HTTP/SQL or focused native replacements, and retain the nineteen generic-host SMTP cases after review in the native MTP SmtpHostTests class. No case is proposed for retirement without a replacement. The actual Program SMTP startup case uses the separate SQL-connection-blocking replacement. User-confirmed draft and single-role Shipowner policies supersede the contradictory old authorization assertion, already corrected without dropping execution.

The reviewing repository maintainer replied "Accept the dispositions and proceed with cutover" in this task conversation on 2026-10-03. That acceptance applies individually to all mappings and assertions in the linked inventory, including the nineteen retained SMTP cases. No disposition remains unreviewed.

The authorized cutover removes only the legacy project/invocation and its now-unused SQLite/InMemory test dependencies, selects the MTP runner in global.json, and updates the solution/scripts/report checks together. All current new tests remain required. Expected cutover count is 667, consisting of 189 frontend, 46 unit and 432 SQL integration cases. The pre-cutover 745-case head `659e6cc5` passes hosted run 37073428444 with downloaded fresh reports. The cutover native command rejects four deliberately failing replacement cases with 42 passing controls; the report guard also fails. Byte-identical restored source passes all 46 unit cases. The final complete 667-case root gate passes with fresh reports, no skips, in 203.794 seconds locally; SQL TRX is 197.011 seconds. All existing phase diagnostics are retained in the fresh integration timing artifact. Focused native coverage also produces valid nonempty Cobertura. The exact pushed cutover head also passes all three hosted calibration jobs linked below. Existing hosted negative legacy/new gate and deployment-dependency probes are recorded in the ledger. Do not merge an intentionally failing probe branch.

## Confirmed scope and exclusions

Production's previous release is v2.5.1, confirmed by the user. Supervisor decisions remain final with readable links. Other users' drafts stay hidden and uneditable for Administrator, including Administrator + CruiseManager. An unrelated single-role Shipowner cannot write forms.

The user explicitly keeps current behavior for concurrent cruise allocation [#438](https://github.com/VV01T3K/ResearchCruiseApp/issues/438), aggregate scoring overflow [#439](https://github.com/VV01T3K/ResearchCruiseApp/issues/439), and remaining role combinations [#440](https://github.com/VV01T3K/ResearchCruiseApp/issues/440). These exclusions do not block unrelated baseline implementation; their follow-up policies are not encoded as skipped tests.

## Performance and rollout

Calibration ran on `c57958ff444493875e58831e776529aa1def4084` with the 667-case gate: five warm local runs and three fresh [hosted jobs](https://github.com/VV01T3K/ResearchCruiseApp/actions/runs/37076802831). The detailed measurements were in `docs/backend-performance-calibration.json`, removed on 2026-10-09 and still in Git history.

| Measurement | Runs | Median | Slowest |
| --- | --- | --- | --- |
| Local warm root | 5 | 215.536s | 224.833s |
| Local warm SQL | 5 | 209.688s | 219.953s |
| Hosted workspace | 3 | 254.000s | 270.000s |
| Hosted entire job | 3 | 280.000s | 294.000s |
| Hosted SQL | 3 | 207.121s | 227.050s |

On 2026-10-09 the maintainer declined hard performance budgets: no suite or job time limit is enforced in CI. A hosted Workspace CI job under five minutes is a goal. The job timeout is 10 minutes, as a hang guard. The gate now runs 643 cases after the staging merge and the draft-only trim.

Required-check rollout can proceed only after the workflow reaches each protected branch. Require the direct GitHub Actions context `Workspace checks`; the deployment workflow's nested context is different. Current inspected staging rules have no required checks and main's rule is disabled. Rule activation and merging/deployment require separate authorization.

The [testing specification](backend-testing-spec.md#9-coverage-and-existing-test-trust) requires legacy review and same-revision cutover evidence; its [completion criteria](backend-testing-spec.md#10-implementation-order-and-completion-criteria) distinguish implementation from accepted baseline completion.
