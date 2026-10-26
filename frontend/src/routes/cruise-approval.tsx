import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { z } from 'zod';
import {
  useGetApplicationSupervisorReviewSuspense,
  useUpdateApplicationSupervisorReviewDecision,
} from '@/api/generated/endpoints/applications.gen';
import { getErrorMessage } from '@/api/errors';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { SupervisorView } from '@/routes/applications/$applicationId/-components/formA/SupervisorView';
import { mapFormAToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
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
  const supervisorReview = useGetApplicationSupervisorReviewSuspense(
    cruiseApplicationId,
    { code: supervisorCode },
    {
      query: {
        select: (value) => {
          return { ...value, form: mapFormAToValues(value.form), initValues: value.initValues };
        },
      },
    }
  );
  const answerMutation = useUpdateApplicationSupervisorReviewDecision({ mutation: { meta: { handlesError: true } } });
  const [accept, setAccept] = React.useState(true);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const { number } = supervisorReview.data;

  const form = useAppForm({
    defaultValues: supervisorReview.data.form,
  });

  function openConfirmation(value: boolean) {
    answerMutation.reset();
    setAccept(value);
    setIsConfirming(true);
  }

  if (answerMutation.isSuccess) {
    return (
      <AppLayout title="Formularz A" disableBackButton>
        <div role="status" className="flex flex-col items-center gap-4 py-16 text-center">
          {accept ? (
            <CheckCircleIcon weight="fill" className="h-16 w-16 text-primary" />
          ) : (
            <XCircleIcon weight="fill" className="h-16 w-16 text-danger" />
          )}
          <h2 className="text-2xl font-semibold">
            Zgłoszenie nr {number} zostało {accept ? 'zaakceptowane' : 'odrzucone'}
          </h2>
          <p className="text-gray-600">Dziękujemy za odpowiedź. Możesz zamknąć tę stronę.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <form.AppForm>
      <SupervisorView
        formInitValues={supervisorReview.data.initValues}
        handleAcceptForm={() => openConfirmation(true)}
        handleDenyForm={() => openConfirmation(false)}
      />
      <AppModal
        title={`Czy na pewno chcesz ${accept ? 'zaakceptować' : 'odrzucić'} zgłoszenie nr ${number}?`}
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        dismissible={!isSending}
      >
        Decyzji nie będzie można później zmienić.
        {answerMutation.isError && (
          <p role="alert" className="mt-4 text-danger">
            {getErrorMessage(answerMutation.error, 'Nie udało się zapisać decyzji')}
          </p>
        )}
        <div className="mt-8 flex flex-row gap-4">
          <AppButton
            variant={accept ? 'primary' : 'danger'}
            className="basis-2/3"
            onClick={() => {
              setIsSending(true);
              answerMutation.mutate(
                { applicationId: cruiseApplicationId, data: { accept, code: supervisorCode } },
                { onError: () => setIsSending(false) }
              );
            }}
            disabled={isSending}
          >
            {accept ? 'Zaakceptuj' : 'Odrzuć'} zgłoszenie nr {number}
          </AppButton>
          <AppButton
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => setIsConfirming(false)}
            disabled={isSending}
          >
            Anuluj
          </AppButton>
        </div>
      </AppModal>
    </form.AppForm>
  );
}
