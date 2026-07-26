import type { FormAOptions as GeneratedFormAOptions } from '@/api/generated/schemas';

import type { ContractValues } from '@/routes/applications/$applicationId/-schemas/types/ContractValues';
import type { UserOption } from '@/api/client/applications/types/UserOption';
import type { PublicationValues } from '@/routes/applications/$applicationId/-schemas/types/PublicationValues';
import type { ResearchAreaOption } from '@/api/client/applications/types/ResearchAreaOption';
import type { ResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import type { SpubTaskValues } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskValues';
import type { UgUnitOption } from '@/api/client/applications/types/UgUnitOption';

export type FormAOptions = Omit<
  Required<GeneratedFormAOptions>,
  | 'cruiseManagers'
  | 'deputyManagers'
  | 'researchAreas'
  | 'historicalResearchTasks'
  | 'historicalContracts'
  | 'ugUnits'
  | 'historicalSpubTasks'
  | 'historicalPublications'
> & {
  cruiseManagers: UserOption[];
  deputyManagers: UserOption[];
  researchAreas: ResearchAreaOption[];
  historicalResearchTasks: ResearchTaskValues[];
  historicalContracts: ContractValues[];
  ugUnits: UgUnitOption[];
  historicalSpubTasks: SpubTaskValues[];
  historicalPublications: PublicationValues[];
};
