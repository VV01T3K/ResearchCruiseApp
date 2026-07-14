import type { FormAOptions as GeneratedFormAOptions } from '@/api/generated/schemas';

import type { ContractValues } from './ContractValues';
import type { DeepPresent } from '@/types/utils';
import type { UserOption } from './UserOption';
import type { PublicationValues } from './PublicationValues';
import type { ResearchAreaOption } from './ResearchAreaOption';
import type { ResearchTaskValues } from './ResearchTaskValues';
import type { SpubTaskValues } from './SpubTaskValues';
import type { UgUnitOption } from './UgUnitOption';

type GeneratedInitValues = DeepPresent<GeneratedFormAOptions>;

export type FormAOptions = Omit<
  GeneratedInitValues,
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
