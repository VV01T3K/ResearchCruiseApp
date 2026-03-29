import { ContractDto } from '@/api/dto/applications/ContractDto';
import { GuestTeamDto } from '@/api/dto/applications/GuestTeamDto';
import { PublicationDto } from '@/api/dto/applications/PublicationDto';
import { ResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';
import { SpubTaskDto } from '@/api/dto/applications/SpubTaskDto';

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
