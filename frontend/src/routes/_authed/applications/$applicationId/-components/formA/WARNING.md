# Form A Components

This folder intentionally lives next to the other application forms (`formB` and `formC`), but it is used by routes outside `/$applicationId`.

Current route usage:

- `frontend/src/routes/applications/$applicationId/formA.tsx`
- `frontend/src/routes/applications/new.tsx`
- `frontend/src/routes/cruise-approval.tsx`

Before moving or renaming these components, update all three routes and the related Storybook stories.
