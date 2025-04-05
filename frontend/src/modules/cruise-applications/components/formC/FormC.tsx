import { FormCActionsSection } from '@/cruise-applications/components/formC/FormCActionsSection';
import { FormCAdditionalDescriptionSection } from '@/cruise-applications/components/formC/FormCAdditionalDescriptionSection';
import { FormCAdditionalPermissionsSection } from '@/cruise-applications/components/formC/FormCAdditionalPermissionsSection';
import { FormCCollectedSamplesSection } from '@/cruise-applications/components/formC/FormCCollectedSamplesSection';
import { FormCContractsSection } from '@/cruise-applications/components/formC/FormCContractsSection';
import { FormCCruiseDayDetailsSection } from '@/cruise-applications/components/formC/FormCCruiseDayDetailsSection';
import { FormCCruiseDetailsSection } from '@/cruise-applications/components/formC/FormCCruiseDetailsSection';
import { FormCCruiseGoalSection } from '@/cruise-applications/components/formC/FormCCruiseGoalSection';
import { FormCCruiseInfoSection } from '@/cruise-applications/components/formC/FormCCruiseInfoSection';
import { FormCCruiseManagerInfoSection } from '@/cruise-applications/components/formC/FormCCruiseManagerInfoSection';
import { FormCMembersSection } from '@/cruise-applications/components/formC/FormCMembersSection';
import { FormCPublicationsSection } from '@/cruise-applications/components/formC/FormCPublicationsSection';
import { FormCResearchAreaSection } from '@/cruise-applications/components/formC/FormCResearchAreaSection';
import { FormCResearchEquipmentsSection } from '@/cruise-applications/components/formC/FormCResearchEquipmentsSection';
import { FormCResearchTasksSection } from '@/cruise-applications/components/formC/FormCResearchTasksEffectsSection';
import { FormCShipEquipmentsSection } from '@/cruise-applications/components/formC/FormCShipEquipmentsSection';
import { FormCShipUsageSection } from '@/cruise-applications/components/formC/FormCShipUsageSection';
import { FormCSPUBReportDataSection } from '@/cruise-applications/components/formC/FormCSPUBReportDataSection';
import { FormCSPUBTasksSection } from '@/cruise-applications/components/formC/FormCSPUBTasksSection';
import { FormCContextType, FormCProvider } from '@/cruise-applications/contexts/FormCContext';

type Props = {
  context: FormCContextType & {
    onSubmit: () => void;
    onSaveDraft: () => void;
  };
};
export function FormC({ context }: Props) {
  function onSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    context.onSubmit();
  }

  return (
    <FormCProvider value={context}>
      <form className="space-y-8" onSubmit={onSubmit}>
        <FormCCruiseInfoSection />
        <FormCCruiseManagerInfoSection />
        <FormCShipUsageSection />
        <FormCAdditionalPermissionsSection />
        <FormCResearchAreaSection />
        <FormCCruiseGoalSection />
        <FormCResearchTasksSection />
        <FormCContractsSection />
        <FormCMembersSection />
        <FormCPublicationsSection />
        <FormCSPUBTasksSection />
        <FormCCruiseDetailsSection />
        <FormCCruiseDayDetailsSection />
        <FormCResearchEquipmentsSection />
        <FormCShipEquipmentsSection />
        <FormCCollectedSamplesSection />
        <FormCSPUBReportDataSection />
        <FormCAdditionalDescriptionSection />
        <FormCActionsSection onSaveDraft={context.onSaveDraft} />
      </form>
    </FormCProvider>
  );
}
