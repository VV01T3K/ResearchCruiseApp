import { ContractDto } from '@/api/dto/applications/ContractDto';
import { FormUserDto } from '@/api/dto/applications/FormUserDto';
import { PublicationDto } from '@/api/dto/applications/PublicationDto';
import { ResearchAreaDto } from '@/api/dto/applications/ResearchAreaDto';
import { ResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';
import { SpubTaskDto } from '@/api/dto/applications/SpubTaskDto';
import { UgUnitDto } from '@/api/dto/applications/UgUnitDto';

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
