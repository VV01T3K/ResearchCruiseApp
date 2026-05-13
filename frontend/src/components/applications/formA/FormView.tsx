import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ActionsSection } from '@/components/applications/formA/ActionsSection';
import { ContractsSection } from '@/components/applications/formA/ContractsSection';
import { CruiseGoalSection } from '@/components/applications/formA/CruiseGoalSection';
import { CruiseLengthSection } from '@/components/applications/formA/CruiseLengthSection';
import { CruiseManagerInfoSection } from '@/components/applications/formA/CruiseManagerInfoSection';
import { MembersSection } from '@/components/applications/formA/MembersSection';
import { PermissionsSection } from '@/components/applications/formA/PermissionsSection';
import { PrintTemplate } from '@/components/applications/formA/PrintTemplate';
import { PublicationsSection } from '@/components/applications/formA/PublicationsSection';
import { ResearchAreaSection } from '@/components/applications/formA/ResearchAreaSection';
import { ResearchTasksSection } from '@/components/applications/formA/ResearchTasksSection';
import { SPUBTasksSection } from '@/components/applications/formA/SPUBTasksSection';
import { SupervisorInfoSection } from '@/components/applications/formA/SupervisorInfoSection';
import { FormAContextType, FormAProvider } from '@/contexts/applications/FormAContext';

type Props = {
  context: FormAContextType & {
    onSubmit: () => void;
    onSaveDraft: () => void;
    actionsDisabled?: boolean;
  };
};
export function FormView({ context }: Props) {
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
      <FormAProvider value={context}>
        <form className="space-y-8" onSubmit={onSubmit}>
          <CruiseManagerInfoSection />
          <CruiseLengthSection />
          <PermissionsSection />
          <ResearchAreaSection />
          <CruiseGoalSection />
          <ResearchTasksSection />
          <ContractsSection />
          <MembersSection />
          <PublicationsSection />
          <SPUBTasksSection />
          <SupervisorInfoSection />
          <ActionsSection
            onSaveDraft={context.onSaveDraft}
            onPrint={() => handlePrint(reactToPrintContent)}
            disabled={context.actionsDisabled}
          />
        </form>
        <PrintTemplate ref={componentRef} />
      </FormAProvider>
    </>
  );
}
