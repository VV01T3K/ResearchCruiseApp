import { ContractDto } from '@/api/applications/dto/ContractDto';
import { FormUserDto } from '@/api/applications/dto/FormUserDto';
import { PublicationDto } from '@/api/applications/dto/PublicationDto';
import { ResearchAreaDto } from '@/api/applications/dto/ResearchAreaDto';
import { ResearchTaskDto } from '@/api/applications/dto/ResearchTaskDto';
import { SpubTaskDto } from '@/api/applications/dto/SpubTaskDto';
import { UgUnitDto } from '@/api/applications/dto/UgUnitDto';

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
