# OpenAPI Frontend Client Migration Plan

Created 2026-07-11 for `t3code/openapi-query-zod`, based on
`origin/feature/backend-v2-rewrite` at `90891b91`.

## Goal

Use the backend v2 OpenAPI document to generate frontend API types, TanStack
Query hooks, and Zod schemas. Remove Axios without changing the current token
storage, refresh behavior, or form UX.

## Smallest Design That Covers the Goal

- Add one pinned dependency: Orval.
- Generate into `frontend/src/api/generated/`; never edit that directory.
- Keep one handwritten native Fetch function for base URL, bearer token,
  single-flight refresh, one retry after a 401, and non-2xx errors.
- Use generated hooks and types directly. Keep a handwritten feature hook only
  when it adds cache invalidation or UI mapping.
- Keep existing handwritten form Zod schemas for localized messages and
  cross-field rules.
- At form submission, map valid form values to the generated request type and
  run the generated request schema as a final contract check.

There is no generic form/schema abstraction. The two layers are intentionally
separate:

```text
form values
  -> handwritten UX schema
  -> request mapper
  -> generated API schema
  -> generated mutation
  -> authenticated Fetch
```

If the generated API check fails, do not send the request. Capture the Zod error
in Sentry without values or tokens and show one generic "the form could not be
sent" message. Backend `ProblemDetails` remains a separate, user-visible error
path.

## Step 1 — Prove It on One Slice

Start with one small authenticated JSON feature; do not audit or migrate the
whole API first.

1. Save the existing `/openapi/v2.json` document and run Orval against it.
2. Configure only TanStack Query v5, native Fetch, Zod 4, and generated query
   keys/hooks. Do not add a post-generation rewriting script.
3. Adapt the useful native Fetch/auth code from
   `origin/feat/native_openapi_with_scalar_ui` to the current
   `/v2/auth/refresh` route and current source layout.
4. Replace one handwritten query and one mutation.
5. Add one small transport test covering concurrent 401s, one refresh, one
   retry, and logout after refresh failure.
6. Add one malformed-request check proving the generated Zod fallback blocks a
   form submission and reports a redacted error.

Orval warns that custom Fetch mutators may bypass its automatic response
validation. Inspect the generated output during this step. If response parsing
works through a supported option, enable it. If not, keep generated response
types and request validation, and defer runtime response parsing. Do not build a
custom code transformer just to claim that every response is parsed.

**Done when:** generation and frontend type-check pass, the migrated calls use no
Axios, auth behavior still works, and the two validation layers are visible in
one real form.

## Step 2 — Migrate Existing API Files

Move one existing `frontend/src/api/<feature>` folder at a time:

1. replace handwritten calls and contract types with generated imports;
2. preserve only feature-specific invalidation, mapping, and error messages;
3. add the generated request-schema fallback to forms in that feature;
4. delete the replaced hooks and types immediately;
5. run the feature's existing focused tests.

Suggested order: read-only queries, account/auth, users/publications, cruises,
then applications and Forms A–C. Change the order if dependencies make another
slice easier.

Do not introduce adapters for shapes the UI already accepts. Add an explicit
mapper only where form values really differ from the API request.

## Step 3 — Delete Axios

After the last caller moves:

- delete the Axios client and interceptor;
- replace remaining `axios.isAxiosError` checks with the Fetch transport's small
  `ApiError` status/body checks;
- remove Axios and obsolete handwritten API contracts from the package and
  lockfile;
- run frontend checks and the existing session, form, cruise, publication, and
  user-management browser suites.

Token storage and `UserContext` stay as they are unless a failing migration test
shows a required change.

## Step 4 — Add Only the Useful Guardrail

Once generation is stable, add one `api:generate` command that refreshes the v2
spec and generated frontend output. Commit both artifacts. CI runs that command
and fails if it creates a diff.

No additional lint plugin, generated-export postprocessor, schema registry,
telemetry wrapper, or client abstraction is planned. Add one only after a real
repeated problem appears.

## Stale Work Worth Reusing

`origin/feat/native_openapi_with_scalar_ui` already tested Orval 8, tags-split
output, Zod generation, response decoding, and single-flight token refresh. Use
those findings, but do not cherry-pick the old v1 routes, ignored generated
output, disabled response validation, or post-generation export-rewriting
script.

The old frontend/form refactor branches mix this concern with a large source
reorganization. They are references only; this branch does not include that
reorganization.

## Not Part of This Work

- moving tokens to cookies;
- redesigning auth or `UserContext`;
- replacing TanStack Query, TanStack Form, or existing form schemas;
- generating localized form messages from OpenAPI;
- validating every response through custom generated-code rewriting;
- reorganizing the frontend.

