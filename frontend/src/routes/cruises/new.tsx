import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { revalidateLogic } from '@tanstack/react-form';
import ArrowClockwiseIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?react';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { getFormErrorMessage, navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { FormView } from './-components/FormView';
import { CreateCruiseFormSchema, cruiseFormDefaultValues } from '@/routes/cruises/-schemas/form.schema';
import { useCreateCruise } from '@/api/generated/endpoints/cruises.gen';
import { useGetApplicationsForCruisePlanningSuspense } from '@/api/generated/endpoints/applications.gen';
import { mapCruiseApplicationCandidate } from '@/api/applications/cruise-candidates';

const searchSchema = z.object({
  blockade: z.boolean().optional(),
});

export const Route = createFileRoute('/cruises/new')({
  component: NewCruisePage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: searchSchema,
});

const CRUISE_FIELD_TO_SECTION: Record<string, number> = {
  title: 1,
  shipUnavailable: 1,
  startDate: 2,
  endDate: 2,
  'managersTeam.mainCruiseManagerId': 3,
  'managersTeam.mainDeputyManagerId': 3,
  cruiseApplicationsIds: 4,
};

function NewCruisePage() {
  const cruiseApplicationsQuery = useGetApplicationsForCruisePlanningSuspense({
    query: { select: (applications) => applications.map(mapCruiseApplicationCandidate) },
  });
  const createCruiseMutation = useCreateCruise();
  const search = Route.useSearch();

  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      ...cruiseFormDefaultValues,
      shipUnavailable: search.blockade ?? false,
    },
    validationLogic: revalidateLogic({ mode: 'blur', modeAfterSubmission: 'change' }),
    validators: { onDynamic: CreateCruiseFormSchema },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('new-cruise', 'invalid', formApi.state);
      toast.error(getFormErrorMessage(formApi, CRUISE_FIELD_TO_SECTION));
      navigateToFirstError();
    },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit('new-cruise', 'valid', formApi.state);
      try {
        await createCruiseMutation.mutateAsync({ data: CreateCruiseFormSchema.parse(value) });
        navigate({ to: '/cruises' });
        toast.success('Rejs został utworzony pomyślnie.');
      } catch (error) {
        console.error(error);
        toast.error('Nie udało się utworzyć rejsu. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
        navigateToFirstError();
      }
    },
  });

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
        <form.AppForm>
          <FormView cruiseApplications={cruiseApplicationsQuery.data} isReadonly={false} buttons={buttons} />
        </form.AppForm>
      </AppLayout>
    </>
  );
}
