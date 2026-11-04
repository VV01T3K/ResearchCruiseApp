import { Layout } from '@/components/shared/Layout';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { ContractsSection } from '@/features/applications/components/formA/ContractsSection';
import { CruiseGoalSection } from '@/features/applications/components/formA/CruiseGoalSection';
import { CruiseLengthSection } from '@/features/applications/components/formA/CruiseLengthSection';
import { CruiseManagerInfoSection } from '@/features/applications/components/formA/CruiseManagerInfoSection';
import { SupervisorActionsSection } from '@/features/applications/components/formA/SupervisorActionsSection';
import { MembersSection } from '@/features/applications/components/formA/MembersSection';
import { PermissionsSection } from '@/features/applications/components/formA/PermissionsSection';
import { PublicationsSection } from '@/features/applications/components/formA/PublicationsSection';
import { ResearchAreaSection } from '@/features/applications/components/formA/ResearchAreaSection';
import { ResearchTasksSection } from '@/features/applications/components/formA/ResearchTasksSection';
import { SPUBTasksSection } from '@/features/applications/components/formA/SPUBTasksSection';
import { SupervisorInfoSection } from '@/features/applications/components/formA/SupervisorInfoSection';
import { FormAOptions } from '@/api/generated/schemas';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';

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
    <Layout title="Formularz A">
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
    </Layout>
  );
}
