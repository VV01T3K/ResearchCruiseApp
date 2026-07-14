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
import { withForm } from '@/lib/form';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';

type Props = {
  context: FormBViewModel & {
    onSubmit: () => void;
    onSaveDraft: () => void;
    onRevertToEdit?: () => void;
    actionsDisabled?: boolean;
  };
};
export const FormView = withForm({
  defaultValues: formBDefaultValues,
  props: {} as Props,
  render: function FormView({ form, context }) {
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
      <form.AppForm>
        <form className="space-y-8" onSubmit={onSubmit}>
          <CruiseInfoSection context={context} />
          <CruiseManagerInfoSection form={form} context={context} />
          <ShipUsageSection context={context} />
          <AdditionalPermissionsSection form={form} context={context} />
          <ResearchAreaSection context={context} />
          <CruiseGoalSection context={context} />
          <ResearchTasksSection context={context} />
          <ContractsSection context={context} />
          <MembersSection form={form} context={context} />
          <PublicationsSection context={context} />
          <SPUBTasksSection context={context} />
          <CruiseDetailsSection form={form} context={context} />
          <CruiseDayDetailsSection form={form} context={context} />
          <ResearchEquipmentsSection form={form} context={context} />
          <ShipEquipmentsSection form={form} context={context} />
          <ActionsSection
            onSaveDraft={context.onSaveDraft}
            onRevertToEdit={context.onRevertToEdit}
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
