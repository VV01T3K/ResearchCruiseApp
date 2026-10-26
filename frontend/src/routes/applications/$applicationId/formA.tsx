import { submitApplicationForm } from '@/integrations/tanstack/form/submitApplicationForm';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { FloppyDiskIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError, saveFailedMessage } from '@/integrations/tanstack/form/errors';
import { FormView } from '@/routes/applications/$applicationId/-components/formA/FormView';
import {
  type FormAValues,
  formADefaultValues,
  getFormASubmissionSchema,
} from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { useFormAQuery } from '@/routes/applications/$applicationId/-hooks/useApplicationFormQueries';
import {
  useGetApplicationFormAContextSuspense,
  useUpdateApplicationFormA,
} from '@/api/generated/endpoints/applications.gen';
import { useGetCruiseBlockades } from '@/api/generated/endpoints/cruises.gen';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { UnsavedChangesGuard } from '@/integrations/tanstack/router/UnsavedChangesGuard';
import { useLeaveAfterSave } from '@/integrations/tanstack/router/useLeaveAfterSave';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { getErrorMessage } from '@/api/errors';

export const Route = createFileRoute('/applications/$applicationId/formA')({
  component: FormAPage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view'])),
  }),
});

function FormAPage() {
  const { applicationId } = Route.useParams();
  const mode = Route.useSearch().mode ?? 'view';

  const currentUser = useCurrentUser()!;
  const initialStateQuery = useGetApplicationFormAContextSuspense();
  const saveMutation = useUpdateApplicationFormA({ mutation: { meta: { handlesError: true } } });
  const formA = useFormAQuery(applicationId);

  const editMode = mode === 'edit';
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);

  const defaultValues = (formA.data ?? {
    ...formADefaultValues,
    cruiseManagerId: currentUser.id,
    year: initialStateQuery.data.years[0],
    acceptablePeriod: ['0', '24'],
    optimalPeriod: ['0', '24'],
  }) satisfies FormAValues;
  const [selectedYear, setSelectedYear] = useState(defaultValues.year);
  const blockadesQuery = useGetCruiseBlockades({ year: +selectedYear });
  const schema = getFormASubmissionSchema(initialStateQuery.data, currentUser.id, blockadesQuery.data, applicationId);
  const form = useAppForm({
    canSubmitWhenInvalid: true,
    defaultValues,
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: schema,
    },
    listeners: {
      onChange: ({ fieldApi }) => {
        if (fieldApi.name === 'year') setSelectedYear(String(fieldApi.state.value));
      },
    },
    onSubmit: ({ value }) => saveForm(value),
    onSubmitInvalid: () => {
      if (!form.state.values.draft) trackFormSubmit('form-a', 'invalid', form.state);
      setIsSaveDraftModalOpen(false);
      navigateToFirstError({ toast: true });
    },
  });
  const leaveAfterSave = useLeaveAfterSave(form);

  const context = {
    form,
    initValues: initialStateQuery.data,
    isReadonly: !editMode,
    blockades: blockadesQuery.data,
    blockadesError: blockadesQuery.error,
    onSaveDraft: () => setIsSaveDraftModalOpen(true),
    actionsDisabled: saveMutation.isPending,
  };

  async function saveForm(values: FormAValues) {
    if (!values.draft) trackFormSubmit('form-a', 'valid', form.state);
    const loading = toast.loading(
      values.draft ? 'Zapisywanie wersji roboczej formularza...' : 'Zapisywanie formularza...'
    );
    try {
      const { revision } = await saveMutation.mutateAsync({
        applicationId,
        data: { form: schema.parse(values), draft: values.draft ?? false },
      });
      form.setFieldValue('revision', revision, { dontUpdateMeta: true, dontValidate: true });
      toast.success(
        values.draft
          ? 'Formularz został zapisany jako wersja robocza'
          : 'Formularz został zapisany i wysłany do potwierdzenia przez przełożonego'
      );
      await leaveAfterSave({ ...values, revision }, { to: '/' });
    } catch (error) {
      setServerFormErrors(form, error);
      toast.error(getErrorMessage(error, saveFailedMessage(values.draft)));
      navigateToFirstError();
      throw error;
    } finally {
      toast.dismiss(loading);
      setIsSaveDraftModalOpen(false);
    }
  }

  return (
    <>
      <AppLayout title="Formularz A">
        <form.AppForm>
          <FormView context={context} />
        </form.AppForm>
      </AppLayout>
      <UnsavedChangesGuard form={form} disabled={!editMode} />

      <AppModal
        title="Zapisz wersję roboczą Formularza A"
        isOpen={isSaveDraftModalOpen}
        onClose={() => setIsSaveDraftModalOpen(false)}
      >
        <div className="space-y-4">
          <form.AppField
            name="note"
            children={(field) => (
              <field.TextField
                label="Notatka aktualnej wersji roboczej"
                placeholder="Wpisz notatkę dot. aktualnej wersji roboczej"
                autoFocus
              />
            )}
          />

          <div className="flex justify-center gap-4">
            <AppButton
              className="gap-4"
              disabled={saveMutation.isPending}
              onClick={() => void submitApplicationForm(form, true)}
            >
              <FloppyDiskIcon weight="fill" className="h-4 w-4" />
              Zapisz wersję roboczą
            </AppButton>
          </div>
        </div>
      </AppModal>
    </>
  );
}
