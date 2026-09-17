import { z as zod } from 'zod';
import { ApplicationResponse } from './applicationResponse.gen.ts';

export const ApplicationsPageResponse = zod.object({
  "items": zod.array(ApplicationResponse),
  "nextCursor": zod.string().nullable()
});

export type ApplicationsPageResponse = zod.input<typeof ApplicationsPageResponse>;
export type ApplicationsPageResponseOutput = zod.output<typeof ApplicationsPageResponse>;
