import { z as zod } from 'zod';

export const CruiseStatus = zod.enum(['new', 'confirmed', 'ended']);

export type CruiseStatus = zod.input<typeof CruiseStatus>;
export type CruiseStatusOutput = zod.output<typeof CruiseStatus>;
