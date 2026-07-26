import { useParams } from '@tanstack/react-router';

import { mapEvaluationResponse } from '@/api/client/applications/models';
import {
  useGetApplicationEvaluationSuspense,
  useGetApplicationSuspense,
} from '@/api/generated/endpoints/applications.gen';

function useApplicationId() {
  return useParams({ from: '/applications/$applicationId/details' }).applicationId;
}

export function useApplication() {
  return useGetApplicationSuspense(useApplicationId()).data;
}

export function useApplicationEvaluation() {
  return useGetApplicationEvaluationSuspense(useApplicationId(), {
    query: { select: mapEvaluationResponse },
  }).data;
}
