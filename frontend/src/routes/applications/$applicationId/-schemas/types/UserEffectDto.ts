import type { CruiseEffectResponse } from '@/api/gen/model';

import type { ResearchTaskEffectDto } from './ResearchTaskEffectDto';

export type UserEffectDto = Omit<CruiseEffectResponse, 'effect'> & {
  effect: ResearchTaskEffectDto;
};
