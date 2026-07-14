import type { FormAInitValuesDto as GeneratedFormAInitValuesDto } from '@/api/generated/schemas';

import type { ContractDto } from './ContractDto';
import type { DeepPresent } from './DeepPresent';
import type { FormUserDto } from './FormUserDto';
import type { PublicationDto } from './PublicationDto';
import type { ResearchAreaDto } from './ResearchAreaDto';
import type { ResearchTaskDto } from './ResearchTaskDto';
import type { SpubTaskDto } from './SpubTaskDto';
import type { UgUnitDto } from './UgUnitDto';

type GeneratedInitValues = DeepPresent<GeneratedFormAInitValuesDto>;

export type FormAInitValuesDto = Omit<
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
  cruiseManagers: FormUserDto[];
  deputyManagers: FormUserDto[];
  researchAreas: ResearchAreaDto[];
  historicalResearchTasks: ResearchTaskDto[];
  historicalContracts: ContractDto[];
  ugUnits: UgUnitDto[];
  historicalSpubTasks: SpubTaskDto[];
  historicalPublications: PublicationDto[];
};
