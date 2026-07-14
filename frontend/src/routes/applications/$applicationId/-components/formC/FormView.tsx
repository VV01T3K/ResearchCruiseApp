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
import { withForm } from '@/lib/form';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';

type Props = {
  context: FormCViewModel & {
    onSubmit: () => void;
    onSaveDraft: () => void;
    actionsDisabled?: boolean;
  };
};
export const FormView = withForm({
  defaultValues: formCDefaultValues,
  props: {} as Props,
  render: function FormView({ form, context }) {
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
      <form.AppForm>
        <form className="space-y-8" onSubmit={onSubmit}>
          <CruiseInfoSection context={context} />
          <CruiseManagerInfoSection context={context} />
          <ShipUsageSection form={form} context={context} />
          <AdditionalPermissionsSection form={form} context={context} />
          <ResearchAreaSection form={form} context={context} />
          <CruiseGoalSection context={context} />
          <ResearchTasksEffectsSection form={form} context={context} />
          <ContractsSection form={form} context={context} />
          <MembersSection form={form} context={context} />
          <PublicationsSection context={context} />
          <SPUBTasksSection form={form} context={context} />
          <CruiseDetailsSection form={form} context={context} />
          <CruiseDayDetailsSection form={form} context={context} />
          <ResearchEquipmentsSection form={form} context={context} />
          <ShipEquipmentsSection form={form} context={context} />
          <CollectedSamplesSection form={form} context={context} />
          <SPUBReportDataSection form={form} context={context} />
          <AdditionalDescriptionSection form={form} context={context} />
          <ActionsSection
            onSaveDraft={context.onSaveDraft}
            onPrint={() => handlePrint(reactToPrintContent)}
            disabled={context.actionsDisabled}
            context={context}
          />
        </form>
        <PrintTemplate form={form} ref={componentRef} context={context} />
      </form.AppForm>
    );
  },
});
