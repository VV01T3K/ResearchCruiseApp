import { submitApplicationForm } from '@/integrations/tanstack/form/submitApplicationForm';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ActionsSection } from '@/features/applications/components/form-bc/ActionsSection';
import { CruiseGoalSection } from '@/features/applications/components/form-bc/CruiseGoalSection';
import { CruiseInfoSection } from '@/features/applications/components/form-bc/CruiseInfoSection';
import { PublicationsSection } from '@/features/applications/components/form-bc/PublicationsSection';
import { AdditionalDescriptionSection } from './AdditionalDescriptionSection';
import { AdditionalPermissionsSection } from './AdditionalPermissionsSection';
import { CollectedSamplesSection } from './CollectedSamplesSection';
import { ContractsSection } from './ContractsSection';
import { CruiseDayDetailsSection } from './CruiseDayDetailsSection';
import { CruiseDetailsSection } from './CruiseDetailsSection';
import { CruiseManagerInfoSection } from './CruiseManagerInfoSection';
import { MembersSection } from './MembersSection';
import { PrintTemplate } from './PrintTemplate';
import { ResearchAreaSection } from './ResearchAreaSection';
import { ResearchEquipmentsSection } from './ResearchEquipmentsSection';
import { ResearchTasksEffectsSection } from './ResearchTasksEffectsSection';
import { ShipEquipmentsSection } from './ShipEquipmentsSection';
import { ShipUsageSection } from './ShipUsageSection';
import { SPUBReportDataSection } from './SPUBReportDataSection';
import { SPUBTasksSection } from './SPUBTasksSection';
import { useFormCContext, type FormCViewModel } from '@/features/applications/models/formC-view-model';

type Props = {
  context: FormCViewModel & {
    onSaveDraft: () => void;
    actionsDisabled?: boolean;
  };
};
export function FormView({ context }: Props) {
  const form = useFormCContext();
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({ contentRef: componentRef });

  return (
    <>
      <form
        className="space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void submitApplicationForm(form, false);
        }}
      >
        <CruiseInfoSection context={context} />
        <CruiseManagerInfoSection context={context} />
        <ShipUsageSection context={context} />
        <AdditionalPermissionsSection context={context} />
        <ResearchAreaSection context={context} />
        <CruiseGoalSection context={context} />
        <ResearchTasksEffectsSection context={context} />
        <ContractsSection context={context} />
        <MembersSection context={context} />
        <PublicationsSection context={context} />
        <SPUBTasksSection context={context} />
        <CruiseDetailsSection context={context} />
        <CruiseDayDetailsSection context={context} />
        <ResearchEquipmentsSection context={context} />
        <ShipEquipmentsSection context={context} />
        <CollectedSamplesSection context={context} />
        <SPUBReportDataSection context={context} />
        <AdditionalDescriptionSection context={context} />
        <form.FormErrors />
        <ActionsSection
          onSaveDraft={context.onSaveDraft}
          onPrint={handlePrint}
          disabled={context.actionsDisabled}
          context={context}
        />
      </form>
      <form.Subscribe selector={(state) => state.values}>
        {(values) => <PrintTemplate ref={componentRef} context={context} values={values} />}
      </form.Subscribe>
    </>
  );
}
