import { useMutation } from '@tanstack/react-query';
import {
  updateApplicationSupervisorReviewDecisionV2,
  useGetApplicationSupervisorReviewV2Suspense,
} from '@/api/generated/endpoints';
import { UpdateApplicationSupervisorReviewDecisionV2Body } from '@/api/generated/model';
import { validateRequest } from '@/api/validateRequest';
import { SupervisorReviewResponse } from './contracts';

type SupervisorReviewQueryProps = {
  applicationId: string;
  code: string;
};

export function useSupervisorReviewQuery({ applicationId, code }: SupervisorReviewQueryProps) {
  return useGetApplicationSupervisorReviewV2Suspense<SupervisorReviewResponse>(
    applicationId,
    { code },
    {
      query: {
        select: (response) => {
          const review = response as SupervisorReviewResponse;
          review.form.note ??= '';
          review.form.periodSelectionType =
            review.form.precisePeriodEnd || review.form.precisePeriodStart ? 'precise' : 'period';
          return review;
        },
      },
    }
  );
}

export function useSupervisorReviewDecisionMutation() {
  return useMutation({
    mutationFn: async ({ applicationId, accept, code }: SupervisorReviewQueryProps & { accept: boolean }) =>
      updateApplicationSupervisorReviewDecisionV2(
        applicationId,
        validateRequest('supervisor-review-decision', UpdateApplicationSupervisorReviewDecisionV2Body, {
          accept,
          code,
        })
      ),
  });
}
