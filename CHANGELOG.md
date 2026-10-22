Releases after 3.0.0 are published as [GitHub Releases](https://github.com/VV01T3K/ResearchCruiseApp/releases) (see [Releasing](docs/releasing.md)). This file is kept as history.

## 3.0.0 - 2026-10-21
#### Changes since *2.5.1*:
* fix(deploy): require production secrets and report to self-hosted Sentry (#634)
* revert(sentry): remove the problem-report action from error toasts (#633)
* fix(sentry): turn the problem report into a quick help panel (#629)
* fix(sentry): link toast problem reports to the mutation error event (#632)
* feat(sentry): offer problem reports from error toasts and form alerts (#582)
* build(deps): migrate Vite+ to 1.1.0 on Node 24 (#630)
* chore(sentry): raise production trace and replay sampling to 0.4 (#578)
* feat(sentry): add Polish user feedback from the layout and help page (#581)
* feat(sentry): proxy browser events through nginx and drop production source maps (#494)
* feat(sentry): report handled Form B refusals as warnings (#579)
* fix(forms): size the action bar spacer to the page and add a gap above the supervisor alert (#576)
* feat(sentry): report unexplained mutation failures (#574)
* feat(database): require an explicit flag to apply migrations on startup (#573)
* fix(session): resync countdown when the page returns from background (#566)
* ci(deps): hold Vite+ updates for approval in their own group (#618)
* ci(deps): raise Renovate's hourly PR limit to 15 (#604)
* docs(deps): point dependency docs at Renovate (#602)
* ci(deps): group, label and gate Renovate updates (#603)
* ci(deps): replace Dependabot with Renovate (#597)
* fix(deploy): disable identity caching on the staging database (#546)
* fix(forms): keep focused fields clear of the floating action bar (#537)
* fix(priority-information): scroll the scoring table inside its own region (#534)
* fix(auth): remove the IP-based auth rate limiter (#529)
* fix(auth): drop cached account data when the session ends (#535)
* fix(table): keep virtualized column widths independent of mounted rows (#536)
* fix(forms): point Form A assignment errors at the manager and deputy fields (#533)
* fix(cruises): fit the cruises list on laptop viewports (#532)
* fix(auth): skip the failing refresh for signed-out visitors (#523)
* fix(forms): restore section and reason in validation toasts (#516)
* perf(users): load user roles in bulk for lists and Form A context (#521)
* test(cruises): trim the auto-plan persistence test (#528)
* test(email): trim the outbox worker diagnostics test (#527)
* fix(users): replace roles in one authorized operation (#517)
* fix(cruises): prevent duplicate cruise numbers on concurrent creation (#519)
* fix(email): log SQL error details from the outbox worker (#520)
* fix(cruises): persist cruises created by automatic planning (#515)
* fix(sentry): stop reporting client-aborted requests as errors (#525)
* fix(forms): keep task metadata and allow unassigned cruise managers (#514)
* fix(auth): keep a newer session when a stale refresh gets 401 (#518)
* fix(cruises): keep application statuses consistent across cruise edits and undo (#504)
* fix(cruises): label the manager and deputy from the managers list (#498)
* fix(frontend): show the built version on Help and fix the office mailto link (#500)
* fix(effects): skip effect points for a missing deputy (#503)
* fix(forms): correct form B crew button label and section 5 title (#499)
* fix(table): leave the draft status bare when its note is empty (#497)
* test(frontend): rewrite the browser and unit suites with typed API mocks (#490)
* fix(storybook): restore interactive stories and add browser checks (#464)
* fix(sentry): stop backend events from carrying the client address (#437)
* fix(forms): confirm before discarding unsaved application edits (#454)
* fix(table): fit the applications list on laptop viewports (#457)
* fix(backend): patch System.Security.Cryptography advisories (#458)
* fix(publications): decode CSV imports as UTF-8 with legacy fallback (#452)
* docs(email): point outbox tests at the backend test command (#451)
* test: establish backend quality baseline and regression coverage (#430)
* fix(backend): harden input validation, form access and replacement (#449)
* feat(forms): unify validation with API contracts and explain failures in Polish (#424)
* refactor(deploy): simplify staging deployment
* fix(backend): fail image builds on vulnerable NuGet packages (#431)
* build(deps): update dependencies and adopt TanStack Query's query API (#432)
* feat(deps): migrate to Bun and add dependency security checks (#425)
* feat(table): virtualize application rows (#422)
* Enable React Compiler after TanStack Table v9 migration (#420)
* Migrate to TanStack Table v9 without legacy hooks (#419)
* chore: manage Greptile reviews in repository (#417)
* fix(email): validate SMTP configuration before startup work (#415)
* feat(email): persist notifications and retry delivery in background (#413)
* fix(config): move SMTP credentials to deployment secrets (#405)
* fix(seeding): reconcile startup seed data safely across replicas (#402)
* perf: filter visible applications before paging and reuse API client
* feat(applications): add filtering and keyset pagination (#401)
* Feature/improved-automated-tests (#404)
* refactor(frontend): remove dayjs dependency (#388)
* perf(frontend): optimize background image loading (#387)
* refactor(auth): replace custom contexts and harden browser sessions (#386)
* refactor: clean up TanStack Form and Zod integration (#380)
* ci: release version 2.5.1
* feat(backend): add fake SMTP for local development (#383)
* refactor: generate frontend API with orval (#377)
* build(backend): generate checked-in OpenAPI spec (#378)
* refactor: merge Account into Users as /me (#376)
* refactor(backend): finalize validation and auth metadata (#374)
* chore(integration): align v2 tooling and deployment (#373)
* refactor(frontend): align application with v2 API (#372)
* feat(backend): replace legacy API with v2 vertical slices (#371)

## 2.5.1 - 2026-07-22
#### Changes since *2.5.0*:
* hotfix: rotate SMTP app password

## 2.5.0 - 2026-07-08
#### Changes since *2.4.0*:
* feat(sentry): searchable user roles and fuller diagnostic capture (#352)
* feat(sentry): make replay session sample rate runtime-configurable (#351)
* feat(sentry): full-stack error monitoring with React and ASP.NET Core SDKs (#344)
* fix: devcontainer stuck couse of playwright install
* refactor(frontend): reorganize frontend files by layer - part 2/2 (#339)
* fix: improve access control with bug fixes and refactoring (#338)
* feat: add devcontainer lock file for Docker-in-Docker feature
* refactor: improve group user actions and fix data sync (#336)
* feat: remove asterisks in details view (#337)
* refactor(frontend): reorganize source files by layer - part 1/2 (#334)
* fix: disable blocked backend commit hook
* feat: Calendar drag and drop (#332)
* feat: upgrade development tooling and improve TypeScript and Vite setup (#322)
* chore: RPI project (#348)

## 2.4.0 - 2026-03-31
#### Changes since *2.3.1*:
* style(formA): corrected the messages in the cruise period/precise date
* fix: corrected misleading test behaviour
* fix: enchance session automated tests (#320)
* fix: Ship blockade validation (#317)
* feat: session logic corrected (#303)
* fix(tests): select only current month days in datetime-picker (#319)
* fix: prevent throwing InvalidOperationException when ids list is empty
* fix(formA,slider): enforce min can't be equal to max (#316)
* chore: update copyright holders and year in LICENSE file (#310)
* chore: RPI project organization exercise (#311)

## 2.3.1 - 2026-02-17
#### Changes since *2.3.0*:
* fix: improve comment validation error handling in handleDraftSave function
* fix: correct Comment field length in CruiseDayDetailsDto to 1024
* fix: add restart policy to all services in Docker Compose files for komodo staging
* fix: fix test regression
* feat: prevent deletion of last admin (#305)
* feat: replace input with dropdown for SPUB tasks and update comment validation (#304)
* fix: make form fields nullable to allow saving drafts with incomplete data (#307)

## 2.3.0 - 2026-02-11
#### Changes since *2.2.1*:
* feat: add deputy manager name fields to CruiseDto and update UI (#298)
* refactor: remove toast progress bar (#297)
* chore: update frontend dependencies (#296)
* fix: update SPUB tasks section tests to use dropdown for task name input
* feat: add standard SPUB tasks dropdown to Form A (#294)
* feat: prevent accidental selection of the past dates (#289)
* feat: add staging-otel docker compose configuration for backend and frontend services
* fix: correct formatting of ConnectionStrings__Database in docker compose file
* feat(grafana): add Grafana service with datasource and dashboard provisioning for Komodo env
* fix: remove expired Yarn GPG key to restore docker-in-docker functionality
* fix: prevent duplicate email conflicts in user management (#288)
* refactor(ui): revert one Tabs to before base-ui
* chore: update dependencies and swap last react-toast import
* fix: add migration to fix prod db state (#287)
* fix(slider): add validation for period input and synchronize clamped values with form state
* fix: ensure DOTNET_SYSTEM_GLOBALIZATION_INVARIANT is set for consistent behavior (#281)
* refactor(ui): implement partial headless component architecture (#277)
* fix: generated password always passes validation rules (#279)
* chore: change playwright locators to use more data-testid (#276)
* chore: update (almost) all dependencies to latest version (#271)
* feat(ci/cd): update and streamline workflows (#270)
* feat: add additional button for admins for initializing password change process (#268)
* fix: enable saving drafts by making section 7 columns nullable and fixing validation, ministerialPoints type, and entity Equals method (#265)
* feat(FormB): add csv parsing in section 13 (#262)
* feat(ci/cd): add/update CI/CD pipeline configuration for self hosted Komo.do staging deployment (#266)

## 2.2.1 - 2025-11-23
#### Changes since *2.2.0*:
* fix: removed 2nd scroll in sort/filter dropdown + reduced max-height of this scrollable box
* fix: FormA SupervisorPage shows now correct precise dates
* fix: convert year to string in ApplicationsPage for correct data type in filtering
* fix: add scrollable container for dropdown menu items and to dropdown items in AppPopover and AppDesktopTableHeaderDropdown

## 2.2.0 - 2025-11-19
#### Changes since *2.1.0*:
* fix(build): add CRUISE_FIELD_TO_SECTION for form validation in CruiseDetailsPage and NewCruisePage
* fix(cruises): displaying selected managers in Readonly CruiseForm (#249)
* fix(formC): removed bug causing Invalid Action error in form C (#248)
* feat(form A,B,C): naprawiono problemy z walidacja + drobne ulepszenia procesu walidacji
* feat: drobne zmiany kosmetyczne ze spotkania
* feat: displaying asterisks(*) in the required fields (#217)
* fix: bugs with precise dates
* chore(devcontainer): update postCreateCommand for frontend setup and add Playwright extension (#245)
* fix(formB): deleted żurawik hydrograficzny dziobowy (#228)
* feat: Dodatkowe dane w widoku zbiorczym wszystkich zgłoszeń #177
* fix: playwright tests patch
* feat(devcontainer): Small improvement to dev environment
* chore(devcontainer): simple devcontainer config with docker-in-docker features
* fix: update repository references in docker-compose and package.json
* chore: comment out deploy-to-staging job in workflows
* chore: expand authors
* fix: change staging jwt secret

## 2.1.0 - 2025-09-25
#### Changes since *2.0.0*:
* feat: add support for multiple and custom research areas (#389)
* feat: add basic frontend tests (#388)
* feat: improve form validation UX
* feat: add custom cruises
* chore: add renovate label
* chore: add k8s readiness probes
* fix: block submit button in forms
* feat: add hint in form b
* feat: increase max string length limit for text fields
* chore(config): migrate config renovate.json
* feat: add renovate config
* fix: prod docker compose
* feat: add cruise ship role
* feat: allow shipowner to remove users
* feat: allow multiple scans attached to one contract
* feat: show warning if unassigned cruise manager is selected
* feat: add precise period selection in form A
* feat: allow any cruise modifications by ship owner (#360)
* docs: selection and adaptation of methodology
* docs: add scrum sprint retrospective

## 2.0.0 - 2025-05-13
#### Changes since *1.1.0*:
* chore: rename k8s directory
* docs: change readme
* chore: delete old_frontend
* feat: add opentelemetry monitoring
* feat: add rybbit analytics
* fix: add deputy manager filter
* feat: add form printing
* fix: apply various small fixes and adjustments in ui
* feat: add versioning
* fix: resolve general small issues
* feat: add form C
* feat: implement Form B
* feat: add ci cd pipeline
* feat: readonly components improve
* feat: applications UI improvements
* fix: correct calendar text overflow
* feat: add cruise schedule
* feat: implement cruise effects page
* feat: added form A view for supervisor
* fix: correct issues with dropdown position
* feat: improve authentication by simplyfing UserContext code
* feat: add preload background, improve animations when signing into the application and run linters
* feat: add visual improvements and animations to already existing codebase
* feat: implement ApplicationsPage
* fix: correct table width issues and improve displaying Form A from URL
* fix: adjust dashboard cards, fix form validation in user modal and change way of rendering table buttons
* feat: add form A
* feat: add improvements to common inputs
* chore: move the rest of mutations into separate hooks
* feat: refactor current version
* chore: improve eslint, fix some issues and do minor adjustments
* feat: use AppTable in the mypublications page
* feat: add more fields to form A
* feat: add basics of form A and month slider
* fix: resolve dropdown overflow issue
* fix: adjust table and modal on mobile devices
* feat: check refresh token validity
* feat: add possibility to remove user accounts, added user management tab
* feat: add text and number form input
* feat: small application style changes
* feat: add searching for facets in table header dropdown
* fix: resolve rerender issues with table
* fix: correct app network status alert behavior
* feat: add reset password page
* feat: remove tailwind motion
* feat: improve animations in table component and basic refactor of this component
* feat: add experimental table component, improved theme schema and coresponding components and other minor fixes
* feat: add some changes
* chore: update tailwindcss and react to their latest versions
* feat: add AppPage and small changes
* feat: add my publications page
* feat: add forgot password page
* fix: resolve token autorefresh interceptor issues
* feat: add network connection status
* feat: improve user context provider
* feat: add help, priorityinformation, accountsettings and registration page
* feat: add signin page and adjust sign-out to make it work
* feat: add header and loading while user profile is fetched
* feat: add header
* feat: project setup
* docs: add kanban board
* docs: add scrum sprint backlog
* docs: add scrum product backlog
* feat: add document version to template
* docs: add project organization
