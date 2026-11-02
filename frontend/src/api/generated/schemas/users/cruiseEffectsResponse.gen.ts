import * as zod from 'zod';
import { CruiseEffectResponse } from './cruiseEffectResponse.gen.ts';

export const CruiseEffectsResponse = zod.object({
  "items": zod.array(CruiseEffectResponse),
  "skippedCount": zod.int()
});

export type CruiseEffectsResponse = zod.input<typeof CruiseEffectsResponse>;
export type CruiseEffectsResponseOutput = zod.output<typeof CruiseEffectsResponse>;
