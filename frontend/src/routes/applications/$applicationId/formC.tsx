import { submitApplicationForm } from '@/integrations/tanstack/form/submitApplicationForm';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/integrations/auth/types';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { Layout } from '@/components/shared/Layout';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError, saveFailedMessage } from '@/integrations/tanstack/form/errors';
import { FormView } from './-components/formC/FormView';
import {
  type FormCValues,
  formCDefaultValues,
  getFormCSubmissionSchema,
} from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { useGetApplicationCruiseSuspense } from '@/api/generated/endpoints/applications.gen';
import {
  useFormAQuery,
  useFormBQuery,
  useFormCQuery,
} from '@/routes/applications/$applicationId/-hooks/useApplicationFormQueries';
import {
  useGetApplicationFormAContextSuspense,
  useGetApplicationFormBContextSuspense,
  useUpdateApplicationFormC,
} from '@/api/generated/endpoints/applications.gen';
import { ApiError, getErrorMessage } from '@/api/errors';
import { ResearchTaskEffectValues } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskEffectValues';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { type SavingValues, UnsavedChangesGuard } from '@/integrations/tanstack/router/UnsavedChangesGuard';
import { useLeaveAfterSave } from '@/integrations/tanstack/router/useLeaveAfterSave';
import { setServerFormErrors } from '@/integrations/tanstack/form/errors';

export const Route = createFileRoute('/applications/$applicationId/formC')({
  component: FormCPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.ShipCrew),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view'])),
  }),
});

function FormCPage() {
  const { applicationId } = Route.useParams();
  const mode = Route.useSearch().mode ?? 'preview';

  const formA = useFormAQuery(applicationId);
  const formB = useFormBQuery(applicationId);
  const formC = useFormCQuery(applicationId);
  const formAInitValues = useGetApplicationFormAContextSuspense({ applicationId });
  const formBInitValues = useGetApplicationFormBContextSuspense();
  const cruise = useGetApplicationCruiseSuspense(applicationId);
  const saving = useRef<SavingValues>(undefined);
  const updateMutation = useUpdateApplicationFormC({
    mutation: { meta: { handlesError: true, onAccepted: () => saving.current && (saving.current.accepted = true) } },
  });
  const [saved, setSaved] = useState<{ data: typeof formC.data; values: FormCValues }>();

  if (!formB.data) throw notFound();

  const storedValues = (formC.data ?? {
    ...formCDefaultValues,
    revision: formB.data.revision,
    shipUsage: formA.data.shipUsage ?? '',
    differentUsage: formA.data.differentUsage,
    permissions: formB.data.permissions,
    researchAreaDescriptions: formA.data.researchAreaDescriptions,
    ugTeams: formB.data.ugTeams,
    guestTeams: formB.data.guestTeams,
    researchTasksEffects: formA.data.researchTasks.map(
      (task) =>
        ({
          ...task,
          done: false,
          managerConditionMet: false,
          deputyConditionMet: false,
        }) satisfies ResearchTaskEffectValues
    ),
    contracts: formA.data.contracts,
    spubTasks: formA.data.spubTasks,
    shortResearchEquipments: formB.data.shortResearchEquipments,
    longResearchEquipments: formB.data.longResearchEquipments,
    ports: formB.data.ports,
    cruiseDaysDetails: formB.data.cruiseDaysDetails,
    researchEquipments: formB.data.researchEquipments,
    shipEquipmentsIds: formB.data.shipEquipmentsIds,
  }) satisfies FormCValues;
  const defaultValues = saved?.data === formC.data ? saved.values : storedValues;
  const schema = getFormCSubmissionSchema(formAInitValues.data);
  const form = useAppForm({
    canSubmitWhenInvalid: true,
    defaultValues,
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: schema,
    },
    onSubmit: async ({ value }) => handleValidSubmit(value),
    onSubmitInvalid: () => {
      if (!form.state.values.draft) trackFormSubmit('form-c', 'invalid', form.state);
      navigateToFirstError({ toast: true });
    },
  });
  const leaveAfterSave = useLeaveAfterSave(form);

  useEffect(() => {
    if (mode !== 'edit') form.reset();
  }, [mode, form]);

  const context = {
    form,
    formA: formA.data,
    formB: formB.data,
    formAInitValues: formAInitValues.data,
    formBInitValues: formBInitValues.data,
    cruise: cruise.data,
    isReadonly: mode !== 'edit',
    onSaveDraft: handleDraftSave,
    actionsDisabled: updateMutation.isPending,
  };

  async function handleValidSubmit(values: FormCValues) {
    if (!values.draft) trackFormSubmit('form-c', 'valid', form.state);

    const loading = toast.loading(
      values.draft ? 'Zapisywanie wersji roboczej formularza...' : 'Zapisywanie formularza...'
    );
    saving.current = { values };
    try {
      const { revision } = await updateMutation.mutateAsync({
        applicationId,
        data: { form: schema.parse(values), draft: values.draft ?? false },
      });
      form.setFieldValue('revision', revision, { dontUpdateMeta: true, dontValidate: true });
      setSaved({ data: formC.data, values: { ...values, revision } });
      toast.success(
        values.draft ? 'Formularz został zapisany jako wersja robocza' : 'Formularz został wysłany pomyślnie.'
      );
      await leaveAfterSave({ ...values, revision }, { to: '/applications' }).catch(console.error);
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError && err.status === 409) void formC.refetch();
      setServerFormErrors(form, err);
      toast.error(getErrorMessage(err, saveFailedMessage(values.draft)));
      navigateToFirstError();
      throw err;
    } finally {
      saving.current = undefined;
      toast.dismiss(loading);
    }
  }

  function handleDraftSave() {
    void submitApplicationForm(form, true);
  }

  return (
    <>
      <Layout title="Formularz C">
        <form.AppForm>
          <FormView context={context} />
        </form.AppForm>
      </Layout>
      <UnsavedChangesGuard
        form={form}
        disabled={mode !== 'edit'}
        recoveryKey={`${applicationId}/formC`}
        saving={saving}
      />
    </>
  );
}
