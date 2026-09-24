import { submitApplicationForm } from '@/lib/applications/submitApplicationForm';
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { getFormErrorMessage, navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { FormView } from './-components/formC/FormView';
import {
  FORM_C_FIELD_TO_SECTION,
  type FormCValues,
  formCDefaultValues,
  getFormCSubmissionSchema,
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
import { ApiError, getErrorMessage } from '@/api/fetch';
import { ResearchTaskEffectValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskEffectValues';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';

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
  const formAInitValues = useGetApplicationFormAContextSuspense();
  const formBInitValues = useGetApplicationFormBContextSuspense();
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
  const schema = getFormCSubmissionSchema(formAInitValues.data);
  const form = useAppForm({
    canSubmitWhenInvalid: true,
    defaultValues,
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: schema,
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

    const loading = toast.loading(
      values.draft ? 'Zapisywanie wersji roboczej formularza...' : 'Zapisywanie formularza...'
    );
    try {
      await updateMutation.mutateAsync({
        applicationId,
        data: schema.parse(values),
      });
      navigate({ to: '/applications' });
      toast.success(
        values.draft ? 'Formularz został zapisany jako wersja robocza' : 'Formularz został wysłany pomyślnie.'
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        toast.error(
          'Aplikacja nie znajduje się w odpowiednim stanie, aby przesłać formularz. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.'
        );
        navigate({ to: '/applications' });
        throw err;
      }

      console.error(err);
      if (setServerFormErrors(form, err)) {
        toast.error(getFormErrorMessage(form, FORM_C_FIELD_TO_SECTION));
        navigateToFirstError();
        throw err;
      }
      toast.error(getErrorMessage(err, 'Nie udało się zapisać formularza'));
      navigateToFirstError();
      throw err;
    } finally {
      toast.dismiss(loading);
    }
  }

  function handleDraftSave() {
    void submitApplicationForm(form, true);
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
