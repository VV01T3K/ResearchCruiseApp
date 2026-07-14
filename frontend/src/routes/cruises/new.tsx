import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import ArrowClockwiseIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?react';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import React from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/lib/sentry';
import { getFormErrorMessage, navigateToFirstError } from '@/lib/utils';
import { FormView } from './-components/FormView';
import { getCruiseFormSchema, type CruiseFormValues } from '@/routes/cruises/-schemas/form.schema';
import { getGetCruisesQueryKey, useCreateCruise } from '@/api/generated/endpoints/cruises.gen';
import { useGetApplicationsForCruisePlanningSuspense } from '@/api/generated/endpoints/applications.gen';
import type { CruiseApplicationCandidate } from '@/routes/applications/$applicationId/-schemas/types/CruiseApplicationCandidate';

const searchSchema = z.object({
  blockade: z.boolean().optional(),
});

export const Route = createFileRoute('/cruises/new')({
  component: NewCruisePage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: searchSchema,
});

const CRUISE_FIELD_TO_SECTION: Record<string, number> = {
  startDate: 1,
  endDate: 1,
  'managersTeam.mainCruiseManagerId': 2,
  'managersTeam.mainDeputyManagerId': 2,
  cruiseApplicationsIds: 3,
  title: 4,
};

function NewCruisePage() {
  const cruiseApplicationsQuery = useGetApplicationsForCruisePlanningSuspense({
    query: { select: (applications) => applications as CruiseApplicationCandidate[] },
  });
  const queryClient = useQueryClient();
  const createCruiseMutation = useCreateCruise({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCruisesQueryKey() }),
    },
  });
  const search = Route.useSearch();

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
    } as CruiseFormValues,
    validators: {
      onChange: getCruiseFormSchema(),
    },
  });

  async function handleSubmitting() {
    setHasFormBeenSubmitted(true);
    form.validateAllFields('change');
    if (!form.state.isValid) {
      trackFormSubmit('new-cruise', 'invalid', form.state);
      toast.error(getFormErrorMessage(form, CRUISE_FIELD_TO_SECTION));
      navigateToFirstError(form, CRUISE_FIELD_TO_SECTION);
      return;
    }

    trackFormSubmit('new-cruise', 'valid', form.state);

    await createCruiseMutation.mutateAsync(
      { data: getCruiseFormSchema().parse(form.state.values) },
      {
        onSuccess: () => {
          navigate({ to: '/cruises' });
          toast.success('Rejs został utworzony pomyślnie.');
        },
        onError: (error) => {
          console.error(error);
          toast.error('Nie udało się utworzyć rejsu. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
          navigateToFirstError(form, CRUISE_FIELD_TO_SECTION);
        },
      }
    );
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
        <FormView
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
