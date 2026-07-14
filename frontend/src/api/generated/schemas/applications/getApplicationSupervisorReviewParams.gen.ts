import { z as zod } from 'zod';

export const GetApplicationSupervisorReviewParams = zod.object({
  "code": zod.string()
})

export type GetApplicationSupervisorReviewParams = zod.input<typeof GetApplicationSupervisorReviewParams>;
export type GetApplicationSupervisorReviewParamsOutput = zod.output<typeof GetApplicationSupervisorReviewParams>;
