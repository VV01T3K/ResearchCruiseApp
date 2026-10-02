import { useParams } from '@tanstack/react-router';

import {
  useGetApplicationEvaluationSuspense,
  useGetApplicationSuspense,
} from '@/api/generated/endpoints/applications.gen';
import type { CruiseApplicationEvaluation } from '@/api/generated/schemas';
import {
  mapContractToValues,
  mapPublicationToValues,
  mapResearchTaskToValues,
  mapSpubTaskToValues,
} from '@/routes/applications/$applicationId/-schemas/formA.schema';

function useApplicationId() {
  return useParams({ from: '/applications/$applicationId/details' }).applicationId;
}

export function useApplication() {
  return useGetApplicationSuspense(useApplicationId()).data;
}

function mapEvaluationToValues(evaluation: CruiseApplicationEvaluation) {
  return {
    ...evaluation,
    formAResearchTasks: evaluation.formAResearchTasks.map(({ researchTask, ...scored }) => ({
      ...scored,
      researchTask: mapResearchTaskToValues(researchTask),
    })),
    formAContracts: evaluation.formAContracts.map(({ contract, ...scored }) => ({
      ...scored,
      contract: mapContractToValues(contract),
    })),
    formAPublications: evaluation.formAPublications.map(({ publication, ...scored }) => ({
      ...scored,
      publication: mapPublicationToValues(publication),
    })),
    formASpubTasks: evaluation.formASpubTasks.map(({ spubTask, ...scored }) => ({
      ...scored,
      spubTask: mapSpubTaskToValues(spubTask),
    })),
  };
}

export type ApplicationEvaluation = ReturnType<typeof mapEvaluationToValues>;

export function useApplicationEvaluation() {
  return useGetApplicationEvaluationSuspense(useApplicationId(), { query: { select: mapEvaluationToValues } }).data;
}
