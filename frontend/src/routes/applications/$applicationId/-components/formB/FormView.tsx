import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ActionsSection } from './ActionsSection';
import { AdditionalPermissionsSection } from './AdditionalPermissionsSection';
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
import { ResearchTasksSection } from './ResearchTasksSection';
import { ShipEquipmentsSection } from './ShipEquipmentsSection';
import { ShipUsageSection } from './ShipUsageSection';
import { SPUBTasksSection } from './SPUBTasksSection';
import { useFormBContext, type FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';

type Props = {
  context: FormBViewModel & {
    onSaveDraft: () => void;
    onRevertToEdit?: () => void;
    actionsDisabled?: boolean;
  };
};
export function FormView({ context }: Props) {
  const form = useFormBContext();
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({ contentRef: componentRef });

  return (
    <>
      <form
        className="space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <CruiseInfoSection context={context} />
        <CruiseManagerInfoSection context={context} />
        <ShipUsageSection context={context} />
        <AdditionalPermissionsSection context={context} />
        <ResearchAreaSection context={context} />
        <CruiseGoalSection context={context} />
        <ResearchTasksSection context={context} />
        <ContractsSection context={context} />
        <MembersSection context={context} />
        <PublicationsSection context={context} />
        <SPUBTasksSection context={context} />
        <CruiseDetailsSection context={context} />
        <CruiseDayDetailsSection context={context} />
        <ResearchEquipmentsSection context={context} />
        <ShipEquipmentsSection context={context} />
        <ActionsSection
          onSaveDraft={context.onSaveDraft}
          onRevertToEdit={context.onRevertToEdit}
          onPrint={handlePrint}
          disabled={context.actionsDisabled}
          context={context}
        />
      </form>
      <PrintTemplate ref={componentRef} context={context} />
    </>
  );
}
