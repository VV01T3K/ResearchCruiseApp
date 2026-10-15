# Storybook

Run these commands from `frontend/`:

| Command                 | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `vp run storybook`      | Open the component workshop on port 6006 |
| `vp run test:storybook` | Run all stories as Vitest browser tests  |

`test:storybook` renders every story in Chromium, runs its `play` function, and runs the
accessibility checks. It needs the Playwright browsers (`vp exec playwright install --with-deps`).

## Writing stories

Put stories under the component's feature in `stories/`, named after the state they show: empty,
invalid, loading, disabled, open, or a meaningful boundary. Import the production component or
form integration instead of reimplementing its behavior.

Use `fn()` from `storybook/test` for callbacks. Add a `play` function when a behavior needs
protection: perform the action and assert its result. Prefer accessible roles and labels, use
`waitFor` for async rendering and closing transitions, and query portals through
`within(canvasElement.ownerDocument.body)`.

Controlled inputs use the `withControlledValue` decorator, which holds the value in React state
and forwards `onChange`. Storybook's `useArgs` does not rerender stories under Vitest.

Modal stories set `docs.story.inline: false` so each portal stays inside its own frame.

## Fixtures and providers

- The clock is fixed to **2026-01-15T12:00:00Z** with MockDate. Use fixed dates in module-level
  fixtures too, since they are created before `beforeEach` runs.
- Every story is wrapped in `StoryRouterProvider`, a memory router for components that render
  links. It does not replace application navigation tests.
- `MockAuthQueryProvider` seeds the current user into a fresh query client with queries disabled.
- `customFetch` is spied on globally. Mock it in a story's `beforeEach`; stories must not need a
  running backend.
- Use valid data URLs for file fixtures.

The project uses `@storybook/react-vite` because `@storybook/tanstack-react@10.6.0` is
incompatible with our `@tanstack/router-core`.

## Accessibility

The default is `parameters.a11y.test: 'todo'`, which reports violations in Storybook without
failing tests. Stories that pass set `'error'` so regressions fail CI. Promote more as components
are fixed rather than disabling rules.
