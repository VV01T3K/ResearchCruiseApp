import type {
  ApplicationResponse as GeneratedApplicationResponse,
  CruiseApplicationStatus as GeneratedCruiseApplicationStatus,
  CruiseApplicationEvaluation,
} from '@/api/generated/schemas';
import type { ContractValues } from '@/routes/applications/$applicationId/-schemas/types/ContractValues';
import type { GuestTeamValues } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import type { PublicationValues } from '@/routes/applications/$applicationId/-schemas/types/PublicationValues';
import type { ResearchTaskValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import type { SpubTaskValues } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskValues';
import { PublicationCategory } from '@/routes/applications/$applicationId/-schemas/types/PublicationValues';
import { mapResearchTaskToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

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
type GeneratedEvaluation = Required<CruiseApplicationEvaluation>;
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
export type EvaluationUgTeamResponse = {
  ugUnitName: string;
  noOfEmployees: string;
  noOfStudents: string;
};
export type EvaluationFormAPublication = Omit<GeneratedPublication, 'publication'> & {
  publication: PublicationValues;
};
export type EvaluationFormASpubTask = Omit<GeneratedSpubTask, 'spubTask'> & {
  spubTask: SpubTaskValues;
};
export type EvaluationResponse = Omit<
  GeneratedEvaluation,
  'formAResearchTasks' | 'formAContracts' | 'ugTeams' | 'guestTeams' | 'formAPublications' | 'formASpubTasks'
> & {
  formAResearchTasks: EvaluationFormAResearchTask[];
  formAContracts: EvaluationFormAContract[];
  ugTeams: EvaluationUgTeamResponse[];
  guestTeams: GuestTeamValues[];
  formAPublications: EvaluationFormAPublication[];
  formASpubTasks: EvaluationFormASpubTask[];
};

export function mapEvaluationResponse(evaluation: CruiseApplicationEvaluation): EvaluationResponse {
  return {
    formAResearchTasks: (evaluation.formAResearchTasks ?? []).map((item) => ({
      id: item.id ?? '',
      points: item.points ?? '',
      researchTask: mapResearchTaskToValues(
        item.researchTask ?? {
          type: '11',
          title: null,
          magazine: null,
          author: null,
          institution: null,
          date: null,
          startDate: null,
          endDate: null,
          financingAmount: null,
          financingApproved: null,
          description: null,
          securedAmount: null,
          ministerialPoints: null,
        }
      ),
    })),
    formAContracts: (evaluation.formAContracts ?? []).map((item) => ({
      id: item.id ?? '',
      points: item.points ?? '',
      contract: {
        category: item.contract?.category === 'international' ? 'international' : 'domestic',
        institutionName: item.contract?.institutionName ?? '',
        institutionUnit: item.contract?.institutionUnit ?? '',
        institutionLocalization: item.contract?.institutionLocalization ?? '',
        description: item.contract?.description ?? '',
        scans: (item.contract?.scans ?? []).map((scan) => ({
          name: scan.name ?? '',
          content: scan.content ?? '',
        })),
      },
    })),
    ugTeams: (evaluation.ugTeams ?? []).map((team) => ({
      ugUnitName: team.ugUnitName ?? '',
      noOfEmployees: team.noOfEmployees ?? '',
      noOfStudents: team.noOfStudents ?? '',
    })),
    guestTeams: (evaluation.guestTeams ?? []).map((team) => ({
      name: team.name ?? '',
      noOfPersons: Number(team.noOfPersons) || 0,
    })),
    ugUnitsPoints: evaluation.ugUnitsPoints ?? '',
    formAPublications: (evaluation.formAPublications ?? []).map((item) => ({
      id: item.id ?? '',
      points: item.points ?? '',
      publication: {
        id: item.publication?.id ?? '',
        category:
          item.publication?.category === PublicationCategory.Postscript
            ? PublicationCategory.Postscript
            : PublicationCategory.Subject,
        doi: item.publication?.doi ?? '',
        authors: item.publication?.authors ?? '',
        title: item.publication?.title ?? '',
        magazine: item.publication?.magazine ?? '',
        year: Number(item.publication?.year) || 0,
        ministerialPoints: Number(item.publication?.ministerialPoints) || 0,
      },
    })),
    formASpubTasks: (evaluation.formASpubTasks ?? []).map((item) => ({
      id: item.id ?? '',
      points: item.points ?? '',
      spubTask: {
        name: item.spubTask?.name ?? '',
        yearFrom: item.spubTask?.yearFrom ?? '',
        yearTo: item.spubTask?.yearTo ?? '',
      },
    })),
    effectsPoints: evaluation.effectsPoints ?? '',
  };
}
