import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import axios, { AxiosError } from 'axios';
import { ProblemDetails } from '@/lib/api';
import {
  useSupervisorReviewDecisionMutation,
  useSupervisorReviewQuery,
} from '@/api/applications/SupervisorReviewApiHooks';
import { toast } from '@/components/shared/layout/toast';
import { SupervisorView } from '@/routes/applications/$applicationId/-components/formA/SupervisorView';
import { CruisePeriodType, FormADto } from '@/api/applications/dto/FormADto';

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
  const supervisorReview = useSupervisorReviewQuery({ applicationId: cruiseApplicationId, code: supervisorCode });
  const answerMutation = useSupervisorReviewDecisionMutation();
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
        }) as FormADto,
  });

  function handleAcceptForm() {
    const loading = toast.loading('Przetwarzanie zgłoszenia...');
    answerMutation.mutate(
      { applicationId: cruiseApplicationId!, accept: true, code: supervisorCode! },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          toast.success('Zgłoszenie zostało zaakceptowane');
        },
        onError: (err: Error | AxiosError) => {
          console.error(err);
          if (axios.isAxiosError<ProblemDetails>(err) && err.response?.status === 403) {
            toast.error('Niedozwolona operacja: ' + (err.response.data.detail ?? ''));
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
      { applicationId: cruiseApplicationId!, accept: false, code: supervisorCode! },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          toast.success('Zgłoszenie zostało odrzucone');
        },
        onError: (err: Error | AxiosError) => {
          console.error(err);
          if (axios.isAxiosError<ProblemDetails>(err) && err.response?.status === 403) {
            toast.error('Niedozwolona operacja: ' + (err.response.data.detail ?? ''));
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
