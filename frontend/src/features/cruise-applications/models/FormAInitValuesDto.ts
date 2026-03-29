import { ContractDto } from '@/features/cruise-applications/models/ContractDto';
import { FormUserDto } from '@/features/cruise-applications/models/FormUserDto';
import { PublicationDto } from '@/features/cruise-applications/models/PublicationDto';
import { ResearchAreaDto } from '@/features/cruise-applications/models/ResearchAreaDto';
import { ResearchTaskDto } from '@/features/cruise-applications/models/ResearchTaskDto';
import { SpubTaskDto } from '@/features/cruise-applications/models/SpubTaskDto';
import { UgUnitDto } from '@/features/cruise-applications/models/UgUnitDto';

export type FormAInitValuesDto = {
  cruiseManagers: FormUserDto[];
  deputyManagers: FormUserDto[];
  years: string[];
  shipUsages: string[];
  standardSpubTasks: string[];
  researchAreas: ResearchAreaDto[];
  cruiseGoals: string[];
  historicalResearchTasks: ResearchTaskDto[];
  historicalContracts: ContractDto[];
  ugUnits: UgUnitDto[];
  historicalGuestInstitutions: string[];
  historicalSpubTasks: SpubTaskDto[];
  historicalPublications: PublicationDto[];
};
