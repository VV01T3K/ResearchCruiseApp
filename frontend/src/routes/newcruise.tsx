import { createFileRoute } from '@tanstack/react-router';

import { type FormValidateOrFn, useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { useEffect, useState } from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { toast } from '@/components/shared/layout/toast';
import { FormA } from '@/components/applications/formA/FormA';
import { useFormAInitValuesQuery, useSaveFormAMutation } from '@/api/hooks/applications/FormAApiHooks';
import { FormADto } from '@/api/dto/applications/FormADto';
import { useBlockadesQuery } from '@/api/hooks/cruises/CruisesApiHooks';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/models/shared/Role';
import { getErrors, getFormErrorMessage, navigateToFirstError, removeEmptyValues } from '@/lib/utils';
import { useUserContext } from '@/providers/useUserContext';
import {
  FORM_A_FIELD_TO_SECTION,
  getFormAValidationSchema,
} from '@/routes/applications/$applicationId/-formA/formA.schema';

export const Route = createFileRoute('/newcruise')({
  component: NewCruisePage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager),
});

function NewCruisePage() {
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
      onChange: getFormAValidationSchema(initialStateQuery.data) as FormValidateOrFn<FormADto>,
    },
  });

  const year = useStore(form.store, (state) => state.values.year);
  const blockadesQuery = useBlockadesQuery(+year);

  useEffect(() => {
    const newValidators = {
      onChange: getFormAValidationSchema(initialStateQuery.data, blockadesQuery.data) as FormValidateOrFn<FormADto>,
    };
    form.update({
      validators: newValidators,
    });

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
    const currentValidators = {
      onChange: getFormAValidationSchema(initialStateQuery.data, blockadesQuery.data) as FormValidateOrFn<FormADto>,
    };
    form.update({
      validators: currentValidators,
    });

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
