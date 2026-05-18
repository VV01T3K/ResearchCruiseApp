import { ContractDto } from '@/api/dto/applications/ContractDto';
import { FormADto } from '@/api/dto/applications/FormADto';
import { FormAInitValuesDto } from '@/api/dto/applications/FormAInitValuesDto';
import { GuestTeamDto } from '@/api/dto/applications/GuestTeamDto';
import { PublicationDto } from '@/api/dto/applications/PublicationDto';
import { ResearchTaskDto } from '@/api/dto/applications/ResearchTaskDto';
import { SpubTaskDto } from '@/api/dto/applications/SpubTaskDto';

export enum ApplicationStatus {
  Draft = 'draft',
  Accepted = 'accepted',
  WaitingForSupervisor = 'waitingForSupervisor',
  AcceptedBySupervisor = 'acceptedBySupervisor',
  Denied = 'denied',
  DeniedBySupervisor = 'deniedBySupervisor',
  FormBRequired = 'formBRequired',
  FormBFilled = 'formBFilled',
  Undertaken = 'undertaken',
  Reported = 'reported',
}

export function getApplicationStatusLabel(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.Draft:
      return 'Wersja robocza';
    case ApplicationStatus.WaitingForSupervisor:
      return 'Oczekujące na przełożonego';
    case ApplicationStatus.AcceptedBySupervisor:
      return 'Zaakceptowane przez przełożonego';
    case ApplicationStatus.DeniedBySupervisor:
      return 'Odrzucone przez przełożonego';
    case ApplicationStatus.Accepted:
      return 'Zaakceptowane';
    case ApplicationStatus.Denied:
      return 'Odrzucone';
    case ApplicationStatus.FormBRequired:
      return 'Wymagane uzupełnienie formularza B przez kierownika';
    case ApplicationStatus.FormBFilled:
      return 'Formularz B wypełniony. Oczekiwanie na rejs';
    case ApplicationStatus.Undertaken:
      return 'Zrealizowane';
    case ApplicationStatus.Reported:
      return 'Rozliczone';
  }
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
