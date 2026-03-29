import { ContractDto } from '@/features/cruise-applications/models/ContractDto';
import { GuestTeamDto } from '@/features/cruise-applications/models/GuestTeamDto';
import { PublicationDto } from '@/features/cruise-applications/models/PublicationDto';
import { ResearchTaskDto } from '@/features/cruise-applications/models/ResearchTaskDto';
import { SpubTaskDto } from '@/features/cruise-applications/models/SpubTaskDto';

export type EvaluationDto = {
  formAResearchTasks: EvaluationFormAResearchTask[];
  formAContracts: EvaluationFormAContract[];
  ugTeams: EvaluationUGTeamDto[];
  guestTeams: GuestTeamDto[];
  ugUnitsPoints: string;
  formAPublications: EvaluationFormAPublication[];
  formASpubTasks: EvaluationFormASpubTask[];
  effectsPoints: string;
};

export type EvaluationFormAResearchTask = {
  id: string;
  researchTask: ResearchTaskDto;
  points: string;
};

export type EvaluationFormAContract = {
  id: string;
  contract: ContractDto;
  points: string;
};

export type EvaluationUGTeamDto = {
  ugUnitName: string;
  noOfEmployees: string;
  noOfStudents: string;
};

export type EvaluationFormAPublication = {
  id: string;
  publication: PublicationDto;
  points: string;
};

export type EvaluationFormASpubTask = {
  id: string;
  spubTask: SpubTaskDto;
  points: string;
};
