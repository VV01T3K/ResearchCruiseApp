import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/types/user';
import { revalidateLogic } from '@tanstack/react-form';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { useState } from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/lib/sentry';
import { getFormErrorMessage, navigateToFirstError } from '@/lib/form-errors';
import { FormView } from '@/routes/applications/$applicationId/-components/formA/FormView';
import {
  FORM_A_FIELD_TO_SECTION,
  type FormAValues,
  getFormADraftWriteSchema,
  getFormAWriteSchema,
} from '@/routes/applications/$applicationId/-schemas/formA.schema';
import {
  useCreateApplication,
  useGetApplicationFormAContextSuspense,
} from '@/api/generated/endpoints/applications.gen';
import { mapFormAOptions } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { useGetCruiseBlockades } from '@/api/generated/endpoints/cruises.gen';
import { useUserContext } from '@/providers/useUserContext';
import { useAppForm } from '@/lib/form';
import { installServerFormErrors } from '@/lib/form-errors';

export const Route = createFileRoute('/applications/new')({
  component: NewCruiseApplicationPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager),
});

function NewCruiseApplicationPage() {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const initialStateQuery = useGetApplicationFormAContextSuspense({
    query: { select: mapFormAOptions },
  });
  const saveMutation = useCreateApplication();

  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);

  const defaultValues: FormAValues = {
    id: undefined,
    cruiseManagerId: userContext.currentUser!.id,
    deputyManagerId: '',
    year: initialStateQuery.data.years[0],
    acceptablePeriod: '',
    optimalPeriod: '',
    precisePeriodStart: '',
    precisePeriodEnd: '',
    periodSelectionType: 'period',
    cruiseDays: 0,
    cruiseHours: 0,
    periodNotes: '',
    shipUsage: '',
    differentUsage: '',
    permissions: [],
    researchAreaDescriptions: [],
    cruiseGoal: '',
    cruiseGoalDescription: '',
    researchTasks: [],
    contracts: [],
    ugTeams: [],
    guestTeams: [],
    publications: [],
    spubTasks: [],
    supervisorEmail: '',
    note: '',
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
    onSubmit: () => form.handleSubmit(),
    onSaveDraft: () => setIsSaveDraftModalOpen(true),
    actionsDisabled: saveMutation.isPending,
  };

  async function handleValidSubmit() {
    trackFormSubmit('new-application', 'valid', form.state);

    if (
      form.state.values.cruiseManagerId !== userContext.currentUser!.id &&
      form.state.values.deputyManagerId !== userContext.currentUser!.id
    ) {
      setIsSaveDraftModalOpen(false);
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      navigateToFirstError();
      return;
    }

    const loading = toast.loading('Zapisywanie formularza...');

    saveMutation.mutate(
      {
        data: getFormAWriteSchema(initialStateQuery.data, blockadesQuery.data).parse(form.state.values),
      },
      {
        onSuccess: () => {
          toast.success('Formularz został zapisany i wysłany do potwierdzenia przez przełożonego.');
          navigate({ to: '/' });
        },
        onError: (err) => {
          console.error(err);
          if (installServerFormErrors(form, err)) {
            toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
            navigateToFirstError();
            return;
          }
          toast.error('Nie udało się zapisać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie.');
          navigateToFirstError();
        },
        onSettled: () => {
          toast.dismiss(loading);
          setIsSaveDraftModalOpen(false);
        },
      }
    );
  }

  function handleSavingDraft() {
    if (
      form.state.values.cruiseManagerId !== userContext.currentUser!.id &&
      form.state.values.deputyManagerId !== userContext.currentUser!.id
    ) {
      setIsSaveDraftModalOpen(false);
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      navigateToFirstError();
      return;
    }

    const loading = toast.loading('Zapisywanie wersji roboczej formularza...');
    saveMutation.mutate(
      { data: getFormADraftWriteSchema().parse(form.state.values) },
      {
        onSuccess: () => {
          toast.success('Formularz został zapisany jako wersja robocza');
          navigate({ to: '/' });
        },
        onError: (err) => {
          console.error(err);
          toast.error('Nie udało się zapisać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie.');
          navigateToFirstError();
        },
        onSettled: () => {
          setIsSaveDraftModalOpen(false);
          toast.dismiss(loading);
        },
      }
    );
  }

  return (
    <>
      <AppLayout title="Formularz A">
        <FormView form={form} context={context} />
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
