# Review priorities

- Prefer findings that identify a concrete user-visible bug, security issue, data-integrity risk, or broken build/test over general refactoring advice.
- Keep the existing layered architecture: API contracts and generated clients, application/domain logic, infrastructure, then UI and test page objects.
- Check that a change is consistent across the backend API, OpenAPI output, generated frontend code, and the UI that consumes it.
- Treat authorization as a server-side requirement. A hidden button or protected route is not sufficient protection.
- For date and timer behavior, require explicit dates and the shared Playwright clock in tests. Do not suggest replacing deterministic tests with waits.
- Keep Polish UI copy consistent with nearby code when a changed component renders user-facing text.
