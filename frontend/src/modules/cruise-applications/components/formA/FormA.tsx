import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { FormAActionsSection } from '@/cruise-applications/components/formA/FormAActionsSection';
import { FormAContractsSection } from '@/cruise-applications/components/formA/FormAContractsSection';
import { FormACruiseGoalSection } from '@/cruise-applications/components/formA/FormACruiseGoalSection';
import { FormACruiseLengthSection } from '@/cruise-applications/components/formA/FormACruiseLengthSection';
import { FormACruiseManagerInfoSection } from '@/cruise-applications/components/formA/FormACruiseManagerInfoSection';
import { FormAMembersSection } from '@/cruise-applications/components/formA/FormAMembersSection';
import { FormAPermissionsSection } from '@/cruise-applications/components/formA/FormAPermissionsSection';
import { FormAPrintTemplate } from '@/cruise-applications/components/formA/FormAPrintTemplate';
import { FormAPublicationsSection } from '@/cruise-applications/components/formA/FormAPublicationsSection';
import { FormAResearchAreaSection } from '@/cruise-applications/components/formA/FormAResearchAreaSection';
import { FormAResearchTasksSection } from '@/cruise-applications/components/formA/FormAResearchTasksSection';
import { FormASPUBTasksSection } from '@/cruise-applications/components/formA/FormASPUBTasksSection';
import { FormASupervisorInfoSection } from '@/cruise-applications/components/formA/FormASupervisorInfoSection';
import { FormAContextType, FormAProvider } from '@/cruise-applications/contexts/FormAContext';

type Props = {
  context: FormAContextType & {
    onSubmit: () => void;
    onSaveDraft: () => void;
  };
};
export function FormA({ context }: Props) {
  const componentRef = useRef(null);

  const reactToPrintContent = () => {
    return componentRef.current;
  };

  const handlePrint = useReactToPrint({});

  function onSubmit(evt: React.FormEvent<HTMLFormElement>) {
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
          <FormAActionsSection onSaveDraft={context.onSaveDraft} onPrint={() => handlePrint(reactToPrintContent)} />
        </form>
        <FormAPrintTemplate ref={componentRef} />
      </FormAProvider>
    </>
  );
}
