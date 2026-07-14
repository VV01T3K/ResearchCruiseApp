import { z as zod } from 'zod';

export const ApplicationDecisionRequest = zod.object({
  "accept": zod.boolean()
});

export type ApplicationDecisionRequest = zod.input<typeof ApplicationDecisionRequest>;
export type ApplicationDecisionRequestOutput = zod.output<typeof ApplicationDecisionRequest>;
