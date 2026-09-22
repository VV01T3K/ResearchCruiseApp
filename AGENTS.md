# Repository instructions

## Commit messages

Use Conventional Commits for every commit: `type(scope): description`.
Choose a type such as `feat`, `fix`, `refactor`, `docs`, `test`, `build`, `ci`, or
`chore`. Use a short scope when useful, and write a concise, imperative description.

Examples:

- `feat(table): virtualize application rows`
- `fix(table): correct accessible row totals`
- `refactor(table): move virtualization into tanstack integration`

Preserve existing commit history unless the user explicitly authorizes rewriting it.

## Frontend organization

Organize new code by its feature or integration. Put TanStack-specific adapters,
configuration, hooks, and rendering helpers in `frontend/src/integrations/tanstack/`
under the relevant library directory.

Do not add new code to generic `shared` or `common` directories, or introduce
another generic directory with the same purpose. These are legacy locations, not
patterns to extend. Do not prefix new components with `App`.
