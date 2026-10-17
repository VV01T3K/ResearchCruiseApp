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

## Tests

- All layers: `vp run test`
- Unit tests (no browser): `vp run test:unit`
- Storybook component and accessibility tests: `vp run test:storybook`
- Browser journeys (Playwright): `vp run test:browser`
- Install the browser (first time): `vp exec playwright install --with-deps chromium`

See [TESTING.md](./TESTING.md) for what each layer covers and how to add tests.
