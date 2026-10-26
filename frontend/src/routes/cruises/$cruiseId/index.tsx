import { ApiError, getErrorMessage } from '@/api/errors';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { evaluate } from '@tanstack/react-form';
import {
  ArrowClockwiseIcon,
  CheckIcon,
  FloppyDiskIcon,
  PencilSimpleIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react';
import React from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { UnsavedChangesGuard } from '@/integrations/tanstack/router/UnsavedChangesGuard';
import { useGetApplicationsForCruisePlanningSuspense } from '@/api/generated/endpoints/applications.gen';
import { FormView } from '../-components/FormView';
import { CruiseFormSchema, type CruiseFormValues, mapCruiseToValues } from '@/routes/cruises/-schemas/form.schema';
import {
  getGetCruiseQueryKey,
  getGetCruisesQueryKey,
  getUpdateCruiseMutationKey,
  useCompleteCruise,
  useConfirmCruise,
  useDeleteCruise,
  useGetCruiseSuspense,
  useRemoveCruiseConfirmation,
  useUpdateCruise,
  type UpdateCruiseMutationVariables,
} from '@/api/generated/endpoints/cruises.gen';
import type { CruiseResponse } from '@/api/generated/schemas';

export const Route = createFileRoute('/cruises/$cruiseId/')({
  component: CruiseDetailsPage,
  beforeLoad: allowOnly.authenticated(),
});

function CruiseDetailsPage() {
  const { cruiseId } = Route.useParams();

  const queryClient = useQueryClient();
  const cruiseQuery = useGetCruiseSuspense(cruiseId);
  const applicationQuery = useGetApplicationsForCruisePlanningSuspense({ cruiseId });
  const updateCruiseMutation = useUpdateCruise({ mutation: { meta: { handlesError: true } } });
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
  const [pendingDiscard, setPendingDiscard] = React.useState<'cancel' | 'revert'>();
  const [saved, setSaved] = React.useState<{ cruise: CruiseResponse; values: CruiseFormValues }>();
  const saveQueue = React.useRef(Promise.resolve());
  // Our own accepted saves replace the revision they were based on.
  const nextRevisions = React.useRef(new Map<string | undefined, string>());
  const isSavedBaseline = saved?.cruise === cruiseQuery.data;
  const isUpdating =
    useIsMutating({
      mutationKey: getUpdateCruiseMutationKey(),
      predicate: ({ state }) => (state.variables as UpdateCruiseMutationVariables | undefined)?.cruiseId === cruiseId,
    }) > 0;
  const isEditBlocked = !isSavedBaseline && (isUpdating || cruiseQuery.isFetching || cruiseQuery.isError);

  const form = useAppForm({
    defaultValues: isSavedBaseline ? saved.values : mapCruiseToValues(cruiseQuery.data),
    validationLogic: formValidationLogic,
    validators: { onDynamic: CruiseFormSchema },
    onSubmitInvalid: () => {
      navigateToFirstError({ toast: true });
    },
    onSubmit: ({ value }) => {
      const save = saveQueue.current.then(() => saveCruise(value));
      saveQueue.current = save;
      return save;
    },
  });

  async function saveCruise(value: CruiseFormValues) {
    let revision = value.revision;
    while (nextRevisions.current.has(revision)) revision = nextRevisions.current.get(revision);
    try {
      const accepted = await updateCruiseMutation.mutateAsync({
        cruiseId,
        data: { ...CruiseFormSchema.parse(value), revision: revision ?? null },
      });
      nextRevisions.current.set(revision, accepted.revision);
      const savedValues = { ...value, revision: accepted.revision };
      setSaved({ cruise: cruiseQuery.data, values: savedValues });
      if (evaluate(form.state.values, value)) {
        form.reset(savedValues);
        setEditMode(false);
        setPendingDiscard(undefined);
      }
      toast.success('Rejs został zaktualizowany pomyślnie.');
    } catch (error) {
      console.error(error);
      // Discarding after a conflict should land on the current server version.
      if (error instanceof ApiError && error.status === 409) void cruiseQuery.refetch();
      setServerFormErrors(form, error);
      toast.error(getErrorMessage(error, 'Nie udało się zaktualizować rejsu'));
      navigateToFirstError();
    }
  }

  function discard(action: 'cancel' | 'revert') {
    form.reset();
    if (action === 'cancel') setEditMode(false);
    setPendingDiscard(undefined);
  }

  function getButtons() {
    if (editMode) {
      return (
        <>
          <AppButton
            className="w-36 !justify-center gap-4 lg:w-48"
            variant="primaryOutline"
            onClick={() => (form.state.isDirty ? setPendingDiscard('cancel') : discard('cancel'))}
          >
            <XIcon className="h-4 w-4" />
            Anuluj
          </AppButton>
          <AppButton
            className="w-36 !justify-center gap-4 lg:w-48"
            variant="primaryOutline"
            onClick={() => (form.state.isDirty ? setPendingDiscard('revert') : discard('revert'))}
          >
            <ArrowClockwiseIcon className="h-4 w-4" />
            Cofnij zmiany
          </AppButton>
          <AppButton className="w-36 !justify-center gap-4 lg:w-48" onClick={() => form.handleSubmit()}>
            <FloppyDiskIcon weight="fill" className="h-4 w-4" />
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
              disabled={isEditBlocked}
            >
              <PencilSimpleIcon className="h-4 w-4" />
              Edytuj
            </AppButton>
            <AppButton
              className="w-36 !justify-center gap-4 lg:w-64"
              onClick={() => setIsConfirmAcceptanceModalOpen(true)}
            >
              <CheckIcon className="h-4 w-4" />
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
              disabled={isEditBlocked}
            >
              <PencilSimpleIcon className="h-4 w-4" />
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
              <CheckIcon className="h-4 w-4" />
              Zakończ rejs
            </AppButton>
          </>
        );
      case 'ended':
        return (
          <AppButton
            className="w-36 !justify-center gap-4 lg:w-48"
            variant="dangerOutline"
            onClick={() => setIsConfirmRevertModalOpen(true)}
          >
            <ArrowClockwiseIcon className="h-4 w-4" />
            Cofnij status
          </AppButton>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <AppLayout title={`Szczegóły rejsu nr. ${cruiseQuery.data?.number}`}>
        <form.AppForm>
          <FormView
            cruise={cruiseQuery.data}
            cruiseApplications={applicationQuery.data}
            isReadonly={!editMode}
            buttons={getButtons()}
          />
        </form.AppForm>
      </AppLayout>
      <UnsavedChangesGuard form={form} disabled={!editMode} />
      <AppModal title="Odrzucić zmiany?" isOpen={!!pendingDiscard} onClose={() => setPendingDiscard(undefined)}>
        <div className="space-y-4">
          <p>Formularz zawiera niezapisane zmiany. Jeśli je odrzucisz, zostaną utracone.</p>
          <div className="flex flex-wrap justify-end gap-4">
            <AppButton variant="primaryOutline" onClick={() => setPendingDiscard(undefined)}>
              Wróć do edycji
            </AppButton>
            <AppButton variant="danger" onClick={() => pendingDiscard && discard(pendingDiscard)}>
              Odrzuć zmiany
            </AppButton>
          </div>
        </div>
      </AppModal>

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
              await deleteCruiseMutation.mutateAsync({ cruiseId, params: { revision: cruiseQuery.data.revision } });
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
            onClick={() =>
              revertCruiseStatusMutation.mutate({ cruiseId }, { onSettled: () => setIsConfirmRevertModalOpen(false) })
            }
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
