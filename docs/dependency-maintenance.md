# Dependency maintenance

- Install: `vp install --frozen-lockfile`. New releases wait 7 days and are
  scanned by Socket (`bunfig.toml`).
- Audit: `bun run audit` fails on high or critical JavaScript or NuGet
  vulnerabilities. CI runs the JavaScript audit on every push and in the shared PR/deployment gate.
- Commit `bun.lock` and the `packages.lock.json` files with dependency changes.
- Root `overrides` pin TypeScript to 5.9 (for `@tanstack/eslint-plugin-query`) and
  `js-yaml` to a patched release (for Orval). Remove them once upstream catches up.
- Dependabot opens weekly version updates against `staging`. Enable Dependabot
  security updates and the [Socket GitHub app](https://github.com/apps/socket-security)
  in the repository settings.
