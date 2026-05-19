import { AppLayout } from '@/components/shared/AppLayout';
import { AnyReactFormApi } from '@/lib/form';
import { ContractsSection } from '@/routes/_authed/applications/$applicationId/-components/formA/ContractsSection';
import { CruiseGoalSection } from '@/routes/_authed/applications/$applicationId/-components/formA/CruiseGoalSection';
import { CruiseLengthSection } from '@/routes/_authed/applications/$applicationId/-components/formA/CruiseLengthSection';
import { CruiseManagerInfoSection } from '@/routes/_authed/applications/$applicationId/-components/formA/CruiseManagerInfoSection';
import { SupervisorActionsSection } from '@/routes/_authed/applications/$applicationId/-components/formA/SupervisorActionsSection';
import { MembersSection } from '@/routes/_authed/applications/$applicationId/-components/formA/MembersSection';
import { PermissionsSection } from '@/routes/_authed/applications/$applicationId/-components/formA/PermissionsSection';
import { PublicationsSection } from '@/routes/_authed/applications/$applicationId/-components/formA/PublicationsSection';
import { ResearchAreaSection } from '@/routes/_authed/applications/$applicationId/-components/formA/ResearchAreaSection';
import { ResearchTasksSection } from '@/routes/_authed/applications/$applicationId/-components/formA/ResearchTasksSection';
import { SPUBTasksSection } from '@/routes/_authed/applications/$applicationId/-components/formA/SPUBTasksSection';
import { SupervisorInfoSection } from '@/routes/_authed/applications/$applicationId/-components/formA/SupervisorInfoSection';
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
