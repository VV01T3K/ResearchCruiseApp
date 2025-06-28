import { useForm } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { AppLayout } from '@/core/components/AppLayout';
import { navigateToFirstError } from '@/core/lib/utils';
import { FormB } from '@/cruise-applications/components/formB/FormB';
import { getFormBValidationSchema } from '@/cruise-applications/helpers/FormBValidationSchema';
import { useCruiseForCruiseApplicationQuery } from '@/cruise-applications/hooks/CruiseApplicationsApiHooks';
import { useFormAInitValuesQuery, useFormAQuery } from '@/cruise-applications/hooks/FormAApiHooks';
import {
  useFormBInitValuesQuery,
  useFormBQuery,
  useRevertFormBToEditMutation,
  useUpdateFormBMutation,
} from '@/cruise-applications/hooks/FormBApiHooks';
import { FormBDto } from '@/cruise-applications/models/FormBDto';

export function FormBPage() {
  const routeApi = getRouteApi('/applications/$applicationId/formB');
  const { applicationId } = routeApi.useParams();
  const mode = routeApi.useSearch().mode ?? 'preview';

  const navigate = useNavigate();

  const formA = useFormAQuery(applicationId);
  const formB = useFormBQuery(applicationId);
  const formAInitValues = useFormAInitValuesQuery();
  const formBInitValues = useFormBInitValuesQuery();
  const cruise = useCruiseForCruiseApplicationQuery(applicationId);
  const updateMutation = useUpdateFormBMutation();
  const revertToEditMutation = useRevertFormBToEditMutation();

  const form = useForm<FormBDto>({
    defaultValues:
      formB.data ??
      ({
        isCruiseManagerPresent: 'true',
        permissions: formA.data.permissions,
        ugTeams: formA.data.ugTeams,
        guestTeams: formA.data.guestTeams,
        crewMembers: [],
        shortResearchEquipments: [],
        longResearchEquipments: [],
        ports: [],
        cruiseDaysDetails: [],
        researchEquipments: [],
        shipEquipmentsIds: [],
      } as FormBDto),
    validators: {
      onChange: getFormBValidationSchema(),
    },
  });
  const [hasFormBeenSubmitted, setHasFormBeenSubmitted] = useState(false);
  const context = {
    form,
    formA: formA.data,
    formAInitValues: formAInitValues.data,
    formBInitValues: formBInitValues.data,
    cruise: cruise.data,
    isReadonly: mode !== 'edit',
    hasFormBeenSubmitted,
    onSubmit: handleSubmit,
    onSaveDraft: handleDraftSave,
    onRevertToEdit: mode === 'preview' ? handleRevertToEdit : undefined,
    actionsDisabled: updateMutation.isPending || revertToEditMutation.isPending,
  };

  async function handleSubmit() {
    setHasFormBeenSubmitted(true);

    await form.validate('change');

    if (!form.state.canSubmit) {
      toast.error('Formularz zawiera błędy. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
      navigateToFirstError();
      return;
    }

    const loading = toast.loading('Zapisywanie formularza...');
    await updateMutation.mutateAsync(
      {
        id: applicationId,
        form: form.state.values,
        draft: false,
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          toast.success('Formularz został wysłany pomyślnie.');
        },
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 403) {
            toast.error(
              'Aplikacja nie znajduje się w odpowiednim stanie, aby przesłać formularz. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.'
            );
            navigate({ to: '/applications' });
            return;
          }

          console.error(err);
          toast.error(
            'Nie udało się wysłać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie i spróbuj ponownie.'
          );
          navigateToFirstError();
        },
        onSettled: () => {
          toast.dismiss(loading);
        },
      }
    );
  }

  async function handleDraftSave() {
    const loading = toast.loading('Zapisywanie wersji roboczej formularza...');
    await updateMutation.mutateAsync(
      {
        id: applicationId,
        form: form.state.values,
        draft: true,
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          toast.success('Wersja robocza formularza została zapisana.');
        },
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 403) {
            toast.error(
              'Aplikacja nie znajduje się w odpowiednim stanie, aby zapisać wersję roboczą formularza. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.'
            );
            navigate({ to: '/applications' });
            return;
          }

          console.error(err);
          toast.error('Nie udało się zapisać wersji roboczej formularza. Spróbuj ponownie.');
          navigateToFirstError();
        },
        onSettled: () => {
          toast.dismiss(loading);
        },
      }
    );
  }

  async function handleRevertToEdit() {
    const loading = toast.loading('Cofanie formularza do edycji...');
    await revertToEditMutation.mutateAsync(
      { id: applicationId },
      {
        onSuccess: async () => {
          await navigate({ to: `/applications/${applicationId}/formB?mode=edit` });
        },
        onSettled: () => {
          toast.dismiss(loading);
        },
      }
    );
  }

  return (
    <>
      <AppLayout title="Formularz B">
        <FormB context={context} />
      </AppLayout>
    </>
  );
}
