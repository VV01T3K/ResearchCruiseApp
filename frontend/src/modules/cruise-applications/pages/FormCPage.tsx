import { useForm } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { AppLayout } from '@/core/components/AppLayout';
import { navigateToFirstError } from '@/core/lib/utils';
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
    actionsDisabled: updateMutation.isPending,
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
          toast.error('Nie udało się zapisać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie.');
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
          toast.success('Wersja robocza formularza została zapisana pomyślnie.');
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

  return (
    <>
      <AppLayout title="Formularz C">
        <FormC context={context} />
      </AppLayout>
    </>
  );
}
