# ResearchCruiseApp review guidance

This repository manages research cruises on Oceanograf. The frontend uses React,
TanStack Router/Query/Form and an Orval-generated API client. The backend uses
ASP.NET Core, Entity Framework Core and SQL Server.

Report actionable defects introduced by the change. Explain the triggering input
or user action and the resulting failure. Trace callers, permission checks and
existing tests before reporting a missing safeguard. Use the current code and PR
intent to check older knowledge-base or permission documentation. Avoid formatting
comments, speculative refactors and requests for tests without a concrete missing
behavior; CI already checks formatting, builds and generated API consistency.

## Authorization and sessions

- Check backend authorization for both roles and resource ownership. A hidden UI
  control or authenticated route does not authorize an API operation. Check list,
  detail, export and write paths when access rules change, including filtering
  before pagination.
- Follow `RolePermissionRules` and the endpoint checks when reviewing role changes.
  Compare backend roles with frontend permission helpers, including users with
  multiple roles and assigned cruise managers or deputies.
- For authentication changes, trace `frontend/src/api/client/auth-session.ts` and
  `custom-fetch.ts` together with backend session endpoints. Check refresh retries,
  concurrent refreshes and whether an in-flight response can restore a logged-out
  session. Keep tokens and personal data out of logs and telemetry.

## API and frontend behavior

- Trace contract changes from backend requests/responses and the checked-in OpenAPI
  spec through `frontend/orval.config.ts` to frontend callers. Check nullability,
  enum values, status codes, pagination parameters and error handling. Suggest
  fixes to the contract or generator rather than hand-editing generated output.
- Check that mutations invalidate affected TanStack Query data, including both
  detail and list views where needed. Check query keys when filters or sorting
  change, and preserve backend validation errors in form feedback.
- Distinguish calendar dates from timestamps. Check date-only values for timezone
  shifts and use the existing date utilities as context.

## Cruise workflows and persistence

- Trace cruise and application transitions together. Form A drafts intentionally
  allow incomplete data; submission and later Form B/C stages have different
  validation requirements. Check manager/deputy access and linked application
  states when a cruise is confirmed, completed or reverted.
- Review EF migrations for data loss and compatibility with existing rows. Check
  transaction boundaries when an operation changes multiple related records.
- Startup migrations and reference-data seeding are separate from optional account
  seeding. Check idempotence, concurrent replicas and preservation of existing or
  inactive reference rows. Account repair must tolerate partially seeded accounts.
- Keep deployment configuration consistent with backend option names and defaults.
  Check changes for exposed credentials and accidental real email delivery in tests.
