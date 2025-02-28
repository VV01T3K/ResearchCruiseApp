import { ContractDto } from '@/cruise-applications/models/ContractDto';
import { FormUserDto } from '@/cruise-applications/models/FormUserDto';
import { PublicationDto } from '@/cruise-applications/models/PublicationDto';
import { ResearchAreaDto } from '@/cruise-applications/models/ResearchAreaDto';
import { ResearchTaskDto } from '@/cruise-applications/models/ResearchTaskDto';
import { SpubTaskDto } from '@/cruise-applications/models/SpubTaskDto';
import { UgUnitDto } from '@/cruise-applications/models/UgUnitDto';

export type FormAInitValuesDto = {
  cruiseManagers: FormUserDto[];
  deputyManagers: FormUserDto[];
  years: string[];
  shipUsages: string[];
  researchAreas: ResearchAreaDto[];
  cruiseGoals: string[];
  historicalResearchTasks: ResearchTaskDto[];
  historicalContracts: ContractDto[];
  ugUnits: UgUnitDto[];
  historicalGuestInstitutions: string[];
  historicalSpubTasks: SpubTaskDto[];
  historicalPublications: PublicationDto[];
};
