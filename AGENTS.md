# Repository instructions

## Commit messages

Use Conventional Commits for every commit: `type(scope): description`.
Choose a type such as `feat`, `fix`, `refactor`, `docs`, `test`, `build`, `ci`, or
`chore`. Use a short scope when useful, and write a concise, imperative description.

Examples:

- `feat(table): virtualize application rows`
- `fix(table): correct accessible row totals`
- `refactor(table): move virtualization into tanstack integration`

Never rewrite the history of `staging` or `main`. On your own PR branch, rebasing
and `--force-with-lease` are fine, unless another PR is stacked on it; then merge
instead.

## Frontend organization

Organize new code by its feature or integration. Put TanStack-specific adapters,
configuration, hooks, and rendering helpers in `frontend/src/integrations/tanstack/`
under the relevant library directory.

Follow TanStack Router's colocation convention: code used by one route stays next
to it in a `-` prefixed folder (for example `-components`). Code used by several
routes, or by code outside `routes/`, goes in `frontend/src/features/<feature>/`.

Do not add new code to generic `shared` or `common` directories, or introduce
another generic directory with the same purpose. These are legacy locations, not
patterns to extend. Do not prefix new components with `App`.

## Issue labels

Follow the label scheme in #565:

- Type: `bug`, `enhancement`, or `refactor` (no user-visible change, including CI and tooling). Exactly one once triaged; a `needs-triage` issue may have several.
- Status: `needs-triage` (the issue needs evidence, scope, or acceptance criteria), `needs-client` (waiting for the client to decide), `blocked` (waiting on something outside the repo). An issue is ready when it has a type and no status label; an issue without a type is implicitly `needs-triage`.
- Priority: `next` (next batch), `deferred` (later).
- Topic, optional: `ui-ux`, `ci-cd`, `security`, `sentry`, `docs`, `DB`.
- Origin: `client`, `project-supervisor`, `legacy`, `ai-generated`.

Add `ai-generated` to every issue and PR you create. When triaging, write the missing evidence, scope, and acceptance criteria, set the type and topics, and remove `needs-triage`.

Triage also records `DB impact: none / possible / confirmed` and `Migration: no / unknown / yes` in the triage comment, with evidence (EF migrations live in `backend/ResearchCruiseApp/Infrastructure/Persistence/Migrations/`). Add `DB` when the impact is possible or confirmed. A missing label doesn't mean the change is safe; ordinary reads and writes of existing records don't qualify.

## Pull requests

- Base every PR on `staging`. `main` only receives releases and hotfixes.
- A PR that depends on another open PR uses that PR's branch as its base and says
  "stacked on #N". Don't use `gh stack`. After the parent is squash-merged, retarget
  the child to `staging` and merge `staging` into it.
- Use `Closes #N` lines, and add a type label, topic labels and `ai-generated`.
- Start a PR over about 300 changed lines with a **Size** block: lines of code to
  review, tests, generated files to skip, and the largest code files.
- A PR that changes what users see has a **Visual comparison** section: before
  (`staging`) and after (PR head) screenshots at the same desktop viewport and mock
  data, plus a short H.264 mp4 for any animation, drag or other interaction change.
  Put a short heading above each image or pair saying what it shows. Label each
  image "BEFORE (staging)" or "AFTER (this PR)" in a header bar, never over
  content, with before on the left. Write images as `![caption](url)` and videos as
  the bare URL, each alone in its own paragraph. Redo the section after visual
  changes.
- Upload screenshots and videos as GitHub attachments, never to a branch.

## Scope

- Make the smallest change that works. Add no wrappers, adapters, helper layers or
  hand-maintained maps, and don't reshuffle unrelated code.
- Bound junk input with a simple, generous cap (for example points ≤ 1,000), not
  exact technical limits. Bugs that need junk or unrealistic input, or that can only
  be reached by calling the API outside the app, are out of scope for the PR.
- If the fix for a small bug passes about 150 lines of code, stop and report before
  going on.
- A problem outside the PR's goal isn't fixed in the PR unless it is small and in
  the same code. Report it with repro steps so it can be filed; skip only nits.
- When the existing design is not idiomatic TanStack (Router, Start, Query, Form,
  Table), report it; don't extend it.
- Never hand-edit generated code (Orval output, OpenAPI JSON); regenerate it.
- Bypass the 7-day package release age only with
  `bun install --minimum-release-age=0`; never add excludes.

## Comments and UI copy

- Write no comments in normal code, configs or CSS unless something is truly
  non-obvious, and at most one short line in tests. Keep CI and release scripts
  simple and flat.
- UI copy is plain Polish that non-technical office staff understand: no "database",
  "value" or "format" jargon.
- Don't use em dashes (—) in UI copy, messages or PR text.
- Everything else (issues, PRs, commits) is in English.

## Tests

- Add a test only for a bug that would recur or fail silently: state logic, races,
  data handling, build config. A PR that doesn't need a test gets none.
- Prefer one cheap unit test on shared logic over several browser tests. Fix rounds
  adjust existing tests; they don't add more.
- Check behaviour and state (roles, accessible names, `aria-invalid`, sent
  requests), not exact wording. If a message must be checked, build the expected
  text from the app's own message function. When copy changes, search the tests for
  fragments of the old text.

## Verifying UI changes

- Desktop first: verify at desktop viewports such as 1380×900. Mobile-only findings
  are out of scope unless asked for.
- Verify interaction fixes (drag, hover, focus) with real mouse and keyboard input
  in Firefox and Chromium, and by measuring what the user sees (sizes, positions,
  overflow), not only with scripted events. Run browsers headless.

## Sentry and personal data

- Production Sentry holds real users' personal data. Use it only to understand a
  bug. Never copy it into issues, PRs, commits, test data or screenshots; refer to
  users and records by ID and reproduce with synthetic data.
- Never create Sentry alert rules or anything else that sends email, and don't send
  test events meant to trigger notifications.
