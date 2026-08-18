# Frontend tests

Two layers, split by what they can actually prove:

| Layer                     | Runner             | Location            | Count | Time   |
| ------------------------- | ------------------ | ------------------- | ----- | ------ |
| Unit (validation schemas) | Vitest (`vp test`) | `src/**/__tests__/` | 172   | ~0.5 s |
| End-to-end (browser)      | Playwright         | `tests/`            | 44    | ~2 min |

## Commands

| Command          | What it runs                                  |
| ---------------- | --------------------------------------------- |
| `pnpm test:unit` | All Vitest unit tests (no browser)            |
| `pnpm test`      | All Playwright E2E tests                      |
| `pnpm test:ui`   | Playwright's interactive debugger             |
| `pnpm type`      | `tsgo` — type-checks tests along with the app |

First-time browser setup: `vp dlx playwright install --with-deps`.

---

## The split: what belongs where

Validation in this app is pure Zod. Given a payload, the schema returns a verdict — no DOM,
no rendering, no event handling. Those cases belong in unit tests, where 172 of them run in
half a second instead of costing a page load each.

A test earns its place in the browser only if it needs one:

- **Browser-native behaviour** — `<input type="number" max>` clamping a typed value.
- **Conditional rendering** — a field that only mounts once a dropdown is set.
- **Dynamic rows** — a dropdown or button that appends an entry to a TanStack array field.
- **File uploads** — scan and attachment inputs.
- **Cross-field UI rules** — checkboxes that enable, disable, or reset each other.

Everything else (required fields, numeric ranges, negative values, length limits, cross-field
rules, list minimums) is covered at the schema level.

---

## Unit tests — validation schemas

`src/routes/applications/$applicationId/-schemas/__tests__/`

| File                   | Tests | Schema under test                      |
| ---------------------- | ----- | -------------------------------------- |
| `formA.schema.test.ts` | 77    | `getFormAValidationSchema(initValues)` |
| `formB.schema.test.ts` | 52    | `getFormBValidationSchema()`           |
| `formC.schema.test.ts` | 40    | `getFormCValidationSchema(initValues)` |

`src/validation/__tests__/loginValidation.test.ts` — 3 tests for `loginValidationSchema`.

### How they are written

Each file follows the same shape:

- **`validRows`** — one valid fixture per row type (permission, contract, publication, …),
  typed with `satisfies` against its DTO so the fixture cannot drift from the real type.
- **`validPayload(overrides)`** — a complete, passing payload. Every test starts here and
  changes exactly one thing, so a failure identifies its own cause.
- **`override(row, field, value)`** — copies a row with one field replaced. Contains the one
  unavoidable computed-key cast so it does not spread through the file.
- **`expectAccepted(payload)`** — asserts the payload passes; on failure prints every Zod
  issue as `path: message`.
- **`expectRejectedAt(payload, path)`** — asserts the payload fails _and_ that an issue points
  at `path`. Without the second half, an unrelated error would let a broken test pass.

### What is covered

**Form A** — email formats; `cruiseHours` bounds (`-100`, `-1`, `0`, `abc`, `''`, `1441`
rejected; `1`, `720`, `1440` accepted); ship usage and its conditional `differentUsage`;
cruise goal and its conditional description; manager ≠ deputy; required vs optional sections;
UG teams (negative counts, zero total, duplicate units); guest teams; permissions; contracts;
publications (including negative ministerial points); SPUB tasks; research tasks; research
areas; cruise periods (optimal inside acceptable, period long enough for the cruise, precise
start/end ordering); year.

**Form B** — `isCruiseManagerPresent`; UG teams; guest teams; permissions (scan required and
must be `.pdf`); crew members (all eight fields); short, long and research equipment; ports;
cruise day details (including the 1024-character comment limit).

**Form C** — ship usage; required sections; research task effects (an unfinished task cannot
have its conditions met); collected samples (amount must be positive); contracts; the
10240-character limits on `spubReportData` and `additionalDescription`; research areas.

---

## E2E tests — Playwright

`tests/` — `formA.spec.ts` (11), `formB.spec.ts` (8), `formC.spec.ts` (14),
`login.spec.ts` (3), `session.spec.ts` (5), `server-health-message.spec.ts` (3).

### Fixtures and how a form is loaded

`tests/fixtures/fixtures.ts` defines the Playwright fixtures:

- **`forEachTest`** (`auto: true`) — runs for every test. Installs a catch-all route that
  **throws on any un-mocked API call**, so tests can never reach a real backend.
- **`formAPage` / `formBPage` / `formCPage`** (`auto: false`) — constructed only when a test
  names it. `FormXPage.create(page)` registers API mocks, writes `authDetails` into
  localStorage to fake login, then navigates to the form.

Each test gets a fresh browser context, so nothing leaks between tests and the suite is safe
to run in parallel.

**`fillForm()` does not type into the UI.** It builds a payload, serves it from the mocked
`GET .../formX` endpoint, and reloads the page. TanStack Form seeds itself from that response,
so the whole form materialises in one shot:

```ts
await formAPage.fillForm(); // fully valid
await formAPage.fillForm({ except: ['membersSection'] }); // that section blanked in the payload
await formAPage.fillForm({ withInvalidRows: true }); // every list section gets a bad row
```

`except` does not mean "skip filling in the UI" — it blanks those fields in the JSON before
serving it. Real typing happens only in tests that are specifically exercising the UI.

### Reading validation state instead of error messages

`FormStateProbe` (`src/components/shared/FormStateProbe.tsx`) is rendered by all three form
views. It publishes TanStack Form's validation state to the DOM:

```html
<span data-testid="form-state" data-valid="false" data-errors='{"ugTeams":["…"]}' />
```

`getInvalidFormState()` waits for `data-valid="false"` and returns the parsed error map,
keyed by field path (`permissions[0].description` for rows, `ugTeams` for array-level rules).

The probe merges **two** sources: `fieldMeta` and the form-level `errorMap`. Errors whose path
has no mounted `form.Field` — array-level refinements such as `ugTeams.refine(...)` — only
ever reach the latter, so reading `fieldMeta` alone silently drops them.

### The two combined tests

Each form spec opens with a pair that replaces what used to be one navigation per section:

- **`all sections valid`** — loads a valid payload and submits successfully.
- **`all sections filled with invalid rows`** (and, for Form A, `all required sections
missing`) — loads one bad row into every list section, submits **once**, and checks the
  resulting error map.

Verdicts are reported per section:

```ts
for (const [section, fields] of Object.entries(sectionFields)) {
  await test.step(section, () => {
    for (const field of fields) {
      expect.soft(hasError(errors, field), `${section}: expected an error on "${field}"…`).toBe(true);
    }
  });
}
```

`expect.soft` is what makes this work: it does not abort on the first failure, so every
section is still evaluated. A single broken section is reported by name while the others are
shown to have behaved correctly — the diagnosability of per-section tests, at the cost of one
page load. Failure messages include the full list of reported keys.

### What stays in the browser

**Form A** — number-input clamping (61 → 60, 1441 → 1440); the alternative ship usage field
appearing when "w inny sposób" is chosen; the cruise goal description field; adding rows via
dropdowns and buttons.

**Form B** — permission scan upload; duplicate-faculty detection and clearing on row delete;
adding guest team, crew permission, equipment, action, port, cruise day and research equipment
rows.

**Form C** — the same row-adding paths plus condition checkboxes enabling only after a task is
marked done, collected sample rows, the length-limit errors as they appear while typing, and
attachment upload.

---

## Configuration notes

**Vitest is scoped to `src/`** (`vite.config.ts`):

```ts
test: {
  include: ['src/**/*.{test,spec}.{ts,tsx}'];
}
```

Without this the default glob also matches `tests/*.spec.ts` and Vitest tries to load the
Playwright specs, failing with _"Playwright Test did not expect test() to be called here."_

**The `vitest` dependency is aliased** to `@voidzero-dev/vite-plus-test`. It ships no `bin`,
so `vitest run` cannot resolve — the working invocation is `vp test run`. The package is still
required for `import { describe, expect, it } from 'vitest'` to type-check.

**Playwright timeouts** (`playwright.config.ts`) are raised above the defaults because several
workers warming up at once can starve the browsers; the 30 s default produced locator timeouts
unrelated to what the tests assert. Workers are capped at a quarter of the core count for the
same reason.

### Troubleshooting

| Symptom                                        | Cause                                                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Every test fails with `ERR_CONNECTION_REFUSED` | An orphaned dev server holds port 5174. `reuseExistingServer` attaches to it. Find it with `ss -ltnp \| grep 5174` and kill it. |
| Scattered `locator.*: Test timeout` failures   | CPU contention from too many workers. Lower `--workers`.                                                                        |
| `Cannot find package '@/validation/auth'`      | `src/validation/auth.ts` is missing or untracked.                                                                               |

---

## Adding tests

Ask what the case actually needs:

1. **Is it a rule about data?** Add it to the matching `*.schema.test.ts`. Start from
   `validPayload()`, change one field, use `expectRejectedAt` with the field path.
2. **Does it need the browser?** Add it to the spec, and prefer extending an existing
   `describe` over adding a new one — each new block costs another page load.
3. **Is it a new required section?** Add the section and its fields to
   `INVALID_ROW_SECTION_FIELDS` (and `REQUIRED_SECTION_FIELDS` in `formA.spec.ts`), and give
   it an invalid row in `applyInvalidRows()` in the page object. It is then covered by the
   combined test at no extra runtime cost.

One caveat when choosing an invalid fixture: some states are unreachable because the UI
normalises them. `ResearchTasksEffectsSection` resets the condition flags during render, so
"unfinished task with conditions met" cannot be tested through the browser — it is a unit test
instead. If a combined test reports a missing error, check whether the component is correcting
the value before validation runs.
