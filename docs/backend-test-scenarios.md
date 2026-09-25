# Backend test scenario ledger

Status: foundation and expanded scenarios implemented and locally exercised, 2026-09-25; maintainer review and the complete P0/P1 baseline remain outstanding. Implemented does not mean reviewed or accepted. Source baseline: `6eb9166f`; governing requirements: [backend testing specification](backend-testing-spec.md). This document is the review record, not a second test framework.

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

## Remaining acceptance work (2026-09-25)

- Complete the requirement-to-scenario audit and missing P0/P1 cases. The Form A final submission through first supervisor and office decisions is now exercised. Form A outbox failure rollback and retry are exercised in BE-ATOMIC-002. Remaining gaps include populated Form B/C replacement and transaction boundaries, scoring categories/effects and aggregate overflow beyond the current funding slice, and remaining account/file boundaries. Passing examples do not establish coverage of an entire family.
- Resolve repeated supervisor decisions, conflicting role precedence, and concurrent numbering outcomes with the product owner. These remain explicit needs-decision entries below.
- Review all 78 legacy cases individually, map replacements or justified retirements, and complete the runner cutover only after dispositions are accepted. Keep legacy execution in the gate meanwhile.
- Exercise hosted CI on the same revision, prove a failed check blocks image publication/deployment, and configure/verify required checks for main and staging. Local YAML validation is insufficient.
- Measure and ratify full-suite performance budgets, including hosted runs. Recent local runs exceed the provisional 90-second root and 60-second integration targets. Do not reduce coverage to meet a provisional number.
- Finish IDE/devcontainer and analyzer verification, and confirm v2.5.1 as the supported upgrade baseline. Collect final maintainer review and handoff evidence.
## Initial scenarios and open decisions

| ID | Priority | Scenario | Policy | Implementation |
| --- | --- | --- | --- | --- |
| BE-EMAIL-001 | P0 | Queued email survives host replacement with persisted protection keys | specified below | implemented; review pending |
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

Status: **not yet ratified**. The specification's numbers remain provisional targets. Local timings and fault evidence are recorded below; clean hosted timings and a full-suite budget still require review.

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

## Linux environment bootstrap ? 2026-09-20

- Checkout: `/home/wojtek/projects/ResearchCruiseApp-backend-quality` on Ubuntu WSL (Linux filesystem), branch `feature/backend-quality-baseline`, starting HEAD `dc8b815ab5b5a86f6b49142ba260b90bd1e02e94`.
- Cloned locally with `--no-hardlinks` to preserve both unpushed specification commits; restored GitHub origin and fetched it. `origin/staging` remains `6eb9166feeeb864c1089b9b56d84899ed61a5a08`; no staging drift to reconcile. Existing Windows worktrees were left intact.
- Installed Linux SDK `10.0.401`, mise `2026.9.12`, and Ubuntu ICU dependencies. The SDK is available through the WSL login profile; repository SDK pinning remains foundation work.
- Docker Desktop Ubuntu integration enabled by the maintainer. Docker server `29.8.0`; `docker run --rm hello-world` successfully pulled and executed a Linux container. SQL Server execution/migrations are not yet verified.
- From `backend`: `dotnet restore ResearchCruiseApp.sln` succeeded; `dotnet build ResearchCruiseApp.sln -c Release --no-restore --warnaserror` succeeded with zero build warnings/errors; `dotnet test ResearchCruiseApp.Tests/ResearchCruiseApp.Tests.csproj -c Release --no-build --no-restore` passed 78 tests, zero failures/skips.
- These are legacy execution and environment checks only. No test disposition or new scenario is verified by this run; no foundation timing budget or full-suite acceptance is claimed. The new SQL/MTP projects, fixture, requirements expansion, and CI work remain outstanding.

## Foundation scenarios (specified before implementation)

Source: specification sections 5?6 at `dc8b815a`, plus `smtp-configuration.md` and `email-delivery.md`. Unless stated otherwise, HTTP status is not applicable, no real external service is contacted, reviewer is pending, and implementation starts as `not-started`.

| ID | Priority | Operation, actor, initial state and action | Required observable outcome | Policy |
| --- | --- | --- | --- | --- |
| BE-MIGRATION-001 | P0 | Fixture migrates a new, uniquely named SQL Server 2022 database using the real EF migration chain. | All known migrations are applied, no pending migrations/model changes; a second migrate is a no-op and preserves the history. | specified |
| BE-ISOLATION-001 | P0 | Test fixture writes synthetic Identity/business/outbox data, then resets its owned database. | Business/Identity/outbox/key rows are removed; migration history survives; required roles/reference rows can be recreated without development accounts. | specified |
| BE-SMTP-001 | P1 | Validate real SMTP options with valid hostname/mailbox/password and port cases 0, 1, 65535, 65536. | Ports 1/65535 succeed; 0/65536 fail with a port-setting diagnostic; no network or file effects. | specified by SMTP setup |
| BE-AUTH-001 | P0 | Fresh HTTP host, accepted and confirmed user created through Identity; POST `/v2/auth/login` with correct credentials. | 200 with access token; secure HttpOnly refresh cookie; fresh SQL scope contains a hash rather than the refresh credential. | specified |
| BE-STARTUP-001 | P1 | Two independent production initializers target one migrated database with account seeding disabled. | Both complete, reference/role sets have no duplicates and are repaired on a repeat run; no users or queued account mail. | specified |
| BE-UPGRADE-001 | P1 | Upgrade separate database from the previous supported release, retaining synthetic Identity/application/cruise/file rows. | Real migrations preserve the representative graph and transformed file/contract data. | needs-decision: maintainer must identify the supported release/migration baseline |

`BE-EMAIL-001` remains specified in its detailed entry above. Foundation form write/read scenarios will be expanded after reconciling route and actor requirements; this table does not claim that work is complete.

## Per-case legacy inventory

Every row below remains **unreviewed** and required to execute. Source: legacy declarations at `dc8b815a`; 78 cases matched the successful bootstrap run. Requirement families reference specification section 6, not approved expected values. Replacement, reviewing maintainer, and replacement/fault evidence are pending for every row; no retirement or cutover is authorized by this inventory.

| Original fully qualified method and case | Requirement family | Disposition |
| --- | --- | --- |
| `ResearchCruiseApp.Tests.AccessControlTests.ShipownerCannotManagePrivilegedRolesOrAccounts()` | authorization | unreviewed |
| `ResearchCruiseApp.Tests.AccessControlTests.ShipownerAndAssignedManagersCanCreateFormsBAndC()` | authorization | unreviewed |
| `ResearchCruiseApp.Tests.AccessControlTests.UserEmailValidationCoversCreateAndOptionalUpdate()` | authorization | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationCatalogEndpointTests.FiltersDistinguishSameNamedManagersAndCombineNumberWithDate()` | catalog pagination / authorization | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationCatalogEndpointTests.VisibilityIsAppliedBeforePagingAndMatchesDetailAndManagerAccess(RoleName.Administrator, true)` | catalog pagination / authorization | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationCatalogEndpointTests.VisibilityIsAppliedBeforePagingAndMatchesDetailAndManagerAccess(RoleName.Shipowner, true)` | catalog pagination / authorization | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationCatalogEndpointTests.VisibilityIsAppliedBeforePagingAndMatchesDetailAndManagerAccess(RoleName.Guest, true)` | catalog pagination / authorization | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationCatalogEndpointTests.VisibilityIsAppliedBeforePagingAndMatchesDetailAndManagerAccess(RoleName.ShipCrew, true)` | catalog pagination / authorization | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationCatalogEndpointTests.VisibilityIsAppliedBeforePagingAndMatchesDetailAndManagerAccess(RoleName.CruiseManager, false)` | catalog pagination / authorization | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationWriteContractTests.MissingWriteRequestKeysAreRejected(typeof(FormAWriteRequest))` | application forms | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationWriteContractTests.MissingWriteRequestKeysAreRejected(typeof(FormBWriteRequest))` | application forms | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationWriteContractTests.MissingWriteRequestKeysAreRejected(typeof(FormCWriteRequest))` | application forms | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationWriteContractTests.DraftRequestsAllowIncompleteValuesWhenEveryKeyIsPresent()` | application forms | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationWriteContractTests.FinalValidationRetainsIndexedPropertyPaths("B")` | application forms | unreviewed |
| `ResearchCruiseApp.Tests.ApplicationWriteContractTests.FinalValidationRetainsIndexedPropertyPaths("C")` | application forms | unreviewed |
| `ResearchCruiseApp.Tests.AuthSessionContractTests.BrowserTokenResponseNeverExposesTheRefreshCredential()` | authentication / account workflows | unreviewed |
| `ResearchCruiseApp.Tests.AuthSessionContractTests.RefreshCookieIsScopedToTheSiteRootAndJavaScriptCannotReadIt()` | authentication / account workflows | unreviewed |
| `ResearchCruiseApp.Tests.AuthSessionContractTests.PasswordResetRevokesTheStoredRefreshSession()` | authentication / account workflows | unreviewed |
| `ResearchCruiseApp.Tests.AuthSessionEndpointTests.RefreshCookieIsScopedToTheSiteRoot()` | authentication | unreviewed |
| `ResearchCruiseApp.Tests.AuthSessionEndpointTests.SessionSurvivesARefreshRoundTripAndDiesOnLogout()` | authentication | unreviewed |
| `ResearchCruiseApp.Tests.AuthSessionEndpointTests.ReplayingARotatedRefreshCookieIsRejected()` | authentication | unreviewed |
| `ResearchCruiseApp.Tests.AuthSessionEndpointTests.RefreshCookieHasSecureBrowserAttributes()` | authentication | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseStatus.New, "new")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseStatus.Confirmed, "confirmed")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseStatus.Ended, "ended")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.Draft, "draft")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.WaitingForSupervisor, "waitingForSupervisor")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.AcceptedBySupervisor, "acceptedBySupervisor")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.DeniedBySupervisor, "deniedBySupervisor")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.Accepted, "accepted")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.Denied, "denied")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.FormBRequired, "formBRequired")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.FormBFilled, "formBFilled")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.Undertaken, "undertaken")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.DomainLogicTests.WorkflowStatusesExposeStableCodes(CruiseApplicationStatus.Reported, "reported")` | cruise/application lifecycle codes | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.SeedAccountAndEmailFollowTheExistingTransaction(true)` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.SeedAccountAndEmailFollowTheExistingTransaction(false)` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.FailedSeedRepairPreservesTheOriginalAccountInExistingTransaction(true)` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.FailedSeedRepairPreservesTheOriginalAccountInExistingTransaction(false)` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.QueuedEmailAndProtectionKeysSurviveAHostRestart()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.FailureIsDurableAndRetriesOnlyWhenDueUsingTheSameMessageId()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.AnotherWorkerCannotDeliverAnActivelyLeasedMessage()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.ExpiredLeaseIsRecoveredAfterACrash()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.ExpiredOrExhaustedMessagesAreNotSentAndSensitivePayloadIsCleared(true)` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.ExpiredOrExhaustedMessagesAreNotSentAndSensitivePayloadIsCleared(false)` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.ShutdownLeavesTheMessageRecoverable()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.RegistrationSucceedsDuringSmtpOutageAndCreatesOneAccountAndOnePendingEmail()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.RegistrationRollsBackTheAccountWhenQueuePersistenceFails()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.QueueWriteRollsBackWithItsCallerTransaction()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.FakeDeliveryIsIdempotentForTheSameMessageId()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.EmailOutboxTests.AFinalFailedAttemptClearsPayloadAndDoesNotBlockTheNextMessage()` | durable email | unreviewed |
| `ResearchCruiseApp.Tests.SeedUserWorkflowTests.RepairsAnIncompleteSeedUserOnlyOnce()` | startup and seeding | unreviewed |
| `ResearchCruiseApp.Tests.SeedUserWorkflowTests.FillsPartialReferenceDataWithoutChangingExistingRows(false)` | startup and seeding | unreviewed |
| `ResearchCruiseApp.Tests.SeedUserWorkflowTests.FillsPartialReferenceDataWithoutChangingExistingRows(true)` | startup and seeding | unreviewed |
| `ResearchCruiseApp.Tests.SentryTests.ScrubsSensitiveRequestDataAndClientIp()` | infrastructure telemetry | unreviewed |
| `ResearchCruiseApp.Tests.SentryTests.FiltersHealthTransactions("GET /health")` | infrastructure telemetry | unreviewed |
| `ResearchCruiseApp.Tests.SentryTests.FiltersHealthTransactions("GET /HEALTH")` | infrastructure telemetry | unreviewed |
| `ResearchCruiseApp.Tests.SentryTests.EnrichesUserAndRoleDiagnostics()` | infrastructure telemetry | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpServer", "")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpServer", "https://smtp.gmail.com")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpServer", "smtp.gmail.com:465")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpPort", "0")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpPort", "65536")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpUsername", "")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpUsername", "not-a-mailbox")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpUsername", "Display <sender@example.com>")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpPassword", "")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.InvalidRealSmtpSettingsStopTheHostBeforeHostedWorkStarts("SmtpPassword", "   ")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.ValidRealSmtpConfigurationDoesNotNeedAWorkingMailServer("smtp.gmail.com", "465")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.ValidRealSmtpConfigurationDoesNotNeedAWorkingMailServer("127.0.0.1", "2465")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.ValidRealSmtpConfigurationDoesNotNeedAWorkingMailServer("::1", "465")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.FakeSmtpStartsWithoutAnyRealSmtpSettings()` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.FakeSmtpRejectsInvalidOutputPaths("")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.FakeSmtpRejectsInvalidOutputPaths("   ")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.FakeSmtpRejectsInvalidOutputPaths("invalid\0path")` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.NonNumericPortFailsAtStartup()` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.ActualApplicationRejectsMissingCredentialsBeforeDatabaseInitialization()` | startup SMTP | unreviewed |
| `ResearchCruiseApp.Tests.SmtpConfigurationTests.EnvironmentProviderUsesDoubleUnderscoreBackendKeys()` | startup SMTP | unreviewed |

### BE-FORMA-001: authorized draft round trip

- P0, specified by section 6 application forms and the permissions matrix (cruise managers may create/read their own drafts); current routes reconciled against FormA endpoints.
- Accepted/confirmed CruiseManager, no applications; synthetic UG unit and two participants, incomplete Form A with empty optional content, year 2030 and note `Foundation draft`.
- POST `/v2/applications` with `draft: true` and the actor as manager: 201. GET `/v2/applications/{id}/form-a`: 200, the same manager/year and UG child counts. A fresh SQL scope finds one Draft application, one Form A and its UG join; no queued/delivered email. The fixture resets before/after the scenario.
- Implementation/review evidence pending.

### BE-FORMA-002: rejected draft leaves the next scenario clean

- P0, specified by section 6 binding and rejected-write requirements. Same authorized actor, fresh database.
- POST `/v2/applications` with the required `form` key missing: 400. No application, Form A, UG join or outbox row is written; no captured delivery. After host disposal and fixture reset, a fresh SQL scope still sees no business/Identity/outbox data. This is a binding rejection, not proof of rollback after partial persistence.
- Implementation/review evidence pending. Execute independently and in both orders with BE-FORMA-001.

### Upgrade baseline candidate

Git tag `v2.5.1` (`7187a38d`, latest published tag observed after fetch) ends at `20260213144221_MakeFormAFieldsNullableSoDraftsCanAlwaysBeSaved`. This is the implemented candidate for BE-UPGRADE-001. It exercises the later catalog index and outbox/key migrations with an existing Identity/application/cruise/contract/file graph. No contract/file transformation occurs between this candidate and HEAD; existing bytes and relationships must still survive. Maintainer confirmation that this matches supported deployed versions remains outstanding; the test does not inspect or certify a live database.

## Local implementation evidence (2026-09-21)

The foundation contains four SMTP boundary theory cases in `backend/ResearchCruiseApp.UnitTests/Infrastructure/SmtpSettingsTests.cs` and eight integration facts under `backend/ResearchCruiseApp.IntegrationTests`: migration replay/model agreement, disposed-host email recovery, database reset, login cookie/hash persistence, concurrent initialization and reference repair, upgrade from the candidate schema, and the two Form A draft scenarios. These are implemented and executed; maintainer assertion review remains pending. All 78 legacy cases remain required and unreviewed, with no retirement claimed.

Five consecutive complete `vp run check` runs passed 186 frontend, 78 legacy, four new unit and eight new SQL integration cases, with no skipped backend cases. Warm root wall times were 46.889, 50.728, 70.696, 71.809 and 59.830 seconds (median 59.830; maximum 71.809). Each run used a fresh container/database and warm package/image caches on Ubuntu WSL, 12 logical CPUs. Repository content hashes were unchanged. Raw timings, per-case outcomes and SQL/host timings are in ignored `backend/artifacts/benchmarks/warm-runs.json`. These measure only the implemented foundation, not the eventual full suite or hosted CI; budgets are not ratified.

Representative negative controls in `backend/artifacts/evidence/` demonstrate failures after deleting persisted protection keys, breaking an SMTP boundary, injecting a legacy failure, injecting a frontend failure, selecting zero tests, and making Docker sockets unavailable in an isolated mount namespace. Root checks propagate frontend and legacy failures while retaining separate backend reports. Test settings also passed with conflicting developer database/SMTP environment values. Two consecutive fixes produced identical repository hashes. Lint and partial quick checks passed without Docker sockets. Coverage ran successfully with separate reports and generated-code exclusions checked.

The upgrade baseline remains a candidate requiring maintainer confirmation. Supervisor repeat/reversal, multi-role precedence and concurrent numbering policies remain unresolved. Complete P0/P1 expansion, individual legacy disposition reviews, analyzer suppression review, three clean hosted runs, IDE/devcontainer verification and live required-check configuration remain outstanding. No baseline cutover is claimed. The workflow changes are local; no remote rules were changed. Read-only inspection found no required status checks on the active staging ruleset and a disabled main ruleset.

Fresh-copy validation: cloned the base into `/home/wojtek/projects/researchcruise-validation-fyr61iye`, applied the implementation diff and copied nonignored new files, with no build outputs or node_modules. Frozen installation, build/contract checks, frontend tests, 78 legacy and four new unit cases passed. All eight integration cases failed during fixture startup because the Docker endpoint was unavailable; a subsequent `docker info` reported that Docker was not available in the WSL distribution. Thus this fresh-copy run is incomplete, despite the five earlier successful full runs. Evidence: `backend/artifacts/evidence/fresh-copy.log`.

Fresh-copy retry after Docker became available (2026-09-21): the full `vp run check` passed in 51.462 seconds in the same independent copy: 186 frontend, 78 legacy, four new unit and eight SQL integration cases; no backend skips. A new disposable SQL container was started and removed. This resolves the Docker blocker above. Build outputs from the initial attempt were present on retry, so this is not a cold-build timing or hosted-CI result. Evidence: `backend/artifacts/evidence/fresh-copy-retry.log` and `fresh-copy-retry.json`.

## Authentication expansion

BE-AUTH-002 (P0, specified by testing spec section 6): POST `/v2/auth/login` for wrong password, unknown email, unaccepted account or unconfirmed email returns 401 without a refresh cookie. A fresh SQL query finds the account flags unchanged, no refresh token/expiry, and no queued email; no transport delivery. Test: `Auth/RejectedLoginTests.Login_WhenCredentialsOrAccountAreIneligible_DeniesWithoutSessionOrEmail` (four cases). Implementation execution and review pending.

BE-AUTH-003 (P0, specified by section 6): an accepted/confirmed Guest logs in, POSTs its cookie to `/v2/auth/refresh`, receives 200 with a different cookie and an access token accepted by GET `/v2/users/me`. SQL stores a changed token hash. Replaying the first cookie returns 401 without cookie or SQL/email changes; the replacement remains usable. Test: `Auth/RefreshSessionTests.Refresh_WhenUsedThenReplayed_RotatesAndPreservesTheNewSession`. Execution/review pending.

BE-AUTH-004 (P0, specified by section 6): after valid login, POST `/v2/auth/refresh` with missing/invalid cookie, expired stored session, or an account made unaccepted/unconfirmed returns 401 without cookie, token hash/expiry mutation, flag changes or email effects. Expiry uses a fixed past timestamp, without sleeping. Test: `Auth/RefreshSessionTests.Refresh_WhenCredentialOrAccountIsIneligible_DeniesWithoutChangingSession` (five cases). Execution/review pending.

BE-AUTH-005 (P0, specified by section 6): two accepted/confirmed Guest accounts have separate sessions. POST `/v2/auth/logout` using either bearer-only or cookie-only authentication returns 204 and a secure HttpOnly Strict root-path deletion cookie. Fresh SQL shows the requesting session revoked and the other unchanged; the old cookie returns 401 at refresh while the other account refreshes successfully. No email changes. Test: `Auth/LogoutTests.Logout_WhenSessionExists_RevokesItAndPreservesAnotherAccount` (two cases). Execution/review pending.

BE-AUTH-006 (P0, specified by section 6): GET `/v2/users/me` accepts a real Guest login token, then rejects independently wrong issuer/audience/signature, fixed-past expiry, malformed token or missing bearer credential with 401 and Bearer challenge. No cookie, account/session or email mutation. Test: `Auth/AccessTokenTests.GetProfile_WhenAccessCredentialIsInvalid_ReturnsUnauthorizedWithoutChanges` (six cases). Fixed timestamps avoid sleeping. Execution/review pending.

BE-EMAIL-002 (P0, specified by `email-delivery.md`): enqueue a protected message, fail the transport twice, and explicitly dispatch with controlled time. SQL persists attempt 1 and a 30-second delay, attempt 2 and a 60-second delay, preserving payload and clearing leases. No attempt at 29 seconds; attempts reuse the same message ID. Recovery at the due time delivers the original payload and deletes the acknowledged row. Test: `Persistence/EmailRetryTests.Dispatch_WhenTransportFails_RetriesOnlyWhenDueWithTheSameMessageId`. Execution/review pending.

BE-EMAIL-003 (P0, specified by `email-delivery.md`): pause worker A at the external transport after the SQL claim; independent host B dispatches against the same database. B makes no delivery and does not change the five-minute lease or first attempt. Release A, which acknowledges/deletes the row. Synchronization uses a bounded task barrier, not sleeps. Test: `Persistence/EmailLeaseTests.Dispatch_WhenAnotherWorkerIsDelivering_DoesNotTakeItsLease`. Execution/review pending.

BE-EMAIL-004 (P0, specified by `email-delivery.md`): cancellation at delivery propagates, persists attempt 1, keeps protected payload and its five-minute lease. Dispose host A; independent host B cannot deliver just before expiry but recovers at expiry using persisted keys and the original message ID/content, then deletes the row. Test: `Persistence/EmailLeaseTests.Dispatch_WhenCancelledDuringDelivery_RecoversAfterLeaseExpiry`. Execution/review pending.

BE-EMAIL-005 (P0, specified by `email-delivery.md`): expired messages, rows already at 12 attempts, and a failed twelfth attempt become terminal with empty protected payload and released leases. A healthy queued message is delivered in the same batch. Re-dispatch does not retry terminal messages; after seven days of retention the metadata is deleted. Test: `Persistence/EmailRetryTests.Dispatch_WhenMessageIsTerminal_ClearsPayloadAndContinuesWithHealthyMessage` (three cases). Execution/review pending.

BE-ACCOUNT-001 (P1 account workflow / P0 durable email, specified by section 6 and `email-delivery.md`): anonymous POST `/v2/auth/register` with valid synthetic details returns 201 before any SMTP attempt. SQL has one unaccepted/unconfirmed account, CruiseManager membership and protected confirmation message. Explicit delivery failure preserves the account and retryable message with attempt 1. Test: `Auth/RegistrationTests.Register_WhenSmtpIsUnavailable_CommitsAccountAndRetryableConfirmation`. Execution/review pending.

BE-ATOMIC-001 (P0, specified by section 6 and `email-delivery.md`): valid anonymous registration reaches queue persistence after Identity/account-role writes. A temporary CHECK constraint in the guarded fixture database rejects the outbox insert. HTTP returns 500 ProblemDetails without SQL constraint/exception/recipient leakage; fresh SQL finds no user, membership or queued message, and the preexisting role survives. The constraint is removed in finally; retrying the same registration then returns 201 and persists all three records. Test: `Auth/RegistrationTests.Register_WhenQueuePersistenceFails_RollsBackAccountAndMembership`. Execution/review pending.

## Authentication and email execution evidence (2026-09-21)

BE-AUTH-002 through BE-AUTH-006 (18 cases), BE-EMAIL-002 through BE-EMAIL-005 (six cases), BE-ACCOUNT-001 and BE-ATOMIC-001 (one case each) are implemented and passed focused SQL Server runs. Their scenario descriptions above retain the review requirement; no maintainer acceptance is claimed. The 26 additions use real HTTP/Identity/SQL, controlled email time and an external transport fake. Focused TRX outputs are under `backend/artifacts/tests/auth-*`, `email-*` and `registration-*`. The real database-failure test demonstrates rollback after account and membership writes, followed by successful registration when the injected constraint is removed.

Temporarily removing the refresh expiry guard produced one expected assertion failure (expired refresh returned 200 instead of 401); the four other ineligible-refresh cases passed. Production source was restored byte-for-byte. Evidence: `backend/artifacts/evidence/auth-expiry-fault.log`. This is sensitivity evidence, not a retained application change.

The cross-host recovery fixture previously contained question marks where Polish characters were intended; its payload now uses explicit Unicode escapes for the actual Polish text. This corrects the fixture rather than claiming the earlier ASCII payload proved Unicode preservation.

Supervisor-policy clarification: source currently allows a decision only from WaitingForSupervisor, then returns 403 for any subsequent decision (same or opposite); office-rejected applications also return 403. The user asked for current behaviour and was informed. No policy acceptance or change has been inferred from that question.

Combined validation after this expansion: root `vp run check` passed in 77.477 seconds, including 186 frontend, 78 legacy, four new unit and 34 SQL integration cases (zero backend skips). Integration execution including setup took 36.635 seconds. Evidence: `backend/artifacts/evidence/auth-email-workspace.log` and `backend/artifacts/tests/run-HXLpTk/`. These are local warm measurements of the current partial suite; no hosted/full-baseline acceptance is implied.

BE-ACCESS-002 (P0, specified by section 6 and permissions matrix): POST `/v2/applications` with an otherwise valid draft returns 401 for anonymous and 403 for Guest/ShipCrew. The manager exists but application, form, child and outbox tables remain empty; no email delivery. Test: `Applications/FormAccessTests.CreateDraft_WhenActorCannotEdit_RejectsWithoutWrites` (three cases). Route names reconciled with v2 endpoint registration. Execution/review pending.

BE-ACCESS-003 (P0, specified by permissions matrix draft visibility): GET `/v2/applications/{id}/form-a` for a draft created through HTTP returns 200 to its manager/deputy, 401 anonymously, and 404 to unrelated CruiseManager, Administrator, Shipowner, Guest and ShipCrew. Successful responses preserve both manager IDs. SQL remains Draft with original note, one form and no email. Test: `Applications/FormAccessTests.ReadDraft_WhenActorRequestsAnotherApplication_EnforcesOwnership` (eight cases). Execution/review pending.

BE-ACCESS-004 (P0, needs-decision): shipowner editing another manager's draft conflicts between `docs/permissions.md` (owner/deputy or Administrator) and `RolePermissionRules.CanAddApplicationForm` (also any Shipowner). User clarification requested; no assertion freezes either policy.

Policy resolution for BE-ACCESS-004, 2026-09-21: user selected "Require shipowner to be manager/deputy (documentation)". Status: specified. The shared A/B/C form-edit rule must therefore allow only manager/deputy or Administrator; Shipowner alone does not bypass ownership.

BE-ACCESS-005 (P0, permissions matrix and above resolution): PUT `/v2/applications/{id}/form-a` with a valid replacement draft returns 204 for manager/deputy/Administrator, 401 anonymously, 404 for unrelated CruiseManager/Shipowner, and 403 for Guest/ShipCrew. Allowed writes update the note, preserve manager/deputy and leave one form; rejected writes preserve original note and form identity. Owner can still GET the form; no queued/delivered email. Test: `Applications/FormAccessTests.UpdateDraft_WhenActorRequestsEdit_EnforcesOwnershipAndPreservesRejectedState` (eight cases). Execution/review pending.

BE-ACCESS-004 executable detail: `Applications/FormAccessTests.UpdateDraft_WhenShipownerChangesForm_RequiresExistingAssignment` covers a single-role Shipowner assigned as manager, assigned as deputy, or unrelated. Assigned actors receive 204 and persist their note; an unrelated actor receives 404 even when attempting to assign themselves manager in the request body, and SQL retains the original managers/note. No email. Three cases, specified by the user decision above.

BE-ACCESS-006 (P0, permissions matrix and resolved shared ownership rule): PUT `/v2/applications/{id}/form-b` or `/form-c` by an unrelated single-role Shipowner with valid incomplete draft body returns 404 before status-dependent processing. Application status/note remains unchanged; Forms B/C and outbox remain empty. Test: `Applications/FormAccessTests.WriteLaterForm_WhenShipownerIsUnrelated_DeniesWithoutWrites` (two cases). This proves denied access, not successful B/C lifecycle coverage.

## Form authorization implementation (2026-09-21)

BE-ACCESS-002/003/004/005/006 are implemented: three create-denial cases, eight draft-read cases, three shipowner-assignment cases, eight edit-permission cases and two later-form denial cases. Focused SQL runs passed after the production correction. The original edit matrix failed for unrelated Shipowner (400 instead of 404, proving the ownership guard was bypassed) and Administrator (400 instead of 204, proving the replacement-form factory incorrectly reused the submitter restriction). Reports/logs are in `backend/artifacts/tests/form-*-access-*`, `shipowner-assignment`, `later-form-access` and matching `backend/artifacts/evidence/` logs.

The resolved shared rule now limits editing to existing manager/deputy or Administrator. The Form A factory allows the administrator exception only for the update endpoint; ordinary create calls retain their submitter check. No database migration or API contract change is required.

Legacy correction: `AccessControlTests.ShipownerAndAssignedManagersCanCreateFormsBAndC` contained an expectation contradicted by the user's documented-policy choice. It is retained in execution as `OnlyAssignedManagersAndAdministratorsCanCreateFormsBAndC`, with the unrelated Shipowner assertion corrected to false. No test is retired or removed; maintainer review remains pending. The new HTTP matrix and assignment/self-assignment cases provide independent SQL-backed regression coverage.

Fault confirmation for BE-ACCESS-004: temporarily restoring the old Shipowner bypass caused the unrelated self-assignment case to return 204 instead of 404 (the two legitimately assigned Shipowner cases still passed). The corrected production source was restored byte-for-byte. Evidence: `backend/artifacts/evidence/shipowner-bypass-fault.log` and `backend/artifacts/tests/shipowner-bypass-fault/`. This demonstrates the original unauthorized write, beyond the earlier 400-vs-404 guard-order failure.

Combined validation after the form authorization fix: `vp run check` passed in 104.482 seconds with 186 frontend, 78 legacy, four unit and 58 SQL integration cases, zero backend skips. Integration including setup took 63.404 seconds. Evidence: `backend/artifacts/evidence/form-access-workspace.log` and `backend/artifacts/tests/run-2uHXD2/`. This expanded partial suite exceeds the provisional 90-second root/60-second integration targets on this run; those remain unratified. Record this as performance calibration work still required, not as meeting the original target. No coverage was removed or relegated to a slow suite.

BE-FORMB-001 (P0, specification section 6 form lifecycle and permissions matrix): assigned CruiseManager with synthetic FormBRequired application PUTs `/v2/applications/{id}/form-b` draft with one UG child (201; still FormBRequired), GETs persisted count (200), replaces count 2 with 3 (201; exactly one form/child), submits final (201; FormBFilled), then cannot edit again (403; unchanged). Manager refill is 403; Administrator PUT `/form-b/refill` is 204 and returns to FormBRequired without changing the child. No queued/delivered mail. Test: `Applications/FormBWorkflowTests.FormB_WhenSavedReplacedSubmittedAndReopened_PersistsExpectedStateAndChildren`. Execution/review pending.

BE-FORMC-001 (P0, section 6 forms/files and permissions matrix): assigned manager with Undertaken application saves Form C draft with a small PNG (PUT 201), GET reads exact base64/name (200), replaces it (201; SQL contains only replacement), then submits final without photos (201; Reported; old photos removed). Further edit returns 403 with no changes. Manager cannot refill (403); Shipowner can (204; Undertaken). No mail. Test: `Applications/FormCWorkflowTests.FormC_WhenPhotosAreReplacedThenRemoved_StoresOnlyCurrentFilesAndCanBeReopened`. Execution/review pending.

BE-FORM-VALIDATION-001 (P0, section 6 final/draft validation and indexed paths): assigned manager saves B/C draft containing a permission without its scan (201). Final submission returns 400 validation ProblemDetails with `Form.Permissions[0]`. SQL retains the original form ID, permission ID, lifecycle state and empty outbox; GET returns the original permission without a scan. Test: `Applications/FormValidationTests.Submit_WhenPermissionScanIsMissing_ReturnsIndexedErrorAndPreservesDraft` (B/C cases). Execution/review pending.

BE-CRUISE-001 (P0, section 6 cruise planning/lifecycle, permissions matrix and durable-email contract): Shipowner POST `/v2/cruises` attaches an Accepted application (201, New, no mail). Premature PUT `/completion` is 400 unchanged. PUT `/confirmation` is 204, Confirmed/FormBRequired and one queued manager notification; repeat is 403 with no extra mail. Assigned manager submits Form B (201, FormBFilled). PUT `/completion` is 204, Ended/Undertaken; repeat is 400 unchanged. DELETE `/confirmation` reverts to Confirmed/FormBFilled (204). Explicit dispatch delivers to the manager once; later transitions queue nothing. Test: `Cruises/CruiseLifecycleTests.Cruise_WhenPlannedConfirmedCompletedAndReverted_PersistsLifecycleAndNotification`. Execution/review pending.

Form/lifecycle focused execution (2026-09-21): BE-FORMB-001, BE-FORMC-001, both BE-FORM-VALIDATION-001 cases and BE-CRUISE-001 passed against SQL Server. The initial Form B fixture incorrectly supplied the SQL identity Number; removing that explicit value fixed setup. No application code was changed for these five cases. Reports: `backend/artifacts/tests/form-b-workflow-corrected`, `form-c-workflow`, `form-final-validation`, `cruise-lifecycle`. Maintainer review remains pending.

Combined form/lifecycle validation: root `vp run check` passed in 113.954 seconds, with 186 frontend, 78 legacy, four unit and 63 integration cases (zero backend skips). Integration execution including setup took 67.465 seconds. Evidence: `backend/artifacts/evidence/form-lifecycle-workspace.log` and `backend/artifacts/tests/run-n73IVs/`. The provisional timing targets remain exceeded; performance calibration/optimization is still outstanding.

BE-FORM-BINDING-001 (P0, section 6 required/missing/null binding): assigned manager PUTs each A/B/C endpoint with missing form, null form, missing draft flag and string draft flag. Each returns 400 without replacing the existing Form A, creating B/C, changing application state or queuing/delivering mail. Test: `Applications/FormBindingTests.Write_WhenRequiredEnvelopeIsInvalid_ReturnsBadRequestWithoutChangingApplication` (three endpoint cases, four invalid envelopes each). Execution/review pending.

BE-CRUISE-ACCESS-001 (P0, section 6 authorization and permissions matrix): anonymous actor receives 401 and Guest/CruiseManager/ShipCrew receive 403 on POST `/v2/cruises`, PATCH/DELETE `/v2/cruises/{id}`, PUT confirmation/completion and DELETE confirmation. After each rejection SQL retains one New cruise with original dates/title/managers and its Accepted application; no email queued/delivered. Test: `Cruises/CruiseWriteTests.MutateCruise_WhenActorHasNoOfficeRole_DeniesAllOperationsWithoutChanges` (four actor cases, six operations each). Execution/review pending.

BE-ATOMIC-002 (P0, section 6 returned-business-error atomicity): Administrator PATCH `/v2/cruises/{id}` changes dates/title/assignments but supplies a nonexistent manager; endpoint returns 404 after tracked date/title changes. Fresh SQL must preserve original cruise and application relationship with no email. Retrying with no manager returns 204, persists the dates/title and detaches the application without deleting it. This tests a returned-error path, not rollback after a flushed SQL write. Test: `Cruises/CruiseWriteTests.UpdateCruise_WhenManagerDoesNotExist_PreservesDatesTitleAndAssignments`. Execution/review pending.

BE-BLOCKADE-001 (P0, section 6 date/blockade boundaries): public free-window rule on fixed Jan 1-5 2030 interval must find one contiguous interval of the requested duration. Twelve explicit cases cover exact fit/insufficient duration, middle blockade, overlapping unsorted blockades, outside intervals touching the endpoints, full coverage, fragmented free time, adjacent blockades and half-day boundaries. Expected outcomes are literal worked interval results, not recomputed using the production algorithm. Test: `Applications/CruiseBlockadeTests.FindWindow_WhenBlockadesMeetDurationBoundaries_RequiresContiguousAvailableTime` in UnitTests. HTTP/state/mail are not applicable. Execution/review pending.

BE-FILE-001/002 (P1, section 6 file boundaries and documented two-MiB scan limit): PDF signature accepts raw base64/data URI, rejects PNG/plain text/truncated signature/invalid base64/empty input. Decoded size accepts 2,097,151 and 2,097,152 bytes, rejects 2,097,153 bytes and malformed base64, for raw and data-URI encoding. Eleven unit cases in `Infrastructure/PermissionScanTests`. These check the implemented signature inspection, not full PDF structural validation or malware scanning. HTTP/persistence/email not applicable. Execution/review pending.

Binding/cruise/file execution evidence (2026-09-21): initial BE-FORM-BINDING-001 run returned 500 for explicit null form in all three endpoints. Each validator now rejects null and bypasses child rules when absent; the focused run passed. The matrix additionally includes null form in final mode (five invalid envelopes per endpoint). Four cruise-denial cases, the returned-manager-error case, twelve blockade cases and eleven file-inspection cases passed focused runs. No other production behaviour was changed in this batch.

Fault sensitivity: changing the blockade full-window comparison from `<` to `<=` caused both exact-four-day cases to fail; production source was restored byte-for-byte. Logs/TRX: `backend/artifacts/evidence/form-binding-red.log`, `form-binding-green.log`, `cruise-write-access.log`, `cruise-returned-error.log`, `blockade-boundary-fault.log`, and corresponding test directories including `blockade-boundaries` and `permission-scan-boundaries`. Maintainer review remains pending.

Performance investigation of the previous 63-case integration run (`run-n73IVs`): SQL startup 9.880 s, migrations 3.750 s and reset planning 0.113 s; 65 application-host starts totalled 19.937 s. The slowest cases were final Form C validation (2.535 s), schema upgrade (2.070 s), competing initialization (2.043 s), final Form B validation (1.674 s), and cruise lifecycle (1.267 s). Repeated host initialization is a significant remaining optimization target; any host reuse must preserve rate-limiter, Data Protection, clock and transport isolation. No timing-driven test removal or retries were introduced.

Combined binding/cruise/file validation: root `vp run check` passed in 106.417 seconds with 186 frontend, 78 legacy, 27 unit and 71 SQL integration cases (zero backend skips). Integration setup/execution took 67.010 seconds. Both draft and final null-form envelopes passed the corrected 400/no-write assertions. Evidence: `backend/artifacts/evidence/binding-cruise-workspace.log` and `backend/artifacts/tests/run-12zhOD/`. Timing targets remain provisional and exceeded.

BE-ACCOUNT-002 (P1, section 6 password recovery/session revocation): accepted confirmed account logs in, POST `/v2/auth/password-reset-request` returns 204 and queues a captured email. Extract its actual reset link; invalid token returns 401 without password/session mutation. Correct POST `/password-reset` returns 204, changes password and clears refresh hash/expiry. Old refresh/password fail (401), new password works (200), reused reset token returns 401 without revoking the replacement session. No extra email. Test: `Auth/PasswordRecoveryTests.ResetPassword_WhenEmailTokenIsUsed_ChangesPasswordRevokesSessionAndRejectsReplay`. Execution/review pending.

BE-ACCOUNT-003 (P1, section 6 confirmation/acceptance/deactivation and permissions matrix): anonymous registration returns 201 and emits captured confirmation link. Invalid confirmation code returns 401 without flag changes; valid GET `/v2/auth/confirm-email` returns 204 and confirms email but does not accept the account, so login remains 401. Administrator PUT `/v2/users/{id}/acceptance` returns 204, sets Accepted and queues one acceptance email; login then succeeds. Administrator DELETE acceptance returns 204, clears Accepted and refresh credentials; subsequent login/refresh return 401 with no extra mail. Test: `Auth/AccountLifecycleTests.Account_WhenConfirmedAcceptedThenDeactivated_EnforcesBothGatesAndRevokesSession`. Execution/review pending.

BE-EXPORT-001 (P1, section 6 CSV escaping/Polish text/date handling and permissions matrix): Guest GET `/v2/cruises/export?year=2024` returns 200 and Rejsy.csv. A manager name containing comma, quotes and Polish letters must remain one intact Description field in a six-column CSV parsed by an independent standard parser. Historical January/July UTC timestamps convert to explicit Warsaw winter/summer local dates/times. SQL cruise and outbox stay unchanged; no mail. Test: `Cruises/CruiseExportTests.Export_WhenNamesContainCsvCharacters_PreservesColumnsUnicodeAndLocalTime` (two cases). Execution/review pending.

Account/export execution (2026-09-22): BE-ACCOUNT-002 and BE-ACCOUNT-003 passed focused SQL runs using captured production email action links, real Identity tokens and fresh persistence scopes. BE-EXPORT-001 initially failed both winter/summer cases with an independent CSV parser reporting malformed rows. CsvExporter now quotes fields containing commas, quotes or line breaks and doubles embedded quotes. Both export cases pass, retaining six columns, Polish text and historical Warsaw local-time conversion. Evidence: `backend/artifacts/evidence/password-recovery.log`, `account-lifecycle.log`, `cruise-export-red.log`, `cruise-export-green.log`, plus corresponding TRX directories. Maintainer review remains pending.

Combined account/export validation (2026-09-22): `vp run check` passed in 155.092 seconds with 186 frontend, 78 legacy, 27 unit and 75 integration cases (zero backend skips). Integration setup/execution took 99.350 seconds. Evidence: `backend/artifacts/evidence/account-export-workspace.log` and `backend/artifacts/tests/run-PKbHhX/`. This run is substantially above the provisional targets; timing optimization/calibration remains open, and this pass is correctness evidence only.

Concurrent orchestration validation (2026-09-22): after the successful Release build and contract comparison, frontend lint/type/unit checks overlap backend execution; legacy VSTest, new MTP units and SQL integration run in independent processes with distinct result directories. SQL collection serialization, resets and fresh hosts are unchanged. All process statuses are awaited and combined; no cases were removed, retried or moved out of the gate.

The same 186 frontend / 78 legacy / 27 unit / 75 integration cases passed before and after the change. The initial warm root measurements were 139.111 seconds before and 103.101 seconds after. These are individual local observations, not a calibrated performance claim; the provisional 90-second root target remains exceeded. Evidence: `backend/artifacts/evidence/parallel-before.{log,json}`, `parallel-after.{log,json}` and after-change reports in `backend/artifacts/tests/run-gkISyT/`.

Concurrent failure-path evidence: temporarily changing one frontend expectation yielded exactly one frontend failure (185 passed), root exit 1, and all 78 legacy / 27 unit / 75 integration cases passed with fresh reports (`parallel-frontend-fault.{log,json}`, `run-IGuIvE/`, 126.175 seconds). Independently changing one legacy assertion yielded exactly one legacy failure (77 passed), root exit 1, while all 186 frontend / 27 unit / 75 integration cases passed (`parallel-legacy-fault.{log,json}`, 139.170 seconds). Both temporary changes were restored using the original file bytes before final validation. ShellCheck and `git diff --check` passed. Maintainer review and hosted timing calibration remain pending.

Final restored-source concurrent run: `vp run check` passed in 94.808 seconds with all 366 cases passing (186 frontend, 78 legacy, 27 unit, 75 SQL integration; zero backend skips). Evidence: `backend/artifacts/evidence/parallel-final.{log,json}` and `backend/artifacts/tests/run-KbuMyw/`. The two positive after-change runs measured 103.101 and 94.808 seconds versus the single 139.111-second before run; this is encouraging local evidence, not hosted calibration or acceptance of the provisional target.

BE-CATALOG-001 (P1, specification catalog pagination, HTTP + SQL): three owned applications with tied dates/years and fixed GUID order are paged one at a time in both directions for number/date/year. Assert exact IDs on every page, continuation before the last page, and no continuation afterward. SQL generates application numbers. Test: CatalogPaginationTests.Pages_WhenSortValuesTie_ReturnEveryApplicationOnceInOrder (six cases). Execution pending.

BE-CATALOG-002 (P1, permissions matrix and catalog pagination, HTTP + SQL): for each of the five single roles, exclude another manager's draft and a different year before taking pages. Verify own/other accepted IDs, terminal cursors, detail 404 for hidden drafts, and manager choices excluding invisible owners. Test: CatalogPaginationTests.Pages_WhenApplicationsAreRestricted_FilterBeforePagingAndHideOtherDrafts (five cases). Execution pending.

BE-CATALOG-003 (P1, catalog cursor input boundary, HTTP + SQL): malformed base64, missing cursor fields, null JSON and a real number cursor used with date ordering must safely return the first date page and its continuation. This characterizes the existing first-page fallback, not a new rejection policy. Test: CatalogPaginationTests.Pages_WhenCursorIsMalformedOrIncompatible_ReturnFirstPage. Execution pending.

BE-CATALOG-004 (P1, cruise planning candidate HTTP contract + SQL): manager and administrator see eligible accepted applications according to visibility. Editing adds an owned attached FormBRequired application, but cannot expose another owner's attached draft. Assert exact candidate membership plus JSON year, manager GUID, form flags and zero points. Test: CatalogPaginationTests.Planning_WhenEditingCruise_IncludesAttachedApplicationsButHidesOtherDrafts (two cases). Execution pending.

Catalog focused execution (2026-09-23): BE-CATALOG-001/002/003/004 all passed against SQL Server: six ordering/tie cases, five visibility/filter cases, one cursor input case and two planning candidate cases. Reports are in backend/artifacts/tests/catalog-pagination, catalog-visibility, catalog-cursors and catalog-planning; matching logs are in backend/artifacts/evidence. The year fixture was corrected to set its init-only property in the initializer. Existing CSV header parsing now explicitly asserts non-null before comparison, resolving CS8604 under warning-as-error builds. No production code changed. Maintainer review remains pending.

Combined catalog validation (2026-09-23): root vp run check exited 0 with 186 frontend, 78 legacy, 27 unit and 89 SQL integration cases, totaling 380; zero backend skips. Formatting, locked restore, warning-as-error build and generated contract comparison also passed. Integration setup/execution took 112.002 seconds, exceeding the provisional 60-second integration target; performance calibration remains open. Evidence: backend/artifacts/evidence/catalog-workspace.log and backend/artifacts/tests/run-KgG09Q/. The broader testing handoff remains incomplete.

BE-SUPERVISOR-002 (P0, spec section 6 first supervisor decision, HTTP + SQL; specified): anonymous caller GETs the review with the matching code (200, correct manager), then PUTs /v2/applications/{id}/supervisor-review/decision with accept true/false (204). Only that WaitingForSupervisor application becomes AcceptedBySupervisor/DeniedBySupervisor; the other application, notes and form count remain unchanged. No queued/delivered email. Test: SupervisorReviewTests.FirstDecision_WhenCodeMatches_ChangesOnlyTargetApplication (two cases). Execution/review pending. Repeated/reversed decisions remain BE-SUPERVISOR-001 needs-decision.

BE-SUPERVISOR-003 (P0, explicit supervisor decision and required request data, HTTP + SQL; specified): anonymous PUT /v2/applications/{id}/supervisor-review/decision with a correct code but no accept property must return 400, preserve both waiting applications and leave the outbox empty. Omitting a decision cannot mean rejection. Test: SupervisorReviewTests.Decision_WhenAcceptIsMissing_ReturnsBadRequestWithoutChangingState. Execution/review pending.

BE-SUPERVISOR-003 regression evidence: the original missing-accept request returned 204 instead of 400 (supervisor-binding-red.log/TRX). The generated SupervisorDecisionRequest schema already requires accept and code. Both positional record properties now use JsonRequired so missing values fail JSON binding. Expanded test Decision_WhenRequiredDataIsInvalid_ReturnsBadRequestWithoutChangingState covers missing accept, missing code, null accept and string accept (four cases). This enforces the published contract without resolving repeated-decision policy. Execution of the correction pending.

BE-SUPERVISOR-004 (P0, supervisor code authorization, HTTP + SQL; specified): anonymous GET review without code returns 400. Empty, malformed and another application's valid code return 404 for GET review and PUT decision. After every rejected code both waiting application states/notes and form count are unchanged; no queued/delivered email. Test: SupervisorReviewTests.Review_WhenCodeIsInvalidOrBelongsToAnotherApplication_DeniesWithoutChanges. Execution/review pending.

Supervisor focused execution (2026-09-23): both first-decision cases passed before and after the correction. Missing accept initially returned 204 instead of 400; after JsonRequired, all four malformed-envelope cases pass with unchanged SQL state. Invalid/cross-application code checks also pass. Logs/TRX: supervisor-first, supervisor-binding-red, supervisor-binding-green and supervisor-codes under backend/artifacts/evidence and backend/artifacts/tests. No decision email is queued or delivered. Repeated decisions remain unresolved; maintainer review pending.

Combined supervisor validation (2026-09-23): root vp run check exited 0 in 144.64 seconds, with 186 frontend, 78 legacy, 27 unit and 96 SQL integration cases (387 total, zero backend skips). Formatting, locked restore, warning-as-error build and generated API comparison passed. SQL setup/execution took 118.844 seconds. Both provisional root/integration timing targets remain exceeded. Evidence: backend/artifacts/evidence/supervisor-workspace.{log,seconds,exit} and backend/artifacts/tests/run-jXaHti/. First decisions, request binding and invalid-code coverage are implemented; repeated-decision policy and broader handoff remain incomplete.

BE-INFRA-001 (P1, infrastructure 429 contract and endpoint ProducesProblem, HTTP + SQL): anonymous client exhausts the shared auth budget with ten refresh requests without cookies (401), then sends valid login credentials (429, application/problem+json, status 429/title Too many requests.). No session cookie, persisted refresh token/expiry or queued/delivered email. Health still returns 200/Healthy. Test: RateLimitTests.Login_WhenAuthBudgetIsExhausted_ReturnsProblemWithoutCreatingSession. Execution/review pending.

BE-ROLES-001 (P0, permissions matrix user editing, HTTP + SQL; specified single-role actors): PUT /v2/users/{id}/roles/{role} rejects anonymous (401), CruiseManager/Guest/ShipCrew (403), and Shipowner granting Administrator or Shipowner (403). Target retains exactly CruiseManager; no queued/delivered email. Requested roles exist before the request. Test: RoleManagementTests.Grant_WhenActorIsNotAllowed_DeniesWithoutChangingMembership (six cases). Execution/review pending.

BE-ROLES-002 (P1, permissions matrix lower-role management, HTTP + SQL): Administrator and Shipowner PUT Guest membership for a CruiseManager (204, both memberships persisted), then DELETE Guest (204, original CruiseManager retained). No queued/delivered email. Test: RoleManagementTests.Role_WhenOfficeGrantsThenRemoves_PreservesOtherMembership (two cases). Execution/review pending.

BE-INFRA-002 (P1, public infrastructure probes, HTTP + SQL): with Sentry DSN disabled, anonymous GET /health returns 200/Healthy and /version returns 200/application/json with a three-part numeric version string. Neither response sets a session cookie; no users or queued/delivered email. Test: PublicStatusTests.Status_WhenRequestedAnonymously_ReturnsHealthAndThreePartVersion. Execution/review pending. Existing BE-ATOMIC-001 already covers the 500 ProblemDetails content type/status and suppression of SQL constraint, exception type and account email from responses; no duplicate exception test added.

Infrastructure/role focused evidence: BE-INFRA-001 initially failed because 429 used application/json; setting the explicit ProblemDetails content type preserves the payload and passes the regression. Six role-denial and two grant/removal cases passed against SQL Server. Evidence: rate-limit-red, rate-limit-green, role-denials and role-workflow under backend/artifacts/evidence and backend/artifacts/tests. Maintainer review remains pending.

Combined infrastructure/roles validation (2026-09-23): root vp run check exited 0 in 151.90 seconds, with 186 frontend, 78 legacy, 27 unit and 106 SQL integration cases (397 total; zero backend skips). All ten new cases passed, including public health/version. Formatting, locked restore, warning-as-error build and generated API comparison passed. SQL setup/execution took 126.235 seconds; provisional timing targets remain exceeded. Reports: backend/artifacts/tests/run-jvVD69/. Log/timing/exit: backend/artifacts/evidence/infra-roles-workspace.{log,seconds,exit}. Broader coverage, maintainer/legacy review, unresolved policies and hosted validation remain outstanding.

BE-ACCOUNT-004 (P1, account password change and session security, HTTP + SQL): authenticated CruiseManager PATCH /v2/users/me/password with incorrect current password or weak replacement returns 400 and preserves password/session hashes. Correct change returns 204, changes the stored password hash, clears refresh hash/expiry, rejects the old refresh cookie and old password (401), and accepts the replacement password (200). No queued/delivered email. Test: PasswordChangeTests.ChangePassword_WhenCurrentPasswordIsVerified_ReplacesPasswordAndRevokesRefresh. Execution/review pending.

BE-ACCOUNT-005 (P0/P1, permissions matrix account deletion, HTTP + SQL; single-role actors): DELETE /v2/users/{id} returns 401 for anonymous, 403 for CruiseManager/Guest/ShipCrew, and 403 for Shipowner targeting Administrator/Shipowner. Administrator/Shipowner deleting Guest returns 204. Denials preserve target password, refresh token and exact role membership; target refresh remains valid. Successful deletion removes target and membership and rejects its old refresh cookie. Other accounts remain, no queued/delivered mail. Test: AccountDeletionTests.Delete_WhenActorRequestsAnotherAccount_EnforcesRoleLimitsAndSessionState (eight cases). Execution/review pending; last-administrator and conflicting multi-role policy are not covered by this scenario.

BE-ACCOUNT-006 (P0/P1, password endpoint authorization and binding, HTTP + SQL): anonymous valid PATCH /v2/users/me/password returns 401. Authenticated requests missing password/newPassword, with null replacement or numeric current password return 400. Existing password and refresh hashes remain unchanged after rejection; old refresh still succeeds (200). No queued/delivered mail. Test: PasswordChangeTests.ChangePassword_WhenUnauthenticatedOrMalformed_PreservesCredentialsAndSession. Execution/review pending.

Account security focused evidence: BE-ACCOUNT-004/005/006 passed (ten cases total) without production changes. The initial password run could not initialize the SQL fixture because Docker Desktop was stopped; its log is preserved separately as password-change-docker-unavailable.log. Starting Docker restored execution. Passing logs/TRX: password-change, account-deletion and password-change-binding under backend/artifacts/evidence and backend/artifacts/tests. Maintainer review remains pending.

Combined account security validation (2026-09-23): root vp run check exited 0 in 158.90 seconds, with 186 frontend, 78 legacy, 27 unit and 116 SQL integration cases (407 total; zero backend skips). Formatting, locked restore, warning-as-error build and generated API comparison passed. SQL setup/execution took 134.885 seconds; provisional timing targets remain exceeded. Reports: backend/artifacts/tests/run-7LJHqR/. Evidence: backend/artifacts/evidence/account-security-workspace.{log,seconds,exit}. No production code changed for this batch. Broader coverage, legacy/maintainer review, unresolved policies and hosted validation remain outstanding.

BE-SCORING-001 (P1, specification scoring boundaries and baseline EvaluationConstants funding schedule; HTTP + SQL): owner POSTs Form A draft with funding amounts 0/99999/100000/199999/200000. Evaluation GET returns domestic 0/0/50/50/100 or foreign 0/0/80/80/160, with summary totals 200/320. PUT replacement with only 99999 returns 204 and evaluation/summary zero with exactly one persisted task link; draft status and empty outbox retained. Test: ApplicationScoringTests.Funding_WhenAmountsCrossBands_PersistsScoresAndRecalculatesReplacement (two cases). Literal expectations are worked examples of the existing schedule, pending maintainer review; no claim of external scoring-policy approval. Execution pending.

BE-SCORING-002 (P1, valid numeric scoring inputs, HTTP + SQL): Form A draft funding values text, -1, NaN, Infinity and exponent overflow 1e309 must return 400 without persisting application/form/outbox rows. Test: ApplicationScoringTests.Funding_WhenAmountIsInvalid_RejectsWithoutWritingDraft. Execution/review pending.

BE-SCORING-003 (P1, incomplete draft support, HTTP + SQL): null or empty domestic/foreign project funding may be saved as a draft (201), with both task links and summary scoring zero, draft status and empty outbox preserved. Test: ApplicationScoringTests.Funding_WhenDraftAmountIsAbsent_SavesBothProjectTypesWithZeroPoints (two cases). Execution/review pending.

Scoring focused execution (2026-09-24): funding thresholds/replacement passed. Invalid text funding initially caused 500 because draft validation omitted numeric research-task checks; drafts now use those shared checks, with finite-number validation for both financing and secured amounts. BE-SCORING-002 now has two cases covering both fields. A second regression showed empty-string funding caused 500 while null succeeded; both project scorers now treat null/empty amounts as absent for incomplete drafts. All six focused cases pass. Logs/TRX: scoring-funding, scoring-invalid-red, scoring-green, scoring-absent-red and scoring-final. Other scoring categories, aggregate overflow limits and completed-cruise effects still require coverage/review.

Combined scoring validation (2026-09-24): root vp run check exited 0 in 150.99 seconds, with 186 frontend, 78 legacy, 27 unit and 122 SQL integration cases (413 total, zero backend skips). Formatting, locked restore, warning-as-error build and generated API comparison passed. SQL setup/execution took 131.816 seconds; provisional timing targets remain exceeded. Reports: backend/artifacts/tests/run-l851ae/. Evidence: backend/artifacts/evidence/scoring-workspace.{log,seconds,exit}. The remaining acceptance checklist near the top of this ledger records unfinished coverage, review, policy, CI, performance and tooling work.

BE-FORMA-003 (P0, form lifecycle/supervisor review/office decision and durable invitation; HTTP + SQL): owner either POSTs final Form A (201) or saves a draft, verifies incomplete final rejection (400), then PUTs complete final (204). WaitingForSupervisor, one form/team and one queued invitation persist; GET preserves children and repeat form edit is 403. Dispatch delivers the actual supervisor link; its anonymous review GET and first acceptance succeed. Shipowner first office decision accepts/rejects (204, Accepted/Denied), retaining managers and child rows, with no additional mail. Test: FormAWorkflowTests.Submit_WhenSupervisorAndOfficeDecide_PersistsFormInvitationAndFinalStatus (four cases). Execution/review pending; no repeated-supervisor policy asserted.

BE-DECISION-001 (P0, explicit office decision and required Accept contract, HTTP + SQL): Administrator PUT /v2/applications/{id}/decision with {} returns 400 and preserves AcceptedBySupervisor, form and empty outbox. An explicit true afterward returns 204/Accepted with no mail. Test: OfficeDecisionTests.Decide_WhenAcceptIsMissing_RejectsWithoutChangingApplication. Execution/review pending.

Form A and office decision focused execution (2026-09-25): all four BE-FORMA-003 cases passed against SQL Server in 21.910 seconds. BE-DECISION-001 first failed because an omitted accept returned 204 and denied the application. ApplicationDecisionRequest.Accept now uses JsonRequired; the regression passes in 18.578 seconds, preserving SQL state after the rejected request and allowing an explicit acceptance afterward. Logs/TRX: form-a-workflow, office-decision-red and office-decision-green under backend/artifacts/evidence and backend/artifacts/tests. Maintainer review remains pending.

Combined Form A/office decision validation (2026-09-25): root vp run check exited 0 in 143.65 seconds, with 186 frontend, 78 legacy, 27 unit and 127 SQL integration cases (418 total, zero backend skips). Formatting, locked restore, warning-as-error build and generated API comparison passed. SQL setup/execution took 124.018 seconds; provisional root/integration timing targets remain exceeded. Reports: backend/artifacts/tests/run-xwN6oc/. Evidence: backend/artifacts/evidence/form-a-workspace.{log,seconds,exit}. Maintainer review and the remaining acceptance checklist are still outstanding.

BE-ATOMIC-002 (P0, durable invitation transaction contract; HTTP + SQL): force outbox persistence to fail with a SQL constraint during final Form A creation or draft replacement. Expect generic 500, no leaked SQL details, no partial form/application/child rows or mail; replacement preserves original draft identity and GET content. Remove the fault and retry, expecting one submitted application and one deliverable invitation. Test: FormAAtomicityTests.Submit_WhenQueuePersistenceFails_RollsBackFormAndAllowsRetry (two cases). Execution/review pending.

BE-ATOMIC-002 focused evidence (2026-09-25): rollback assertions passed for both paths. Recovery of a populated draft exposed deletion of its reused research task link: the cleanup SQL counted only the old persisted form while replacement references were unsaved. Form A update now saves replacement references inside its existing transaction before cleanup. Both cases pass (16.641 seconds); logs/TRX form-a-atomicity and form-a-atomicity-green preserve failure/correction evidence. Form B/C replacement cleanup uses similar sequencing and requires a separate coverage audit; no claim is made for those paths. Maintainer review pending.

Combined Form A atomicity validation (2026-09-25): root vp run check exited 0 in 148.96 seconds. All 420 cases passed: 186 frontend, 78 legacy, 27 unit and 129 SQL integration, with zero backend skips and zero build warnings/errors. Formatting, locked restore and generated API comparison passed. Integration setup/execution took 131.068 seconds; provisional performance targets remain exceeded. Evidence: backend/artifacts/evidence/form-a-atomic-workspace.{log,seconds,exit}; reports backend/artifacts/tests/run-dkxPCI/. Maintainer review and broader acceptance work remain pending.
