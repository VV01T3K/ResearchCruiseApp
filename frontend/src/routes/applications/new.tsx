import { submitApplicationForm } from '@/integrations/tanstack/form/submitApplicationForm';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/integrations/auth/types';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { FloppyDiskIcon } from '@phosphor-icons/react';
import { useState } from 'react';
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
import {
  useCreateApplication,
  useGetApplicationFormAContextSuspense,
} from '@/api/generated/endpoints/applications.gen';
import { useGetCruiseBlockades } from '@/api/generated/endpoints/cruises.gen';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { UnsavedChangesGuard } from '@/integrations/tanstack/router/UnsavedChangesGuard';
import { useSaveTracking } from '@/integrations/tanstack/router/useSaveTracking';
import { useLeaveAfterSave } from '@/integrations/tanstack/router/useLeaveAfterSave';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { getErrorMessage } from '@/api/errors';

export const Route = createFileRoute('/applications/new')({
  component: NewCruiseApplicationPage,
  validateSearch: z.object({ draft: z.string().optional() }),
  beforeLoad: async (context) => {
    await allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager)(context);
    if (!context.search.draft) {
      throw redirect({
        to: '/applications/new',
        search: { draft: `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}` },
        replace: true,
      });
    }
  },
});

function NewCruiseApplicationPage() {
  const { draft } = Route.useSearch();
  const currentUser = useCurrentUser()!;
  const initialStateQuery = useGetApplicationFormAContextSuspense();
  const saving = useSaveTracking();
  const saveMutation = useCreateApplication({
    mutation: { meta: { handlesError: true, onAccepted: saving.onAccepted } },
  });

  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);

  const defaultValues: FormAValues = {
    ...formADefaultValues,
    cruiseManagerId: currentUser.id,
    year: initialStateQuery.data.years[0],
  } satisfies FormAValues;
  const [selectedYear, setSelectedYear] = useState(defaultValues.year);
  const blockadesQuery = useGetCruiseBlockades({ year: +selectedYear });
  const schema = getFormASubmissionSchema(initialStateQuery.data, currentUser.id, blockadesQuery.data);
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
      if (!form.state.values.draft) trackFormSubmit('new-application', 'invalid', form.state);
      setIsSaveDraftModalOpen(false);
      navigateToFirstError({ toast: true });
    },
  });
  const leaveAfterSave = useLeaveAfterSave(form);

  const context = {
    form,
    initValues: initialStateQuery.data,
    isReadonly: false,
    blockades: blockadesQuery.data,
    blockadesError: blockadesQuery.error,
    onSaveDraft: () => setIsSaveDraftModalOpen(true),
    actionsDisabled: saveMutation.isPending,
  };

  async function saveForm(values: FormAValues) {
    const created = saving.acceptedValues();
    if (created) {
      setIsSaveDraftModalOpen(false);
      return leaveAfterSave(created, { to: '/' });
    }
    if (saving.isSaving()) return;
    if (!values.draft) trackFormSubmit('new-application', 'valid', form.state);
    const loading = toast.loading(
      values.draft ? 'Zapisywanie wersji roboczej formularza...' : 'Zapisywanie formularza...'
    );
    saving.start(values);
    try {
      await saveMutation.mutateAsync({ data: { form: schema.parse(values), draft: values.draft ?? false } });
      toast.success(
        values.draft
          ? 'Formularz został zapisany jako wersja robocza'
          : 'Formularz został zapisany i wysłany do potwierdzenia przez przełożonego'
      );
      await leaveAfterSave(values, { to: '/' });
    } catch (error) {
      saving.finish();
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
      <Layout title="Formularz A">
        <form.AppForm>
          <FormView context={context} />
        </form.AppForm>
      </Layout>
      <UnsavedChangesGuard form={form} recoveryKey={`new/${draft}`} saving={saving} />

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
            <Button loading={saveMutation.isPending} onClick={() => void submitApplicationForm(form, true)}>
              <FloppyDiskIcon className="h-4 w-4" />
              Zapisz wersję roboczą
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
