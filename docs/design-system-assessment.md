# Design system assessment

The frontend is a good fit for `@shadcn/lint`: it uses Tailwind 4.2.2, a shared
`App*` component library, and explicit theme colors. The most useful first check
is class validity. Broad styling restrictions need component contracts and
exceptions before they can become a useful enforcement policy.

## Scope and reproduction

This is a source assessment of the frontend design system, not a visual,
accessibility, security, or backend review. No UI source was changed.

Run `pnpm --filter frontend lint:design:audit` from the workspace root.
The audit uses `@shadcn/lint` 0.2.0 and Oxlint 1.85.0, enables all six rules as
warnings, and allows layout classes under `no-restyle`. It includes shared
component implementations and stories, with generated source excluded.
The base `lint:design` command registers the plugin but enables no rules.

After rebasing onto staging commit `373812c6`, the audit scanned 324 files and
reported 467 warnings across 75 files. These are policy findings, not 467
confirmed bugs; rules can flag the same usage.

| Rule | Findings |
| --- | ---: |
| `no-restyle` | 208 |
| `no-raw-colors` | 170 |
| `no-arbitrary-values` | 45 |
| `no-inline-styles` | 37 |
| `no-unknown-classes` | 6 |
| `require-static-classes` | 1 |

## Findings and priorities

1. **Fix invalid classes first.** `GridCard.tsx:30` and `:65` use `text-md`,
   which produces no CSS with this theme. Use the intended font size, likely
   `text-base`. `AppNumberInput.tsx:152` uses `transform:scale-105`, an unknown
   variant; decide whether the intended effect is `scale-105` or
   `focus:scale-105`. The remaining unknown classes are `title` in
   `routes/account-settings/index.tsx:27` and `bi` / `bi-arrow-left-circle` in
   `AppPreviousPageButton.tsx:15`. No definitions or Bootstrap icon font CSS
   imports were found in the frontend source. The latter SVG has its own paths,
   so these class warnings do not imply a missing icon.

2. **Fill gaps in theme semantics before banning palette colors.** The theme
   declares primary, success, danger, warning, and info colors but no neutral
   surface, border, or muted text roles. Many of the 170 color findings are gray
   utilities used for those roles. `AppPopover.tsx:27` also uses raw blue focus
   colors despite existing primary tokens. `AppPreviousPageButton.tsx:24`
   hardcodes `#0041d2`, exactly the primary color. Prefer tokens where the role
   is known; adding neutral tokens requires an intentional design decision.

3. **Define component contracts before enabling `no-restyle`.** Pages frequently
   supply button gaps, padding, and link typography. For example,
   `details/actions/AcceptButton.tsx:11` adds `gap-4` to `AppButton`.
   The plugin correctly discovers the button's sizes and variants, but a
   layout-only policy conflicts with current usage. Decide whether icon gaps
   belong in `AppButton` and which styles callers may change. Shared component
   implementations also compose other shared components, contributing to the
   count. Evaluate their allowances separately from page usage.

4. **Keep runtime layout exceptions.** `AppCalendar.tsx:510-524` calculates drag
   overlay offsets, widths, and gaps. Those inline styles are functional.
   Popovers use Base UI variables such as `--anchor-width` and
   `--transform-origin`; the arbitrary-value rule flags their bracket syntax.
   Do not mechanically replace these with fixed scale values. The single
   static-class finding is class forwarding from `AppButton` to `AppLink`,
   which also needs a wrapper policy rather than blanket rejection.

The source scan has limits. For example, the unknown-class rule reported the
direct `text-md` uses in `GridCard`, but missed the same class in the lookup
objects in `AppButton.tsx:74` and `AppAvatar.tsx:41`. Those maps, and the
undeclared `text-default` in `AppButton` and `AppPopover`, need manual review.
Animation prop colors and visual behavior are not comprehensively checked.

## Suggested adoption

Start with `no-unknown-classes` as a warning in the base configuration, review
the six findings, then promote it to an error. Introduce color and component
rules after defining neutral tokens and component allowances. Keep the full
audit available for measuring progress without making it a CI requirement.

The existing `vp check` passed with zero errors and three existing warnings:
unnecessary spreads in `PublicationsSection.tsx:257` and
`ResearchTasksSection.tsx:105`, and a redundant length check in
`lib/applications/csvParser.ts:299`.

Rule behavior and setup requirements are documented in the upstream
[setup guide](https://github.com/shadcn-ui/lint/blob/main/SETUP.md),
[rule reference](https://github.com/shadcn-ui/lint/blob/main/docs/rules.md), and
[analysis limits](https://github.com/shadcn-ui/lint/blob/main/docs/how-it-works.md#what-it-cannot-see).
