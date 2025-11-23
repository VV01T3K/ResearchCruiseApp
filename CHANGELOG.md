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
