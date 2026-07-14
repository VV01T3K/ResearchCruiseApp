import { z as zod } from 'zod';
import { FormADto } from './formADto.gen.ts';
import { FormAInitValuesDto } from './formAInitValuesDto.gen.ts';

export const SupervisorReviewResponse = zod.object({
  "form": FormADto,
  "initValues": FormAInitValuesDto
});

export type SupervisorReviewResponse = zod.input<typeof SupervisorReviewResponse>;
export type SupervisorReviewResponseOutput = zod.output<typeof SupervisorReviewResponse>;
