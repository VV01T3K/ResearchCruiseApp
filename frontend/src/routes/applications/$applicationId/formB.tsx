import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { useForm } from '@tanstack/react-form';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { AppLayout } from '@/components/shared/AppLayout';
import { toast } from '@/components/shared/layout/toast';
import { getFormErrorMessage, navigateToFirstError } from '@/lib/utils';
import { FormView } from './-components/formB/FormView';
import {
  FORM_B_FIELD_TO_SECTION,
  getFormBValidationSchema,
} from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { useApplicationCruiseQuery } from '@/api-v2/applications/ApplicationCatalogApiHooks';
import {
  useFormAInitValuesQuery,
  useFormAQuery,
  useFormBInitValuesQuery,
  useFormBQuery,
  useRevertFormBToEditMutation,
  useUpdateFormBMutation,
} from '@/api-v2/applications/ApplicationFormsApiHooks';
import { CruiseDayDetailsDtoValidationSchema } from '@/api/dto/applications/CruiseDayDetailsDto';
import { FormBDto } from '@/api/dto/applications/FormBDto';

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
  const formAInitValues = useFormAInitValuesQuery();
  const formBInitValues = useFormBInitValuesQuery();
  const cruise = useApplicationCruiseQuery(applicationId);
  const updateMutation = useUpdateFormBMutation();
  const revertToEditMutation = useRevertFormBToEditMutation();

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
      toast.error(getFormErrorMessage(form, FORM_B_FIELD_TO_SECTION));
      navigateToFirstError(form, FORM_B_FIELD_TO_SECTION);
      return;
    }

    const loading = toast.loading('Zapisywanie formularza...');
    await updateMutation.mutateAsync(
      {
        id: applicationId,
        form: form.state.values,
        draft: false,
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          toast.success('Formularz został wysłany pomyślnie.');
        },
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 403) {
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
        id: applicationId,
        form: form.state.values,
        draft: true,
      },
      {
        onSuccess: () => {
          navigate({ to: '/applications' });
          toast.success('Wersja robocza formularza została zapisana.');
        },
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 403) {
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
      { id: applicationId },
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
