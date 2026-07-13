import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/lib/api';

import { SupervisorReviewResponse } from './contracts';

type SupervisorReviewQueryProps = {
  applicationId: string;
  code: string;
};

export function useSupervisorReviewQuery({ applicationId, code }: SupervisorReviewQueryProps) {
  return useSuspenseQuery({
    queryKey: ['supervisorReview', applicationId, code],
    queryFn: async () => client.get(`/v2/applications/${applicationId}/supervisor-review?code=${code}`),
    select: (res) => {
      const review = res.data as SupervisorReviewResponse;
      review.form.note ??= '';
      review.form.periodSelectionType =
        review.form.precisePeriodEnd || review.form.precisePeriodStart ? 'precise' : 'period';
      return review;
    },
  });
}

export function useSupervisorReviewDecisionMutation() {
  return useMutation({
    mutationFn: async ({ applicationId, accept, code }: SupervisorReviewQueryProps & { accept: boolean }) =>
      client.put(`/v2/applications/${applicationId}/supervisor-review/decision`, { accept, code }),
  });
}
