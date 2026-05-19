import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ActionsSection } from '@/routes/_authed/applications/$applicationId/-components/formA/ActionsSection';
import { ContractsSection } from '@/routes/_authed/applications/$applicationId/-components/formA/ContractsSection';
import { CruiseGoalSection } from '@/routes/_authed/applications/$applicationId/-components/formA/CruiseGoalSection';
import { CruiseLengthSection } from '@/routes/_authed/applications/$applicationId/-components/formA/CruiseLengthSection';
import { CruiseManagerInfoSection } from '@/routes/_authed/applications/$applicationId/-components/formA/CruiseManagerInfoSection';
import { MembersSection } from '@/routes/_authed/applications/$applicationId/-components/formA/MembersSection';
import { PermissionsSection } from '@/routes/_authed/applications/$applicationId/-components/formA/PermissionsSection';
import { PrintTemplate } from '@/routes/_authed/applications/$applicationId/-components/formA/PrintTemplate';
import { PublicationsSection } from '@/routes/_authed/applications/$applicationId/-components/formA/PublicationsSection';
import { ResearchAreaSection } from '@/routes/_authed/applications/$applicationId/-components/formA/ResearchAreaSection';
import { ResearchTasksSection } from '@/routes/_authed/applications/$applicationId/-components/formA/ResearchTasksSection';
import { SPUBTasksSection } from '@/routes/_authed/applications/$applicationId/-components/formA/SPUBTasksSection';
import { SupervisorInfoSection } from '@/routes/_authed/applications/$applicationId/-components/formA/SupervisorInfoSection';
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
