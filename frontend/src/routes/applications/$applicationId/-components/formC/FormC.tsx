import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { FormCActionsSection } from './FormCActionsSection';
import { FormCAdditionalDescriptionSection } from './FormCAdditionalDescriptionSection';
import { FormCAdditionalPermissionsSection } from './FormCAdditionalPermissionsSection';
import { FormCCollectedSamplesSection } from './FormCCollectedSamplesSection';
import { FormCContractsSection } from './FormCContractsSection';
import { FormCCruiseDayDetailsSection } from './FormCCruiseDayDetailsSection';
import { FormCCruiseDetailsSection } from './FormCCruiseDetailsSection';
import { FormCCruiseGoalSection } from './FormCCruiseGoalSection';
import { FormCCruiseInfoSection } from './FormCCruiseInfoSection';
import { FormCCruiseManagerInfoSection } from './FormCCruiseManagerInfoSection';
import { FormCMembersSection } from './FormCMembersSection';
import { FormCPrintTemplate } from './FormCPrintTemplate';
import { FormCPublicationsSection } from './FormCPublicationsSection';
import { FormCResearchAreaSection } from './FormCResearchAreaSection';
import { FormCResearchEquipmentsSection } from './FormCResearchEquipmentsSection';
import { FormCResearchTasksSection } from './FormCResearchTasksEffectsSection';
import { FormCShipEquipmentsSection } from './FormCShipEquipmentsSection';
import { FormCShipUsageSection } from './FormCShipUsageSection';
import { FormCSPUBReportDataSection } from './FormCSPUBReportDataSection';
import { FormCSPUBTasksSection } from './FormCSPUBTasksSection';
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
