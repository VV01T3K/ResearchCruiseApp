import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/api/client/user';
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
import {
  useCreateApplication,
  useGetApplicationFormAContextSuspense,
} from '@/api/generated/endpoints/applications.gen';
import { mapFormAOptions } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { useGetCruiseBlockades } from '@/api/generated/endpoints/cruises.gen';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { setSchemaErrors, setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { getErrorMessage } from '@/api/client/custom-fetch';

export const Route = createFileRoute('/applications/new')({
  component: NewCruiseApplicationPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager),
});

function NewCruiseApplicationPage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser()!;
  const initialStateQuery = useGetApplicationFormAContextSuspense({
    query: { select: mapFormAOptions },
  });
  const saveMutation = useCreateApplication();

  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);

  const defaultValues: FormAValues = {
    ...formADefaultValues,
    cruiseManagerId: currentUser.id,
    year: initialStateQuery.data.years[0],
  } satisfies FormAValues;
  const [selectedYear, setSelectedYear] = useState(defaultValues.year);
  const blockadesQuery = useGetCruiseBlockades({ year: +selectedYear });
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic({ mode: 'blur', modeAfterSubmission: 'change' }),
    validators: {
      onDynamic: getFormAWriteSchema(initialStateQuery.data, blockadesQuery.data),
    },
    listeners: {
      onChange: ({ fieldApi }) => {
        if (fieldApi.name === 'year') setSelectedYear(String(fieldApi.state.value));
      },
    },
    onSubmit: () => handleValidSubmit(),
    onSubmitInvalid: () => {
      trackFormSubmit('new-application', 'invalid', form.state);
      setIsSaveDraftModalOpen(false);
      toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
      navigateToFirstError();
    },
  });

  const context = {
    form,
    initValues: initialStateQuery.data,
    isReadonly: false,
    blockades: blockadesQuery.data,
    onSaveDraft: () => setIsSaveDraftModalOpen(true),
    actionsDisabled: saveMutation.isPending,
  };

  async function handleValidSubmit() {
    trackFormSubmit('new-application', 'valid', form.state);

    if (form.state.values.cruiseManagerId !== currentUser.id && form.state.values.deputyManagerId !== currentUser.id) {
      setIsSaveDraftModalOpen(false);
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      navigateToFirstError();
      return;
    }

    const loading = toast.loading('Zapisywanie formularza...');

    try {
      await saveMutation.mutateAsync({
        data: getFormAWriteSchema(initialStateQuery.data, blockadesQuery.data).parse(form.state.values),
      });
      toast.success('Formularz został zapisany i wysłany do potwierdzenia przez przełożonego.');
      navigate({ to: '/' });
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
      toast.dismiss(loading);
      setIsSaveDraftModalOpen(false);
    }
  }

  async function handleSavingDraft() {
    if (form.state.values.cruiseManagerId !== currentUser.id && form.state.values.deputyManagerId !== currentUser.id) {
      setIsSaveDraftModalOpen(false);
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      navigateToFirstError();
      return;
    }

    const schema = getFormADraftWriteSchema();
    if (setSchemaErrors(form, schema)) {
      toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
      navigateToFirstError();
      return;
    }

    const loading = toast.loading('Zapisywanie wersji roboczej formularza...');
    try {
      await saveMutation.mutateAsync({ data: schema.parse(form.state.values) });
      toast.success('Formularz został zapisany jako wersja robocza');
      navigate({ to: '/' });
    } catch (err) {
      console.error(err);
      if (setServerFormErrors(form, err)) {
        toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
        navigateToFirstError();
        return;
      }
      toast.error(getErrorMessage(err, 'Nie udało się zapisać wersji roboczej formularza'));
      navigateToFirstError();
    } finally {
      setIsSaveDraftModalOpen(false);
      toast.dismiss(loading);
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
            <AppButton className="gap-4" disabled={saveMutation.isPending} onClick={handleSavingDraft}>
              <FloppyFillIcon className="h-4 w-4" />
              Zapisz wersję roboczą
            </AppButton>
          </div>
        </div>
      </AppModal>
    </>
  );
}
