import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { revalidateLogic } from '@tanstack/react-form';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { getFormErrorMessage, navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { FormView } from './-components/formC/FormView';
import {
  FORM_C_FIELD_TO_SECTION,
  type FormCValues,
  formCDefaultValues,
  getFormCDraftWriteSchema,
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
import { mapFormAOptions } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { mapFormBOptions } from '@/routes/applications/$applicationId/-schemas/types/FormBOptions';
import { ApiError } from '@/lib/custom-fetch';
import { ResearchTaskEffectValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskEffectValues';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { setSchemaErrors, setServerFormErrors } from '@/integrations/tanstack/form/errors';

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
    query: { select: mapFormAOptions },
  });
  const formBInitValues = useGetApplicationFormBContextSuspense({
    query: { select: mapFormBOptions },
  });
  const cruise = useGetApplicationCruiseSuspense(applicationId);
  const updateMutation = useUpdateApplicationFormC();

  if (!formB.data) throw notFound();

  const defaultValues = (formC.data ?? {
    ...formCDefaultValues,
    shipUsage: formA.data.shipUsage ?? '', // Max length 1
    differentUsage: formA.data.differentUsage,
    permissions: formB.data.permissions,
    researchAreaDescriptions: formA.data.researchAreaDescriptions,
    ugTeams: formB.data.ugTeams,
    guestTeams: formB.data.guestTeams,
    researchTasksEffects: formA.data.researchTasks.map(
      (task) =>
        ({
          ...task,
          done: false,
          managerConditionMet: false,
          deputyConditionMet: false,
        }) satisfies ResearchTaskEffectValues
    ),
    contracts: formA.data.contracts,
    spubTasks: formA.data.spubTasks,
    shortResearchEquipments: formB.data.shortResearchEquipments,
    longResearchEquipments: formB.data.longResearchEquipments,
    ports: formB.data.ports,
    cruiseDaysDetails: formB.data.cruiseDaysDetails,
    researchEquipments: formB.data.researchEquipments,
    shipEquipmentsIds: formB.data.shipEquipmentsIds,
  }) satisfies FormCValues;
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic({ mode: 'blur', modeAfterSubmission: 'change' }),
    validators: {
      onDynamic: getFormCWriteSchema(formAInitValues.data),
    },
    onSubmit: async ({ value }) => handleValidSubmit(value),
    onSubmitInvalid: () => {
      trackFormSubmit('form-c', 'invalid', form.state);
      toast.error(getFormErrorMessage(form, FORM_C_FIELD_TO_SECTION));
      navigateToFirstError();
    },
  });
  const context = {
    form,
    formA: formA.data,
    formB: formB.data,
    formAInitValues: formAInitValues.data,
    formBInitValues: formBInitValues.data,
    cruise: cruise.data,
    isReadonly: mode !== 'edit',
    onSaveDraft: handleDraftSave,
    actionsDisabled: updateMutation.isPending,
  };

  async function handleValidSubmit(values: FormCValues) {
    trackFormSubmit('form-c', 'valid', form.state);

    const loading = toast.loading('Zapisywanie formularza...');
    try {
      await updateMutation.mutateAsync({
        applicationId,
        data: getFormCWriteSchema(formAInitValues.data).parse(values),
      });
      navigate({ to: '/applications' });
      toast.success('Formularz został wysłany pomyślnie.');
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        toast.error(
          'Aplikacja nie znajduje się w odpowiednim stanie, aby przesłać formularz. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.'
        );
        navigate({ to: '/applications' });
        return;
      }

      console.error(err);
      if (setServerFormErrors(form, err)) {
        toast.error(getFormErrorMessage(form, FORM_C_FIELD_TO_SECTION));
        navigateToFirstError();
        return;
      }
      toast.error('Nie udało się zapisać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie.');
      navigateToFirstError();
    } finally {
      toast.dismiss(loading);
    }
  }

  async function handleDraftSave() {
    const schema = getFormCDraftWriteSchema();
    if (setSchemaErrors(form, schema)) {
      toast.error(getFormErrorMessage(form, FORM_C_FIELD_TO_SECTION));
      navigateToFirstError();
      return;
    }

    const loading = toast.loading('Zapisywanie wersji roboczej formularza...');
    try {
      await updateMutation.mutateAsync({
        applicationId,
        data: schema.parse(form.state.values),
      });
      navigate({ to: '/applications' });
      toast.success('Wersja robocza formularza została zapisana pomyślnie.');
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        toast.error(
          'Aplikacja nie znajduje się w odpowiednim stanie, aby zapisać wersję roboczą formularza. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.'
        );
        navigate({ to: '/applications' });
        return;
      }

      console.error(err);
      if (setServerFormErrors(form, err)) {
        toast.error(getFormErrorMessage(form, FORM_C_FIELD_TO_SECTION));
        navigateToFirstError();
        return;
      }
      toast.error('Nie udało się zapisać wersji roboczej formularza. Spróbuj ponownie.');
      navigateToFirstError();
    } finally {
      toast.dismiss(loading);
    }
  }

  return (
    <>
      <AppLayout title="Formularz C">
        <form.AppForm>
          <FormView context={context} />
        </form.AppForm>
      </AppLayout>
    </>
  );
}
