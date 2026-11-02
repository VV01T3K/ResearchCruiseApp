import * as zod from 'zod';

export const ImportPublicationsResponse = zod.object({
  "imported": zod.int(),
  "alreadyExisting": zod.int(),
  "skippedWithoutPoints": zod.int()
});

export type ImportPublicationsResponse = zod.input<typeof ImportPublicationsResponse>;
export type ImportPublicationsResponseOutput = zod.output<typeof ImportPublicationsResponse>;
