import type { CruiseEffectResponse } from '@/api/generated/schemas';

import type { ResearchTaskEffectValues } from './ResearchTaskEffectValues';

export type CruiseEffectView = Omit<CruiseEffectResponse, 'effect'> & {
  effect: ResearchTaskEffectValues;
};
