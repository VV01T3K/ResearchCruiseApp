import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { revalidateLogic } from '@tanstack/react-form';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { useState } from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/lib/sentry';
import { getFormErrorMessage, navigateToFirstError } from '@/lib/form-errors';
import { FormView } from '@/routes/applications/$applicationId/-components/formA/FormView';
import {
  FORM_A_FIELD_TO_SECTION,
  type FormAValues,
  getFormADraftWriteSchema,
  getFormAWriteSchema,
} from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { useFormAQuery } from '@/routes/applications/$applicationId/-hooks/useApplicationFormQueries';
import {
  useGetApplicationFormAContextSuspense,
  useUpdateApplicationFormA,
} from '@/api/generated/endpoints/applications.gen';
import { mapFormAOptions } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { useGetCruiseBlockades } from '@/api/generated/endpoints/cruises.gen';
import { useUserContext } from '@/providers/useUserContext';
import { useAppForm } from '@/lib/form';
import { installServerFormErrors } from '@/lib/form-errors';

export const Route = createFileRoute('/applications/$applicationId/formA')({
  component: FormAPage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view'])),
  }),
});

function FormAPage() {
  const { applicationId } = Route.useParams();
  const mode = Route.useSearch().mode ?? 'view';

  const navigate = useNavigate();
  const userContext = useUserContext();
  const initialStateQuery = useGetApplicationFormAContextSuspense({
    query: { select: mapFormAOptions },
  });
  const saveMutation = useUpdateApplicationFormA();
  const formA = useFormAQuery(applicationId);

  const editMode = mode === 'edit';
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);

  const defaultValues = (formA.data ?? {
    id: undefined,
    cruiseManagerId: userContext.currentUser!.id,
    deputyManagerId: '',
    year: initialStateQuery.data.years[0],
    acceptablePeriod: ['0', '24'],
    optimalPeriod: ['0', '24'],
    precisePeriodStart: '',
    precisePeriodEnd: '',
    periodSelectionType: 'period',
    cruiseDays: 0,
    cruiseHours: 0,
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
  }) satisfies FormAValues;
  const [selectedYear, setSelectedYear] = useState(defaultValues.year);
  const blockadesQuery = useGetCruiseBlockades({ year: +selectedYear });
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic({ mode: 'blur', modeAfterSubmission: 'change' }),
    validators: {
      onDynamic: getFormAWriteSchema(initialStateQuery.data, blockadesQuery.data, applicationId),
    },
    listeners: {
      onChange: ({ fieldApi }) => {
        if (fieldApi.name === 'year') setSelectedYear(String(fieldApi.state.value));
      },
    },
    onSubmit: () => handleValidSubmit(),
    onSubmitInvalid: () => {
      trackFormSubmit('form-a', 'invalid', form.state);
      setIsSaveDraftModalOpen(false);
      toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
    },
  });

  const context = {
    form,
    initValues: initialStateQuery.data,
    isReadonly: !editMode,
    onSubmit: () => form.handleSubmit(),
    blockades: blockadesQuery.data,
    onSaveDraft: () => setIsSaveDraftModalOpen(true),
    actionsDisabled: saveMutation.isPending,
  };

  function isCurrentUserManagerOrDeputy(dto: FormAValues) {
    const userId = userContext.currentUser!.id;
    return dto.cruiseManagerId === userId || dto.deputyManagerId === userId;
  }

  function saveForm(draft: boolean, loadingMessage: string, successMessage: string) {
    if (!isCurrentUserManagerOrDeputy(form.state.values)) {
      setIsSaveDraftModalOpen(false);
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      return;
    }

    const loading = toast.loading(loadingMessage);
    saveMutation.mutate(
      {
        applicationId,
        data: draft
          ? getFormADraftWriteSchema(applicationId).parse(form.state.values)
          : getFormAWriteSchema(initialStateQuery.data, blockadesQuery.data, applicationId).parse(form.state.values),
      },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          toast.success(successMessage);
        },
        onError: (err) => {
          console.error(err);
          if (installServerFormErrors(form, err)) {
            toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
            navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
            return;
          }
          toast.error('Nie udało się zapisać formularza. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
          navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
        },
        onSettled: () => {
          setIsSaveDraftModalOpen(false);
          toast.dismiss(loading);
        },
      }
    );
  }

  async function handleValidSubmit() {
    trackFormSubmit('form-a', 'valid', form.state);

    saveForm(
      false,
      'Zapisywanie formularza...',
      'Formularz został zapisany i wysłany do potwierdzenia przez przełożonego'
    );
  }

  function handleSaveDraft() {
    saveForm(true, 'Zapisywanie wersji roboczej formularza...', 'Formularz został zapisany jako wersja robocza');
  }

  return (
    <>
      <AppLayout title="Formularz A">
        <form.AppForm>
          <FormView context={context} />
        </form.AppForm>
      </AppLayout>

      <AppModal
        title="Zapisz wersję roboczą Formularza A"
        isOpen={isSaveDraftModalOpen}
        onClose={() => setIsSaveDraftModalOpen(false)}
      >
        <div className="space-y-4">
          <form.AppField
            name="note"
            children={(field) => (
              <field.TextField
                label="Notatka aktualnej wersji roboczej"
                placeholder="Wpisz notatkę dot. aktualnej wersji roboczej"
                autoFocus
              />
            )}
          />

          <div className="flex justify-center gap-4">
            <AppButton className="gap-4" disabled={saveMutation.isPending} onClick={handleSaveDraft}>
              <FloppyFillIcon className="h-4 w-4" />
              Zapisz wersję roboczą
            </AppButton>
          </div>
        </div>
      </AppModal>
    </>
  );
}
