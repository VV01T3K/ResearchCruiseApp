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
Two rules are enforced: `shadcn/no-unknown-classes` rejects classes that generate no Tailwind CSS, and
`shadcn/no-raw-colors` rejects Tailwind's built-in palette (`gray`, `slate`, `blue`, `red` and so on), so every
color comes from `src/styles/theme.css`. Neither checks class strings inside lookup objects such as the `sizes`
and `variants` maps, so review those by hand.

Colors in `src/styles/theme.css`:

| Token                                             | Use                                                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `surface`                                         | Cards, popups, outline buttons (white)                                                                  |
| `surface-muted`                                   | Page background, inputs, table bodies (`neutral-50`)                                                    |
| `surface-subtle`                                  | Hovered and highlighted rows, table headers, disabled controls (`neutral-100`)                          |
| `border`                                          | Input, table and card borders (`neutral-300`)                                                           |
| `border-muted`                                    | Dividers inside popups and toasts (`neutral-200`)                                                       |
| `foreground`                                      | Input values, labels and table text (`neutral-900`)                                                     |
| `muted-foreground`                                | Hints, placeholders and secondary text (`neutral-500`)                                                  |
| `inverse-foreground`                              | Text on filled `primary`, `danger`, `success` and `info` backgrounds (white)                            |
| `neutral-50` to `neutral-950`                     | Other greys; `neutral-950` is black, used for strong text and translucent tints like `bg-neutral-950/5` |
| `primary`, `success`, `danger`, `warning`, `info` | Brand and status colors, each with `-light`, `-dark` and `50` to `950` shades                           |

Prefer a role token over a `neutral` shade when one fits. Focus rings use `primary-500`.

`vp run lint:design` is an optional audit that also reports the arbitrary value, inline style, restyle and static
class rules as warnings. Those findings are policy questions, not bugs: Base UI CSS variables and calendar drag
positions are functional, and shared components intentionally accept a `className`. `no-restyle` allows layout
classes.

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
