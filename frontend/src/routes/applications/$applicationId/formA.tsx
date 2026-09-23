import { submitApplicationForm } from '@/lib/applications/submitApplicationForm';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { useState } from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { getFormErrorMessage, navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { FormView } from '@/routes/applications/$applicationId/-components/formA/FormView';
import {
  FORM_A_FIELD_TO_SECTION,
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
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { getErrorMessage } from '@/api/fetch';

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

  const navigate = useNavigate();
  const currentUser = useCurrentUser()!;
  const initialStateQuery = useGetApplicationFormAContextSuspense();
  const saveMutation = useUpdateApplicationFormA();
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
  const schema = getFormASubmissionSchema(initialStateQuery.data, blockadesQuery.data, applicationId);
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
      trackFormSubmit('form-a', 'invalid', form.state);
      setIsSaveDraftModalOpen(false);
      toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
      navigateToFirstError();
    },
  });

  const context = {
    form,
    initValues: initialStateQuery.data,
    isReadonly: !editMode,
    blockades: blockadesQuery.data,
    onSaveDraft: () => setIsSaveDraftModalOpen(true),
    actionsDisabled: saveMutation.isPending,
  };

  async function saveForm(values: FormAValues) {
    trackFormSubmit('form-a', 'valid', form.state);
    if (values.cruiseManagerId !== currentUser.id && values.deputyManagerId !== currentUser.id) {
      setIsSaveDraftModalOpen(false);
      const message = 'Jedynie kierownik lub jego zastępca mogą zapisać formularz';
      toast.error(message);
      throw new Error(message);
    }
    const loading = toast.loading(
      values.draft ? 'Zapisywanie wersji roboczej formularza...' : 'Zapisywanie formularza...'
    );
    try {
      await saveMutation.mutateAsync({ applicationId, data: schema.parse(values) });
      toast.success(
        values.draft
          ? 'Formularz został zapisany jako wersja robocza'
          : 'Formularz został zapisany i wysłany do potwierdzenia przez przełożonego'
      );
      await navigate({ to: '/' });
    } catch (error) {
      if (setServerFormErrors(form, error)) {
        toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
      } else {
        toast.error(getErrorMessage(error, 'Nie udało się zapisać formularza'));
      }
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
              <FloppyFillIcon className="h-4 w-4" />
              Zapisz wersję roboczą
            </AppButton>
          </div>
        </div>
      </AppModal>
    </>
  );
}
