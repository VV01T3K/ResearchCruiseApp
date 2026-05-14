import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ActionsSection } from './ActionsSection';
import { AdditionalDescriptionSection } from './AdditionalDescriptionSection';
import { AdditionalPermissionsSection } from './AdditionalPermissionsSection';
import { CollectedSamplesSection } from './CollectedSamplesSection';
import { ContractsSection } from './ContractsSection';
import { CruiseDayDetailsSection } from './CruiseDayDetailsSection';
import { CruiseDetailsSection } from './CruiseDetailsSection';
import { CruiseGoalSection } from './CruiseGoalSection';
import { CruiseInfoSection } from './CruiseInfoSection';
import { CruiseManagerInfoSection } from './CruiseManagerInfoSection';
import { MembersSection } from './MembersSection';
import { PrintTemplate } from './PrintTemplate';
import { PublicationsSection } from './PublicationsSection';
import { ResearchAreaSection } from './ResearchAreaSection';
import { ResearchEquipmentsSection } from './ResearchEquipmentsSection';
import { ResearchTasksEffectsSection } from './ResearchTasksEffectsSection';
import { ShipEquipmentsSection } from './ShipEquipmentsSection';
import { ShipUsageSection } from './ShipUsageSection';
import { SPUBReportDataSection } from './SPUBReportDataSection';
import { SPUBTasksSection } from './SPUBTasksSection';
import { FormCContextType, FormCProvider } from '@/contexts/applications/FormCContext';

type Props = {
  context: FormCContextType & {
    onSubmit: () => void;
    onSaveDraft: () => void;
    actionsDisabled?: boolean;
  };
};
export function FormView({ context }: Props) {
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
        <CruiseInfoSection />
        <CruiseManagerInfoSection />
        <ShipUsageSection />
        <AdditionalPermissionsSection />
        <ResearchAreaSection />
        <CruiseGoalSection />
        <ResearchTasksEffectsSection />
        <ContractsSection />
        <MembersSection />
        <PublicationsSection />
        <SPUBTasksSection />
        <CruiseDetailsSection />
        <CruiseDayDetailsSection />
        <ResearchEquipmentsSection />
        <ShipEquipmentsSection />
        <CollectedSamplesSection />
        <SPUBReportDataSection />
        <AdditionalDescriptionSection />
        <ActionsSection
          onSaveDraft={context.onSaveDraft}
          onPrint={() => handlePrint(reactToPrintContent)}
          disabled={context.actionsDisabled}
        />
      </form>
      <PrintTemplate ref={componentRef} />
    </FormCProvider>
  );
}
