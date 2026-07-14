import type { CruiseApplicationDto as GeneratedCruiseApplicationDto } from '@/api/generated/schemas';

import type { DeepRequired } from '@/types/utils';

type GeneratedApplication = DeepRequired<GeneratedCruiseApplicationDto>;

export type CruiseApplicationDto = Omit<GeneratedApplication, 'cruiseDays'> & {
  cruiseDays: number | null;
};
