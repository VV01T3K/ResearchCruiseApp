import { useForm } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { Suspense, useState } from 'react';

import { AppLayout } from '@/core/components/AppLayout';
import { AppLoader } from '@/core/components/AppLoader';
import { useAppContext } from '@/core/hooks/AppContextHook';
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
  const appContext = useAppContext();

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
  };

  async function handleSubmit() {
    setHasFormBeenSubmitted(true);

    await form.validate('change');

    if (!form.state.canSubmit) {
      appContext.showAlert({
        title: 'Wystąpił błąd podczas wysyłania formularza',
        message:
          'Nie udało się wysłać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie i spróbuj ponownie.',
        variant: 'danger',
      });
      return;
    }

    await updateMutation.mutateAsync(
      {
        id: applicationId,
        form: form.state.values,
        draft: false,
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          appContext.showAlert({
            title: 'Formularz wysłany pomyślnie',
            message: 'Formularz został wysłany pomyślnie.',
            variant: 'success',
          });
        },
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 403) {
            appContext.showAlert({
              title: 'Błędny status formularza',
              message:
                'Aplikacja nie znajduje się w odpowiednim stanie, aby przesłać formularz. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.',
              variant: 'danger',
            });
            navigate({ to: '/applications' });
            return;
          }

          console.error(err);
          appContext.showAlert({
            title: 'Wystąpił błąd podczas wysyłania formularza',
            message:
              'Nie udało się wysłać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie i spróbuj ponownie.',
            variant: 'danger',
          });
        },
      }
    );
  }

  async function handleDraftSave() {
    await updateMutation.mutateAsync(
      {
        id: applicationId,
        form: form.state.values,
        draft: true,
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          appContext.showAlert({
            title: 'Wersja robocza zapisana',
            message: 'Wersja robocza formularza została zapisana pomyślnie.',
            variant: 'success',
          });
        },
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 403) {
            appContext.showAlert({
              title: 'Błędny status formularza',
              message:
                'Aplikacja nie znajduje się w odpowiednim stanie, aby zapisać wersję roboczą formularza. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.',
              variant: 'danger',
            });
            navigate({ to: '/applications' });
            return;
          }

          console.error(err);
          appContext.showAlert({
            title: 'Wystąpił błąd podczas zapisywania wersji roboczej',
            message: 'Nie udało się zapisać wersji roboczej formularza. Spróbuj ponownie.',
            variant: 'danger',
          });
        },
      }
    );
  }

  async function handleRevertToEdit() {
    await revertToEditMutation.mutateAsync(
      { id: applicationId },
      {
        onSuccess: async () => {
          await navigate({ to: `/applications/${applicationId}/formB?mode=edit` });
        },
      }
    );
  }

  return (
    <>
      <AppLayout title="Formularz B">
        <Suspense fallback={<AppLoader />}>
          <FormB context={context} />
        </Suspense>
      </AppLayout>
    </>
  );
}
