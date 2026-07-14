import type { CruiseEffectResponse } from '@/api/generated/schemas';

import type { ResearchTaskEffectDto } from './ResearchTaskEffectDto';

export type UserEffectDto = Omit<CruiseEffectResponse, 'effect'> & {
  effect: ResearchTaskEffectDto;
};
