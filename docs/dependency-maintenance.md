# Dependency maintenance

JavaScript packages use Bun, pinned in the root `package.json` and `mise.toml`.
Vite+ still runs development, builds, formatting and tests. Run `vp install
--frozen-lockfile` from the repository root to install the committed dependencies.

`bunfig.toml` delays newly resolved releases by seven days and enables the Socket
Bun scanner. Socket uses its public API without credentials. Its package checks
run during installation; they do not replace the vulnerability audits below.

## Audits

Run `bun run audit` at the repository root. It checks JavaScript dependencies,
then restores the .NET solution with NuGet Audit and locked dependencies. The
command fails on high or critical vulnerabilities. A failed audit request also
fails the check. To run the checks separately:

```sh
bun audit --audit-level=high
dotnet restore backend/ResearchCruiseApp.sln --locked-mode --force -p:CI=true
```

To display all known NuGet vulnerabilities, including transitive dependencies:

```sh
dotnet package list --project backend/ResearchCruiseApp.sln --vulnerable --include-transitive
```

CI runs NuGet Audit on pushes, pull requests and every Monday. JavaScript audit
enforcement is added with the dependency fixes in PR #426; the migration retains
the existing dependency versions and its manual Bun audit reports 30 high or
critical advisories. Build and test results
still determine whether a dependency update is usable. Audit failures must be
investigated rather than suppressed to get a green build.

## Updates

Dependabot checks Bun, NuGet, GitHub Actions and container images weekly. Routine
releases have a seven day cooldown and a limit of three open PRs per ecosystem
entry. Related minor and patch updates are grouped; major updates remain separate.
Automatic merging is not configured.

Commit `bun.lock` and both .NET `packages.lock.json` files with dependency changes.
For intentional NuGet updates, edit the package references and run `dotnet restore
backend/ResearchCruiseApp.sln --force-evaluate` locally before committing. CI and
Docker restores must keep using locked mode. Tool pins in `mise.toml` and .NET
target framework upgrades still need manual maintenance.

## GitHub settings

The Dependabot configuration takes effect on the default branch. Enable the
dependency graph, Dependabot alerts and Dependabot security updates in repository
settings. Security updates are not held by Dependabot's routine update cooldown;
Bun's separate release delay may still require reviewing a fresh security fix.
Disable the Renovate app for this repository if it was previously enabled.

For Socket analysis of the .NET dependencies, install the
[Socket GitHub app](https://github.com/apps/socket-security) for this repository.
The committed NuGet lockfiles expose the resolved dependency graph to its scanner.
This account integration cannot be enabled by adding a repository file. The Bun
scanner works independently. NuGet download blocking through Socket Firewall
requires its Enterprise offering and is not configured here.

References: [Socket Bun scanner](https://github.com/SocketDev/bun-security-scanner),
[Socket .NET support](https://socket.dev/blog/introducing-net-support),
[NuGet Audit](https://learn.microsoft.com/en-us/nuget/concepts/auditing-packages),
[Dependabot configuration](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference).
