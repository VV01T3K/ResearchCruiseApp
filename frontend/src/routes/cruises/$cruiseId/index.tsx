import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { revalidateLogic } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import ArrowClockwiseIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?react';
import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import PencilIcon from 'bootstrap-icons/icons/pencil.svg?react';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';
import { getFormErrorMessage, navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { useGetApplicationsSuspense } from '@/api/generated/endpoints/applications.gen';
import { mapApplicationToCruiseCandidate } from '@/api/applications/cruise-candidates';
import { ApplicationResponse, ApplicationStatus } from '@/api/applications/models';
import { FormView } from '../-components/FormView';
import { UpdateCruiseFormSchema, mapCruiseToValues } from '@/routes/cruises/-schemas/form.schema';
import {
  getGetCruiseQueryKey,
  getGetCruisesQueryKey,
  useCompleteCruise,
  useConfirmCruise,
  useDeleteCruise,
  useGetCruiseSuspense,
  useRemoveCruiseConfirmation,
  useUpdateCruise,
} from '@/api/generated/endpoints/cruises.gen';
import type { CruiseResponse } from '@/api/generated/schemas';

export const Route = createFileRoute('/cruises/$cruiseId/')({
  component: CruiseDetailsPage,
  beforeLoad: allowOnly.authenticated(),
});

const CRUISE_FIELD_TO_SECTION: Record<string, number> = {
  title: 1,
  shipUnavailable: 1,
  startDate: 2,
  endDate: 2,
  'managersTeam.mainCruiseManagerId': 3,
  'managersTeam.mainDeputyManagerId': 3,
  cruiseApplicationsIds: 4,
};

function CruiseDetailsPage() {
  const { cruiseId } = Route.useParams();

  const queryClient = useQueryClient();
  const cruiseQuery = useGetCruiseSuspense(cruiseId);
  const applicationQuery = useGetApplicationsSuspense();
  const updateCruiseMutation = useUpdateCruise();
  const confirmCruiseMutation = useConfirmCruise();
  const deleteCruiseMutation = useDeleteCruise({
    skipInvalidation: true,
    mutation: {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: getGetCruiseQueryKey(cruiseId) });
        return queryClient.invalidateQueries({ queryKey: getGetCruisesQueryKey() });
      },
    },
  });
  const endCruiseMutation = useCompleteCruise();
  const revertCruiseStatusMutation = useRemoveCruiseConfirmation();

  const navigate = useNavigate();

  const [editMode, setEditMode] = React.useState(false);
  const [isConfirmAcceptanceModalOpen, setIsConfirmAcceptanceModalOpen] = React.useState(false);
  const [isConfirmDeletionModalOpen, setIsConfirmDeletionModalOpen] = React.useState(false);
  const [isConfirmEndModalOpen, setIsConfirmEndModalOpen] = React.useState(false);
  const [isConfirmRevertModalOpen, setIsConfirmRevertModalOpen] = React.useState(false);

  const form = useAppForm({
    defaultValues: mapCruiseToValues(cruiseQuery.data),
    validationLogic: revalidateLogic({ mode: 'blur', modeAfterSubmission: 'change' }),
    validators: { onDynamic: UpdateCruiseFormSchema },
    onSubmitInvalid: ({ formApi }) => {
      toast.error(getFormErrorMessage(formApi, CRUISE_FIELD_TO_SECTION));
      navigateToFirstError();
    },
    onSubmit: async ({ value }) => {
      try {
        await updateCruiseMutation.mutateAsync({ cruiseId, data: UpdateCruiseFormSchema.parse(value) });
        setEditMode(false);
        toast.success('Rejs został zaktualizowany pomyślnie.');
      } catch (error) {
        console.error(error);
        toast.error('Nie udało się zaktualizować rejsu. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
        navigateToFirstError();
      }
    },
  });

  function getButtons() {
    if (editMode) {
      return (
        <>
          <AppButton
            className="w-36 !justify-center gap-4 lg:w-48"
            variant="primaryOutline"
            onClick={() => {
              form.reset();
              setEditMode(false);
            }}
          >
            <XLgIcon className="h-4 w-4" />
            Anuluj
          </AppButton>
          <AppButton
            className="w-36 !justify-center gap-4 lg:w-48"
            variant="primaryOutline"
            onClick={() => form.reset()}
          >
            <ArrowClockwiseIcon className="h-4 w-4" />
            Cofnij zmiany
          </AppButton>
          <AppButton className="w-36 !justify-center gap-4 lg:w-48" onClick={() => form.handleSubmit()}>
            <FloppyFillIcon className="h-4 w-4" />
            Zapisz rejs
          </AppButton>
        </>
      );
    }

    switch (cruiseQuery.data?.status) {
      case 'new':
        return (
          <>
            <AppButton
              className="w-36 !justify-center gap-4 lg:w-64"
              variant="primaryOutline"
              onClick={() => setEditMode(true)}
            >
              <PencilIcon className="h-4 w-4" />
              Edytuj
            </AppButton>
            <AppButton
              className="w-36 !justify-center gap-4 lg:w-64"
              onClick={() => setIsConfirmAcceptanceModalOpen(true)}
            >
              <CheckLgIcon className="h-4 w-4" />
              Zatwierdź rejs
            </AppButton>
          </>
        );
      case 'confirmed':
        return (
          <>
            <AppButton
              className="w-32 !justify-center gap-4 lg:w-40"
              variant="primaryOutline"
              onClick={() => setEditMode(true)}
            >
              <PencilIcon className="h-4 w-4" />
              Edytuj
            </AppButton>
            <AppButton
              className="w-32 !justify-center gap-4 lg:w-40"
              variant="primaryOutline"
              onClick={() => setIsConfirmRevertModalOpen(true)}
            >
              <ArrowClockwiseIcon className="h-4 w-4" />
              Cofnij status
            </AppButton>
            <AppButton
              className="w-32 !justify-center gap-4 lg:w-40"
              variant="dangerOutline"
              onClick={() => setIsConfirmDeletionModalOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
              Usuń rejs
            </AppButton>
            <AppButton className="w-32 !justify-center gap-4 lg:w-40" onClick={() => setIsConfirmEndModalOpen(true)}>
              <CheckLgIcon className="h-4 w-4" />
              Zakończ rejs
            </AppButton>
          </>
        );
      case 'ended':
        return (
          <>
            <AppButton
              className="w-36 !justify-center gap-4 lg:w-48"
              variant="primaryOutline"
              onClick={() => setEditMode(true)}
            >
              <PencilIcon className="h-4 w-4" />
              Edytuj
            </AppButton>
            <AppButton
              className="w-36 !justify-center gap-4 lg:w-48"
              variant="dangerOutline"
              onClick={() => setIsConfirmRevertModalOpen(true)}
            >
              <ArrowClockwiseIcon className="h-4 w-4" />
              Cofnij status
            </AppButton>
          </>
        );
      default:
        return null;
    }
  }

  function filterValidCruiseApplications(cruise: CruiseResponse, cruiseApplications: ApplicationResponse[]) {
    return cruiseApplications
      .filter(
        (application) =>
          application.status === ApplicationStatus.Accepted || cruise.applications.some((x) => x.id === application.id)
      )
      .map(mapApplicationToCruiseCandidate);
  }

  return (
    <>
      <AppLayout title={`Szczegóły rejsu nr. ${cruiseQuery.data?.number}`}>
        <form.AppForm>
          <FormView
            cruise={cruiseQuery.data}
            cruiseApplications={filterValidCruiseApplications(cruiseQuery.data, applicationQuery.data)}
            isReadonly={!editMode}
            buttons={getButtons()}
          />
        </form.AppForm>
      </AppLayout>

      <AppModal
        title={`Czy na pewno chcesz zatwierdzić rejs nr. ${cruiseQuery.data?.number}?`}
        isOpen={isConfirmAcceptanceModalOpen}
        onClose={() => setIsConfirmAcceptanceModalOpen(false)}
      >
        <div className="mt-8 flex flex-row gap-4">
          <AppButton
            variant="primary"
            className="basis-2/3"
            onClick={async () => {
              await confirmCruiseMutation.mutateAsync({ cruiseId });
              setIsConfirmAcceptanceModalOpen(false);
            }}
            disabled={confirmCruiseMutation.isPending}
          >
            Potwierdź rejs nr. {cruiseQuery.data?.number}
          </AppButton>
          <AppButton
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsConfirmAcceptanceModalOpen(false);
            }}
            disabled={confirmCruiseMutation.isPending}
          >
            Anuluj
          </AppButton>
        </div>
      </AppModal>

      <AppModal
        title={`Czy na pewno chcesz awaryjnie usunąć rejs nr. ${cruiseQuery.data?.number}?`}
        isOpen={isConfirmDeletionModalOpen}
        onClose={() => setIsConfirmDeletionModalOpen(false)}
      >
        Do wszystkich kierowników zgłoszeń i ich zastępców zostanie wysłane powiadomienie o anulowaniu rejsu.
        <div className="mt-4 flex flex-row gap-4">
          <AppButton
            variant="danger"
            className="basis-2/3"
            onClick={async () => {
              await deleteCruiseMutation.mutateAsync({ cruiseId });
              navigate({ to: '/cruises' });
            }}
            disabled={deleteCruiseMutation.isPending}
          >
            Potwierdź usunięcie rejsu nr. {cruiseQuery.data?.number}
          </AppButton>
          <AppButton
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsConfirmDeletionModalOpen(false);
            }}
            disabled={deleteCruiseMutation.isPending}
          >
            Anuluj
          </AppButton>
        </div>
      </AppModal>

      <AppModal
        title={`Czy na pewno chcesz oznaczyć rejs nr. ${cruiseQuery.data?.number} jako zakończony?`}
        isOpen={isConfirmEndModalOpen}
        onClose={() => setIsConfirmEndModalOpen(false)}
      >
        <div className="mt-8 flex flex-row gap-4">
          <AppButton
            variant="primary"
            className="basis-2/3"
            onClick={async () => {
              await endCruiseMutation.mutateAsync({ cruiseId });
              setIsConfirmEndModalOpen(false);
            }}
            disabled={endCruiseMutation.isPending}
          >
            Oznacz rejs nr. {cruiseQuery.data?.number} jako zakończony
          </AppButton>
          <AppButton
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsConfirmEndModalOpen(false);
            }}
            disabled={endCruiseMutation.isPending}
          >
            Anuluj
          </AppButton>
        </div>
      </AppModal>

      <AppModal
        title={`Czy na pewno chcesz cofnąć status rejsu nr. ${cruiseQuery.data?.number}?`}
        isOpen={isConfirmRevertModalOpen}
        onClose={() => setIsConfirmRevertModalOpen(false)}
      >
        {cruiseQuery.data?.status === 'confirmed' && <>Status rejsu zostanie zmieniony z "Potwierdzony" na "Nowy".</>}
        {cruiseQuery.data?.status === 'ended' && <>Status rejsu zostanie zmieniony z "Zakończony" na "Potwierdzony".</>}
        <div className="mt-4 flex flex-row gap-4">
          <AppButton
            variant="dangerOutline"
            className="basis-2/3"
            onClick={async () => {
              await revertCruiseStatusMutation.mutateAsync({ cruiseId });
              setIsConfirmRevertModalOpen(false);
            }}
            disabled={revertCruiseStatusMutation.isPending}
          >
            Cofnij status rejsu nr. {cruiseQuery.data?.number}
          </AppButton>
          <AppButton
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsConfirmRevertModalOpen(false);
            }}
            disabled={revertCruiseStatusMutation.isPending}
          >
            Anuluj
          </AppButton>
        </div>
      </AppModal>
    </>
  );
}
