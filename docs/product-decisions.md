# Product decisions

Decisions the owner made on behaviour the issues left open. Follow them; change one
only with the owner's agreement, and update this file in the same PR.

The client is Biuro Armatora. Change its workflow as little as possible: prefer fixes
the office never notices (deduplicated emails, notifying on add to a confirmed cruise)
over new restrictions it would have to learn.

## Cruise numbers (#438, 2026-10-18)

Keep the current scheme exactly:

- Numbers are `YYYY/N`, using the year the cruise was created, and the next number is
  the highest so far plus one.
- Blockades use up numbers like cruises do.
- Deleting the newest cruise frees its number for reuse. "Never reuse" was considered
  and declined.

The only fix is for duplicates: cruise creation is locked (serializable, like edit and
delete) and a clash is retried, so two cruises created at once both succeed. Before
adding a unique index on the number, check production for existing duplicates.

UG's Forms B and C (Rector's order 62/R/24) call it "Numer ewidencyjny rejsu (nadawany
przez Biuro Armatora)", so the number is official, but no public rule sets its format,
year, gaps, reuse or blockades.

## Cruise and application status (#467, #468, #469, 2026-10-17)

1. **Ended cruises are read-only.** `PUT /v2/cruises/{id}` is rejected for an ended
   cruise and the UI hides editing. To change one, undo its completion first. This
   matches deletion, which already refuses ended cruises.
2. **Removing an application from a confirmed cruise** sets it back to `accepted`, so it
   can be planned again. Its stored Form B data is kept, but it must be submitted again
   on the next cruise.
3. **Confirm, undo, confirm again:** only `accepted` applications move to
   `formBRequired` and get an email. A `formBFilled` application stays `formBFilled` and
   gets no second email.
4. **Undoing completion or confirmation is blocked while any application is
   `reported`.** Only the current status is checked: reopening Form C (`reported` back to
   `undertaken`, points kept) and then undoing is accepted.

Existing production data stranded by the old behaviour is left as it is.
