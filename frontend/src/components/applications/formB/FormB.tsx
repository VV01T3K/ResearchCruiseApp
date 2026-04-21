import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { FormBActionsSection } from '@/components/applications/formB/FormBActionsSection';
import { FormBAdditionalPermissionsSection } from '@/components/applications/formB/FormBAdditionalPermissionsSection';
import { FormBContractsSection } from '@/components/applications/formB/FormBContractsSection';
import { FormBCruiseDayDetailsSection } from '@/components/applications/formB/FormBCruiseDayDetailsSection';
import { FormBCruiseDetailsSection } from '@/components/applications/formB/FormBCruiseDetailsSection';
import { FormBCruiseGoalSection } from '@/components/applications/formB/FormBCruiseGoalSection';
import { FormBCruiseInfoSection } from '@/components/applications/formB/FormBCruiseInfoSection';
import { FormBCruiseManagerInfoSection } from '@/components/applications/formB/FormBCruiseManagerInfoSection';
import { FormBMembersSection } from '@/components/applications/formB/FormBMembersSection';
import { FormBPrintTemplate } from '@/components/applications/formB/FormBPrintTemplate';
import { FormBPublicationsSection } from '@/components/applications/formB/FormBPublicationsSection';
import { FormBResearchAreaSection } from '@/components/applications/formB/FormBResearchAreaSection';
import { FormBResearchEquipmentsSection } from '@/components/applications/formB/FormBResearchEquipmentsSection';
import { FormBResearchTasksSection } from '@/components/applications/formB/FormBResearchTasksSection';
import { FormBShipEquipmentsSection } from '@/components/applications/formB/FormBShipEquipmentsSection';
import { FormBShipUsageSection } from '@/components/applications/formB/FormBShipUsageSection';
import { FormBSPUBTasksSection } from '@/components/applications/formB/FormBSPUBTasksSection';
import { FormBContextType, FormBProvider } from '@/contexts/applications/FormBContext';

type Props = {
  context: FormBContextType & {
    onSubmit: () => void;
    onSaveDraft: () => void;
    onRevertToEdit?: () => void;
    actionsDisabled?: boolean;
  };
};
export function FormB({ context }: Props) {
  const componentRef = useRef(null);

  const reactToPrintContent = () => {
    return componentRef.current;
  };

  const handlePrint = useReactToPrint({});

  function onSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
    evt.preventDefault();
    context.onSubmit();
  }

  return (
    <>
      <FormBProvider value={context}>
        <form className="space-y-8" onSubmit={onSubmit}>
          <FormBCruiseInfoSection />
          <FormBCruiseManagerInfoSection />
          <FormBShipUsageSection />
          <FormBAdditionalPermissionsSection />
          <FormBResearchAreaSection />
          <FormBCruiseGoalSection />
          <FormBResearchTasksSection />
          <FormBContractsSection />
          <FormBMembersSection />
          <FormBPublicationsSection />
          <FormBSPUBTasksSection />
          <FormBCruiseDetailsSection />
          <FormBCruiseDayDetailsSection />
          <FormBResearchEquipmentsSection />
          <FormBShipEquipmentsSection />
          <FormBActionsSection
            onSaveDraft={context.onSaveDraft}
            onRevertToEdit={context.onRevertToEdit}
            onPrint={() => handlePrint(reactToPrintContent)}
            disabled={context.actionsDisabled}
          />
        </form>
        <FormBPrintTemplate ref={componentRef} />
      </FormBProvider>
    </>
  );
}
