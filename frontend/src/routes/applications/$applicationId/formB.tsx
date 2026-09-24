import { submitApplicationForm } from '@/lib/applications/submitApplicationForm';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { getFormErrorMessage, navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { FormView } from './-components/formB/FormView';
import {
  FORM_B_FIELD_TO_SECTION,
  type FormBValues,
  formBDefaultValues,
  getFormBSubmissionSchema,
} from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { useGetApplicationCruiseSuspense } from '@/api/generated/endpoints/applications.gen';
import { useFormAQuery, useFormBQuery } from '@/routes/applications/$applicationId/-hooks/useApplicationFormQueries';
import {
  useGetApplicationFormAContextSuspense,
  useGetApplicationFormBContextSuspense,
  useRefillApplicationFormB,
  useUpdateApplicationFormB,
} from '@/api/generated/endpoints/applications.gen';
import { ApiError, getErrorMessage } from '@/api/fetch';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';

export const Route = createFileRoute('/applications/$applicationId/formB')({
  component: FormBPage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view', 'preview'])),
  }),
});

function FormBPage() {
  const { applicationId } = Route.useParams();
  const mode = Route.useSearch().mode ?? 'preview';

  const navigate = useNavigate();

  const formA = useFormAQuery(applicationId);
  const formB = useFormBQuery(applicationId);
  const formAInitValues = useGetApplicationFormAContextSuspense();
  const formBInitValues = useGetApplicationFormBContextSuspense();
  const cruise = useGetApplicationCruiseSuspense(applicationId);
  const updateMutation = useUpdateApplicationFormB();
  const revertToEditMutation = useRefillApplicationFormB();

  const defaultValues = (formB.data ?? {
    ...formBDefaultValues,
    permissions: formA.data.permissions,
    ugTeams: formA.data.ugTeams,
    guestTeams: formA.data.guestTeams,
  }) satisfies FormBValues;
  const schema = getFormBSubmissionSchema();
  const form = useAppForm({
    canSubmitWhenInvalid: true,
    defaultValues,
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: schema,
    },
    onSubmit: async ({ value }) => handleValidSubmit(value),
    onSubmitInvalid: () => {
      trackFormSubmit('form-b', 'invalid', form.state);
      toast.error(getFormErrorMessage(form, FORM_B_FIELD_TO_SECTION));
      navigateToFirstError();
    },
  });
  const context = {
    form,
    formA: formA.data,
    formAInitValues: formAInitValues.data,
    formBInitValues: formBInitValues.data,
    cruise: cruise.data,
    isReadonly: mode !== 'edit',
    onSaveDraft: handleDraftSave,
    onRevertToEdit: mode === 'preview' ? handleRevertToEdit : undefined,
    actionsDisabled: updateMutation.isPending || revertToEditMutation.isPending,
  };

  async function handleValidSubmit(values: FormBValues) {
    trackFormSubmit('form-b', 'valid', form.state);

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
        toast.error(getFormErrorMessage(form, FORM_B_FIELD_TO_SECTION));
        navigateToFirstError();
        throw err;
      }
      toast.error(getErrorMessage(err, 'Nie udało się wysłać formularza'));
      navigateToFirstError();
      throw err;
    } finally {
      toast.dismiss(loading);
    }
  }

  function handleDraftSave() {
    void submitApplicationForm(form, true);
  }

  async function handleRevertToEdit() {
    const loading = toast.loading('Cofanie formularza do edycji...');
    try {
      await revertToEditMutation.mutateAsync({ applicationId });
      await navigate({ to: `/applications/${applicationId}/formB?mode=edit` });
    } finally {
      toast.dismiss(loading);
    }
  }

  return (
    <>
      <AppLayout title="Formularz B">
        <form.AppForm>
          <FormView context={context} />
        </form.AppForm>
      </AppLayout>
    </>
  );
}
