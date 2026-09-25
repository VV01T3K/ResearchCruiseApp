# Production Sentry migration readiness

Initial review on 2026-09-17; preparation status updated on 2026-09-25 using the staging and CLI checks recorded during this session. This is a preparation checklist, not evidence that production or application ingestion has been tested. See [the session handoff](handoff.md) for continuation details.

Staging stays in Sentry Cloud, in organization `cruiseteam` and projects `frontend-staging` and `backend-staging`. Production should send to the internal self hosted instance, with separate `frontend-production` and `backend-production` projects in the same organization on that instance.

The owner confirmed that Sentry is not publicly accessible and testing will use VPN access. Production access will not be provided. Read access through the CLI is now verified for `https://sentry.rejsy.ug.edu.pl`, organization `sentry`. The installed server version and production deployment method remain unverified. The API root's `version: 0` is not the installed Sentry release.

Production is not ready to switch based on the repository alone. Network routing, build uploads, data capture policy, and operational acceptance must be resolved first.

## Test locally before production

Use a separate local Docker deployment and two internal Sentry test projects. Keep the deployed staging application and its Cloud DSNs unchanged. CI uploads and production deployment are deferred.

### Verified during preparation

- Cloud CLI access lists `cruiseteam/frontend-staging` and `cruiseteam/backend-staging`.
- Internal CLI access lists only `sentry/internal`, with `isInternal: true`. Do not use Sentry's own internal project for application tests. Other projects could exist outside the token's visibility.
- The internal organization advertises performance and session replay features. This does not prove its ingestion workers are healthy.
- The replacement internal token includes `project:write` alongside read access. Creating `frontend-sentry-test` returned HTTP 403; a subsequent listing still showed only `internal`. The organization disables member project creation. Resolve project creation with an administrator before testing; upload permissions have not been verified.
- Windows HTTPS and CLI access work; Node needs `NODE_USE_SYSTEM_CA=1` in this environment.
- A disposable `mcr.microsoft.com/dotnet/sdk:10.0-alpine` container resolves and connects to the hostname but fails HTTPS certificate verification. Windows builds a valid chain through GEANT TLS RSA 1 to HARICA TLS RSA Root CA 2021. Determine whether the server omits intermediates or the container lacks a required CA. The final application image still needs its own verification after the fix.
- Docker is available and running. The SQL Server and .NET SDK images are cached. No host .NET SDK was listed, so the Docker route avoids requiring a host SDK installation.
- Staging history was rewritten after the initial review of `6eb9166f`. This branch was advanced to `373812c6` on 2026-09-25. It includes fake email, the durable email outbox, SMTP startup validation, and `Database__SeedAccountsAutomatically`, plus TanStack Table v9, React Compiler, and virtualized application rows. Sentry configuration is unchanged from the initial review.
- Existing Playwright fixtures mock backend API calls, bypass CSP, and disable browser security. They cannot validate actual backend reporting, browser TLS/CORS, or distributed tracing.

### Required setup

1. Have a Sentry administrator create `frontend-sentry-test` with platform `javascript-react` and `backend-sentry-test` with platform `dotnet-aspnetcore`, in organization `sentry`. Assign the testing account's team to both, enable client keys, and obtain their two DSNs. These are proposed names, not existing projects. Use a read token for inspection once setup is complete; event ingestion uses the DSNs and needs no personal token in the app. Disable default alert rules when creating test projects.
2. On the frontend test project, permit the local test origin and check that localhost/development inbound filters do not discard the test errors. Enable default data scrubbing and agree on a short test retention period. Confirm replay and tracing are available for the application projects. Route any test alerts only to the test recipient.
3. Resolve container certificate trust. Prefer a complete certificate chain on the Sentry reverse proxy. If a CA must be added, use a verified CA certificate in the container trust store. Test HTTPS from the actual backend image. Do not disable TLS verification; the Node setting above does not configure Alpine or .NET trust.
4. Base the test implementation on the reviewed staging changes, preserving the migration notes. Use a separate Compose project, database volume, and container names. Existing Compose files hardcode `name: researchcruiseapp` and `container_name`, so project naming alone is not sufficient isolation. Bind test ports to localhost and select unused ports. Never reuse a production database connection or volume.
5. Run the frontend's built Nginx image, backend, and SQL Server locally. Nginx should proxy `/api/` to the local backend. Set `FrontendUrl` to the browser's actual local origin. Let startup migrations and reference seeding run only against the disposable database.
6. Use synthetic seed users in a local replacement `users.json`, not copied real accounts. Enable fake SMTP, disable password logging, and obtain test account credentials/confirmation links from the fake email files. On this staging version, seeded accounts are accepted and confirmed and account creation queues a fake email. Preserve the local outbox and Data Protection key tables during a test run. Do not run `mise run seed` blindly: its task resets the configured local database.
7. Apply the settings below. Build arguments require wiring in the test Compose configuration; the current dev Compose file does not supply them. Keep all build upload tokens absent for the first ingestion test, so nothing uploads to Cloud.

| Setting | Test value and location |
| --- | --- |
| Frontend and backend `APP_ENVIRONMENT` | Build argument `sentry-test` for both images |
| Frontend `SENTRY_RELEASE` | Build argument `research-cruise-app-frontend@<exact-commit>-sentry-test` |
| Backend `SENTRY_RELEASE` | Build argument `research-cruise-app-backend@<exact-commit>-sentry-test` |
| Frontend runtime `SENTRY_DSN` | DSN from `frontend-sentry-test` |
| Backend runtime `Sentry__Dsn` | DSN from `backend-sentry-test` |
| Frontend runtime `SENTRY_TRACES_SAMPLE_RATE` | Start at `0`; use `1` for a later short synthetic tracing test |
| Backend runtime `Sentry__TracesSampleRate` | Start at `0`; use `1` for a later short synthetic tracing test |
| Frontend runtime `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | Start at `0`; also change the fixed error replay rate to `0` before testing. Enable replay only for a later deliberate synthetic test. |
| Backend `Database__SeedAccountsAutomatically` | `true`, with synthetic seed users only |
| Backend `Database__LogUserPasswordsWhenSeeding` | `false` |
| Backend `SmtpSettings__UseFakeSmtp` | `true` |
| Backend `SmtpSettings__FakeSmtpDirectory` | `/tmp/fake-emails`, optionally mounted to a dedicated local folder |
| Backend `FrontendUrl` | Actual local browser origin, for example `http://localhost:8080` |
| Backend `ConnectionStrings__Database` | Dedicated local test SQL Server/database only |

### Test sequence and completion evidence

- Start with the real local app and normal browser security enabled. Check the backend health endpoint, login with a synthetic account, and confirm a normal API request works.
- Add a small diagnostic action available only in the test build/environment: an intentional browser error and a controlled backend exception. Use a unique run marker, no real form contents, and no public production diagnostic route.
- Confirm both errors in their respective internal projects with `environment: sentry-test`, expected releases, and the run marker. CLI/API success alone is not an ingestion test.
- Confirm a real browser API request shares a trace with the backend and expected database spans. Confirm replay arrives, can be played, and links to the relevant error/trace. Check user roles, logout identity clearing, health filtering, and synthetic sensitive markers.
- Simulate a Sentry connection failure and confirm the local application remains usable. Inspect SDK diagnostic output locally for failed delivery; do not infer success from a healthy app.
- Verify fake mail delivery through the new outbox and verify no real mail is sent. Any mail-worker alert test must cover terminal failures logged at warning level, not only error level.
- Confirm the run marker is absent from Cloud and the deployed staging application continues reporting there normally.

Source maps and symbols are a second gate. We can test ingestion first without uploads, but that does not validate readable production stack traces. Before the full rehearsal is complete, retain maps and .NET symbols from the exact deployed test artifacts and upload manually over the VPN using a separate upload-capable credential. The current frontend only generates maps when its authenticated Sentry plugin is enabled, then deletes them after upload. Manual upload therefore needs build preparation, not just a new CLI command. Any debug ID injection must happen before packaging/deploying that frontend bundle. Keep source maps out of the served Nginx directory.

Passing this local test proves the app can report to the internal instance from the tested networks. Production browser reachability, production container trust, backup/restore, retention, and production alert delivery still need the later operator checks below. No production rollout is needed for this rehearsal.

## Findings from the repository

| Area | Evidence | Consequence |
| --- | --- | --- |
| Production uploads still target Cloud | `.github/workflows/build-and-deploy.yaml` uses `SENTRY_AUTH_TOKEN`; both Dockerfiles default to staging project slugs and have no `SENTRY_URL` build argument. | If the token is present, production build artifacts target the cloud staging projects. A runtime DSN change does not move these uploads. |
| Runtime routing mostly exists | `docker/docker-compose.prod.yml` supplies separate DSNs; the frontend entrypoint writes `runtime-config.js`; .NET reads `Sentry__Dsn`. | Recreating containers can change reporting destinations. A new build is still needed for upload configuration and any SDK changes. |
| Browser sends directly to Sentry | `frontend/src/integrations/sentry/client.ts` configures a DSN with no tunnel. | A browser needs its own route to the internal hostname. The application server's access and a tester's VPN do not establish access for ordinary users. |
| Replay capture is broad | `client.ts` sets `maskAllText`, `maskAllInputs`, and `blockAllMedia` to `false`, with `replaysOnErrorSampleRate: 1`. | Production may record visible sensitive content. Setting session sampling to zero does not disable error replays. |
| Backend capture is broad | `SentryConfiguration.cs` enables `SendDefaultPii` and `MaxRequestBodySize = RequestSize.Always`. | Request bodies and other event content need an explicit capture policy. |
| Local scrubbing is limited | `ScrubSensitiveData` removes selected headers, cookies, and event user IP. The transaction hook only filters health requests. | It does not establish protection for bodies, query strings, messages, breadcrumbs, or all transaction data. Server defaults must also be verified. |
| Seed password logging remains possible | The initializer logs a warning containing a generated password when enabled. Staging Compose and Kubernetes base configuration enable the option. | The old checklist's claim that this event is scrubbed was incorrect. Disable password logging even for staging. |
| Deployment is not established here | The main workflow builds production images, but deployment steps are commented out. Production Compose uses unpinned image references. Kubernetes has no production overlay in this checkout. | The production operator must identify the actual manifests, image versions, and environment injection point. |
| Missing upload credentials can go unnoticed | The frontend plugin and backend uploads are conditional on a token. BuildKit secrets are optional. | A successful image build does not prove symbols or source maps were uploaded. |

Existing useful controls include BuildKit secrets for upload tokens, deletion of frontend source maps after upload, a `no-store` response for `runtime-config.js`, user ID and role tagging, and backend health transaction filtering. Preserve these.

## Network design is the first decision

| Sender | Required destination | Preparation and later evidence |
| --- | --- | --- |
| Production browser | Frontend ingestion endpoint | Establish whether every intended user has internal network access. If not, provide an ingestion endpoint reachable through the app infrastructure. Test from a normal user's network, without the tester's VPN. |
| Production backend container | Internal backend DSN | Operator verifies internal DNS, route, firewall, proxy settings, and certificate trust from the actual container network. |
| CI upload process | Internal Sentry API | Use an internal runner, an approved CI network connection, or an internal upload job receiving artifacts from CI. A developer's VPN does not give `ubuntu-latest` runners access. |
| Administrator or tester | Internal Sentry UI/API | VPN access is suitable. Verify DNS, TLS, login, and project permissions when access becomes available. |
| Sentry workers | Approved mail and integration services | Verify alert delivery and restrict outbound transfers to the agreed destinations. |

If browsers cannot reach Sentry directly, use a fixed ingestion proxy or the SDK's `tunnel` option through infrastructure that can reach Sentry. The SDK still needs a DSN when using a tunnel. The tunnel needs a server endpoint; adding an SDK option alone is insufficient. See [Sentry's tunnel option](https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#tunnel).

Keep the Sentry UI and administrative API internal. An ingestion route should accept only the intended project and destination, with bounded request size, rate limits, timeouts, and correct handling of compressed replay envelopes. Never forward to an arbitrary hostname taken from a client envelope. Avoid recording envelope bodies in proxy logs or forwarding application cookies and authorization headers upstream. Exclude the ingestion route from tracing where necessary to avoid recording the reporting traffic itself.

For direct browser ingestion, verify origin restrictions, CORS, the application's CSP, DNS, and browser trust of any internal certificate authority. For either design, test errors and replay payload sizes through the real proxies. Interactive VPN/SSO challenges cannot be inserted into SDK ingestion requests. No browser should receive a CI authentication token.

## Repository work before cutover

- [ ] Add `SENTRY_URL` to both Docker build stages and pass the explicit internal URL from the production workflow. Keep staging's cloud destination explicit or preserve its existing cloud default.
- [ ] Set production project slugs and organization explicitly. Use a separate production upload secret such as `SENTRY_AUTH_TOKEN_PROD`, with only the permissions needed for uploads. Preserve the existing staging cloud secret.
- [ ] Pass the upload URL to the Vite plugin through its supported configuration. For .NET, use `SENTRY_URL` or conditional `SentryUrl`; do not add duplicate configuration without a reason. [Sentry's MSBuild documentation](https://docs.sentry.io/platforms/dotnet/configuration/msbuild/) confirms that environment configuration is supported and MSBuild properties take precedence.
- [ ] Require valid production upload configuration for trusted release builds and verify upload success. PR builds should work without production secrets and should not upload to production. Retain BuildKit secret mounts rather than token build arguments or persistent environment variables.
- [ ] Make upload retries reliable. A changed secret alone does not invalidate a Docker build cache. For the first cutover or a repaired upload, force the relevant build stage to run or upload the exact retained artifacts separately. See [Docker's cache rules](https://docs.docker.com/build/cache/invalidation/#build-secrets).
- [ ] Verify .NET symbols and source bundles are present for the deployed assemblies. Backend `SENTRY_RELEASE` currently exists only in the final image stage, and release creation is not enabled in the project. If explicit backend release creation is required, pass the same release into the build stage too; symbol matching itself uses debug identifiers.
- [ ] Add browser ingestion routing only if the network decision requires it. Keep staging reporting to Cloud.
- [ ] Agree on replay masking and request body capture. Add a real replay off switch or make error replay sampling configurable. Both session and error replay sampling must be zero to disable automatic replay capture through sampling.
- [ ] Add focused regression checks for the chosen sensitive data policy and production versus staging destinations. Existing backend tests cover headers, cookies, IP, roles, and health filtering, not the broader data policy.
- [ ] Document production settings and rollback in the actual deployment configuration. Pin both application images to an identified release or digest. Do not promote a staging frontend build unchanged: its environment and release are compiled in.

Suggested production configuration contract:

| Setting | Where | Expected value |
| --- | --- | --- |
| `SENTRY_URL` | Build/upload process | Internal Sentry base URL, not a project DSN |
| `SENTRY_ORG` | Build/upload process | Actual self hosted organization slug |
| `SENTRY_PROJECT` | Each component build | `frontend-production` or `backend-production` |
| `SENTRY_AUTH_TOKEN_PROD` | CI secret store | Token issued by the internal instance |
| `SENTRY_DSN_FRONTEND` | Deployment configuration | Internal frontend project DSN |
| `SENTRY_DSN_BACKEND` | Deployment configuration | Internal backend project DSN |
| `SENTRY_TRACES_SAMPLE_RATE` | Deployment configuration | Agreed production rate; current Compose default is `0.1` |
| `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | Deployment configuration | Agreed production rate; current Compose default is `0.1` |
| Error replay control | SDK/configuration change needed | Explicitly agreed; currently fixed at `1` |
| `APP_ENVIRONMENT` | Image build | `production` |
| `SENTRY_RELEASE` | Component build/runtime | Existing component prefix plus the exact commit SHA |

Remove or leave unset the shared `SENTRY_DSN` fallback in production, and validate the two explicit DSNs point to their intended projects on the same instance. Validate rates within `0..1`; the frontend helper currently accepts any finite number. Verify no frontend build embeds a Cloud DSN, because its runtime empty value falls back to the compiled DSN.

## Data handling and staging Cloud

- [ ] Keep staging data synthetic or demonstrably sanitized. Do not copy production databases, documents, user records, credentials, or sessions into staging. Testers also need to avoid entering real confidential content.
- [ ] Disable seed password logging. Test accounts still have credentials, even when business data is synthetic.
- [ ] Choose what production may collect: user IDs and roles, displayed form content, request bodies, URL queries, console breadcrumbs, exception messages, and replay content. Self hosting changes the destination, not the sensitivity of the captured data.
- [ ] Prefer masked production replay or leave replay off until sensitive screens are tested. Use synthetic markers to check login, registration, password reset, account settings, user management, and cruise/application forms. Sentry recommends verifying masking before production use in its [Replay privacy documentation](https://docs.sentry.io/platforms/javascript/session-replay/privacy/).
- [ ] Verify sensitive values in serialized messages, bodies, breadcrumbs, queries, and transactions, not just header removal. Test before transmission as well as the processed event in Sentry. Enable and verify server scrubbing as another layer.
- [ ] Review outbound data from Sentry itself: installer issue reporting, beacon, optional integrations, external symbol/source fetching, and alert email contents. Disable unneeded reporting and document permitted destinations. [Sentry documents installer reporting and beacon controls](https://develop.sentry.dev/self-hosted/#self-hosted-monitoring).
- [ ] Review build plugin telemetry and where source bundles, CI artifacts, build caches, and backups reside. Do not put credentials into source files or uploaded debug artifacts. Existing credential-shaped defaults in backend configuration need an owner review and rotation if they are real.
- [ ] Decide access roles, retention, deletion handling, backup retention, and who may view replay and source code. Keep alert messages within the agreed data boundary.
- [ ] If production previously reported to Cloud, inventory that history and agree on retention or deletion. Changing the DSN does not remove old Cloud events or upload artifacts, nor import them into the new instance. Do not promise historical migration without testing the available tooling.

## Self hosted instance and operations

These checks belong to the Sentry administrator. Record an owner and evidence for each item before enabling production reporting.

- [ ] Record the installed release and deployment configuration. Use a stable release and verify compatibility with the repository's actual locked JavaScript packages and .NET SDK `6.6.0`, including Replay and symbolication. Avoid an errors only installation if traces and replay are required.
- [ ] Allocate dedicated capacity and disk headroom from measured or estimated event, trace, and replay volume. Current documented minimums are 4 cores, 16 GB RAM plus 16 GB swap, and 20 GB free disk; 32 GB RAM is recommended. Installation minimums are not a production retention budget. See [Sentry's system requirements](https://develop.sentry.dev/self-hosted/#required-minimum-system-resources).
- [ ] Configure stable internal DNS, TLS renewal, `system.url-prefix`, proxy forwarding, trusted origins, and certificate trust. Keep databases and queue services private.
- [ ] Create production projects, teams, least privilege access, MFA or supported SSO, recovery access, DSNs, and the CI token. Recreate needed alerts, ownership rules, filters, and dashboards; Cloud settings do not transfer through a DSN change.
- [ ] Define retention and ingestion limits. Account for error replay volume and burst traffic. Do not assume Cloud spike protection is available on self hosted installations.
- [ ] Schedule backups covering configuration, secrets needed for restoration, databases, and file/object storage used by the installed release. Inventory actual volumes, including artifacts and replays, rather than backing up only PostgreSQL and ClickHouse.
- [ ] Restore a backup into an isolated environment and verify projects, sample events, replay, and symbolication. Record acceptable data loss and recovery time. Sentry's JSON export is a partial configuration backup and excludes historical events; see [Backup and restore](https://develop.sentry.dev/self-hosted/backup/).
- [ ] Monitor Sentry independently: `/_health/`, disk space and I/O, memory, service restarts, consumer lag, failed ingestion, certificate expiry, backup failures, and alert delivery. A healthy web UI alone does not establish successful event processing.
- [ ] Name an operator and escalation contact. Plan upgrades and maintenance downtime. Check required intermediate versions and release notes; a database migration may require backup restoration for rollback. See [Sentry's upgrade procedure](https://develop.sentry.dev/self-hosted/releases/).

## Acceptance and cutover sequence

1. Resolve the network design, hostname/version, production deployment method, owners, retention, and capture policy. Collect operator attestations where production access is unavailable.
2. Make and review the repository changes. Build the exact candidate images with production destinations and verify uploads on the internal instance. Preserve staging's Cloud build/upload path.
3. Rehearse using synthetic data and the candidate images on a disposable deployment with equivalent network routing. A VPN test is useful for Sentry inspection, but is not a substitute for testing the ordinary browser route.
4. Complete the acceptance checks below. Keep links or IDs for test events, build logs, and operator verification. Do not place sensitive payloads or tokens in the checklist.
5. The production operator applies both production DSNs and deploys the identified images together. Recreate containers when changing environment configuration; `docker compose restart` alone does not apply changed Compose environment values.
6. Reload clients and verify new sessions use the intended destination. Existing open browser tabs may keep an initialized old DSN until reload. Account for them when stopping any previous production Cloud ingestion.
7. Observe ingestion, error volume, processing delay, storage growth, and application latency during an agreed initial observation period. Recheck staging reporting and uploads independently.

Acceptance evidence:

- [ ] Browser error arrives in `frontend-production`, with `environment: production`, correct release, and readable original source frames.
- [ ] Backend exception arrives in `backend-production`, with the correct release and resolved .NET frames/source context. Check for duplicate reporting of one exception.
- [ ] A sampled request links browser and backend traces, with expected database spans. Verify `sentry-trace` and `baggage` survive the real proxy path; use temporary full sampling for synthetic tests if needed.
- [ ] User ID and role tags are correct and logout clears browser identity. Backend requests do not inherit another user's identity.
- [ ] Replay works and links correctly if enabled, with the agreed masking. If disabled, verify no replay envelopes leave the browser, including after an error.
- [ ] Sensitive synthetic markers are absent from prohibited fields; health transactions and seed password messages are absent.
- [ ] Source maps are not publicly served and CI tokens are absent from final images/runtime configuration. Required source maps and symbols exist on the internal instance for these exact artifacts.
- [ ] Browser reporting works from the intended user network; backend and CI connectivity have independent evidence. Internal Sentry administration remains private.
- [ ] An alert reaches the intended recipient. Sentry outage or timeout does not break login or normal application requests. Document expected telemetry loss during outages; do not assume durable SDK buffering.
- [ ] Staging events and uploads still reach its Cloud projects. New production events, replays, and uploads reach only the internal destination under the agreed design.
- [ ] Restore drill and independent monitoring are complete; the production operator has the cutover and rollback instructions.

## Rollback

Prepare a previous application image pair that can keep the internal DSNs, and an option to disable reporting. If production data must remain internal, rollback must not automatically restore Cloud DSNs. Recreate affected containers and reload clients when changing configuration. Confirm the compiled frontend fallback cannot silently reactivate an old destination.

App rollback and Sentry server rollback are separate procedures. Preserve artifacts needed to debug a previous app release on the internal instance. Restore a consistent Sentry backup if a failed server upgrade requires it. If reporting must be disabled, acknowledge the monitoring gap and use the agreed local operational logs and external health checks until recovery.

## Evidence still needed later

No credentials or production access are required now. Before implementation, obtain the internal Sentry hostname/version, whether normal app users have internal access, the approved CI route, the actual production deployment configuration, and the named production/Sentry operators. Once Sentry access is provided, verify projects, permissions, capabilities, uploads, events, scrubbing, and alerts there. Production network and deployment checks remain operator tasks, supported by recorded results.
