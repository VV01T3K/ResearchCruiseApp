import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/types/user';
import { useForm, useSelector } from '@tanstack/react-form';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { useEffect, useState } from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/lib/sentry';
import { getErrors, getFormErrorMessage, navigateToFirstError } from '@/lib/utils';
import { FormView } from '@/routes/applications/$applicationId/-components/formA/FormView';
import {
  FORM_A_FIELD_TO_SECTION,
  getFormAValidationSchema,
  getFormAWriteSchema,
  parseFormADraft,
} from '@/routes/applications/$applicationId/-schemas/formA.schema';
import {
  useCreateApplication,
  useGetApplicationFormAContextSuspense,
} from '@/api/generated/endpoints/applications.gen';
import { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import { mapFormAOptions } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { useGetCruiseBlockades } from '@/api/generated/endpoints/cruises.gen';
import { useUserContext } from '@/providers/useUserContext';

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

  const [hasFormBeenSubmitted, setHasFormBeenSubmitted] = useState(false);
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);

  const form = useForm({
    defaultValues: {
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
    } as FormAValues,
    validators: {
      onChange: getFormAValidationSchema(initialStateQuery.data),
    },
  });

  const year = useSelector(form.store, (state) => state.values.year);
  const blockadesQuery = useGetCruiseBlockades({ year: +year });

  // Update form validators when blockades change
  useEffect(() => {
    const newValidators = {
      onChange: getFormAValidationSchema(initialStateQuery.data, blockadesQuery.data),
    };
    form.update({
      validators: newValidators,
    });

    // Re-validate the fields that depend on blockades if form has been submitted
    if (hasFormBeenSubmitted) {
      form.validate('change');
    }
  }, [blockadesQuery.data, blockadesQuery.status, initialStateQuery.data, hasFormBeenSubmitted, form]);

  const context = {
    form,
    initValues: initialStateQuery.data,
    isReadonly: false,
    hasFormBeenSubmitted,
    blockades: blockadesQuery.data,
    onSubmit: handleSubmitting,
    onSaveDraft: () => setIsSaveDraftModalOpen(true),
    actionsDisabled: saveMutation.isPending,
  };

  async function handleSubmitting() {
    // Ensure validators are updated with the latest blockades BEFORE validation
    const currentValidators = {
      onChange: getFormAValidationSchema(initialStateQuery.data, blockadesQuery.data),
    };
    form.update({
      validators: currentValidators,
    });

    setHasFormBeenSubmitted(true);

    await form.validate('change');
    if (!form.state.isValid) {
      trackFormSubmit('new-application', 'invalid', form.state);
      setIsSaveDraftModalOpen(false);
      toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
      return;
    }

    trackFormSubmit('new-application', 'valid', form.state);

    if (
      form.state.values.cruiseManagerId !== userContext.currentUser!.id &&
      form.state.values.deputyManagerId !== userContext.currentUser!.id
    ) {
      setIsSaveDraftModalOpen(false);
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
      return;
    }

    const loading = toast.loading('Zapisywanie formularza...');

    saveMutation.mutate(
      {
        data: getFormAWriteSchema(initialStateQuery.data, false, blockadesQuery.data).parse(form.state.values),
      },
      {
        onSuccess: () => {
          toast.success('Formularz został zapisany i wysłany do potwierdzenia przez przełożonego.');
          navigate({ to: '/' });
        },
        onError: (err) => {
          console.error(err);
          toast.error('Nie udało się zapisać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie.');
          navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
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
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
      return;
    }

    const loading = toast.loading('Zapisywanie wersji roboczej formularza...');
    saveMutation.mutate(
      { data: parseFormADraft(form.state.values) },
      {
        onSuccess: () => {
          toast.success('Formularz został zapisany jako wersja robocza');
          navigate({ to: '/' });
        },
        onError: (err) => {
          console.error(err);
          toast.error('Nie udało się zapisać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie.');
          navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
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
        <FormView context={context} />
      </AppLayout>

      <AppModal
        title="Zapisz wersję roboczą Formularza A"
        isOpen={isSaveDraftModalOpen}
        onClose={() => setIsSaveDraftModalOpen(false)}
      >
        <div className="space-y-4">
          <form.Field
            name="note"
            children={(field) => (
              <AppInput
                name={field.name}
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                label="Notatka aktualnej wersji roboczej"
                placeholder="Wpisz notatkę dot. aktualnej wersji roboczej"
                errors={getErrors(field.state.meta)}
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
