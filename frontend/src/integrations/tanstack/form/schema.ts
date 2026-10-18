import { z } from 'zod';
import { pl } from 'zod/locales';

// Schemas are also used by Storybook and tests, outside the application's entry point.
z.config(pl());

/**
 * Zod skips object refinements while any field fails its type or enum check. This runs a cross-field
 * check unless one of its own fields is invalid, so it reports together with unrelated errors.
 */
export function whenFieldsValid(...fields: string[]) {
  return {
    when: (payload: z.core.ParsePayload) => !payload.issues.some((issue) => fields.includes(String(issue.path?.[0]))),
  };
}

/** Submission intent lives in form state, so editing and submitting use the same rules. */
export function submissionSchema<Values extends { draft?: boolean }, Request>(
  finalSchema: z.ZodType<Request, Values>,
  draftSchema: z.ZodType<Request, Values>
) {
  return z.transform((values: Values, ctx) => {
    const result = (values.draft ? draftSchema : finalSchema).safeParse(values);
    if (result.success) return result.data;
    for (const issue of result.error.issues) ctx.issues.push({ ...issue, input: undefined });
    return z.NEVER;
  });
}
