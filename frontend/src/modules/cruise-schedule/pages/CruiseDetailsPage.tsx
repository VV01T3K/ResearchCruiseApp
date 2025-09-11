import { useForm } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ArrowClockwiseIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?react';
import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import PencilIcon from 'bootstrap-icons/icons/pencil.svg?react';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppModal } from '@/core/components/AppModal';
import { useAppContext } from '@/core/hooks/AppContextHook';
import { removeEmptyValues } from '@/core/lib/utils';
import { useCruiseApplicationsQuery } from '@/cruise-applications/hooks/CruiseApplicationsApiHooks';
import { CruiseApplicationDto, CruiseApplicationStatus } from '@/cruise-applications/models/CruiseApplicationDto';
import { CruiseFrom } from '@/cruise-schedule/components/cruise-from/CruiseForm';
import { getCruiseFormValidationSchema } from '@/cruise-schedule/helpers/CruiseFormValidationSchema';
import {
  useConfirmCruiseMutation,
  useCruiseQuery,
  useDeleteCruiseMutation,
  useEndCruiseMutation,
  useRevertCruiseStatusMutation,
  useUpdateCruiseMutation,
} from '@/cruise-schedule/hooks/CruisesApiHooks';
import { CruiseDto } from '@/cruise-schedule/models/CruiseDto';
import { CruiseFormDto } from '@/cruise-schedule/models/CruiseFormDto';

export function CruiseDetailsPage() {
  const { cruiseId } = getRouteApi('/cruises/$cruiseId/').useParams();

  const cruiseQuery = useCruiseQuery(cruiseId);
  const applicationQuery = useCruiseApplicationsQuery();
  const updateCruiseMutation = useUpdateCruiseMutation(cruiseId);
  const confirmCruiseMutation = useConfirmCruiseMutation(cruiseId);
  const deleteCruiseMutation = useDeleteCruiseMutation();
  const endCruiseMutation = useEndCruiseMutation(cruiseId);
  const revertCruiseStatusMutation = useRevertCruiseStatusMutation(cruiseId);

  const appContext = useAppContext();
  const navigate = useNavigate();

  const [editMode, setEditMode] = React.useState(false);
  const [isConfirmAcceptanceModalOpen, setIsConfirmAcceptanceModalOpen] = React.useState(false);
  const [isConfirmDeletionModalOpen, setIsConfirmDeletionModalOpen] = React.useState(false);
  const [isConfirmEndModalOpen, setIsConfirmEndModalOpen] = React.useState(false);
  const [isConfirmRevertModalOpen, setIsConfirmRevertModalOpen] = React.useState(false);

  const form = useForm<CruiseFormDto>({
    defaultValues: mapCruiseToForm(cruiseQuery.data),
    validators: {
      onChange: getCruiseFormValidationSchema(),
    },
  });

  function handleCruiseUpdate() {
    form.validateAllFields('change');
    if (!form.state.isValid) {
      appContext.showAlert({
        title: 'Błąd walidacji formularza',
        message: 'Formularz zawiera błędy. Sprawdź, czy wszystkie pola są wypełnione poprawnie.',
        variant: 'danger',
      });
      return;
    }

    const dto = removeEmptyValues(form.state.values, [
      'managersTeam.mainCruiseManagerId',
      'managersTeam.mainDeputyManagerId',
    ]);

    updateCruiseMutation.mutate(dto, {
      onSuccess: () => {
        setEditMode(false);
        appContext.showAlert({
          title: 'Zapisano formularz',
          message: 'Rejs został zaktualizowany pomyślnie.',
          variant: 'success',
        });
      },
      onError: (error) => {
        console.error(error);
        appContext.showAlert({
          title: 'Błąd zapisu',
          message: 'Nie udało się zaktualizować rejsu. Sprawdź, czy wszystkie pola są wypełnione poprawnie.',
          variant: 'danger',
        });
      },
    });
  }

  function getButtons() {
    if (editMode) {
      return (
        <>
          <AppButton
            className="gap-4 !justify-center w-36 lg:w-48"
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
            className="gap-4 !justify-center w-36 lg:w-48"
            variant="primaryOutline"
            onClick={() => form.reset()}
          >
            <ArrowClockwiseIcon className="h-4 w-4" />
            Cofnij zmiany
          </AppButton>
          <AppButton className="gap-4 !justify-center w-36 lg:w-48" onClick={handleCruiseUpdate}>
            <FloppyFillIcon className="h-4 w-4" />
            Zapisz rejs
          </AppButton>
        </>
      );
    }

    switch (cruiseQuery.data?.status) {
      case 'Nowy':
        return (
          <>
            <AppButton
              className="gap-4 !justify-center w-36 lg:w-64"
              variant="primaryOutline"
              onClick={() => setEditMode(true)}
            >
              <PencilIcon className="h-4 w-4" />
              Edytuj
            </AppButton>
            <AppButton
              className="gap-4 !justify-center w-36 lg:w-64"
              onClick={() => setIsConfirmAcceptanceModalOpen(true)}
            >
              <CheckLgIcon className="h-4 w-4" />
              Zatwierdź rejs
            </AppButton>
          </>
        );
      case 'Potwierdzony':
        return (
          <>
            <AppButton
              className="gap-4 !justify-center w-32 lg:w-40"
              variant="primaryOutline"
              onClick={() => setEditMode(true)}
            >
              <PencilIcon className="h-4 w-4" />
              Edytuj
            </AppButton>
            <AppButton
              className="gap-4 !justify-center w-32 lg:w-40"
              variant="primaryOutline"
              onClick={() => setIsConfirmRevertModalOpen(true)}
            >
              <ArrowClockwiseIcon className="h-4 w-4" />
              Cofnij status
            </AppButton>
            <AppButton
              className="gap-4 !justify-center w-32 lg:w-40"
              variant="dangerOutline"
              onClick={() => setIsConfirmDeletionModalOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
              Usuń rejs
            </AppButton>
            <AppButton className="gap-4 !justify-center w-32 lg:w-40" onClick={() => setIsConfirmEndModalOpen(true)}>
              <CheckLgIcon className="h-4 w-4" />
              Zakończ rejs
            </AppButton>
          </>
        );
      case 'Zakończony':
        return (
          <>
            <AppButton
              className="gap-4 !justify-center w-36 lg:w-48"
              variant="primaryOutline"
              onClick={() => setEditMode(true)}
            >
              <PencilIcon className="h-4 w-4" />
              Edytuj
            </AppButton>
            <AppButton
              className="gap-4 !justify-center w-36 lg:w-48"
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

  function filterValidCruiseApplications(cruise: CruiseDto, cruiseApplications: CruiseApplicationDto[]) {
    return cruiseApplications.filter(
      (application) =>
        application.status === CruiseApplicationStatus.Accepted ||
        cruise.cruiseApplicationsShortInfo.some((x) => x.id === application.id)
    );
  }

  return (
    <>
      <AppLayout title={`Szczegóły rejsu nr. ${cruiseQuery.data?.number}`}>
        <CruiseFrom
          context={{
            form,
            cruise: cruiseQuery.data,
            cruiseApplications: filterValidCruiseApplications(cruiseQuery.data, applicationQuery.data),
            isReadonly: !editMode,
          }}
          buttons={getButtons()}
        />
      </AppLayout>

      <AppModal
        title={`Czy na pewno chcesz zatwierdzić rejs nr. ${cruiseQuery.data?.number}?`}
        isOpen={isConfirmAcceptanceModalOpen}
        onClose={() => setIsConfirmAcceptanceModalOpen(false)}
      >
        <div className="flex flex-row gap-4 mt-8">
          <AppButton
            variant="primary"
            className="basis-2/3"
            onClick={async () => {
              await confirmCruiseMutation.mutateAsync();
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
        <div className="flex flex-row gap-4 mt-4">
          <AppButton
            variant="danger"
            className="basis-2/3"
            onClick={async () => {
              await deleteCruiseMutation.mutateAsync(cruiseId);
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
        <div className="flex flex-row gap-4 mt-8">
          <AppButton
            variant="primary"
            className="basis-2/3"
            onClick={async () => {
              await endCruiseMutation.mutateAsync();
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
        {cruiseQuery.data?.status === 'Potwierdzony' && (
          <>Status rejsu zostanie zmieniony z "Potwierdzony" na "Nowy".</>
        )}
        {cruiseQuery.data?.status === 'Zakończony' && (
          <>Status rejsu zostanie zmieniony z "Zakończony" na "Potwierdzony".</>
        )}
        <div className="flex flex-row gap-4 mt-4">
          <AppButton
            variant="dangerOutline"
            className="basis-2/3"
            onClick={async () => {
              await revertCruiseStatusMutation.mutateAsync();
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

function mapCruiseToForm(cruise: CruiseDto): CruiseFormDto {
  return {
    startDate: cruise.startDate,
    endDate: cruise.endDate,
    managersTeam: {
      mainCruiseManagerId: cruise.mainCruiseManagerId,
      mainDeputyManagerId: cruise.mainDeputyManagerId,
    },
    cruiseApplicationsIds: cruise.cruiseApplicationsShortInfo.map((x) => x.id),
    status: cruise.status,
    title: cruise.title || '',
    shipUnavailable: cruise.shipUnavailable,
  };
}
