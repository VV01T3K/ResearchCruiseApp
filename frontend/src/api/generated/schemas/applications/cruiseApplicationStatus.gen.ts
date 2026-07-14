import { z as zod } from 'zod';

export const CruiseApplicationStatus = zod.enum(['draft', 'waitingForSupervisor', 'acceptedBySupervisor', 'deniedBySupervisor', 'accepted', 'denied', 'formBRequired', 'formBFilled', 'undertaken', 'reported']);

export type CruiseApplicationStatus = zod.input<typeof CruiseApplicationStatus>;
export type CruiseApplicationStatusOutput = zod.output<typeof CruiseApplicationStatus>;
