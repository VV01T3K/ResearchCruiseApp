# Frontend tests

| Layer     | What it proves                                          | Runner                  | Location         |
| --------- | ------------------------------------------------------- | ----------------------- | ---------------- |
| Unit      | Schemas, parsers, error mapping, session and API client | Vitest                  | `tests/unit/`    |
| Storybook | Shared components render, interact and pass axe checks  | Vitest + Storybook      | `stories/`       |
| Browser   | What a user sees across routes, HTTP and browser tabs   | Playwright (production) | `tests/browser/` |

## Commands

| Command                 | Runs                                   |
| ----------------------- | -------------------------------------- |
| `vp run test`           | All three layers                       |
| `vp run test:unit`      | Unit tests, about a second             |
| `vp run test:storybook` | Every story in Chromium                |
| `vp run test:browser`   | Builds the app once, then the journeys |
| `vp run test:ui`        | Playwright's interactive runner        |

First-time browser setup: `vp exec playwright install --with-deps chromium`.

## Choosing a layer

1. **A rule about data**: a schema, parser or mapping. Write a unit test. Form rules go in
   `forms.test.ts`, and required row fields in the table in `rows.test.ts`.
2. **One shared component on its own**: add a story, with a `play` function only if it has
   behaviour worth asserting.
3. **Anything that needs the app**: routing, requests, unsaved-edit prompts, several tabs,
   file inputs inside a form. Add or extend a journey in `tests/browser/`.

Do not test the same rule in two layers. A journey shows that a form wires its schema and its
request correctly; the schema's cases belong in the unit tests.

## Writing browser journeys

```ts
import { getUpdateApplicationFormAMockHandler } from '@/api/generated/mocks/applications/applications.msw.gen';
import { test, expect, applicationForms, fail } from './fixtures';

test.use({ account: admin });

test('a failed save can be retried', async ({ page, network, requests }) => {
  network.use(
    ...applicationForms(),
    getUpdateApplicationFormAMockHandler(fail(503), { once: true }),
    getUpdateApplicationFormAMockHandler()
  );
  // ...act like a user...
  expect(requests.bodies(`PUT /v2/applications/${applicationId}/form-a`)).toHaveLength(2);
});
```

- Respond with the handlers Orval generates from the OpenAPI spec into `src/api/generated/mocks/`
  (`vp run gen`). Pass the response, or `fail(status, problem)` for an error. `{ once: true }`
  answers one request, so a sequence reads top to bottom. In one `network.use()` call the first
  matching handler wins, and a later call takes precedence over an earlier one.
- Check what the app sent with `requests.bodies(route)` and `requests.queries(route)` after the
  user's action, not inside handlers.
- Choose the signed-in user with `test.use({ account })`; without one, the session refresh returns 401. The fixture fails a test on any API request without a handler and on any uncaught page
  error.
- Build responses from `tests/data/`. `fixtures.test.ts` checks them against the generated API
  schemas, so they stay valid when the API changes.
- Assert what a user can observe and what the app sends. Do not assert internal state.
- Prefer roles, labels and visible text. Use a `data-testid` only for a section or control that
  has no accessible name yet.
- Control time with `page.clock` instead of waiting.

The suite runs against `vp build --mode test` served by `vp preview` on a port the system picks,
so suites in different worktrees can run at the same time. CI runs one worker; locally Playwright
uses a quarter of the CPUs it may use.

Unit and browser tests both run in `Europe/Warsaw`, the users' timezone.

## Storybook

`vp run storybook` opens the workshop.

- The clock is fixed to 2026-01-15T12:00:00Z with MockDate. Use fixed dates in module-level
  fixtures too, since they are created before `beforeEach` runs.
- Every story has a memory router (`withRouter`) for components that render links.
- `src/api/fetch.ts` is mocked globally, so stories never reach the backend.
  `MockAuthQueryProvider` seeds the current user with queries disabled.
- Controlled inputs use the `withControlledValue` decorator, because Storybook's `useArgs` does not
  rerender stories under Vitest.
- Modal stories set `docs.story.inline: false` so each portal stays in its own frame.
- Accessibility checks default to `todo` (reported, not failing). Stories that pass set
  `parameters.a11y.test: 'error'`.
- `@storybook/tanstack-react@10.6.0` is incompatible with our `@tanstack/router-core`, so stories
  use `@storybook/react-vite`.

`vitest` and `@vitest/browser-playwright` are pinned to the Vitest version Vite+ bundles. Run tests
through `vp test`, and import test APIs from `vite-plus/test`.
