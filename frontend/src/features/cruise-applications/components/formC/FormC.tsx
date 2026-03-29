import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { FormCActionsSection } from '@/features/cruise-applications/components/formC/FormCActionsSection';
import { FormCAdditionalDescriptionSection } from '@/features/cruise-applications/components/formC/FormCAdditionalDescriptionSection';
import { FormCAdditionalPermissionsSection } from '@/features/cruise-applications/components/formC/FormCAdditionalPermissionsSection';
import { FormCCollectedSamplesSection } from '@/features/cruise-applications/components/formC/FormCCollectedSamplesSection';
import { FormCContractsSection } from '@/features/cruise-applications/components/formC/FormCContractsSection';
import { FormCCruiseDayDetailsSection } from '@/features/cruise-applications/components/formC/FormCCruiseDayDetailsSection';
import { FormCCruiseDetailsSection } from '@/features/cruise-applications/components/formC/FormCCruiseDetailsSection';
import { FormCCruiseGoalSection } from '@/features/cruise-applications/components/formC/FormCCruiseGoalSection';
import { FormCCruiseInfoSection } from '@/features/cruise-applications/components/formC/FormCCruiseInfoSection';
import { FormCCruiseManagerInfoSection } from '@/features/cruise-applications/components/formC/FormCCruiseManagerInfoSection';
import { FormCMembersSection } from '@/features/cruise-applications/components/formC/FormCMembersSection';
import { FormCPrintTemplate } from '@/features/cruise-applications/components/formC/FormCPrintTemplate';
import { FormCPublicationsSection } from '@/features/cruise-applications/components/formC/FormCPublicationsSection';
import { FormCResearchAreaSection } from '@/features/cruise-applications/components/formC/FormCResearchAreaSection';
import { FormCResearchEquipmentsSection } from '@/features/cruise-applications/components/formC/FormCResearchEquipmentsSection';
import { FormCResearchTasksSection } from '@/features/cruise-applications/components/formC/FormCResearchTasksEffectsSection';
import { FormCShipEquipmentsSection } from '@/features/cruise-applications/components/formC/FormCShipEquipmentsSection';
import { FormCShipUsageSection } from '@/features/cruise-applications/components/formC/FormCShipUsageSection';
import { FormCSPUBReportDataSection } from '@/features/cruise-applications/components/formC/FormCSPUBReportDataSection';
import { FormCSPUBTasksSection } from '@/features/cruise-applications/components/formC/FormCSPUBTasksSection';
import { FormCContextType, FormCProvider } from '@/features/cruise-applications/contexts/FormCContext';

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
