# Frontend tests

Run commands from `frontend/` to use the pinned Vite+ version. From the repository root,
`bun run test` runs all three layers once.

| Command                 | Coverage                                                       |
| ----------------------- | -------------------------------------------------------------- |
| `vp run test`           | Unit, Storybook and application browser suites                 |
| `vp run test:unit`      | Node tests under `tests/unit`, with a negative-offset timezone |
| `vp run test:watch`     | Unit tests in watch mode                                       |
| `vp run test:storybook` | Stories, interactions and reviewed accessibility checks        |
| `vp run test:browser`   | Production journeys and retained application regressions       |
| `vp run test:ui`        | Playwright's interactive debugger                              |
| `vp run lint`           | Formatting, lint and TypeScript checks                         |

First-time browser setup: `vp exec playwright install --with-deps chromium`.
The unit command sets `TZ=America/Los_Angeles` on our Linux/macOS shells and Linux CI
so date-only parsing cannot silently shift calendar days. Set the same timezone when
running a focused date test or watch session.

## Unit tests

`tests/unit` mirrors production feature/integration paths. Tests exercise data rules,
serialization, CSV/XLSX imports, error handling, session coordination, and form lifecycle.
The auth tests replace HTTP fetch while running the real session and request code.
Fixture-schema guards validate authored test data against the committed generated schemas;
they do not contact a backend.

Use a valid starting payload and change the relevant input. For rejection, assert the
intended issue path or diagnostic. Keep a valid control where an unrelated invalid field
could otherwise make a test pass. Capture mutable request headers at call time.

## Storybook

`vp run storybook` opens the workshop. `vp run test:storybook` renders every story in Chromium
and runs its `play` function and accessibility checks. Stories cover isolated UI behavior;
routing, authentication, API contracts and full form workflows stay in the E2E suite.

- The clock is fixed to 2026-01-15T12:00:00Z with MockDate. Use fixed dates in module-level
  fixtures too, since they are created before `beforeEach` runs.
- Every story has a memory router (`withRouter`) for components that render links.
- `src/api/fetch.ts` is mocked globally, so stories never reach the backend.
  `MockAuthQueryProvider` seeds the current user with queries disabled.
- Controlled inputs use the `withControlledValue` decorator, because Storybook's `useArgs` does not
  rerender stories under Vitest.
- Modal stories set `docs.story.inline: false` so each portal stays in its own frame.
- Accessibility checks default to `todo` (reported, not failing). Stories that pass set
  `parameters.a11y.test: 'error'`; promote more as components are fixed.
- `@storybook/tanstack-react@10.6.0` is incompatible with our `@tanstack/router-core`, so stories
  use `@storybook/react-vite`.

## Application browser tests

The Playwright projects have disjoint discovery:

- `journeys` runs `tests/browser` against a fresh production build in `dist-test`, served
  at `http://127.0.0.1:4173`. Tests use compact data factories, explicit HTTP handlers,
  accessible locators and visible state/payload assertions. Unexpected network requests
  and uncaught browser errors fail the test.
- `regressions` runs retained root `tests/*.spec.ts` against the dev server on port 5174.
  These include unsaved-edit protection, application layout, role changes, and form-row
  workflows. Some still depend on the development-only form-state probe. Keep this
  project until those assertions and their fixtures have been migrated; narrowing all
  discovery to `tests/browser` would silently delete coverage.

Both servers use same-origin `/api` mocks, own their ports, and refuse to reuse an
existing server. Browser security stays enabled. Four local workers and two CI workers
run with no retries. Retained regression cases have a longer timeout for their combined
form workflows. Traces and screenshots are saved on failures under
`test-results/application`; the HTML report is in `playwright-report`.

Examples:

```sh
vp run test:browser --project journeys
vp run test:browser --project regressions --grep 'unsaved'
vp test run --project unit tests/unit/integrations/auth/session.test.ts
```

The rewritten journeys replace the retired confirmation, supervisor-decision and health
specs, plus duplicate login/recovery/session/import cases. Remaining older form and table
coverage needs individual comparison before deletion. Do not add schema permutations to
browser journeys or duplicate isolated Storybook interactions there. Application routing,
API payloads, real cross-tab events and complete save flows belong in the browser layer.

All application HTTP responses are mocked. These tests do not establish backend authorization,
cookie attributes, persistence or deployment CORS behavior.

## CI

The formatting workflow runs the unit project. The browser workflow runs Storybook and
Playwright separately, once each; it does not call the aggregate `test` command. The
Storybook project and its global API mock remain isolated from Node and application tests.
There is no screenshot-baseline suite or `test:storybook:visual` command in the merged setup.
