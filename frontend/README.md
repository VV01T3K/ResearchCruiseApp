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

From the workspace root:

- `pnpm --filter frontend lint:design` loads the plugin and any rules configured in `.oxlintrc.design.json`.
- `pnpm --filter frontend lint:design:audit` runs all six design rules as warnings for assessment.

From this directory, use `vp run lint:design` or `vp run lint:design:audit`.
The existing `vp check` remains unchanged. No design rules are enabled in the base configuration;
add chosen rules to its `rules` object when ready to enforce them. The audit configuration is separate
and does not run in CI or change the existing lint policy.

`@shadcn/lint` requires Oxlint 1.80 or later; Vite Plus 0.1.16 bundles 1.58.
These scripts invoke the direct Oxlint dependency explicitly because Vite Plus also provides an `oxlint` binary.
This keeps the existing build and lint toolchain intact. The direct Oxlint optional type checking peer is
unused here; Vite Plus continues to own type checking.

Component recognition uses `@/components/shared`; the plugin discovers `src/styles/index.css`
and follows its import of `theme.css`. Generated source is excluded.

See the [project assessment](../docs/design-system-assessment.md),
[available rules](https://github.com/shadcn-ui/lint/blob/main/docs/rules.md), and
[configuration examples](https://github.com/shadcn-ui/lint#settings).

## Tests

- Unit tests (validation schemas, no browser): `vp run test:unit`
- End-to-end tests (Playwright): `vp run test`
- Install browsers (first time / CI): `vp dlx playwright install --with-deps`

See [TESTING.md](./TESTING.md) for what each layer covers and how to add tests.
