# ResearchCruiseApp review guidance

This repository manages research cruises on Oceanograf. The frontend uses React,
TanStack Router/Query/Form and an Orval-generated API client. The backend uses
ASP.NET Core, Entity Framework Core and SQL Server.

Apply the checks below when the changed behavior touches that area. Report defects
introduced or exposed by the change, with a triggering input or user action and
the resulting failure. Trace callers and existing safeguards before commenting;
report a shared root cause once. Check older knowledge-base and permission docs
against the current code and PR intent. Existing code is context, not proof that
a behavior is correct. Avoid formatting comments and speculative refactors.
When suggesting a regression test, name the failing scenario; do not request
tests solely because a file changed.

## Authorization and sessions

- Check backend authorization for both roles and resource ownership. A hidden UI
  control or authenticated route does not authorize an API operation. Check list,
  detail, export and write paths when access rules change, including filtering
  before pagination.
- Compare `RolePermissionRules`, endpoint checks and frontend permission helpers
  when reviewing role changes. Trace users with multiple roles and assigned cruise
  managers or deputies; do not assume the frontend helper matches server policy.
- For authentication changes, trace `frontend/src/api/client/auth-session.ts` and
  `custom-fetch.ts` together with backend session endpoints. Check refresh retries,
  concurrent refreshes and whether an in-flight response can restore a logged-out
  session. The refresh token is an HttpOnly cookie; access tokens live in memory.
  A refresh conflict can return 409 and wait for a session from another tab.
  Distinguish that path and transient network failures from a terminal 401.

## API and frontend behavior

- Trace contract changes from backend requests/responses and the checked-in OpenAPI
  spec through `frontend/orval.config.ts` to frontend callers. Check nullability,
  enum values, status codes, pagination parameters and error handling. Suggest
  fixes to the contract or generator rather than hand-editing generated output.
- Check that affected TanStack Query views update after mutations, through cache
  updates, invalidation or refetching. Orval already generates some invalidations;
  inspect its configuration before requesting duplicate calls. Check query keys
  and pagination resets when filters or sorting change.
- For application pagination, inspect backend `Api/Applications/Catalog` and
  `CruiseApplicationsQueryableExtensions`. Check visibility filtering before page
  limits, stable ordering for equal sort values, and safe handling of malformed or
  sort-incompatible cursors. The current endpoint ignores invalid cursors and
  starts from the first page; do not require a new error response without a contract
  change. Flag paths that let invalid values reach throwing parsers.
- Distinguish calendar dates from timestamps. Check date-only values for timezone
  shifts and use the existing date utilities as context.

## Cruise workflows and persistence

- Trace cruise and application transitions together. Form A drafts intentionally
  allow incomplete data but still have draft validation. Compare backend validators
  with frontend form schemas for the specific save/submit action. Check linked
  application states when a cruise is confirmed, completed or reverted.
- Review EF migrations for data loss and compatibility with existing rows. Check
  transaction boundaries when an operation changes multiple related records.
- Startup migrations and reference-data seeding are separate from optional account
  seeding. Check idempotence, concurrent replicas and preservation of existing or
  inactive reference rows. Account repair must tolerate partially seeded accounts.
- Keep deployment configuration consistent with backend option names and defaults.
  Check changes for exposed credentials, tokens in logs and accidental real email
  delivery in tests.
- For notification changes, inspect `Infrastructure/Email`: `EmailSender` queues
  protected payloads and a worker delivers them later. Check that business changes
  and enqueueing commit together where required, and that retry, expiry and lease
  handling remain safe across workers. Delivery can repeat after a crash between
  SMTP acceptance and database acknowledgement; do not assume exactly-once delivery.
