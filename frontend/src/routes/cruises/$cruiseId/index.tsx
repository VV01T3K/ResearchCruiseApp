import { ApiError, getErrorMessage } from '@/api/errors';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { useIsMutating, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
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
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Modal } from '@/components/shared/Modal';
import { toast } from '@/components/shared/layout/toast';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { groupedQueryStaleTime } from '@/integrations/tanstack/query/root-provider';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { UnsavedChangesGuard } from '@/integrations/tanstack/router/UnsavedChangesGuard';
import { useSaveTracking } from '@/integrations/tanstack/router/useSaveTracking';
import { getGetApplicationsForCruisePlanningSuspenseQueryOptions } from '@/api/generated/endpoints/applications.gen';
import { FormView } from '@/features/cruises/components/FormView';
import { CruiseFormSchema, type CruiseFormValues, mapCruiseToValues } from '@/features/cruises/schemas/form.schema';
import {
  getGetCruiseQueryKey,
  getGetCruiseSuspenseQueryOptions,
  getGetCruisesQueryKey,
  getUpdateCruiseMutationKey,
  useCompleteCruise,
  useConfirmCruise,
  useDeleteCruise,
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
  const [cruiseQuery, applicationQuery] = useSuspenseQueries({
    queries: [
      getGetCruiseSuspenseQueryOptions(cruiseId, { query: { staleTime: groupedQueryStaleTime } }),
      getGetApplicationsForCruisePlanningSuspenseQueryOptions(
        { cruiseId },
        { query: { staleTime: groupedQueryStaleTime } }
      ),
    ],
  });
  const saving = useSaveTracking();
  const updateCruiseMutation = useUpdateCruise({
    mutation: { meta: { handlesError: true, onAccepted: saving.onAccepted } },
  });
  const forgetCruise = () => {
    queryClient.removeQueries({ queryKey: getGetCruiseQueryKey(cruiseId) });
    return queryClient.invalidateQueries({ queryKey: getGetCruisesQueryKey() });
  };
  const refetchOnConflict = {
    mutation: {
      // Awaited so the action stays pending until the current version is on screen.
      onError: async (error: unknown) => {
        toast.error(getErrorMessage(error, 'Operacja nie powiodła się'));
        if (error instanceof ApiError && error.status === 409) await cruiseQuery.refetch();
      },
    },
  };
  const confirmCruiseMutation = useConfirmCruise(refetchOnConflict);
  const deleteCruiseMutation = useDeleteCruise({
    mutation: { meta: { handlesError: true, invalidates: false }, onSuccess: forgetCruise },
  });
  const endCruiseMutation = useCompleteCruise(refetchOnConflict);
  const revertCruiseStatusMutation = useRemoveCruiseConfirmation(refetchOnConflict);

  const navigate = useNavigate();

  const [editMode, setEditMode] = React.useState(false);
  const [isConfirmAcceptanceModalOpen, setIsConfirmAcceptanceModalOpen] = React.useState(false);
  const [isConfirmDeletionModalOpen, setIsConfirmDeletionModalOpen] = React.useState(false);
  const [isConfirmEndModalOpen, setIsConfirmEndModalOpen] = React.useState(false);
  const [isConfirmRevertModalOpen, setIsConfirmRevertModalOpen] = React.useState(false);
  const [pendingDiscard, setPendingDiscard] = React.useState<'cancel' | 'revert'>();
  const [saved, setSaved] = React.useState<{ cruise: CruiseResponse; values: CruiseFormValues }>();
  const saveQueue = React.useRef(Promise.resolve());
  const queuedValues = React.useRef<CruiseFormValues>(undefined);
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
      if (evaluate(value, queuedValues.current)) return saveQueue.current;
      queuedValues.current = value;
      const save = saveQueue.current.then(() => saveCruise(value));
      saveQueue.current = save;
      return save;
    },
  });

  async function saveCruise(value: CruiseFormValues) {
    let revision = value.revision;
    while (nextRevisions.current.has(revision)) revision = nextRevisions.current.get(revision);
    const savedOver = queryClient.getQueryData<CruiseResponse>(getGetCruiseQueryKey(cruiseId))!;
    saving.start(value);
    try {
      const accepted = await updateCruiseMutation.mutateAsync({
        cruiseId,
        data: { ...CruiseFormSchema.parse(value), revision: revision ?? null },
      });
      nextRevisions.current.set(revision, accepted.revision);
      const savedValues = { ...value, revision: accepted.revision };
      setSaved({ cruise: savedOver, values: savedValues });
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
    } finally {
      saving.finish();
      if (queuedValues.current === value) queuedValues.current = undefined;
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
          <Button
            className="w-36 !justify-center gap-4 lg:w-48"
            variant="primaryOutline"
            onClick={() => (form.state.isDirty ? setPendingDiscard('cancel') : discard('cancel'))}
          >
            <XIcon className="h-4 w-4" />
            Anuluj
          </Button>
          <Button
            className="w-36 !justify-center gap-4 lg:w-48"
            variant="primaryOutline"
            onClick={() => (form.state.isDirty ? setPendingDiscard('revert') : discard('revert'))}
          >
            <ArrowClockwiseIcon className="h-4 w-4" />
            Cofnij zmiany
          </Button>
          <Button className="w-36 !justify-center gap-4 lg:w-48" onClick={() => void form.handleSubmit()}>
            <FloppyDiskIcon weight="fill" className="h-4 w-4" />
            Zapisz rejs
          </Button>
        </>
      );
    }

    switch (cruiseQuery.data?.status) {
      case 'new':
        return (
          <>
            <Button
              className="w-36 !justify-center gap-4 lg:w-48"
              variant="primaryOutline"
              onClick={() => setEditMode(true)}
              disabled={isEditBlocked}
            >
              <PencilSimpleIcon className="h-4 w-4" />
              Edytuj
            </Button>
            <Button
              className="w-36 !justify-center gap-4 lg:w-48"
              variant="dangerOutline"
              onClick={() => setIsConfirmDeletionModalOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
              Usuń rejs
            </Button>
            <Button
              className="w-36 !justify-center gap-4 lg:w-48"
              onClick={() => setIsConfirmAcceptanceModalOpen(true)}
            >
              <CheckIcon className="h-4 w-4" />
              Zatwierdź rejs
            </Button>
          </>
        );
      case 'confirmed':
        return (
          <>
            <Button
              className="w-32 !justify-center gap-4 lg:w-40"
              variant="primaryOutline"
              onClick={() => setEditMode(true)}
              disabled={isEditBlocked}
            >
              <PencilSimpleIcon className="h-4 w-4" />
              Edytuj
            </Button>
            <Button
              className="w-32 !justify-center gap-4 lg:w-40"
              variant="primaryOutline"
              onClick={() => setIsConfirmRevertModalOpen(true)}
            >
              <ArrowClockwiseIcon className="h-4 w-4" />
              Cofnij status
            </Button>
            <Button
              className="w-32 !justify-center gap-4 lg:w-40"
              variant="dangerOutline"
              onClick={() => setIsConfirmDeletionModalOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
              Usuń rejs
            </Button>
            <Button className="w-32 !justify-center gap-4 lg:w-40" onClick={() => setIsConfirmEndModalOpen(true)}>
              <CheckIcon className="h-4 w-4" />
              Zakończ rejs
            </Button>
          </>
        );
      case 'ended':
        return (
          <Button
            className="w-36 !justify-center gap-4 lg:w-48"
            variant="dangerOutline"
            onClick={() => setIsConfirmRevertModalOpen(true)}
          >
            <ArrowClockwiseIcon className="h-4 w-4" />
            Cofnij status
          </Button>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <Layout title={`Szczegóły rejsu nr. ${cruiseQuery.data?.number}`}>
        <form.AppForm>
          <FormView
            cruise={cruiseQuery.data}
            cruiseApplications={applicationQuery.data}
            isReadonly={!editMode}
            buttons={getButtons()}
          />
        </form.AppForm>
      </Layout>
      <UnsavedChangesGuard form={form} disabled={!editMode} saving={saving} />
      <Modal title="Odrzucić zmiany?" isOpen={!!pendingDiscard} onClose={() => setPendingDiscard(undefined)}>
        <div className="space-y-4">
          <p>Formularz zawiera niezapisane zmiany. Jeśli je odrzucisz, zostaną utracone.</p>
          <div className="flex flex-wrap justify-end gap-4">
            <Button variant="primaryOutline" onClick={() => setPendingDiscard(undefined)}>
              Wróć do edycji
            </Button>
            <Button variant="danger" onClick={() => pendingDiscard && discard(pendingDiscard)}>
              Odrzuć zmiany
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title={`Czy na pewno chcesz zatwierdzić rejs nr. ${cruiseQuery.data?.number}?`}
        isOpen={isConfirmAcceptanceModalOpen}
        onClose={() => setIsConfirmAcceptanceModalOpen(false)}
      >
        <div className="mt-8 flex flex-row gap-4">
          <Button
            variant="primary"
            className="basis-2/3"
            onClick={() =>
              confirmCruiseMutation.mutate(
                { cruiseId, params: { revision: cruiseQuery.data.revision } },
                { onSettled: () => setIsConfirmAcceptanceModalOpen(false) }
              )
            }
            disabled={confirmCruiseMutation.isPending}
          >
            Potwierdź rejs nr. {cruiseQuery.data?.number}
          </Button>
          <Button
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsConfirmAcceptanceModalOpen(false);
            }}
            disabled={confirmCruiseMutation.isPending}
          >
            Anuluj
          </Button>
        </div>
      </Modal>

      <Modal
        title={`Czy na pewno chcesz usunąć rejs nr. ${cruiseQuery.data?.number}?`}
        isOpen={isConfirmDeletionModalOpen}
        onClose={() => setIsConfirmDeletionModalOpen(false)}
      >
        Rejs zostanie usunięty, a przypisane do niego zgłoszenia wrócą do statusu „Zaakceptowane” i będzie można je
        ponownie zaplanować.
        <div className="mt-4 flex flex-row gap-4">
          <Button
            variant="danger"
            className="basis-2/3"
            onClick={() =>
              deleteCruiseMutation.mutate(
                { cruiseId, params: { revision: cruiseQuery.data.revision } },
                {
                  onSuccess: () => void navigate({ to: '/cruises' }),
                  onError: (error) => {
                    if (error instanceof ApiError && (error.status === 404 || error.status === 409)) {
                      toast.error('Rejs został w międzyczasie usunięty lub zmieniony.');
                      setIsConfirmDeletionModalOpen(false);
                      void forgetCruise();
                      void navigate({ to: '/cruises' });
                    } else {
                      toast.error(getErrorMessage(error, 'Nie udało się usunąć rejsu'));
                    }
                  },
                }
              )
            }
            disabled={deleteCruiseMutation.isPending}
          >
            Potwierdź usunięcie rejsu nr. {cruiseQuery.data?.number}
          </Button>
          <Button
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsConfirmDeletionModalOpen(false);
            }}
            disabled={deleteCruiseMutation.isPending}
          >
            Anuluj
          </Button>
        </div>
      </Modal>

      <Modal
        title={`Czy na pewno chcesz oznaczyć rejs nr. ${cruiseQuery.data?.number} jako zakończony?`}
        isOpen={isConfirmEndModalOpen}
        onClose={() => setIsConfirmEndModalOpen(false)}
      >
        <div className="mt-8 flex flex-row gap-4">
          <Button
            variant="primary"
            className="basis-2/3"
            onClick={() =>
              endCruiseMutation.mutate(
                { cruiseId, params: { revision: cruiseQuery.data.revision } },
                { onSettled: () => setIsConfirmEndModalOpen(false) }
              )
            }
            disabled={endCruiseMutation.isPending}
          >
            Oznacz rejs nr. {cruiseQuery.data?.number} jako zakończony
          </Button>
          <Button
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsConfirmEndModalOpen(false);
            }}
            disabled={endCruiseMutation.isPending}
          >
            Anuluj
          </Button>
        </div>
      </Modal>

      <Modal
        title={`Czy na pewno chcesz cofnąć status rejsu nr. ${cruiseQuery.data?.number}?`}
        isOpen={isConfirmRevertModalOpen}
        onClose={() => setIsConfirmRevertModalOpen(false)}
      >
        {cruiseQuery.data?.status === 'confirmed' && <>Status rejsu zostanie zmieniony z "Potwierdzony" na "Nowy".</>}
        {cruiseQuery.data?.status === 'ended' && <>Status rejsu zostanie zmieniony z "Zakończony" na "Potwierdzony".</>}
        <div className="mt-4 flex flex-row gap-4">
          <Button
            variant="dangerOutline"
            className="basis-2/3"
            onClick={() =>
              revertCruiseStatusMutation.mutate(
                { cruiseId, params: { revision: cruiseQuery.data.revision } },
                { onSettled: () => setIsConfirmRevertModalOpen(false) }
              )
            }
            disabled={revertCruiseStatusMutation.isPending}
          >
            Cofnij status rejsu nr. {cruiseQuery.data?.number}
          </Button>
          <Button
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsConfirmRevertModalOpen(false);
            }}
            disabled={revertCruiseStatusMutation.isPending}
          >
            Anuluj
          </Button>
        </div>
      </Modal>
    </>
  );
}
