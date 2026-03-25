import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { useEffect, useState } from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppModal } from '@/core/components/AppModal';
import { AppInput } from '@/core/components/inputs/AppInput';
import { toast } from '@/core/components/layout/toast';
import { getErrors, getFormErrorMessage, navigateToFirstError, removeEmptyValues } from '@/core/lib/utils';
import { FormA } from '@/cruise-applications/components/formA/FormA';
import { FORM_A_FIELD_TO_SECTION, getFormAValidationSchema } from '@/cruise-applications/helpers/FormAValidationSchema';
import { useFormAInitValuesQuery, useSaveFormAMutation } from '@/cruise-applications/hooks/FormAApiHooks';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { useBlockadesQuery } from '@/cruise-schedule/hooks/CruisesApiHooks';
import { useUserContext } from '@/user/hooks/UserContextHook';

export function NewCruisePage() {
  const navigate = useNavigate();
  const userContext = useUserContext();
  const initialStateQuery = useFormAInitValuesQuery();
  const saveMutation = useSaveFormAMutation();

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
      cruiseHours: '0',
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
    } as FormADto,
    validators: {
      onChange: getFormAValidationSchema(initialStateQuery.data, undefined),
    },
  });

  const year = useStore(form.store, (state) => state.values.year);
  const blockadesQuery = useBlockadesQuery(+year);

  console.log(
    'NewCruisePage render: year=',
    year,
    'blockades query status=',
    blockadesQuery.status,
    'blockades count=',
    blockadesQuery.data?.length ?? 0
  );

  // Update form validators when blockades change
  useEffect(() => {
    console.log('NewCruisePage useEffect: updating validators with blockades', blockadesQuery.data?.length ?? 0);
    const newValidators = {
      onChange: getFormAValidationSchema(initialStateQuery.data, blockadesQuery.data),
    };
    form.update({
      validators: newValidators,
    });
    console.log('Validators updated via form.update()');

    // Re-validate the fields that depend on blockades if form has been submitted
    if (hasFormBeenSubmitted) {
      console.log('Re-validating form fields due to blockade change');
      form.validate('change');
    }
  }, [blockadesQuery.data, blockadesQuery.status, initialStateQuery.data, hasFormBeenSubmitted]);

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
    console.log('handleSubmitting called, current blockades:', blockadesQuery.data?.length ?? 0);

    // Ensure validators are updated with the latest blockades BEFORE validation
    const currentValidators = {
      onChange: getFormAValidationSchema(initialStateQuery.data, blockadesQuery.data),
    };
    form.update({
      validators: currentValidators,
    });
    console.log('Validators updated right before validation via form.update()');

    setHasFormBeenSubmitted(true);

    await form.validate('change');
    if (!form.state.isValid) {
      setIsSaveDraftModalOpen(false);
      toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
      return;
    }

    const dto = removeEmptyValues(form.state.values, [
      'year',
      'periodNotes',
      'differentUsage',
      'supervisorEmail',
      'cruiseGoalDescription',
      'researchAreaInfo',
    ]);

    if (dto.cruiseManagerId !== userContext.currentUser!.id && dto.deputyManagerId !== userContext.currentUser!.id) {
      setIsSaveDraftModalOpen(false);
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
      return;
    }

    const loading = toast.loading('Zapisywanie formularza...');

    saveMutation.mutate(
      { form: dto, draft: false },
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
    const dto = removeEmptyValues(form.state.values, [
      'year',
      'periodNotes',
      'differentUsage',
      'supervisorEmail',
      'cruiseGoalDescription',
      'researchAreaInfo',
    ]);

    if (dto.cruiseManagerId !== userContext.currentUser!.id && dto.deputyManagerId !== userContext.currentUser!.id) {
      setIsSaveDraftModalOpen(false);
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
      return;
    }

    const loading = toast.loading('Zapisywanie wersji roboczej formularza...');
    saveMutation.mutate(
      { form: dto, draft: true },
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
        <FormA context={context} />
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
