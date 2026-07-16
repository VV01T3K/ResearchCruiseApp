# Auth and context cleanup audit

Audit baseline: `origin/t3code/tanstack-form-cleanup...t3code/remove-custom-contexts`.

The implementation satisfies issues #200 and #214: login redirects now await profile hydration, custom user and application-detail contexts have been replaced, access JWTs remain in memory, and refresh credentials use a restricted HttpOnly cookie. No missing requirement or unrelated scope was found.

## Safe cleanup candidates

1. Replace the custom `useState` + `useEffect` auth-store bridge in `frontend/src/integrations/tanstack/query/auth.ts` with React's `useSyncExternalStore`. This removes subscription plumbing and closes the render-to-effect subscription gap.

2. Remove the duplicate auth-store subscription in `frontend/src/integrations/tanstack/query/AuthSession.tsx`. The component currently reads the store through `useAuthDetails` and subscribes directly to clear the current-user query and invalidate the router. One explicit session-state snapshot and one effect should handle logout transitions. Preserve the distinction between the initial `unknown` state and an authenticated session becoming anonymous.

3. Simplify `frontend/src/lib/guards.ts`. Remove `GlobalGuardType`, redundant explicit return annotations, and the duplicated current-user fetch plus login redirect. A small `requireCurrentUser` helper is enough. Keep `queryClient.fetchQuery`: awaiting stale role revalidation before authorization is security-critical.

4. Replace the five-second expiration poll in `AuthSession.tsx` with a timeout scheduled for the refresh-token deadline.

5. Remove the access-token refresh at the start of `prepareForLogout`. Logout can revoke through the HttpOnly refresh cookie, so rotating a refresh credential immediately before revoking it is unnecessary. Keep the ordering that blocks new refreshes and waits for an already-running refresh before logout reaches the server.

6. Remove the navbar's `onSignOutButtonClicked` wrapper and call `signOut` directly.

7. Consolidate authenticated Playwright route mocks into one configurable helper accepting the current user and refresh response sequence. The same `/refresh` and `/users/me` setup is currently repeated across fixtures and tests.

8. Rename `clearSession` and `clearSessionEverywhere` to make their security-relevant distinction explicit, for example `clearLocalSession` and `broadcastLogout`, or replace them with one operation whose broadcast behavior is explicit.

## Product-policy decision

`AuthSession.tsx` refreshes the session every 30 minutes. This silently creates a sliding session for an idle but open tab, while the application also displays expiration warnings and manual refresh controls.

Choose one policy explicitly:

- Remove background refresh and let actual API activity extend the session. Idle sessions then expire normally and the warning remains meaningful.
- Keep background refresh and document that an open tab is intended to remain signed in.

This is inherited behavior, so changing it is not a purely mechanical cleanup.

## Keep for now

Do not opportunistically remove the following:

- in-tab refresh promise deduplication;
- logout generation checks and late-response rejection;
- cross-tab refresh-rotation conflict recovery;
- stale-role `fetchQuery` guards;
- hashed refresh-token storage and server-side revocation;
- password-change/reset session revocation.

These mechanisms cover tested security and concurrency races.

## Larger redesign

`frontend/src/api/client/auth-session.ts` is an implicit state machine composed of mutable session state, generation/revision counters, logout flags, refresh waiters, and BroadcastChannel messages. It is complex, but much of that complexity compensates for the backend storing one refresh-token hash directly on each user.

That data model also means a login from another browser or device replaces the first device's refresh session. A proper long-term design is a refresh-session/token-family table with one independently revocable session per browser or device. Once that exists, cross-tab refresh can be serialized with an appropriate browser primitive and broadcasts can carry invalidation/logout events instead of access JWTs.

Do not replace the current race handling until browser support, fallback behavior, token reuse detection, rotation, logout, and multi-device revocation are designed and tested together.

## Recommended order

1. Apply the safe local cleanups and tests.
2. Decide the sliding-session policy.
3. Design the refresh-session/token-family model as separate work.
