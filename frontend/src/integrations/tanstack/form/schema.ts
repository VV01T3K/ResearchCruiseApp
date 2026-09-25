import { z } from 'zod';
import { pl } from 'zod/locales';

// Schemas are also used by Storybook and tests, outside the application's entry point.
z.config(pl());

export type FormPath = PropertyKey[];
export type MapFormPath = (path: FormPath) => FormPath;

export function applicationFormPath(path: FormPath): FormPath {
  return path[0] === 'form' ? path.slice(1) : path;
}

/** Keep generated contract validation, but report its issues at editable field paths. */
export function formContract<S extends z.ZodType>(schema: S, mapPath: MapFormPath = (path) => path) {
  return z.transform((value: z.input<S>, ctx) => {
    const result = schema.safeParse(value);
    if (result.success) return result.data;
    for (const issue of result.error.issues) ctx.issues.push({ ...issue, input: undefined, path: mapPath(issue.path) });
    return z.NEVER;
  });
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
