import * as zod from 'zod';
import { SkippedApplicationResponse } from './skippedApplicationResponse.gen.ts';

export const AutoPlanResponse = zod.object({
  "plannedCount": zod.int(),
  "skipped": zod.array(SkippedApplicationResponse)
});

export type AutoPlanResponse = zod.input<typeof AutoPlanResponse>;
export type AutoPlanResponseOutput = zod.output<typeof AutoPlanResponse>;
