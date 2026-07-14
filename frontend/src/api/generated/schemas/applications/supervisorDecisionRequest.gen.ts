import { z as zod } from 'zod';

export const SupervisorDecisionRequest = zod.object({
  "accept": zod.boolean(),
  "code": zod.string()
});

export type SupervisorDecisionRequest = zod.input<typeof SupervisorDecisionRequest>;
export type SupervisorDecisionRequestOutput = zod.output<typeof SupervisorDecisionRequest>;
