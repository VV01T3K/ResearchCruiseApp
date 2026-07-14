import type {
  ApplicationResponse as GeneratedApplicationResponse,
  CruiseApplicationEvaluationDetailsDto,
} from '@/api/gen/model';
import type { DeepPresent } from '@/routes/applications/$applicationId/-schemas/types/DeepPresent';
import type { ContractDto } from '@/routes/applications/$applicationId/-schemas/types/ContractDto';
import type { GuestTeamDto } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamDto';
import type { PublicationDto } from '@/routes/applications/$applicationId/-schemas/types/PublicationDto';
import type { ResearchTaskDto } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskDto';
import type { SpubTaskDto } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskDto';

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

export type ApplicationResponse = Omit<GeneratedApplicationResponse, 'status' | 'year' | 'points' | 'cruiseDays'> & {
  status: ApplicationStatus;
  year: number;
  points: number;
  cruiseDays: number | null;
};
type GeneratedEvaluation = DeepPresent<CruiseApplicationEvaluationDetailsDto>;
type GeneratedResearchTask = GeneratedEvaluation['formAResearchTasks'][number];
type GeneratedContract = GeneratedEvaluation['formAContracts'][number];
type GeneratedPublication = GeneratedEvaluation['formAPublications'][number];
type GeneratedSpubTask = GeneratedEvaluation['formASpubTasks'][number];

export type EvaluationFormAResearchTask = Omit<GeneratedResearchTask, 'researchTask'> & {
  researchTask: ResearchTaskDto;
};
export type EvaluationFormAContract = Omit<GeneratedContract, 'contract'> & {
  contract: ContractDto;
};
export type EvaluationUgTeamResponse = GeneratedEvaluation['ugTeams'][number];
export type EvaluationFormAPublication = Omit<GeneratedPublication, 'publication'> & {
  publication: PublicationDto;
};
export type EvaluationFormASpubTask = Omit<GeneratedSpubTask, 'spubTask'> & {
  spubTask: SpubTaskDto;
};
export type EvaluationResponse = Omit<
  GeneratedEvaluation,
  'formAResearchTasks' | 'formAContracts' | 'guestTeams' | 'formAPublications' | 'formASpubTasks'
> & {
  formAResearchTasks: EvaluationFormAResearchTask[];
  formAContracts: EvaluationFormAContract[];
  guestTeams: GuestTeamDto[];
  formAPublications: EvaluationFormAPublication[];
  formASpubTasks: EvaluationFormASpubTask[];
};
