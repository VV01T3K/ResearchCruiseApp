import { AppLayout } from '@/components/shared/AppLayout';
import { withForm } from '@/lib/form';
import { ContractsSection } from '@/routes/applications/$applicationId/-components/formA/ContractsSection';
import { CruiseGoalSection } from '@/routes/applications/$applicationId/-components/formA/CruiseGoalSection';
import { CruiseLengthSection } from '@/routes/applications/$applicationId/-components/formA/CruiseLengthSection';
import { CruiseManagerInfoSection } from '@/routes/applications/$applicationId/-components/formA/CruiseManagerInfoSection';
import { SupervisorActionsSection } from '@/routes/applications/$applicationId/-components/formA/SupervisorActionsSection';
import { MembersSection } from '@/routes/applications/$applicationId/-components/formA/MembersSection';
import { PermissionsSection } from '@/routes/applications/$applicationId/-components/formA/PermissionsSection';
import { PublicationsSection } from '@/routes/applications/$applicationId/-components/formA/PublicationsSection';
import { ResearchAreaSection } from '@/routes/applications/$applicationId/-components/formA/ResearchAreaSection';
import { ResearchTasksSection } from '@/routes/applications/$applicationId/-components/formA/ResearchTasksSection';
import { SPUBTasksSection } from '@/routes/applications/$applicationId/-components/formA/SPUBTasksSection';
import { SupervisorInfoSection } from '@/routes/applications/$applicationId/-components/formA/SupervisorInfoSection';
import { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

type Props = {
  formInitValues: FormAOptions;
  handleAcceptForm: () => void;
  handleDenyForm: () => void;
};

export const SupervisorView = withForm({
  defaultValues: formADefaultValues,
  props: {} as Props,
  render: function SupervisorView({ form, formInitValues, handleAcceptForm, handleDenyForm }) {
    const context = {
      initValues: formInitValues,
      isReadonly: true,
      submissionAttempts: 0,
    };
    return (
      <AppLayout title="Formularz A">
        <form.AppForm>
          <div className="space-y-8">
            <CruiseManagerInfoSection form={form} context={context} />
            <CruiseLengthSection form={form} context={context} />
            <PermissionsSection form={form} context={context} />
            <ResearchAreaSection form={form} context={context} />
            <CruiseGoalSection form={form} context={context} />
            <ResearchTasksSection form={form} context={context} />
            <ContractsSection form={form} context={context} />
            <MembersSection form={form} context={context} />
            <PublicationsSection form={form} context={context} />
            <SPUBTasksSection form={form} context={context} />
            <SupervisorInfoSection form={form} context={context} />
            <SupervisorActionsSection onAccept={handleAcceptForm} onDeny={handleDenyForm} />
          </div>
        </form.AppForm>
      </AppLayout>
    );
  },
});
