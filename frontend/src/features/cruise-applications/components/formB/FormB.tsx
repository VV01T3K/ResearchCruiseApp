import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { FormBActionsSection } from '@/features/cruise-applications/components/formB/FormBActionsSection';
import { FormBAdditionalPermissionsSection } from '@/features/cruise-applications/components/formB/FormBAdditionalPermissionsSection';
import { FormBContractsSection } from '@/features/cruise-applications/components/formB/FormBContractsSection';
import { FormBCruiseDayDetailsSection } from '@/features/cruise-applications/components/formB/FormBCruiseDayDetailsSection';
import { FormBCruiseDetailsSection } from '@/features/cruise-applications/components/formB/FormBCruiseDetailsSection';
import { FormBCruiseGoalSection } from '@/features/cruise-applications/components/formB/FormBCruiseGoalSection';
import { FormBCruiseInfoSection } from '@/features/cruise-applications/components/formB/FormBCruiseInfoSection';
import { FormBCruiseManagerInfoSection } from '@/features/cruise-applications/components/formB/FormBCruiseManagerInfoSection';
import { FormBMembersSection } from '@/features/cruise-applications/components/formB/FormBMembersSection';
import { FormBPrintTemplate } from '@/features/cruise-applications/components/formB/FormBPrintTemplate';
import { FormBPublicationsSection } from '@/features/cruise-applications/components/formB/FormBPublicationsSection';
import { FormBResearchAreaSection } from '@/features/cruise-applications/components/formB/FormBResearchAreaSection';
import { FormBResearchEquipmentsSection } from '@/features/cruise-applications/components/formB/FormBResearchEquipmentsSection';
import { FormBResearchTasksSection } from '@/features/cruise-applications/components/formB/FormBResearchTasksSection';
import { FormBShipEquipmentsSection } from '@/features/cruise-applications/components/formB/FormBShipEquipmentsSection';
import { FormBShipUsageSection } from '@/features/cruise-applications/components/formB/FormBShipUsageSection';
import { FormBSPUBTasksSection } from '@/features/cruise-applications/components/formB/FormBSPUBTasksSection';
import { FormBContextType, FormBProvider } from '@/features/cruise-applications/contexts/FormBContext';

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
