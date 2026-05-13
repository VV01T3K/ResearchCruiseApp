import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { FormBActionsSection } from './FormBActionsSection';
import { FormBAdditionalPermissionsSection } from './FormBAdditionalPermissionsSection';
import { FormBContractsSection } from './FormBContractsSection';
import { FormBCruiseDayDetailsSection } from './FormBCruiseDayDetailsSection';
import { FormBCruiseDetailsSection } from './FormBCruiseDetailsSection';
import { FormBCruiseGoalSection } from './FormBCruiseGoalSection';
import { FormBCruiseInfoSection } from './FormBCruiseInfoSection';
import { FormBCruiseManagerInfoSection } from './FormBCruiseManagerInfoSection';
import { FormBMembersSection } from './FormBMembersSection';
import { FormBPrintTemplate } from './FormBPrintTemplate';
import { FormBPublicationsSection } from './FormBPublicationsSection';
import { FormBResearchAreaSection } from './FormBResearchAreaSection';
import { FormBResearchEquipmentsSection } from './FormBResearchEquipmentsSection';
import { FormBResearchTasksSection } from './FormBResearchTasksSection';
import { FormBShipEquipmentsSection } from './FormBShipEquipmentsSection';
import { FormBShipUsageSection } from './FormBShipUsageSection';
import { FormBSPUBTasksSection } from './FormBSPUBTasksSection';
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
