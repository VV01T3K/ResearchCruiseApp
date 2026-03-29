import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { FormAActionsSection } from '@/components/applications/formA/FormAActionsSection';
import { FormAContractsSection } from '@/components/applications/formA/FormAContractsSection';
import { FormACruiseGoalSection } from '@/components/applications/formA/FormACruiseGoalSection';
import { FormACruiseLengthSection } from '@/components/applications/formA/FormACruiseLengthSection';
import { FormACruiseManagerInfoSection } from '@/components/applications/formA/FormACruiseManagerInfoSection';
import { FormAMembersSection } from '@/components/applications/formA/FormAMembersSection';
import { FormAPermissionsSection } from '@/components/applications/formA/FormAPermissionsSection';
import { FormAPrintTemplate } from '@/components/applications/formA/FormAPrintTemplate';
import { FormAPublicationsSection } from '@/components/applications/formA/FormAPublicationsSection';
import { FormAResearchAreaSection } from '@/components/applications/formA/FormAResearchAreaSection';
import { FormAResearchTasksSection } from '@/components/applications/formA/FormAResearchTasksSection';
import { FormASPUBTasksSection } from '@/components/applications/formA/FormASPUBTasksSection';
import { FormASupervisorInfoSection } from '@/components/applications/formA/FormASupervisorInfoSection';
import { FormAContextType, FormAProvider } from '@/contexts/applications/FormAContext';

type Props = {
  context: FormAContextType & {
    onSubmit: () => void;
    onSaveDraft: () => void;
    actionsDisabled?: boolean;
  };
};
export function FormA({ context }: Props) {
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
          <FormACruiseManagerInfoSection />
          <FormACruiseLengthSection />
          <FormAPermissionsSection />
          <FormAResearchAreaSection />
          <FormACruiseGoalSection />
          <FormAResearchTasksSection />
          <FormAContractsSection />
          <FormAMembersSection />
          <FormAPublicationsSection />
          <FormASPUBTasksSection />
          <FormASupervisorInfoSection />
          <FormAActionsSection
            onSaveDraft={context.onSaveDraft}
            onPrint={() => handlePrint(reactToPrintContent)}
            disabled={context.actionsDisabled}
          />
        </form>
        <FormAPrintTemplate ref={componentRef} />
      </FormAProvider>
    </>
  );
}
