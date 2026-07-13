import { useMutation } from '@tanstack/react-query';
import {
  updateApplicationDecisionV2,
  useGetApplicationsV2Suspense,
  useGetApplicationCruiseV2Suspense,
  useGetApplicationEvaluationV2Suspense,
  useGetApplicationV2Suspense,
} from '@/api/generated/endpoints';
import { UpdateApplicationDecisionV2Body } from '@/api/generated/model';
import { validateRequest } from '@/api/validateRequest';
import { CruiseResponse } from '@/api/cruises/contracts';
import { ApplicationResponse, EvaluationResponse } from './contracts';

export function useApplicationsQuery() {
  return useGetApplicationsV2Suspense<ApplicationResponse[]>({
    query: { select: (applications) => applications as ApplicationResponse[] },
  });
}

export function useApplicationQuery(applicationId: string) {
  return useGetApplicationV2Suspense<ApplicationResponse>(applicationId, {
    query: { select: (application) => application as ApplicationResponse },
  });
}

export function useApplicationCruiseQuery(applicationId: string) {
  return useGetApplicationCruiseV2Suspense<CruiseResponse>(applicationId, {
    query: { select: (cruise) => cruise as CruiseResponse },
  });
}

export function useApplicationEvaluationQuery(applicationId: string) {
  return useGetApplicationEvaluationV2Suspense<EvaluationResponse>(applicationId, {
    query: { select: (evaluation) => evaluation as EvaluationResponse },
  });
}

export function useAcceptApplicationMutation() {
  return useMutation({
    mutationFn: async (applicationId: string) => {
      return updateApplicationDecisionV2(
        applicationId,
        validateRequest('accept-application', UpdateApplicationDecisionV2Body, { accept: true })
      );
    },
  });
}

export function useRejectApplicationMutation() {
  return useMutation({
    mutationFn: async (applicationId: string) => {
      return updateApplicationDecisionV2(
        applicationId,
        validateRequest('reject-application', UpdateApplicationDecisionV2Body, { accept: false })
      );
    },
  });
}
