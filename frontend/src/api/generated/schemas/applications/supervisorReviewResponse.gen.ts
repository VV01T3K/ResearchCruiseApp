import { z as zod } from 'zod';
import { FormAFields } from './formAFields.gen.ts';
import { FormAOptions } from './formAOptions.gen.ts';

export const SupervisorReviewResponse = zod.object({
  "form": FormAFields,
  "initValues": FormAOptions
});

export type SupervisorReviewResponse = zod.input<typeof SupervisorReviewResponse>;
export type SupervisorReviewResponseOutput = zod.output<typeof SupervisorReviewResponse>;
