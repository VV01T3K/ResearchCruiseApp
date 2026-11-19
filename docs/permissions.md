# Permissions

What each role may do, per API endpoint. Paths are the backend's; the frontend calls them under
`/api`. Endpoint access comes from `AuthorizationPolicies`, and the per-record rules from
`UserPermissionVerifier` and `RolePermissionPolicy`.

| Mark      | Meaning                                                                             |
| --------- | ----------------------------------------------------------------------------------- |
| ✅        | Allowed                                                                             |
| **own**   | Only applications where the user is the cruise manager or deputy, and their cruises |
| **lower** | Only users who are not administrators or shipowners                                 |
| ❌        | Not allowed                                                                         |

Signing in needs an accepted account and a confirmed email. Endpoints for administrators and
shipowners, and those closed to guests, check on every request that the account is still accepted.

## Applications

Administrators, shipowners and ship crew see every submitted application. Drafts are visible only
to their own cruise manager and deputy, whatever their role. Guests see no applications.

| Action                                  |  Admin  | Shipowner | Cruise manager | Ship crew | Guest | Endpoint                                                         |
| --------------------------------------- | :-----: | :-------: | :------------: | :-------: | :---: | ---------------------------------------------------------------- |
| List, view, evaluation, managers filter |   ✅    |    ✅     |    **own**     |    ✅     |  ❌   | `GET /applications`, `/managers`, `/{id}`, `/{id}/evaluation`    |
| Applications to plan cruises from       |   ✅    |    ✅     |    **own**     |    ✅     |  ❌   | `GET /applications/for-cruise-planning`                          |
| View Form A, B, C and the cruise        |   ✅    |    ✅     |    **own**     |    ✅     |  ❌   | `GET /applications/{id}/form-a`, `/form-b`, `/form-c`, `/cruise` |
| Form A options                          |   ✅    |    ✅     |       ✅       |    ✅     |  ❌   | `GET /applications/form-a/context`                               |
| Form B options                          |   ✅    |    ✅     |       ✅       |    ✅     |  ✅   | `GET /applications/form-b/context`                               |
| Create Form A                           |   ✅    |    ✅     |       ✅       |    ❌     |  ❌   | `POST /applications`                                             |
| Edit Form A (drafts only)               | **own** |  **own**  |    **own**     |    ❌     |  ❌   | `PUT /applications/{id}/form-a`                                  |
| Fill in Form B and Form C               |   ✅    |  **own**  |    **own**     |    ❌     |  ❌   | `PUT /applications/{id}/form-b`, `/form-c`                       |
| Reopen Form B or Form C                 |   ✅    |    ✅     |       ❌       |    ❌     |  ❌   | `PUT /applications/{id}/form-b/refill`, `/form-c/refill`         |
| Accept or reject an application         |   ✅    |    ✅     |       ❌       |    ❌     |  ❌   | `PUT /applications/{id}/decision`                                |
| Resend the supervisor's email           |   ✅    |    ✅     |       ❌       |    ❌     |  ❌   | `POST /applications/{id}/supervisor-review/invitation`           |

- Whoever creates or edits Form A must be its cruise manager or deputy. The cruise manager must
  be an accepted administrator, shipowner or cruise manager.
- Form A can be edited only as a draft, Form B only while it is required, and Form C only after the
  cruise has ended. Reopening needs a filled-in form.
- The supervisor's review (`GET /applications/{id}/supervisor-review` and
  `PUT …/supervisor-review/decision`) needs no account, only the code from the supervisor's email.

## Cruises

| Action                              | Admin | Shipowner | Cruise manager | Ship crew | Guest | Endpoint                                                                   |
| ----------------------------------- | :---: | :-------: | :------------: | :-------: | :---: | -------------------------------------------------------------------------- |
| List, view and export cruises       |  ✅   |    ✅     |    **own**     |    ✅     |  ✅   | `GET /cruises`, `/{id}`, `/export`                                         |
| Blocked periods                     |  ✅   |    ✅     |       ✅       |    ✅     |  ✅   | `GET /cruises/blockades`                                                   |
| Create, edit and delete cruises     |  ✅   |    ✅     |       ❌       |    ❌     |  ❌   | `POST /cruises`, `PATCH`, `DELETE /cruises/{id}`                           |
| Plan cruises automatically          |  ✅   |    ✅     |       ❌       |    ❌     |  ❌   | `POST /cruises/auto-plan`                                                  |
| Confirm, unconfirm and end a cruise |  ✅   |    ✅     |       ❌       |    ❌     |  ❌   | `PUT`, `DELETE /cruises/{id}/confirmation`, `PUT /cruises/{id}/completion` |

A cruise lists only the applications the user may see, so guests see cruises without their
applications.

## Users

| Action                         |     Admin     | Shipowner | Cruise manager | Ship crew | Guest | Endpoint                                                                         |
| ------------------------------ | :-----------: | :-------: | :------------: | :-------: | :---: | -------------------------------------------------------------------------------- |
| List users                     |      ✅       | **lower** |       ❌       |    ❌     |  ❌   | `GET /users`                                                                     |
| List possible cruise managers  |      ✅       |    ✅     |       ❌       |    ❌     |  ❌   | `GET /users/available-cruise-managers`                                           |
| Create a user                  |      ✅       | **lower** |       ❌       |    ❌     |  ❌   | `POST /users`                                                                    |
| Edit, accept, view assignments |      ✅       | **lower** |       ❌       |    ❌     |  ❌   | `PATCH /users/{id}`, `PUT /users/{id}/acceptance`, `GET /users/{id}/assignments` |
| Deactivate                     | ✅ (not self) | **lower** |       ❌       |    ❌     |  ❌   | `DELETE /users/{id}/acceptance`                                                  |
| Delete                         |      ✅       | **lower** |       ❌       |    ❌     |  ❌   | `DELETE /users/{id}`                                                             |
| Change roles                   |      ✅       | **lower** |       ❌       |    ❌     |  ❌   | `PUT`, `DELETE /users/{id}/roles/{role}`, `PUT /users/{id}/role`                 |

A shipowner can give and take away only the cruise manager, ship crew and guest roles, and works
only on users who have one of them.

## Own account

| Action                                 | Admin | Shipowner | Cruise manager | Ship crew | Guest | Endpoint                                                               |
| -------------------------------------- | :---: | :-------: | :------------: | :-------: | :---: | ---------------------------------------------------------------------- |
| Profile, change password               |  ✅   |    ✅     |       ✅       |    ✅     |  ✅   | `GET /users/me`, `PATCH /users/me/password`                            |
| Own cruise effects                     |  ✅   |    ✅     |       ✅       |    ✅     |  ❌   | `GET /users/me/cruise-effects`                                         |
| Own publications: view, import, delete |  ✅   |    ✅     |       ✅       |    ❌     |  ❌   | `/users/me/publications`, `/publications/import`, `/publications/{id}` |

Registration, email confirmation, password reset, sign-in, refresh and sign-out under `/auth` need
no account. Registering creates a cruise manager account that an administrator or shipowner has to
accept.
