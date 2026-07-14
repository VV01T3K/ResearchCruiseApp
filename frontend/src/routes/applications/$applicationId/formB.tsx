import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/lib/sentry';
import { getFormErrorMessage, navigateToFirstError } from '@/lib/utils';
import { FormView } from './-components/formB/FormView';
import {
  FORM_B_FIELD_TO_SECTION,
  getFormBValidationSchema,
  getFormBWriteSchema,
} from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { useGetApplicationCruiseSuspense } from '@/api/generated/endpoints/applications.gen';
import { useFormAQuery, useFormBQuery } from '@/routes/applications/$applicationId/-hooks/useApplicationFormQueries';
import {
  useGetApplicationFormAContextSuspense,
  useGetApplicationFormBContextSuspense,
  useRefillApplicationFormB,
  useUpdateApplicationFormB,
} from '@/api/generated/endpoints/applications.gen';
import { FormBWriteRequest } from '@/api/generated/schemas';
import type { FormAInitValuesDto } from '@/routes/applications/$applicationId/-schemas/types/FormAInitValuesDto';
import type { FormBInitValuesDto } from '@/routes/applications/$applicationId/-schemas/types/FormBInitValuesDto';
import { ApiError } from '@/lib/custom-fetch';
import { CruiseDayDetailsDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/CruiseDayDetailsDto';
import { FormBDto } from '@/routes/applications/$applicationId/-schemas/types/FormBDto';

export const Route = createFileRoute('/applications/$applicationId/formB')({
  component: FormBPage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view', 'preview'])),
  }),
});

function FormBPage() {
  const { applicationId } = Route.useParams();
  const mode = Route.useSearch().mode ?? 'preview';

  const navigate = useNavigate();

  const formA = useFormAQuery(applicationId);
  const formB = useFormBQuery(applicationId);
  const formAInitValues = useGetApplicationFormAContextSuspense({
    query: { select: (context) => context as FormAInitValuesDto },
  });
  const formBInitValues = useGetApplicationFormBContextSuspense({
    query: { select: (context) => context as FormBInitValuesDto },
  });
  const cruise = useGetApplicationCruiseSuspense(applicationId);
  const updateMutation = useUpdateApplicationFormB();
  const revertToEditMutation = useRefillApplicationFormB();

  const form = useForm({
    defaultValues: (formB.data ?? {
      isCruiseManagerPresent: 'true',
      permissions: formA.data.permissions,
      ugTeams: formA.data.ugTeams,
      guestTeams: formA.data.guestTeams,
      crewMembers: [],
      shortResearchEquipments: [],
      longResearchEquipments: [],
      ports: [],
      cruiseDaysDetails: [],
      researchEquipments: [],
      shipEquipmentsIds: [],
    }) as FormBDto,
    validators: {
      onChange: getFormBValidationSchema(),
    },
  });
  const [hasFormBeenSubmitted, setHasFormBeenSubmitted] = useState(false);
  const context = {
    form,
    formA: formA.data,
    formAInitValues: formAInitValues.data,
    formBInitValues: formBInitValues.data,
    cruise: cruise.data,
    isReadonly: mode !== 'edit',
    hasFormBeenSubmitted,
    onSubmit: handleSubmit,
    onSaveDraft: handleDraftSave,
    onRevertToEdit: mode === 'preview' ? handleRevertToEdit : undefined,
    actionsDisabled: updateMutation.isPending || revertToEditMutation.isPending,
  };

  async function handleSubmit() {
    setHasFormBeenSubmitted(true);

    await form.validate('change');

    if (!form.state.isValid) {
      trackFormSubmit('form-b', 'invalid', form.state);
      toast.error(getFormErrorMessage(form, FORM_B_FIELD_TO_SECTION));
      navigateToFirstError(form, FORM_B_FIELD_TO_SECTION);
      return;
    }

    trackFormSubmit('form-b', 'valid', form.state);

    const loading = toast.loading('Zapisywanie formularza...');
    await updateMutation.mutateAsync(
      {
        applicationId,
        data: getFormBWriteSchema(false).parse(form.state.values),
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          toast.success('Formularz został wysłany pomyślnie.');
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 403) {
            toast.error(
              'Aplikacja nie znajduje się w odpowiednim stanie, aby przesłać formularz. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.'
            );
            navigate({ to: '/applications' });
            return;
          }

          console.error(err);
          toast.error(
            'Nie udało się wysłać formularza. Sprawdź czy wszystkie pola są wypełnione poprawnie i spróbuj ponownie.'
          );
          navigateToFirstError(form, FORM_B_FIELD_TO_SECTION);
        },
        onSettled: () => {
          toast.dismiss(loading);
        },
      }
    );
  }

  async function handleDraftSave() {
    const cruiseDaysDetails = form.state.values.cruiseDaysDetails;
    const commentError = cruiseDaysDetails
      ?.map((day) => CruiseDayDetailsDtoValidationSchema.shape.comment.safeParse(day.comment))
      .find((result) => !result.success);

    if (commentError && !commentError.success) {
      setHasFormBeenSubmitted(true);
      await form.validate('change');
      toast.error(`Formularz błędny w sekcji nr 13:\n${commentError.error.issues[0].message}`);
      navigateToFirstError(form, { cruiseDaysDetails: 13 });
      return;
    }

    const loading = toast.loading('Zapisywanie wersji roboczej formularza...');
    await updateMutation.mutateAsync(
      {
        applicationId,
        data: FormBWriteRequest.parse({ form: form.state.values, draft: true }),
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          toast.success('Wersja robocza formularza została zapisana.');
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 403) {
            toast.error(
              'Aplikacja nie znajduje się w odpowiednim stanie, aby zapisać wersję roboczą formularza. Spróbuj cofnąć się do listy aplikacji i ponownie wybrać aplikację.'
            );
            navigate({ to: '/applications' });
            return;
          }

          console.error(err);
          toast.error('Nie udało się zapisać wersji roboczej formularza. Spróbuj ponownie.');
          navigateToFirstError(form, FORM_B_FIELD_TO_SECTION);
        },
        onSettled: () => {
          toast.dismiss(loading);
        },
      }
    );
  }

  async function handleRevertToEdit() {
    const loading = toast.loading('Cofanie formularza do edycji...');
    await revertToEditMutation.mutateAsync(
      { applicationId },
      {
        onSuccess: async () => {
          await navigate({ to: `/applications/${applicationId}/formB?mode=edit` });
        },
        onSettled: () => {
          toast.dismiss(loading);
        },
      }
    );
  }

  return (
    <>
      <AppLayout title="Formularz B">
        <FormView context={context} />
      </AppLayout>
    </>
  );
}
