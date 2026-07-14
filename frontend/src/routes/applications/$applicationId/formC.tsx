import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/lib/sentry';
import { getFormErrorMessage, navigateToFirstError } from '@/lib/utils';
import { FormView } from './-components/formC/FormView';
import {
  FORM_C_FIELD_TO_SECTION,
  getFormCValidationSchema,
  getFormCWriteSchema,
} from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { useGetApplicationCruiseSuspense } from '@/api/generated/endpoints/applications.gen';
import {
  useFormAQuery,
  useFormBQuery,
  useFormCQuery,
} from '@/routes/applications/$applicationId/-hooks/useApplicationFormQueries';
import {
  useGetApplicationFormAContextSuspense,
  useGetApplicationFormBContextSuspense,
  useUpdateApplicationFormC,
} from '@/api/generated/endpoints/applications.gen';
import { FormCWriteRequest } from '@/api/generated/schemas';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import type { FormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import { ApiError } from '@/lib/custom-fetch';
import { FormCValues } from '@/routes/applications/$applicationId/-schemas/types/FormCValues';
import { ResearchTaskEffectValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskEffectValues';

export const Route = createFileRoute('/applications/$applicationId/formC')({
  component: FormCPage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view'])),
  }),
});

function FormCPage() {
  const { applicationId } = Route.useParams();
  const mode = Route.useSearch().mode ?? 'preview';

  const navigate = useNavigate();

  const formA = useFormAQuery(applicationId);
  const formB = useFormBQuery(applicationId);
  const formC = useFormCQuery(applicationId);
  const formAInitValues = useGetApplicationFormAContextSuspense({
    query: { select: (context) => context as FormAOptions },
  });
  const formBInitValues = useGetApplicationFormBContextSuspense({
    query: { select: (context) => context as FormBOptions },
  });
  const cruise = useGetApplicationCruiseSuspense(applicationId);
  const updateMutation = useUpdateApplicationFormC();

  if (!formB.data) throw notFound();

  const form = useForm({
    defaultValues: (formC.data ?? {
      shipUsage: formA.data.shipUsage, // Max length 1
      differentUsage: formA.data.differentUsage,
      permissions: formB.data.permissions,
      researchAreaDescriptions: formA.data.researchAreaDescriptions,
      ugTeams: formB.data.ugTeams,
      guestTeams: formB.data.guestTeams,
      researchTasksEffects: formA.data.researchTasks.map(
        (task) =>
          ({
            ...task,
            done: 'false',
            managerConditionMet: 'false',
            deputyConditionMet: 'false',
          }) as ResearchTaskEffectValues
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
    }) as FormCValues,
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
      trackFormSubmit('form-c', 'invalid', form.state);
      toast.error(getFormErrorMessage(form, FORM_C_FIELD_TO_SECTION));
      navigateToFirstError(form, FORM_C_FIELD_TO_SECTION);
      return;
    }

    trackFormSubmit('form-c', 'valid', form.state);

    const loading = toast.loading('Zapisywanie formularza...');
    await updateMutation.mutateAsync(
      {
        applicationId,
        data: getFormCWriteSchema(formAInitValues.data, false).parse(form.state.values),
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          toast.success('Formularz został wysłany pomyślnie.');
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 403) {
            toast.error(
              'Aplikacja nie znajduje się w odpowiednim stanie, aby przesłać formularz. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.'
            );
            navigate({ to: '/applications' });
            return;
          }

          console.error(err);
          toast.error('Nie udało się zapisać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie.');
          navigateToFirstError(form, FORM_C_FIELD_TO_SECTION);
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
        applicationId,
        data: FormCWriteRequest.parse({ form: form.state.values, draft: true }),
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          toast.success('Wersja robocza formularza została zapisana pomyślnie.');
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 403) {
            toast.error(
              'Aplikacja nie znajduje się w odpowiednim stanie, aby zapisać wersję roboczą formularza. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.'
            );
            navigate({ to: '/applications' });
            return;
          }

          console.error(err);
          toast.error('Nie udało się zapisać wersji roboczej formularza. Spróbuj ponownie.');
          navigateToFirstError(form, FORM_C_FIELD_TO_SECTION);
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
        <FormView context={context} />
      </AppLayout>
    </>
  );
}
