import { useForm } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { Suspense, useState } from 'react';

import { AppLayout } from '@/core/components/AppLayout';
import { AppLoader } from '@/core/components/AppLoader';
import { useAppContext } from '@/core/hooks/AppContextHook';
import { FormC } from '@/cruise-applications/components/formC/FormC';
import { getFormCValidationSchema } from '@/cruise-applications/helpers/FormCValidationSchema';
import { useCruiseForCruiseApplicationQuery } from '@/cruise-applications/hooks/CruiseApplicationsApiHooks';
import { useFormAInitValuesQuery, useFormAQuery } from '@/cruise-applications/hooks/FormAApiHooks';
import { useFormBInitValuesQuery, useFormBQuery } from '@/cruise-applications/hooks/FormBApiHooks';
import { useFormCQuery, useUpdateFormCMutation } from '@/cruise-applications/hooks/FormCApiHooks';
import { FormCDto } from '@/cruise-applications/models/FormCDto';
import { ResearchTaskEffectDto } from '@/cruise-applications/models/ResearchTaskEffectDto';

export function FormCPage() {
  const routeApi = getRouteApi('/applications/$applicationId/formC');
  const { applicationId } = routeApi.useParams();
  const mode = routeApi.useSearch().mode ?? 'preview';

  const navigate = useNavigate();
  const appContext = useAppContext();

  const formA = useFormAQuery(applicationId);
  const formB = useFormBQuery(applicationId);
  const formC = useFormCQuery(applicationId);
  const formAInitValues = useFormAInitValuesQuery();
  const formBInitValues = useFormBInitValuesQuery();
  const cruise = useCruiseForCruiseApplicationQuery(applicationId);
  const updateMutation = useUpdateFormCMutation();

  const form = useForm<FormCDto>({
    defaultValues:
      formC.data ??
      ({
        shipUsage: formA.data.shipUsage, // Max length 1
        differentUsage: formA.data.differentUsage,
        permissions: formB.data.permissions,
        researchAreaId: formA.data.researchAreaId,
        ugTeams: formB.data.ugTeams,
        guestTeams: formB.data.guestTeams,
        researchTasksEffects: formA.data.researchTasks.map(
          (task) =>
            ({
              ...task,
              done: 'false',
              managerConditionMet: 'false',
              deputyConditionMet: 'false',
            }) as ResearchTaskEffectDto
        ),
        contracts: formA.data.contracts,
        spubTasks: formA.data.spubTasks,
        shortResearchEquipments: formB.data.shortResearchEquipments,
        longResearchEquipments: formB.data.longResearchEquipments,
        ports: formB.data.ports,
        cruiseDaysDetails: formB.data.cruiseDaysDetails,
        researchEquipments: formB.data.researchEquipments,
        shipEquipmentsIds: formB.data.shipEquipmentsIds,
        collectedSamples: [],
        spubReportData: '',
        additionalDescription: '',
        photos: [],
      } as FormCDto),
    validators: {
      onChange: getFormCValidationSchema(formAInitValues.data),
    },
  });
  const [hasFormBeenSubmitted, setHasFormBeenSubmitted] = useState(false);
  const context = {
    form,
    formA: formA.data,
    formB: formB.data,
    formAInitValues: formAInitValues.data,
    formBInitValues: formBInitValues.data,
    cruise: cruise.data,
    isReadonly: mode !== 'edit',
    hasFormBeenSubmitted,
    onSubmit: handleSubmit,
    onSaveDraft: handleDraftSave,
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

  return (
    <>
      <AppLayout title="Formularz C">
        <Suspense fallback={<AppLoader />}>
          <FormC context={context} />
        </Suspense>
      </AppLayout>
    </>
  );
}
