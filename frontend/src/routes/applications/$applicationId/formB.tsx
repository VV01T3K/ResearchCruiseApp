import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { revalidateLogic } from '@tanstack/react-form';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { getFormErrorMessage, navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { FormView } from './-components/formB/FormView';
import {
  FORM_B_FIELD_TO_SECTION,
  type FormBValues,
  formBDefaultValues,
  getFormBDraftWriteSchema,
  getFormBWriteSchema,
} from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { useGetApplicationCruiseSuspense } from '@/api/generated/endpoints/applications.gen';
import { useFormAQuery, useFormBQuery } from '@/routes/applications/$applicationId/-hooks/useApplicationFormQueries';
import {
  useGetApplicationFormAContextSuspense,
  useGetApplicationFormBContextSuspense,
  useRefillApplicationFormB,
  useUpdateApplicationFormB,
} from '@/api/generated/endpoints/applications.gen';
import { mapFormAOptions } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { mapFormBOptions } from '@/api/applications/types/FormBOptions';
import { ApiError } from '@/api/custom-fetch';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { setSchemaErrors, setServerFormErrors } from '@/integrations/tanstack/form/errors';

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
  const formAInitValues = useGetApplicationFormAContextSuspense({
    query: { select: mapFormAOptions },
  });
  const formBInitValues = useGetApplicationFormBContextSuspense({
    query: { select: mapFormBOptions },
  });
  const cruise = useGetApplicationCruiseSuspense(applicationId);
  const updateMutation = useUpdateApplicationFormB();
  const revertToEditMutation = useRefillApplicationFormB();

  const defaultValues = (formB.data ?? {
    ...formBDefaultValues,
    permissions: formA.data.permissions,
    ugTeams: formA.data.ugTeams,
    guestTeams: formA.data.guestTeams,
  }) satisfies FormBValues;
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic({ mode: 'blur', modeAfterSubmission: 'change' }),
    validators: {
      onDynamic: getFormBWriteSchema(),
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

    const loading = toast.loading('Zapisywanie formularza...');
    try {
      await updateMutation.mutateAsync({
        applicationId,
        data: getFormBWriteSchema().parse(values),
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
        toast.error(getFormErrorMessage(form, FORM_B_FIELD_TO_SECTION));
        navigateToFirstError();
        return;
      }
      toast.error(
        'Nie udało się wysłać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie i spróbuj ponownie.'
      );
      navigateToFirstError();
    } finally {
      toast.dismiss(loading);
    }
  }

  async function handleDraftSave() {
    const schema = getFormBDraftWriteSchema();
    if (setSchemaErrors(form, schema)) {
      toast.error(getFormErrorMessage(form, FORM_B_FIELD_TO_SECTION));
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
      toast.success('Wersja robocza formularza została zapisana.');
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
        toast.error(getFormErrorMessage(form, FORM_B_FIELD_TO_SECTION));
        navigateToFirstError();
        return;
      }
      toast.error('Nie udało się zapisać wersji roboczej formularza. Spróbuj ponownie.');
      navigateToFirstError();
    } finally {
      toast.dismiss(loading);
    }
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
