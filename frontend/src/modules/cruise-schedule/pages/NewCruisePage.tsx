import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import ArrowClockwiseIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?react';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { useAppContext } from '@/core/hooks/AppContextHook';
import { removeEmptyValues } from '@/core/lib/utils';
import { CruiseFrom } from '@/cruise-schedule/components/cruise-from/CruiseFrom';
import { getCruiseFormValidationSchema } from '@/cruise-schedule/helpers/CruiseFormValidationSchema';
import { useCreateCruiseMutation, useCruiseApplicationsForCruiseQuery } from '@/cruise-schedule/hooks/CruisesApiHooks';
import { CruiseFormDto } from '@/cruise-schedule/models/CruiseFormDto';

export function NewCruisePage() {
  const cruiseApplicationsQuery = useCruiseApplicationsForCruiseQuery();
  const createCruiseMutation = useCreateCruiseMutation();

  const navigate = useNavigate();
  const appContext = useAppContext();

  const [hasFormBeenSubmitted, setHasFormBeenSubmitted] = React.useState(false);

  const form = useForm<CruiseFormDto>({
    defaultValues: {
      startDate: '',
      endDate: '',
      managersTeam: {
        mainCruiseManagerId: '',
        mainDeputyManagerId: '',
      },
      cruiseApplicationsIds: [],
    },
    validators: {
      onChange: getCruiseFormValidationSchema(),
    },
  });

  async function handleSubmitting() {
    setHasFormBeenSubmitted(true);
    form.validateAllFields('change');
    if (!form.state.isValid) {
      appContext.showAlert({
        title: 'Błąd walidacji formularza',
        message: 'Formularz zawiera błędy. Sprawdź, czy wszystkie pola są wypełnione poprawnie.',
        variant: 'danger',
      });
      return;
    }

    const dto = removeEmptyValues(form.state.values, [
      'managersTeam.mainCruiseManagerId',
      'managersTeam.mainDeputyManagerId',
    ]);
    await createCruiseMutation.mutateAsync(dto, {
      onSuccess: () => {
        navigate({ to: '/cruises' });
        appContext.showAlert({
          title: 'Zapisano formularz',
          message: 'Rejs został utworzony pomyślnie.',
          variant: 'success',
        });
      },
      onError: (error) => {
        console.error(error);
        appContext.showAlert({
          title: 'Błąd zapisu',
          message: 'Nie udało się zapisać rejsu. Sprawdź, czy wszystkie pola są wypełnione poprawnie.',
          variant: 'danger',
        });
      },
    });
  }

  const buttons = (
    <>
      <AppButton className="gap-4 !justify-center w-36 lg:w-64" variant="primaryOutline" onClick={() => form.reset()}>
        <ArrowClockwiseIcon className="h-4 w-4" />
        Wyczyść formularz
      </AppButton>
      <AppButton className="gap-4 !justify-center w-36 lg:w-64" type="submit">
        <FloppyFillIcon className="h-4 w-4" />
        Zapisz
      </AppButton>
    </>
  );

  return (
    <>
      <AppLayout title="Nowy rejs">
        <CruiseFrom
          context={{
            form,
            cruiseApplications: cruiseApplicationsQuery.data,
            isReadonly: false,
            hasFormBeenSubmitted,
          }}
          buttons={buttons}
          onSubmit={handleSubmitting}
        />
      </AppLayout>
    </>
  );
}
