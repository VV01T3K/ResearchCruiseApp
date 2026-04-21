import { AppLayout } from '@/components/shared/AppLayout';
import { AnyReactFormApi } from '@/lib/form';
import { FormAContractsSection } from '@/components/applications/formA/FormAContractsSection';
import { FormACruiseGoalSection } from '@/components/applications/formA/FormACruiseGoalSection';
import { FormACruiseLengthSection } from '@/components/applications/formA/FormACruiseLengthSection';
import { FormACruiseManagerInfoSection } from '@/components/applications/formA/FormACruiseManagerInfoSection';
import { FormAForSupervisorActionsSection } from '@/components/applications/formA/FormAForSupervisorActionsSection';
import { FormAMembersSection } from '@/components/applications/formA/FormAMembersSection';
import { FormAPermissionsSection } from '@/components/applications/formA/FormAPermissionsSection';
import { FormAPublicationsSection } from '@/components/applications/formA/FormAPublicationsSection';
import { FormAResearchAreaSection } from '@/components/applications/formA/FormAResearchAreaSection';
import { FormAResearchTasksSection } from '@/components/applications/formA/FormAResearchTasksSection';
import { FormASPUBTasksSection } from '@/components/applications/formA/FormASPUBTasksSection';
import { FormASupervisorInfoSection } from '@/components/applications/formA/FormASupervisorInfoSection';
import { FormAProvider } from '@/contexts/applications/FormAContext';
import { FormADto } from '@/api/dto/applications/FormADto';
import { FormAInitValuesDto } from '@/api/dto/applications/FormAInitValuesDto';

export function FormAForSupervisor({
  form,
  formInitValues,
  handleAcceptForm,
  handleDenyForm,
}: {
  form: AnyReactFormApi<FormADto>;
  formInitValues: FormAInitValuesDto;
  handleAcceptForm: () => void;
  handleDenyForm: () => void;
}) {
  return (
    <AppLayout title="Formularz A">
      <div className="space-y-8">
        <FormAProvider value={{ form, initValues: formInitValues, isReadonly: true, hasFormBeenSubmitted: false }}>
          <FormACruiseManagerInfoSection />
          <FormACruiseLengthSection />
          <FormAPermissionsSection />
          <FormAResearchAreaSection />
          <FormACruiseGoalSection />
          <FormAResearchTasksSection />
          <FormAContractsSection />
          <FormAMembersSection />
          <FormAPublicationsSection />
          <FormASPUBTasksSection />
          <FormASupervisorInfoSection />
          <FormAForSupervisorActionsSection onAccept={handleAcceptForm} onDeny={handleDenyForm} />
        </FormAProvider>
      </div>
    </AppLayout>
  );
}
