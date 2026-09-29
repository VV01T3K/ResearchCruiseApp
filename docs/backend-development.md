# Backend development and checks

Use Linux or Ubuntu WSL with the repository on the Linux filesystem. Enable Ubuntu integration in Docker Desktop and verify `docker info`. Install the SDK pinned in `backend/global.json` (10.0.401), Vite+, Python 3 and the platform ICU runtime. Run `vp install --frozen-lockfile` at the repository root. NuGet dependencies and local tools are restored by the root checks; SQL Server is pulled at its pinned digest by Testcontainers.

| Root command | Behavior |
| --- | --- |
| `vp run check` | Locked restore, format verification, Release build, temporary OpenAPI/client regeneration and comparison, frontend checks and units, legacy plus both new backend suites |
| `vp run fix` | Applies formatting and generated-client changes, then runs the full checks |
| `vp run lint` | Format/build/frontend checks without test containers |
| `vp run check:quick` | Partial checks with new backend unit tests; excludes SQL integration, legacy and contract regeneration |
| `vp run test:coverage` | Separate backend coverage reports alongside test validation |
| `vp run test:e2e` | Browser suite, outside the ordinary root check |

From `backend`, `dotnet build ResearchCruiseApp.slnx -c Release` builds the four projects. Legacy tests remain on VSTest; the two new executable projects use xUnit v3 with Microsoft Testing Platform. Use `bash scripts/test.sh` after a Release build to run all three suites and validate their reports. Do not select a global MTP runner while the legacy suite remains. Tests use synthetic accounts, a capturing email transport and a disposable SQL Server container; no developer database or real SMTP is required.

After the build and contract comparison, frontend checks run alongside the backend suites. Legacy, unit and SQL integration suites run in separate processes with separate report directories; SQL scenarios still run sequentially with database resets and fresh application hosts. The command waits for every suite and returns failure if any suite fails.

Reports are written to fresh directories under `backend/artifacts/tests/`; container diagnostics and scenario timing appear in the integration output. Missing, empty, skipped or failed backend reports fail the gate. Temporary contract output is contained under `backend/artifacts/contracts/` and removed after comparison. `check` compares the current working tree, including untracked generated files, without rewriting it.

The local `Workspace checks` workflow is shared with image build/deploy workflows; image builds depend on it. Coverage and browser workflows run separately. Hosted PR execution passed on `df350a20` with the check context `Workspace checks` from GitHub Actions. Required-check configuration remains pending. The reusable deployment invocation emits `Validate workspace / Workspace checks`; use the direct PR context for branch requirements. Activate the requirement after `workspace-ci.yaml` reaches each protected branch, so other PRs can produce the required status. On 2026-09-29, the workflow is still absent from `staging`; its active ruleset has no required checks, and the main ruleset is disabled. Hosted failure probes now verify that failed workspace tests skip image/webhook jobs while preserving diagnostics; see the scenario ledger for evidence. The logging pipeline explicitly uses Bash to preserve the check command’s failure status. The solution is configured for VS Code, but IDE discovery and the complete devcontainer build have not been verified.

See [the scenario ledger](backend-test-scenarios.md) for measured evidence and open policies. The foundation is implemented; the full behavior matrix and legacy review are incomplete. Release v2.5.1 is the provisional upgrade source, not a certification of any deployed database.
