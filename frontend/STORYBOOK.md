# Storybook

Run these commands from `frontend/`:

| Command                        | Purpose                                               |
| ------------------------------ | ----------------------------------------------------- |
| `vp run storybook`             | Open the component workshop on port 6006              |
| `vp run test:storybook`        | Run all stories as Vitest browser tests               |
| `vp run test:storybook:visual` | Build and compare selected desktop/mobile screenshots |
| `vp run test:unit`             | Run unit tests without a browser                      |

CI runs all three test layers and the existing application Playwright suite. Install Chromium
with `vp exec playwright install --with-deps` before running browser tests locally.

## Writing useful stories

Keep CSF 3 (`Meta`, `StoryObj`, and `satisfies`). It remains supported; CSF Next is still a
preview feature. Put stories under the component's feature in `stories/`, with names describing
the actual state: empty, invalid, loading, disabled, open, mobile, or a meaningful boundary.
Import the production component or form integration instead of reimplementing its behavior.

Use `fn()` from `storybook/test` for callbacks. Add a `play` function when a behavior needs
protection: perform the action and assert its result, including callback values where relevant.
Prefer accessible roles and labels. Use `waitFor` for async rendering and closing transitions,
and scope portal queries to `canvasElement.ownerDocument.body` with `within`.

Controlled values need working state. `withControlledValue` supplies React state and forwards
callbacks. Changing the initial `value` in Controls resets that example. This works in both
the workshop and Vitest; Storybook args updates alone did not rerender the portable tests.

Modal stories use `docs.story.inline: false` so their portals stay inside each example's frame.
Use the viewport global for mobile examples, with the corresponding viewport options.

## Fixtures and providers

The story clock is fixed to **2026-01-15T12:00:00Z** through MockDate, without replacing timers.
Use fixed dates in module-level fixtures too, since those execute before `beforeEach`.
Visual tests use the Europe/Warsaw timezone and pl-PL locale.

The global `StoryRouterProvider` provides a stable memory-router context for isolated components.
It is not a substitute for application navigation tests. TanStack-specific helpers live under
`src/integrations/tanstack/`. `MockAuthQueryProvider` creates a fresh seeded query cache per mount
and disables background queries. Configure fetch spies in a story's `beforeEach`; examples must
not depend on a running backend. Use valid data URLs for file fixtures.

We evaluated `@storybook/tanstack-react@10.6.0`. Its object-form `interpolatePath` call fails
against this checkout's `@tanstack/router-core@1.171.32`, which expects positional arguments.
Keep `@storybook/react-vite` until a compatible framework release passes the router-dependent
stories. Do not downgrade the application's router to make the workshop run.

## Accessibility and visual review

The accessibility addon runs automated checks. Reviewed file-list, input-label, and valid/corrected form states use
`parameters.a11y.test: 'error'`, making violations fail CI. The remaining legacy catalog uses
`'todo'`, which shows findings in Storybook without claiming those components are accessible.
Promote a component to `'error'` once its states pass; do not disable rules to hide violations.
Keyboard interaction and focus assertions supplement the automated checks. Modal controls and
invalid-form contrast remain reported as `'todo'` pending separate application accessibility fixes.
This change does not include the header or accessibility QA fixes from #455/#456.

Selected screenshots live in `stories/visual/__screenshots__/`. After an intentional change,
run `vp run test:storybook:visual --update-snapshots`, inspect every changed image, then commit
the approved baselines. Screenshots use Arial (Liberation Sans on Linux). Generate and compare
baselines in the same Linux/browser environment; browser and font upgrades can change pixels.
Failures and traces go to `test-results/`, with application E2E artifacts in a separate subdirectory.

The unused AppPopover showcase was retired. Expand coverage where users interact with the app,
such as forms, tables, pickers, and session states, rather than adding redundant color examples.

## References

- [Vitest integration](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)
- [Interaction tests](https://storybook.js.org/docs/writing-tests/interaction-testing)
- [Accessibility tests](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [TanStack framework](https://storybook.js.org/docs/get-started/frameworks/tanstack-react)
- [CSF Next status](https://storybook.js.org/docs/api/csf/csf-next)
- [Vite+ testing configuration](https://viteplus.dev/guide/test)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
