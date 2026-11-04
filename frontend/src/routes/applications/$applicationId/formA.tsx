import { submitApplicationForm } from '@/integrations/tanstack/form/submitApplicationForm';
import { useSelector } from '@tanstack/react-form';
import { useSuspenseQueries } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/integrations/auth/types';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { FloppyDiskIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Modal } from '@/components/shared/Modal';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError, saveFailedMessage } from '@/integrations/tanstack/form/errors';
import { FormView } from '@/features/applications/components/formA/FormView';
import {
  type FormAValues,
  formADefaultValues,
  getFormASubmissionSchema,
} from '@/features/applications/schemas/formA.schema';
import { formAQueryOptions } from '@/features/applications/hooks/useApplicationFormQueries';
import {
  getGetApplicationFormAContextSuspenseQueryOptions,
  useUpdateApplicationFormA,
} from '@/api/generated/endpoints/applications.gen';
import { useGetCruiseBlockades } from '@/api/generated/endpoints/cruises.gen';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';
import { groupedQueryStaleTime } from '@/integrations/tanstack/query/root-provider';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { UnsavedChangesGuard } from '@/integrations/tanstack/router/UnsavedChangesGuard';
import { useSaveTracking } from '@/integrations/tanstack/router/useSaveTracking';
import { useLeaveAfterSave } from '@/integrations/tanstack/router/useLeaveAfterSave';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { ApiError, getErrorMessage } from '@/api/errors';

export const Route = createFileRoute('/applications/$applicationId/formA')({
  component: FormAPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.ShipCrew),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view'])),
  }),
});

function FormAPage() {
  const { applicationId } = Route.useParams();
  const mode = Route.useSearch().mode ?? 'view';

  const currentUser = useCurrentUser()!;
  const [initialStateQuery, formA] = useSuspenseQueries({
    queries: [
      getGetApplicationFormAContextSuspenseQueryOptions(
        { applicationId },
        { query: { staleTime: groupedQueryStaleTime } }
      ),
      formAQueryOptions(applicationId),
    ],
  });
  const saving = useSaveTracking();
  const saveMutation = useUpdateApplicationFormA({
    mutation: { meta: { handlesError: true, onAccepted: saving.onAccepted } },
  });

  const editMode = mode === 'edit';
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  const [saved, setSaved] = useState<{ data: typeof formA.data; values: FormAValues }>();

  const storedValues = (formA.data ?? {
    ...formADefaultValues,
    cruiseManagerId: currentUser.id,
    year: initialStateQuery.data.years[0],
    acceptablePeriod: ['0', '24'],
    optimalPeriod: ['0', '24'],
  }) satisfies FormAValues;
  const defaultValues = saved?.data === formA.data ? saved.values : storedValues;
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
    onSubmit: ({ value }) => saveForm(value),
    onSubmitInvalid: () => {
      if (!form.state.values.draft) trackFormSubmit('form-a', 'invalid', form.state);
      setIsSaveDraftModalOpen(false);
      navigateToFirstError({ toast: true });
    },
  });
  const leaveAfterSave = useLeaveAfterSave(form);
  const formYear = useSelector(form.store, (state) => state.values.year);
  if (formYear !== selectedYear) setSelectedYear(formYear);

  useEffect(() => {
    if (!editMode) form.reset();
  }, [editMode, form]);

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
    saving.start(values);
    try {
      const { revision } = await saveMutation.mutateAsync({
        applicationId,
        data: { form: schema.parse(values), draft: values.draft ?? false },
      });
      form.setFieldValue('revision', revision, { dontUpdateMeta: true, dontValidate: true });
      setSaved({ data: formA.data, values: { ...values, revision } });
      toast.success(
        values.draft
          ? 'Formularz został zapisany jako wersja robocza'
          : 'Formularz został zapisany i wysłany do potwierdzenia przez przełożonego'
      );
      await leaveAfterSave({ ...values, revision }, { to: '/' });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) void formA.refetch();
      setServerFormErrors(form, error);
      toast.error(getErrorMessage(error, saveFailedMessage(values.draft)));
      navigateToFirstError();
      throw error;
    } finally {
      saving.finish();
      toast.dismiss(loading);
      setIsSaveDraftModalOpen(false);
    }
  }

  return (
    <>
      <Layout title="Formularz A">
        <form.AppForm>
          <FormView context={context} />
        </form.AppForm>
      </Layout>
      <UnsavedChangesGuard form={form} disabled={!editMode} recoveryKey={`${applicationId}/formA`} saving={saving} />

      <Modal
        title="Zapisz wersję roboczą Formularza A"
        isOpen={isSaveDraftModalOpen}
        onClose={() => setIsSaveDraftModalOpen(false)}
      >
        <div className="space-y-4">
          <form.AppField name="note">
            {(field) => (
              <field.TextField
                label="Notatka aktualnej wersji roboczej"
                placeholder="Wpisz notatkę dot. aktualnej wersji roboczej"
                autoFocus
              />
            )}
          </form.AppField>

          <div className="flex justify-center gap-4">
            <Button
              className="gap-4"
              disabled={saveMutation.isPending}
              onClick={() => void submitApplicationForm(form, true)}
            >
              <FloppyDiskIcon weight="fill" className="h-4 w-4" />
              Zapisz wersję roboczą
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
