import type {
  ApplicationResponse as GeneratedApplicationResponse,
  CruiseApplicationStatus as GeneratedCruiseApplicationStatus,
  CruiseApplicationEvaluation,
} from '@/api/generated/schemas';
import type { DeepPresent } from '@/types/utils';
import type { ContractValues } from '@/routes/applications/$applicationId/-schemas/types/ContractValues';
import type { GuestTeamValues } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import type { PublicationValues } from '@/routes/applications/$applicationId/-schemas/types/PublicationValues';
import type { ResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import type { SpubTaskValues } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskValues';

export const ApplicationStatus = {
  Draft: 'draft',
  Accepted: 'accepted',
  WaitingForSupervisor: 'waitingForSupervisor',
  AcceptedBySupervisor: 'acceptedBySupervisor',
  Denied: 'denied',
  DeniedBySupervisor: 'deniedBySupervisor',
  FormBRequired: 'formBRequired',
  FormBFilled: 'formBFilled',
  Undertaken: 'undertaken',
  Reported: 'reported',
} as const satisfies Record<string, GeneratedCruiseApplicationStatus>;

export type ApplicationStatus = GeneratedCruiseApplicationStatus;

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

export type ApplicationResponse = GeneratedApplicationResponse;
type GeneratedEvaluation = DeepPresent<CruiseApplicationEvaluation>;
type GeneratedResearchTask = GeneratedEvaluation['formAResearchTasks'][number];
type GeneratedContract = GeneratedEvaluation['formAContracts'][number];
type GeneratedPublication = GeneratedEvaluation['formAPublications'][number];
type GeneratedSpubTask = GeneratedEvaluation['formASpubTasks'][number];

export type EvaluationFormAResearchTask = Omit<GeneratedResearchTask, 'researchTask'> & {
  researchTask: ResearchTaskValues;
};
export type EvaluationFormAContract = Omit<GeneratedContract, 'contract'> & {
  contract: ContractValues;
};
export type EvaluationUgTeamResponse = GeneratedEvaluation['ugTeams'][number];
export type EvaluationFormAPublication = Omit<GeneratedPublication, 'publication'> & {
  publication: PublicationValues;
};
export type EvaluationFormASpubTask = Omit<GeneratedSpubTask, 'spubTask'> & {
  spubTask: SpubTaskValues;
};
export type EvaluationResponse = Omit<
  GeneratedEvaluation,
  'formAResearchTasks' | 'formAContracts' | 'guestTeams' | 'formAPublications' | 'formASpubTasks'
> & {
  formAResearchTasks: EvaluationFormAResearchTask[];
  formAContracts: EvaluationFormAContract[];
  guestTeams: GuestTeamValues[];
  formAPublications: EvaluationFormAPublication[];
  formASpubTasks: EvaluationFormASpubTask[];
};
