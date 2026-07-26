import { AppLayout } from '@/components/shared/AppLayout';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
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
import { FormAOptions } from '@/api/client/applications/types/FormAOptions';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

type Props = {
  formInitValues: FormAOptions;
  handleAcceptForm: () => void;
  handleDenyForm: () => void;
};

export function SupervisorView({ formInitValues, handleAcceptForm, handleDenyForm }: Props) {
  useTypedAppFormContext({ defaultValues: formADefaultValues });
  const context = {
    initValues: formInitValues,
    isReadonly: true,
  };
  return (
    <AppLayout title="Formularz A">
      <div className="space-y-8">
        <CruiseManagerInfoSection context={context} />
        <CruiseLengthSection context={context} />
        <PermissionsSection context={context} />
        <ResearchAreaSection context={context} />
        <CruiseGoalSection context={context} />
        <ResearchTasksSection context={context} />
        <ContractsSection context={context} />
        <MembersSection context={context} />
        <PublicationsSection context={context} />
        <SPUBTasksSection context={context} />
        <SupervisorInfoSection context={context} />
        <SupervisorActionsSection onAccept={handleAcceptForm} onDeny={handleDenyForm} />
      </div>
    </AppLayout>
  );
}
