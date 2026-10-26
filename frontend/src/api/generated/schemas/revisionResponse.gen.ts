import * as zod from 'zod';

export const RevisionResponse = zod.object({
  "revision": zod.string()
});

export type RevisionResponse = zod.input<typeof RevisionResponse>;
export type RevisionResponseOutput = zod.output<typeof RevisionResponse>;
