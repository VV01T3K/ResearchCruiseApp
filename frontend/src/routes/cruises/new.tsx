import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { revalidateLogic } from '@tanstack/react-form';
import ArrowClockwiseIcon from 'bootstrap-icons/icons/arrow-clockwise.svg?react';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/lib/sentry';
import { getFormErrorMessage, navigateToFirstError } from '@/lib/form-errors';
import { useAppForm } from '@/lib/form';
import { FormView } from './-components/FormView';
import {
  CreateCruiseFormSchema,
  CruiseFormInputSchema,
  cruiseFormDefaultValues,
} from '@/routes/cruises/-schemas/form.schema';
import { useCreateCruise } from '@/api/generated/endpoints/cruises.gen';
import { useGetApplicationsForCruisePlanningSuspense } from '@/api/generated/endpoints/applications.gen';
import type { CruiseApplicationCandidate } from '@/routes/applications/$applicationId/-schemas/types/CruiseApplicationCandidate';
import type { CruiseApplicationSummary } from '@/api/generated/schemas';

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
    validators: { onDynamic: CruiseFormInputSchema },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('new-cruise', 'invalid', formApi.state);
      toast.error(getFormErrorMessage(formApi, CRUISE_FIELD_TO_SECTION));
      navigateToFirstError(formApi, CRUISE_FIELD_TO_SECTION);
    },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit('new-cruise', 'valid', formApi.state);
      await createCruiseMutation.mutateAsync(
        { data: CreateCruiseFormSchema.parse(value) },
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
        <FormView form={form} cruiseApplications={cruiseApplicationsQuery.data} isReadonly={false} buttons={buttons} />
      </AppLayout>
    </>
  );
}

function mapCruiseApplicationCandidate(application: CruiseApplicationSummary): CruiseApplicationCandidate {
  return {
    id: application.id ?? '',
    number: application.number ?? '',
    date: application.date ?? '',
    year: application.year ?? 0,
    cruiseManagerId: application.cruiseManagerId ?? '',
    cruiseManagerEmail: application.cruiseManagerEmail ?? '',
    cruiseManagerFirstName: application.cruiseManagerFirstName ?? '',
    cruiseManagerLastName: application.cruiseManagerLastName ?? '',
    deputyManagerId: application.deputyManagerId ?? '',
    deputyManagerEmail: application.deputyManagerEmail ?? '',
    deputyManagerFirstName: application.deputyManagerFirstName ?? '',
    deputyManagerLastName: application.deputyManagerLastName ?? '',
    hasFormA: application.hasFormA ?? false,
    hasFormB: application.hasFormB ?? false,
    hasFormC: application.hasFormC ?? false,
    points: application.points ?? 0,
    status: application.status ?? 'draft',
    effectsDoneRate: application.effectsDoneRate ?? '0',
    note: application.note ?? '',
    cruiseHours: application.cruiseHours ?? '',
    cruiseDays: application.cruiseDays ?? 0,
    acceptablePeriodBeg: application.acceptablePeriodBeg ?? '',
    acceptablePeriodEnd: application.acceptablePeriodEnd ?? '',
    optimalPeriodBeg: application.optimalPeriodBeg ?? '',
    optimalPeriodEnd: application.optimalPeriodEnd ?? '',
    precisePeriodStart: application.precisePeriodStart ?? '',
    precisePeriodEnd: application.precisePeriodEnd ?? '',
    startDate: application.startDate ?? '',
    endDate: application.endDate ?? '',
  };
}
