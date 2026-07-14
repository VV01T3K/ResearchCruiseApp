import { z as zod } from 'zod';

export const BlockadeResponse = zod.object({
  "startDate": zod.iso.datetime({"offset":true}),
  "endDate": zod.iso.datetime({"offset":true}),
  "title": zod.string()
});

export type BlockadeResponse = zod.input<typeof BlockadeResponse>;
export type BlockadeResponseOutput = zod.output<typeof BlockadeResponse>;
