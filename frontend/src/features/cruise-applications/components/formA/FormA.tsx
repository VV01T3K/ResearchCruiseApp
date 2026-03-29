import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { FormAActionsSection } from '@/features/cruise-applications/components/formA/FormAActionsSection';
import { FormAContractsSection } from '@/features/cruise-applications/components/formA/FormAContractsSection';
import { FormACruiseGoalSection } from '@/features/cruise-applications/components/formA/FormACruiseGoalSection';
import { FormACruiseLengthSection } from '@/features/cruise-applications/components/formA/FormACruiseLengthSection';
import { FormACruiseManagerInfoSection } from '@/features/cruise-applications/components/formA/FormACruiseManagerInfoSection';
import { FormAMembersSection } from '@/features/cruise-applications/components/formA/FormAMembersSection';
import { FormAPermissionsSection } from '@/features/cruise-applications/components/formA/FormAPermissionsSection';
import { FormAPrintTemplate } from '@/features/cruise-applications/components/formA/FormAPrintTemplate';
import { FormAPublicationsSection } from '@/features/cruise-applications/components/formA/FormAPublicationsSection';
import { FormAResearchAreaSection } from '@/features/cruise-applications/components/formA/FormAResearchAreaSection';
import { FormAResearchTasksSection } from '@/features/cruise-applications/components/formA/FormAResearchTasksSection';
import { FormASPUBTasksSection } from '@/features/cruise-applications/components/formA/FormASPUBTasksSection';
import { FormASupervisorInfoSection } from '@/features/cruise-applications/components/formA/FormASupervisorInfoSection';
import { FormAContextType, FormAProvider } from '@/features/cruise-applications/contexts/FormAContext';

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
