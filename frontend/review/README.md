# Forms review

Run from `frontend`:

```sh
vp exec playwright test --config review/playwright.config.ts
```

The recording is written to `artifacts/forms-review/` at the repository root. It uses the existing API fixtures, with draft saves persisted by the recording's route mock. It demonstrates frontend behavior, not a live backend/database integration. The recording is separate from the normal test suite; its pauses are for manual review.

## Implementation

- `api/generated/` supplies endpoint functions, query hooks, request schemas and response types. `api/fetch.ts` only handles HTTP transport and authentication. Response-normalization modules and the `api/client/` directory have been removed.
- Backend response metadata marks always-returned properties as required. Regenerate with `vp run gen` after updating the OpenAPI snapshot. No database migration is involved.
- `integrations/tanstack/form/fields.tsx` registers `AppField` adapters. The input components take ordinary props and can render outside a form.
- Editable schemas retain Polish business messages and transform into generated request schemas. Parse explicitly when submitting: TanStack validation does not replace the submitted values with Zod's transformed output.
- Application draft intent lives in form state. Draft and final saves share TanStack's validation/submission lifecycle, with separate schemas. Drafts still use the existing API/storage contract.
- Initial validation runs on blur, correction runs on change, and submission validates the whole form. Numeric coercion/clamping remains immediate. Failed requests retain values and do not mark submission successful.
- Query caches retain API responses; form conversion happens in query selectors. Print templates receive values as props.

## Upstream guidance

- [TanStack form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition)
- [TanStack dynamic validation](https://tanstack.com/form/latest/docs/framework/react/guides/dynamic-validation)
- [TanStack submission handling](https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling)
- [Zod error customization](https://zod.dev/error-customization)
- [Orval Zod generation](https://orval.dev/docs/guides/zod/)
