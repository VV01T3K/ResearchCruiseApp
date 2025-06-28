import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppModal } from '@/core/components/AppModal';
import { AppInput } from '@/core/components/inputs/AppInput';
import { getErrors, navigateToFirstError, removeEmptyValues } from '@/core/lib/utils';
import { FormA } from '@/cruise-applications/components/formA/FormA';
import { getFormAValidationSchema } from '@/cruise-applications/helpers/FormAValidationSchema';
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

  const form = useForm<FormADto>({
    defaultValues: {
      id: undefined,
      cruiseManagerId: userContext.currentUser!.id,
      deputyManagerId: '',
      year: initialStateQuery.data.years[0],
      acceptablePeriod: ['0', '24'],
      optimalPeriod: ['0', '24'],
      precisePeriodStart: '',
      precisePeriodEnd: '',
      cruiseHours: '0',
      periodNotes: '',
      shipUsage: '',
      differentUsage: '',
      permissions: [],
      researchAreaId: '',
      researchAreaInfo: '',
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
    },
    validators: {
      onChange: getFormAValidationSchema(initialStateQuery.data),
    },
  });

  const year = useStore(form.store, (state) => state.values.year);
  const blockadesQuery = useBlockadesQuery(+year);

  // Update form validators when blockades change
  useEffect(() => {
    form.options.validators = {
      onChange: getFormAValidationSchema(initialStateQuery.data, blockadesQuery.data),
    };
  }, [blockadesQuery.data, initialStateQuery.data, form.options]);

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
    setHasFormBeenSubmitted(true);

    await form.validate('change');
    if (!form.state.isValid) {
      setIsSaveDraftModalOpen(false);
      toast.error('Formularz zawiera błędy. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
      navigateToFirstError();
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
      navigateToFirstError();
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
      navigateToFirstError();
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
        <FormA context={context} />
      </AppLayout>

      <AppModal title="Zapisz Formularz A" isOpen={isSaveDraftModalOpen} onClose={() => setIsSaveDraftModalOpen(false)}>
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
                required
              />
            )}
          />

          <div className="flex justify-center gap-4">
            <AppButton className="gap-4" disabled={saveMutation.isPending} onClick={handleSavingDraft}>
              <FloppyFillIcon className="h-4 w-4" />
              Zapisz
            </AppButton>
          </div>
        </div>
      </AppModal>
    </>
  );
}
