import { ContractDto } from '@/api/dto/applications/ContractDto';
import { FormADto } from '@/api/dto/applications/FormADto';
import { FormAInitValuesDto } from '@/api/dto/applications/FormAInitValuesDto';
import { GuestTeamDto } from '@/api/dto/applications/GuestTeamDto';
import { PublicationDto } from '@/api/dto/applications/PublicationDto';
import { ResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';
import { SpubTaskDto } from '@/api/dto/applications/SpubTaskDto';

export enum ApplicationStatus {
  Draft = 'Wersja robocza',
  New = 'Nowe',
  Accepted = 'Zaakceptowane',
  WaitingForSupervisor = 'Oczekujące na przełożonego',
  AcceptedBySupervisor = 'Zaakceptowane przez przełożonego',
  Denied = 'Odrzucone',
  DeniedBySupervisor = 'Odrzucone przez przełożonego',
  FormBRequired = 'Wymagane uzupełnienie formularza B przez kierownika',
  FormBFilled = 'Formularz B wypełniony. Oczekiwanie na rejs',
  Undertaken = 'Zrealizowane',
  Reported = 'Rozliczone',
}

export type ApplicationPersonResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type ApplicationResponse = {
  id: string;
  number: string;
  year: number;
  date: string;
  mainManager: ApplicationPersonResponse;
  deputyManager: ApplicationPersonResponse;
  hasFormA: boolean;
  hasFormB: boolean;
  hasFormC: boolean;
  points: number;
  status: ApplicationStatus;
  effectsDoneRate: string;
  note: string | null;
  cruiseHours: string | null;
  cruiseDays: number | null;
  acceptablePeriodBeg: string | null;
  acceptablePeriodEnd: string | null;
  optimalPeriodBeg: string | null;
  optimalPeriodEnd: string | null;
  precisePeriodStart: string | null;
  precisePeriodEnd: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type EvaluationResponse = {
  formAResearchTasks: EvaluationFormAResearchTask[];
  formAContracts: EvaluationFormAContract[];
  ugTeams: EvaluationUgTeamResponse[];
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

export type EvaluationUgTeamResponse = {
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

export type SupervisorReviewResponse = {
  form: FormADto;
  initValues: FormAInitValuesDto;
};
