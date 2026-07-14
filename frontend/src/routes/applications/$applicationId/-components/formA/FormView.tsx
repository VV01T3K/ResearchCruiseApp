import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ActionsSection } from '@/routes/applications/$applicationId/-components/formA/ActionsSection';
import { ContractsSection } from '@/routes/applications/$applicationId/-components/formA/ContractsSection';
import { CruiseGoalSection } from '@/routes/applications/$applicationId/-components/formA/CruiseGoalSection';
import { CruiseLengthSection } from '@/routes/applications/$applicationId/-components/formA/CruiseLengthSection';
import { CruiseManagerInfoSection } from '@/routes/applications/$applicationId/-components/formA/CruiseManagerInfoSection';
import { MembersSection } from '@/routes/applications/$applicationId/-components/formA/MembersSection';
import { PermissionsSection } from '@/routes/applications/$applicationId/-components/formA/PermissionsSection';
import { PrintTemplate } from '@/routes/applications/$applicationId/-components/formA/PrintTemplate';
import { PublicationsSection } from '@/routes/applications/$applicationId/-components/formA/PublicationsSection';
import { ResearchAreaSection } from '@/routes/applications/$applicationId/-components/formA/ResearchAreaSection';
import { ResearchTasksSection } from '@/routes/applications/$applicationId/-components/formA/ResearchTasksSection';
import { SPUBTasksSection } from '@/routes/applications/$applicationId/-components/formA/SPUBTasksSection';
import { SupervisorInfoSection } from '@/routes/applications/$applicationId/-components/formA/SupervisorInfoSection';
import { withForm } from '@/lib/form';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';

type Props = {
  context: FormAViewModel & {
    onSubmit: () => void;
    onSaveDraft: () => void;
    actionsDisabled?: boolean;
  };
};
export const FormView = withForm({
  defaultValues: formADefaultValues,
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
          <CruiseManagerInfoSection form={form} context={context} />
          <CruiseLengthSection form={form} context={context} />
          <PermissionsSection form={form} context={context} />
          <ResearchAreaSection form={form} context={context} />
          <CruiseGoalSection form={form} context={context} />
          <ResearchTasksSection form={form} context={context} />
          <ContractsSection form={form} context={context} />
          <MembersSection form={form} context={context} />
          <PublicationsSection form={form} context={context} />
          <SPUBTasksSection form={form} context={context} />
          <SupervisorInfoSection form={form} context={context} />
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
