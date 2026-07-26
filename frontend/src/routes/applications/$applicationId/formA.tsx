import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { revalidateLogic } from '@tanstack/react-form';
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
  getFormADraftWriteSchema,
  getFormAWriteSchema,
} from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { useFormAQuery } from '@/routes/applications/$applicationId/-hooks/useApplicationFormQueries';
import {
  useGetApplicationFormAContextSuspense,
  useUpdateApplicationFormA,
} from '@/api/generated/endpoints/applications.gen';
import { mapFormAOptions } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { useGetCruiseBlockades } from '@/api/generated/endpoints/cruises.gen';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { setSchemaErrors, setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { getErrorMessage } from '@/api/client/custom-fetch';

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
  const initialStateQuery = useGetApplicationFormAContextSuspense({
    query: { select: mapFormAOptions },
  });
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
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic({ mode: 'blur', modeAfterSubmission: 'change' }),
    validators: {
      onDynamic: getFormAWriteSchema(initialStateQuery.data, blockadesQuery.data, applicationId),
    },
    listeners: {
      onChange: ({ fieldApi }) => {
        if (fieldApi.name === 'year') setSelectedYear(String(fieldApi.state.value));
      },
    },
    onSubmit: () => handleValidSubmit(),
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

  function isCurrentUserManagerOrDeputy(dto: FormAValues) {
    const userId = currentUser.id;
    return dto.cruiseManagerId === userId || dto.deputyManagerId === userId;
  }

  async function saveForm(draft: boolean, loadingMessage: string, successMessage: string) {
    if (!isCurrentUserManagerOrDeputy(form.state.values)) {
      setIsSaveDraftModalOpen(false);
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      return;
    }

    const schema = draft
      ? getFormADraftWriteSchema(applicationId)
      : getFormAWriteSchema(initialStateQuery.data, blockadesQuery.data, applicationId);
    if (setSchemaErrors(form, schema)) {
      toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
      navigateToFirstError();
      return;
    }

    const loading = toast.loading(loadingMessage);
    try {
      await saveMutation.mutateAsync({
        applicationId,
        data: schema.parse(form.state.values),
      });
      navigate({ to: '/' });
      toast.success(successMessage);
    } catch (err) {
      console.error(err);
      if (setServerFormErrors(form, err)) {
        toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
        navigateToFirstError();
        return;
      }
      toast.error(getErrorMessage(err, 'Nie udało się zapisać formularza'));
      navigateToFirstError();
    } finally {
      setIsSaveDraftModalOpen(false);
      toast.dismiss(loading);
    }
  }

  async function handleValidSubmit() {
    trackFormSubmit('form-a', 'valid', form.state);

    await saveForm(
      false,
      'Zapisywanie formularza...',
      'Formularz został zapisany i wysłany do potwierdzenia przez przełożonego'
    );
  }

  function handleSaveDraft() {
    void saveForm(true, 'Zapisywanie wersji roboczej formularza...', 'Formularz został zapisany jako wersja robocza');
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
            <AppButton className="gap-4" disabled={saveMutation.isPending} onClick={handleSaveDraft}>
              <FloppyFillIcon className="h-4 w-4" />
              Zapisz wersję roboczą
            </AppButton>
          </div>
        </div>
      </AppModal>
    </>
  );
}
