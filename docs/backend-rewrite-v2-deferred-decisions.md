# Backend v2 Deferred Decisions

This file records behavior changes that were noticed during the backend v2 port but
are intentionally deferred because deciding them inside the port would mix migration
work with riskier product or cleanup changes.

Use this file for cases where:

- the current behavior is suspicious, awkward, or probably obsolete
- changing it during the port could silently alter product behavior
- the safer path is to preserve behavior for now and handle the decision in a
  separate follow-up PR

Each deferred item should state the current behavior, why the decision is deferred,
the evidence gathered so far, and the later decision that still needs to be made.

## Open Decisions

### Current-user publications and cruise effects cleanup

**Current behavior**

- Publication import deduplicates against existing publication rows, skips imports with
  zero ministerial points, and only deletes shared publication rows when no Form A or
  other user-publication references remain.
- Current-user cruise effects keep the existing response shape while the route moves
  under `/v2/account/me`.

**Why deferred**

- Those rules are intertwined with existing form workflows and are safer to preserve
  during route migration.
- More opinionated lifecycle or contract cleanup should happen after the port in a
  focused PR with a product decision attached, not as an incidental side effect of the
  v2 move.

**Later decision**

- After the v2 port is complete, review whether publication import/delete behavior and
  the cruise-effects response should stay as-is or be redesigned deliberately.

### User-management surface cleanup

**Current behavior**

- The live admin/shipowner workflow uses list/create/update/delete, acceptance
  toggling, and the available-cruise-managers query.
- Existing permission rules filter which users shipowners can see or mutate and
  preserve the last-administrator invariant through the identity service.

**Why deferred**

- The long-term rewrite plan sketches additional user resources, but the current app
  does not consume them yet.
- Adding or redesigning user-management behavior during this port would mix migration
  work with product-surface decisions that deserve their own review.

**Later decision**

- After the v2 port is complete, decide whether the broader planned users surface
  should be added, whether the current privileged-management contract should be
  reshaped further, and whether the existing permission model needs any deliberate
  cleanup.

### Cruise contract and lifecycle cleanup

**Current behavior**

- The v2 cruise read contract groups managers and attached applications more clearly,
  but keeps the existing localized status values and current lifecycle behavior.
- Cruise creation, reassignment, automatic planning, confirmation, completion, and
  deletion preserve the existing rules while moving under `/v2`.

**Why deferred**

- Status normalization and broader lifecycle redesign would change more than routing
  and wire shape.
- Those choices deserve a focused product review after the port rather than being
  folded into the migration PR.

**Later decision**

- After the v2 port is complete, decide whether cruise statuses should move to stable
  machine values, whether lifecycle actions should be reshaped further, and whether
  the current auto-planning and reassignment semantics should be revised.

### Application contract and workflow cleanup

**Current behavior**

- The first v2 application slice groups manager data in reads, but preserves current
  localized status values, evaluation output, and decision semantics.
- Form workflows and supervisor review stay on their existing behavior until their
  own migration slices.

**Why deferred**

- Status normalization, form-workflow redesign, and broader application-model cleanup
  would change product behavior beyond the route migration itself.
- The application area is large enough that those choices should be reviewed after the
  whole surface is visible under v2, not mixed into the first catalog/decision move.

**Later decision**

- After the v2 port is complete, decide whether application statuses should become
  stable machine values, whether the form workflow should be reshaped, and whether
  evaluation or decision contracts need deliberate redesign.

### Authenticated application-form cleanup

**Current behavior**

- The authenticated Form A/B/C workflow keeps the existing DTO shapes, draft
  semantics, status transitions, and refill behavior while moving under `/v2`.
- Anonymous supervisor review remains separate from the authenticated form flow.

**Why deferred**

- The current form payloads are large and tightly coupled to existing UI workflows.
- Reshaping those contracts during route migration would mix a broad product redesign
  into a behavior-preserving port.

**Later decision**

- After the v2 port is complete, decide whether the form contracts, naming, and
  workflow boundaries should be redesigned deliberately.

### Supervisor-review cleanup

**Current behavior**

- Anonymous supervisor review uses the existing supervisor code as the public-link
  credential.
- The v2 read endpoint bundles Form A plus reduced Form A init values, while the
  decision endpoint preserves the existing accept/deny state rules.

**Why deferred**

- Token semantics, response shape, and lifecycle messaging are public-link behavior
  with product and security implications.
- The main port should preserve the current review workflow first, then revisit it in
  a focused follow-up PR if a cleaner design is wanted.

**Later decision**

- After the v2 port is complete, decide whether supervisor review should keep its
  current code model and payload shape or move to a deliberately redesigned public
  review contract.

## Resolved Decisions

### Email confirmation `changedEmail` branch

**Resolution**

- Removed the dormant `changedEmail` branch after the live v2 port was complete.
- Email confirmation now accepts only `userId` and `code` in both v1 and v2 during
  route coexistence.

**Why**

- The frontend confirmation caller only used `userId` and `code`.
- Confirmation links emitted by the backend only contained `userId` and `code`.
- The admin user-edit flow changes stored email directly and never minted or sent a
  change-email confirmation token.
- No live source path called the change-email token generation branch.

**Follow-up boundary**

- If product work later needs confirmed email changes, add a deliberate workflow for
  it instead of reviving the removed hidden branch.
