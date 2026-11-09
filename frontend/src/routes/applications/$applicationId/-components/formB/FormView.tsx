import { submitApplicationForm } from '@/integrations/tanstack/form/submitApplicationForm';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ActionsSection } from '@/features/applications/components/form-bc/ActionsSection';
import { AdditionalPermissionsSection } from '@/features/applications/components/form-bc/AdditionalPermissionsSection';
import { CruiseGoalSection } from '@/features/applications/components/form-bc/CruiseGoalSection';
import { CruiseInfoSection } from '@/features/applications/components/form-bc/CruiseInfoSection';
import { PublicationsSection } from '@/features/applications/components/form-bc/PublicationsSection';
import { ResearchEquipmentsSection } from '@/features/applications/components/form-bc/ResearchEquipmentsSection';
import { ShipEquipmentsSection } from '@/features/applications/components/form-bc/ShipEquipmentsSection';
import { ContractsSection } from './ContractsSection';
import { CruiseDayDetailsSection } from './CruiseDayDetailsSection';
import { CruiseDetailsSection } from './CruiseDetailsSection';
import { CruiseManagerInfoSection } from './CruiseManagerInfoSection';
import { MembersSection } from './MembersSection';
import { PrintTemplate } from './PrintTemplate';
import { ResearchAreaSection } from './ResearchAreaSection';
import { ResearchTasksSection } from './ResearchTasksSection';
import { ShipUsageSection } from './ShipUsageSection';
import { SPUBTasksSection } from './SPUBTasksSection';
import { useFormBContext, type FormBViewModel } from '@/features/applications/models/formB-view-model';

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
          event.stopPropagation();
          void submitApplicationForm(form, false);
        }}
      >
        <CruiseInfoSection context={context} />
        <CruiseManagerInfoSection context={context} />
        <ShipUsageSection context={context} />
        <AdditionalPermissionsSection
          form={form}
          fields={{ permissions: 'permissions' }}
          title="4. Dodatkowe pozwolenia do planowanych podczas rejsu badań"
          context={context}
        />
        <ResearchAreaSection context={context} />
        <CruiseGoalSection context={context} />
        <ResearchTasksSection context={context} />
        <ContractsSection context={context} />
        <MembersSection context={context} />
        <PublicationsSection context={context} />
        <SPUBTasksSection context={context} />
        <CruiseDetailsSection context={context} />
        <CruiseDayDetailsSection context={context} />
        <ResearchEquipmentsSection
          form={form}
          fields={{ researchEquipments: 'researchEquipments' }}
          title="14. Lista sprzętu i aparatury badawczej planowanej do użycia podczas rejsu"
          context={context}
        />
        <ShipEquipmentsSection form={form} fields={{ shipEquipmentsIds: 'shipEquipmentsIds' }} context={context} />
        <form.FormErrors />
        <ActionsSection
          onSaveDraft={context.onSaveDraft}
          onRevertToEdit={context.onRevertToEdit}
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
