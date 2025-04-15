import { useForm } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { useState } from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppModal } from '@/core/components/AppModal';
import { AppInput } from '@/core/components/inputs/AppInput';
import { useAppContext } from '@/core/hooks/AppContextHook';
import { getErrors, removeEmptyValues } from '@/core/lib/utils';
import { FormA } from '@/cruise-applications/components/formA/FormA';
import { getFormAValidationSchema } from '@/cruise-applications/helpers/FormAValidationSchema';
import {
  useFormAInitValuesQuery,
  useFormAQuery,
  useUpdateFormAMutation,
} from '@/cruise-applications/hooks/FormAApiHooks';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { useUserContext } from '@/user/hooks/UserContextHook';

export function FormAPage() {
  const routeApi = getRouteApi('/applications/$applicationId/formA');
  const { applicationId } = routeApi.useParams();
  const mode = routeApi.useSearch().mode ?? 'view';

  const navigate = useNavigate();
  const appContext = useAppContext();
  const userContext = useUserContext();
  const initialStateQuery = useFormAInitValuesQuery();
  const saveMutation = useUpdateFormAMutation();
  const formA = useFormAQuery(applicationId);

  const [editMode] = useState(mode === 'edit');
  const [hasFormBeenSubmitted, setHasFormBeenSubmitted] = useState(false);
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);

  const form = useForm<FormADto>({
    defaultValues: formA.data ?? {
      id: undefined,
      cruiseManagerId: userContext.currentUser!.id,
      deputyManagerId: '',
      year: initialStateQuery.data.years[0],
      acceptablePeriod: ['0', '24'],
      optimalPeriod: ['0', '24'],
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

  async function handleSubmitting(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    setHasFormBeenSubmitted(true);

    await form.validate('change');
    if (!form.state.isValid) {
      setIsSaveDraftModalOpen(false);
      appContext.showAlert({
        title: 'Wykryto błąd w formularzu',
        message: 'Nie udało się zapisać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie.',
        variant: 'danger',
      });
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
      appContext.showAlert({
        title: 'Wykryto błąd w formularzu',
        message: 'Jedynie kierownik lub jego zastępca mogą zapisać formularz',
        variant: 'danger',
      });
      return;
    }

    saveMutation.mutate(
      { id: applicationId, form: dto, draft: false },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          appContext.showAlert({
            title: 'Formularz przyjęty',
            message: 'Formularz został zapisany i wysłany do potwierdzenia przez przełożonego',
            variant: 'success',
          });
        },
        onError: (err) => {
          console.error(err);
          appContext.showAlert({
            title: 'Wystąpił błąd',
            message: 'Nie udało się zapisać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie.',
            variant: 'danger',
          });
        },
        onSettled: () => setIsSaveDraftModalOpen(false),
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
      appContext.showAlert({
        title: 'Wykryto błąd w formularzu',
        message: 'Jedynie kierownik lub jego zastępca mogą zapisać formularz',
        variant: 'danger',
      });
      return;
    }

    saveMutation.mutate(
      { id: applicationId, form: dto, draft: true },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          appContext.showAlert({
            title: 'Zapisano formularz',
            message: 'Formularz został zapisany w wersji roboczej',
            variant: 'success',
          });
        },
        onError: (err) => {
          console.error(err);
          appContext.showAlert({
            title: 'Wystąpił błąd',
            message: 'Nie udało się zapisać formularza. Sprawdź, czy wszystkie pola są wypełnione poprawnie.',
            variant: 'danger',
          });
        },
        onSettled: () => setIsSaveDraftModalOpen(false),
      }
    );
  }

  return (
    <>
      <AppLayout title="Formularz A">
        <form className="space-y-8" onSubmit={handleSubmitting}>
          <FormA
            context={{ form, initValues: initialStateQuery.data, isReadonly: !editMode, hasFormBeenSubmitted }}
            onSaveDraft={() => setIsSaveDraftModalOpen(true)}
          />
        </form>
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
