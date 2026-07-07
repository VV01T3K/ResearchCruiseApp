# TanStack Form observability in Sentry

Status: proposed replacement for the current `trackFormSubmit` breadcrumb helper.

## Summary

The current implementation records `valid` and `invalid` submit attempts as Sentry breadcrumbs. This is useful as
context attached to a later error, but it is not sufficient for tracking form outcomes:

- a breadcrumb is not sent as a standalone event;
- `valid` currently means that client-side validation passed, not that the API operation succeeded;
- validation messages can contain sensitive or high-cardinality data;
- every form has to call the helper manually, and some complex forms bypass TanStack Form's submission lifecycle.

Use an application-owned adapter around TanStack Form's supported `onSubmit` and `onSubmitInvalid` callbacks. Emit a
structured Sentry log for each final outcome, retain a minimal breadcrumb for debugging context, and create a span
around the awaited submission operation when its duration is useful.

Do not use `formEventClient` as the integration point. Although it is exported by TanStack Form, it is the event bus
for Form Devtools. In TanStack Form 1.28.0 it does not emit an event for every path that invokes `onSubmitInvalid`, so
it is not a reliable production observability contract.

## Signals and their purpose

| Sentry signal | Use for | Do not use for |
| --- | --- | --- |
| Structured log | Queryable validation and submission outcomes | Raw form values or validation messages |
| Breadcrumb | The sequence of form actions before a later error | Counting all submissions |
| Span | End-to-end submission latency and trace correlation | Unsampled business analytics |
| Exception | Unexpected failures requiring investigation | Normal validation failures or rejected credentials |

Sentry is appropriate for operational questions such as "which form is failing after a deployment?" Product funnels,
conversion rates, and long-term behavioral analytics should use a dedicated analytics system.

## Event model

Every form must have a stable `formId`. Use it as the only form name in telemetry.

Record these outcomes:

| Outcome | Meaning | Where to record it |
| --- | --- | --- |
| `validation_failed` | TanStack Form rejected the submit attempt | `onSubmitInvalid`, after validation finishes |
| `succeeded` | The awaited API operation completed successfully | After the mutation resolves successfully |
| `rejected` | The server returned an expected business rejection | After interpreting the API result |
| `failed` | The request failed unexpectedly or could not complete | In the submission error path |

Passing client-side validation is not a final outcome and must not be called `valid` or `succeeded`.

The common attributes are:

```text
form.id                 Stable form identifier, for example "login" or "form-a"
form.outcome            validation_failed, succeeded, rejected, or failed
form.submission_attempt TanStack Form's submissionAttempts value when available
form.invalid_fields     Comma-separated normalized field paths, only for validation_failed
form.invalid_count      Number of invalid fields, only for validation_failed
```

Normalize array indices before recording field paths. For example, `members[3].email` becomes `members[].email`. This
prevents unbounded attribute cardinality while preserving the location of the problem.

## Data minimization

Never send:

- form values;
- email addresses, passwords, names, free-text fields, or uploaded file names;
- full validation messages;
- raw API response bodies;
- array indices or database identifiers embedded in field paths.

Field names and counts are sufficient for diagnosing validation behavior. If a validator needs additional telemetry,
add a stable error code such as `required` or `invalid_date_range`; do not use its user-facing message.

All telemetry helpers must remain no-ops when the Sentry DSN is empty.

## Integration shape

Standard forms should use TanStack Form's normal submission lifecycle:

```tsx
const form = useForm({
  formId: 'login',
  defaultValues: {
    email: '',
    password: '',
  },
  validators: {
    onChange: validationSchema,
  },
  onSubmitInvalid: ({ formApi }) => {
    recordFormValidationFailure(formApi);
  },
  onSubmit: async ({ value, formApi }) => {
    await observeFormSubmission(formApi, async () => {
      await submitLogin(value);
    });
  },
});
```

`recordFormValidationFailure` should add an info-level structured log and a minimal breadcrumb.
`observeFormSubmission` should:

1. create a `ui.form.submit` span with the stable form ID;
2. await the complete API or mutation operation;
3. record `succeeded`, `rejected`, or `failed` only after the result is known;
4. set the span status from the final result;
5. rethrow unexpected errors unless the caller deliberately handles them.

Expected rejections, such as invalid credentials, are logs and failed spans rather than Sentry issues. Capture an
exception only when it represents a defect or unexpected operational failure and is not already captured elsewhere.

The adapter should compose any caller-provided `onSubmitInvalid` behavior instead of replacing it. Keep the adapter
small and application-owned; copying TanStack Form's generic `useForm` signature into a wrapper would make upgrades
needlessly brittle.

## Complex forms

Forms A, B, C, new application, and new cruise currently call `form.validate('change')` and then start mutations
outside `form.handleSubmit()`. They must still use the same event model during migration:

- record `validation_failed` after explicit validation fails;
- wrap the awaited mutation with `observeFormSubmission`;
- record success only after the mutation resolves.

Where practical, move these flows to `form.handleSubmit()`, `onSubmit`, and `onSubmitInvalid` so TanStack Form owns the
submission state. Draft saves are a separate operation and should use a distinct form operation attribute or form ID;
they must not be counted as final submissions.

## Rollout checklist

- [ ] Add a stable `formId` to every observed form.
- [ ] Replace `trackFormSubmit(..., 'valid', ...)` with post-mutation outcomes.
- [ ] Stop sending `form_errors` and user-facing validation messages.
- [ ] Add normalized invalid field names and counts.
- [ ] Emit structured logs; keep breadcrumbs only as diagnostic context.
- [ ] Add spans around awaited submissions where latency matters.
- [ ] Cover success, validation failure, expected rejection, and unexpected failure in tests.
- [ ] Verify that no form values or personal data appear in Sentry Logs, Traces, Issues, or Replay metadata.

## References

- [TanStack Form `FormOptions`](https://tanstack.com/form/latest/docs/reference/interfaces/FormOptions)
- [TanStack Form listeners](https://tanstack.com/form/latest/docs/framework/react/guides/listeners)
- [Sentry breadcrumbs](https://docs.sentry.io/platforms/javascript/guides/react/enriching-events/breadcrumbs/)
- [Sentry logs](https://docs.sentry.io/platforms/javascript/guides/react/logs/)
- [Sentry custom tracing](https://docs.sentry.io/platforms/javascript/guides/react/tracing/instrumentation/custom-instrumentation/)

