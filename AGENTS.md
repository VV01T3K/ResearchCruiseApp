# Repository instructions

## Commits and branches

- Conventional Commits: `type(scope): description`, imperative, for example
  `fix(table): correct accessible row totals`.
- Never rewrite `staging` or `main`. Rebase your own PR branch freely unless another
  PR is stacked on it; then merge instead.

## Pull requests

- Base on `staging`. `main` only receives releases.
- A PR that depends on an open PR uses that branch as its base and says "stacked on
  #N". Don't use `gh stack`. After the parent is squash-merged, retarget to `staging`
  and merge `staging` in.
- Add `Closes #N`, one type label, topic labels and `ai-generated`.
- Over about 300 changed lines, start with a **Size** block: lines to review, tests,
  generated files to skip, largest files.
- A change users can see needs a **Visual comparison**: before (`staging`) and after
  screenshots at the same desktop viewport and mock data, before on the left, each
  labelled "BEFORE (staging)" or "AFTER (this PR)" in a header bar and under a short
  heading. Add a short H.264 mp4 for any interaction change. Write images as
  `![caption](url)` and videos as a bare URL, each in its own paragraph. Upload them
  as GitHub attachments, never to a branch, and redo them after visual changes.

## Issue labels

- Type, exactly one once triaged: `bug`, `enhancement`, `refactor` (no user-visible
  change, including CI and tooling).
- Status: `needs-triage`, `needs-client`, `blocked`. An issue with a type and no
  status is ready; one without a type is `needs-triage`.
- Priority: `next`, `deferred`.
- Topic, optional: `ui-ux`, `ci-cd`, `security`, `sentry`, `docs`, `DB`.
- Origin: `client`, `project-supervisor`, `legacy`, `ai-generated` (on everything
  you create).

Triaging means writing the missing evidence, scope and acceptance criteria, setting
type and topics, and removing `needs-triage`. The triage comment also records
`DB impact: none / possible / confirmed` and `Migration: no / unknown / yes` with
evidence. Add `DB` when the impact is possible or confirmed; ordinary reads and
writes of existing records don't count.

## Scope

- Make the smallest change that works: no wrappers, adapters, helper layers or
  hand-maintained maps, and no reshuffling of unrelated code.
- If the fix for a small bug passes about 150 lines, stop and report.
- Fix a problem outside the PR's goal only when it is small and in the same code.
  Otherwise report it with repro steps; skip nits.
- Cap junk input with a simple, generous limit (for example points ≤ 1,000). Bugs
  that need unrealistic input or calling the API outside the app are out of scope.
- Never hand-edit generated code (Orval output, OpenAPI JSON); regenerate it.
- Bypass the 7-day package release age only with
  `bun install --minimum-release-age=0`; never add excludes.

## Frontend

- Code used by one route stays next to it in a `-` prefixed folder. Code used by
  several routes goes in `frontend/src/features/<feature>/`. TanStack adapters and
  helpers go in `frontend/src/integrations/tanstack/<library>/`.
- `shared` and `common` directories are legacy: add nothing to them and create no
  new generic directory. Don't prefix components with `App`.
- When the existing design is not idiomatic TanStack, report it; don't extend it.

## Comments and copy

- No comments in code, configs or CSS unless something is truly non-obvious; at most
  one short line in tests. Keep CI and release scripts simple and flat.
- UI copy is plain Polish for non-technical office staff: no "database", "value" or
  "format" jargon. Issues, PRs and commits are in English.
- No em dashes (—) in UI copy, messages or PR text.

## Tests

- Add a test only for a bug that would recur or fail silently: state logic, races,
  data handling, build config. Fix rounds adjust existing tests, not add more.
- Prefer one unit test on shared logic over several browser tests.
- Assert behaviour and state (roles, accessible names, `aria-invalid`, sent
  requests), not wording. If a message must be checked, build it with the app's own
  message function. When copy changes, search the tests for the old text.

## Verifying UI changes

- Desktop first, around 1380×900. Mobile-only findings are out of scope unless asked.
- Verify drag, hover and focus fixes with real mouse and keyboard input in Firefox
  and Chromium, headless, and measure what the user sees (sizes, positions,
  overflow), not only scripted events.

## Sentry and personal data

- Production Sentry holds real users' personal data. Use it only to understand a
  bug; never copy it into issues, PRs, commits, test data or screenshots. Refer to
  records by ID and reproduce with synthetic data.
- Never create Sentry alert rules or anything else that sends email, and don't send
  test events meant to trigger notifications.
