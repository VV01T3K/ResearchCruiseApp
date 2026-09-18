# Backend test scenario ledger

Status: initial requirements ledger, 2026-09-18. No entries below claim implemented or verified coverage. Source baseline: `6eb9166f`; governing requirements: [backend testing specification](backend-testing-spec.md). This document is the review record, not a second test framework.

## Entry format and workflow

Use stable IDs `BE-<AREA>-NNN` for individual scenarios; never recycle an ID after retirement. Tests identify their scenario IDs in comments or existing metadata. Expand every feature family in specification section 6 into individual entries before implementing its assertions. The initial entries below are not the complete behavior matrix.

Each entry records:

- Priority and requirement source/revision.
- Policy status: `needs-decision` or `specified`; decision owner, resolution, and rationale where needed.
- Method/route or non-HTTP operation; actor, initial state, input/action.
- Expected status/body/headers where applicable, persisted state, and external effects. Explicitly state “not applicable” for non-HTTP status.
- Implementation status: `not-started`, `implemented`, `verified`, or `retired`.
- Test path and fully qualified method/theory cases; reviewing maintainer and run/failure evidence.

`verified` requires a specified policy, a reviewed assertion, and execution evidence. `needs-decision` blocks acceptance of the affected scenario and its milestone; unrelated fixture/tooling work may continue. Current behavior is evidence to inspect, not an automatic policy decision. No skipped/always-passing placeholders count as coverage. Record product-owner/maintainer decisions here before implementing disputed assertions.

## Initial scenarios and open decisions

| ID | Priority | Scenario | Policy | Implementation |
| --- | --- | --- | --- | --- |
| BE-EMAIL-001 | P0 | Queued email survives host replacement with persisted protection keys | specified below | not-started |
| BE-SUPERVISOR-001 | P0 | Repeating or reversing an already recorded supervisor decision | needs-decision | not-started |
| BE-ACCESS-001 | P0 | Conflicting role grants/restrictions for a multi-role actor | needs-decision | not-started |
| BE-NUMBERING-001 | P0 | Concurrent creates contend for a year-based number | needs-decision | not-started |

### BE-EMAIL-001: host replacement

- Source: [durable email contract](email-delivery.md), spec section 6, and Data Protection registration in `Infrastructure/DependencyInjection.cs` at the source baseline.
- Operation: enqueue through the real `EmailOutbox`, then deliver through the real dispatcher. Actor: internal application/worker. HTTP status: not applicable to this focused persistence scenario.
- Initial state: fresh migrated fixture-owned SQL database; no queued mail; production Data Protection application name and SQL key persistence enabled. Automatic worker polling is removed. Use valid test SMTP settings and a capturing `IEmailTransport`.
- Action: host A enqueues a synthetic recipient/subject/body and commits. Verify a protected queue row and SQL-persisted key exist. Dispose A and all its scopes/providers/protectors. Create B independently, against the same database, with a new service provider, protection provider, and transport. Invoke B's dispatcher explicitly.
- Expected outcome: B decrypts the original values and invokes its capturing transport once; a fresh SQL query finds no acknowledged queue row. No real SMTP call occurs. A second dispatch finds nothing to deliver. This controlled success does not claim exactly-once delivery after arbitrary crashes.
- Isolation: no reset between A and B, no shared provider/key-ring singleton, no ephemeral protector or user-profile key fallback. Reset/drop fixture state after the whole test.
- Failure demonstration: B lacking A's persisted key material cannot deliver the original message. Do not clear/requeue/reprotect its payload to make the test pass.
- Test/reviewer/run evidence: pending implementation and review.

### BE-SUPERVISOR-001: repeated decision

- Source to reconcile: permission requirements, supervisor decision rules, and `PUT /v2/applications/{applicationId}/supervisor-review/decision` at the baseline.
- Actor/state/action: anonymous caller with the originally valid supervisor code submits the same decision again, or the opposite decision after the first is recorded. Split these into distinct IDs once their outcomes are agreed.
- Required decision: idempotent success versus explicit rejection; code validity after the first decision; whether reversal is allowed; exact status/body; whether state or queued notifications may change.
- Decision owner: product owner/maintainer, not yet assigned. Resolution/rationale: pending.
- Expected outcome/test/reviewer/evidence: blocked on that decision. Inspect current code without turning it into an accepted expected value.

### BE-ACCESS-001: multi-role precedence

- Source to reconcile: [permission matrix](permissions.md), authorization policies, and row-visibility rules.
- Actor/state/action: a user holds both a broad-access role and an ownership-restricted role and accesses an unrelated record. Requirements work must select exact role pairs and list/read/write routes and assign separate scenario IDs.
- Required decision: union of grants, explicit precedence, or restriction-first semantics for each affected operation; intended 403 versus concealed 404 and list filtering; no mutation after rejection.
- Decision owner: product owner/maintainer, not yet assigned. Resolution/rationale: pending.
- Expected outcome/test/reviewer/evidence: blocked until roles, routes, and outcomes are specified. No generic “has any role” assertion counts as resolution.

### BE-NUMBERING-001: competing creates

- Source to reconcile: year-based numbering requirements, generator, and database constraints.
- Actor/state/action: two valid writers create records for the same year using independent scopes/connections with coordinated overlap. Requirements work must identify the exact entity/write operation; do not coordinate with sleeps.
- Required decision: uniqueness only or gap-free sequence; whether both requests must succeed or one may receive a defined conflict/retry response; retry ownership; exact stored state and HTTP outcomes if tested through HTTP.
- Decision owner: product owner/maintainer, not yet assigned. Resolution/rationale: pending.
- Expected outcome/test/reviewer/evidence: blocked on the invariant. Do not claim that two successful sequential writes prove concurrency behavior.

## Legacy execution continuity

The files below were present at the baseline. They are an inventory starting point, not dispositions for their individual tests. During requirements work, expand each file into one entry per test and meaningful theory case, including currently skipped cases. Record: original fully qualified name/case, scenario ID, disposition, replacement name/path or retirement rationale, reviewer, and passing/failure evidence. `unreviewed` keeps its existing execution obligation.

| Existing file in `backend/ResearchCruiseApp.Tests` | Disposition |
| --- | --- |
| AccessControlTests.cs | unreviewed |
| ApplicationCatalogEndpointTests.cs | unreviewed |
| ApplicationWriteContractTests.cs | unreviewed |
| AuthSessionContractTests.cs | unreviewed |
| AuthSessionEndpointTests.cs | unreviewed |
| DomainLogicTests.cs | unreviewed |
| EmailOutboxTests.cs | unreviewed |
| SeedUserWorkflowTests.cs | unreviewed |
| SentryTests.cs | unreviewed |
| SmtpConfigurationTests.cs | unreviewed |

Only retire execution after a reviewed replacement passes or a reviewer accepts a specific obsolete/incorrect/duplicate assertion rationale. A feature-level replacement, larger test count, or higher percentage is insufficient. Runner cutover requires all entries resolved and same-revision gate evidence; until then legacy VSTest and new MTP executions both remain required, with separate results. See specification section 9.

## Performance calibration record

Status: **uncalibrated**. The specification's numbers are provisional targets. No timings have been collected and no full-suite budget has been ratified.

Foundation evidence must include real login/fresh host, authorized form write/read/reset, BE-EMAIL-001, concurrent startup seeding, and previous-schema upgrade. Create individual specified ledger entries for the other benchmark scenarios before coding them. Measure build/generation and frontend checks too. Include at least five warm and three clean hosted runs; keep raw timings as CI artifacts or linked evidence.

| Record | Value |
| --- | --- |
| Commit, SDK/packages, SQL image, machine/runner | pending |
| Exact command, configuration, scenario IDs and executed counts | pending |
| Cache/image state and legacy/new execution times separately | pending |
| Fixed restore/build/container/migration/host cost | pending |
| Reset/per-case costs, median/slowest run and slowest tests | pending |
| Remaining scenario estimate, assumptions and headroom | pending |
| Proposed full-suite/root/CI budgets | specification targets pending calibration |
| Ratifying maintainer, date, rationale | pending |
| Completed-suite rerun and confirmation/revision | pending |

Before ratification, an overrun prompts investigation/calibration rather than an automatic performance-defect label. After ratification, compare measured regressions with the accepted baseline. Job timeouts and correctness failures remain blocking throughout; neither a timing target nor a pending policy decision authorizes skipping required tests.
