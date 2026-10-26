import { getErrorMessage } from '@/api/errors';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/integrations/auth/types';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { ArrowClockwiseIcon, FloppyDiskIcon } from '@phosphor-icons/react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { UnsavedChangesGuard } from '@/integrations/tanstack/router/UnsavedChangesGuard';
import { useLeaveAfterSave } from '@/integrations/tanstack/router/useLeaveAfterSave';
import { FormView } from './-components/FormView';
import { CruiseFormSchema, cruiseFormDefaultValues } from '@/routes/cruises/-schemas/form.schema';
import { useCreateCruise } from '@/api/generated/endpoints/cruises.gen';
import { useGetApplicationsForCruisePlanningSuspense } from '@/api/generated/endpoints/applications.gen';

const searchSchema = z.object({
  blockade: z.boolean().optional(),
});

export const Route = createFileRoute('/cruises/new')({
  component: NewCruisePage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner),
  validateSearch: searchSchema,
});

function NewCruisePage() {
  const cruiseApplicationsQuery = useGetApplicationsForCruisePlanningSuspense();
  const createCruiseMutation = useCreateCruise({ mutation: { meta: { handlesError: true } } });
  const search = Route.useSearch();

  const form = useAppForm({
    defaultValues: {
      ...cruiseFormDefaultValues,
      shipUnavailable: search.blockade ?? false,
    },
    validationLogic: formValidationLogic,
    validators: { onDynamic: CruiseFormSchema },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit('new-cruise', 'invalid', formApi.state);
      navigateToFirstError({ toast: true });
    },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit('new-cruise', 'valid', formApi.state);
      try {
        await createCruiseMutation.mutateAsync({ data: CruiseFormSchema.parse(value) });
        toast.success('Rejs został utworzony pomyślnie.');
        await leaveAfterSave(value, { to: '/cruises' });
      } catch (error) {
        console.error(error);
        setServerFormErrors(form, error);
        toast.error(getErrorMessage(error, 'Nie udało się utworzyć rejsu'));
        navigateToFirstError();
      }
    },
  });
  const leaveAfterSave = useLeaveAfterSave(form);

  const buttons = (
    <>
      <AppButton className="w-36 !justify-center gap-4 lg:w-64" variant="primaryOutline" onClick={() => form.reset()}>
        <ArrowClockwiseIcon className="h-4 w-4" />
        Wyczyść formularz
      </AppButton>
      <AppButton className="w-36 !justify-center gap-4 lg:w-64" type="submit">
        <FloppyDiskIcon weight="fill" className="h-4 w-4" />
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
      <UnsavedChangesGuard form={form} />
    </>
  );
}
