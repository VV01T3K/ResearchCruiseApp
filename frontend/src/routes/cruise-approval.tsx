import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import {
  useGetApplicationSupervisorReviewSuspense,
  useUpdateApplicationSupervisorReviewDecision,
} from '@/api/generated/endpoints/applications.gen';
import { ApiError, getProblemDetail } from '@/lib/custom-fetch';
import { toast } from '@/components/shared/layout/toast';
import { SupervisorView } from '@/routes/applications/$applicationId/-components/formA/SupervisorView';
import { mapFormAOptions, mapFormAToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { useAppForm } from '@/integrations/tanstack/form/hook';

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
          return { ...value, form: mapFormAToValues(value.form), initValues: mapFormAOptions(value.initValues) };
        },
      },
    }
  );
  const answerMutation = useUpdateApplicationSupervisorReviewDecision();
  const formA = supervisorReview.data.form;

  const form = useAppForm({
    defaultValues: formA,
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
    <form.AppForm>
      <SupervisorView
        formInitValues={supervisorReview.data.initValues}
        handleAcceptForm={handleAcceptForm}
        handleDenyForm={handleDenyForm}
      />
    </form.AppForm>
  );
}
