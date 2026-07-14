import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import {
  useGetApplicationSupervisorReviewSuspense,
  useUpdateApplicationSupervisorReviewDecision,
} from '@/api/generated/endpoints/applications.gen';
import type { SupervisorReviewResponse as GeneratedSupervisorReviewResponse } from '@/api/generated/schemas';
import { ApiError, getProblemDetail } from '@/lib/custom-fetch';
import { toast } from '@/components/shared/layout/toast';
import { SupervisorView } from '@/routes/applications/$applicationId/-components/formA/SupervisorView';
import { CruisePeriodType, FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';

type SupervisorReviewResponse = Omit<GeneratedSupervisorReviewResponse, 'form' | 'initValues'> & {
  form: FormAValues;
  initValues: FormAOptions;
};

export const Route = createFileRoute('/cruise-approval')({
  component: SupervisorViewPage,
  validateSearch: z
    .object({
      cruiseApplicationId: z.guid(),
      supervisorCode: z.string(),
    })
    .catch({
      cruiseApplicationId: '',
      supervisorCode: '',
    }),
});

function SupervisorViewPage() {
  const { cruiseApplicationId, supervisorCode } = Route.useSearch();
  const navigate = useNavigate();
  const supervisorReview = useGetApplicationSupervisorReviewSuspense(
    cruiseApplicationId,
    { code: supervisorCode },
    {
      query: {
        select: (value) => {
          const review = value as SupervisorReviewResponse;
          review.form.note ??= '';
          review.form.periodSelectionType =
            review.form.precisePeriodEnd || review.form.precisePeriodStart ? 'precise' : 'period';
          return review;
        },
      },
    }
  );
  const answerMutation = useUpdateApplicationSupervisorReviewDecision();
  const formA = supervisorReview.data.form;

  const form = useForm({
    defaultValues: (formA
      ? {
          ...formA,
          acceptablePeriod: formA.acceptablePeriod ?? '',
          optimalPeriod: formA.optimalPeriod ?? '',
          precisePeriodStart: formA.precisePeriodStart ?? '',
          precisePeriodEnd: formA.precisePeriodEnd ?? '',
          periodSelectionType:
            formA.periodSelectionType === 'precise' || formA.periodSelectionType === 'period'
              ? formA.periodSelectionType
              : formA.precisePeriodStart || formA.precisePeriodEnd
                ? 'precise'
                : 'period',
        }
      : {
          id: undefined,
          cruiseManagerId: '',
          deputyManagerId: '',
          year: supervisorReview.data.initValues.years[0],
          acceptablePeriod: ['0', '24'] as CruisePeriodType,
          optimalPeriod: ['0', '24'] as CruisePeriodType,
          precisePeriodStart: '',
          precisePeriodEnd: '',
          periodSelectionType: 'period' as const,
          cruiseHours: '0',
          periodNotes: '',
          shipUsage: '',
          differentUsage: '',
          permissions: [],
          researchAreaDescriptions: [],
          cruiseGoal: '',
          cruiseGoalDescription: '',
          researchTasks: [],
          contracts: [],
          ugTeams: [],
          guestTeams: [],
          publications: [],
          spubTasks: [],
          supervisorEmail: '',
          note: '',
        }) as FormAValues,
  });

  function handleAcceptForm() {
    const loading = toast.loading('Przetwarzanie zgłoszenia...');
    answerMutation.mutate(
      { applicationId: cruiseApplicationId, data: { accept: true, code: supervisorCode } },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          toast.success('Zgłoszenie zostało zaakceptowane');
        },
        onError: (err) => {
          console.error(err);
          if (err instanceof ApiError && err.status === 403) {
            toast.error('Niedozwolona operacja: ' + getProblemDetail(err, ''));
          } else {
            toast.error('Wystąpił błąd: Nie udało się zaakceptować zgłoszenia');
          }
        },
        onSettled: () => {
          toast.dismiss(loading);
        },
      }
    );
  }

  function handleDenyForm() {
    const loading = toast.loading('Przetwarzanie zgłoszenia...');
    answerMutation.mutate(
      { applicationId: cruiseApplicationId, data: { accept: false, code: supervisorCode } },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          toast.success('Zgłoszenie zostało odrzucone');
        },
        onError: (err) => {
          console.error(err);
          if (err instanceof ApiError && err.status === 403) {
            toast.error('Niedozwolona operacja: ' + getProblemDetail(err, ''));
          } else {
            toast.error('Wystąpił błąd: Nie udało się odrzucić zgłoszenia');
          }
        },
        onSettled: () => {
          toast.dismiss(loading);
        },
      }
    );
  }

  return (
    <SupervisorView
      form={form}
      formInitValues={supervisorReview.data.initValues}
      handleAcceptForm={handleAcceptForm}
      handleDenyForm={handleDenyForm}
    />
  );
}
