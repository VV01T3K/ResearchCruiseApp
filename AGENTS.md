# Repository instructions

## Task references

- For PRs, Greptile review, merging, or releases, read [CONTRIBUTING.md](CONTRIBUTING.md).
- For setup or validation commands, use [source development](frontend/README.md).
  Backend tests require a prior restore and build.
- For API contract changes, follow [API regeneration](frontend/README.md#regenerate-the-api-client)
  and commit both the OpenAPI document and generated client.
- For frontend test changes, read [the fixture guidance](frontend/TESTING.md).
- For TanStack Table changes, consult the installed package's `skills/` directory
  under `frontend/node_modules/@tanstack/react-table/` for version-specific guidance.
- For deployment or configuration changes, read [deployment](docs/deployment.md)
  and [configuration](docs/configuration.md). For email behavior, read
  [email delivery](docs/email-delivery.md).

The `seed` and `db:del` mise tasks delete the source development database volume.
Use the normal database startup in the source development guide for setup.

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
