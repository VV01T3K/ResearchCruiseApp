# ResearchCruiseApp - frontend

## Development

- Install dependencies: `vp install`
- Setup database: `vp run seed`
- Start dev server: `vp run dev`
- Regenerate the API client after backend contract changes: `vp run gen`
- Production build: `vp run build`

The backend build writes the checked-in OpenAPI document to
`backend/ResearchCruiseApp/openapi/ResearchCruiseApp_v2.json`. Orval generates the fetch client,
TanStack Query hooks, and Zod schemas under `src/api/generated`; commit both outputs.

## Design system lint

`@shadcn/lint` runs inside `vp check` as an Oxlint JS plugin configured in `vite.tool.config.ts`.
Only `shadcn/no-unknown-classes` is enforced: it rejects classes that generate no Tailwind CSS.
It does not check class strings inside lookup objects such as the `sizes` and `variants` maps,
so review those by hand.

`vp run lint:design` is an optional audit that reports all six
[rules](https://github.com/shadcn-ui/lint/blob/main/docs/rules.md) as warnings. Its color, arbitrary
value, inline style and restyle findings are policy questions, not bugs: neutral surface, border and muted
text colors have no theme tokens yet, Base UI CSS variables and calendar drag positions are functional, and
shared components intentionally accept a `className`. `no-restyle` allows layout classes.

Component discovery uses the `@/components/shared` setting, and the plugin reads `src/styles/index.css` and
its `theme.css` import. Update that setting when shared components move or are renamed, then compare the
audit's finding counts before and after.

## Tests

- All layers: `vp run test`
- Unit tests (no browser): `vp run test:unit`
- Storybook component and accessibility tests: `vp run test:storybook`
- Browser journeys (Playwright): `vp run test:browser`
- Install the browser (first time): `vp exec playwright install --with-deps chromium`

See [TESTING.md](./TESTING.md) for what each layer covers and how to add tests.
