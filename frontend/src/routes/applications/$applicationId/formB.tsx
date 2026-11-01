import { submitApplicationForm } from '@/integrations/tanstack/form/submitApplicationForm';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { Layout } from '@/components/shared/Layout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { captureHandledRefusal } from '@/integrations/sentry/mutations';
import { navigateToFirstError, saveFailedMessage } from '@/integrations/tanstack/form/errors';
import { FormView } from './-components/formB/FormView';
import {
  type FormBValues,
  formBDefaultValues,
  getFormBSubmissionSchema,
} from '@/routes/applications/$applicationId/-schemas/formB.schema';
import {
  getGetApplicationFormBQueryKey,
  getGetApplicationQueryKey,
  useGetApplicationCruiseSuspense,
} from '@/api/generated/endpoints/applications.gen';
import { useFormAQuery, useFormBQuery } from '@/routes/applications/$applicationId/-hooks/useApplicationFormQueries';
import {
  useGetApplicationFormAContextSuspense,
  useGetApplicationFormBContextSuspense,
  useRefillApplicationFormB,
  useUpdateApplicationFormB,
} from '@/api/generated/endpoints/applications.gen';
import { ApiError, getErrorMessage } from '@/api/errors';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { UnsavedChangesGuard } from '@/integrations/tanstack/router/UnsavedChangesGuard';
import { useLeaveAfterSave } from '@/integrations/tanstack/router/useLeaveAfterSave';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { isInRole, useCurrentUser } from '@/integrations/tanstack/query/auth';
import { useApplicationQuery } from '@/integrations/tanstack/query/applications';
import { Role } from '@/integrations/auth/types';
import { canRevertFormB } from '@/lib/applications/status';

export const Route = createFileRoute('/applications/$applicationId/formB')({
  component: FormBPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.ShipCrew),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view', 'preview'])),
  }),
});

function FormBPage() {
  const { applicationId } = Route.useParams();
  const mode = Route.useSearch().mode ?? 'view';

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  const formA = useFormAQuery(applicationId);
  const formB = useFormBQuery(applicationId);
  const formAInitValues = useGetApplicationFormAContextSuspense({ applicationId });
  const formBInitValues = useGetApplicationFormBContextSuspense();
  const cruise = useGetApplicationCruiseSuspense(applicationId);
  const updateMutation = useUpdateApplicationFormB({ mutation: { meta: { handlesError: true } } });
  const revertToEditMutation = useRefillApplicationFormB({ mutation: { meta: { handlesError: true } } });
  const applicationQueryKey = getGetApplicationQueryKey(applicationId);
  const application = useApplicationQuery(applicationId, {
    enabled: mode === 'preview' && isInRole(currentUser, [Role.Administrator, Role.ShipOwner]),
  });
  const canRevertToEdit = mode === 'preview' && !!application.data && canRevertFormB(application.data.status);
  const [saved, setSaved] = useState<{ data: typeof formB.data; values: FormBValues }>();

  const storedValues = (formB.data ?? {
    ...formBDefaultValues,
    revision: formA.data.revision,
    permissions: formA.data.permissions,
    ugTeams: formA.data.ugTeams,
    guestTeams: formA.data.guestTeams,
  }) satisfies FormBValues;
  const defaultValues = saved?.data === formB.data ? saved.values : storedValues;
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
      if (!form.state.values.draft) trackFormSubmit('form-b', 'invalid', form.state);
      navigateToFirstError({ toast: true });
    },
  });
  const leaveAfterSave = useLeaveAfterSave(form);

  useEffect(() => {
    if (mode !== 'edit') form.reset();
  }, [mode, form]);

  const context = {
    form,
    formA: formA.data,
    formAInitValues: formAInitValues.data,
    formBInitValues: formBInitValues.data,
    cruise: cruise.data,
    isReadonly: mode !== 'edit',
    onSaveDraft: handleDraftSave,
    onRevertToEdit: canRevertToEdit ? handleRevertToEdit : undefined,
    actionsDisabled: updateMutation.isPending || revertToEditMutation.isPending,
  };

  async function handleValidSubmit(values: FormBValues) {
    if (!values.draft) trackFormSubmit('form-b', 'valid', form.state);

    const loading = toast.loading(
      values.draft ? 'Zapisywanie wersji roboczej formularza...' : 'Zapisywanie formularza...'
    );
    try {
      const { revision } = await updateMutation.mutateAsync({
        applicationId,
        data: { form: schema.parse(values), draft: values.draft ?? false },
      });
      form.setFieldValue('revision', revision, { dontUpdateMeta: true, dontValidate: true });
      setSaved({ data: formB.data, values: { ...values, revision } });
      await queryClient.invalidateQueries({ queryKey: getGetApplicationFormBQueryKey(applicationId) });
      toast.success(
        values.draft ? 'Formularz został zapisany jako wersja robocza' : 'Formularz został wysłany pomyślnie.'
      );
      await leaveAfterSave({ ...values, revision }, { to: '/applications' }).catch(console.error);
    } catch (err) {
      console.error(err);
      captureHandledRefusal(values.draft ? 'form-b.draft' : 'form-b.submit', err);
      if (err instanceof ApiError && err.status === 409) void formB.refetch();
      setServerFormErrors(form, err);
      toast.error(getErrorMessage(err, saveFailedMessage(values.draft)));
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
    const loading = toast.loading('Cofanie formularza B do edycji...');
    try {
      await revertToEditMutation.mutateAsync({ applicationId });
      await queryClient.invalidateQueries({ queryKey: getGetApplicationFormBQueryKey(applicationId) });
      await navigate({ to: `/applications/${applicationId}/formB?mode=edit` });
    } catch (err) {
      captureHandledRefusal('form-b.refill', err);
      toast.error(getErrorMessage(err, 'Nie udało się cofnąć formularza B do edycji'));
    } finally {
      toast.dismiss(loading);
      void queryClient.invalidateQueries({ queryKey: applicationQueryKey, exact: true });
    }
  }

  return (
    <>
      <Layout title="Formularz B">
        <form.AppForm>
          <FormView context={context} />
        </form.AppForm>
      </Layout>
      <UnsavedChangesGuard form={form} disabled={mode !== 'edit'} recoveryKey={`${applicationId}/formB`} />
    </>
  );
}
