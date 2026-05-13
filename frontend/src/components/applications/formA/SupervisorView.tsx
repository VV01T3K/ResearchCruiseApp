import { AppLayout } from '@/components/shared/AppLayout';
import { AnyReactFormApi } from '@/lib/form';
import { ContractsSection } from '@/components/applications/formA/ContractsSection';
import { CruiseGoalSection } from '@/components/applications/formA/CruiseGoalSection';
import { CruiseLengthSection } from '@/components/applications/formA/CruiseLengthSection';
import { CruiseManagerInfoSection } from '@/components/applications/formA/CruiseManagerInfoSection';
import { SupervisorActionsSection } from '@/components/applications/formA/SupervisorActionsSection';
import { MembersSection } from '@/components/applications/formA/MembersSection';
import { PermissionsSection } from '@/components/applications/formA/PermissionsSection';
import { PublicationsSection } from '@/components/applications/formA/PublicationsSection';
import { ResearchAreaSection } from '@/components/applications/formA/ResearchAreaSection';
import { ResearchTasksSection } from '@/components/applications/formA/ResearchTasksSection';
import { SPUBTasksSection } from '@/components/applications/formA/SPUBTasksSection';
import { SupervisorInfoSection } from '@/components/applications/formA/SupervisorInfoSection';
import { FormAProvider } from '@/contexts/applications/FormAContext';
import { FormADto } from '@/api/dto/applications/FormADto';
import { FormAInitValuesDto } from '@/api/dto/applications/FormAInitValuesDto';

export function SupervisorView({
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
          <CruiseManagerInfoSection />
          <CruiseLengthSection />
          <PermissionsSection />
          <ResearchAreaSection />
          <CruiseGoalSection />
          <ResearchTasksSection />
          <ContractsSection />
          <MembersSection />
          <PublicationsSection />
          <SPUBTasksSection />
          <SupervisorInfoSection />
          <SupervisorActionsSection onAccept={handleAcceptForm} onDeny={handleDenyForm} />
        </FormAProvider>
      </div>
    </AppLayout>
  );
}
