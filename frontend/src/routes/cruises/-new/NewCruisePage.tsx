import { useForm } from '@tanstack/react-form';
import { useNavigate, useSearch } from '@tanstack/react-router';
import ArrowClockwiseIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?react';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import React from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { getFormErrorMessage, navigateToFirstError, removeEmptyValues } from '@/lib/utils';
import { CruiseFrom } from '@/components/cruises/cruise-form/CruiseForm';
import { useCreateCruiseMutation, useCruiseApplicationsForCruiseQuery } from '@/api/hooks/cruises/CruisesApiHooks';
import { CruiseFormDto } from '@/api/dto/cruises/CruiseFormDto';
import { getCruiseFormValidationSchema } from './cruiseForm.schema';

const CRUISE_FIELD_TO_SECTION: Record<string, number> = {
  startDate: 1,
  endDate: 1,
  'managersTeam.mainCruiseManagerId': 2,
  'managersTeam.mainDeputyManagerId': 2,
  cruiseApplicationsIds: 3,
  title: 4,
};

export function NewCruisePage() {
  const cruiseApplicationsQuery = useCruiseApplicationsForCruiseQuery();
  const createCruiseMutation = useCreateCruiseMutation();
  const search = useSearch({ from: '/cruises/new' });

  const navigate = useNavigate();

  const [hasFormBeenSubmitted, setHasFormBeenSubmitted] = React.useState(false);

  const form = useForm({
    defaultValues: {
      startDate: '',
      endDate: '',
      managersTeam: {
        mainCruiseManagerId: '',
        mainDeputyManagerId: '',
      },
      cruiseApplicationsIds: [],
      title: '',
      shipUnavailable: search.blockade ?? false,
    } as CruiseFormDto,
    validators: {
      onChange: getCruiseFormValidationSchema(),
    },
  });

  async function handleSubmitting() {
    setHasFormBeenSubmitted(true);
    form.validateAllFields('change');
    if (!form.state.isValid) {
      toast.error(getFormErrorMessage(form, CRUISE_FIELD_TO_SECTION));
      navigateToFirstError(form, CRUISE_FIELD_TO_SECTION);
      return;
    }

    const dto = removeEmptyValues(form.state.values, [
      'managersTeam.mainCruiseManagerId',
      'managersTeam.mainDeputyManagerId',
    ]);
    await createCruiseMutation.mutateAsync(dto, {
      onSuccess: () => {
        navigate({ to: '/cruises' });
        toast.success('Rejs został utworzony pomyślnie.');
      },
      onError: (error) => {
        console.error(error);
        toast.error('Nie udało się utworzyć rejsu. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
        navigateToFirstError(form, CRUISE_FIELD_TO_SECTION);
      },
    });
  }

  const buttons = (
    <>
      <AppButton className="w-36 !justify-center gap-4 lg:w-64" variant="primaryOutline" onClick={() => form.reset()}>
        <ArrowClockwiseIcon className="h-4 w-4" />
        Wyczyść formularz
      </AppButton>
      <AppButton className="w-36 !justify-center gap-4 lg:w-64" type="submit">
        <FloppyFillIcon className="h-4 w-4" />
        Zapisz
      </AppButton>
    </>
  );

  return (
    <>
      <AppLayout title={search.blockade ? 'Nowa blokada' : 'Nowy rejs'}>
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
