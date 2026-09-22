# Frontend tests

Use unit tests for data validation and Playwright for behavior that needs a
browser. The browser suite mocks backend requests; it does not test deployment,
SQL Server, or SMTP.

## Run tests

Install dependencies with the [source setup](README.md#install-tools-and-dependencies).
Run these commands from `frontend/`:

| Command | Purpose |
| --- | --- |
| `vp run test:unit` | Run unit tests under `src/`. |
| `vp exec playwright install --with-deps chromium` | Install the browser before the first Playwright run. |
| `vp run test` | Run browser tests. |
| `vp run test:ui` | Open the Playwright test interface. |
| `vp run type` | Type check the application and tests. |

[playwright.config.ts](playwright.config.ts) starts a frontend on port 5174.
Outside CI it can reuse a server already on that port. If requests fail or tests
show unexpected code, check which process owns that port before stopping it.

[Vite configuration](vite.config.ts) limits unit tests to
`src/**/*.{test,spec}.{ts,tsx}` so Vitest does not load Playwright specs.
The Vitest package is an alias for Vite+'s test package; use `vp run test:unit`
rather than calling a standalone `vitest` executable.

## Schema tests

Form validation tests live in
[`src/routes/applications/$applicationId/-schemas/__tests__/`](src/routes/applications/$applicationId/-schemas/__tests__).
Login validation tests live in [`src/validation/__tests__/`](src/validation/__tests__).

Start with a valid payload, change the value under test, and assert the specific
error path. The existing `expectRejectedAt` helpers prevent an unrelated validation
error from making a test pass.

Use these tests for required fields, date ranges, duration limits, duplicate
entries, and rules that depend on several fields. Keep the rest of the payload
valid when testing a refinement. An invalid field type can prevent a later
refinement from running.

## Browser fixtures

[`tests/fixtures/fixtures.ts`](tests/fixtures/fixtures.ts) installs a fallback
handler that throws for unmatched requests to the configured API URL. Each test
must register the responses it needs. Use the shared fixtures so tests do not
depend on a running backend.

The form page objects register mock data and authentication state before opening
a form. Their `fillForm()` helper supplies API data and reloads the page; it does
not type into inputs. For example:

```ts
await formAPage.fillForm();
await formAPage.fillForm({ except: ['membersSection'] });
await formAPage.fillForm({ withInvalidRows: true });
```

The `except` option removes values from the mocked response. Use real browser
interactions when testing input clamping, conditional fields, adding rows,
checkbox dependencies, or file uploads.

### Read validation results

[`FormStateProbe`](src/components/shared/FormStateProbe.tsx) exposes form validity
and error paths in development. Test helpers read these values from
`data-valid` and `data-errors`.

The probe combines mounted field errors with form errors. Keep both sources:
array refinements can produce errors without a mounted field at that path.
Use complete paths such as `permissions[0].description` in assertions.

### Extend combined form tests

The form specs use combined valid and invalid submissions to check several
sections in one page visit. When adding a required section, update the relevant
section field map and the page object's invalid data. Use `test.step` and soft
assertions so a failure identifies the section without hiding other failures.

If a combined test cannot observe an expected error, check whether the UI
normalizes the value first or another invalid field prevents the refinement.
Test the underlying data rule in a schema test with an otherwise valid payload.

## Diagnose failures

| Symptom | Check |
| --- | --- |
| Connection refused or unexpected page on port 5174 | Check the running server and the Playwright web server output. Stop only the process you identified as obsolete. |
| `API call not mocked` | Add the expected response to the test fixture, or correct an unexpected request. |
| Locator timeouts under load | Try `vp run test --workers=1` and inspect the failing interaction. |
| Vitest attempts to load browser specs | Check the unit test include pattern in `vite.config.ts`. |
