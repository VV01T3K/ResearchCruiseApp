import type { CruiseEffectResponse } from '@/api/generated/schemas';

import type { ResearchTaskEffectValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskEffectValues';

export type CruiseEffectView = Omit<CruiseEffectResponse, 'effect'> & {
  effect: ResearchTaskEffectValues;
};
