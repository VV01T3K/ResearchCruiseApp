import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { FormCActionsSection } from '@/components/applications/formC/FormCActionsSection';
import { FormCAdditionalDescriptionSection } from '@/components/applications/formC/FormCAdditionalDescriptionSection';
import { FormCAdditionalPermissionsSection } from '@/components/applications/formC/FormCAdditionalPermissionsSection';
import { FormCCollectedSamplesSection } from '@/components/applications/formC/FormCCollectedSamplesSection';
import { FormCContractsSection } from '@/components/applications/formC/FormCContractsSection';
import { FormCCruiseDayDetailsSection } from '@/components/applications/formC/FormCCruiseDayDetailsSection';
import { FormCCruiseDetailsSection } from '@/components/applications/formC/FormCCruiseDetailsSection';
import { FormCCruiseGoalSection } from '@/components/applications/formC/FormCCruiseGoalSection';
import { FormCCruiseInfoSection } from '@/components/applications/formC/FormCCruiseInfoSection';
import { FormCCruiseManagerInfoSection } from '@/components/applications/formC/FormCCruiseManagerInfoSection';
import { FormCMembersSection } from '@/components/applications/formC/FormCMembersSection';
import { FormCPrintTemplate } from '@/components/applications/formC/FormCPrintTemplate';
import { FormCPublicationsSection } from '@/components/applications/formC/FormCPublicationsSection';
import { FormCResearchAreaSection } from '@/components/applications/formC/FormCResearchAreaSection';
import { FormCResearchEquipmentsSection } from '@/components/applications/formC/FormCResearchEquipmentsSection';
import { FormCResearchTasksSection } from '@/components/applications/formC/FormCResearchTasksEffectsSection';
import { FormCShipEquipmentsSection } from '@/components/applications/formC/FormCShipEquipmentsSection';
import { FormCShipUsageSection } from '@/components/applications/formC/FormCShipUsageSection';
import { FormCSPUBReportDataSection } from '@/components/applications/formC/FormCSPUBReportDataSection';
import { FormCSPUBTasksSection } from '@/components/applications/formC/FormCSPUBTasksSection';
import { FormCContextType, FormCProvider } from '@/contexts/applications/FormCContext';

type Props = {
  context: FormCContextType & {
    onSubmit: () => void;
    onSaveDraft: () => void;
    actionsDisabled?: boolean;
  };
};
export function FormC({ context }: Props) {
  function onSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
    evt.preventDefault();
    context.onSubmit();
  }

  const componentRef = useRef(null);

  const reactToPrintContent = () => {
    return componentRef.current;
  };

  const handlePrint = useReactToPrint({});

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
        <FormCActionsSection
          onSaveDraft={context.onSaveDraft}
          onPrint={() => handlePrint(reactToPrintContent)}
          disabled={context.actionsDisabled}
        />
      </form>
      <FormCPrintTemplate ref={componentRef} />
    </FormCProvider>
  );
}
