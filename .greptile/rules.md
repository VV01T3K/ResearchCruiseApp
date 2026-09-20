# ResearchCruiseApp review rules

## Findings

Report defects introduced or exposed by the change. Before commenting, trace the
affected callers and safeguards until you can name a triggering input or action,
the failing code path, and its consequence. Report each shared root cause once;
tie any regression-test request to that same scenario.

Resolve conflicts with older knowledge-base or permission docs using current code
and PR intent. Treat existing behavior as context to evaluate, not a correctness
requirement. Apply only the area checks relevant to the changed behavior.

## Authorization and sessions

- For role or resource-access changes, compare `RolePermissionRules`, backend enforcement
  and frontend permission helpers across list, detail, export and write paths.
  Include multiple roles and assigned cruise managers/deputies in the comparison.
- For session changes, trace `frontend/src/api/client/auth-session.ts`,
  `frontend/src/api/client/custom-fetch.ts` and backend session endpoints together.
  Distinguish cross-tab refresh conflicts with status 409 and transient failures
  from terminal 401 responses. Check that refresh retries respect logout, in-memory
  access tokens and HttpOnly refresh cookies.

## API and frontend behavior

- For API or cache changes, trace backend contracts through OpenAPI and
  `frontend/orval.config.ts` to callers. Account for generated invalidations before
  requesting more; direct cache updates and refetching can also refresh affected
  views. Check query keys and page resets when filters or sorting change. Put
  contract fixes in their source or generator.
- For application pagination, read backend `Api/Applications/Catalog` and
  `CruiseApplicationsQueryableExtensions`. Check visibility before page limits,
  stable ordering on ties, and malformed or sort-incompatible cursors. Invalid
  cursors currently restart at page one; distinguish that fallback from values
  reaching throwing parsers, and evaluate it against any intended contract change.
- For date changes, trace `frontend/src/lib/dateUtils.ts` and its callers. Calendar
  dates must retain their entered day across timezones; timestamps represent
  instants. Exercise a negative UTC offset when checking date-only parsing.

## Cruise workflows and persistence

- For Form A changes, compare backend `Api/Applications/FormA/Validators.cs` with
  frontend form schemas for the specific save/submit action. Incomplete Form A
  drafts are valid only when they satisfy draft validation. For cruise transitions,
  trace `CruiseLifecycleRules` through the linked application state changes.
- For startup or seeding changes, inspect `ApplicationDbContextInitializer` against
  existing rows, partially seeded accounts and concurrent startup. Reference-data
  seeding runs independently of optional account seeding; preserve existing and
  inactive reference rows when repairing missing data.
- For email changes, read `docs/email-delivery.md` and verify the affected path in
  backend `Infrastructure/Email`. Check atomic business/outbox writes where required,
  protected payloads, retries, expiry and worker leases. A crash after SMTP accepts
  a message but before database acknowledgement can legitimately cause redelivery.
- For deployment changes, compare option bindings with Docker/Kubernetes settings,
  including SMTP validation and shared Data Protection keys used by the outbox.
  Keep credentials out of tracked settings/logs and tests on fake email delivery.

## TREX evidence

When TREX runs, use a targeted reproduction for the changed behavior on the reviewed
commit. Report the command, exit status and execution artifact for failures and
successful checks. In the summary, state what was skipped or blocked and why;
label conclusions from code inspection separately from runtime results.
