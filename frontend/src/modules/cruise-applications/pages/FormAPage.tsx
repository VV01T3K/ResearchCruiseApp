import { useForm, useStore } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppModal } from '@/core/components/AppModal';
import { AppInput } from '@/core/components/inputs/AppInput';
import {
  getErrors,
  getFormErrorMessage,
  mapNullsToEmptyStrings,
  navigateToFirstError,
  removeEmptyValues,
} from '@/core/lib/utils';
import { FormA } from '@/cruise-applications/components/formA/FormA';
import { FORM_A_FIELD_TO_SECTION, getFormAValidationSchema } from '@/cruise-applications/helpers/FormAValidationSchema';
import {
  useFormAInitValuesQuery,
  useFormAQuery,
  useUpdateFormAMutation,
} from '@/cruise-applications/hooks/FormAApiHooks';
import { CruisePeriodType, FormADto } from '@/cruise-applications/models/FormADto';
import { useBlockadesQuery } from '@/cruise-schedule/hooks/CruisesApiHooks';
import { useUserContext } from '@/user/hooks/UserContextHook';

export function FormAPage() {
  const routeApi = getRouteApi('/applications/$applicationId/formA');
  const { applicationId } = routeApi.useParams();
  const mode = routeApi.useSearch().mode ?? 'view';

  const navigate = useNavigate();
  const userContext = useUserContext();
  const initialStateQuery = useFormAInitValuesQuery();
  const saveMutation = useUpdateFormAMutation();
  const formA = useFormAQuery(applicationId);

  const [editMode] = useState(mode === 'edit');
  const [hasFormBeenSubmitted, setHasFormBeenSubmitted] = useState(false);
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);

  const normalizePeriod = (period: unknown): CruisePeriodType => {
    if (Array.isArray(period) && period.length === 0) return '';
    if (Array.isArray(period) && period.length === 2) return period as CruisePeriodType;
    return (period ?? '') as CruisePeriodType;
  };

  const form = useForm({
    defaultValues: (formA.data
      ? (() => {
          const normalizedAcceptable = normalizePeriod(formA.data.acceptablePeriod);
          const normalizedOptimal = normalizePeriod(formA.data.optimalPeriod);

          return {
            ...formA.data,
            deputyManagerId: formA.data.deputyManagerId ?? '', // API might return null values for drafts
            permissions: formA.data.permissions.map((p) => ({ ...p, scan: undefined })),
            acceptablePeriod: normalizedAcceptable,
            optimalPeriod: normalizedOptimal,
            precisePeriodStart: formA.data.precisePeriodStart ?? '',
            precisePeriodEnd: formA.data.precisePeriodEnd ?? '',
            periodSelectionType:
              formA.data.precisePeriodStart || formA.data.precisePeriodEnd ? ('precise' as const) : ('period' as const),
            contracts: mapNullsToEmptyStrings(formA.data.contracts), // Map each null field to empty string so validation works
            researchTasks: mapNullsToEmptyStrings(formA.data.researchTasks),
          };
        })()
      : {
          id: undefined,
          cruiseManagerId: userContext.currentUser!.id,
          deputyManagerId: '',
          year: initialStateQuery.data.years[0],
          acceptablePeriod: '',
          optimalPeriod: '',
          precisePeriodStart: '',
          precisePeriodEnd: '',
          periodSelectionType: 'period',
          cruiseHours: '0',
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
        }) as FormADto,
    validators: {
      onChange: getFormAValidationSchema(initialStateQuery.data),
    },
  });

  const year = useStore(form.store, (state) => state.values.year);
  const blockadesQuery = useBlockadesQuery(+year);

  // Update form validators when blockades change
  useEffect(() => {
    form.options.validators = {
      onChange: getFormAValidationSchema(initialStateQuery.data, blockadesQuery.data),
    };
  }, [blockadesQuery.data, initialStateQuery.data, form.options]);

  const context = {
    form,
    initValues: initialStateQuery.data,
    isReadonly: !editMode,
    hasFormBeenSubmitted,
    onSubmit: handleSubmitting,
    blockades: blockadesQuery.data,
    onSaveDraft: () => setIsSaveDraftModalOpen(true),
    actionsDisabled: saveMutation.isPending,
  };

  async function handleSubmitting() {
    setHasFormBeenSubmitted(true);

    await form.validate('change');
    if (!form.state.isValid) {
      setIsSaveDraftModalOpen(false);
      toast.error(getFormErrorMessage(form, FORM_A_FIELD_TO_SECTION));
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
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
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
      return;
    }

    const loading = toast.loading('Zapisywanie formularza...');
    saveMutation.mutate(
      { id: applicationId, form: dto, draft: false },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          toast.success('Formularz został zapisany i wysłany do potwierdzenia przez przełożonego');
        },
        onError: (err) => {
          console.error(err);
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
      toast.error('Jedynie kierownik lub jego zastępca mogą zapisać formularz');
      navigateToFirstError(form, FORM_A_FIELD_TO_SECTION);
      return;
    }

    const loading = toast.loading('Zapisywanie wersji roboczej formularza...');
    saveMutation.mutate(
      { id: applicationId, form: dto, draft: true },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          toast.success('Formularz został zapisany jako wersja robocza');
        },
        onError: (err) => {
          console.error(err);
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

  return (
    <>
      <AppLayout title="Formularz A">
        <FormA context={context} />
      </AppLayout>

      <AppModal
        title="Zapisz wersję roboczą Formularza A"
        isOpen={isSaveDraftModalOpen}
        onClose={() => setIsSaveDraftModalOpen(false)}
      >
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
              />
            )}
          />

          <div className="flex justify-center gap-4">
            <AppButton className="gap-4" disabled={saveMutation.isPending} onClick={handleSavingDraft}>
              <FloppyFillIcon className="h-4 w-4" />
              Zapisz wersję roboczą
            </AppButton>
          </div>
        </div>
      </AppModal>
    </>
  );
}
