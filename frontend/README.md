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

- Unit tests (validation schemas, no browser): `vp run test:unit`
- Storybook component and accessibility tests: `vp run test:storybook`
- Storybook desktop/mobile visual tests: `vp run test:storybook:visual`
- End-to-end tests (Playwright): `vp run test`
- Install browsers (first time / CI): `vp dlx playwright install --with-deps`

See [TESTING.md](./TESTING.md) for what each layer covers and how to add tests.

Run `vp run storybook` for the component workshop. See [STORYBOOK.md](./STORYBOOK.md)
for story conventions, mocking, and screenshot review.
