import { AppLayout } from '@/components/AppLayout';
import { AnyReactFormApi } from '@/lib/form';
import { FormAContractsSection } from '@/features/cruise-applications/components/formA/FormAContractsSection';
import { FormACruiseGoalSection } from '@/features/cruise-applications/components/formA/FormACruiseGoalSection';
import { FormACruiseLengthSection } from '@/features/cruise-applications/components/formA/FormACruiseLengthSection';
import { FormACruiseManagerInfoSection } from '@/features/cruise-applications/components/formA/FormACruiseManagerInfoSection';
import { FormAForSupervisorActionsSection } from '@/features/cruise-applications/components/formA/FormAForSupervisorActionsSection';
import { FormAMembersSection } from '@/features/cruise-applications/components/formA/FormAMembersSection';
import { FormAPermissionsSection } from '@/features/cruise-applications/components/formA/FormAPermissionsSection';
import { FormAPublicationsSection } from '@/features/cruise-applications/components/formA/FormAPublicationsSection';
import { FormAResearchAreaSection } from '@/features/cruise-applications/components/formA/FormAResearchAreaSection';
import { FormAResearchTasksSection } from '@/features/cruise-applications/components/formA/FormAResearchTasksSection';
import { FormASPUBTasksSection } from '@/features/cruise-applications/components/formA/FormASPUBTasksSection';
import { FormASupervisorInfoSection } from '@/features/cruise-applications/components/formA/FormASupervisorInfoSection';
import { FormAProvider } from '@/features/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/features/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/features/cruise-applications/models/FormAInitValuesDto';

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
